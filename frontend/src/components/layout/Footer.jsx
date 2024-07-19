/* 'racfe' để tạo functional component với export
class="img-fluid" để responsive image

*/
import React from 'react'

const Footer = () => {
  return (

    

    // <footer className="py-1 pt-5">
    <footer className="page-footer">
      
      <div className="footer content">
        <div className="footer-content">
          <div className="row">
            <div className="footer-column footer-column1 col-12 col-md-3">
              <div className="footer-item">
                <h4 className="footer-logo">
                  <a title="FashionShop" href="https://FashionShop.vn/"> 
                    <img src="../images/FashionShop_logo.svg" alt="" className=""/>
                  </a>
                </h4>
                <ul className="footer-links footer-address">
                  <li className="ft-hotline">CÔNG TY CỔ PHẦN THỜI TRANG FASHIONSHOP <br/>Hotline: 1900 9090 <br/>8:00 - 19:00 tất cả các ngày trong tuần.
                    <p>&nbsp;</p>
                  </li>
                  <li className="ft-locator"><strong>VP Chính:</strong> Đường Hàn Thuyên, khu phố 6, phường Linh Trung, Thành phố Thủ Đức, Thành phố Hồ Chí Minh</li>
                </ul>
              </div>
            </div>
            <div className="footer-column footer-column2 col-12 col-md-3">
              <div className="footer-item">
                <h4 className="footer-title active">GIỚI THIỆU FASHIONSHOP</h4>
                <ul className="footer-links">
                  <li><a title="FashionShop" href="./gioi-thieu-ve-fashionshop">Giới thiệu</a></li>
                  <li><a title="FashionShop" href="./blog">Blog</a></li>
                  <li><a href="./he-thong-cua-hang">Hệ thống cửa hàng</a></li>
                  <li><a title="FashionShop" href="./contact">Liên hệ với FashionShop</a></li>
                  <li><a title="FashionShop" href="./chinh-sach-bao-mat">Chính sách bảo mật</a></li>
                </ul>
              </div>
            </div>
            <div className="footer-column footer-column3 col-12 col-md-3">
              <div className="footer-item">
                <h4 className="footer-title active">HỖ TRỢ KHÁCH HÀNG</h4>
                <ul className="footer-links">
                  <li><a title="FashionShop" href="./cau-hoi-thuong-gap">Hỏi đáp</a></li>
                  <li><a href="./chinh-sach-van-chuyen">Chính sách vận chuyển</a></li>
                  <li><a title="FashionShop" href="./huong-dan-chon-size">Hướng dẫn chọn kích cỡ</a></li>
                  <li><a href="./chinh-sach-thanh-toan">Hướng dẫn thanh toán</a></li>
                  <li><a href="./chinh-sach-doi-tra">Quy định đổi hàng</a></li>
                  <li><a href="./huong-dan-mua-hang">Hướng dẫn mua hàng</a></li>
                </ul>
              </div>
            </div>
            <div className="footer-column footer-column4 col-12 col-md-3">
              <div className="footer__info">
                <div className="footer-title"><span className="logo-title">KẾT NỐI</span></div>
                <ul className="footer-social flex-wrap">
                  <li className="facebook"><a title="FashionShop" href="https://www.facebook.com/FashionShop/">&nbsp;</a></li>
                  <li className="instagram"><a title="FashionShop" href="https://www.instagram.com/FashionShop/">&nbsp;</a></li>
                  <li className="youtube"><a title="FashionShop" href="https://www.youtube.com/c/FashionShop/featured">&nbsp;</a></li>
                </ul>
                <div className="footer-title"><span className="logo-title">Phương thức thanh toán</span></div>
                <div className="pay"><img src="/../images/pay.png" alt="" className="img-fluid"/></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="text-center mt-1 fw-bold">
        Copyright © 2024 FashionShop.
      </p>
    </footer>
    
  )
}

export default Footer
