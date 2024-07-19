import React, { useEffect } from "react";
import MetaData from "../layout/MetaData";
import { useOrderDetailsQuery } from "../../redux/api/orderApi";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../layout/Loader";
import NewReview from "../reviews/NewReview";
import { useDispatch, useSelector } from "react-redux";
import { clearReview, setReviewItem } from "../../redux/features/reviewSlice";

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
import CheckoutSteps from "../cart/CheckoutSteps";

const OrderDetails = () => {
  //const { user } = useSelector((state) => state.auth);
  const { reviewItems } = useSelector((state) => state.review);
  const dispatch = useDispatch();

  const params = useParams();
  const { data, isLoading, error, isSuccess } = useOrderDetailsQuery(
    params?.id
  );
  const order = data?.order || {};

  const { orderItems, paymentInfo, user, orderStatus } = order;

  const isPaid = paymentInfo?.status === "Đã thanh toán" ? true : false;

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }

    if (isSuccess) {
      dispatch(clearReview());
      // console.log(data);
      const initData = data?.order?.orderItems?.map((d) => ({
        orderItems: d,
        userID: user?._id,
        rating: 0,
        comment: "",
        orderID: data?.order?._id,
        status: data?.order?.orderStatus,
        variantID: d?.selectedVariant?.variantID,
        orderDate: data?.order?.createdAt,
        flag: false,
      }));

      // console.log("init data", initData);
      // console.log("od items", orderItems)

      initData.forEach((i) => {
        setItemToReview(i); // Gửi mỗi item vào action và gửi lên Redux store
      });
    }
  }, [error, isSuccess]);

  const setItemToReview = (item) => {
    const reviewItem = {
      orderItems: item?.orderItems,
      userID: item?.userID,
      rating: item?.rating,
      comment: item?.comment,
      orderID: item?.orderID,
      status: item?.status,
      variantID: item?.variantID,
      orderDate: item?.orderDate,
      flag: item?.flag,
    };

    dispatch(setReviewItem(reviewItem));

    // console.log(reviewItem);
  };

  if (isLoading) return <Loader />;

  const openReview = (e) => {
    const flagItem = reviewItems.find((r) => r?.variantID === e);
    // console.log("e = ", e, "\nflagitem = ", flagItem)
    const { flag, ...restItem } = flagItem;
    const flagedItem = {
      ...restItem,
      flag: true,
    };
    setItemToReview(flagedItem);
  };

  return (
    <>
      <MetaData title={"Chi tiết đơn hàng"} />
      <CheckoutSteps shipping confirmOrder payment />

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
                                      backgroundColor: "#f8f9fa",
                                    }}
                                    country={"vn"}
                                    countryCodeEditable={true}
                                    value={order?.shippingInfo?.phoneNo}
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
                                    value={order?.shippingInfo?.shippingVender}
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
                                    value={
                                      order?.paymentMethod
                                        ? order?.paymentMethod === "Card"
                                          ? `${
                                              order?.paymentMethod
                                            } - ${order?.shippingInfo?.orderID.toUpperCase()}`
                                          : "COD"
                                        : ""
                                    }
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
                                // value={order?.shippingInfo?.address}
                                value={[
                                  order?.shippingInfo?.address,
                                  order?.shippingInfo?.shippingWard,
                                  order?.shippingInfo?.shippingCity,
                                  order?.shippingInfo?.shippingProvince,
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
                                    value={order?.shippingInfo?.shippingWard}
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
                                    value={order?.shippingInfo?.shippingCity}
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
                                    value={
                                      order?.shippingInfo?.shippingProvince
                                    }
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
                                    Mã đơn hàng
                                  </label>
                                  <input
                                    style={{
                                      width: "100%",
                                      backgroundColor: "#f8f9fa",
                                    }}
                                    type="text"
                                    id="form6Example1"
                                    className="form-control fw-bold"
                                    value={order?.shippingInfo?.orderID.toUpperCase()}
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
                                    Trạng thái đơn hàng
                                  </label>
                                  <input
                                    style={{
                                      width: "100%",
                                      backgroundColor: "#f8f9fa",
                                      color: String(
                                        order?.orderStatus
                                      ).includes("Delivered")
                                        ? "green"
                                        : String(order?.orderStatus).includes(
                                            "Shipped"
                                          )
                                        ? "#FFCC00"
                                        : "#CC0000",
                                    }}
                                    className="form-control fw-bold"
                                    type="text"
                                    id="form6Example2"
                                    value={orderStatus}
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
                    </div>
                  </MDBCardHeader>

                  <MDBCardBody className="mb-4">
                    {reviewItems?.map((item) => (
                      <MDBCard className="rounded-3 mb-4">
                        <MDBCardBody className="p-4">
                          <MDBRow className="justify-content-between align-items-center">
                            <MDBCol md="2" lg="2" xl="2">
                              <MDBCardImage
                                className="rounded-3"
                                fluid
                                src={item?.orderItems?.image}
                                alt={item?.orderItems?.name}
                              />
                            </MDBCol>
                            <MDBCol md="4" lg="4" xl="4">
                              <div className="lead fw-bold mb-2">
                                <Link
                                  to={`/product/${item?.orderItems?.product}`}
                                  style={{
                                    textDecoration: "none",
                                    color: "gray",
                                  }}
                                >
                                  {" "}
                                  {item?.orderItems?.name}{" "}
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
                                  {item?.orderItems?.selectedVariant?.color}
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
                                  {item?.orderItems?.selectedVariant?.size}
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
                              <MDBTypography tag="h5" className="mb-0 text-end">
                                <p id="card_item_price" className="">
                                  {item?.orderItems?.quantity} x{" "}
                                  {item?.orderItems?.price.toLocaleString(
                                    "vi-VN",
                                    {
                                      style: "currency",
                                      currency: "VND",
                                    }
                                  )}{" "}
                                  ={" "}
                                  <b style={{ color: "#CC0000" }}>
                                    {(
                                      item?.orderItems?.quantity *
                                      item?.orderItems?.price
                                    ).toLocaleString("vi-VN", {
                                      style: "currency",
                                      currency: "VND",
                                    })}
                                  </b>
                                </p>
                              </MDBTypography>

                              <button
                                disabled={order?.orderStatus !== "Delivered"}
                                id="review_btn"
                                type="button"
                                className="btn btn-primary mt-4 w-100"
                                data-bs-toggle="modal"
                                data-bs-target="#ratingModal"
                                value={
                                  item?.orderItems?.selectedVariant?.variantID
                                }
                                onClick={(e) => {
                                  openReview(e.target.value);
                                }}
                              >
                                Đánh giá sản phẩm
                              </button>
                              <NewReview />
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
                        Thông tin hóa đơn
                      </MDBTypography>
                    </div>
                  </MDBCardHeader>
                  <hr className="my-4" />
                  <MDBCardBody className="mb-4">
                    {/* <MDBRow className="justify-content-between align-items-center mb-4">
                      <MDBCol>
                        <MDBTypography tag="h4" className="mb-0">
                          Số lượng:
                        </MDBTypography>
                      </MDBCol>

                      <MDBCol>
                        <MDBTypography tag="h5" className="mb-0">
                          <span className="order-summary-values">
                            {cartItems?.reduce(
                              (acc, item) => acc + item?.quantity,
                              0
                            )}
                          </span>
                        </MDBTypography>
                      </MDBCol>
                    </MDBRow> */}

                    <MDBRow className="justify-content-between align-items-center mb-4">
                      <MDBCol>
                        <MDBTypography tag="h4" className="mb-0">
                          Tiền hàng:
                        </MDBTypography>
                      </MDBCol>

                      <MDBCol>
                        <MDBTypography tag="h5" className="mb-0">
                          <span className="order-summary-values">
                            {order &&
                              order?.itemsPrice &&
                              order?.itemsPrice.toLocaleString("vi-VN", {
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
                            {order &&
                              order?.shippingAmount &&
                              order?.shippingAmount.toLocaleString("vi-VN", {
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
                          {order &&
                            order.totalAmount &&
                            order?.totalAmount.toLocaleString("vi-VN", {
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
                      borderRadius: "4px",
                    }}
                    disabled={true}
                  />
                  <hr className="my-4" />
                  <MDBRow className="justify-content-between align-items-center mb-4">
                    <MDBCol>
                      <MDBTypography tag="h4" className="mb-0">
                        Ngày đặt:
                      </MDBTypography>
                    </MDBCol>

                    <MDBCol>
                      <MDBTypography tag="h5" className="mb-0">
                        <span className="order-summary-values">
                          <b>
                            {new Date(order?.createdAt).toLocaleString("vi-VN")}
                          </b>
                        </span>
                      </MDBTypography>
                    </MDBCol>
                  </MDBRow>
                  <MDBRow className="justify-content-between align-items-center mb-4">
                    <MDBCol>
                      <MDBTypography tag="h4" className="mb-0">
                        Tình trạng:
                      </MDBTypography>
                    </MDBCol>

                    <MDBCol>
                      <MDBTypography tag="h5" className="mb-0">
                        <span
                          className="order-summary-values"
                          style={{ color: isPaid ? "green" : "#FFCC00" }}
                        >
                          <b>{order?.paymentInfo?.status}</b>
                        </span>
                      </MDBTypography>
                    </MDBCol>
                  </MDBRow>

                  <MDBRow className="justify-content-center align-items-center mb-4">
                    <Link
                      to={`/invoice/orders/${order?._id}`}
                      className="btn btn-success d-flex align-items-center justify-content-center"
                      style={{
                        borderRadius: "5px",
                        height: "50px",
                        padding: "0 15px",
                      }}
                    >
                      <i
                        className="fa fa-print"
                        style={{ marginRight: "5px" }}
                      ></i>
                      Xem và in hóa đơn
                    </Link>
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

export default OrderDetails;
