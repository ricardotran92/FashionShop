import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Product from "../models/product.js";
import Order from "../models/order.js";
import ErrorHandler from "../utils/errorHandler.js";
import redisClient from '../utils/redisClient.js'; // Import Redis client

const CACHE_EXPIRATION = 3600; // Cache expiration time in seconds

// Tạo đơn hàng mới  =>  /api/orders/new
export const newOrder = catchAsyncErrors(async (req, res, next) => {
  // Trích xuất thông tin đơn hàng từ yêu cầu
  const {
    orderItems,
    shippingInfo,
    itemsPrice,
    shippingAmount,
    totalAmount,
    paymentMethod,
    paymentInfo,
  } = req.body;

  // Tạo đơn hàng mới trong cơ sở dữ liệu
  const order = await Order.create({
    orderItems,
    shippingInfo,
    itemsPrice,
    shippingAmount,
    totalAmount,
    paymentMethod,
    paymentInfo,
    user: req.user._id, // Gán ID của người dùng hiện tại cho đơn hàng
  });

  // Invalidate cache for myOrders and allOrders
  await redisClient.del(`myOrders:${req.user._id}`);
  await redisClient.del('allOrders');

  // Trả về thông tin đơn hàng đã tạo với mã trạng thái 200
  res.status(200).json({
    order,
  });
});

// Lấy các đơn hàng của người dùng hiện tại  =>  /api/me/orders
export const myOrders = catchAsyncErrors(async (req, res, next) => {
  // Không dùng cache tại truy vấn này vì lý do call back của các online payment -> đã resolve ở các online payment
  const cacheKey = `myOrders:${req.user._id}`;
  const cachedOrders = await redisClient.get(cacheKey);

  if (cachedOrders) {
    return res.status(200).json(JSON.parse(cachedOrders));
  }

  // Tìm các đơn hàng của người dùng hiện tại trong cơ sở dữ liệu
  const orders = await Order.find({ user: req.user._id });
  let ordersCount = orders.length;

  await redisClient.set(cacheKey, JSON.stringify({ ordersCount, orders }), 'EX', CACHE_EXPIRATION);

  // Trả về danh sách các đơn hàng với mã trạng thái 200
  res.status(200).json({
    ordersCount,
    orders,
  });
});

// Lấy chi tiết của một đơn hàng  =>  /api/orders/:id
export const getOrderDetails = catchAsyncErrors(async (req, res, next) => {
  const cacheKey = `orderDetails:${req.params.id}`;
  const cachedOrder = await redisClient.get(cacheKey);

  if (cachedOrder) {
    return res.status(200).json(JSON.parse(cachedOrder));
  }

  // Tìm đơn hàng trong cơ sở dữ liệu bằng ID và lấy thông tin của người dùng liên quan
  const order = await Order.findById(req.params.id).populate("user", "name email");

  // Kiểm tra xem đơn hàng có tồn tại không
  if (!order) {
    return next(new ErrorHandler("Không tìm thấy đơn hàng với ID này", 404));
  }

  await redisClient.set(cacheKey, JSON.stringify({ order }), 'EX', CACHE_EXPIRATION);

  // Trả về thông tin chi tiết của đơn hàng với mã trạng thái 200
  res.status(200).json({
    order,
  });
});

// Lấy tất cả các đơn hàng - ADMIN  =>  /api/admin/orders
export const allOrders = catchAsyncErrors(async (req, res, next) => {
  // Không dùng cache tại truy vấn này vì lý do call back của các online payment -> đã resolve ở các online payment
  const cacheKey = 'allOrders';
  const cachedOrders = await redisClient.get(cacheKey);

  if (cachedOrders) {
    return res.status(200).json(JSON.parse(cachedOrders));
  }

  // Tìm tất cả các đơn hàng trong cơ sở dữ liệu
  const orders = await Order.find();
  let ordersCount = orders.length;

  await redisClient.set(cacheKey, JSON.stringify({ ordersCount, orders }), 'EX', CACHE_EXPIRATION);

  // Trả về danh sách các đơn hàng với mã trạng thái 200
  res.status(200).json({
    ordersCount,
    orders,
  });
});

// Cập nhật trạng thái của đơn hàng - ADMIN  =>  /api/admin/orders/:id
export const updateOrder = catchAsyncErrors(async (req, res, next) => {
  // Tìm đơn hàng trong cơ sở dữ liệu bằng ID
  const order = await Order.findById(req.params.id);

  // Kiểm tra xem đơn hàng có tồn tại không
  if (!order) {
    return next(new ErrorHandler("Không tìm thấy đơn hàng với ID này", 404));
  }

  // Trùng trạng thái thì không làm gì
  if (order?.orderStatus === req.body.status) {
    return next(new ErrorHandler("Cần chọn trạng thái mới để sửa", 400));
  }

  // Đơn hàng đang shipped thì không được chuyển về processing
  if (order?.orderStatus === "Shipped" && req.body.status === "Processing") {
    return next(new ErrorHandler("Đơn hàng đang được giao", 400));
  }

  // Kiểm tra xem đơn hàng đã được giao hàng chưa
  if (order?.orderStatus === "Delivered") {
    return next(new ErrorHandler("Đơn hàng đã được giao", 400));
  }

  // Cập nhật số lượng hàng tồn kho của các sản phẩm liên quan
  if (req.body.status === "Delivered") {
    order?.orderItems?.forEach(async (item) => {
      const product = await Product.findById(item?.product?.toString());
      if (!product) {
        return next(new ErrorHandler("Không tìm thấy sản phẩm với ID này", 404));
      }

      const variant = product.variants.find(
        (variant) => variant._id.toString() === item.selectedVariant.variantID
      );

      if (variant) {
        variant.stock -= item.quantity;
        variant.sellQty += item.quantity; // Cập nhật số lượng đã bán của variant
        product.sellQty += item.quantity; // Cập nhật tổng số lượng đã bán của sản phẩm
      }

      await product.save({ validateBeforeSave: false });
    });

    if (order.paymentMethod === "COD") {
      order.paymentInfo = { status: "Đã thanh toán" };
    }
  }

  order.orderStatus = req.body.status;
  order.deliveredAt = Date.now();

  await order.save();

  // Invalidate cache for order details and allOrders
  await redisClient.del(`orderDetails:${req.params.id}`);
  await redisClient.del('allOrders');
  await redisClient.del(`myOrders:${req.user._id}`);

  res.status(200).json({
    success: true,
    order,
  });
});

// Xóa đơn hàng  =>  /api/admin/orders/:id
export const deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Không tìm thấy đơn hàng với ID này", 404));
  }

  await order.deleteOne();

  // Invalidate cache for order details and allOrders
  await redisClient.del(`orderDetails:${req.params.id}`);
  await redisClient.del('allOrders');
  await redisClient.del(`myOrders:${req.user._id}`);

  res.status(200).json({
    success: true,
  });
});


//-------------------------------

async function getSalesData(startDate, endDate) {
  const salesData = await Order.aggregate([
    {
      // Stage 1 - Filter results
      $match: {
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      // Stage 2 - Group data
      $group: {
        _id: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        },
        totalSales: { $sum: "$totalAmount" },
        numOrders: { $sum: 1 } // Count số lượng orders
      },
    }
  ]) // https://www.mongodb.com/docs/manual/aggregation/

  // console.log("====================================");
  // console.log("Print -> terminal -> Order data:\n", salesData);
  // console.log("====================================");

  // Tạo 1 Map để chứa dữ liệu sales và số lượng order
  const salesMap = new Map();
  let totalSales = 0;
  let totalNumOrders = 0;

  salesData.forEach((entry) => {
    const date = entry?._id.date;
    const sales = entry?.totalSales;
    const numOrders = entry?.numOrders;

    salesMap.set(date, { sales, numOrders });
    totalSales += sales;
    totalNumOrders += numOrders;
  });

  // Tạo 1 mảng ngày trong khoảng thời gian startDate và endDate
  const datesBetween = getDatesBetween(startDate, endDate);
  // console.log("Print -> Terminal -> array[startDate, endDate]:\n", datesBetween);

  // Tạo mảng dữ liệu sales với 0 nếu không có dữ liệu
  const finalSalesData = datesBetween.map((date) => ({
    date,
    sales: (salesMap.get(date) || { sales: 0 }).sales,
    numOrders: (salesMap.get(date) || { numOrders: 0 }).numOrders,
  }));

  // console.log("====================================");
  // console.log("Print -> terminal -> Final Sales Data:\n", finalSalesData);
  // console.log("====================================");
  return { salesData: finalSalesData, totalSales, totalNumOrders };
}

function getDatesBetween(startDate, endDate) {
  const dates = [];
  let currentDate = new Date(startDate);

  while(currentDate <= new Date(endDate)) {
    const formattedDate = currentDate.toISOString().split("T")[0]; // 2024-04-10T10:40:57.000Z -> Lấy ngày tháng năm (không lấy giờ phút giây)
    dates.push(formattedDate);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

// Get số Sales  =>  /api/admin/get_sales
export const getSales = catchAsyncErrors(async (req, res, next) => {
  const startDate = new Date(req.query.startDate);
  const endDate = new Date(req.query.endDate);

  startDate.setUTCHours(0,0,0,0); // giờ UTC, 0h:0m:0s:0ms
  endDate.setUTCHours(23,59,59,999); // giờ UTC, 23h:59m:59s:999ms

  const { salesData, totalSales, totalNumOrders } = await getSalesData(startDate, endDate);

  // Trả về thành công với mã trạng thái 200
  res.status(200).json({
    // success: true,
    totalSales,
    totalNumOrders,
    sales: salesData,
  });
});