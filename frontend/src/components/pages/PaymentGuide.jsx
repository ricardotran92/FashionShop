import React from 'react'

const AboutUs = () => {
  return (
    <div className="post">
      <h1>Hướng dẫn thanh toán</h1>
      <p>
        Để đơn giản hóa quy trình thanh toán cho quý khách hàng, FashionShop cung cấp nhiều phương thức thanh toán linh hoạt và tiện lợi.
      </p>
      <div className="payment-methods">
        <h2>1. Thanh toán bằng tiền mặt</h2>
        <p>Quý khách có thể thanh toán trực tiếp bằng tiền mặt khi đến mua hàng tại các cửa hàng của FashionShop.</p>
      </div>
      <div className="payment-methods">
        <h2>2. Thanh toán qua thẻ ngân hàng</h2>
        <p>FashionShop chấp nhận thanh toán bằng thẻ ngân hàng Visa, MasterCard và các loại thẻ nội địa khác. Quý khách vui lòng đảm bảo thẻ của mình có hỗ trợ thanh toán trực tuyến.</p>
      </div>
      <div className="payment-methods">
        <h2>3. Thanh toán qua cổng thanh toán trực tuyến</h2>
        <p>Để thuận tiện hơn cho quý khách, FashionShop hỗ trợ thanh toán qua các cổng thanh toán trực tuyến như PayPal, Stripe và các đối tác thanh toán khác.</p>
      </div>
      <div className="payment-methods">
        <h2>4. Thanh toán khi nhận hàng (COD)</h2>
        <p>Đối với đơn hàng có giá trị nhất định, FashionShop cung cấp dịch vụ thanh toán khi nhận hàng (COD), giúp quý khách kiểm tra sản phẩm trước khi thanh toán.</p>
      </div>
      <p>
        Quý khách vui lòng chọn phương thức thanh toán phù hợp và liên hệ với chúng tôi nếu cần hỗ trợ thêm thông tin chi tiết về thanh toán.
      </p>
    </div>
  );
}

export default AboutUs