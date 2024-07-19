/* 'racfe' để tạo functional component với export
Link/to là componnent của react-router-dom tạo ra thẻ a để điều hướng giữa các trang. Khi nhấp vào 1 Link, React Router sẽ thay đổi URL và render lại thành phần tương ứng mà không cần tải lại trang. Còn a/href là cách truyền thogn61, trình duyệt tải lại toàn bộ trang.
class col-md-*, mt-*, ms-* là 1 phần của hệ thống lưới 12 cột (grid system) và tiện ích (utilies) của Bootstrap. col-md-* ('md': 'medium') là cột trên màn hình máy tính áp dụng cho màn hình có độ rộng từ 768px (col-md-3 tức chiếm 3/12). mt-* là margin-top (0.25rem/đơn vị) (mt-4: thêm margin-top 1rem). ms-* là margin-start (ms-3: thêm margin 0.75rem).
*/ 
import React from "react"
import { useSelector } from "react-redux"; // auto chèn
import { Link, useNavigate } from "react-router-dom"
import MetaData from "./MetaData";
import Search from "./Search";
import { useGetMeQuery } from "../../redux/api/userApi";
import { useLazyLogoutQuery} from "../../redux/api/authApi";

const Header = () => {

  // console.log(data); // Dữ liệu người dùng đăng nhập từ backend

  const { isLoading } = useGetMeQuery();
  const [logout] = useLazyLogoutQuery();
  
  const { user } = useSelector((state) => state.auth)

  // Sau khi logout, reload lại trang với window.location.reload(). Không thể dùng useNavigate() vì không còn user nào để điều hướng
  const logoutHandler = () => {
    logout().then(() => {
      window.location.reload();
    });
  }

  const {cartItems} = useSelector((state) => state.cart)
  return (
    // Navigation bar: đặt ở trên cùng của web và chứa ác liên kết hoặc menu giúp người dùng điều hướng, truy cập các phần khác nhau của web
    <>
      <MetaData title={"Chi tiết sản phẩm"} />
      <div className="row no-gutters">
        
      <nav className="navbar row">
        <div className="col-12 col-md-3 ps-5">
          <div className="navbar-brand">
            <a href="/">
              <img src="../images/FashionShop_logo.svg" alt="FashionShop Logo" style={{width: '8rem'}}/>
            </a>
          </div>
        </div>
        <div className="col-12 col-md-5 mt-2 mt-md-0">
          <Search />
        </div>
        <div className="col-6 col-md-2 mt-4 mt-md-0 text-center text-md-end">
          <a href="/cart" style={{textDecoration: "none"}}>
            <i className="fa fa-shopping-cart cart-icon" aria-hidden="true" ></i>
            <span id="cart" className="ms-3"> Giỏ hàng </span>
            <span className="ms-1" id="cart_count">{cartItems?.length}</span>
          </a>
        </div>

        <div className="col-6 col-md-2 mt-4 mt-md-0 text-center text-md-end">          
          {user ? (
            <div className="ms-4 dropdown">
              <button
                className="btn dropdown-toggle text-white custom-dropdown-toggle"
                type="button"
                id="dropDownMenuButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <figure className="avatar avatar-nav">
                  <img
                    src={user?.avatar ? user?.avatar?.url
                      : "/images/default_avatar.jpg"}
                    alt="User Avatar"
                    className="rounded-circle"
                  />
                </figure>
                {/* Lấy tên (từ khoản trắng cuối cùng) */}
                <span className="username">{user?.name.split(' ').pop()}</span>
              </button>
              <div className="dropdown-menu w-100" aria-labelledby="dropDownMenuButton">
                {user?.role === "admin" && (
                  <Link className="dropdown-item" to="/admin/dashboard"> Dashboard{" "} </Link>
                )}
                
                <Link className="dropdown-item" to="/me/orders"> Đơn hàng{" "} </Link>

                <Link className="dropdown-item" to="/me/profile"> Tài khoản{" "} </Link>

                <Link className="dropdown-item text-danger" to="/" onClick={logoutHandler}> Đăng xuất{" "} </Link>
              </div>
            </div>
          ): (
            // Nếu không phải loading status, chỉ hiện nút đăng nhập
            !isLoading && (
              <Link to="/login" className="btn ms-4" id="login_btn"> Đăng nhập </Link>
            )
          )}  
        </div>
      </nav>
      </div>
    </>
  )
}

export default Header

// // Khi reload (F5) là tự log out
// const { data } = useLogoutQuery();
// console.log("====================================");
// console.log("logout => ", data);
// console.log("====================================");