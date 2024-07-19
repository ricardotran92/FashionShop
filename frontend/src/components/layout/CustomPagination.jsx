import React, { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom";
import Pagination from "react-js-pagination";

const CustomPagination = ({ resPerPage, filteredProductsCount }) => {
  
  const [currentPage, setCurrentPage] = useState();

  // lấy đường dẫn trình duyệt
  let [searchParams] = useSearchParams();

  const navigate = useNavigate();
    
  // Lấy giá trị của 'page' trong đường dẫn của trình duyệt, nếu không có thì là 1
  const page = Number(searchParams.get("page")) || 1;
  console.log(page);
  
  useEffect(() => {
    setCurrentPage(page);
  }, [page]);

  const setCurrentPageNo = (pageNumber) => {
    setCurrentPage(pageNumber);

    // Dẫn user đến URL khi chọn số page bằng cách gán lại giá trị 'page'. Nếu link không có 'page' thì set giá trị mới
    if(searchParams.has("page")){
      searchParams.set("page", pageNumber);
    } else {
      searchParams.append("page", pageNumber);
    }

    const path = window.location.pathname + "?" + searchParams.toString();
    // alert(path);
    navigate(path);
  };

  return (
    <div className="d-flex justify-content-center my-5">
      {filteredProductsCount > resPerPage && (
        <Pagination
          activePage={currentPage}
          itemsCountPerPage={resPerPage}
          totalItemsCount={filteredProductsCount}
          pageRangeDisplayed={5}
          onChange={setCurrentPageNo}
          nextPageText={">"}
          prevPageText={"<"}
          firstPageText={"<<"}
          lastPageText={">>"}
          itemClass="page-item"
          linkClass="page-link"

        />
      )}
    </div>
  );

};

export default CustomPagination
