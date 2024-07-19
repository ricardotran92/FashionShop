import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Vui lòng nhập tên của bạn."],
      maxLength: [50, "Tên của bạn không thể vượt quá 50 ký tự."],
    },
    
    password: {
      type: String,
      // required: [true, "Vui lòng nhập mật khẩu của bạn"],
      minLength: [6, "Mật khẩu của bạn phải ít nhất 6 ký tự."],
      select: false,
    },

    email: {
      type: String,
      required: [true, "Vui lòng nhập email."],
      unique: true,
    },

    phone:{
      type: String,
        required: true,
    },

    address:{
      type: String,
        required: true,
    },

    avatar: {
      public_id: String,
      url: String,
    },

    role: {
      type: String,
      default: "user",
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,
    // Phương thức đăng nhập
    method: {
      type: String,
      required: true,
      default: "local",
    },
    googleId: String,
    facebookId: String,
  },

  { timestamps: true }
);



// Mã hoá mật khẩu trước khi lưu
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

// Trả về JWT Token:
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME,
  });
};

// So sánh mật khẩu người dùng
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Tạo token để cài đặt lại mật khẩu
userSchema.methods.getResetPasswordToken = function () {
  // Tạo token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Cài đặt lại mật khẩu
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Đặt thời gian hết hạn mã thông báo
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;

  return resetToken;
};

export default mongoose.model("User", userSchema);