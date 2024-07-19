import React, { useEffect, useState } from "react";
import StarRatings from "react-star-ratings";
import {
  useSubmitReviewMutation,
} from "../../redux/api/productsApi";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setReviewItem } from "../../redux/features/reviewSlice";

//const NewReview = ({ variantID }) => {
const NewReview = () => {
  // console.log("day la e", variantID);

  const dispatch = useDispatch();

  const { reviewItems } = useSelector((state) => state.review);
  //const { orderItems, userID, orderID, variantID, rating, comment } = reviewItems.find((e) => e?.flag === true);

  const [review, setReview] = useState({});

  const [rating, setRating] = useState(0);

  const [comment, setComment] = useState("");

  useEffect(() => {
    if (reviewItems && reviewItems.find((e) => e?.flag === true)) {
      const {
        orderItems,
        userID,
        orderID,
        variantID,
        rating,
        comment,
        orderDate,
      } = reviewItems.find((e) => e?.flag === true);
      //console.log("day la variantID ban dau: ", (reviewItems.find((e) => e?.flag === true))?.variantID);
      console.log("day la variantID ban dau: ", variantID);

      setReview({
        orderItems,
        userID,
        orderID,
        variantID,
        rating,
        comment,
        orderDate,
      });

      setRating(rating);

      setComment(comment);
    }
  }, [reviewItems]);

  // const setRating = (e) => {
  //   const reviewItem = {
  //     orderItems: review?.orderItems,
  //     userID: review?.userID,
  //     rating: review?.e,
  //     comment: review?.comment,
  //     orderID: review?.orderID,
  //     variantID: review?.variantID,
  //     flag: true,
  //   };

  //   //dispatch(setReviewItem(reviewItem));
  // };

  // const setComment = (e) => {
  //   const reviewItem = {
  //     orderItems: review?.orderItems,
  //     userID: review?.userID,
  //     rating: review?.rating,
  //     comment: e,
  //     orderID: review?.orderID,
  //     variantID: review?.variantID,
  //     flag: true,
  //   };

  //   //dispatch(setReviewItem(reviewItem));
  // };

  // const [rating, setRating] = useState((reviewItems.find((r) => r.flag === true))?.rating);

  // const [comment, setComment] = useState((reviewItems.find((r) => r.flag === true))?.comment);

  const [submitReview, { isLoading, error, isSuccess }] =
    useSubmitReviewMutation();

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
    if (isLoading) {
      toast.warn("Đang tải bình luận lên");
    }
    if (isSuccess) {
      toast.success("Đã đăng bình luận");
    }
  }, [error, isLoading, isSuccess]);

  const submitHandle = () => {
    const reviewItem = {
      orderItems: review?.orderItems,
      userID: review?.userID,
      rating: rating,
      comment: comment,
      orderID: review?.orderID,
      status: "Đã thanh toán",
      variantID: review?.variantID,
      orderDate: review?.orderDate,
      flag: true,
    };

    dispatch(setReviewItem(reviewItem));

    //console.log("day la variantID luc submit", review?.variantID);
    const reviewData = {
      rating,
      comment,
      productId: review?.orderItems?.product,
      orderID: review?.orderID,
      selectedVariant: review?.orderItems?.selectedVariant,
    };
    // console.log("v reviewData", reviewData)
    submitReview(reviewData);
  };

  return (
    <>
      <div>
        {/* {canReview && (
        <button
          id="review_btn"
          type="button"
          className="btn btn-primary mt-4"
          data-bs-toggle="modal"
          data-bs-target="#ratingModal"
        >
          {item.variantID}
        </button>
      )} */}

        {/* <button
          id="review_btn"
          type="button"
          className="btn btn-primary mt-4"
          data-bs-toggle="modal"
          data-bs-target="#ratingModal"
        >
          Đánh giá sản phẩm
        </button> */}

        <div className="row mt-2 mb-5">
          <div className="rating w-50">
            <div
              className="modal fade"
              id="ratingModal"
              tabindex="-1"
              role="dialog"
              aria-labelledby="ratingModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5
                      align="center"
                      className="modal-title"
                      id="ratingModalLabel"
                    >
                      Đánh giá sản phẩm
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>

                  <div align="center" className="modal-body">
                    <div>
                      <h5
                        align="center"
                        className="modal-title"
                        id="ratingModalLabel"
                      >
                        MÃ ĐƠN:{" "}
                        {review?.orderID ? review?.orderID.toUpperCase() : ""}
                      </h5>
                    </div>
                    <br></br>
                    <div>
                      <h5
                        align="center"
                        className="modal-title"
                        id="ratingModalLabel"
                      >
                        MÃ SẢN PHẨM:{" "}
                        {review?.orderItems?.product
                          ? review?.orderItems?.product.toUpperCase()
                          : ""}
                      </h5>
                    </div>
                    <br></br>
                    <div>
                      <h5
                        align="center"
                        className="modal-title"
                        id="ratingModalLabel"
                      >
                        MÃ PHÂN LOẠI:{" "}
                        {review?.variantID
                          ? review?.variantID.toUpperCase()
                          : ""}
                      </h5>
                    </div>
                    <br></br>
                    <div>
                      <h5
                        align="center"
                        className="modal-title"
                        id="ratingModalLabel"
                      >
                        MẶT HÀNG:{" "}
                        {review?.orderItems?.name +
                          " - " +
                          review?.orderItems?.selectedVariant?.color +
                          " - " +
                          review?.orderItems?.selectedVariant?.size}
                      </h5>
                    </div>
                    <br></br>
                    <div align="center">
                      <img
                        src={review?.orderItems?.image}
                        alt={review?.orderItems?.name}
                        height="100"
                        width="100"
                      />
                    </div>
                    {/* <div>
                      <div class="dropdown">
                        <button
                          class="btn btn-secondary dropdown-toggle"
                          type="button"
                          id="dropdownMenu2"
                          data-bs-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          Dropdown
                        </button>
                        <div
                          class="dropdown-menu"
                          aria-labelledby="dropdownMenu2"
                        >
                          <button class="dropdown-item" type="button">Action</button>
                          <button class="dropdown-item" type="button">Another action</button>
                          <button class="dropdown-item" type="button">Something else here</button>
                        </div>
                      </div>
                    </div> */}

                    <br></br>

                    <StarRatings
                      rating={rating}
                      starRatedColor="#ffb829"
                      numberOfStars={5}
                      name="rating"
                      changeRating={(e) => setRating(e)}
                    />

                    <textarea
                      name="review"
                      id="review"
                      className="form-control mt-4"
                      placeholder="Viết đánh giá của bạn"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    ></textarea>

                    <button
                      id="new_review_btn"
                      className="btn w-100 my-4 px-4"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      onClick={(e) => submitHandle()}
                    >
                      Đánh giá
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewReview;
