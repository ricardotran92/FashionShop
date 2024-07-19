/* Ref: UpdateProfile.jsx
*/
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { useUpdatePasswordMutation } from "../../redux/api/userApi";
import { toast } from "react-toastify";
import UserLayout from "../layout/UserLayout";

const UpdatePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const [UpdatePassword, { isLoading, error, isSuccess }] = useUpdatePasswordMutation();

  useEffect(() => {
    

    if(error){
      toast.error(error?.data?.message);
    }

    if(isSuccess){
      toast.success("Mật khẩu đã cập nhật thành công");
      navigate("/me/profile");
    }
  }, [error, isSuccess])

  const submitHandler = (e) => {
    e.preventDefault();

    if (password === oldPassword) {
      toast.error("Mật khẩu mới không được trùng với mật khẩu cũ");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    if (password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    const userData = {
      oldPassword,
      password,
    };

    UpdatePassword(userData);
  };

  return (
    <UserLayout>
      <div className="row wrapper">
        <div className="col-10 col-lg-8">
          <form className="shadow rounded bg-body" onSubmit={submitHandler}>
            <h2 className="mb-4">Cập nhật mật khẩu</h2>
            <div className="mb-3">
              <label htmlFor="old_password_field" className="form-label">
                Mật khẩu cũ
              </label>
              <input
                type="password"
                id="old_password_field"
                className="form-control"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="new_password_field" className="form-label">
                Mật khẩu mới
              </label>
              <input
                type="password"
                id="new_password_field"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="confirm_password_field" className="form-label">
                Xác nhận lại mật khẩu mới
              </label>
              <input
                type="password"
                id="confirm_password_field"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn update-btn w-100">
              {isLoading? "Đang cập nhật..." : "Cập nhật Mật khẩu"}
            </button>
          </form>
        </div>
      </div>
    </UserLayout>
  )
}

export default UpdatePassword