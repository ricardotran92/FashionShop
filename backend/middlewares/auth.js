import catchAsyncErrors from "./catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import User from "../models/user.js";
import jwt from "jsonwebtoken";

// Kiểm tra xem có phải thành viên không
export const isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("Vui lòng đăng nhập để tiếp tục", 401));
  }

  // Giải mã token để lấy thông tin người dùng
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);

  next();
});

// Xác thực quyền truy cập của người dùng
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // Kiểm tra xem vai trò của người dùng có phù hợp không
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Quyền (${req.user.role}) Không được truy cập tính năng này`,
          403
        )
      );
    }

    next();
  };
};

// Kiểm tra xem có phải đến từ đúng server hay không  -> dùng cho các api callback từ server dịch vụ
export const isAuthenticatedServer = catchAsyncErrors(async (req, res, next) => {
  const allowedOrigin = '';

  const requestOrigin = req.headers.origin;

  if (requestOrigin === allowedOrigin)
    next();
  else
    return next(
      new ErrorHandler(
        `Server (${req.headers.origin}) không được truy cập tính năng này`,
        403
      )
    );
});