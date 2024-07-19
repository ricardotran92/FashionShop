import mongoose from "mongoose";


const productSchema = new mongoose.Schema(
  {
    productID: {
      type: String,
      required: true,
      unique: true, 
    },

    name: {
      type: String,
      required: [true, "Vui lòng nhập tên sản phẩm."],
      maxLength: [200, "Tên sản phẩm không được vượt quá 200 ký tự."],
    },

    price: {
      type: Number,
      required: [true, "Vui lòng nhập giá sản phẩm."],
      min: 0,
    },

    description: {
      type: String,
      required: [true, "Vui lòng nhập mô tả sản phẩm."],
    },

    origin: {
      type: String,
      required: false,
    }, // Nguồn gốc, xuất xứ...

    ratings: {
      type: Number,
      min:0,
      max:5,
    },

    images: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],

    category: {
      name: {
        type: String,
        required: [true, "Vui lòng nhập danh mục sản phẩm"],
        enum: ["Nữ", "Nam"]
      },
      subCategory: {
        type: String,
        enum: ["Áo", "Chân váy và đầm","Quần", "Phụ kiện"],
      },
      subSubCategory: {
        type: String,
        enum: ["Áo khoác","Áo len","Áo polo","Áo sơ mi","Áo thun", "Cà vạt", "Chân váy", "Đầm","Quần tây","Quần bò", "Quần short", "Thắt lưng", "Tất"],
      },
    },

    variants: [ // Touple (color, size, stock)
      {
        color: {
          type: String,
          required: [true, "Vui lòng nhập màu sản phẩm."],
          enum: ["Trắng", "Đen", "Đỏ", "Xanh", "Vàng", "Hồng", "Cam", "Xám", "Nâu", "Sọc", "Họa tiết"],
        },
        size: {
          type: String,
          required: [true, "Vui lòng nhập kích cỡ sản phẩm"],
          enum: ["S", "M", "L", "F"],
        },
        stock: {
          type: Number,
          required: [true, "Vui lòng nhập lượng tồn kho sản phẩm"],
        },
        sellQty: {
          type: Number,
          default: 0,
        },
        // reviews: [
        //   {
        //     user: {
        //       type: mongoose.Schema.Types.ObjectId,
        //       ref: "User", // Chỉ active khi project go-live
        //       required: true,  // Chỉ active khi project go-live
        //     },
        //     order: {
        //       type: mongoose.Schema.Types.ObjectId,
        //       ref: "Order", // Chỉ active khi project go-live
        //       required: true,  // Chỉ active khi project go-live
        //     },
        //     rating: {
        //       type: Number,
        //       min:1,
        //       max:5,
        //     },
        //     comment: {
        //       type: String,
        //     },
        //   },
        // ],
      },
    ],

    sellQty: { // Số lượng bán được
      type: Number,
      default: 0,
    },

    numOfReviews: {
      type: Number,
      default: 0,
    },

    reviews: [
      {
        order: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Order", // Chỉ active khi project go-live
          required: true,  // Chỉ active khi project go-live
        },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", // Chỉ active khi project go-live
          required: true,  // Chỉ active khi project go-live
        },
        rating: {
          type: Number,
          min:1,
          max:5,
        },
        comment: {
          type: String,
        },
        selectedVariant: {
          color: {
            type: String,
            required: [true, "Vui lòng nhập màu sản phẩm."],
            enum: ["Trắng", "Đen", "Đỏ", "Xanh", "Vàng", "Hồng", "Cam", "Xám", "Nâu", "Sọc", "Họa tiết"],
          },
          size: {
            type: String,
            required: [true, "Vui lòng nhập kích cỡ sản phẩm"],
            enum: ["S", "M", "L", "F"],
          },
          variantID: {
            type: String,
          },
        },
      },
    ],

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Chỉ active khi project go-live
      // required: true, // Chỉ active khi project go-live
    },
  },
  
  { timestamps: true }
);



export default mongoose.model("Product", productSchema);


// category: {
//   name: {
//     type: String,
//     required: [true, "Vui lòng nhập danh mục sản phẩm"],
//     enum: ["Nam", "Nữ", "Trẻ em"]
//   },
//   subCategory: {
//     name: {
//       type: String,
//       enum: ["Áo", "Chân váy & Đầm","Quần", "Phụ kiện"],
//       message: "Vui lòng chọn danh mục con"
//     },
//     subSubCategory: {
//       name: {
//         type: String,
//         enum: ["Áo khoác","Áo len","Áo polo","Áo sơ mi","Áo thun", "Cà vạt", "Chân váy", "Đầm","Quần tây","Quần bò", "Quần short", "Thắt lưng", "Tất"],
//         message: "Vui lòng chọn danh mục phụ của danh mục con"
//       }
//     }
//   }
// },


// color: {
//   type: [String],
//   required: [true, "Vui lòng nhập màu sản phẩm."],
//   enum: {
//     values: ["Trắng", "Đen", "Đỏ", "Xanh","Vàng","Hồng","Cam","Xám","Nâu", "Sọc", "Họa tiết"],
//     message: "Vui lòng chọn một màu hợp lệ (Trắng, Đen, Đỏ, Xanh, Vàng, Hồng, Cam, Xám, Nâu, Sọc, Họa tiết)",
//   },
// },

// size: {
//   type: [String],
//   required: [true, "Vui lòng nhập kích cỡ sản phẩm"],
//   enum: {
//     values: ["S", "M", "L","F"],
//     message: "Vui lòng chọn một size hợp lệ (S, M, L, F)",
//   },
// },

// stock: {
//   type: Number,
//   required: [true, "Vui lòng nhập lượng tồn kho sản phẩm"],
// },