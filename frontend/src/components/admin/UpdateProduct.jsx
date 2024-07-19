import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import MetaData from "../layout/MetaData";
import AdminLayout from "../layout/AdminLayout";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetProductDetailsQuery,
  useUpdateProductMutation,
} from "../../redux/api/productsApi";
import {
  PRODUCT_CATEGORIES,
  PRODUCT_COLORS,
  PRODUCT_SIZES,
  PRODUCT_SUBCATEGORIES,
  PRODUCT_SUBSUBCATEGORIES,
} from "../../constants/constants";

const UpdateProduct = () => {
  const navigate = useNavigate();
  const params = useParams();

  const [product, setProduct] = useState({
    productID: "",
    name: "",
    description: "",
    origin: "",
    price: "",
    category: {
      name: "",
      subCategory: "",
      subSubCategory: "",
    },
    variants: [{ color: "", size: "", stock: "" }],
  });

  const [updateProduct, { isLoading, error, isSuccess }] =
    useUpdateProductMutation();

  const { data } = useGetProductDetailsQuery(params?.id);

  const [hasShownSuccessToast, setHasShownSuccessToast] = useState(false);
  useEffect(() => {
    if (data?.product) {
      setProduct({
        productID: data?.product?.productID,
        name: data?.product?.name,
        description: data?.product?.description,
        origin: data?.product?.origin,
        price: data?.product?.price,
        category: {
          name: data?.product?.category?.name,
          subCategory: data?.product?.category?.subCategory,
          subSubCategory: data?.product?.category?.subSubCategory,
        },
        variants: data?.product?.variants,
      });
    }

    if (error) {
      toast.error(error?.data?.message);
      // navigate("/admin/products");
    }

    if (isSuccess && !hasShownSuccessToast) {
      toast.success("Sản phẩm đã được cập nhật");
      setHasShownSuccessToast(true); // Mark shown toast -> prevent multiple toasts <- data
      // navigate("/admin/products");
    }
  }, [error, isSuccess, data, hasShownSuccessToast]);

  const { productID, name, description, origin, price, category, variants } =
    product;

  const onChange = (e) => {
    if (e.target.name.startsWith("variants")) {
      const [_, field, variantIndex] = e.target.name.split(".");
      const updatedVariants = [...product.variants];
      // updatedVariants[variantIndex][field] = e.target.value;
      // Create a new object for the updated variant to avoid direct mutation
      updatedVariants[variantIndex] = {
        ...updatedVariants[variantIndex],
        [field]: e.target.value,
      };
      setProduct({ ...product, variants: updatedVariants });
    } else if (e.target.name.includes("category")) {
      const categoryField = e.target.name.split(".")[1];
      setProduct({
        ...product,
        category: { ...product.category, [categoryField]: e.target.value },
      });
    } else {
      setProduct({ ...product, [e.target.name]: e.target.value });
    }
  };

  const addVariant = () => {
    setProduct({
      ...product,
      variants: [...product.variants, { color: "", size: "", stock: "" }],
    });
  };

  function removeVariant(index) {
    // Tạo một mảng mới không bao gồm biến thể với chỉ số được cung cấp
    const newVariants = product.variants.filter(
      (_, variantIndex) => variantIndex !== index
    );
    // Cập nhật trạng thái của sản phẩm với mảng biến thể mới
    setProduct({ ...product, variants: newVariants });
  }

  // Function kiểm trùng variants
  const hasDuplicateVariants = (variants) => {
    const variantPairs = {};
    for (const variant of variants) {
      const key = `${variant.color}-${variant.size}`;
      if (variantPairs[key]) {
        return true; // Duplicate found
      }
      variantPairs[key] = true;
    }
    return false; // No duplicates found
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (hasDuplicateVariants(product.variants)) {
      toast.error(
        "Có lỗi: Trùng lặp các cặp màu sắc và kích cỡ. Vui lòng kiểm tra lại."
      );
      return;
    } // Kiểm tra trùng biến thể (màu và kích cỡ)
    console.log("param?.id", params?.id);
    console.log(product);
    updateProduct({ id: params?.id, body: product });
  };

  return (
    <AdminLayout>
      <MetaData title={"Cập nhật sản phẩm"} />
      <div className="row wrapper">
        <div className="col-10 col-lg-10 mt-5 mt-lg-0">
          <form className="shadow rounded bg-body" onSubmit={submitHandler}>
            <h2 className="mb-4">Câp nhật Sản phẩm</h2>
            <div className="row">
              <div className="mb-3 col-3">
                <label htmlFor="productID_field" className="form-label">
                  Mã ID
                </label>
                <input
                  type="text"
                  id="productID_field"
                  className="form-control"
                  name="productID"
                  value={productID}
                  onChange={onChange}
                />
              </div>
              <div className="mb-3 col-9">
                <label htmlFor="name_field" className="form-label">
                  {" "}
                  Tên{" "}
                </label>
                <input
                  type="text"
                  id="name_field"
                  className="form-control"
                  name="name"
                  value={name}
                  onChange={onChange}
                />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="description_field" className="form-label">
                Mô tả
              </label>
              <textarea
                className="form-control"
                id="description_field"
                rows="8"
                name="description"
                value={description}
                onChange={onChange}
              ></textarea>
            </div>

            <div className="row">
              <div className="m b-3 col">
                <label htmlFor="origin_field" className="form-label">
                  {" "}
                  Nguồn gốc{" "}
                </label>
                <input
                  type="text"
                  id="origin_field"
                  className="form-control"
                  name="origin"
                  value={origin}
                  onChange={onChange}
                />
              </div>

              <div className="mb-3 col">
                <label htmlFor="price_field" className="form-label">
                  {" "}
                  Giá (VNĐ){" "}
                </label>
                <input
                  type="text"
                  id="price_field"
                  className="form-control"
                  name="price"
                  value={price}
                  onChange={onChange}
                />
              </div>
            </div>
            <div className="row">
              <div className="mb-3 col">
                <label htmlFor="category_field" className="form-label">
                  {" "}
                  Danh mục{" "}
                </label>
                <select
                  className="form-select"
                  id="category_field"
                  name="category.name"
                  value={category.name}
                  onChange={onChange}
                >
                  <option value="">Chọn danh mục</option>
                  {PRODUCT_CATEGORIES?.map((categoryName) => (
                    <option key={categoryName} value={categoryName}>
                      {categoryName}
                    </option>
                  ))}
                </select>
              </div>

              {/* SubCategory Selection */}
              <div className="mb-3 col">
                <label htmlFor="subCategory_field" className="form-label">
                  Danh mục phụ L2
                </label>
                <select
                  className="form-select"
                  id="subCategory_field"
                  name="category.subCategory"
                  value={category.subCategory}
                  onChange={onChange}
                  disabled={!category.name}
                >
                  <option value="">Vui lòng chọn</option>
                  {category.name &&
                    PRODUCT_SUBCATEGORIES[category.name].map((subcategory) => (
                      <option key={subcategory} value={subcategory}>
                        {subcategory}
                      </option>
                    ))}
                </select>
              </div>

              {/*  SubSubCategory Selection */}
              <div className="mb-3 col">
                <label htmlFor="subSubCategory_field" className="form-label">
                  Danh mục phụ L3
                </label>
                <select
                  className="form-select"
                  id="subSubCategory_field"
                  name="category.subSubCategory"
                  value={category.subSubCategory}
                  onChange={onChange}
                  disabled={!category.subCategory}
                >
                  <option value="">Vui lòng chọn</option>
                  {category.subCategory &&
                    PRODUCT_SUBSUBCATEGORIES[category.subCategory].map(
                      (subSubCategory) => (
                        <option key={subSubCategory} value={subSubCategory}>
                          {subSubCategory}
                        </option>
                      )
                    )}
                </select>
              </div>
            </div>

            {/* Variants form fields */}
            {product.variants.map((variant, index) => (
              <div key={index} className="row align-items-end">
                <div className="mb-3 col">
                  <label
                    htmlFor={`color_field_${index}`}
                    className="form-label"
                  >
                    Màu sắc
                  </label>
                  <select
                    // type="text"
                    id={`color_field_${index}`}
                    className="form-control"
                    name={`variants.color.${index}`}
                    value={variant.color}
                    onChange={(e) => onChange(e, index)}
                    title="Các màu sắc được chấp nhận: Trắng, Đen, Đỏ, Xanh, Vàng, Hồng, Cam, Xám, Nâu, Sọc, Họa tiết"
                  >
                    <option value="">Chọn màu</option>
                    {PRODUCT_COLORS.map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3 col">
                  <label htmlFor={`size_field_${index}`} className="form-label">
                    Size
                  </label>
                  <select
                    // type="text"
                    id={`size_field_${index}`}
                    className="form-control"
                    name={`variants.size.${index}`}
                    value={variant.size}
                    onChange={(e) => onChange(e, index)}
                    title="Các kích cỡ được chấp nhận: S, M, L, F"
                  >
                    <option value="">Chọn kích cỡ</option>
                    {PRODUCT_SIZES.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3 col">
                  <label
                    htmlFor={`stock_field_${index}`}
                    className="form-label"
                  >
                    Tồn kho
                  </label>
                  <input
                    type="number"
                    id={`stock_field_${index}`}
                    className="form-control"
                    name={`variants.stock.${index}`}
                    value={variant.stock}
                    onChange={(e) => onChange(e, index)}
                  />
                </div>
                <div className="mb-3 col-auto">
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => removeVariant(index)}
                  >
                    Xoá
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-primary mb-3"
              onClick={addVariant}
            >
              Thêm loại lưu kho
            </button>

            <button
              type="submit"
              className="btn w-100 py-2"
              disabled={isLoading}
            >
              {isLoading ? "Đang cập nhật..." : "CẬP NHẬT"}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UpdateProduct;
