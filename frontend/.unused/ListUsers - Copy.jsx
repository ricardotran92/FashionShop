import React, { useEffect } from "react";
import Loader from "../src/components/layout/Loader";
import { toast } from "react-hot-toast";
import { MDBDataTable } from "mdbreact";
import { Link } from "react-router-dom";
import MetaData from "../src/components/layout/MetaData";

import AdminLayout from "../src/components/layout/AdminLayout";
import { useGetAdminUsersQuery } from "../src/redux/api/userApi";

const ListUsers = () => {
  const { data, isLoading, error } = useGetAdminUsersQuery();

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }

    // if (deleteError) {
    //   toast.error(deleteError?.data?.message);
    // }

    // if (isSuccess) {
    //   toast.success("Order Deleted");
    // }
  }, [error]);

  // const deleteOrderHandler = (id) => {
  //   deleteOrder(id);
  // };

  const setUsers = () => {
    const users = {
      columns: [
        {
          label: "ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Họ tên",
          field: "name",
          sort: "asc",
        },
        {
          label: "Email",
          field: "email",
          sort: "asc",
        },
        {
          label: "SĐT",
          field: "phone",
          sort: "asc",
        },
        {
          label: "Địa chỉ",
          field: "address",
          sort: "asc",
        },
        {
          label: "Quyền",
          field: "role",
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

    data?.users?.forEach((user) => {
      users.rows.push({
        id: user?._id,
        name: user?.name,
        email: user?.email,
        phone: user?.phone,
        address: user?.address,
        role: user?.role,
        actions: (
          <>
            <Link
              to={`/admin/orders/${user?._id}`}
              className="btn btn-outline-primary"
            >
              <i className="fa fa-pencil"></i>
            </Link>

            <button
              className="btn btn-outline-danger ms-2"
              // onClick={() => deleteOrderHandler(user?._id)}
              // disabled={isDeleteLoading}
            >
              <i className="fa fa-trash"></i>
            </button>
          </>
        ),
      });
    });

    return users;
  };

  if (isLoading) return <Loader />;

  return (
    <AdminLayout>
      <MetaData title={"All Users"} />

      <h1 className="my-5">{data?.users?.length} Tài khoản User</h1>

      <MDBDataTable
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
      />
    </AdminLayout>
  );
};

export default ListUsers;
