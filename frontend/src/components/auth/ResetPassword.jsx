import React, { useEffect, useState } from "react"
import { useResetPasswordMutation } from "../../redux/api/userApi";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";


const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();
  const params = useParams() // lấy token từ URL

  const [resetPassword, { isLoading, error, isSuccess }] = useResetPasswordMutation();

  const { isAuthenticated } = useSelector((state) => state.auth);
  
  // console.log("=====================================");
  // console.log(data);
  // console.log("=====================================");
  // kiểm tra nếu có lỗi request thì hiển thị thông báo lỗi bằng toast.error
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
    if (error) {
      toast.error(error?.data?.message);
    }
    if (isSuccess) {
      toast.success("Mật khẩu đã phuc hồi thành công.");
      navigate("/login");
    }
  }, [error, isAuthenticated, isSuccess])
  // xử lý sự kiện submit của form. Sau đó hàm login được gọi với dữ liệu đăng nhập
  const submitHandler = (e) => {
    e.preventDefault();

    if(password !== confirmPassword) {
      return toast.error("Mật khẩu không khớp. Vui lòng thử lại!");
    }

    if (password.length < 6) {
      // Hiển thị thông báo lỗi
      toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    const data = { password, confirmPassword };

    resetPassword({ token: params?.token, body: data });
  };

  return (
    <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form
          className="shadow rounded bg-body" onSubmit={submitHandler}
        >
          <h2 className="mb-4">Đặt lại mật khẩu mới</h2>

          <div className="mb-3">
            <label htmlFor="password_field" className="form-label">Mật khẩu</label>
            <input
              type="password"
              id="password_field"
              className="form-control"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="confirm_password_field" className="form-label"
              >Nhập lại mật khẩu</label
            >
            <input
              type="password"
              id="confirm_password_field"
              className="form-control"
              name="confirm_password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button 
            id="new_password_button" 
            type="submit" 
            className="btn w-100 py-2"          
            disabled={isLoading}
          >
            Xác nhận mật khẩu
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword