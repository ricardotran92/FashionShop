import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Stripe from "stripe";
import Order from "../models/order.js";
import moment from "moment"; // npm install moment
console.log(process.env.STRIPE_SECRET_KEY);
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const FRONTEND_URL =
  process.env.NODE_ENV === "DEVELOPMENT"
    ? `${process.env.FRONTEND_PUB_URL}`
    : `${process.env.FRONTEND_PROD_URL}`;
const BACKEND_URL =
  process.env.NODE_ENV === "DEVELOPMENT"
    ? `${process.env.BACKEND_PUB_URL}`
    : `${process.env.BACKEND_PROD_URL}`;

// Tạo payment mới trên cổng thanh toán của stripe
export const newStripePayment = catchAsyncErrors(async (req, res, next) => {
  const body = req?.body;
  //console.log(body);

  const line_items = body?.orderItems?.map((item) => {
    return {
      price_data: {
        currency: "vnd",
        product_data: {
          name:
            item?.name +
            " - " +
            item?.selectedVariant?.color +
            " - " +
            item?.selectedVariant?.size,
          images: [item?.image],
          metadata: {
            name: item?.name,
            quantity: item?.quantity,
            image: item?.image,
            price: item?.price,
            product: item?.product,
            selectedColor: item?.selectedVariant?.color,
            selectedSize: item?.selectedVariant?.size,
            selectedStock: item?.selectedVariant?.stock,
            selectedVariantID: item?.selectedVariant?.variantID,
          },
        },
        unit_amount: item?.price,
      },
      tax_rates: ["txr_1PYPy5DJwhIyD25muaiVLYyz"],
      quantity: item?.quantity,
    };
  });

  const transID =
    moment().format("YYMMDDHHMMSS") +
    (body.user ? body.user : 113114115) +
    "ST";
  // console.log(body)
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `${FRONTEND_URL}/me/orders?order_success=true`,
    // cancel_url: `${process.env.FRONEND_PUB_URL}/cart`,
    cancel_url: `${FRONTEND_URL}/me/orders?order_success=false`,
    client_reference_id: transID,
    mode: "payment",
    metadata: {
      orderID: transID,
      address: body?.shippingInfo?.address,
      province: body?.shippingInfo?.shippingProvince,
      city: body?.shippingInfo?.shippingCity,
      ward: body?.shippingInfo?.shippingWard,
      vender: body?.shippingInfo?.shippingVender,
      phoneNo: body?.shippingInfo?.phoneNo,
      user: body?.user,
      itemsPrice: body?.itemsPrice,
      shippingAmount: body?.shippingAmount,
      totalAmount: body?.totalAmount,
      paymentMethod: body?.paymentMethod,
      paymentStatus: body?.paymentInfo?.status,
    },
    shipping_options: [
      {
        shipping_rate:
          body?.itemsPrice >= 10000000
            ? "shr_1PYTaYDJwhIyD25mFIwLjeUf"
            : "shr_1PYTb9DJwhIyD25mn7MGnrMS",
      },
    ],
    line_items,
  });

  console.log("=========================================");
  console.log("Day la check out session:\n", session);
  console.log("=========================================");

  res.status(200).json({
    url: session.url,
  });
});

const getOrderItems = async (line_items) => {
  return new Promise((resolve, reject) => {
    let cartItems = [];

    line_items?.data?.forEach(async (item) => {
      const product = await stripe.products.retrieve(item.price.product);
      const productMetadata = product.metadata;

      cartItems.push({
        name: productMetadata.name,
        product: productMetadata.product,
        quantity: productMetadata.quantity,
        image: productMetadata.image,
        price: productMetadata.price,
        selectedVariant: {
          color: productMetadata.selectedColor,
          size: productMetadata.selectedSize,
          stock: productMetadata.selectedStock,
          variantID: productMetadata.selectedVariantID,
        },
      });
      if (cartItems.length === line_items?.data?.length) {
        resolve(cartItems);
      }
    });
  });
};

// Stripe callback để hệ thống tạo đơn hàng mới trên database sau khi nhận được xác nhận giao dịch thành công từ stripe
export const newOrderWithStripe = catchAsyncErrors(async (req, res, next) => {
  //console.log("Day la req body: ", req.body);

  try {
    const signature = req.headers["stripe-signature"];

    const event = stripe.webhooks.constructEvent(
      req.rawBody || req.body,
      signature,
      process.env.STRIPE_WH_SECRET_KEY
    );

    //if(event.type === 'checkout.session.async_payment_succeeded'){
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const line_items = await stripe.checkout.sessions.listLineItems(
        session.id
      );
      const ordersItemsData = await getOrderItems(line_items);

      const order = await Order.create({
        orderItems: ordersItemsData,
        shippingInfo: {
          orderID: session.metadata.orderID,
          address: session.metadata.address,
          phoneNo: session.metadata.phoneNo,
          shippingProvince: session.metadata.province,
          shippingCity: session.metadata.city,
          shippingWard: session.metadata.ward,
          shippingVender: session.metadata.vender,
        },
        itemsPrice: session.metadata.itemsPrice,
        shippingAmount: session.metadata.shippingAmount,
        totalAmount: session.metadata.totalAmount,
        paymentMethod: session.metadata.paymentMethod,
        paymentInfo: {
          status: "Đã thanh toán",
        },
        user: session.metadata.user,
      });

      // Invalidate cache for myOrders and allOrders
      await redisClient.del(`myOrders:${session.metadata.user}`);
      await redisClient.del("allOrders");
      console.log(order);

      console.log("1=========================================");
      console.log("Day la callback session: " + "session => ", session);
      console.log("2=========================================");

      res.status(200).json({ success: true });
    }
  } catch (error) {
    console.log("3=========================================");
    console.log("error => ", error);
    console.log("4=========================================");
  }
});
