
/**
 *  Đây là một middleware xử lý lỗi. Nó nhận vào các tham số err, req, res, và next.
    Nếu err không tồn tại, nó sẽ sử dụng một mã trạng thái mặc định là 500 (Lỗi máy chủ nội bộ) và một thông báo mặc định là "Lỗi máy chủ nội bộ".
    Nếu err tồn tại, nó sẽ sử dụng statusCode và message từ lỗi đó.
    Sau đó, nó sẽ gửi một phản hồi JSON chứa thông báo lỗi và mã trạng thái tương ứng về cho client.
 */
  import ErrorHandler from "../utils/errorHandler.js";
  export default (err,req, res, next) => {
    let error = {
        statusCode: err?.statusCode || 500,
        message: err?.message || "Lỗi máy chủ nội bộ",
    };
    // Xử lý lỗi ID Mongoose không hợp lệ
    if (err.name === "CastError") {
        // Tạo thông báo lỗi cho trường hợp ID không hợp lệ
        const message = `Không tìm thấy ID hợp lệ: ${err?.path}`;
        // Tạo lỗi mới với mã trạng thái 404 và thông báo được tạo
        error = new ErrorHandler(message, 404);
    }
  
  // Xử lý lỗi xác nhận
    if (err.name === "ValidationError") {
        // Tạo mảng thông báo lỗi từ các lỗi xác nhận
        const message = Object.values(err.errors).map((value) => value.message);
        // Tạo lỗi mới với mã trạng thái 400 và mảng thông báo được tạo
        error = new ErrorHandler(message, 400);
    }
    
    // Xử lý lỗi khóa trùng lặp trong Mongoose
    if (err.code === 11000) {
        // Tạo thông báo lỗi cho trường hợp khóa trùng lặp
        const message = `${Object.keys(err.keyValue)} đã nhập trùng lặp.`;
        // Tạo lỗi mới với mã trạng thái 400 và thông báo được tạo
        error = new ErrorHandler(message, 400);
    }
    
    // Xử lý lỗi JWT không hợp lệ
    if (err.name === "JsonWebTokenError") {
        // Tạo thông báo lỗi cho trường hợp JWT không hợp lệ
        const message = `Mã JWT không hợp lệ. Thử lại!!!`;
        // Tạo lỗi mới với mã trạng thái 400 và thông báo được tạo
        error = new ErrorHandler(message, 400);
    }  

    // Xử lý lỗi JWT hết hạn
    if (err.name === "TokenExpiredError") {
        // Tạo thông báo lỗi cho trường hợp JWT đã hết hạn
        const message = `Mã JWT đã hết hạn. Thử lại!!!`;
        // Tạo lỗi mới với mã trạng thái 400 và thông báo được tạo
        error = new ErrorHandler(message, 400);
    }
    // Trả về thông tin chi tiết lỗi trong môi trường phát triển
    if (process.env.NODE_ENV === "DEVELOPMENT") {
        res.status(error.statusCode).json({
            message: error.message,
            error:err,
            stack: err?.stack,
        });
    }
    // Trả về thông báo lỗi chung trong môi trường sản xuất
    if (process.env.NODE_ENV === "PRODUCTION") {
        res.status(error.statusCode).json({
            message: error.message,
        });
    }

    
};
