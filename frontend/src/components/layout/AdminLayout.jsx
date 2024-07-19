import React from "react"
import SideMenu from "./SideMenu"

const AdminLayout = ({ children }) => {
  const menuItems = [
    {
      name: "Dashboard",
      "url": "/admin/dashboard",
      icon: "fas fa-tachometer-alt",
    },
    {
      name: "Sản phẩm mới",
      "url": "/admin/product/new",
      icon: "fas fa-plus",
    },
    {
      name: "Sản phẩm",
      "url": "/admin/products",
      icon: "fab fa-product-hunt",
    },
    {
      name: "Đơn hàng",
      "url": "/admin/orders",
      icon: "fas fa-receipt",
    },
    {
      name: "Users",
      "url": "/admin/users",
      icon: "fas fa-user",
    },
    {
      name: "Reviews",
      "url": "/admin/reviews",
      icon: "fas fa-star",
    }
  ];

  return (
    <div>
      <div className="mt-2 mt-md-3 mb-0 mb-md-2 py-2 py-md-4">
        <h2 className="text-center fw-bolder">Admin Dashboard</h2>
      </div>

      {/* <div className="container"> */}
        <div className="row justify-content-around">
          <div className="col-12 col-lg-2">
            <SideMenu menuItems={menuItems} />
          </div>
          <div className="col-12 col-lg-10 user-dashboard">{children}</div>
        </div>
      {/* </div> */}
    </div>
  )
}

export default AdminLayout