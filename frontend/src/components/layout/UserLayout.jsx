import React from "react"
import SideMenu from "./SideMenu"

const UserLayout = ({ children }) => {
  const menuItems = [
    {
      name: "Hồ sơ cá nhân",
      "url": "/me/profile",
      icon: "fas fa-user",
    },
    {
      name: "Cập nhật hồ sơ",
      "url": "/me/update_profile",
      icon: "fas fa-user",
    },
    {
      name: "Cập nhật avatar",
      "url": "/me/upload_avatar",
      icon: "fas fa-user-circle",
    },
    {
      name: "Cập nhật mật khẩu",
      "url": "/me/update_password",
      icon: "fas fa-lock",
    }
  ]

  return (
    <div>
      <div className="mt-2 mt-md-3 mb-0 mb-md-2 py-2 py-md-4">
        <h2 className="text-center fw-bolder">Tài khoản cá nhân</h2>
      </div>

      <div className="container">
        <div className="row justify-content-around">
          <div className="col-12 col-lg-3">
            <SideMenu menuItems={menuItems} />
          </div>
          <div className="col-12 col-lg-8 user-dashboard">{children}</div>
        </div>
      </div>
    </div>
  )
}

export default UserLayout