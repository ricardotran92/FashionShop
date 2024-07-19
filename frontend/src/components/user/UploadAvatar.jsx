import React, { useEffect, useState } from "react"
import UserLayout from "../layout/UserLayout"
import { useNavigate } from "react-router-dom";
import { useUploadAvatarMutation } from "../../redux/api/userApi";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";


const UploadAvatar = () => {
  // hook useSelector lấy thông tin user từ store
  const { user } = useSelector((state) => state.auth)
  // hook useState quản lý trạng thái avavtar (hình ảnh) và avatarPreview (URL hình ảnh hiện tại)
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(
    user?.avatar ? user?.avatar?.url : "/images/default_avatar.jpg"
  ); 
  // hook useState quản lý trạng thái file. Mục đích: disable button khi không có file để tránh lỗi
  const [file, setFile] = useState(null);
  // hook useNavigate điều hướng người dùng sau khi hoàn thành tải ảnh lên
  const navigate = useNavigate();
  // hook trả về hàm uploadAvatar thực hiện tải ảnh lên và trạng thái của nó
  const [uploadAvatar, { isLoading, error, isSuccess }] = useUploadAvatarMutation();
  // hook useEffect theo dõi trạng thái của error và isSuccess
  useEffect(() => {
    
    if (error) {
      toast.error(error?.data?.message);
    }

    if (isSuccess) {
      toast.success("Avatar đã cập nhật thành công");
      navigate("/me/profile");
    }
  }, [error, isSuccess]);

  const submitHandler = (e) => {
    e.preventDefault();

    const userData = {
      avatar,
    };

    console.log("=====================================");
    console.log(userData);
    const jsonData = JSON.stringify(userData);
    console.log(`Size of JSON data: ${new Blob([jsonData]).size} bytes`);
    console.log("=====================================");

    uploadAvatar(userData);
  };

  const onChange = (e) => {
    const file = e.target.files[0];
    
    // Kiểm tra kích thuong file (<= 10mb, giới hạn của cloudinary)
    if (file.size > 1024 * 1024 * 10) {
      alert("Vui lòng chọn file dưới 10mb");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result);
        setAvatar(reader.result);
        setFile(e.target.files[0]); // Cập nhật trạng thái file
      }
    };
    
    reader.readAsDataURL(e.target.files[0]);
  };

  return (
    <UserLayout>
      <div className="row wrapper">
        <div className="col-10 col-lg-8">
          <form
            className="shadow rounded bg-body" onSubmit = {submitHandler}  
          >
            <h2 className="mb-4">Cập nhật Avatar</h2>

            <div className="mb-3">
              <div className="d-flex align-items-center">
                <div className="me-3">
                  <figure className="avatar item-rtl">
                    <img 
                      src={avatarPreview}
                      className="rounded-circle" 
                      alt="Avatar" 
                    />
                  </figure>
                </div>
                <div className="input-foam">
                  <label className="form-label" htmFor="customFile">
                    Chọn Avatar
                  </label>
                  <input
                    type="file"
                    name="avatar"
                    className="form-control"
                    id="customFile"
                    accept="images/*"
                    onChange={onChange}
                  />
                </div>
              </div>
            </div>

            <button
              id="register_button"
              type="submit"
              className="btn w-100 py-2"
              disabled={isLoading || !file} // Disable button khi đang tải lên hoặc không có file
            >
              {isLoading ? "Đang tải lên..." : "Tải lên"}
            </button>
          </form>
        </div>
      </div>
    </UserLayout>
  )
}

export default UploadAvatar