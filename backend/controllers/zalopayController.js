import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Order from "../models/order.js";
import axios from "axios"; // npm install axios
import CryptoJS from "crypto-js"; // npm install crypto-js
import moment from "moment"; // npm install moment
import redisClient from '../utils/redisClient.js'; // Import Redis client
console.log(process.env.ZALOPAY_APP_ID);

const FRONTEND_URL =
  process.env.NODE_ENV === "DEVELOPMENT"
    ? `${process.env.FRONTEND_PUB_URL}`
    : `${process.env.FRONTEND_PROD_URL}`;
const BACKEND_URL =
  process.env.NODE_ENV === "DEVELOPMENT"
    ? `${process.env.BACKEND_PUB_URL}`
    : `${process.env.BACKEND_PROD_URL}`;
//ZALO PAY APP INFO
const config = {
  app_id: process.env.ZALOPAY_APP_ID,
  key1: process.env.ZALOPAY_KEY1,
  key2: process.env.ZALOPAY_KEY2,
  endpoint: process.env.ZALOPAY_ENDPOINT,
  callback: `${BACKEND_URL}/api/zalopay/callback/`,
};

// Tạo payment mới trên cổng thanh toán của zalo pay
export const newZaloPayPayment = catchAsyncErrors(async (req, res, next) => {
  const embed_data = {
    redirecturl: `${FRONTEND_URL}/me/orders`,
  };
  // console.log("day la req",req.body)
  const transID =
    moment().format("YYMMDDHHMMSS") +
    (req.body.user ? req.body.user : 113114115) +
    "ZP";

  const items = [
    {
      orderItems: req.body.orderItems,
      shippingInfo: {
        orderID: transID,
        address: req.body.shippingInfo.address,
        phoneNo: req.body.shippingInfo.phoneNo,
        shippingProvince: req.body?.shippingInfo?.shippingProvince,
        shippingCity: req.body?.shippingInfo?.shippingCity,
        shippingWard: req.body?.shippingInfo?.shippingWard,
        shippingVender: req.body?.shippingInfo?.shippingVender,
      },
      itemsPrice: req.body.itemsPrice,
      shippingAmount: req.body.shippingAmount,
      totalAmount: req.body.totalAmount,
      paymentMethod: req.body.paymentMethod,
      paymentInfo: req.body.paymentInfo,
      user: req.body.user,
    },
  ];

  // console.log("day la item",items);

  const order = {
    app_id: config.app_id,
    app_trans_id: transID,
    app_user: items[0].user + " - FakeshionShop",
    app_time: Date.now(), // miliseconds
    item: JSON.stringify(items),
    embed_data: JSON.stringify(embed_data),
    amount: items[0].totalAmount,
    description: `FakeshionShop - Thanh toán cho đơn hàng #${transID}`,
    bank_code: "",
    callback_url: config.callback,
  };

  console.log(order);

  // appid|app_trans_id|appuser|amount|apptime|embeddata|item
  const data =
    config.app_id +
    "|" +
    order.app_trans_id +
    "|" +
    order.app_user +
    "|" +
    order.amount +
    "|" +
    order.app_time +
    "|" +
    order.embed_data +
    "|" +
    order.item;
  order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

  try {
    const result = await axios.post(config.endpoint, null, { params: order });
    console.log(result.data);
    return res.status(200).json(result.data);
  } catch (error) {
    console.log(error.message);
  }
});

// Zalopay callback để hệ thống tạo đơn hàng mới trên database sau khi nhận được xác nhận giao dịch thành công từ zalo pay
export const newOrderWithZaloPay = catchAsyncErrors(async (req, res, next) => {
  let result = {};

  try {
    let dataStr = req.body.data;
    let reqMac = req.body.mac;

    let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
    console.log("mac =", mac);

    // kiểm tra callback hợp lệ (đến từ ZaloPay server)
    if (reqMac !== mac) {
      // callback không hợp lệ
      result.return_code = -1;
      result.return_message = "mac not equal";
    } else {
      try {
        const parsedData = JSON.parse(req.body.data);
        const items = JSON.parse(parsedData.item)[0];

        const order = await Order.create({
          orderItems: items.orderItems,
          shippingInfo: items.shippingInfo,
          itemsPrice: items.itemsPrice,
          shippingAmount: items.shippingAmount,
          totalAmount: items.totalAmount,
          paymentMethod: items.paymentMethod,
          paymentInfo: {
            status: "Đã thanh toán",
          },
          user: items.user,
        });

        console.log(order);

        // Invalidate cache for myOrders and allOrders
        await redisClient.del(`myOrders:${items.user}`);
        await redisClient.del("allOrders");
      } catch (error) {
        console.error("Error parsing JSON data:", error);
      }

      // thanh toán thành công
      // merchant cập nhật trạng thái cho đơn hàng
      let dataJson = JSON.parse(dataStr, config.key2);
      console.log(
        "update order's status = success where app_trans_id =",
        dataJson["app_trans_id"]
      );

      result.return_code = 1;
      result.return_message = "success";
    }
  } catch (ex) {
    result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
    result.return_message = ex.message;
  }

  // thông báo kết quả cho ZaloPay server
  res.json(result);
});
