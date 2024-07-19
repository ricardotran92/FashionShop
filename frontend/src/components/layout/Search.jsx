import React, { useState } from "react"
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [keyword, setkeyword] = useState("");
  const [category, setCategory] = useState(""); //
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      if (category.trim()){
        navigate(`/?keyword=${keyword}&category=${category}`);
      } else {
        navigate(`/?keyword=${keyword}`);
      }
    } else if (category.trim()) {
      navigate(`/?category=${category}`);
    } else {
      navigate(`/`);
    }
  }

  // Set category trên URL và navigate
  const setCategoryAndNavigate = (e, category) => {
    e.preventDefault();
    setCategory(category);
    navigate(`/?category=${category}`);
  };

// // Trong Search.jsx
// const handleChange = (event) => {
//   localStorage.setItem('category', event.target.value);
// }

  return (
    <form onSubmit={submitHandler}>
      <div className="input-group">
        {/* Tạo nút droplist để chọn category Nam/Nữ */}
        <div className="dropdown" onClick={() => setShowDropdown(!showDropdown)}>
          <button className="btn btn-secondary dropdown-toggle Btn" type="button">
            <i className="fa fa-bars" aria-hidden="true"></i>
          </button>
          {showDropdown && (
            <div className="dropdown-menu show">
              <a className="dropdown-item" href="#" onClick={(e) => setCategoryAndNavigate(e, 'Nam')}>Nam</a>
              <a className="dropdown-item" href="#" onClick={(e) => setCategoryAndNavigate(e, 'Nữ')}>Nữ</a>
              <a className="dropdown-item" href="#" onClick={(e) => setCategoryAndNavigate(e, '')}>Tất cả</a>
            </div>
          )}
        </div>

        <input
          type="text"
          id="search_field"
          aria-describedby="search_btn"
          className="form-control"
          placeholder="Nhập tên sản phẩm ..."
          name="keyword"
          value={keyword}
          onChange={(e) => setkeyword(e.target.value)}
        />

        <button id="search_btn" className="Btn" type="submit">
          <i className="fa fa-search icon" aria-hidden="true"></i>
        </button>
      </div>
    </form>
  )
}

export default Search
