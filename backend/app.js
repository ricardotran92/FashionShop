// backend/app.js

import express from "express"; // Import thư viện express để tạo máy chủ HTTP
const app = express(); // Tạo 1 dối tượng ứng dụng Express mới
import cookieParser from "cookie-parser"; // Import thư viện cookie-parser để xử lý cookie
// import dotenv from "dotenv"; // Một thư viện của JavaScript load các biến môi trường từ tập tin '.env' vào application's runtime environment
import { connectDatabase } from "./config/dbConnect.js"; // Import hàm connectDatabase từ tệp dbConnect.js
import errorsMiddleware from "./middlewares/errors.js"; // Import middleware xử lý lỗi từ tệp errors.js
// import getRawBody from "raw-body"; // Import thư viện getRawBody để lấy nội dung yêu cầu HTTP

import path from "path"; // Import thư viện path để xử lý đường dẫn
import { fileURLToPath } from "url"; // Import hàm fileURLToPath từ thư viện url
const __filename = fileURLToPath(import.meta.url); // Lấy đường dẫn tệp hiện tại
const __dirname = path.dirname(__filename); // Lấy đường dẫn thư mục hiện tại

import cors from "cors";
import passport from "passport";
import session from "express-session";
import passportSetup from "./controllers/passportController.js" // Đổi tên passport khi import
import cookieSession from "cookie-session";
// import fs from 'fs';

// Bắt sự kiện lỗi không được xử lý
process.on("uncaughtException", (err) => {
  console.log(`LỖI: ${err}`);
  console.log("shutting down do lỗi không được xử lý");
  process.exit(1);
});

// Đường dẫn tới file cấu hình local
// const localConfigPath = "backend/config/config.env.local";
// const globalConfigPath = "backend/config/config.env.global";

// // Chỉ sử dụng config.env ở Development
// if (process.env.NODE_ENV !== "PRODUCTION") {
//   // Kiểm tra sự tồn tại của file cấu hình local -> ưu tiên sử dụng
//   if (fs.existsSync(localConfigPath)) {
//     console.log(localConfigPath);
//     dotenv.config({ path: localConfigPath }); // cho phép ghi đè các biến môi trường đã tồn tại
//   } else if (fs.existsSync(globalConfigPath)) {
//     dotenv.config({ path: globalConfigPath });
//   } else {
//     console.log("backend/config/config.env");
//     dotenv.config({ path: "backend/config/config.env" });
//   }
// } else {
//   dotenv.config({ path: ".env.production" });
// }

// Connect với database
connectDatabase();
// mở rộng kích thước file json lên 10mb. 10mb cũng là giá trị tối đa của cloudinary. Tuy nhiên khi upload ảnh, dữ liệu sẽ moá hoá dạng base64, làm tăng kích thước dữ liệu lên server lên đến 33%. nên phải tăng json request limit lên. 1 cách để sử dụng khác là dùng thư viện multer
app.use(
  express.json({
    limit: "20mb",
    verify: (req, res, buf) => {
      req.rawBody = buf; //.toString()
    },
  })
);

app.use(cookieParser());

// Set up session middleware
app.use(
  session({
    secret: "secret", // mã hoá
    resave: false, // lưu lại session ngay cả khi không có thay đổi
    saveUninitialized: true, // lưu session ngay cả khi chưa có dữ liệu
    cookie: { maxAge: 1000 * 60 * 60 },
  })
);
// app.use(
//   cookieSession({ name: "session", keys: ["lama"], maxAge: 24 * 60 * 60 * 100 })
// );
// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Import tất cả các routes (đường dẫn)
import productRoutes from "./routes/products.js";
import authRoutes from "./routes/auth.js";
import orderRoutes from "./routes/order.js";

import zalopayRoutes from "./routes/zalopay.js";
import stripeRoutes from "./routes/stripe.js";
import momoRoutes from "./routes/momo.js";
import paypalRoutes from "./routes/paypal.js";
import adderssRoutes from "./routes/address.js";

app.use("/api", productRoutes);
app.use("/api", authRoutes);
app.use("/api", orderRoutes);

app.use(cors());
app.use("/zalopay", zalopayRoutes);
app.use("/api", zalopayRoutes);
app.use("/api", stripeRoutes);
app.use("/api", momoRoutes);
app.use("/api", paypalRoutes);
app.use("/api", adderssRoutes);

if (process.env.NODE_ENV === "PRODUCTION") {
  app.use(express.static(path.join(__dirname, "../frontend/build"))); // Sử dụng thư mục build của frontend
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html")); // Trả về file index.html
  });
}

app.use(errorsMiddleware);

// app instance đăng ký routes và listen ở port 3000.
const server = app.listen(process.env.PORT, () => {
  console.log(
    `Server đang chạy ở port ${process.env.PORT} ở chế độ ${process.env.NODE_ENV}`
  );
});

//Handle Unhandled Promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`ERROR: ${err}`);
  console.log("Shutting down server due to Unhandled Promise Rejection");
  server.close(() => {
    process.exit(1);
  });
});

  

// const upload = multer({
//   limits: {
//     fileSize: 10 * 1024 * 1024, // 10MB
//   },
// });

// app.post('/upload', upload.single('file'), (req, res) => {
//   // req.file chứa thông tin về tệp đã tải lên
//   res.send('File uploaded successfully');
// });
