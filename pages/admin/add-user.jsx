import { useState } from "react";
import Link from "next/link";
import React, { useReducer } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import NormalToast from "@/util/Toast/NormalToast";
import getCategories from "@/util/getCategories";
import db from "@/util/db";

import Head from "next/head";
import { getError } from "@/util/errors";
import { CircularProgress } from "@mui/material";
import AdminLayout from "@/components/Layout/AdminLayout";

function reducer(state, action) {
  switch (action.type) {
    case "PRODUCT_REQUEST":
      return { ...state, loading: true, error: "" };
    case "PRODUCT_SUCCESS":
      return { ...state, loading: false, error: "" };
    case "PRODUCT_FAIL":
      return { ...state, loading: false, error: action.payload };

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

const AddUser = (props) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [slug, setSlug] = useState("");
  const [brand, setBrand] = useState("");
  const [countInStock, setCountInStock] = useState("");
  const [slugButton, setSlugButton] = useState(false);
  // const [category, setCategory] = useState(false);
  //const {categories, error}= getCategories(props?.categories[0]?.name);
  const { categories, error } = getCategories(props?.categories);
  const [disabled, setDisabled] = useState(false);

  const categoriess = [
    "Personal",
    "cloth",
    "Ladies Cloth",
    "Gift",
    "Food",
    "Electronics",
    "Sports",
    "Others",
  ];

  // if (error) {
  //   console.error(error);
  // }

  const [{ loadingUpload }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm();

  const submitHandler = async ({
    name,
    slug,
    price,
    image,
    category,
    brand,
    countInStock,
    description,
  }) => {
    try {
      await axios.post("/api/auth/product", {
        name,
        slug,
        price,
        image,
        category,
        brand,
        countInStock,
        description,
      });
      dispatch({ type: "PRODUCT_SUCCESS" });
      NormalToast("Product created successfully");
      setDisabled(false);
    } catch (err) {
      dispatch({ type: "PRODUCT_FAIL", payload: getError(err) });
      // toast.error(getError(err));
      NormalToast(getError(err));
      console.error(err);
      setDisabled(false);
    }
  };

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

  const createProductImagesChange = (e) => {
    const files = Array.from(e.target.files);

    setImages([]);
    setImagesPreview([]);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((old) => [...old, reader.result]);
          setImages((old) => [...old, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const formHandler = async (e) => {
    e.preventDefault();
    setDisabled(true);
    await axios
      .post("/api/auth/product", {
        name,
        slug,
        price,
        image,
        category,
        brand,
        countInStock,
        description,
      })
      .then((res) => {
        NormalToast("Product added successfully");
        setTitle("");
        setDescription("");
        setPrice("");
        setImage("");
        setCategory("");
        setDisabled(false);
      })
      .catch((err) => {
        NormalToast("Something went wrong", true);
        console.error(err);
        setDisabled(false);
      });
  };

  return (
    <AdminLayout>
      <div className="overflow-y-auto overflow-x-auto h-96 p-1 md:col-span-3 ml-8">
        <form
          className="mx-auto max-w-screen-md"
          onSubmit={handleSubmit(submitHandler)}
        >
          <h1 className="mb-4 text-xl">{`Create New User`}</h1>
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
              className="w-full bg-gray-100 text-gray-900  dark:bg-gray-800 dark:text-white dark:border-gray-700  border border-gray-200 py-2 px-4 rounded-md outline-none "
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
            {/* <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={createProductImagesChange}
                multiple
              /> */}

            {loadingUpload && <div>Uploading....</div>}
            {/* <div id="createProductFormImage">
                {imagesPreview.map((image, index) => (
                  <img key={index} src={image} alt="Product Preview" />
                ))}
              </div> */}
          </div>

          <div className="mb-4">
            <label htmlFor="category">category</label>
            <select
              className="w-full bg-gray-100 text-gray-900  dark:bg-gray-800 dark:text-white dark:border-gray-700  border border-gray-200 py-2 px-4 rounded-md outline-none "
              {...register("category", {
                required: "Please enter category",
              })}
            >
              <option value="">Choose Category</option>
              {categoriess.map((categoryName) => (
                <option key={categoryName} value={categoryName}>
                  {categoryName}
                </option>
              ))}
            </select>
            {/* <input
                type="text"
                className="w-full bg-gray-100 border border-gray-200 py-2 px-4 rounded-md outline-none "
                id="category"
                {...register("category", {
                  required: "Please enter category",
                })}
              /> */}
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
              <div className="text-red-500">{errors.countInStock.message}</div>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="countInStock">description</label>
            {/* <input
                type="text"
                className="w-full bg-gray-100 border border-gray-200 py-2 px-4 rounded-md outline-none "
                id="description"
                {...register("description", {
                  required: "Please enter description",
                })}
              /> */}
            <textarea
              placeholder="Product Description"
              className="w-full bg-gray-100 text-gray-900  dark:bg-gray-800 dark:text-white dark:border-gray-700  border border-gray-200 py-2 px-4 rounded-md outline-none "
              id="description"
              {...register("description", {
                required: "Please enter description",
              })}
              cols="30"
              rows="3"
            ></textarea>
            {errors.description && (
              <div className="text-red-500">{errors.description.message}</div>
            )}
          </div>

          <div className="mb-4">
            <button
              className={`button py-2 px-10 sm:text-base text-sm mt-4 ${
                disabled ? "opacity-50" : ""
              }`}
            >
              Create
            </button>
          </div>
          <div className="mb-4">
            <Link href={`/admin/users`} legacyBehavior>
              Back
            </Link>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AddUser;
