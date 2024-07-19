import catchAsyncErrors from "../middlewares/catchAsyncErrors.js"
import User from "../models/user.js";
import { getResetPasswordTemplate } from "../utils/emailTemplates.js";
import ErrorHandler from "../utils/errorHandler.js";
import sendToken from "../utils/sendToken.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";
import { delete_file, upload_file } from "../utils/cloudinary.js";

// Hàm xử lý yêu cầu đăng ký người dùng
//Register User => /api/register
export const registerUser = catchAsyncErrors(async (req, res, next) => {
  // Trích xuất thông tin người dùng từ req.body sử dụng destructuring
  const {name, email, password, phone, address } = req.body;

  // Tạo một người dùng mới trong cơ sở dữ liệu sử dụng mô hình User
  const user = await User.create({
    name,
    email,
    password,
    phone,
    address,
  });

  sendToken(user, 201, res)
});


//Login User => /api/login
export const loginUser = catchAsyncErrors(async (req, res, next) => {
  // Trích xuất thông tin người dùng từ req.body sử dụng destructuring
  const {email, password} = req.body;

    // Kiểm tra xem email và password có tồn tại không
  if(!email || !password){
    return next(new ErrorHandler("Vui lòng nhập email và mật khẩu", 400));
  }

    // Tìm kiếm người dùng trong cơ sở dữ liệu bằng email
  const user = await User.findOne({email}).select("+password");

    // Kiểm tra xem người dùng có tồn tại không
  if(!user){
    return next(new ErrorHandler("email hoặc mật khẩu không đúng", 401));
  }

    // So sánh mật khẩu đã nhập với mật khẩu trong cơ sở dữ liệu
  const isPassWordMatched = await user.comparePassword(password)

    // Kiểm tra xem mật khẩu có khớp không
  if(!isPassWordMatched){
    return next(new ErrorHandler("username hoặc mật khẩu không đúng", 401));
  }

    // Gửi mã thông báo (token) nếu đăng nhập thành công
  sendToken(user, 201, res);
});


// Logout user   =>  /api/v1/logout
export const logout = catchAsyncErrors(async (req, res, next) => {
  // Xóa cookie "token" bằng cách đặt giá trị null và thiết lập ngày hết hạn là ngày hiện tại
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  // Trả về mã trạng thái 200 và thông báo đăng xuất thành công
  res.status(200).json({
    message: "Đăng Xuất",
  });
});

// Upload user avatar   =>  /api/me/upload_avatar
export const uploadAvatar = catchAsyncErrors(async (req, res, next) => {
  const avatarResponse = await upload_file(req.body.avatar, "fashionshop/avatars");

  // Xoá avatar cũ trên cloudinary - optional
  if (req?.user?.avatar?.url) {
    try {
      await delete_file(req?.user?.avatar?.public_id);
    } catch (error) {
      console.log(`Xoá avatar cũ thất bại: ${error.message}`);
    }
  }

  const user = await User.findByIdAndUpdate(req?.user?._id, {
    avatar: avatarResponse,
  });
  // Trả về mã trạng thái 200
  res.status(200).json({
    user,
  });
});

// Quên mật khẩu => /api/password/forgot
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  // Tìm kiếm người dùng trong cơ sở dữ liệu bằng email
  const user = await User.findOne({ email: req.body.email });
  // Kiểm tra xem người dùng có tồn tại không
  if (!user) {
    return next(new ErrorHandler("Không tìm thấy email", 404));
  }
 
  // Tạo mã token để đặt lại mật khẩu cho người dùng
  const resetToken = user.getResetPasswordToken(); 
  // Lưu thông tin mã token vào cơ sở dữ liệu
  await user.save();

  // Tạo URL để người dùng có thể đặt lại mật khẩu
  // const resetUrl = `${process.env.FRONTEND_URL}/api/password/reset/${resetToken}`;
  const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
   // Tạo nội dung email chứa liên kết đặt lại mật khẩu
  const message = getResetPasswordTemplate(user?.name, resetUrl);

  try {
    // Gửi email chứa liên kết đặt lại mật khẩu đến địa chỉ email của người dùng
    await sendEmail({
      email: user.email,
      subject: " FashionShop - Email lấy lại mật khẩu",
      message,
    });
    // Trả về mã trạng thái 200 và thông báo email đã được gửi thành công
    res.status(200).json({
      message: `Gửi email tới: ${user.email}`,
    });
  } catch (error) {
    // Nếu có lỗi khi gửi email, xóa thông tin mã token và hết hạn của người dùng và trả về lỗi
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    return next(new ErrorHandler(error?.message, 500));
  }
});

// Đặt lại mật khẩu => /api/password/reset/:token
export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  // Tạo mã hash từ token được cung cấp trong yêu cầu
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  // Tìm kiếm người dùng trong cơ sở dữ liệu với mã token và mã token vẫn còn hiệu lực
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  // Kiểm tra xem người dùng có tồn tại không
  if (!user) {
    return next(
      new ErrorHandler(
        "Mã đặt lại mật khẩu không hợp lệ hoặc đã hết hạn",
        400
      )
    );
  }
  // Kiểm tra xem mật khẩu mới và xác nhận mật khẩu có khớp nhau không
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Mật khẩu không khớp", 400));
  }

  // Cập nhật mật khẩu mới cho người dùng
  user.password = req.body.password;
  // Xóa thông tin về mã token đặt lại mật khẩu và thời gian hết hạn của người dùng
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  // Lưu thông tin người dùng đã cập nhật vào cơ sở dữ liệu
  await user.save();
  // Gửi lại token cho người dùng để đăng nhập lại
  sendToken(user, 200, res);
});

// Lấy thông tin hồ sơ người dùng hiện tại => /api/me
export const getUserProfile = catchAsyncErrors(async (req, res, next) => {
  // Lấy thông tin người dùng từ cơ sở dữ liệu bằng ID người dùng hiện tại được trích xuất từ JWT
  const user = await User.findById(req?.user?._id);

  // Trả về thông tin người dùng với mã trạng thái 200
  res.status(200).json({
    user,
  });
});

// Cập nhật mật khẩu  =>  /api/password/update
export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  // Tìm kiếm thông tin người dùng trong cơ sở dữ liệu bằng ID người dùng hiện tại
  const user = await User.findById(req?.user?._id).select("+password");

  // Kiểm tra xem mật khẩu trước đó của người dùng có khớp với mật khẩu cũ được cung cấp hay không
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  // Nếu mật khẩu cũ không khớp, trả về lỗi
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Mật khẩu cũ không chính xác", 400));
  }

  // Cập nhật mật khẩu mới cho người dùng và lưu vào cơ sở dữ liệu
  user.password = req.body.password;
  user.save();

  // Trả về thành công với mã trạng thái 200
  res.status(200).json({
    success: true,
  });
});

// Cập nhật thông tin hồ sơ người dùng  =>  /api/me/update
export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  // Dữ liệu mới của người dùng
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    address: req.body.address,
  };

  // Tìm và cập nhật thông tin hồ sơ của người dùng trong cơ sở dữ liệu
  const user = await User.findByIdAndUpdate(req.user._id, newUserData, {
    new: true,
  });

  // Trả về thông tin người dùng đã được cập nhật với mã trạng thái 200
  res.status(200).json({
    user,
  });
});

// Lấy tất cả người dùng - ADMIN  =>  /api/admin/users
export const allUsers = catchAsyncErrors(async (req, res, next) => {
  // Truy vấn tất cả người dùng từ cơ sở dữ liệu
  const users = await User.find();

  // Trả về danh sách người dùng với mã trạng thái 200
  res.status(200).json({
    users,
  });
});

// Lấy thông tin chi tiết của người dùng - ADMIN  =>  /api/admin/users/:id
export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  // Tìm kiếm người dùng trong cơ sở dữ liệu bằng ID
  const user = await User.findById(req.params.id);

  // Kiểm tra xem người dùng có tồn tại không
  if (!user) {
    // Nếu không tìm thấy người dùng, trả về lỗi với mã trạng thái 404
    return next(
      new ErrorHandler(`Không tìm thấy người dùng với id: ${req.params.id}`, 404)
    );
  }

  // Trả về thông tin chi tiết của người dùng với mã trạng thái 200
  res.status(200).json({
    user,
  });
});

// Cập nhật thông tin người dùng - ADMIN  =>  /api/admin/users/:id
export const updateUser = catchAsyncErrors(async (req, res, next) => {
  // Dữ liệu mới của người dùng
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    address: req.body.address,
    role: req.body.role,
  };

  // Tìm và cập nhật thông tin của người dùng trong cơ sở dữ liệu
  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
  });

  // Trả về thông tin người dùng đã được cập nhật với mã trạng thái 200
  res.status(200).json({
    user,
  });
});

// Xóa người dùng - ADMIN  =>  /api/admin/users/:id
export const deleteUser = catchAsyncErrors(async (req, res, next) => {
  // Tìm kiếm người dùng trong cơ sở dữ liệu bằng ID
  const user = await User.findById(req.params.id);

  // Kiểm tra xem người dùng có tồn tại không
  if (!user) {
    // Nếu không tìm thấy người dùng, trả về lỗi với mã trạng thái 404
    return next(
      new ErrorHandler(`Không tìm thấy người dùng với id: ${req.params.id}`, 404)
    );
  }

  // Xoá avatar khỏi cloudinary
  if (user?.avatar?.public_id) {
    await delete_file(user?.avatar?.public_id);
  }

  // Xóa người dùng khỏi cơ sở dữ liệu
  await user.deleteOne();

  // Trả về thành công với mã trạng thái 200
  res.status(200).json({
    success: true,
  });
});
