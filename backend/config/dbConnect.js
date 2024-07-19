// MongoDB plugin dùng trong Node để quản lý database
import mongoose from "mongoose";

// Khai báo hàm (không nhận tham số đầu vào) và xuất ra ngoài dùng cho module khác
export const connectDatabase = () => {
  let DB_URI = "";

  if (process.env.NODE_ENV === "NORMAL") DB_URI = process.env.DB_LOCAL_URI;
  if (process.env.NODE_ENV === "DEVELOPMENT") DB_URI = process.env.DB_URI;
  if (process.env.NODE_ENV === "PRODUCTION") DB_URI = process.env.DB_URI;

  // phương thức connect của mongoose kết nối với URI. Nếu thành công, hàm 'then' được gọi với 1 callback nhận đối số là object 'con' chứa thông tin kết nối. Sau đó in ra với thuộc tính 'host' trong object kết nối MongoDB 'con'
  mongoose.connect(DB_URI).then((con) => {
    console.log(`MongoDB Database kết nối với HOST: ${con?.connection?.host}`);
  });
};
