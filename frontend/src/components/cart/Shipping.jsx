import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import MetaData from "../layout/MetaData";
import { saveShippingInfo } from "../../redux/features/cartSlice";
import CheckoutSteps from "./CheckoutSteps";
import moment from "moment";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { toast } from "react-toastify";

import {
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBCol,
  MDBContainer,
  MDBInput,
  MDBRow,
  MDBTypography,
} from "mdb-react-ui-kit";
import { Input, Ripple, initMDB } from "mdb-ui-kit";
import { calculateOrderCost } from "../../helpers/helpers";
initMDB({ Input, Ripple });

const Shipping = () => {
  // const { data } = useGetAddressDataQuery();
  // console.log("data tinh thanh", data);
  const nationData = JSON.parse(sessionStorage.getItem("nationData"));
  // console.log("nationData", nationData);

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems, shippingInfo } = useSelector((state) => state.cart);

  //const [orderID, setOrderID] = useState(user?._id + Date.now()); //Tạo orderID trong shipping là ID người dùng+timestamp
  const [orderID, setOrderID] = useState(
    moment().format("YYMMDDHHMMSS") + user?._id
  ); //Tạo orderID trong shipping là YYMMDDHHMMSS_user._id -> phù hợp cho zalopay sử dụng

  /*Điền sẵn thông tin từ shippingInfo nếu đã có trên local strorage của kh.
  Nếu chưa có thì dùng thông tin mặc định từ tài khoản*/
  const [paymentMethod, setPaymentMethod] = useState(
    shippingInfo?.paymentMethod || "Chọn hình thức thanh toán"
  );

  const [shippingVender, setShippingVender] = useState(
    shippingInfo?.shippingVender || "Chọn đơn vị vận chuyển"
  );
  const [shippingProvince, setShippingProvince] = useState(
    shippingInfo?.shippingProvince || "Chọn Tỉnh/Thành Phố"
  );
  const [shippingCity, setShippingCity] = useState(
    shippingInfo?.shippingCity || "Chọn Quận/Huyện"
  );
  const [shippingWard, setShippingWard] = useState(
    shippingInfo?.shippingWard || "Chọn Phường/Xã"
  );

  const [address, setAddress] = useState(
    shippingInfo?.address || user?.address
  );
  const [phoneNo, setPhoneNo] = useState(shippingInfo?.phoneNo || user?.phone.substring(1));

  const validatePhoneNumber = (phoneNumber) => {
    // const regex = /^\+\d{11}$/;
    const regex = /^\d{11}$/;
    return regex.test(phoneNumber);
  };

  const submitHandle = (e) => {
    e.preventDefault();
    // if (!validatePhoneNumber(phoneNo)) {
    //   toast.error("Số điện thoại không đúng định dạng");
    //   return;
    // }

    // if (paymentMethod === "Chọn hình thức thanh toán") {
    //   toast.error("Phải chọn hình thức thanh toán");
    //   return;
    // }

    if (
      shippingVender === "Chọn đơn vị vận chuyển" ||
      shippingProvince === "Chọn Tỉnh/Thành Phố" ||
      shippingCity === "Chọn Quận/Huyện" ||
      shippingWard === "Chọn Phường/Xã" ||
      !validatePhoneNumber(phoneNo) ||
      paymentMethod === "Chọn hình thức thanh toán"
    ) {
      toast.error("Các thông tin phải đầy đủ và chính xác");
      //return;
    } else {
      //Lưu lại shippingInfo với thông số mặc định hoặc thay đổi (nếu có) khi chọn xác nhận thông tin
      dispatch(
        saveShippingInfo({
          orderID,
          address,
          phoneNo,
          shippingVender,
          shippingProvince,
          shippingCity,
          shippingWard,
          paymentMethod,
        })
      );
      navigate("/confirm_order");
    }
  };

  return (
    <>
      <MetaData title={"Thông tin vận chuyển"} />
      <CheckoutSteps shipping />

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
                                    }}
                                    country={"vn"}
                                    countryCodeEditable={true}
                                    value={phoneNo}
                                    onChange={(e) => {setPhoneNo(e); console.log(phoneNo)}}
                                  />
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
                                  <div
                                    className="dropdown"
                                    style={{ width: "100%" }}
                                  >
                                    <button
                                      className="form-control form-select"
                                      type="button"
                                      data-bs-toggle="dropdown"
                                      aria-expanded="false"
                                      style={{ "text-align": "left" }}
                                    >
                                      {shippingVender}
                                    </button>
                                    <ul
                                      className="dropdown-menu"
                                      style={{
                                        width: "100%",
                                        backgroundColor: "#f8f9fa",
                                      }}
                                    >
                                      <li>
                                        <button
                                          class="dropdown-item"
                                          type="button"
                                          value="Giao hàng nhanh"
                                          onClick={(e) =>
                                            setShippingVender(e.target.value)
                                          }
                                        >
                                          Giao hàng nhanh
                                        </button>
                                      </li>
                                      <li>
                                        <button
                                          class="dropdown-item"
                                          type="button"
                                          value="Giao hàng tiết kiệm"
                                          onClick={(e) =>
                                            setShippingVender(e.target.value)
                                          }
                                        >
                                          Giao hàng tiết kiệm
                                        </button>
                                      </li>
                                    </ul>
                                  </div>
                                  {/* <input
                                    style={{
                                      width: "100%",
                                      backgroundColor: "#f8f9fa",
                                    }}
                                    type="text"
                                    id="form6Example1"
                                    className="form-control"
                                    value={shippingInfo?.shippingVender}
                                    disabled={true}
                                  /> */}
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
                                  <div
                                    className="dropdown"
                                    style={{ width: "100%" }}
                                  >
                                    <button
                                      className="form-control form-select"
                                      type="button"
                                      data-bs-toggle="dropdown"
                                      aria-expanded="false"
                                      style={{ "text-align": "left" }}
                                    >
                                      {paymentMethod}
                                    </button>
                                    <ul
                                      className="dropdown-menu"
                                      style={{
                                        width: "100%",
                                        maxHeight: "200px",
                                        overflowY: "auto",
                                        backgroundColor: "#f8f9fa",
                                      }}
                                    >
                                      {[
                                        "COD",
                                        "Stripe",
                                        "Paypal",
                                        "MoMo",
                                        "ZaloPay",
                                      ].map((m) => (
                                        <li>
                                          <button
                                            class="dropdown-item"
                                            type="button"
                                            value={m}
                                            onClick={(e) => {
                                              setPaymentMethod(e.target.value);
                                            }}
                                          >
                                            {m}
                                          </button>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  {/* <input
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
                                  /> */}
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
                                type="text"
                                id="address_field"
                                className="form-control"
                                name="address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                              />
                              {/* <input
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
                              /> */}
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
                                  <div
                                    className="dropdown"
                                    style={{ width: "100%" }}
                                  >
                                    <button
                                      className="form-control form-select "
                                      type="button"
                                      data-bs-toggle="dropdown"
                                      aria-expanded="false"
                                      style={{ "text-align": "left" }}
                                    >
                                      {shippingWard}
                                    </button>
                                    <ul
                                      className="dropdown-menu"
                                      style={{
                                        width: "100%",
                                        maxHeight: "200px",
                                        overflowY: "auto",
                                        backgroundColor: "#f8f9fa",
                                      }}
                                    >
                                      {shippingCity !== "Chọn Quận/Huyện" ? (
                                        nationData
                                          .find(
                                            (i) => i.Name === shippingProvince
                                          )
                                          .Districts.find(
                                            (j) => j.Name === shippingCity
                                          )
                                          .Wards.map((nd) => (
                                            <li>
                                              <button
                                                class="dropdown-item"
                                                type="button"
                                                value={nd?.Name}
                                                onClick={(e) =>
                                                  setShippingWard(
                                                    e.target.value
                                                  )
                                                }
                                              >
                                                {nd?.Name}
                                              </button>
                                            </li>
                                          ))
                                      ) : (
                                        <li>
                                          <button
                                            class="dropdown-item"
                                            type="button"
                                            value={shippingWard}
                                            disabled={true}
                                          >
                                            {shippingWard}
                                          </button>
                                        </li>
                                      )}
                                    </ul>
                                  </div>
                                  {/* <input
                                    style={{
                                      width: "100%",
                                      backgroundColor: "#f8f9fa",
                                    }}
                                    type="text"
                                    id="form6Example1"
                                    className="form-control"
                                    value={user?.name}
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
                                    Quận/Huyện
                                  </label>
                                  <div
                                    className="dropdown"
                                    style={{ width: "100%" }}
                                  >
                                    <button
                                      className="form-control form-select "
                                      type="button"
                                      data-bs-toggle="dropdown"
                                      aria-expanded="false"
                                      style={{ "text-align": "left" }}
                                    >
                                      {shippingCity}
                                    </button>
                                    <ul
                                      className="dropdown-menu"
                                      style={{
                                        width: "100%",
                                        maxHeight: "200px",
                                        overflowY: "auto",
                                        backgroundColor: "#f8f9fa",
                                      }}
                                    >
                                      {shippingProvince !==
                                      "Chọn Tỉnh/Thành Phố" ? (
                                        nationData
                                          .find(
                                            (i) => i.Name === shippingProvince
                                          )
                                          .Districts.map((nd) => (
                                            <li>
                                              <button
                                                class="dropdown-item"
                                                type="button"
                                                value={nd?.Name}
                                                onClick={(e) => {
                                                  setShippingCity(
                                                    e.target.value
                                                  );
                                                  setShippingWard(
                                                    "Chọn Phường/Xã"
                                                  );
                                                }}
                                              >
                                                {nd?.Name}
                                              </button>
                                            </li>
                                          ))
                                      ) : (
                                        <li>
                                          <button
                                            class="dropdown-item"
                                            type="button"
                                            value={shippingCity}
                                            disabled={true}
                                          >
                                            {shippingCity}
                                          </button>
                                        </li>
                                      )}
                                    </ul>
                                  </div>
                                  {/* <PhoneInput
                                    inputStyle={{
                                      width: "100%",
                                      height: "38px",
                                      fontSize: "16px",
                                      border: "1px solid #ccc",
                                      borderRadius: "5px",
                                    }}
                                    country={"vn"}
                                    countryCodeEditable={true}
                                    value={phoneNo}
                                    onChange={(e) => setPhoneNo(e)}
                                  /> */}
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
                                  <div
                                    className="dropdown"
                                    style={{ width: "100%" }}
                                  >
                                    <button
                                      className="form-control form-select "
                                      type="button"
                                      data-bs-toggle="dropdown"
                                      aria-expanded="false"
                                      style={{ "text-align": "left" }}
                                    >
                                      {shippingProvince}
                                    </button>
                                    <ul
                                      className="dropdown-menu"
                                      style={{
                                        width: "100%",
                                        maxHeight: "200px",
                                        overflowY: "auto",
                                        backgroundColor: "#f8f9fa",
                                      }}
                                    >
                                      {nationData &&
                                        nationData.map((nd) => (
                                          <li>
                                            <button
                                              class="dropdown-item"
                                              type="button"
                                              value={nd?.Name}
                                              onClick={(e) => {
                                                setShippingProvince(
                                                  e.target.value
                                                );
                                                setShippingCity(
                                                  "Chọn Quận/Huyện"
                                                );
                                                setShippingWard(
                                                  "Chọn Phường/Xã"
                                                );
                                              }}
                                            >
                                              {nd?.Name}
                                            </button>
                                          </li>
                                        ))}
                                    </ul>
                                  </div>

                                  {/* <input
                                    style={{
                                      width: "100%",
                                      backgroundColor: "#f8f9fa",
                                    }}
                                    type="text"
                                    id="form6Example2"
                                    className="form-control"
                                    value={user?.email}
                                    disabled={true}
                                  /> */}
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
                            {cartItems.filter((c) => c.flag === true)?.reduce(
                              (acc, item) => acc + item?.quantity,
                              0
                            )}
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
                            {cartItems.filter((c) => c.flag === true)
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
                  <MDBRow className="justify-content-center align-items-center mb-4">
                    <button
                      style={{
                        borderRadius: "5px",
                        height: "50px",
                      }}
                      id="shipping_btn"
                      // type="submit"
                      className="btn btn-primary w-100 py-2"
                      // disabled={
                      //   shippingVender === "Chọn đơn vị vận chuyển" ||
                      //   shippingProvince === "Chọn Tỉnh/Thành Phố" ||
                      //   shippingCity === "Chọn Quận/Huyện" ||
                      //   shippingWard === "Chọn Phường/Xã"
                      // }
                      onClick={submitHandle}
                    >
                      Xác nhận thông tin
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

export default Shipping;
