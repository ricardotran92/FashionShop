import React, { useEffect, useState } from "react";
import { useRegisterMutation } from "../../redux/api/authApi";
// import { toast, Toaster } from 'react-hot-toast';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PhoneInput from 'react-phone-number-input'

const Register = () => {

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  // Thêm trạng thái cho xác nhận mật khẩu
  const [confirmPassword, setConfirmPassword] = useState("");

  const { name, email, password, phone, address } = user;

  const { isAuthenticated } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  
  const [register, { isLoading, error, data }] = useRegisterMutation();

  console.log("=====================================");
  console.log(data);
  console.log("=====================================");

  // // kiểm tra nếu có lỗi request thì hiển thị thông báo lỗi bằng toast.error
  // useEffect(() => {
  //   if(error){
  //     toast.error(error?.data?.message);
  //   }
  // }, [error])
  useEffect(() => {
    if(isAuthenticated){
      // Thêm thông báo thành công
      toast.success("Bạn đã đăng ký thành công", { 
        autoClose: false,
      });
      navigate("/"); // Nếu đăng ký thành công thì chuyển hướng về trang chủ
    }
    if(error){
      toast.error(error?.data?.message);
    }
  }, [error, isAuthenticated])

  // xử lý sự kiện submit của form. Sau đó hàm login được gọi với dữ liệu đăng nhập
  const submitHandler = (e) => {
    e.preventDefault();

    // Check if password length is less than 6 characters
    if(password.length < 6){
      toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    // Kiểm tra xem mật khẩu và xác nhận mật khẩu có khớp nhau không trong hàm submitHandler
    if(password !== confirmPassword){
      toast.error("Mật khẩu và xác nhận mật khẩu không khớp");
      return;
    }
    
    // Dispatch login'
    const signUpData = {
      name,
      email,
      password,
      phone,
      address,
    };

    register(signUpData);
  
  };
  // Hàm xử lý riêng cho SĐT khi dùng `react-phone-number-input`
  const handlePhoneChange = (phoneValue) => {
    setUser({ ...user, phone: phoneValue });
  }
  // Cập nhật trạng thái người dùng khi nhập dữ liệu vào form
  const onChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  return (
    <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form
          className="shadow rounded bg-body"
          onSubmit={submitHandler}
        >
          <h2 className="mb-4">Đăng ký</h2>

          <div className="mb-3">
            <label htmlFor="name_field" className="form-label">Họ tên</label>
            <input
              type="text"
              id="name_field"
              className="form-control"
              name="name"
              value={name}
              onChange={onChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email_field" className="form-label">Email</label>
            <input
              type="email"
              id="email_field"
              className="form-control"
              name="email"
              value={email}
              onChange={onChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password_field" className="form-label">Mật khẩu</label>
            <input
              type="password"
              id="password_field"
              className="form-control"
              name="password"
              value={password}
              onChange={onChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="confirm_password_field" className="form-label">Nhập lại mật khẩu</label>
            <input
              type="password"
              id="confirm_password_field"
              className="form-control"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="phone_field" className="form-label">Số điện thoại</label>
            {/* <input
              type="tel"
              id="phone_field"
              className="form-control"
              name="phone"
              value={phone}
              onChange={onChange}
            /> */}
            <PhoneInput 
                international
                defaultCountry="VN"
                id="phone_field"
                className="form-control"
                name="phone"
                value={phone}
                onChange={handlePhoneChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="address_field" className="form-label">Địa chỉ</label>
            <input
              type="text"
              id="adddress_field"
              className="form-control"
              name="address"
              value={address}
              onChange={onChange}
            />
          </div>

          <button id="register_button" type="submit" className="btn w-100 py-2" disable={isLoading}>
            {isLoading? "Đang tạo..." : "ĐĂNG KÝ"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Register