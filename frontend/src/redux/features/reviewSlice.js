import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  reviewItems: localStorage.getItem("reviewItems")
    ? JSON.parse(localStorage.getItem("reviewItems"))
    : [],
};

export const reviewSlice = createSlice({
  initialState,
  name: "reviewSlice",
  reducers: {
    setReviewItem: (state, action) => {
      const item = action.payload;

      const flag = item?.flag;

      const isItemExist = state.reviewItems.find(
        (i) => i?.variantID === item?.variantID
      );

      if (isItemExist) {
        state.reviewItems = state.reviewItems.map((i) =>
          i?.variantID === isItemExist?.variantID ? item : i
        );
      } else {
        state.reviewItems = [...state.reviewItems, item];
      }

      if (flag === true) {
        state.reviewItems.forEach((rv) => {
          if (rv !== item) rv.flag = false;
        });
      }

      localStorage.setItem("reviewItems", JSON.stringify(state.reviewItems));
    },

    clearReview: (state, action) => {
      if (localStorage.getItem("reviewItems")) {
        localStorage.removeItem("reviewItems");
        state.reviewItems = [];
      }
    },
  },
});

export default reviewSlice.reducer;

export const { setReviewItem, clearReview } = reviewSlice.actions;
