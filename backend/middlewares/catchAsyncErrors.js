//lớp catchAsyncErrors.js

// Định nghĩa và xuất hàm middleware có tên catchAsyncErrors
export default (controllerFunction) => (req, res, next) => 
    // Sử dụng Promise.resolve() để bắt đầu một Promise mới
    Promise.resolve(controllerFunction(req, res, next)).catch(next);  

