import React, { useEffect, useState } from "react";
import MetaData from "../layout/MetaData";
import CheckoutSteps from "./CheckoutSteps";
import { useSelector } from "react-redux";
import { calculateOrderCost } from "../../helpers/helpers";
import { useCreateNewOrderMutation } from "../../redux/api/orderApi";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

import { useCreateNewZaloPayPaymentMutation } from "../../redux/api/zalopayApi";
import { useCreateNewStripePaymentMutation } from "../../redux/api/stripeApi";
import { useCreateNewMoMoPaymentMutation } from "../../redux/api/momoApi";
import { useCreateNewPaypalPaymentMutation } from "../../redux/api/paypalApi";
import PhoneInput from "react-phone-input-2";

const PaymentMethod = () => {
  const { user } = useSelector((state) => state.auth);

  const [method, setMethod] = useState("Chọn hình thức thanh toán");

  const navigate = useNavigate();

  const { shippingInfo, cartItems } = useSelector((state) => state.cart);

  const [createNewOrder, { isLoading, error, isSuccess }] =
    useCreateNewOrderMutation();

  const [createNewZaloPayPayment] = useCreateNewZaloPayPaymentMutation();

  const [createNewStripePayment] = useCreateNewStripePaymentMutation();

  const [createNewMoMoPayment] = useCreateNewMoMoPaymentMutation();

  const [createNewPaypalPayment] = useCreateNewPaypalPaymentMutation();

  useEffect(() => {
    if (error) {
      navigate("/cart");
      toast.error(error?.data?.message);
    }

    if (isSuccess) {
      navigate("/me/orders?order_success=true");
    }
    if (isLoading) {
      toast.warn("Đang tạo đơn hàng trên hệ thống");
    }
  }, [error, isLoading, isSuccess, navigate]);

  const submitHandler = (e) => {
    //Ko cho phép để trống hình thức thanh toán
    e.preventDefault();
    // if (method === "") {
    if (method === "Chọn hình thức thanh toán") {
      toast.error("Bạn phải chọn hình thức thanh toán");
    }

    const { itemsPrice, shippingPrice, totalPrice } =
      calculateOrderCost(cartItems);

    // Xử lý mảng cartItems để loại bỏ variant và _id trong selectedVariant
    const processedCartItems = cartItems.map((item) => {
      // Loại bỏ thuộc tính variant
      const { variant, ...rest } = item;

      // Loại bỏ thuộc tính _id trong selectedVariant
      const { selectedVariant, ...restItem } = rest;
      const { _id, ...variantWithoutId } = selectedVariant;

      //Trả về đối tượng mới đã xử lý
      return {
        ...restItem,
        selectedVariant: {
          color: variantWithoutId.color,
          size: variantWithoutId.size,
          stock: variantWithoutId.stock,
          variantID: _id,
        },
      };
    });

    console.log("Processed Data", processedCartItems);

    const orderData = {
      shippingInfo,
      orderItems: processedCartItems,
      itemsPrice,
      shippingAmount: shippingPrice,
      totalAmount: totalPrice,
      paymentInfo: {
        status: "Chưa thanh toán",
      },
      paymentMethod: "COD",
      user: user._id,
    };

    console.log("Order Data", orderData);
    const { paymentMethod, ...orderDataCard } = orderData;
    orderDataCard.paymentMethod = "Card";
    console.log("Order Data Card", orderDataCard);

    if (method === "COD") {
      //alert("COD");
      createNewOrder(orderData);
    }

    if (method === "Stripe") {
      //alert("Stripe");
      createNewStripePayment(orderDataCard)
        .then((response) => {
          console.log("Day la response\n", response);
          if (response?.data?.url) window.location.href = response?.data?.url;
          else toast.error("Hệ thống không khả dụng!");
        })
        .catch((e) => {
          console.log(e);
        });
    }

    if (method === "Paypal") {
      //alert("Paypal");
      createNewPaypalPayment(orderDataCard)
        .then((response) => {
          console.log("Day la response\n", response);
          if (response?.data?.links)
            window.location.href = (response?.data?.links.find(
              (l) => l.rel === "payer-action"
            )).href;
          else toast.error("Hệ thống không khả dụng!");
        })
        .catch((e) => {
          console.log(e);
        });
    }

    if (method === "ZaloPay") {
      //alert("ZaloPay");
      createNewZaloPayPayment(orderDataCard)
        .then((response) => {
          console.log("Day la response\n", response);
          if (response.data.return_code === 1)
            window.location.href = response.data.order_url;
          else toast.error("Hệ thống không khả dụng!");
        })
        .catch((e) => {
          console.log(e);
        });
    }

    if (method === "MoMo") {
      //alert("MoMo");
      createNewMoMoPayment(orderDataCard)
        .then((response) => {
          console.log("Day la response\n", response);
          if (response.data.resultCode === 0)
            window.location.href = response.data.payUrl;
          else toast.error("Hệ thống không khả dụng!");
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  return (
    <>
      <MetaData title={"Hình thức thanh toán"} />

      <CheckoutSteps shipping confirmOrder payment />

      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form className="shadow rounded bg-body" onSubmit={submitHandler}>
            <div className="d-flex align-items-center justify-content-between">
              <h2 className="fw-bold text-black bold">Thanh toán đơn hàng</h2>
              <h3 className="lead fw-bold">
                <Link
                  to={`/`}
                  style={{
                    textDecoration: "none",
                    color: "gray",
                  }}
                >
                  Mua thêm sản phẩm
                </Link>
              </h3>
            </div>
            <hr className="my-4" />
            {/* <h2 className="mb-4">Thanh toán đơn hàng</h2> */}

            {/* <div className="form-check ">
              <input
                className="form-check-input"
                type="radio"
                name="payment_mode"
                id="codradio"
                value="COD"
                onChange={(e) => setMethod("COD")}
              />
              <label className="form-check-label" htmlFor="codradio">
                COD
              </label>
            </div>

            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="payment_mode"
                id="striperadio"
                value="Stripe"
                onChange={(e) => setMethod("Stripe")}
              />
              <label className="form-check-label" htmlFor="striperadio">
                Stripe
              </label>
            </div>

            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="payment_mode"
                id="paypalradio"
                value="Paypal"
                onChange={(e) => setMethod("Paypal")}
              />
              <label className="form-check-label" htmlFor="paypalradio">
                Paypal
              </label>
            </div>

            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="payment_mode"
                id="momoradio"
                value="MoMo"
                onChange={(e) => setMethod("MoMo")}
              />
              <label className="form-check-label" htmlFor="momoradio">
                MoMo
              </label>
            </div>

            <div className="form-check">
              <input
                className="form-check-input "
                type="radio"
                name="payment_mode"
                id="zalopayradio"
                value="ZaloPay"
                onChange={(e) => setMethod("ZaloPay")}
              />
              <label className="form-check-label" htmlFor="zalopayradio">
                ZaloPay
              </label>
            </div> */}

            <div className="mb-3">
              <label htmlFor="itemsPrice_field" className="form-label">
                Tổng tiền hàng
              </label>
              <input
                style={{ backgroundColor: "#f8f9fa" }}
                type="text"
                id="itemsPrice_field"
                className="form-control"
                name="itemsPrice"
                value={calculateOrderCost(cartItems).itemsPrice}
                disabled={true}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="shippingPrice_field" className="form-label">
                Phí vận chuyển
              </label>
              <input
                style={{ backgroundColor: "#f8f9fa" }}
                type="text"
                id="shippingPrice_field"
                className="form-control"
                name="shippingPrice"
                value={calculateOrderCost(cartItems).shippingPrice}
                disabled={true}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="totalPrice_field" className="form-label">
                Tổng thanh toán
              </label>
              <input
                style={{ backgroundColor: "#f8f9fa" }}
                type="text"
                id="totalPrice_field"
                className="form-control"
                name="totalPrice"
                value={calculateOrderCost(cartItems).totalPrice}
                disabled={true}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="shippingVender_field" className="form-label">
                Đơn vị vận chuyển
              </label>
              <input
                style={{ backgroundColor: "#f8f9fa" }}
                type="text"
                id="shippingVender_field"
                className="form-control"
                name="shippingVender"
                value={shippingInfo?.shippingVender}
                disabled={true}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="address_field" className="form-label">
                Địa chỉ giao hàng
              </label>
              <input
                style={{ backgroundColor: "#f8f9fa" }}
                type="text"
                id="address_field"
                className="form-control"
                name="address"
                value={[
                  shippingInfo?.address,
                  shippingInfo?.shippingWard,
                  shippingInfo?.shippingCity,
                  shippingInfo?.shippingProvince,
                ]
                  .filter(Boolean)
                  .join(", ")}
                disabled={true}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="phone_field" className="form-label">
                Điện thoại liên hệ
              </label>
              <div>
                <PhoneInput
                  inputStyle={{ width: "100%", backgroundColor: "#f8f9fa" }}
                  country={"vn"}
                  countryCodeEditable={false}
                  value={shippingInfo?.phoneNo}
                  disabled={true}
                />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="payment_field" className="form-label">
                Hình thức thanh toán
              </label>
              <div className="dropdown" style={{ width: "100%" }}>
                <button
                  className="form-control form-select"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ "text-align": "left", border: "2px solid #FFA07A" }}
                >
                  {method}
                </button>
                <ul
                  className="dropdown-menu"
                  style={{
                    width: "100%",
                    maxHeight: "200px",
                    overflowY: "auto",
                  }}
                >
                  {["COD", "Stripe", "Paypal", "MoMo", "ZaloPay"].map((m) => (
                    <li>
                      <button
                        class="dropdown-item"
                        type="button"
                        value={m}
                        onClick={(e) => {
                          setMethod(e.target.value);
                        }}
                      >
                        {m}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              style={{
                borderRadius: "5px",
              }}
              id="shipping_btn"
              type="submit"
              className="btn btn-primary w-100 py-"
              disable={isLoading}
            >
              XÁC NHẬN THANH TOÁN
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default PaymentMethod;
