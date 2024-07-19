import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import { createHmac } from "crypto";
import axios from "axios"; // npm install axios
import moment from "moment"; // npm install moment

//MOMO APP INFO
const config = {
  accessKey: process.env.MOMO_ACCESS_KEY,
  secretKey: process.env.MOMO_SECRET_KEY,
  partnerCode: "MOMO",
  partnerName: "FakashionShop",
  storeId: "MomoTestStore",
  endpoint: process.env.MOMO_ENDPOINT,
  redirectUrl: process.env.NODE_ENV === 'DEVELOPMENT' ? `${process.env.FRONTEND_PUB_URL}/me/orders` : `${process.env.FRONTEND_PROD_URL}/me/orders`,
  ipnUrl: process.env.NODE_ENV === 'DEVELOPMENT' ? `${process.env.BACKEND_PUB_URL}/api/momo/callback/` : `${process.env.BACKEND_PROD_URL}/api/momo/callback/`,
  requestType: "payWithMethod",
  autoCapture: true,
  lang: "vi",
};

// Tạo payment mới trên cổng thanh toán của momo
export const newMoMoPayment = catchAsyncErrors(async (req, res, next) => {
  const transID =
    moment().format("YYMMDDHHMMSS") +
    (req.body.user ? req.body.user : 113114115) +
    "MM";

  const orderInfo = `FakeshionShop - Thanh toán cho đơn hàng #${transID}`;

  const DataRaw = {
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
  };
  //console.log("DataRaw", DataRaw);

  const items = DataRaw.orderItems.map((od) => {
    return {
      id: od?.product,
      name: od?.name,
      imageUr: od?.image,
      price: od?.price,
      currency: "VND",
      quantity: od?.quantity,
      totalPrice: od?.price * od?.quantity,
      category: od?.selectedVariant?.variantID,
    };
  });
  //console.log("items", items);

  const userInfo = {
    name: DataRaw?.shippingInfo?.orderID,
    phoneNumber: DataRaw.shippingInfo.phoneNo,
    email: [
      DataRaw.shippingInfo.address,
      DataRaw.shippingInfo.shippingWard,
      DataRaw.shippingInfo.shippingCity,
      DataRaw.shippingInfo.shippingProvince,
    ]
      .filter(Boolean)
      .join(", "),
  };
  // console.log("userInfo", userInfo);

  const extraDataRaw = {
    itemsPrice: DataRaw.itemsPrice,
    shippingAmount: DataRaw.shippingAmount,
    totalAmount: DataRaw.totalAmount,
    paymentMethod: DataRaw.paymentMethod,
    paymentStatus: DataRaw.paymentInfo.status,
    user: DataRaw.user,
  };
  //console.log("extraDataRaw", extraDataRaw);

  //const extraData = ""; //đưa thông tin đơn hàng vào đây dưới dạng key-value đã được encode base64
  //encode base64 for json: {key: value}
  const json_data = JSON.stringify(extraDataRaw);
  //console.log("json_data", json_data);
  const buffer = new TextEncoder().encode(json_data);
  const extraData = btoa(String.fromCharCode(...buffer));
  //console.log("extraData", extraData);

  const rawSignature =
    "accessKey=" +
    config.accessKey +
    "&amount=" +
    req.body.totalAmount +
    "&extraData=" +
    extraData +
    "&ipnUrl=" +
    config.ipnUrl +
    "&orderId=" +
    transID +
    "&orderInfo=" +
    orderInfo +
    "&partnerCode=" +
    config.partnerCode +
    "&redirectUrl=" +
    config.redirectUrl +
    "&requestId=" +
    transID +
    "&requestType=" +
    config.requestType;

  //puts raw signature
  // console.log("--------------------RAW SIGNATURE----------------");
  // console.log(rawSignature);

  //signature
  const signature = createHmac("sha256", config.secretKey)
    .update(rawSignature)
    .digest("hex");
  // console.log("--------------------SIGNATURE----------------");
  // console.log(signature);

  //json object send to MoMo endpoint
  const requestBody = JSON.stringify({
    partnerCode: config.partnerCode,
    partnerName: config.partnerName,
    storeId: config.storeId,
    requestId: transID,
    amount: req.body.totalAmount,
    orderId: transID,
    orderInfo: orderInfo,
    redirectUrl: config.redirectUrl,
    ipnUrl: config.ipnUrl,
    lang: config.lang,
    requestType: config.requestType,
    autoCapture: config.autoCapture,
    items: items,
    userInfo: userInfo,
    extraData: extraData,
    signature: signature,
  });
  //console.log("requestBody", requestBody);

  const options = {
    method: "post",
    url: config.endpoint,
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(requestBody),
    },
    data: requestBody,
  };

  try {
    const result = await axios(options);
    console.log(result.data);
    return res.status(200).json(result.data);
  } catch (error) {
    console.log(error.message);
    //console.log(res);
  }
});

// Momo callback để hệ thống tạo đơn hàng mới trên database sau khi nhận được xác nhận giao dịch thành công từ momo
export const newOrderWithMoMo = catchAsyncErrors(async (req, res, next) => {
  let result = {};

  //trong req.body sẽ có chứa:
  const {
    orderID, //sử dụng cho order
    items, //sử dụng cho order.orderItems
    userInfo, //sử dụng cho order.shippingInfo
    extraData, //sử dụng cho order
    message, //thành công: sử dụng để check order đã thanh toán ok
    signature, //dùng để xác thực gói tin chuẩn từ momo thông qua secret key
  } = req.body;

  try {
    const rawVerifySignature =
      "accessKey=" +
      config.accessKey +
      "&amount=" +
      req.body.amount +
      "&extraData=" +
      req.body.extraData +
      "&message=" +
      req.body.message +
      "&orderId=" +
      req.body.orderId +
      "&orderInfo=" +
      req.body.orderInfo +
      "&orderType=" +
      req.body.orderType +
      "&partnerCode=" +
      req.body.partnerCode +
      "&payType=" +
      req.body.payType +
      "&requestId=" +
      req.body.requestId +
      "&responseTime=" +
      req.body.responseTime +
      "&resultCode=" +
      req.body.resultCode +
      "&transId=" +
      req.body.transId;

    //puts raw verify signature
    // console.log("--------------------VERIFY SIGNATURE----------------");
    // console.log(rawVerifySignature);

    //signature
    const verifySignature = createHmac("sha256", config.secretKey)
      .update(rawVerifySignature)
      .digest("hex");
    // console.log("--------------------VERIFY SIGNATURE----------------");
    // console.log(verifySignature);

    if (verifySignature !== req.body.signature) {
      result.return_code = -1;
      result.return_message = "signature not equal";
    } else {
      if (req.body.message !== "Thành công.") {
        result.return_code = -1;
        result.return_message = "payment failed";
      } else {
        //tạo đơn hàng theo dữ liệu trả về và khởi tạo đơn hàng lên database
        // const order = await Order.create({
        //   orderItems: items.orderItems,
        //   shippingInfo: items.shippingInfo,
        //   itemsPrice: items.itemsPrice,
        //   shippingAmount: items.shippingAmount,
        //   totalAmount: items.totalAmount,
        //   paymentMethod: items.paymentMethod,
        //   paymentInfo: {
        //     status: "Đã thanh toán",
        //   },
        //   user: items.user,
        // });

        // console.log(order);

        // thanh toán thành công
        // merchant cập nhật trạng thái cho đơn hàng
        console.log(
          "update order's status = success where app_trans_id = ",
          req.body.transId
        );

        result.return_code = 1;
        result.return_message = "success";
      }
    }
  } catch (ex) {
    result.return_code = 0;
    result.return_message = ex.message;
  }

  // thông báo kết quả cho Momo server
  res.json(result);
});
