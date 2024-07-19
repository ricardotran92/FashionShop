import React from 'react'

const AboutUs = () => {
  return (
    <div className="post">
      <h1>Hệ thống cửa hàng</h1>
      <p>FashionShop tự hào là một trong những thương hiệu thời trang lớn và uy tín nhất Việt Nam, với trụ sở chính tại TP.HCM. Chúng tôi cam kết mang đến cho khách hàng những sản phẩm thời trang đa dạng và chất lượng, cùng với dịch vụ chăm sóc khách hàng tận tình và chu đáo.</p>
      <div className="branch">
        <h3>Trụ sở chính</h3>
        <p>Đường Hàn Thuyên, khu phố 6, phường Linh Trung, Thành phố Thủ Đức, Thành phố Hồ Chí Minh</p>
      </div>
      <div className="branch">
        <h5>Chi nhánh 1 - Mỹ Tho, Tiền Giang</h5>
        <p>123 Nguyễn Huệ, Phường 1, Thành phố Mỹ Tho, Tỉnh Tiền Giang</p>
      </div>
      <div className="branch">
        <h5>Chi nhánh 2 - Biên Hoà, Đồng Nai</h5>
        <p>456 Lê Lai, Phường Tân Hiệp, Thành phố Biên Hoà, Tỉnh Đồng Nai</p>
      </div>
      <div className="branch">
        <h5>Chi nhánh 3 - Bảo Lộc, Lâm Đồng</h5>
        <p>789 Lê Lợi, Phường Lộc Phát, Thành phố Bảo Lộc, Tỉnh Lâm Đồng</p>
      </div>
    </div>
  );
}

export default AboutUs