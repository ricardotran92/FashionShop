/* defaultChecked chỉ đặt giá trị mặc định cho checkbox khi nó được render lần đầu tiên (F5), trong khi checked sẽ cập nhật giá trị của checkbox mỗi khi trạng thái của nó thay đổi(bao gồm việc thay đổi giá trị của nút Filter ở Header).
*/
import React, { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"; 
import { getPriceQueryParams } from "../../helpers/helpers";
import { PRODUCT_CATEGORIES, PRODUCT_SUBCATEGORIES, PRODUCT_SUBSUBCATEGORIES } from "../../constants/constants";

const Filters = () => {
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);
  const [category, setCategory] = useState(""); //
  const [subCategory, setSubCategory] = useState(""); //
  const [subSubCategory, setSubSubCategory] = useState(""); //


  const navigate = useNavigate();
  // let [searchParams] = useSearchParams();
  let [searchParams, setSearchParams] = useSearchParams(); //

  // Update giá trị lọc giá lên URL
  // useEffect(() => {
  //   searchParams.has('min') && setMin(searchParams.get('min'));
  //   searchParams.has('max') && setMax(searchParams.get('max'));
  // })
  useEffect(() => {
    searchParams.has('min') && setMin(searchParams.get('min'));
    searchParams.has('max') && setMax(searchParams.get('max'));
    searchParams.has('category') && setCategory(searchParams.get('category')); // Update category from URL
    searchParams.has('subCategory') && setSubCategory(searchParams.get('subCategory')); // Update subCategory from URL
    searchParams.has('subSubCategory') && setSubSubCategory(searchParams.get('subSubCategory')); // Update subSubCategory from URL
  }, [searchParams]); // Add searchParams to dependency array

  // Handle lọc Category và Ratings lên URL
  const handleClick = (checkbox) => {
    const checkboxes = document.getElementsByName(checkbox.name);
    // Chỉ chọn 1 checkbox
    checkboxes.forEach((item) => {
      if(item !== checkbox) item.checked = false
    });

    if(checkbox.checked === false) {
      // Xoá filter khỏi query khi không có check
      if(searchParams.has(checkbox.name)){
        searchParams.delete(checkbox.name);
        const path = window.location.pathname + "?" + searchParams.toString();
        navigate(path);
      }
    } else {
      // Set giá trị filter mới nếu có check
      if (searchParams.has(checkbox.name)) {
        searchParams.set(checkbox.name, checkbox.value)
      } else {
        // Nối giá trị filter mới
        searchParams.append(checkbox.name, checkbox.value);
      }

      const path = window.location.pathname + "?" + searchParams.toString();
      navigate(path);
    }
  }
  // Giữ check khi refresh (F5) trình duyệt
  const defaultCheckHandler = (checkboxType, checkboxValue) => {
    const value = searchParams.get(checkboxType);
    if(checkboxValue === value) return true;
    return false;
  }


  // Handle lọc giá lên URL
  const handleButtonClick = (e) => {
    e.preventDefault();
    searchParams = getPriceQueryParams(searchParams, "min", min);
    searchParams = getPriceQueryParams(searchParams, "max", max);
    const path = window.location.pathname + "?" + searchParams.toString();
    navigate(path);
  };

  // Trong Filters.jsx
useEffect(() => {
  const handleStorageChange = () => {
    const localCategory = localStorage.getItem('category');
    if (localCategory) {
      setCategory(localCategory);
    }
  };

  window.addEventListener('storage', handleStorageChange);

  // Cleanup function
  return () => {
    window.removeEventListener('storage', handleStorageChange);
  };
}, []); // Không có dependency


  return (
    <div className="border p-3 filter" >
      <h3>Bộ Lọc</h3>
      <hr />
      <h5 className="filter-heading mb-3">Giá</h5>
      <form
        id="filter_form"
        className="px-2"
        onSubmit={handleButtonClick}
      >
        <div className="row">
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Min ($)"
              name="min"
              value={min}
              onChange={(e) => setMin(e.target.value)}
            />
          </div>
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Max ($)"
              name="max"
              value={max}
              onChange={(e) => setMax(e.target.value)}
            />
          </div>
          <div className="col">
            <button type="submit" className="btn btn-primary">LỌC</button>
          </div>
        </div>
      </form>
      <hr />
      <h5 className="mb-3">Danh mục</h5>
      {PRODUCT_CATEGORIES?.map((category) => (
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            name="category"
            id="check4"
            value={category}
            // defaultChecked={defaultCheckHandler("category", category)}
            checked={defaultCheckHandler("category", category)}
            onClick={(e) => handleClick(e.target)}
          />
          <label className="form-check-label" for="check4"> {category} </label>
        </div>
      ))}
      
      <hr />
      {/* <h5 className="mb-3">SubCategory</h5> */}
      <h5 className="mb-3"></h5>
      {PRODUCT_SUBCATEGORIES[category]?.map((subCategory) => (
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            name="subCategory"
            id="check5"
            value={subCategory}
            defaultChecked={defaultCheckHandler("subCategory", subCategory)}
            onClick={(e) => handleClick(e.target)}
          />
          <label className="form-check-label" for="check5"> {subCategory} </label>
        </div>
      ))}

      <hr />
      {/* <h5 className="mb-3">SubSubCategory</h5> */}
      <h5 className="mb-3"></h5>
      {PRODUCT_SUBSUBCATEGORIES[subCategory]?.map((subSubCategory) => (
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            name="subSubCategory"
            id="check6"
            value={subSubCategory}
            defaultChecked={defaultCheckHandler("subSubCategory", subSubCategory)}
            onClick={(e) => handleClick(e.target)}
          />
          <label className="form-check-label" for="check6"> {subSubCategory} </label>
        </div>
      ))}

      <hr />
      
      
    </div>
  )
}

export default Filters
