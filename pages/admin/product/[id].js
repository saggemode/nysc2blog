import { useState } from "react";
import React, { useEffect, useReducer } from "react";
import { useForm } from "react-hook-form";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import db from "@/util/db";
import getCategories from "@/util/getCategories";
import NormalToast from "@/util/Toast/NormalToast";
import { getError } from "@/util/errors";
import Head from "next/head";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Link from "next/link";
import AdminLayout from "@/components/Layout/AdminLayout";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true, errorUpdate: "" };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false, errorUpdate: "" };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false, errorUpdate: action.payload };

    case "UPLOAD_REQUEST":
      return { ...state, loadingUpload: true, errorUpload: "" };
    case "UPLOAD_SUCCESS":
      return {
        ...state,
        loadingUpload: false,
        errorUpload: "",
      };
    case "UPLOAD_FAIL":
      return { ...state, loadingUpload: false, errorUpload: action.payload };

    default:
      return state;
  }
}

const AdminProductEditScreen = (props) => {
  const { query } = useRouter();
  const productId = query.id;
  const [{ loading, error:perror, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  const [name, setName] = useState(props?.product?.name);
  const [description, setDescription] = useState(props?.product?.description);
  const [price, setPrice] = useState(props?.product?.price);
  const [image, setImage] = useState(props?.product?.image);
  const [category, setCategory] = useState(props?.product?.category);
  const router = useRouter();
  const { categories, error } = getCategories(props?.categories);
  const [disabled, setDisabled] = useState(false);

  if (error) {
    console.error(error);
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/admin/products/${productId}`);
        dispatch({ type: "FETCH_SUCCESS" });
        setValue("name", data.name);
        setValue("slug", data.slug);
        setValue("price", data.price);
        setValue("image", data.image);
        setValue("category", data.category);
        setValue("brand", data.brand);
        setValue("countInStock", data.countInStock);
        setValue("description", data.description);
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };

    fetchData();
  }, [productId, setValue]);

  const uploadHandler = async (e, imageField = "image") => {
    const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;
    try {
      dispatch({ type: "UPLOAD_REQUEST" });
      const {
        data: { signature, timestamp },
      } = await axios("/api/admin/cloudinary-sign");

      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("signature", signature);
      formData.append("timestamp", timestamp);
      formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY);
      const { data } = await axios.post(url, formData);
      dispatch({ type: "UPLOAD_SUCCESS" });
      setValue(imageField, data.secure_url);
      NormalToast("File uploaded successfully");
      // toast.success("File uploaded successfully");
    } catch (err) {
      dispatch({ type: "UPLOAD_FAIL", payload: getError(err) });
      // toast.error(getError(err));
      NormalToast(getError(err));
    }
  };

  const submitHandler = async ({
    name,
    slug,
    price,
    category,
    image,
    brand,
    countInStock,
    description,
  }) => {
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.put(`/api/admin/products/${productId}`, {
        name,
        slug,
        price,
        category,
        image,
        brand,
        countInStock,
        description,
      });
      // dispatch({ type: "UPDATE_SUCCESS" });
      // toast.success("Product updated successfully");
      NormalToast("Product updated successfully");
      setDisabled(false);
      router.push("/admin/products");
    } catch (err) {
      // dispatch({ type: "UPDATE_FAIL", payload: getError(err) });
      // toast.error(getError(err));
      NormalToast("Something went wrong", err);
      console.error(err);
      setDisabled(false);
    }
  };

  return (
    <>
      <Head>
        <title>Akama | Update Product</title>
      </Head>

      <AdminLayout>
     
        <div className="  md:col-span-3 ml-8  overflow-y-auto overflow-x-auto h-96 p-1 ">
          {loading ? (
            <div className="justify-center items-center ">
              <CircularProgress />
            </div>
          ) : perror ? (
            <div className="alert-error">{perror}</div>
          ) : (
            <form
              className="mx-auto max-w-screen-md "
              onSubmit={handleSubmit(submitHandler)}
            >
              <h1 className="mb-4 text-xl">{`Edit Product ${productId}`}</h1>
              <div className="mb-4">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  className="w-full bg-gray-100 text-gray-900  dark:bg-gray-800 dark:text-white dark:border-gray-700  border border-gray-200 py-2 px-4 rounded-md outline-none "
                  id="name"
                  autoFocus
                  {...register("name", {
                    required: "Please enter name",
                  })}
                />
                {errors.name && (
                  <div className="text-red-500">{errors.name.message}</div>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="slug">Slug</label>
                <input
                  type="text"
                  className="w-full b bg-gray-100 text-gray-900  dark:bg-gray-800 dark:text-white dark:border-gray-700  border border-gray-200 py-2 px-4 rounded-md outline-none "
                  id="slug"
                  {...register("slug", {
                    required: "Please enter slug",
                  })}
                />
                {errors.slug && (
                  <div className="text-red-500">{errors.slug.message}</div>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="price">Price</label>
                <input
                  type="number"
                  className="w-full bg-gray-100 text-gray-900  dark:bg-gray-800 dark:text-white dark:border-gray-700  border border-gray-200 py-2 px-4 rounded-md outline-none "
                  id="price"
                  {...register("price", {
                    required: "Please enter price",
                  })}
                />
                {errors.price && (
                  <div className="text-red-500">{errors.price.message}</div>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="image">image</label>
                <input
                  type="text"
                  className="w-full bg-gray-100 text-gray-900  dark:bg-gray-800 dark:text-white dark:border-gray-700  border border-gray-200 py-2 px-4 rounded-md outline-none "
                  id="image"
                  {...register("image", {
                    required: "Please enter image",
                  })}
                />
                {errors.image && (
                  <div className="text-red-500">{errors.image.message}</div>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="imageFile">Upload image</label>
                <input
                  type="file"
                  className="w-full bg-gray-100 text-gray-900  dark:bg-gray-800 dark:text-white dark:border-gray-700  border border-gray-200 py-2 px-4 rounded-md outline-none "
                  id="imageFile"
                  onChange={uploadHandler}
                />

                {loadingUpload && <div>Uploading....</div>}
              </div>

              <div className="mb-4">
                <label htmlFor="category">category</label>
                <input
                  type="text"
                  className="w-full bg-gray-100 text-gray-900  dark:bg-gray-800 dark:text-white dark:border-gray-700  border border-gray-200 py-2 px-4 rounded-md outline-none "
                  id="category"
                  {...register("category", {
                    required: "Please enter category",
                  })}
                />
                {errors.category && (
                  <div className="text-red-500">{errors.category.message}</div>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="brand">brand</label>
                <input
                  type="text"
                  className="w-full bg-gray-100 text-gray-900  dark:bg-gray-800 dark:text-white dark:border-gray-700  border border-gray-200 py-2 px-4 rounded-md outline-none "
                  id="brand"
                  {...register("brand", {
                    required: "Please enter brand",
                  })}
                />
                {errors.brand && (
                  <div className="text-red-500">{errors.brand.message}</div>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="countInStock">countInStock</label>
                <input
                  type="text"
                  className="w-full bg-gray-100 text-gray-900  dark:bg-gray-800 dark:text-white dark:border-gray-700  border border-gray-200 py-2 px-4 rounded-md outline-none "
                  id="countInStock"
                  {...register("countInStock", {
                    required: "Please enter countInStock",
                  })}
                />
                {errors.countInStock && (
                  <div className="text-red-500">
                    {errors.countInStock.message}
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="countInStock">description</label>

                <textarea
                  required
                  placeholder="Description"
                  id="description"
                  className=" w-full bg-gray-100 text-gray-900  dark:bg-gray-800 dark:text-white dark:border-gray-700  py-2 px-4  border border-gray-200 rounded-md h-24 resize-none outline-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  cols="25"
                  rows="10"
                  disabled={disabled}
                  {...register("description", {
                    required: "Please enter description",
                  })}
                />
                {errors.description && (
                  <div className="text-red-500">
                    {errors.description.message}
                  </div>
                )}
              </div>

              <div className="mb-4">
                <button
                  disabled={loadingUpdate}
                  className={`button py-2 px-10 sm:text-base text-sm mt-4 ${
                    disabled ? "opacity-50" : ""
                  }`}
                  // disabled={disabled}
                >
                  {loadingUpdate ? "Loading" : "Update"}
                </button>
              </div>
              <div className="mb-4">
                <Link href={`/admin/products`} legacyBehavior>
                  Back
                </Link>
              </div>
            </form>
          )}
        </div>
      </AdminLayout>
      {/* <div className="heightFixAdmin px-6 lg:py-20 sm:py-16 py-12">
        <div className="mx-auto max-w-screen-sm sm:text-base  text-sm">
          <h2 className="lg:text-4xl sm:text-3xl text-2xl  font-bold mb-6">
            Update Product
          </h2>
          <form onSubmit={formHandler} className="flex flex-col gap-4">
            <input
              type="text"
              required
              id="name"
              placeholder="Name"
              className="bg-gray-100 border border-gray-200 py-2 px-4 rounded-md outline-none"
              {...register("name", {
                required: "Please enter name",
              })}
              disabled={disabled}
            />

            <input
              type="text"
              required
              id="slug"
              placeholder="Slug"
              className="bg-gray-100 border border-gray-200 py-2 px-4 rounded-md outline-none"
              {...register("slug", {
                required: "Please enter slug",
              })}
              disabled={disabled}
            />
            <select
              required
              className="bg-gray-100 border border-gray-200 py-2 px-4 rounded-md outline-none capitalize"
              onChange={(e) => setCategory(e.target.value)}
              disabled={disabled}
            >
              {categories?.map((category) => (
                <option
                  value={category?.categoryName}
                  key={`option-${category?._id}`}
                >
                  {category?.categoryName}
                </option>
              ))}
            </select>
            <textarea
              required
              placeholder="Description"
              className="bg-gray-100 py-2 px-4  border border-gray-200 rounded-md h-24 resize-none outline-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              cols="25"
              rows="10"
              disabled={disabled}
            ></textarea>
            <input
              type="number"
              required
              placeholder="Price"
              className="bg-gray-100 py-2 border border-gray-200 px-4 rounded-md outline-none"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={disabled}
            />
            <input
              type="text"
              required
              placeholder="Image Url"
              className="bg-gray-100 py-2 px-4 border border-gray-200 rounded-md outline-none"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              disabled={disabled}
            />
            <button
              type="submit"
              className={`button py-2 px-10 sm:text-base text-sm mt-4 ${
                disabled ? "opacity-50" : ""
              }`}
              disabled={disabled}
            >
              Submit
            </button>
          </form>
        </div>
      </div> */}
    </>
  );
}

export default AdminProductEditScreen;
AdminProductEditScreen.auth = { adminOnly: true };

export const getStaticPaths = async () => {
  await db.connect();
  const products = await Product.find().lean();
  const paths = products.map((product) => ({
    params: { id: product._id.toString() },
  }));
  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps = async () => {
  let product;
  let categories;
  try {
    await db.connect();
    product = await Product.find();
    categories = await Category.find({});
  } catch (err) {
    console.error(err);
    return {
      notFound: true,
    };
  }
  if (!product) {
    return {
      notFound: true,
    };
  }
  product = JSON.parse(JSON.stringify(product));
  categories = JSON.parse(JSON.stringify(categories));
  return {
    props: {
      product,
      categories,
    },
    revalidate: 1,
  };
};
