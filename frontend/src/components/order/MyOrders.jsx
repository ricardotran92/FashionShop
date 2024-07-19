import React, { useEffect, useState } from "react";
import { useMyOrdersQuery } from "../../redux/api/orderApi";
import { toast } from "react-toastify";
import Loader from "../layout/Loader";
// import { MDBDataTable } from "mdbreact";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import MetaData from "../layout/MetaData";
import { useDispatch } from "react-redux";
import { clearCart } from "../../redux/features/cartSlice";
import CheckoutSteps from "../cart/CheckoutSteps";
import { AgGridReact } from "ag-grid-react";
import { AG_GRID_LOCALE_VN } from "@ag-grid-community/locale";

const MyOrder = () => {
  const [quickFilterText, setQuickFilterText] = useState("");

  const { data, isLoading, error, isSuccess } = useMyOrdersQuery();
  console.log(data)
  const [searchParams] = useSearchParams();

  const orderSuccess = searchParams.get("order_success");

  const paymentSuccess = searchParams.get("status");

  const resultCode = searchParams.get("resultCode");

  const dispatch = useDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }

    if (
      (orderSuccess && orderSuccess === "true") ||
      (paymentSuccess && paymentSuccess === "1") ||
      (resultCode && resultCode === "0")
    ) {
      dispatch(clearCart());
      navigate("/me/orders");
      toast.success("Tạo đơn hàng thành công");
    }
    if (
      (orderSuccess && orderSuccess !== "true") ||
      (paymentSuccess && paymentSuccess !== "1") ||
      (resultCode && resultCode !== "0")
    ) {
      navigate("/cart");
      toast.error("Tạo đơn hàng thất bại");
    }
  }, [dispatch, error, navigate, orderSuccess, paymentSuccess, resultCode]);

  // const setOrders = () => {
  //   const orders = {
  //     columns: [
  //       {
  //         label: "Mã đơn hàng",
  //         field: "id",
  //         sort: "asc",
  //       },
  //       {
  //         label: "Tổng tiền thanh toán",
  //         field: "amount",
  //         sort: "asc",
  //       },
  //       {
  //         label: "Tình trạng thanh toán",
  //         field: "paymentStatus",
  //         sort: "asc",
  //       },
  //       {
  //         label: "Trạng thái đơn hàng",
  //         field: "orderStatus",
  //         sort: "asc",
  //       },
  //       {
  //         label: "Xem chi tiết",
  //         field: "actions",
  //         sort: "asc",
  //       },
  //     ],

  //     rows: [],
  //   };

  //   data?.orders?.forEach((order) => {
  //     orders.rows.push({
  //       id: order?.shippingInfo?.orderID.toUpperCase(),
  //       amount: order?.totalAmount.toLocaleString("vi-VN", {
  //         style: "currency",
  //         currency: "VND",
  //       }),
  //       paymentStatus: order?.paymentInfo?.status?.toUpperCase(),
  //       orderStatus: order?.orderStatus,
  //       actions: (
  //         <>
  //           <Link to={`/me/orders/${order?._id}`} className="btn btn-primary">
  //             <i className="fa fa-eye"></i>
  //           </Link>
  //           <Link
  //             to={`/invoice/orders/${order?._id}`}
  //             className="btn btn-success ms-2"
  //           >
  //             <i className="fa fa-print"></i>
  //           </Link>
  //         </>
  //       ),
  //     });
  //   });

  //   return orders;
  // };

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
            to={`/me/orders/${params.data?._id}`}
            className="btn btn-outline-primary"
            style={{
              border: "2px solid black",
              color: "black",
              backgroundColor: "transparent",
              fontSize: "11px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "black";
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "black";
            }}
          >
            <i className="fa fa-eye"></i>
          </Link>

          <Link
            to={`/invoice/orders/${params.data?._id}`}
            className="btn btn-success ms-2"
            style={{
              fontSize: "13px",
            }}
          >
            <i className="fa fa-print"></i>
          </Link>
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
    <div>
      <MetaData title={"Danh sách đơn hàng"} />
      <CheckoutSteps shipping confirmOrder payment />
      <>
        {/* <section>
        <div class="bg-image h-100" style={{ "background-color": "#f5f7fa" }}>
          <div class="mask d-flex align-items-center h-100">
            <div class="container">
              <div class="row justify-content-center">
                <div class="col-12">
                  <div class="card">
                    <div class="card-body p-0">
                      <div
                        class="table-responsive table-scroll"
                        data-mdb-perfect-scrollbar="true"
                        style={{ position: "relative" }}
                      >
                        <table class="table table-striped mb-0 text-center">
                          <thead style={{ "background-color": "#002d72" }}>
                            <tr>
                              <th scope="col">Mã đơn hàng</th>
                              <th scope="col">Type</th>
                              <th scope="col">Hours</th>
                              <th scope="col">Trainer</th>
                              <th scope="col">Spots</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Like a butterfly</td>
                              <td>Boxing</td>
                              <td>9:00 AM - 11:00 AM</td>
                              <td>Aaron Chapman</td>
                              <td>10</td>
                            </tr>
                            <tr>
                              <td>Mind &amp; Body</td>
                              <td>Yoga</td>
                              <td>8:00 AM - 9:00 AM</td>
                              <td>Adam Stewart</td>
                              <td>15</td>
                            </tr>
                            <tr>
                              <td>Crit Cardio</td>
                              <td>Gym</td>
                              <td>9:00 AM - 10:00 AM</td>
                              <td>Aaron Chapman</td>
                              <td>10</td>
                            </tr>                            
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}
      </>
      <div className="row d-flex justify-content-center mt-3">
        <div className="col-12 col-lg-8">
          {/* style={{ width: "80%", margin: "auto", overflowX: "auto" } */}

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
        <div>
          {/* <div style={{ width: "80%", margin: "auto", overflowX: "auto" }}>
        <div style={{ width: "100%", margin: "auto", overflowX: "auto" }}>
          <div>
            <h1 class="my-5">{data?.orders?.length} Đơn hàng</h1>
          </div>


          <MDBDataTable
            data={setOrders()}
            className="px-3"
            bordered
            striped
            hover
            noBottomColumns
            style={{ textAlign: "center" }}
          />
        </div>
      </div> */}
        </div>
      </div>
    </div>
  );
};

export default MyOrder;
