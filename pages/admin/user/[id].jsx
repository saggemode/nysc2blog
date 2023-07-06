import { useState } from "react";
import React, { useEffect, useReducer } from "react";
import { useForm } from "react-hook-form";
import { Checkbox, CircularProgress } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import NormalToast from "@/util/Toast/NormalToast";
import { getError } from "@/util/errors";
import Head from "next/head";
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

const AdminUserEditScreen = (props) => {
  const { query } = useRouter();
  const userId = query.id;
  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  const router = useRouter();

  const [disabled, setDisabled] = useState(false);

  const [isAdmin, setIsAdmin] = useState(false);

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
        // setValue("email", data.email);
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
        // email,
        isAdmin,
        image,
      });
      NormalToast("User updated successfully");
      setDisabled(false);
      router.push("/admin/users");
    } catch (err) {
      NormalToast("Something went wrong", getError(err));
      console.error(err);
      setDisabled(false);
    }
  };

  return (
    <>
      <Head>
        <title>Akama | Update User </title>
      </Head>

      <AdminLayout>
        <div className="md:col-span-3 ml-8  overflow-y-auto overflow-x-auto h-96 p-1 ">
          {loading ? (
            <div className="justify-center items-center ">
              <CircularProgress />
            </div>
          ) : error ? (
            <div className="alert-error">{error}</div>
          ) : (
            <form
              className="mx-auto max-w-screen-md"
              onSubmit={handleSubmit(submitHandler)}
            >
              <h1 className="mb-4 text-xl">{`Edit User ${userId}`}</h1>
              <div className="mb-4">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  className="w-full bg-gray-100 text-gray-900  dark:bg-gray-800 dark:text-white dark:border-gray-700  border border-gray-200  py-2 px-4 rounded-md outline-none "
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

              {/* <div className="mb-4">
              <label htmlFor="name">Email</label>
              <input
                type="text"
                className="w-full bg-gray-100 border border-gray-200 py-2 px-4 rounded-md outline-none "
                id="email"
                autoFocus
                {...register("email", {
                  required: "Please enter email",
                })}
              />
              {errors.email && (
                <div className="text-red-500">{errors.email.message}</div>
              )}
            </div> */}

              <div className="mb-4">
                <label htmlFor="image">image</label>
                <input
                  type="text"
                  className="w-full bg-gray-100 text-gray-900  dark:bg-gray-800 dark:text-white dark:border-gray-700   border-gray-200 border py-2 px-4 rounded-md outline-none "
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
      </AdminLayout>
    </>
  );
};

export default AdminUserEditScreen;
AdminUserEditScreen.auth = { adminOnly: true };
