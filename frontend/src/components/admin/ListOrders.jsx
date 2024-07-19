import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../layout/Loader";
import { Link } from "react-router-dom";
import MetaData from "../layout/MetaData";
import {
  useDeleteOrderMutation,
  useGetAdminOrdersQuery,
} from "../../redux/api/orderApi";
import AdminLayout from "../layout/AdminLayout";
import { AgGridReact } from "ag-grid-react";
import { AG_GRID_LOCALE_VN } from "@ag-grid-community/locale";

const ListOrders = () => {
  const [quickFilterText, setQuickFilterText] = useState("");

  const { data, isLoading, error } = useGetAdminOrdersQuery();
  console.log("data order", data)
  const [
    deleteOrder,
    { error: deleteError, isLoading: isDeleteLoading, isSuccess },
  ] = useDeleteOrderMutation();

  useEffect(() => {
    if (error) toast.error(error?.data?.message);

    if (deleteError) toast.error(deleteError?.data?.message);

    if (isSuccess) toast.success("Đơn hàng đã bị xóa ");
  }, [error, deleteError, isSuccess]);

  const deleteOrderHandle = (id) => {
    console.log(id);
    deleteOrder(id);
  };

  const setOrders = () => {
    const orders = {
      columns: [
        {
          label: "Mã đơn hàng",
          field: "id",
          sort: "asc",
        },
        {
          label: "Tình trạng thanh toán",
          field: "paymentStatus",
          sort: "asc",
          width: 150,
        },
        {
          label: "Trạng thái đơn hàng",
          field: "orderStatus",
          sort: "asc",
        },
        {
          label: "Thao tác",
          field: "actions",
          sort: "asc",
          width: 180,
        },
      ],

      rows: [],
    };

    data?.orders?.forEach((order) => {
      orders.rows.push({
        id: order?.shippingInfo?.orderID.toUpperCase(),
        paymentStatus: `${order?.paymentInfo?.status}`,
        orderStatus: order?.orderStatus,
        actions: (
          <>
            <Link
              to={`/admin/orders/${order?._id}`}
              className="btn btn-outline-primary"
            >
              <i className="fa fa-pencil"></i>
            </Link>
            <button
              className="btn btn-outline-danger ms-2"
              onClick={() => deleteOrderHandle(order?._id)}
              disable={isDeleteLoading}
            >
              <i className="fa fa-trash"></i>
            </button>
          </>
        ),
      });
    });

    return orders;
  };

  const columnDefs = [
    {
      headerName: "Mã đơn hàng",
      field: "id",
      sortable: true,
      filter: true,
      resizable: true,
      flex: 0,
      width: 350,
      cellClass: "grid-cell-centered",
    },
    {
      headerName: "Tổng thanh toán",
      field: "amount",
      sortable: true,
      filter: true,
      resizable: true,
      cellClass: "grid-cell-centered",
    },
    {
      headerName: "Thời gian đặt hàng",
      field: "orderdate",
      sortable: true,
      filter: true,
      resizable: true,
      cellClass: "grid-cell-centered",
    },
    {
      headerName: "Tình trạng thanh toán",
      field: "paymentStatus",
      sortable: true,
      filter: true,
      resizable: true,
      cellClass: "grid-cell-centered",
      cellStyle: (params) => {
        switch (params.value) {
          case "CHƯA THANH TOÁN":
            return { fontWeight: "bold", color: "#FFCC00" };
          default:
            return { fontWeight: "bold", color: "green" };
        }
      },
    },
    {
      headerName: "Trạng thái đơn hàng",
      field: "orderStatus",
      sortable: true,
      filter: true,
      resizable: true,
      cellClass: "grid-cell-centered",
      cellStyle: (params) => {
        switch (params.value) {
          case "DELIVERED":
            return { fontWeight: "bold", color: "green" };
          case "SHIPPED":
            return { fontWeight: "bold", color: "#FFCC00" };
          default:
            return { fontWeight: "bold", color: "red" };
        }
      },
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
          <Link
            to={`/admin/orders/${params.data?._id}`}
            className="btn btn-outline-primary"
            style={{
              fontSize: "13px",
            }}
          >
            <i className="fa fa-pencil"></i>
          </Link>

          <button
            style={{
              fontSize: "13px",
            }}
            className="btn btn-outline-danger ms-2"
            onClick={() => deleteOrderHandle(params.data?._id)}
            disable={isDeleteLoading}
          >
            <i className="fa fa-trash"></i>
          </button>
        </div>
      ),
      resizable: true,
    },
  ];

  const rowData = data?.orders?.map((order) => ({
    _id: order?._id,
    id: order?.shippingInfo?.orderID.toUpperCase(),
    amount: order?.totalAmount.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    }),
    orderdate: new Date(order?.createdAt).toLocaleString("vi-VN"),
    paymentStatus: order?.paymentInfo?.status.toUpperCase(),
    orderStatus: order?.orderStatus.toUpperCase(),
  }));

  if (isLoading) return <Loader />;

  return (
    <AdminLayout>
      <MetaData title={"Quản lý đơn hàng"} />
      <div className="row d-flex justify-content-center mt-3">
        <div
          className="col-12 col-lg-8"
          style={{ width: "80%", margin: "auto", overflowX: "auto" }}
        >

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <h1>{data?.orders?.length} Đơn hàng</h1>
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm..."
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
            />
          </div>
        </div>
      </div>

      <div style={{ width: "100%", margin: "auto", overflowX: "auto" }}>
        {/* <div style={{ width: "80%", margin: "auto", overflowX: "auto" }}>
          <div>
            <h1 class="my-5">{data?.orders?.length} Đơn hàng</h1>
          </div>

          <MDBDataTable
            data={setOrders()}
            infoLabel={["Hiển thị", "đến", "của", "đơn hàng"]}
            searchLabel="Tìm kiếm"
            paginationLabel={["Trước", "Sau"]}
            entriesLabel="Số đơn hàng mỗi trang"
            noRecordsFoundLabel="Không tìm thấy đơn hàng nào"
            noDatalabel="Không có đơn hàng nào"
            className="px-3"
            bordered
            striped
            hover
            noBottomColumns
            style={{ textAlign: "center" }}
          />
        </div> */}
      </div>
    </AdminLayout>
  );
};

export default ListOrders;
