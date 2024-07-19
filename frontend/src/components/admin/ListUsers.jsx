import React, { useEffect, useState } from "react";
import Loader from "../layout/Loader";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import MetaData from "../layout/MetaData";
import AdminLayout from "../layout/AdminLayout";
import {
  useDeleteUserMutation,
  useGetAdminUsersQuery,
} from "../../redux/api/userApi";
// import 'ag-grid-community/styles/ag-grid.css'; // Core styles
// import 'ag-grid-community/styles/ag-theme-alpine.css'; // Theme
import { AgGridReact } from "ag-grid-react";
import { AG_GRID_LOCALE_VN } from "@ag-grid-community/locale";
import { Button } from "react-bootstrap";
import * as XLSX from "xlsx";

const ListUsers = () => {
  const { data, isLoading, error } = useGetAdminUsersQuery();
  const [quickFilterText, setQuickFilterText] = useState(""); // Filter cho table

  const [
    deleteUser,
    { isLoading: isDeleteLoading, error: deleteError, isSuccess },
  ] = useDeleteUserMutation();


  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }

    if (deleteError) {
      toast.error(deleteError?.data?.message);
    }

    if (isSuccess) {
      toast.success("Tài khoản đã được xóa thành công!");
    }
  }, [error, deleteError, isSuccess]);

  const deleteUserHandler = (id) => {
    deleteUser(id);
  };

  const columnDefs = [
    {
      headerName: "ID",
      field: "id",
      sortable: true,
      filter: true,
      resizable: true,
    },
    {
      headerName: "Họ tên",
      field: "name",
      sortable: true,
      filter: true,
      resizable: true,
    },
    {
      headerName: "Email",
      field: "email",
      sortable: true,
      filter: true,
      resizable: true,
    },
    {
      headerName: "SĐT",
      field: "phone",
      sortable: true,
      filter: true,
      resizable: true,
    },
    {
      headerName: "Địa chỉ",
      field: "address",
      sortable: true,
      filter: true,
      resizable: true,
    },
    {
      headerName: "Quyền",
      field: "role",
      sortable: true,
      filter: true,
      resizable: true,
    },
    {
      headerName: "Hành động",
      field: "actions",
      cellRenderer: (params) => (
        <>
          <Link
            to={`/admin/users/${params.data.id}`}
            className="btn btn-outline-primary button-outline"
          >
            <i className="fa fa-pencil"></i>
          </Link>
          <button
            className="btn btn-outline-danger ms-2 button-outline"
            onClick={() => deleteUserHandler(params.data.id)}
            disabled={isDeleteLoading}
          >
            <i className="fa fa-trash"></i>
          </button>
        </>
      ),
      resizable: true,
    },
  ];

  const rowData = data?.users?.map((user) => ({
    id: user?._id,
    name: user?.name,
    email: user?.email,
    phone: user?.phone,
    address: user?.address,
    role: user?.role,
  }));

  if (isLoading) return <Loader />;

  const onExportClick = () => {
    // Tạo một workbook mới
    const wb = XLSX.utils.book_new();

    // Chuyển đổi dữ liệu sang sheet
    const ws = XLSX.utils.json_to_sheet(rowData);

    // Thêm sheet vào workbook
    XLSX.utils.book_append_sheet(wb, ws, "Users");

    // Tạo tên file
    const exportFileName = "users_data.xlsx";

    // Xuất file
    XLSX.writeFile(wb, exportFileName);
    };

  return (
    <AdminLayout>
      <MetaData title={"All Users"} />

      <h1 className="my-5">{data?.users?.length} Tài khoản User</h1>

      {/* <MDBDataTable
        data={setUsers()}
        infoLabel={["Hiển thị", "đến", "của", "user"]}
        searchLabel="Tìm kiếm"
        paginationLabel={["Trước", "Sau"]}
        entriesLabel="Số user mỗi trang"
        noRecordsFoundLabel="Không tìm thấy user nào"
        noDatalabel="Không có user nào"
        className="px-3 user-list-table"
        bordered
        striped
        hover
      /> */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Tìm kiếm..."
          onChange={(e) => setQuickFilterText(e.target.value)}
          // style={{ marginBottom: "10px" }}
        />
        <Button onClick={onExportClick}>
          <img src="../images/excel.png" alt="Excel_icon" style={{ width: '20px', height: '20px' }} />
          {' '} Xuất Excel
        </Button>
      </div>

      <div className="ag-theme-alpine" style={{ height: 600, width: "100%" }}>
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
          // localeText={{
          //   noRowsToShow: 'Không tìm thấy user nào',
          //   page: 'Trang',
          //   of: 'của',
          //   to: 'đến',
          //   pageSize: 'Số user mỗi trang',
          //   rowsPerPage: 'Số user mỗi trang',
          //   firstPage: 'Trang Đầu',
          //   previousPage: 'Trang Trước',
          //   nextPage: 'Trang Kế',
          //   lastPage: 'Trang Cuối',
          // }}
        />
      </div>
    </AdminLayout>
  );
};

export default ListUsers;
