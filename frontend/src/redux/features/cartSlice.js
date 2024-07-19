import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [],

  shippingInfo: localStorage.getItem("shippingInfo")
    ? JSON.parse(localStorage.getItem("shippingInfo"))
    : {},
};

export const cartSlice = createSlice({
  initialState,
  name: "cartSlice",
  reducers: {
    setCartItem: (state, action) => {
      const item = action.payload;

      const isItemExistIndex = state.cartItems.findIndex(
        (i) => i?.selectedVariant?._id === item?.selectedVariant?._id
      );

      if (isItemExistIndex !== -1) {
        //sản phẩm đã tồn tại trong giỏ hàng
        const existingItem = state.cartItems[isItemExistIndex];

        const checkedItem = {
          //tạo sản phẩm mới với số lượng tăng/giảm
          ...item,
          quantity: item.quantity + existingItem.quantity,
        };

        if (checkedItem.quantity > checkedItem.selectedVariant.stock) {
          //số lượng mới vượt tồn thì thêm vào đầu danh sách với số lượng bằng tồn
          const newItem = {
            ...checkedItem,
            quantity: checkedItem.selectedVariant.stock,
          };
          state.cartItems.splice(isItemExistIndex, 1);
          state.cartItems.unshift(newItem);
        } else {
          //số lượng mới hợp lý thì thêm với số lượng mới
          //xóa sản phẩm cũ khỏi vị trí hiện tại và thêm sản phẩm mới vào đầu mảng
          state.cartItems.splice(isItemExistIndex, 1);
          state.cartItems.unshift(checkedItem);
        }
      } else {
        //sản phẩm chưa tồn tại trong giỏ hàng
        const checkedItem = {
          //tạo sản phẩm mới để check
          ...item,
          quantity: item.quantity,
        };
        if (checkedItem.quantity > checkedItem.selectedVariant.stock) {
          //số lượng mới vượt tồn thì thêm vào đầu danh sách với số lượng bằng tồn
          const newItem = {
            ...checkedItem,
            quantity: checkedItem.selectedVariant.stock,
          };
          state.cartItems.unshift(newItem);
        } else state.cartItems.unshift(item);
      }

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    setSelectedCartItem: (state, action) => {
      const index = action.payload;
      const {flag, ...restItem} = state.cartItems[index];
      const newItem = {
        ...restItem,
        flag: !(state.cartItems[index]).flag,
      }
      // state.cartItems.splice(index, 1);
      //   state.cartItems.unshift(newItem);
      if(flag === false){
        state.cartItems.splice(index, 1);
        state.cartItems.unshift(newItem);
      }
      else
        state.cartItems.splice(index, 1, newItem);
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      //const { selectedVariant, ...restItem } = rest;
    },

    removeCartItem: (state, action) => {
      //xóa theo mã loại mặt hàng
      state.cartItems = state?.cartItems?.filter(
        (i) => i?.selectedVariant?._id !== action.payload.selectedVariant?._id
      );

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    clearCart: (state, action) => {
      
      state.cartItems = state?.cartItems?.filter((c) => c.flag !== true);
      if( state.cartItems !== null)
        localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      else{
        localStorage.removeItem("cartItems");
        state.cartItems = [];
      }
    },

    saveShippingInfo: (state, action) => {
      state.shippingInfo = action.payload;

      localStorage.setItem("shippingInfo", JSON.stringify(state.shippingInfo));
    },
  },
});

export default cartSlice.reducer;

export const { setCartItem, setSelectedCartItem, removeCartItem, saveShippingInfo, clearCart } =
  cartSlice.actions;
