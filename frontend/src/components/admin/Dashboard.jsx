import React, { useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SalesChart from "../charts/SalesChart";
import { toast } from "react-toastify";
import { useLazyGetDashboardSalesQuery } from "../../redux/api/orderApi";
import { vi } from "date-fns/locale";
import Loader from "../layout/Loader";
import MetaData from "../layout/MetaData";

const Dashboard = () => {
  const [startDate, setStartDate] = useState(new Date().setDate(1)); // setDate(1): để mặc định ban đầu là ngày 1 của tháng hiện tại
  const [endDate, setEndDate] = useState(new Date());

  const [getDashboardSales, { error, isLoading, data }] =
    useLazyGetDashboardSalesQuery();

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }

    if (startDate && endDate && !data) {
      getDashboardSales({
        startDate: new Date(startDate).toISOString(),
        endDate: endDate.toISOString(),
      }); // lấy dữ liệu doanh số từ API khi có start và end Date nhưng chưa có dữ liệu (lúc mới mở page Dashboard)
    }
  }, [error]); // có lỗi -> thông báo lỗi bằng toast.error

  const submitHandler = () => {
    // console.log("====================================");
    // console.log("Print out console the chosen start & end date:\n", new Date(startDate).toISOString());
    // console.log(endDate.toISOString());
    // console.log("====================================");
    getDashboardSales({
      startDate: new Date(startDate).toISOString(),
      endDate: endDate.toISOString(),
    });
  };

  // console.log("====================================");
  // console.log("data:\n", data);
  // console.log("====================================");

  if (isLoading) return <Loader />;

  return (
    <AdminLayout>
      <MetaData title={"Admin Dashboard"} />
      <div className="d-flex justify-content-start align-items-center">
        <div className="mb-3 me-4">
          <label className="form-label d-block">Từ ngày</label>
          <DatePicker
            dateFormat="dd/MM/yyyy"
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            locale={vi}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label className="form-label d-block">Đến ngày</label>
          <DatePicker
            dateFormat="dd/MM/yyyy"
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            locale={vi}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            className="form-control"
          />
        </div>
        <button
          className="btn fetch-btn ms-4 mt-3 px-5"
          onClick={submitHandler}
        >
          Lọc
        </button>
      </div>

      <div className="row pr-4 my-5 justify-content-center">
        <div className="col-xl-4 col-sm-12 mb-3">
          <div className="card text-white bg-success o-hidden h-100">
            <div className="card-body">
              <div className="text-center card-font-size">
                Doanh số
                <br />
                {/* <b>{(data?.totalSales.toFixed(0)).toLocaleString("vi-VN")}đ</b>  */}
                <b>
                  {new Intl.NumberFormat("vi-VN").format(
                    Math.round(data?.totalSales)
                  )}
                  đ
                </b>
                {/* toFix: Limit decimal digits, Math.round: làm tròn số nguyên gần nhất, Intl.NumberFormat("...").format(...) định dạng số */}
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-4 col-sm-12 mb-3">
          <div className="card text-white bg-primary o-hidden h-100">
            <div className="card-body">
              <div className="text-center card-font-size">
                Đơn hàng
                <br />
                <b>{data?.totalNumOrders}</b>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SalesChart salesData={data?.sales} />

      <div className="mb-5"></div>
    </AdminLayout>
  );
};

export default Dashboard;
