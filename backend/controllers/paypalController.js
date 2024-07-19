import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import axios from "axios"; // npm install axios
import moment from "moment"; // npm install moment
console.log(process.env.PAYPAL_CLIENT_ID)
const {
  PAYPAL_CLIENT_ID,
  PAYPAL_CLIENT_SECRET,
  PAYPAL_BASE,
} = process.env;
const FRONTEND_URL = process.env.NODE_ENV === 'DEVELOPMENT' ? `${process.env.FRONTEND_PUB_URL}` : `${process.env.FRONTEND_PROD_URL}`;
const BACKEND_URL = process.env.NODE_ENV === 'DEVELOPMENT' ? `${process.env.BACKEND_PUB_URL}` : `${process.env.BACKEND_PROD_URL}`
/**
 * Generate an OAuth 2.0 access token for authenticating with PayPal REST APIs.
 * @see https://developer.paypal.com/api/rest/authentication/
 */
// Tạo token cho phiên thanh toán trên paypal
const generateAccessToken = async () => {
  try {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error("MISSING_API_CREDENTIALS");
    }
    const auth = Buffer.from(
      PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET
    ).toString("base64");

    const options = {
      method: "post",
      url: `${PAYPAL_BASE}/v1/oauth2/token`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${auth}`,
      },
      data: "grant_type=client_credentials",
    };
    const response = await axios(options);
    return response.data.access_token;
  } catch (error) {
    console.error("Failed to generate Access Token:", error);
  }
};

/**
 * Create an order to start the transaction.
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_create
 */
// Tạo payment mới trên cổng thanh toán của paypal
export const newPaypalPayment = catchAsyncErrors(async (req, res, next) => {
  try {
    //const { cart } = req.body;
    // use the cart information passed from the front-end to calculate the purchase unit details
    // console.log(
    //   "shopping cart information passed from the frontend createOrder() callback:",
    //   cart
    // );

    const accessToken = await generateAccessToken();
    //console.log("accessToken", accessToken);

    const transID =
      moment().format("YYMMDDHHMMSS") +
      (req.body.user ? req.body.user : 113114115) +
      "PP";

    // const orderInfo = `FakeshionShop - Thanh toán cho đơn hàng #${transID}`;

    // const DataRaw = {
    //   orderItems: req.body.orderItems,
    //   shippingInfo: {
    //     orderID: transID,
    //     address: req.body.shippingInfo.address,
    //     phoneNo: req.body.shippingInfo.phoneNo,
    //   },
    //   itemsPrice: req.body.itemsPrice,
    //   shippingAmount: req.body.shippingAmount,
    //   totalAmount: req.body.totalAmount,
    //   paymentMethod: req.body.paymentMethod,
    //   paymentInfo: req.body.paymentInfo,
    //   user: req.body.user,
    // };

    // const payload = {
    //   intent: "CAPTURE",
    //   purchase_units: [
    //     {
    //       reference_id:transID,
    //       description: orderInfo,
    //       custom_id: transID,
    //       invoice_id: transID,
    //       amount: { currency_code: "USD", value: req.body.shippingAmount/100000 },
    //     },
    //   ],
    //   payment_source: {
    //     paypal: {
    //       experience_context: {
    //         payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
    //         brand_name: "FAKESHION SHOP INC",
    //         locale: "en-US",
    //         landing_page: "NO_PREFERENCE",
    //         //shipping_preference: "SET_PROVIDED_ADDRESS",
    //         user_action: "PAY_NOW",
    //         locale: "en-US",
    //         return_url: BACKEND_URL + "/api/paypal/callback/",
    //         cancel_url: FRONTEND_URL + "/cart",
    //       },
    //     },
    //   },
    // };

    //tạo payload từ req.body ở đây
    // const payload = {
    //   intent: "CAPTURE",
    //   purchase_units: [
    //     {
    //       amount: {
    //         currency_code: "USD",
    //         value: "100",
    //       },
    //     },
    //   ],
    // };

    const prepairedItems = req.body.orderItems.map((i) => ({
      name: i.name,
      quantity: i.quantity,
      sku: i.product,
      description: `${i.selectedVariant.variantID}-${i.selectedVariant.color}-${i.selectedVariant.size}-${i.selectedVariant.stock}`,
      image_url: i.image,
      unit_amount: {
        currency_code: "USD",
        value: i.price / 100000,
      },
    }));
    console.log("day la i", prepairedItems);

    const payload = {
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: transID,
          description: `${[
            req.body.shippingInfo?.address,
            req.body.shippingInfo?.shippingWard,
            req.body.shippingInfo?.shippingCity,
            req.body.shippingInfo?.shippingProvince,
          ]
            .filter(Boolean)
            .join(", ")}-${req.body.shippingInfo.phoneNo}`,
          custom_id: req.body.user,
          invoice_id: transID,
          amount: {
            currency_code: "USD",
            value: req.body.totalAmount / 100000,
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: req.body.itemsPrice / 100000,
              },
              shipping: {
                currency_code: "USD",
                value: req.body.shippingAmount / 100000,
              },
            },
          },
          items: prepairedItems,
        },
      ],
      payment_source: {
        paypal: {
          experience_context: {
            payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
            brand_name: "FAKESHION SHOP INC",
            locale: "en-US",
            landing_page: "NO_PREFERENCE",
            user_action: "PAY_NOW",
            // locale: "en-VN",
            return_url: `${BACKEND_URL}/me/orders?order_success=true`,
            cancel_url: `${BACKEND_URL}/me/orders?order_success=false`,
          },
        },
      },
    };
    console.log("day la amount", payload.purchase_units[0].amount);
    console.log(payload);

    const options = {
      method: "post",
      url: `${PAYPAL_BASE}/v2/checkout/orders`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        // Uncomment one of these to force an error for negative testing (in sandbox mode only).
        // Documentation: https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
        // "PayPal-Mock-Response": '{"mock_application_codes": "MISSING_REQUIRED_PARAMETER"}'
        // "PayPal-Mock-Response": '{"mock_application_codes": "PERMISSION_DENIED"}'
        // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
        Prefer: "return=representation",
      },
      data: JSON.stringify(payload),
    };
    const response = await axios(options);
    console.log(response, response.status, response.data);
    res.status(response.status).json(response.data);
  } catch {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to create order." });
  }
});

// // createOrder route
// app.post("/api/orders", async (req, res) => {
//   try {
//     // use the cart information passed from the front-end to calculate the order amount detals
//     const { cart } = req.body;
//     const { jsonResponse, httpStatusCode } = await createOrder(cart);
//     res.status(httpStatusCode).json(jsonResponse);
//   } catch (error) {
//     console.error("Failed to create order:", error);
//     res.status(500).json({ error: "Failed to create order." });
//   }
// });

// // serve index.html
// app.get("/", (req, res) => {
//   res.sendFile(path.resolve("./checkout.html"));
// });

// Paypal callback để hệ thống update lại đơn hàng đã tạo trên database sau khi nhận được xác nhận giao dịch thành công từ paypal
export const newOrderWithPaypal = catchAsyncErrors(async (req, res, next) => {
  try {
    const accessToken = await generateAccessToken();
    //console.log("accessToken", accessToken);

    const options = {
      method: "post",
      url: `${PAYPAL_BASE}/v2/checkout/orders/${req.query.token}/capture`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Prefer: "return=representation",
      },
    };
    const response = await axios(options);
    console.log(response, response.status, response.data);
    //TẠO ĐƠN HÀNG LÊN HỆ THỐNG Ở ĐÂY-NHỚ CHECK ĐƠN HÀNG TRÙNG
    res.status(response.status).json(response.data);
    res.redirect(`${FRONTEND_URL}/me/orders?order_success=true`);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to create order." });
  }
});
