/* col-12 col-sm-6 col-md-3: màn hình nhỏ (dưới 576px) mỗi sp chiếm 12 cột (full width), màn hình vừa (576px đến 768px) mỗi sp chiếm 6 cột (1/2 width), màn hình lớn (lớn hơn 768px) mỗi sp chiếm 3 cột (1/4 width)
*/

import React from "react"
// Ở product?.name nếu không dùng link, ở website khi click vào sẽ reload entire page. Ngược thì lại thì không.
import { Link } from "react-router-dom";
// package để hiển thị số sao: https://www.npmjs.com/package/react-star-ratings
import StarRatings from "react-star-ratings";

import MetaData from "../layout/MetaData"

const ProductItem = ({ product, columnSize, isInSlider = false }) => {
  // Sử dụng isInSlider để xác định class cho div chứa sản phẩm
  const containerClass = isInSlider ? `col-12 my-3` : `col-sm-12 col-md-6 col-lg-3 col-xl-3 my-3`;
  return (
    <>
    <MetaData title={"Thời trang"} />

      {/* <div className={`col-sm-12 col-md-6 col-lg-${columnSize} my-3`}> */}
      {/* <div className={`col-sm-12 col-md-6 col-lg-3 col-xl-3 my-3`}> */}
      <div className={containerClass}>
        <div className="card p-3 rounded">
          <img
            className="card-img-top mx-auto" 
            src={product?.images[0] ? product?.images[0]?.url : "/images/default_product.png"}
            alt="product?.name"
          />
          <div
            className="card-body ps-3 d-flex justify-content-center flex-column "
          >
            <h5 className="card-title">
              {/*<a href="">{product?.name}</a>*/}
              <Link to={`/product/${product?._id}`}>{product?.name}</Link>
            </h5>
            <div className="ratings mt-auto d-flex"> 
              {/* mt-auto: stars các sp cùng hàng */}
              <StarRatings
                rating={product?.ratings}
                starRatedColor="#ffb829"
                numberOfStars={5}
                name='rating'
                starDimension="1em"
                starSpacing="1px"
              />
              <span id="no_of_reviews" className="pt-2 ps-2"> ({product?.numOfReviews}) </span>
            </div>
            <p className="card-text mt-2">{product?.price.toLocaleString('vi-VN')}đ</p>
            <a href={`/product/${product?._id}`} id="view_btn" className="btn btn-block">
              Chi tiết
            </a>
          </div>
        </div>
      </div>


    </>

  )
}

export default ProductItem

// .toLocaleString('vi-VN') => Chuyển đổi số sang chuỗi theo định dạng tiền tệ Việt Nam

