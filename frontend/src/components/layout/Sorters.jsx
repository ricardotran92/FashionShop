import React, { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom";

const Sorters = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [sort, setSort] = useState(searchParams.get('sort') || '');
  const [initialized, setInitialized] = useState(false); // Thêm trạng thái initialized

  useEffect(() => {
    if (initialized) { // Chỉ cập nhật URL nếu người dùng đã chọn một lựa chọn sắp xếp
      const newSearchParams = new URLSearchParams(searchParams.toString());
      if (sort) {
        newSearchParams.set('sort', sort); // Cập nhật chỉ tham số 'sort'
      }
      else {
        newSearchParams.delete('sort'); // Xóa tham số 'sort' nếu giá trị của nó là chuỗi trống
      }
      navigate({ search: newSearchParams.toString() }); // Cập nhật URL với đối tượng newSearchParams
    }
  }, [sort, navigate, initialized, searchParams]);

  const handleSortChange = (event) => {
    setSort(event.target.value);
    setInitialized(true); // Cập nhật trạng thái initialized khi người dùng chọn một lựa chọn sắp xếp
  };

  
  return (
    <div>
      <div className="sort-button">
        <label htmlFor="sortOrder">Sắp xếp theo:</label>
        <select id="sortOrder" onChange={handleSortChange}>
          <option value="">Để trống</option>
          <option value="price">Giá: Thấp đến Cao</option>
          <option value="-price">Giá: Cao đến Thấp</option>
          <option value="ratings">Đánh giá: Thấp đến Cao</option>
          <option value="-ratings">Đánh giá: Cao đến Thấp</option>
        </select>
      </div>
    </div>
  )
}

export default Sorters