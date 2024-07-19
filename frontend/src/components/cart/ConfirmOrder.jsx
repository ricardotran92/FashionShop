import React, { useEffect } from "react";
import MetaData from "../layout/MetaData";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { calculateOrderCost } from "../../helpers/helpers";
import CheckoutSteps from "./CheckoutSteps";

import {
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBCardImage,
  MDBCol,
  MDBContainer,
  MDBInput,
  MDBRow,
  MDBTypography,
} from "mdb-react-ui-kit";
import PhoneInput from "react-phone-input-2";
import { useCreateNewOrderMutation } from "../../redux/api/orderApi";
import { useCreateNewZaloPayPaymentMutation } from "../../redux/api/zalopayApi";
import { useCreateNewStripePaymentMutation } from "../../redux/api/stripeApi";
import { useCreateNewMoMoPaymentMutation } from "../../redux/api/momoApi";
import { useCreateNewPaypalPaymentMutation } from "../../redux/api/paypalApi";
import { toast } from "react-toastify";

const ConfirmOrder = () => {
  const { cartItems, shippingInfo } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  const { itemsPrice, shippingPrice, totalPrice } = calculateOrderCost(
    cartItems.filter((c) => c.flag === true)
  );

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

  const submitHandle = (e) => {
    // Xử lý mảng cartItems để loại bỏ variant và _id trong selectedVariant
    const processedCartItems = cartItems
      .filter((c) => c.flag === true)
      .map((item) => {
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

    if (shippingInfo?.paymentMethod === "COD") {
      //alert("COD");
      createNewOrder(orderData);
    }

    if (shippingInfo?.paymentMethod === "Stripe") {
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

    if (shippingInfo?.paymentMethod === "Paypal") {
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

    if (shippingInfo?.paymentMethod === "ZaloPay") {
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

    if (shippingInfo?.paymentMethod === "MoMo") {
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
      <MetaData title={"Kiểm tra đơn hàng"} />
      <CheckoutSteps shipping confirmOrder />

      <div className="row d-flex justify-content-center">
        <div className="col-12 col-lg-7 my-5">
          <section id="order_summary" className="shadow rounded bg-body">
            <MDBContainer className="py-1 h-100">
              <MDBRow className="justify-content-center align-items-center h-100">
                <MDBCol md="12">
                  <MDBCardHeader className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <MDBTypography
                        tag="h3"
                        className="fw-bold mb-0 text-black"
                      >
                        Thông tin thanh toán
                      </MDBTypography>
                      <h3 className="lead fw-bold">
                        <Link
                          to={`/shipping`}
                          style={{
                            textDecoration: "none",
                            color: "gray",
                          }}
                        >
                          Sửa thông tin
                        </Link>
                      </h3>
                    </div>
                  </MDBCardHeader>

                  <MDBCardBody className="mb-4">
                    <MDBCard className="rounded-3 mb-4">
                      <MDBCardBody className="p-4">
                        <MDBRow className="justify-content-between align-items-center">
                          <form>
                            <div className="row">
                              <div className="col-12 col-md-4 mb-3">
                                <div className="form-outline">
                                  <label
                                    className="form-label fw-bold text-black"
                                    for="form6Example1"
                                  >
                                    Người nhận
                                  </label>
                                  <input
                                    style={{
                                      width: "100%",
                                      backgroundColor: "#f8f9fa",
                                    }}
                                    type="text"
                                    id="form6Example1"
                                    className="form-control"
                                    value={user?.name}
                                    disabled={true}
                                  />
                                </div>
                              </div>
                              <div className="col-12 col-md-4 mb-3">
                                <div className="form-outline">
                                  <label
                                    className="form-label fw-bold text-black"
                                    for="form6Example2"
                                  >
                                    Điện thoại
                                  </label>
                                  <PhoneInput
                                    inputStyle={{
                                      width: "100%",
                                      height: "38px",
                                      fontSize: "16px",
                                      border: "1px solid #ccc",
                                      borderRadius: "5px",
                                      backgroundColor: "#f8f9fa",
                                    }}
                                    country={"vn"}
                                    countryCodeEditable={true}
                                    value={shippingInfo?.phoneNo}
                                    disabled={true}
                                  />

                                  {/* <input
                                    style={{
                                      width: "100%",
                                      backgroundColor: "#f8f9fa",
                                    }}
                                    type="text"
                                    id="form6Example2"
                                    className="form-control"
                                    value={shippingInfo?.phoneNo}
                                    disabled={true}
                                  /> */}
                                </div>
                              </div>

                              <div className="col-12 col-md-4 mb-3">
                                <div className="form-outline">
                                  <label
                                    className="form-label fw-bold text-black"
                                    for="form6Example2"
                                  >
                                    Email
                                  </label>

                                  <input
                                    style={{
                                      width: "100%",
                                      backgroundColor: "#f8f9fa",
                                    }}
                                    type="text"
                                    id="form6Example2"
                                    className="form-control"
                                    value={user?.email}
                                    disabled={true}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="row">
                              <div className="col-12 col-md-6 mb-3">
                                <div className="form-outline">
                                  <label
                                    className="form-label fw-bold text-black"
                                    for="form6Example1"
                                  >
                                    Đơn vị vận chuyển
                                  </label>
                                  <input
                                    style={{
                                      width: "100%",
                                      backgroundColor: "#f8f9fa",
                                    }}
                                    type="text"
                                    id="form6Example1"
                                    className="form-control"
                                    value={shippingInfo?.shippingVender}
                                    disabled={true}
                                  />
                                </div>
                              </div>
                              <div className="col-12 col-md-6 mb-3">
                                <div className="form-outline">
                                  <label
                                    className="form-label fw-bold text-black"
                                    for="form6Example2"
                                  >
                                    Hình thức thanh toán
                                  </label>
                                  <input
                                    style={{
                                      width: "100%",
                                      backgroundColor: "#f8f9fa",
                                      color: "#CC0000",
                                    }}
                                    type="text"
                                    id="form6Example2"
                                    className="form-control fw-bold"
                                    value={shippingInfo?.paymentMethod}
                                    disabled={true}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="form-outline mb-3">
                              <label
                                className="form-label fw-bold text-black"
                                for="form6Example3"
                              >
                                Địa chỉ
                              </label>
                              <input
                                style={{
                                  width: "100%",
                                  backgroundColor: "#f8f9fa",
                                }}
                                type="text"
                                id="form6Example3"
                                className="form-control"
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
                            <div className="row">
                              <div className="col-12 col-md-4 mb-3">
                                <div className="form-outline">
                                  <label
                                    className="form-label fw-bold text-black"
                                    for="form6Example1"
                                  >
                                    Phường/Xã
                                  </label>
                                  <input
                                    style={{
                                      width: "100%",
                                      backgroundColor: "#f8f9fa",
                                    }}
                                    type="text"
                                    id="form6Example1"
                                    className="form-control"
                                    value={shippingInfo?.shippingWard}
                                    disabled={true}
                                  />
                                </div>
                              </div>
                              <div className="col-12 col-md-4 mb-3">
                                <div className="form-outline">
                                  <label
                                    className="form-label fw-bold text-black"
                                    for="form6Example2"
                                  >
                                    Quận/Huyện
                                  </label>
                                  <input
                                    style={{
                                      width: "100%",
                                      backgroundColor: "#f8f9fa",
                                    }}
                                    type="text"
                                    id="form6Example1"
                                    className="form-control"
                                    value={shippingInfo?.shippingCity}
                                    disabled={true}
                                  />
                                </div>
                              </div>

                              <div className="col-12 col-md-4 mb-3">
                                <div className="form-outline">
                                  <label
                                    className="form-label fw-bold text-black"
                                    for="form6Example2"
                                  >
                                    Tỉnh/Thành Phố
                                  </label>
                                  <input
                                    style={{
                                      width: "100%",
                                      backgroundColor: "#f8f9fa",
                                    }}
                                    type="text"
                                    id="form6Example1"
                                    className="form-control"
                                    value={shippingInfo?.shippingProvince}
                                    disabled={true}
                                  />
                                </div>
                              </div>
                            </div>
                          </form>
                        </MDBRow>
                      </MDBCardBody>
                    </MDBCard>
                  </MDBCardBody>
                </MDBCol>
              </MDBRow>

              <MDBRow className="justify-content-center align-items-center h-100">
                <MDBCol md="12">
                  <MDBCardHeader className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <MDBTypography
                        tag="h3"
                        className="fw-bold mb-0 text-black"
                      >
                        Thông tin sản phẩm
                      </MDBTypography>
                      <h3 className="lead fw-bold">
                        <Link
                          to={`/cart`}
                          style={{
                            textDecoration: "none",
                            color: "gray",
                          }}
                        >
                          Sửa thông tin
                        </Link>
                      </h3>
                    </div>
                  </MDBCardHeader>

                  <MDBCardBody className="mb-4">
                    {cartItems
                      .filter((c) => c.flag === true)
                      ?.map((item) => (
                        <MDBCard className="rounded-3 mb-4">
                          <MDBCardBody className="p-4">
                            <MDBRow className="justify-content-between align-items-center">
                              <MDBCol md="2" lg="2" xl="2">
                                <MDBCardImage
                                  className="rounded-3"
                                  fluid
                                  src={item?.image}
                                  alt={item?.name}
                                />
                              </MDBCol>
                              <MDBCol md="4" lg="4" xl="4">
                                <div className="lead fw-bold mb-2">
                                  <Link
                                    to={`/product/${item?.product}`}
                                    style={{
                                      textDecoration: "none",
                                      color: "gray",
                                    }}
                                  >
                                    {" "}
                                    {item?.name}{" "}
                                  </Link>
                                </div>

                                <div
                                  className="dropdown"
                                  style={{ width: "max-content" }}
                                >
                                  <button
                                    className="form-control"
                                    type="button"
                                    style={{
                                      textAlign: "left",
                                      backgroundColor: "#f8f9fa",
                                    }}
                                    disabled={true}
                                  >
                                    {item?.selectedVariant?.color}
                                  </button>
                                </div>
                                <p></p>

                                <div
                                  className="dropdown"
                                  style={{ width: "max-content" }}
                                >
                                  <button
                                    className="form-control"
                                    type="button"
                                    style={{
                                      textAlign: "left",
                                      backgroundColor: "#f8f9fa",
                                    }}
                                    disabled={true}
                                  >
                                    {item?.selectedVariant?.size}
                                  </button>
                                </div>
                                <p></p>
                              </MDBCol>

                              <MDBCol
                                md="4"
                                lg="4"
                                xl="4"
                                className="offset-lg-1 d-inline align-items-center justify-content-around"
                              >
                                <MDBTypography
                                  tag="h5"
                                  className="mb-0 text-end"
                                >
                                  <p id="card_item_price" className="">
                                    {item?.quantity} x{" "}
                                    {item?.price.toLocaleString("vi-VN", {
                                      style: "currency",
                                      currency: "VND",
                                    })}{" "}
                                    ={" "}
                                    <b style={{ color: "#CC0000" }}>
                                      {(
                                        item?.quantity * item?.price
                                      ).toLocaleString("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                      })}
                                    </b>
                                  </p>
                                </MDBTypography>
                              </MDBCol>
                            </MDBRow>
                          </MDBCardBody>
                        </MDBCard>
                      ))}
                  </MDBCardBody>
                </MDBCol>
              </MDBRow>
            </MDBContainer>
          </section>
        </div>

        <div className="col-12 col-lg-4 my-5">
          <section
            id="order_summary"
            className="shadow rounded "
            style={{ backgroundColor: "#f8f9fa" }}
          >
            <MDBContainer className="py-1 h-100 ">
              <MDBRow className="justify-content-center align-items-center h-100">
                <MDBCol md="12">
                  <MDBCardHeader className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <MDBTypography
                        tag="h3"
                        className="fw-bold mb-0 text-black bold"
                      >
                        Thanh toán
                      </MDBTypography>
                      <h3 className="lead fw-bold">
                        <Link
                          to={`/`}
                          style={{
                            textDecoration: "none",
                            color: "gray",
                          }}
                        >
                          Mua thêm
                        </Link>
                      </h3>
                    </div>
                  </MDBCardHeader>
                  <hr className="my-4" />
                  <MDBCardBody className="mb-4">
                    <MDBRow className="justify-content-between align-items-center mb-4">
                      <MDBCol>
                        <MDBTypography tag="h4" className="mb-0">
                          Số lượng:
                        </MDBTypography>
                      </MDBCol>

                      <MDBCol>
                        <MDBTypography tag="h5" className="mb-0">
                          <span className="order-summary-values">
                            {cartItems
                              .filter((c) => c.flag === true)
                              ?.reduce((acc, item) => acc + item?.quantity, 0)}
                          </span>
                        </MDBTypography>
                      </MDBCol>
                    </MDBRow>

                    <MDBRow className="justify-content-between align-items-center mb-4">
                      <MDBCol>
                        <MDBTypography tag="h4" className="mb-0">
                          Tiền hàng:
                        </MDBTypography>
                      </MDBCol>

                      <MDBCol>
                        <MDBTypography tag="h5" className="mb-0">
                          <span className="order-summary-values">
                            {cartItems
                              .filter((c) => c.flag === true)
                              ?.reduce(
                                (acc, item) =>
                                  acc + item?.quantity * item.price,
                                0
                              )
                              .toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              })}
                          </span>
                        </MDBTypography>
                      </MDBCol>
                    </MDBRow>

                    <MDBRow className="justify-content-between align-items-center mb-4">
                      <MDBCol>
                        <MDBTypography tag="h4" className="mb-0">
                          Giảm giá:
                        </MDBTypography>
                      </MDBCol>

                      <MDBCol>
                        <MDBTypography tag="h5" className="mb-0">
                          <span className="order-summary-values">0 đ</span>
                        </MDBTypography>
                      </MDBCol>
                    </MDBRow>

                    <MDBRow className="justify-content-between align-items-center mb-4">
                      <MDBCol>
                        <MDBTypography tag="h4" className="mb-0">
                          Vận chuyển:
                        </MDBTypography>
                      </MDBCol>

                      <MDBCol>
                        <MDBTypography tag="h5" className="mb-0">
                          <span className="order-summary-values">
                            {calculateOrderCost(
                              cartItems.filter((c) => c.flag === true)
                            ).shippingPrice.toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            })}
                          </span>
                        </MDBTypography>
                      </MDBCol>
                    </MDBRow>
                  </MDBCardBody>

                  <hr className="my-4" />
                  <MDBRow className="justify-content-between align-items-center mb-4">
                    <MDBCol>
                      <MDBTypography tag="h4" className="mb-0">
                        Tổng cộng:
                      </MDBTypography>
                    </MDBCol>

                    <MDBCol>
                      <MDBTypography tag="h5" className="mb-0">
                        <span
                          className="order-summary-values"
                          style={{ color: "#CC0000" }}
                        >
                          {totalPrice.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </span>
                      </MDBTypography>
                    </MDBCol>
                  </MDBRow>

                  <hr className="my-4" />
                  <MDBInput
                    placeholder="NON VOUCHER"
                    wrapperClass="flex-fill"
                    size="lg"
                    style={{
                      // border: "2px solid #B9D3EE", // Thay đổi màu viền tại đây
                      borderRadius: "4px", // Tùy chọn, bo góc cho viền
                    }}
                    disabled={true}
                  />
                  {/* <hr className="my-4" />
                  <MDBRow className="justify-content-center align-items-center mb-4">
                    <MDBTypography tag="h4" className="mb-0">
                      Hình thức thanh toán:
                    </MDBTypography>
                  </MDBRow>
                  <MDBRow className="justify-content-center align-items-center mb-4">
                    <div className="mb-3">
                    <div className="dropdown" style={{ width: "100%" }}>
                      <button
                        className="form-control form-select"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        style={{
                          "text-align": "left",
                          border: "2px solid #CC0000",
                        }}
                      >
                        {"method"}
                      </button>
                      <ul
                        className="dropdown-menu"
                        style={{
                          width: "95%",
                          maxHeight: "200px",
                          overflowY: "auto",
                        }}
                      >
                        {["COD", "Stripe", "Paypal", "MoMo", "ZaloPay"].map(
                          (m) => (
                            <li>
                              <button
                                class="dropdown-item"
                                type="button"
                                value={m}
                                // onClick={(e) => {
                                //   setMethod(e.target.value);
                                // }}
                              >
                                {m}
                              </button>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                    </div>
                  </MDBRow> */}
                  <MDBRow className="justify-content-center align-items-center mb-4">
                    {/* <Link
                      to="/payment_method"
                      id="checkout_btn"
                      className="btn btn-primary w-100 py-2"
                      style={{
                        borderRadius: "5px",
                        height: "50px",
                      }}
                    >
                      Thanh toán đơn hàng
                    </Link> */}
                    <button
                      style={{
                        borderRadius: "5px",
                        height: "50px",
                      }}
                      id="checkout_btn"
                      className="btn btn-primary w-100 py-2"
                      onClick={submitHandle}
                    >
                      Thanh toán đơn hàng
                    </button>
                  </MDBRow>
                </MDBCol>
              </MDBRow>
            </MDBContainer>
          </section>
        </div>
      </div>
    </>
  );
};

export default ConfirmOrder;
