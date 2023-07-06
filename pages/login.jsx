import Link from "next/link";
import React, { useEffect, useReducer,useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useForm } from "react-hook-form";
import { getError } from "../util/errors";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { CircularProgress } from "@mui/material";
import Head from "next/head";

function reducer(state, action) {
  switch (action.type) {
    case "LOGIN_REQUEST":
      return { ...state, loading: true, error: "" };
    case "LOGIN_SUCCESS":
      return { ...state, loading: false, error: "" };
    case "LOGIN_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
}

const LoginScreen = () => {
  const { data: session } = useSession();
  const [visible, setVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });
  const router = useRouter();
  const { redirect } = router.query;

  useEffect(() => {
    if (session?.user) {
      router.push(redirect || "/");
    }
  }, [router, session, redirect]);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  const submitHandler = async ({ email, password }) => {
    try {
      dispatch({ type: "LOGIN_REQUEST" });
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      dispatch({ type: "LOGIN_SUCCESS" });
      if (result.error) {
        toast.error(result.error);
      }
    } catch (err) {
      dispatch({ type: "LOGIN_FAIL", payload: getError(err) });
      toast.error(getError(err));
    }
  };
  return (
    <div className="px-6 sm:py-16  xs:py-14 py-12">
      <Head>
        <title>Radon | Login</title>
      </Head>
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4  mt-6 text-center text-3xl font-extrabold text-gray-900">Login</h1>
        <div className="mb-4">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            {...register("email", {
              required: "Please enter email",
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                message: "Please enter valid email",
              },
            })}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            id="email"
            autoFocus
          ></input>
          {errors.email && (
            <div className="text-red-500">{errors.email.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block  font-medium text-gray-900"
          >
            Password
          </label>
          <div className="mt-1 relative">
            <input
              type={visible ? "text" : "password"}
              name="password"
              id="password"
              autoComplete="current-password"
              required
             
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              {...register("password", {
                required: "Please enter password",
                minLength: {
                  value: 5,
                  message: "password should be more than 4 chars",
                },
              })}
            />
             {errors.password && (
            <div className="text-red-500 ">{errors.password.message}</div>
          )}
            {visible ? (
              <AiOutlineEye
                className="absolute right-2 top-2 cursor-pointer"
                size={25}
                onClick={() => setVisible(false)}
              />
            ) : (
              <AiOutlineEyeInvisible
                className="absolute right-2 top-2 cursor-pointer"
                size={25}
                onClick={() => setVisible(true)}
              />
            )}
          </div>
        </div>
        <div className="mb-4 ">
          <button className="group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
            {!loading ? "Loading.." : "Login"}
          </button>
          {!loading && <CircularProgress />}
        </div>
        <div className="mb-4 ">
          Don&apos;t have an account? &nbsp;
          <Link href={`/register?redirect=${redirect || "/"}`} className="text-blue-600 pl-2">Register</Link>
        </div>
      </form>
    </div>
  );
};

export default LoginScreen;
