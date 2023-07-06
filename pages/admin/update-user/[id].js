import { useState } from "react";
import React, { useEffect, useReducer } from "react";
import { useForm } from "react-hook-form";
import { Checkbox, CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import axios from "axios";
import { useRouter } from "next/router";
import db from "@/util/db";
import getCategories from "@StorageService/util/getCategories";
import NormalToast from "@/util/Toast/NormalToast";
import { getError } from "@/util/errors";
import Head from "next/head";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Link from "next/link";

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

const AdminUserEditScreen = (props) => {
  const { query } = useRouter();
  const userId = query.id;
  const [{ loading, errror, loadingUpdate, loadingUpload }, dispatch] =
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

  const [isAdmin, setIsAdmin] = useState(false);

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
        const { data } = await axios.get(`/api/admin/users/${userId}`);
        dispatch({ type: "FETCH_SUCCESS" });
        setValue("name", data.name);
        setValue("image", data.image);
        setIsAdmin(data.isAdmin);
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };

    fetchData();
  }, [userId, setValue]);

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

  const submitHandler = async ({ name, isAdmin, image }) => {
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.put(`/api/admin/users/${userId}`, {
        name,
        isAdmin,
        image,
      });
      // dispatch({ type: "UPDATE_SUCCESS" });
      // toast.success("Product updated successfully");
      NormalToast("User updated successfully");
      setDisabled(false);
      router.push("/admin/users");
    } catch (err) {
      // dispatch({ type: "UPDATE_FAIL", payload: getError(err) });
      // toast.error(getError(err));
      NormalToast("Something went wrong", getError(err));
      console.error(err);
      setDisabled(false);
    }
  };

  return (
    <>
      <Head>
        <title>Radon | Update User </title>
      </Head>

      <div className="grid md:grid-cols-4 md:gap-5">
        <div>
          <ul>
            <li>
              <Link href="/admin/dashboard" legacyBehavior>
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/admin/orders" legacyBehavior>
                Orders
              </Link>
            </li>
            <li>
              <Link href="/admin/products" legacyBehavior>
                Products
              </Link>
            </li>
            <li>
              <Link href="/admin/users" legacyBehavior>
                <a className="font-bold">Users</a>
              </Link>
            </li>
          </ul>
        </div>
        <div className="md:col-span-3">
          {loading ? (
            <div>
              <CircularProgress />
            </div>
          ) : error ? (
            <div className="alert-error">{error}</div>
          ) : (
            <form
              className="mx-auto max-w-screen-md"
              onSubmit={handleSubmit(submitHandler)}
            >
              <h1 className="mb-4 text-xl">{`Edit Product ${userId}`}</h1>
              <div className="mb-4">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  className="w-full bg-gray-100 border border-gray-200 py-2 px-4 rounded-md outline-none "
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
                <label htmlFor="image">image</label>
                <input
                  type="text"
                  className="w-full bg-gray-100 border border-gray-200 py-2 px-4 rounded-md outline-none "
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
                  className="w-full bg-gray-100 border border-gray-200 py-2 px-4 rounded-md outline-none "
                  id="imageFile"
                  onChange={uploadHandler}
                />

                {loadingUpload && <div>Uploading....</div>}
              </div>

              <div className="mb-4">
                <label htmlFor="IsAdmin">is Admin</label>
                <Checkbox
                  onClick={(e) => setIsAdmin(e.target.checked)}
                  checked={isAdmin}
                  name="isAdmin"
                />
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
      </div>
    </>
  );
};

export default AdminUserEditScreen;
AdminUserEditScreen.auth = { adminOnly: true };

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
