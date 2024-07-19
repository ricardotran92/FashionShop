import React from "react";
import StarRatings from "react-star-ratings";

const ListReviews = ({ reviews }) => {
  console.log("day la rv", reviews);
  return (
    <>
      {/* <div className="p-5"> */}
      <div className="row d-flex justify-content-center mt-5 mx-1">
        {/* <div className="col-md-12 col-lg-10"> */}
        <div className="card text-body col-md-12 col-lg-10">
          <h3 className="mb-0 px-4 mt-4 fw-bold">Đánh giá từ người mua</h3>

          {reviews?.length > 0 ? (
            <>
              {reviews?.map((review) => (
                <div className="card-body p-4">
                  <hr className="my-0" />
                  <div className="d-flex flex-start">
                    <img
                      className="rounded-circle shadow-1-strong me-3 mt-1"
                      src={
                        review?.user?.avatar
                          ? review?.user?.avatar?.url
                          : "/images/default_avatar.jpg"
                      }
                      alt={review?.user?.name}
                      width="60"
                      height="60"
                    />
                    <div>
                      <div className="d-flex align-items-center">
                        <h6 className="fw-bold mb-0 mt-2 me-2">
                          {review?.user?.name}
                        </h6>
                        <StarRatings
                          rating={review?.rating}
                          starRatedColor="#ffb829"
                          numberOfStars={5}
                          name="x"
                          starDimension="1.4em"
                          starSpacing="1px"
                        />
                      </div>
                      <p className="mt-1">
                        Mua hàng ngày:{" "}
                        {new Date(review?.order?.createdAt).toLocaleDateString(
                          "vi-VN"
                        )}{" "}
                        - Loại sản phẩm: {review?.selectedVariant?.color} -{" "}
                        {review?.selectedVariant?.size}
                      </p>
                      <div
                        className="mt-3"
                        style={{
                          textAlign: "justify",
                          margin: "0",
                        }}
                      >
                        <p>{review?.comment}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div
              className="alert alert-warning my-5 text-center mx-5"
              type="alert"
            >
              Chưa có đánh giá cho sản phẩm này, hãy mua hàng để trở thành người
              đầu tiên ^^!
            </div>
          )}

          <div className="card-body p-4"></div>
          {/* <div className="card-body p-4">
            <hr className="my-0" />
            <div className="d-flex flex-start mt-2">
              <img
                className="rounded-circle shadow-1-strong me-3 mt-1"
                src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(26).webp"
                alt="avatar"
                width="60"
                height="60"
              />
              <div>
                <div className="d-flex align-items-center">
                  <h6 className="fw-bold mb-0 mt-2 me-2">Lara Stewart</h6>
                  <StarRatings
                    rating={4}
                    starRatedColor="#ffb829"
                    numberOfStars={5}
                    name="x"
                    starDimension="1.4em"
                    starSpacing="1px"
                  />
                </div>
                <p className="mt-1">
                  Mua hàng ngày: March 15, 2021 - Loại sản phẩm: Xanh- M
                </p>
                <div
                  className="mt-3"
                  style={{
                    textAlign: "justify",
                    margin: "0",
                  }}
                >
                  <p>
                    Contrary to popular belief, Lorem Ipsum is not simply random
                    text. It has roots in a piece of classical Latin literature
                    from 45 BC, making it over 2000 years old. Richard
                    McClintock, a Latin professor at Hampden-Sydney College in
                    Virginia, looked up one of the more obscure Latin words,
                    consectetur, from a Lorem Ipsum passage, and going through
                    the cites.
                  </p>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
      {/* </div> */}

      <div className="reviews w-100">
        {/* <h3>Các đánh giá từ người mua:</h3>
      <hr />
      {reviews?.map((review) => (        
        <div key = {review?._id}className="review-card my-3">
          <div className="row">
            <div className="col-1">
              <img
                src={review?.user?.avatar ? review?.user?.avatar?.url : "/images/default_avatar.jpg"}
                alt="User Name"
                width="50"
                height="50"
                className="rounded-circle"
              />
            </div>
            <div className="col-11">
              <StarRatings
                rating={review?.rating}
                starRatedColor="#ffb829"
                numberOfStars={5}
                name='rating'
                starDimension="1.4em"
                starSpacing="1px"
              />
              <p className="review_user">{review?.user?.name}</p>
              <p className="review_comment">{review?.comment}</p>
            </div>
          </div>
          <hr />
        </div>
      ))} */}
      </div>
    </>
  );
};

export default ListReviews;
