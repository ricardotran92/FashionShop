import React, { useEffect, useState } from "react";
import {
  useGetProductDetailsQuery,
  useGetProductsQuery,
} from "../../redux/api/productsApi"; // auto chèn khi chọn useGetProductDetailsQuery
// frames hook dùng để lấy id từ params
import { useParams, useSearchParams } from "react-router-dom"; // auto chèn khi chọn useParams
// import toast from "react-hot-toast";
import { toast } from "react-toastify";
import Loader from "../layout/Loader";
import StarRatings from "react-star-ratings";
import { useDispatch, useSelector } from "react-redux";
import { setCartItem } from "../../redux/features/cartSlice";
import { colorMap } from "../../constants/constants";
import NewReview from "../reviews/NewReview";
import ListReviews from "../reviews/ListReviews";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import ProductItem from "./ProductItem";
import CustomPagination from "../layout/CustomPagination";
import NotFound from "../layout/NotFound";

const ProductDetails = () => {
  const params = useParams();

  const dispatch = useDispatch();

  const [quantity, setQuantity] = useState(1); // quantity: số lượng sản phẩm đang nhập
  const [activeImg, setActiveImg] = React.useState(""); // activeImg: ảnh đang được chọn
  const [selectedSize, setSelectedSize] = useState(null); // size: kích cỡ sản phẩm đang chọn
  const [selectedColor, setSelectedColor] = useState(null); // color: màu sắc sản phẩm đang chọn

  const { data, isLoading, error, isError } = useGetProductDetailsQuery(
    params?.id
  ); //lấy thông tin sản phẩm đang xem

  const product = data?.product;

  const { isAuthenticated } = useSelector((state) => state.auth); //trạng thái đăng nhập của người dùng

  //render lại ảnh khi sản phẩm thay đổi
  useEffect(() => {
    setActiveImg(
      product?.images[0]
        ? product?.images[0]?.url
        : "/images/default_product.png"
    );
  }, [product]);

  //báo lỗi khi không lấy dược thông tin sản phẩm
  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message);
    }
  }, [error?.data?.message, isError]);

  const [selectedVariant, setSelectedVariant] = useState(null); //loại của sản phẩm đang được chọn để đưa vào giỏ
  const [isInStock, setIsInStock] = useState(false); //tình trạng còn hàng của loại sản phẩm đan chọn

  //khi loại mặt hàng đang chọn hoặc số lượng của loại mặt hàng đang chọn thay đổi thì tính toán và render lại
  useEffect(() => {
    setSelectedVariant(
      product?.variants?.find(
        (variant) =>
          variant.color === selectedColor && variant.size === selectedSize
      )
    );
    setIsInStock(selectedVariant && selectedVariant?.stock > 0);
    setQuantity(
      quantity >= selectedVariant?.stock ? selectedVariant?.stock : quantity
    );
  }, [
    product?.variants,
    quantity,
    selectedColor,
    selectedSize,
    selectedVariant,
  ]);

  // Thay đổi màu
  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  // Thay đổi size
  const handleSizeClick = (size) => {
    setSelectedSize(size);
  };

  //const selectedVariant = product?.variants?.find(variant => variant.color === selectedColor && variant.size === selectedSize);
  //const isInStock = selectedVariant && selectedVariant?.stock > 0;

  //Xử lý khi chọn tăng số lượng
  const increseQty = () => {
    const count = document.querySelector(".count");

    if (count.valueAsNumber >= selectedVariant?.stock) return;
    const qty = count.valueAsNumber + 1;
    setQuantity(qty);
  };

  //Xử lý khi chọn giảm số lượng
  const decreseQty = () => {
    const count = document.querySelector(".count");

    if (count.valueAsNumber <= 1) return;
    const qty = count.valueAsNumber - 1;
    setQuantity(qty);
  };

  //Xử lý khi chọn thêm hàng vào giỏ
  const setItemToCart = () => {
    if (quantity === "") {
      toast.error("Hãy chọn số lượng");
      return;
    }

    if (product?.color?.length > 0 && !selectedColor) {
      toast.error("Vui lòng chọn màu");
      return;
    }

    if (product?.size?.length > 0 && !selectedSize) {
      toast.error("Vui lòng chọn kích cỡ");
      return;
    }

    const cartItem = {
      product: product?._id,
      name: product?.name,
      price: product?.price,
      image: product?.images[0]?.url,
      variant: product?.variants,
      selectedVariant: product?.variants?.find(
        (variant) =>
          variant.color === selectedColor && variant.size === selectedSize
      ),
      quantity,
      flag: true,
    };

    dispatch(setCartItem(cartItem));
    toast.success("Đã thêm vào giỏ");

    console.log(cartItem);
  };

  if (error && error?.status === 404) {
    return <NotFound />;
  }

  if (isLoading) return <Loader />;

  return (
    <>
      <div className="row d-flex justify-content-around">
        <div className="col-12 col-lg-5 img-fluid" id="product_image">
          <div className="p-3">
            <Zoom>
              <img
                className="d-block w-100"
                src={activeImg}
                alt={product?.name}
                width="340"
                height="390"
                style={{ objectFit: "contain", maxHeigth: "0%" }}
              />
            </Zoom>
          </div>
          <div className="row justify-content-start mt-5">
            {product?.images?.map((img) => (
              <div className="col-2 ms-4 mt-2">
                <a href="###" role="button">
                  <img
                    className={`d-block border rounded p-3 cursor-pointer ${
                      img.url === activeImg ? "border-warning" : ""
                    }`}
                    height="100"
                    width="100"
                    src={img?.url}
                    alt={img?.url}
                    onClick={() => setActiveImg(img.url)}
                  />
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="col-12 col-lg-5 mt-5">
          <h3>{product?.name}</h3>
          <p id="product_id">SKU # {product?.productID}</p>

          <hr />

          <div className="d-flex">
            <StarRatings
              rating={product?.ratings}
              starRatedColor="#ffb829"
              numberOfStars={5}
              name="rating"
              starDimension="1.4em"
              starSpacing="1px"
            />
            <span id="no-of-reviews" className="pt-1 ps-2">
              {" "}
              ({product?.numOfReviews} Đánh giá){" "}
            </span>
          </div>
          <hr />

          <p id="product_price">{product?.price.toLocaleString("vi-VN")}đ</p>
          <div className="stockCounter d-inline">
            <span
              className="btn btn-danger minus "
              onClick={isInStock ? decreseQty : undefined}
            >
              -
            </span>
            <input
              type="number"
              className="form-control count d-inline"
              value={quantity}
              readOnly={!isInStock}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (e.target.value === "") setQuantity(e.target.value);
                else if (value > 0) {
                  setQuantity(value);
                } else setQuantity(1);
              }}
            />
            <span
              className="btn btn-primary plus"
              onClick={isInStock ? increseQty : undefined}
            >
              +
            </span>
          </div>
          <button
            type="button"
            id="cart_btn"
            className="btn btn-primary d-inline ms-4"
            disabled={!(isInStock && quantity)} // product?.stock <= 0
            onClick={setItemToCart}
          >
            Thêm vào giỏ
          </button>

          <hr />

          {selectedColor && selectedSize ? (
            <p>
              {/* Tình trạng: <span id="stock_status" className={product?.stock > 0 ? "greenColor" : "redColor"}>{product?.stock > 0 ? "Còn hàng" : "Hết hàng"}</span> */}
              Tình trạng:{" "}
              <span
                id="stock_status"
                className={isInStock ? "greenColor" : "redColor"}
              >
                {isInStock ? "Còn hàng" : "Hết hàng"}
              </span>
            </p>
          ) : (
            <p> Tình trạng: </p> // "trống" nếu chưa chọn size và color
          )}

          <p>
            Màu sắc:
            {/* {product?.color.map((colorName) => ( */}
            {product?.variants
              .map((variant) => variant.color) // Extract color from each variant
              .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicate colors
              .map((colorName) => (
                <button
                  key={colorName}
                  style={{ backgroundColor: colorMap[colorName] }}
                  className={`color-button ${
                    colorName === selectedColor ? "color-button-selected" : ""
                  }`}
                  onClick={() => handleColorChange(colorName)}
                >
                  {colorName}
                </button>
              ))}
            {/* </div> */}
          </p>

          <p>
            Kích thước:
            <div className="size-buttons">
              {/* {product?.size.map((size, index) => ( */}
              {product?.variants
                .filter((variant) => variant.color === selectedColor) // Filter variants by selected color
                .map((variant) => variant.size) // Extract size from each variant
                .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicate sizes
                .map((size) => (
                  <button
                    // key={index}
                    key={size}
                    onClick={() => handleSizeClick(size)}
                    // Cập nhật trạng thái khi size button được nhấn, sau đó thêm class selected vào button khi render lại component
                    className={`size-button ${
                      selectedSize === size ? "selected" : ""
                    }`}
                  >
                    {size}
                  </button>
                ))}
            </div>
          </p>

          <hr />

          <h4 className="mt-2">Mô tả:</h4>
          <p>{product?.description}</p>
          <hr />
          <p id="product_seller mb-3">
            Nguồn gốc: <strong>{product?.origin || "FashionShop"}</strong>
          </p>

          {/* {isAuthenticated ? (
            <NewReview productId = {product?._id} />
          ) : (
            <div className="alert alert-danger my-5" type="alert">
              Hãy đăng nhập và mua hàng để có thể đánh giá đơn hàng nhé bạn ^^
            </div>
          )} */}
        </div>
      </div>

      <br></br>
      {/* <div id="order_summary" style={{ width: "95%", margin: "auto" }}>
        {product?.reviews?.length > 0 ? (
          <ListReviews reviews={product?.reviews} />
        ) : (
          <div className="alert alert-warning my-5 text-center" type="alert" >
            Chưa có đánh giá cho sản phẩm này, hãy mua hàng để trở thành người đầu tiên ^^!
          </div>
        )}
      </div> */}
      <ListReviews reviews={product?.reviews} />

      {/* <div className={window.location.search.includes('category=') ? "col-12 col-md-9": "col-12 col-md-12 "}>
          <h1 id="products_heading" className="text-secondary">
            {"Sản phẩm gợi ý"}            
          </h1>
      </div> */}
    </>
  );
};

export default ProductDetails;

/*
"border-warning": class dùng để border màu vàng cho ảnh đang được chọn
*/
