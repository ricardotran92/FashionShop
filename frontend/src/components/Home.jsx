/* 1 component trong React, chức năng hiển thị trang chủ của ứng dụng.
Để tìm kiếm theo keyword hoặc category, thêm điều kiện kiểm tra category trong JSX
row g-* để tạo khoảng cách giữa các sản phẩm. Ví dụ: g-0 loại bỏ khoảng cách giữa các sản phẩm, g-1 tạo khoảng cách 1rem giữa các sản phẩm. Mặc định là g (ứng g-3)
*/
import React, { useEffect } from "react"
import MetaData from "./layout/MetaData"
import { useGetProductsQuery } from "../redux/api/productsApi" // auto chèn khi chọn useGetProductsQuery
import ProductItem from "./product/ProductItem.jsx";
import Loader from "./layout/Loader.jsx"; // auto chèn khi chọn Loader
// import toast from "react-hot-toast"
import { toast } from "react-toastify";
import CustomPagination from "./layout/CustomPagination.jsx";
import { useSearchParams } from "react-router-dom";
import Filters from "./layout/Filters.jsx";
import BannerSlider from "./layout/Slider.jsx";
import Top from "./layout/Top.jsx";
import Sorters from "./layout/Sorters.jsx";
import Slider from "react-slick";


const productSliderSetting = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 4,
  autoplay: true,
  autoplayspeed: 2000,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 4,
        infinite: true,
        dots: true
      }
    },
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        initialSlide: 2
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  ]
};

const Home = () => {
  
  // Dùng hàm useSearchParams() từ react-router-dom để lấy các tham số từ URL
  let [searchParams] = useSearchParams();
  const page = searchParams.get("page") || 1;
  const keyword = searchParams.get("keyword") || ""; // keyword: từ khóa tìm kiếm
  const min = searchParams.get("min");
  const max = searchParams.get("max");
  const category = searchParams.get("category");
  const subCategory = searchParams.get("subCategory");
  const subSubCategory = searchParams.get("subSubCategory");
  const sort = searchParams.get("sort");

  const params = { page, keyword };

  // cateogry
  min !== null && (params.min = min);
  max !== null && (params.max = max);
  category !== null && (params.category = category);
  subCategory !== null && (params.subCategory = subCategory);
  subSubCategory !== null && (params.subSubCategory = subSubCategory);
  sort != null && (params.sort = sort);
  
  // console.log("====================================")
  // console.log(params);
  // console.log("====================================")
  // truyền số page number về backend bằng biến params
  const { data, isLoading, error, isError } = useGetProductsQuery(params);

  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message);
    }
  }, [isError]);
  // console.log(data, isLoading);

  useEffect(() => {
    // Fetch data based on category
    if (category) {
      // Fetch products by category
    } else {
      // Fetch all products
    }
  }, [category]);

  const columnSize = keyword ? 4 : 3;

  if (isLoading) return <Loader />

  return (
      <>
      <MetaData title={"Cửa hàng thời trang"} />
      <div className="row g-2">
        {/* Slider chỉ có ở Homepage */}
        {!keyword && !category && (
          <BannerSlider />
        )}

      {data?.topRatedProducts && data.topRatedProducts.length > 0 && (
        <div id="topRatedProducts" className="text-secondary">
          <h1>Sản phẩm được ưa chuộng</h1>
          {/* <div className="row g-1"> */}
          <div className="slider-container">
            <Slider {...productSliderSetting}>
              {data.topRatedProducts.map((product) => (
                // <ProductItem key={product._id} product={product} columnSize={columnSize} />
                <ProductItem key={product._id} product={product} columnSize={columnSize} isInSlider={true} />
              ))}
            </Slider>
          </div>
        </div>
      )}

        {/* Nếu kích thước từ medium (768px) thì Filter chiếm 3/12 grid, nhỏ hơn thì full width */}
        {(keyword || category || window.location.search.includes('category=')) && (
          <div className="col-12 col-md-3 mt-5" >
            <Filters />
          </div>
        )}
        {/* Nếu URL có keyword, category: Nếu kích thước từ medium (768px) thì Sản phẩm chiếm 9/12 grid, nhỏ hơn thì full width
        Nếu ở Homepage: chiếm full 12/12 grid */}
        <div className={keyword || category || window.location.search.includes('category=') ? "col-12 col-md-9": "col-12 col-md-12 "}>
          <h1 id="products_heading" className="text-secondary">
            {keyword || category ? `${data?.filteredProductsCount} Sản phẩm được tìm thấy với từ khoá: ${keyword}` : "Tất cả sản phẩm"}            
          </h1>
          {/* Thanh Filter chỉ xuất hiện khi URL chứa thuộc tính keyword, category */}
          {(keyword || category) && ( 
            <Sorters />
          )}

          <section id="products" className="mt-2">
            <div className="row g-1">
              {data?.products?.map((product) => (
                <ProductItem product = {product} columnSize={columnSize} />
              )) }
            
            </div>
          </section>

          <CustomPagination
            resPerPage={data?.resPerPage}
            filteredProductsCount={data?.filteredProductsCount}
          />
          {/* iFrame chỉ hiển thị ở Homepage. */}
          {!keyword && !category && !window.location.search.includes('category=') && (
            <div className="centered-container">
              <div className="centered-iframe">
                <iframe
                // width="560" height="315" 
                src="https://www.youtube.com/embed/mL9iDxi9B38?si=Z3v_wwyQ3sjq0D63" 
                title="YouTube video player" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerpolicy="strict-origin-when-cross-origin" 
                allowFullScreen
                ></iframe>
              </div>
            </div>
          )} 
        </div>
      </div>
      </>
  )
}

export default Home

/*
Nếu có keyword thì 9 column, không thì 12 column
3 column cho filter, 9 column cho sản phẩm
{keyword ? `${data?.products?.length} -> hiện đang show ra <= 4 sp

*/