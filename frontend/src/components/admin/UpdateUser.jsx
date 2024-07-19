import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";
import MetaData from "../layout/MetaData";
import AdminLayout from "../layout/AdminLayout";
import { useGetUserDetailQuery, useUpdateUserMutation } from "../../redux/api/userApi";
import PhoneInput from 'react-phone-number-input'

const UpdateUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("");

  const params = useParams();

  const { data } = useGetUserDetailQuery(params?.id);

  const [updateUser, { error, isSuccess }] = useUpdateUserMutation();

  useEffect(() => {
    if (data?.user) {
      setName(data?.user?.name);
      setEmail(data?.user?.email);
      const updatedPhone = data?.user?.phone ? (data?.user?.phone.startsWith('+') ? data?.user?.phone : `+84${data?.user?.phone}`):"+84";
      setPhone(updatedPhone);
      setAddress(data?.user?.address);
      setRole(data?.user?.role);
    }
  }, [data]);

  useEffect(() => {
    

    if (error) {
      toast.error(error?.data?.message);
    }

    if (isSuccess) {
      toast.success("Tài khoản đã cập nhật thành công");
      // navigate("admin/users");
    }
  }, [error, isSuccess]);

  const submitHandler = (e) => {
    e.preventDefault();

    // Dispatch login'
    const userData = {
      name,
      email,
      phone,
      address,
      role,
    };
    updateUser({ id: params?.id, body: userData });
  };

  return (
    <AdminLayout>
      <MetaData title={"Cập nhật User"} />
      <div className="row wrapper">
        <div className="col-10 col-lg-8">
          <form className="shadow-lg" onSubmit={submitHandler}>
            <h2 className="mb-4">Update User</h2>

            <div className="mb-3">
              <label htmlFor="name_field" className="form-label">
                Name
              </label>
              <input
                type="name"
                id="name_field"
                className="form-control"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email_field" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email_field"
                className="form-control"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="phone_field" className="form-label">
                Phone
              </label>
              <PhoneInput 
                international
                defaultCountry="VN"
                id="phone_field"
                className="form-control"
                name="phone"
                value={phone}
                onChange={(value) => setPhone(value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="address_field" className="form-label">
                Địa chỉ
              </label>
              <input
                type="text"
                id="address_field"
                className="form-control"
                name="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="role_field" className="form-label">
                Role
              </label>
              <select
                id="role_field"
                className="form-select"
                name="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="user">user</option>
                <option value="admin">admin</option>
              </select>
            </div>

            <button type="submit" className="btn update-btn w-100 py-2">
              Update
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UpdateUser;
