import React, { useEffect, useState } from "react"
import { useForgotPasswordMutation } from "../../redux/api/userApi";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const [forgotPassword, { isLoading, error, isSuccess }] = useForgotPasswordMutation();

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
      toast.success("Email đã được gửi. Vui lòng kiểm tra hộp thư của bạn.");
    }
  }, [error, isAuthenticated, isSuccess])
  // xử lý sự kiện submit của form. Sau đó hàm login được gọi với dữ liệu đăng nhập
  const submitHandler = (e) => {
    e.preventDefault();

    forgotPassword({ email });
  };

  return (
    <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form
          className="shadow rounded bg-body"
          onSubmit={submitHandler}
        >
          <h2 className="mb-4">Phục hồi mật khẩu</h2>
          <div className="mt-3">
            <label htmlFor="email_field" className="form-label">Nhập Email</label>
            <input
              type="email"
              id="email_field"
              className="form-control"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            id="forgot_password_button"
            type="submit"
            className="btn w-100 py-2"
            disabled={isLoading}
          >
            {isLoading? "Đang gửi..." : "Gửi Email"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ForgotPassword