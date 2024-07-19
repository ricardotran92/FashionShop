/* Bảo mật Route profile nếu chưa đăng nhập bằng ProtectedRoute
container-fluid sẽ chiếm 100% chiều rộng ở tất cả breakpoint, còn container thì sẽ có khoảng trắng ở 2 bên  
*/
import "./App.css";
// React router DOM quản lý routing. Router xác định các routes. Route: URL path
import { Route, BrowserRouter as Router, Routes} from "react-router-dom"

import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
// Toast package giúp hiển thị thông báo success, error, warning... https://www.npmjs.com/package/react-hot-toast
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 
import Top from "./components/layout/Top";
import useUserRoutes from "./components/routes/userRoutes";
import useAdminRoutes from "./components/routes/adminRoutes";
import NotFound from "./components/layout/NotFound";
import AboutUs from "./components/pages/AboutUs";
import FAQ from "./components/pages/FAQ";
import ContactUs from "./components/pages/ContactUs";
import PaymentGuide from "./components/pages/PaymentGuide";
import PrivacyPolicy from "./components/pages/PrivacyPolicy";
import ReturnPolicy from "./components/pages/ReturnPolicy";
import ShippingPolicy from "./components/pages/ShippingPolicy";
import ShoppingGuide from "./components/pages/ShoppingGuide";
import SizeGuide from "./components/pages/SizeGuide";
import StoreLocator from "./components/pages/StoreLocator";



function App() {

  const userRoutes = useUserRoutes();
  const adminRoutes = useAdminRoutes();

  return (
    <Router>
      <div className="App">
      {/* "react-hot-toast" */}
      <Toaster position="top-center" />
      {/* "react-toastify" */}
      <ToastContainer 
        position="top-center"
        autoClose={2000}
        hideProgressBar={true}
        draggable
      /> 
      {/* Page header từ ./components/layout/Footer */}
      <Header/>



      <div className="container-fluid">
        <Routes>
          {userRoutes}
          {adminRoutes}
          <Route path="/gioi-thieu-ve-fashionshop" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/cau-hoi-thuong-gap" element={<FAQ />} />
          <Route path="/chinh-sach-thanh-toan" element={<PaymentGuide />} />
          <Route path="/chinh-sach-bao-mat" element={<PrivacyPolicy />} />
          <Route path="/chinh-sach-doi-tra" element={<ReturnPolicy />} />
          <Route path="/chinh-sach-van-chuyen" element={<ShippingPolicy />} />
          <Route path="/huong-dan-mua-hang" element={<ShoppingGuide />} />
          <Route path="/huong-dan-chon-size" element={<SizeGuide />} />
          <Route path="/he-thong-cua-hang" element={<StoreLocator />} />

          <Route path="*" element={<NotFound />} />
        </Routes>

      </div>
      
      {/* Nút Scroll to Top */}
      <Top/>
              
      {/* Page Footer từ ./components/layout/Header*/}
      <Footer/>
    </div>
    </Router>
    
  );
}

export default App;
