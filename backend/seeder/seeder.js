/**
 * Post sản phẩm (products) mới từ data.js. Mục đích là để cập nhật 1 danh sách sản phẩm lên CSDL mà không cần phải nhập bằng tay từng sp
 */


import mongoose from "mongoose"; // Import thư viện mongoose để làm việc với MongoDB
import products from "./data.js"; // Import dữ liệu sản phẩm từ file data.js
import Product from "../models/product.js"; // Import model Product từ module models/product.js

// Khai báo hàm seedProducts là một async function
const seedProducts = async () => {
    try {
        // // Kết nối tới cơ sở dữ liệu MongoDB ở địa chỉ mongodb://localhost:27017/FashionShop
        // await mongoose.connect("mongodb://localhost:27017/FashionShop");

        // Kết nối tới CSDL MongoDB Atlas
        await mongoose.connect("mongodb+srv://22540001:123456789a@fashionshop.knbuosh.mongodb.net/FashionShop?retryWrites=true&w=majority&appName=FashionShop")

        // Xóa toàn bộ các bản ghi trong collection Product
        await Product.deleteMany();
        console.log("Các sản phẩm đã được xóa"); // Log thông báo khi các sản phẩm đã được xóa thành công

        // Thêm dữ liệu sản phẩm từ mảng products vào collection Product
        await Product.insertMany(products);
        console.log("Các sản phẩm được thêm thành công"); // Log thông báo khi các sản phẩm đã được thêm vào thành công
        process.exit(); // Kết thúc quá trình thực thi của Node.js

    } catch (error) {
        console.log(error.message); // Log thông báo lỗi nếu có
        process.exit(); // Kết thúc quá trình thực thi của Node.js
    }
};

// Gọi hàm seedProducts để thực thi việc thêm dữ liệu sản phẩm vào cơ sở dữ liệu
seedProducts();
