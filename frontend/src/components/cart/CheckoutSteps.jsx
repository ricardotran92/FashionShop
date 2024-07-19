import {
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBContainer,
  MDBRow,
} from "mdb-react-ui-kit";
import React from "react";
import { Link } from "react-router-dom";

const CheckoutSteps = ({ shipping, confirmOrder, payment }) => {
  return (
    <>
      <MDBContainer className="py-5 pb-1 h-100 justify-content-center align-items-center">
        <MDBRow className="justify-content-center align-items-center h-100">
          <MDBCol md="10" lg="8" xl="6">
            <MDBCard className="card-stepper" style={{ borderRadius: "5px" }}>
              <MDBCardBody className="p-2">
                <div className="d-flex flex-row mb-4 pb-2"></div>
                <ul
                  id="progressbar-1"
                  className="mx-0 mt-0 mb-5 px-0 pt-0 pb-4"
                >
                  {shipping ? (
                    <li className="step0 active" id="step1">
                      <span style={{ marginLeft: "22px", marginTop: "12px" }}>
                        <Link
                          to="/cart"
                          style={{
                            color: "#488978",
                            textDecoration: "none",
                            "font-weight": "bold",
                          }}
                        >
                          Đặt hàng
                        </Link>
                      </span>
                    </li>
                  ) : (
                    <li className="step0 text-muted" id="step1x">
                      <span
                        style={{
                          marginLeft: "22px",
                          marginTop: "12px",
                          "font-weight": "bold",
                          color: "#455A64",
                        }}
                      >
                        Đặt hàng
                      </span>
                    </li>
                  )}
                  {confirmOrder ? (
                    <li className="step0 active text-center" id="step2">
                      <span>
                        <Link
                          to="/shipping"
                          style={{
                            color: "#488978",
                            textDecoration: "none",
                            "font-weight": "bold",
                          }}
                        >
                          Xác nhận
                        </Link>
                      </span>
                    </li>
                  ) : (
                    <li className="step0 text-muted text-center" id="step2x">
                      <span style={{ "font-weight": "bold", color: "#455A64" }}>Xác nhận</span>
                    </li>
                  )}
                  {payment ? (
                    <li className="step0 active text-end" id="step3">
                      <span style={{ marginRight: "22px" }}>
                        <Link
                          to="/confirm_order"
                          style={{
                            color: "#488978",
                            textDecoration: "none",
                            "font-weight": "bold",
                          }}
                        >
                          Hoàn tất
                        </Link>
                      </span>
                    </li>
                  ) : (
                    <li className="step0 text-muted text-end" id="step3x">
                      <span
                        style={{ marginRight: "22px", "font-weight": "bold", color: "#455A64" }}
                      >
                        Hoàn tất
                      </span>
                    </li>
                  )}
                </ul>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </>
  );
};

export default CheckoutSteps;
