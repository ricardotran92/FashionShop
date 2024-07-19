import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import axios from "axios"; // npm install axios

export const getAddressData = catchAsyncErrors(async (req, res, next) => {

  const options = {
    method: "get",
    url: `https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json`,
  };
  const response = await axios(options);
  //console.log(response, response.status, response.data);
  res.status(response.status).json(response.data);
});