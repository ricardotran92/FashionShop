/* chart.js - JavaScript open library for web charts.
react-chartjs-2 - A React wrapper for Chart.js; provide React components for supported Chart.js to deploy in React environment.
Multiaxis Line Chart.
 */
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function SalesChart({ salesData }) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Biểu đồ Doanh số và Đơn hàng",
      },
    },
    scales: {
      y: { // Trục Y mặc định cho dataset đầu tiên (Doanh số)
        type: 'linear',
        display: true,
        position: 'left',
        id: 'y-axis-sales',
      },
      y1: { // Trục Y thứ hai cho dataset thứ hai (Đơn hàng)
        type: 'linear',
        display: true,
        position: 'right',
        id: 'y-axis-orders',
        grid: {
          drawOnChartArea: false, // Chỉ vẽ grid cho trục Y mặc định
        },
      },
    },
  };
  
  const labels = salesData?.map((data) => data?.date);
  
  const data = {
    labels,
    datasets: [
      {
        label: "Doanh số",
        data: salesData?.map((data) => data?.sales),
        borderColor: "green",
        backgroundColor: "lighter green",
        yAxisID: "y", // Gán dataset này vào trục Y mặc định
      },
      {
        label: "Đơn hàng",
        data: salesData?.map((data) => data?.numOrders),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        yAxisID: "y1", // Gán dataset này vào trục Y thứ hai
      },
    ],
  };

  return <Line options={options} data={data} />;
}
