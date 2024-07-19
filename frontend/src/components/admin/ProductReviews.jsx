import React, { useState, useEffect } from "react";
import Loader from "../layout/Loader";
import { toast } from "react-hot-toast";
import MetaData from "../layout/MetaData";
import AdminLayout from "../layout/AdminLayout";
import {
  useDeleteReviewMutation,
  useLazyGetProductReviewsQuery,
} from "../../redux/api/productsApi";
import { AgGridReact } from "ag-grid-react";
import { AG_GRID_LOCALE_VN } from "@ag-grid-community/locale";

const ProductReviews = () => {
  const [quickFilterText, setQuickFilterText] = useState("");

  const [productId, setProductId] = useState(
    "Nhập mã sản phẩm để tìm bình luận"
  );

  const [getProductReviews, { data, isLoading, error }] =
    useLazyGetProductReviewsQuery();
  console.log("day la data", data);

  const [
    deleteReview,
    { error: deleteError, isLoading: isDeleteLoading, isSuccess },
  ] = useDeleteReviewMutation();

  useEffect(() => {
    if (error) toast.error(error?.data?.message);

    if (deleteError) toast.error(deleteError?.data?.message);

    if (isSuccess) toast.success("Đã xóa bình luận");
  }, [data, deleteError, error, isSuccess]);

  const submitHandler = (e) => {
    // console.log("productId la", productId);
    e.preventDefault();
    getProductReviews(productId);
    // console.log("data la", data);
  };

  const deleteReviewHandle = (id) => {
    // console.log("productId 2 la", productId);
    deleteReview({ productId, id });
  };

  const setReviews = () => {
    const reviews = {
      columns: [
        {
          label: "Mã đánh giá",
          field: "id",
          sort: "asc",
        },
        {
          label: "Xếp hạng",
          field: "rating",
          sort: "asc",
        },
        {
          label: "Bình luận",
          field: "comment",
          sort: "asc",
        },
        {
          label: "Người mua",
          field: "user",
          sort: "asc",
        },
        {
          label: "Thao tác",
          field: "actions",
          sort: "asc",
        },
      ],
      rows: [],
    };

    data?.reviews?.forEach((review) => {
      //console.log("vonglap", review)
      reviews.rows.push({
        id: review?._id.toUpperCase(),
        rating: review?.rating,
        comment: review?.comment,
        user: review?.user?.name,
        actions: (
          <>
            <button
              className="btn btn-outline-danger ms-2"
              onClick={() => deleteReviewHandle(review?._id)}
              disable={isDeleteLoading}
            >
              <i className="fa fa-trash"></i>
            </button>
          </>
        ),
      });
    });

    return reviews;
  };

  const columnDefs = [
    {
      headerName: "Mã đánh giá",
      field: "id",
      sortable: true,
      filter: true,
      resizable: true,
      flex: 0,
      width: 350,
      cellClass: "grid-cell-centered",
    },
    {
      headerName: "Xếp hạng",
      field: "rating",
      sortable: true,
      filter: true,
      resizable: true,
      cellClass: "grid-cell-centered",
    },
    {
      headerName: "Bình luận",
      field: "comment",
      sortable: true,
      filter: true,
      resizable: true,
      cellClass: "grid-cell-centered",
    },
    {
      headerName: "Người mua",
      field: "user",
      sortable: true,
      filter: true,
      resizable: true,
      cellClass: "grid-cell-centered",
    },
    {
      headerName: "Chi tiết",
      field: "actions",
      cellRenderer: (params) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <button
            style={{
              fontSize: "13px",
            }}
            className="btn btn-outline-danger ms-2"
            onClick={() => {
              deleteReviewHandle(params.data?._id);
            }}
            disable={isDeleteLoading}
          >
            <i className="fa fa-trash"></i>
          </button>
        </div>
      ),
      resizable: true,
    },
  ];

  const rowData = data?.reviews?.map((review) => ({
    _id: review?._id,
    id: review?._id.toString().toUpperCase(),
    rating: review?.rating,
    comment: review?.comment,
    user: review?.user?.name,
  }));

  if (isLoading) return <Loader />;

  return (
    <AdminLayout>
      <MetaData title={"Quản lý đánh giá"} />
      {/* <div className="row justify-content-center my-5"> */}
      <div className="row d-flex justify-content-center mt-3">
        <div className="col-6">
          <form onSubmit={submitHandler}>
            <div className="mb-3">
              <label for="productId_field" className="form-label fw-bold">
                Nhập mã sản phẩm
              </label>
              <input
                type="text"
                id="productId_field"
                className="form-control"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              />
            </div>

            <button
              id="search_button"
              type="submit"
              className="btn btn-primary w-100 py-2"
            >
              TÌM KIẾM
            </button>
          </form>
        </div>
        <div
          className="col-12 col-lg-8"
          style={{ width: "80%", margin: "auto", overflowX: "auto" }}
        >
          <div
            className="my-4"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <div></div>
            <input
              type="text"
              placeholder="Lọc tìm kiếm..."
              onChange={(e) => setQuickFilterText(e.target.value)}
              style={{ height: "38px" }}
            />
          </div>
          <div className="ag-theme-alpine">
            <AgGridReact
              columnDefs={columnDefs}
              rowData={rowData}
              getRowStyle={(params) => {
                return {
                  backgroundColor:
                    params.node.rowIndex % 2 === 0 ? "#f5f5f5" : "#ffffff",
                };
              }} // Hàng chẵn có màu này, hàng lẻ có màu kia
              domLayout="autoHeight"
              defaultColDef={{
                flex: 1,
                minWidth: 100,
              }}
              pagination={true}
              paginationPageSize={10}
              localeText={AG_GRID_LOCALE_VN}
              quickFilterText={quickFilterText}
              loading={false}
            />
          </div>
        </div>
      </div>

      {/* <MDBDataTable
        data={setReviews()}
        className="px-3"
        bordered
        striped
        hover
        style={{ textAlign: "center" }}
      /> */}
      {/* {data?.reviews?.length > 0 ? (
      ) : (
        <p className="mt-5.text-center">Không có đánh giá nào</p>
      )} */}
    </AdminLayout>
  );
};

export default ProductReviews;
