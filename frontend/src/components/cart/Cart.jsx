import React, { useEffect, useState } from "react";
import MetaData from "../layout/MetaData";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  setCartItem,
  removeCartItem,
  setSelectedCartItem,
} from "../../redux/features/cartSlice";
import { toast } from "react-toastify";
import { useGetAddressDataQuery } from "../../redux/api/addressApi";

import {
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBCardImage,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBInput,
  MDBRow,
  MDBTypography,
} from "mdb-react-ui-kit";
import CheckoutSteps from "./CheckoutSteps";

// import 'mdb-react-ui-kit/dist/css/mdb.min.css';
// import "@fortawesome/fontawesome-free/css/all.min.css";

const Cart = () => {
  const { data } = useGetAddressDataQuery();

  const dispatch = useDispatch();

  const { cartItems } = useSelector((state) => state.cart); //Danh sách sản phẩm đang lưu tạm trên browser (Local Storage)

  const navigate = useNavigate();

  // const [quantity, setQuantity] = useState(1); // quantity: số lượng sản phẩm
  // const [selectedSize, setSelectedSize] = useState(null); // size: kích cỡ sản phẩm
  // const [selectedColor, setSelectedColor] = useState(null); // color: màu sắc sản phẩm

  //Xử lý khi thay đổi color
  const handleColorChange = (item, color) => {
    const newSelectedVariant = item?.variant.find(
      (variant) =>
        variant.color === color && variant.size === item?.selectedVariant?.size
    );
    const newItem = {
      ...item,
      selectedVariant: newSelectedVariant,
    };

    //Loại của sản phẩm không còn hàng thì báo lỗi và return
    if (newItem?.selectedVariant?.stock === 0) {
      toast.error("Hết hàng");
      return;
    }
    //Loại của sản phẩm còn hàng nhưng không nhập gì vào ô số lượng thì thêm vào giỏ với số lượng là 1
    else if (newItem?.quantity === "") {
      dispatch(removeCartItem(item));
      setItemToCart(newItem, 1);
    }

    dispatch(removeCartItem(item));
    setItemToCart(newItem, newItem?.quantity);
  };

  //Xử lý khi thay đổi size =>logic tương tự size
  const handleSizeClick = (item, size) => {
    const newSelectedVariant = item?.variant.find(
      (variant) =>
        variant.size === size && variant.color === item?.selectedVariant?.color
    );
    const newItem = {
      ...item,
      selectedVariant: newSelectedVariant,
    };

    if (newItem?.selectedVariant?.stock === 0) {
      toast.error("Hết hàng");
      return;
    } else if (newItem?.quantity === "") {
      dispatch(removeCartItem(item));
      setItemToCart(newItem, 1);
    }

    dispatch(removeCartItem(item));
    setItemToCart(newItem, newItem?.quantity);
  };

  //Xử lý khi chọn tăng số lượng => đã cài logic ở cartSlice nên ko check nữa, tăng quá tồn thì đưa về tồn
  const increseQty = (item, quantity) => {
    //const newQty = quantity + 1

    if (quantity >= item?.selectedVariant?.stock) return;
    setItemToCart(item, 1);
  };

  //Xử lý khi chọn giảm số lượng => đã cài logic ở cartSlice nên ko check nữa, giảm quá 1 thì đưa về 1
  const decreseQty = (item, quantity) => {
    //const newQty = quantity -1

    if (quantity <= 1) {
      //dispatch(removeCartItem(item));
      return;
    }
    setItemToCart(item, -1);
  };

  //Xử lý khi đổi số lượng manual
  const changeQty = (item, quantity) => {
    dispatch(removeCartItem(item));
    if (quantity === "") setItemToCart(item, 1);
    else setItemToCart(item, quantity);
  };

  //Hàm set thông tin mặt hàng trong giỏ
  const setItemToCart = (item, newQty) => {
    const cartItem = {
      product: item?.product,
      name: item?.name,
      price: item?.price,
      image: item?.image,
      variant: item?.variant,
      selectedVariant: item?.selectedVariant,
      quantity: newQty,
      flag: item?.flag,
    };

    dispatch(setCartItem(cartItem));
    if (item?.flag === false) dispatch(setSelectedCartItem(0));
    if (cartItem.quantity !== "") toast.success("sửa thành công");

    console.log(cartItem);
  };

  //Hàm xử lý khi xóa sản phẩm trong giỏ
  const removeCartItemHandler = (item) => {
    dispatch(removeCartItem(item));
  };

  //Hàm xử lý khi chuyển sang kiểm tra vận chuyển
  const checkoutHandler = () => {
    // if (cartItems.find((i) => i?.quantity === "")) {
    if (
      cartItems
        .filter((e) => e.flag === true)
        ?.reduce((acc, item) => acc + item?.quantity, 0) === 0
    ) {
      toast.error(
        "Cần chọn hàng để mua và các mặt hàng phải có số lượng phù hợp"
      );
      return;
    }
    sessionStorage.setItem("nationData", JSON.stringify(data));
    navigate("/shipping");
  };

  const [isCheckedAll, setIsCheckedAll] = useState(true); // Khởi tạo state

  useEffect(() => {
    if (
      cartItems.filter((c) => c.flag === false) &&
      cartItems.filter((c) => c.flag === false).length !== 0
    )
      setIsCheckedAll(false);
    // if (cartItems.filter((c) => c.flag === false) )
    else setIsCheckedAll(true);
  }, [cartItems, isCheckedAll]);

  const handleCheckboxChange = () => {
    console.log(cartItems.filter((c) => c.flag === isCheckedAll));
    cartItems
      .filter((c) => c.flag === isCheckedAll)
      .forEach((i) => {
        const index = cartItems.findIndex(
          (x) => x.selectedVariant._id === i.selectedVariant._id
        );
        dispatch(setSelectedCartItem(index));
      });

    // cartItems.findIndex((c) => c.flag === isCheckedAll).forEach((i) => dispatch(setSelectedCartItem(i)))
  };
  // setIsCheckedAll(!isCheckedAll); // Đảo ngược trạng thái khi click

  return (
    <>
      <MetaData title={"Giỏ Hàng"} />
      <CheckoutSteps />

      {cartItems?.length === 0 ? (
        <div className="row d-flex justify-content-center">
          <div className="col-12 col-lg-7 my-5">
            <section id="order_summary" className="shadow rounded bg-body">
              <MDBContainer className="py-1 h-100">
                <MDBRow className="justify-content-center align-items-center h-100">
                  <MDBCol md="12">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <MDBTypography
                        tag="h3"
                        className="fw-bold mb-0 text-black"
                      >
                        Quý khách chưa chọn mặt hàng nào!
                      </MDBTypography>
                    </div>
                  </MDBCol>
                </MDBRow>
              </MDBContainer>
            </section>
          </div>
        </div>
      ) : (
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
                          Thông tin giỏ hàng: {cartItems?.length} mặt hàng
                        </MDBTypography>
                        <MDBTypography
                          tag="h4"
                          className="fw-bold mb-0 text-black d-flex justify-content-between align-items-center"
                        >
                          <span
                            className="mx-2"
                            style={{
                              textDecoration: "none",
                              color: "gray",
                            }}
                          >
                            Chọn tất cả
                          </span>

                          <input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            id="flexCheckChecked"
                            checked={isCheckedAll}
                            onClick={handleCheckboxChange}
                          />
                        </MDBTypography>
                      </div>
                    </MDBCardHeader>

                    <MDBCardBody className="mb-4">
                      {cartItems?.map((item) => (
                        <MDBCard className="rounded-3 mb-4">
                          <MDBCardBody className="p-4">
                            <MDBRow className="align-items-center">
                              <MDBCol
                                md="0"
                                lg="0"
                                xl="0"
                                className="d-flex justify-content-start mb-1"
                              >
                                <div class="form-check">
                                  <input
                                    className="form-check-input mb-2"
                                    type="checkbox"
                                    value="nochecked"
                                    id="flexCheckChecked"
                                    checked={item?.flag}
                                    onChange={() => {
                                      dispatch(
                                        setSelectedCartItem(
                                          cartItems.findIndex(
                                            (c) =>
                                              c.selectedVariant._id ===
                                              item.selectedVariant._id
                                          )
                                        )
                                      );
                                    }}
                                  />
                                </div>
                              </MDBCol>
                              <MDBCol md="2" lg="2" xl="2">
                                <MDBCardImage
                                  className="rounded-3"
                                  fluid
                                  src={item?.image}
                                  alt={item?.name}
                                />
                              </MDBCol>
                              <MDBCol md="3" lg="3" xl="3">
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

                                {/* <p className="lead fw-normal mb-2">
                                  {item?.name}
                                </p> */}
                                <div
                                  className="dropdown"
                                  style={{ width: "max-content" }}
                                >
                                  <button
                                    className="form-control form-select "
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                    style={{ textAlign: "left" }}
                                  >
                                    {item?.selectedVariant?.color}
                                  </button>
                                  <ul
                                    className="dropdown-menu "
                                    style={{
                                      textAlign: "left",
                                      maxHeight: "100px",
                                      overflowY: "auto",
                                      backgroundColor: "#f8f9fa",
                                    }}
                                  >
                                    {item?.variant
                                      .map((variant) => variant.color) // Extract color from each variant
                                      .filter(
                                        (value, index, self) =>
                                          self.indexOf(value) === index
                                      ) // Remove duplicate colors
                                      .map(
                                        (
                                          colorName // Nếu item.color không tồn tại thì trả về mảng rỗng
                                        ) => (
                                          <li>
                                            <button
                                              class="dropdown-item"
                                              type="button"
                                              value={colorName}
                                              onClick={(e) => {
                                                handleColorChange(
                                                  item,
                                                  colorName
                                                );
                                              }}
                                            >
                                              {colorName}
                                            </button>
                                          </li>
                                        )
                                      )}
                                  </ul>
                                </div>
                                <p></p>

                                <div
                                  className="dropdown"
                                  style={{ width: "max-content" }}
                                >
                                  <button
                                    className="form-control form-select "
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                    style={{ textAlign: "left" }}
                                  >
                                    {item?.selectedVariant?.size}
                                  </button>
                                  <ul
                                    className="dropdown-menu "
                                    style={{
                                      textAlign: "left",
                                      maxHeight: "100px",
                                      overflowY: "auto",
                                      backgroundColor: "#f8f9fa",
                                    }}
                                  >
                                    {item?.variant
                                      .filter(
                                        (variant) =>
                                          variant.color ===
                                          item?.selectedVariant?.color
                                      ) // Filter variants by selected color
                                      .map((variant) => variant.size) // Extract size from each variant
                                      .filter(
                                        (value, index, self) =>
                                          self.indexOf(value) === index
                                      ) // Remove duplicate sizes
                                      .map((sizeName) => (
                                        <li>
                                          <button
                                            class="dropdown-item"
                                            type="button"
                                            value={sizeName}
                                            onClick={() =>
                                              handleSizeClick(item, sizeName)
                                            }
                                          >
                                            {sizeName}
                                          </button>
                                        </li>
                                      ))}
                                  </ul>
                                </div>
                                <p></p>
                              </MDBCol>
                              <MDBCol
                                md="3"
                                lg="3"
                                xl="2"
                                className="d-inline align-items-center justify-content-around"
                              >
                                <div className="stockCounter d-inline d-flex justify-content-between align-items-center">
                                  <span
                                    style={{
                                      backgroundColor: "#CC0000",
                                      cursor: "pointer",
                                      color: "#ffffff",
                                      fontWeight: "bold",
                                      borderRadius: "2px",
                                    }}
                                    className="btn px-2 btn-danger minus mx-2"
                                    onClick={() =>
                                      decreseQty(item, item.quantity)
                                    }
                                  >
                                    {" "}
                                    -{" "}
                                  </span>
                                  <input
                                    type="number"
                                    className="border form-control count d-inline"
                                    style={{ borderRadius: "2px" }}
                                    value={item?.quantity}
                                    onChange={(e) => {
                                      const value = parseInt(e.target.value);
                                      if (value > 0) {
                                        changeQty(item, value);
                                      } else if (value < 0) changeQty(item, 1);
                                      else if (value === 0) return;
                                      else changeQty(item, e.target.value);
                                    }}
                                  />

                                  <span
                                    style={{
                                      backgroundColor: "#0066FF",
                                      cursor: "pointer",
                                      color: "#ffffff",
                                      fontWeight: "bold",
                                      borderRadius: "2px",
                                    }}
                                    className="btn btn-primary plus mx-2"
                                    onClick={() =>
                                      increseQty(item, item.quantity)
                                    }
                                  >
                                    {" "}
                                    +{" "}
                                  </span>
                                </div>
                                <p></p>
                              </MDBCol>
                              <MDBCol
                                md="3"
                                lg="2"
                                xl="2"
                                className="offset-lg-1 d-inline align-items-center justify-content-around"
                              >
                                <MDBTypography tag="h5" className="mb-0">
                                  <p id="card_item_price" className="">
                                    x{" "}
                                    {item?.price.toLocaleString("vi-VN", {
                                      style: "currency",
                                      currency: "VND",
                                    })}
                                  </p>
                                </MDBTypography>
                              </MDBCol>
                              <MDBCol
                                md="1"
                                lg="1"
                                xl="1"
                                className="d-inline align-items-center justify-content-around text-end"
                              >
                                <p id="card_item_price" className="text-danger">
                                  <a href="#!">
                                    <MDBIcon
                                      fas
                                      icon="trash text-danger"
                                      size="lg"
                                      onClick={() =>
                                        removeCartItemHandler(item)
                                      }
                                    />
                                  </a>
                                </p>
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
                          Tạm tính
                        </MDBTypography>
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
                                .filter((e) => e.flag === true)
                                ?.reduce(
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
                              {cartItems
                                .filter((e) => e.flag === true)
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

                      {/* <MDBRow className="justify-content-between align-items-center mb-4">
                        <MDBCol>
                          <MDBTypography tag="h4" className="mb-0">
                            Vận chuyển:
                          </MDBTypography>
                        </MDBCol>

                        <MDBCol>
                          <MDBTypography tag="h5" className="mb-0">
                            <span className="order-summary-values">
                              {calculateOrderCost(
                                cartItems
                              ).shippingPrice.toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              })}
                            </span>
                          </MDBTypography>
                        </MDBCol>
                      </MDBRow> */}
                    </MDBCardBody>
                    <hr className="my-4" />
                    <MDBInput
                      placeholder="Nhập MGG"
                      wrapperClass="flex-fill"
                      size="lg"
                      style={{
                        border: "2px solid #B9D3EE", // Thay đổi màu viền tại đây
                        borderRadius: "4px", // Tùy chọn, bo góc cho viền
                      }}
                    />
                    <MDBRow
                      className="justify-content-center align-items-center mb-4"
                      // style={{
                      //   margin: 0.5,
                      // }}
                    >
                      <button
                        style={{
                          borderRadius: "5px",
                          height: "50px",
                        }}
                        id="checkout_btn"
                        className="btn btn-primary w-100 py-2"
                        onClick={checkoutHandler}
                      >
                        Đặt hàng
                      </button>
                    </MDBRow>
                  </MDBCol>
                </MDBRow>
              </MDBContainer>
            </section>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
