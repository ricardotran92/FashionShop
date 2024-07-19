import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../layout/Loader";
import { Link } from "react-router-dom";
import MetaData from "../layout/MetaData";
import { useDeleteProductMutation, useGetAdminProductsQuery } from "../../redux/api/productsApi";
import AdminLayout from "../layout/AdminLayout";
import { AgGridReact } from "ag-grid-react";
import { AG_GRID_LOCALE_VN } from "@ag-grid-community/locale";
import { Button } from "react-bootstrap";
import * as XLSX from "xlsx";

const ListProducts = () => {
  const { data, isLoading, error } = useGetAdminProductsQuery();
  const [quickFilterText, setQuickFilterText] = useState(""); // Filter cho table
  const [deleteProduct, { isLoading: isDeleteLoading, error: deleteError, isSuccess }] = useDeleteProductMutation();

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }

    if (deleteError) {
      toast.error(deleteError?.data?.message);
    }

    if (isSuccess) {
      toast.success("Xóa sản phẩm thành công");
    }
  }, [error, deleteError, isSuccess]);

  const deleteProductHandler = (id) => {
    deleteProduct(id);
  }

  // MDBDataTable
  const setProducts = () => {
    const products = {
      columns: [
        {
          label: "Mã sản phẩm",
          field: "id",
          sort: "asc",
        },
        {
          label: "Tên sản phẩm",
          field: "name",
          sort: "asc",
        },
        {
          label: "Tồn kho",
          field: "variantStock",
          sort: "asc",
        },
        {
          label: "Hành động",
          field: "actions",
          sort: "asc",
        },
      ],

      rows: [],
    };

    data?.products?.forEach((product) => {
      const variantDescriptions = product.variants.map((variant, index) => (
        <React.Fragment key={index}>
          {`${variant.color} / ${variant.size}: ${variant.stock}`}
          <br />
        </React.Fragment>
      ));


      products.rows.push({
        id: product?.data.id, // product?._id,
        name: `${product?.name}`, // rút gọn tên với `${product?.name?.substring(0,20)}...`
        // stock: product?.stock,
        variantStock: variantDescriptions,
        actions: (
          <>
            <Link
              to={`/admin/products/${product?.data.id}`}
              className="btn btn-outline-primary"
              title="Chỉnh sửa sản phẩm"
            >
              <i className="fa fa-pencil"></i>
            </Link>
            <Link
              to={`/admin/products/${product?._id}/upload_images`}
              className="btn btn-outline-success ms-2"
              title="Cập nhật hình ảnh sản phẩm"
            >
              <i className="fa fa-image"></i>
            </Link>
            <button
              to={`/invoice/orders/${product?._id}`}
              className="btn btn-outline-danger ms-2"
              onClick={() => deleteProductHandler(product?._id)}
              disabled={isDeleteLoading}
              title="Xoá sản phẩm"
            >
              <i className="fa fa-trash"></i>
            </button>
          </>
        ),
      });
    });

    return products;
  };

  // AgGrid
  // const columnDefs = [
  const [autoHeight, setAutoHeight] = useState(true);
  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "Mã sản phẩm",
      field: "productID",
      sortable: true,
      filter: true,
      resizable: true,
    },
    {
      headerName: "Tên sản phẩm",
      field: "name",
      sortable: true,
      filter: true,
      resizable: true,
    },
    {
      headerName: "Đã bán",
      field: "sellQty",
      sortable: true,
      filter: true,
      resizable: true,
    },
    {
      headerName: "Tồn kho",
      field: "variantStock",
      sortable: true,
      filter: true,
      resizable: true,
      autoHeight: true,
      cellRenderer: (params) => {
        if (!params.value) {
          return 'Chưa tạo loại màu/size';
        }
        return params.value.map((variant, index) => (
          <React.Fragment key={index}>
            {`${variant.color} / ${variant.size}: ${variant.stock}`}
            <br />
          </React.Fragment>
        ));
      },
    },
    {
      headerName: "Hành động",
      field: "actions",
      cellRenderer: (params) => (
        <>
          <Link
            to={`/admin/products/${params.data.id}`}
            className="btn btn-outline-primary button-outline"
            title="Chỉnh sửa sản phẩm"
          >
            <i className="fa fa-pencil"></i>
          </Link>
          <Link
            to={`/admin/products/${params.data.id}/upload_images`}
            className="btn btn-outline-success ms-2 button-outline"
            title="Cập nhật hình ảnh sản phẩm"
          >
            <i className="fa fa-image"></i>
          </Link>
          <button
            className="btn btn-outline-danger ms-2 button-outline"
            onClick={() => deleteProductHandler(params.data.id)}
            disabled={isDeleteLoading}
            title="Xoá sản phẩm"
          >
            <i className="fa fa-trash"></i>
          </button>
        </>
      ),
      resizable: true,
    },
  ]);

  const rowData = data?.products?.map((product) => ({
    id: product?._id,
    productID: product?.productID,
    name: product?.name,
    sellQty: product?.sellQty,
    variantStock: product?.variants.map((variant) => ({
      color: variant.color,
      size: variant.size,
      stock: variant.stock,
    })),
    actions: {},
  }));

  // Hàm để chuyển đổi trạng thái autoHeight
  const toggleAutoHeight = () => {
    setAutoHeight(!autoHeight);
  };

  // Cập nhật định nghĩa cột khi trạng thái autoHeight thay đổi
  useEffect(() => {
    setColumnDefs(currentDefs => currentDefs.map(col => {
      if (col.field === 'variantStock') {
        return { ...col, autoHeight: autoHeight };
      }
      return col;
    }));
  }, [autoHeight]);

  // Hàm để xử lý việc hiển thị chi tiết sản phẩm
  function showDetails(productData) {
    // Logic để hiển thị modal hoặc panel mở rộng với dữ liệu chi tiết của sản phẩm
    console.log("Hiển thị chi tiết cho sản phẩm: ", productData);
  }

  if (isLoading) return <Loader />;

  const onExportClick = () => {
    // Chuyển đổi dữ liệu
    const modifiedData = rowData.map(row => ({
      ...row,
      variantStock: row.variantStock.map(variant => `${variant.color} / ${variant.size}: ${variant.stock}`).join('; ')
    }));

    // Tạo một workbook mới
    const wb = XLSX.utils.book_new();

    // Chuyển đổi dữ liệu sang sheet
    // const ws = XLSX.utils.json_to_sheet(rowData);
    const ws = XLSX.utils.json_to_sheet(modifiedData);

    // Thêm sheet vào workbook
    XLSX.utils.book_append_sheet(wb, ws, "Products");

    // Tạo tên file
    const exportFileName = "products_data.xlsx";

    // Xuất file
    XLSX.writeFile(wb, exportFileName);
  };

  return (
    <AdminLayout>
      <MetaData title={"Danh sách sản phẩm"} />

      <div style={{ width: "100%", margin: "auto", overflowX: "auto" }}>
        <div style={{ width: "1000px", margin: "auto", overflowX: "auto" }}> 
          <div>
            <h1 class="my-5">{data?.products?.length} Sản phẩm</h1>
          </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Tìm kiếm..."
          onChange={(e) => setQuickFilterText(e.target.value)}
        />
        <div style={{ display: 'flex', gap: '10px' }}> {/* Sử dụng gap để tạo khoảng cách */}
          <Button onClick={toggleAutoHeight}>
            {autoHeight ? "Thu gọn thông tin tồn kho" : "Xem chi tiết tồn kho"}
          </Button>
          <Button onClick={onExportClick}>
            <img src="../images/excel.png" alt="Excel_icon" style={{ width: '20px', height: '20px' }} />
            {' '}Xuất Excel
          </Button>
        </div>
      </div>

          {/* <MDBDataTable
            data={setProducts()}
            infoLabel={["Hiển thị", "đến", "của", "sản phẩm"]}
            searchLabel="Tìm kiếm"
            paginationLabel={["Trước", "Sau"]}
            entriesLabel="Số sản phẩm mỗi trang"
            noRecordsFoundLabel="Không tìm thấy sản phẩm nào"
            noDatalabel="Không có sản phẩm nào"
            className="px-3 product-list-table"
            bordered
            striped
            hover
            noBottomColumns
          /> */}

          <div className="ag-theme-alpine" style={{ height: 600, width: "100%" }}>
            <AgGridReact
              columnDefs={columnDefs}
              rowData={rowData}
              getRowStyle={(params) => ({
                backgroundColor: params.node.rowIndex % 2 === 0 ? "#f5f5f5" : "#ffffff",
              })}
              domLayout="autoHeight"
              defaultColDef={{
                flex: 1,
                minWidth: 100,
              }}
              pagination={true}
              paginationPageSize={10}
              localeText={AG_GRID_LOCALE_VN}
              quickFilterText={quickFilterText}
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ListProducts;
