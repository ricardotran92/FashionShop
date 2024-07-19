import React from 'react'

const ContactUs = () => {
  return (
    <div className="post">
      <h1>Thông tin liên lạc</h1>
      <p>
        <strong>CÔNG TY CỔ PHẦN THỜI TRANG FASHIONSHOP</strong> cam kết mang đến cho khách hàng những sản phẩm thời trang chất lượng cao và dịch vụ chăm sóc khách hàng tận tình.
      </p>
      <p>
        Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Dưới đây là các thông tin liên lạc chi tiết của chúng tôi:
      </p>
      <div className="contact-info">
        <div className="contact-details">
          <p className="contact-title"><strong>Hotline:</strong></p>
          <p>1900 9090</p>
        </div>
        <div className="contact-details">
          <p className="contact-title"><strong>Giờ làm việc:</strong></p>
          <p>8:00 - 19:00 tất cả các ngày trong tuần</p>
        </div>
        <div className="contact-details">
          <p className="contact-title"><strong>Văn phòng chính:</strong></p>
          <p>Đường Hàn Thuyên, khu phố 6, phường Linh Trung, Thành phố Thủ Đức, Thành phố Hồ Chí Minh</p>
        </div>
      </div>
      <p>
        Chúng tôi luôn mong đợi sự phản hồi từ quý khách để ngày càng hoàn thiện dịch vụ và sản phẩm của mình. Mọi thắc mắc và yêu cầu hỗ trợ, vui lòng liên hệ qua thông tin trên. FashionShop rất hân hạnh được phục vụ bạn!
      </p>
    </div>
  );
}

export default ContactUs