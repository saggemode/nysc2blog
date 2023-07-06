import { useDispatch, useSelector } from "react-redux";
import Currency from "react-currency-formatter";
import { signIn, useSession } from "next-auth/react";

import { useRouter } from "next/router";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import dynamic from "next/dynamic";
import { emptyCart, selectItems, selectTotal } from "../slices/CartSlice";
import CartProduct from "../components/CartProduct/CartProduct";
import { CreditCardIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import Head from "next/head";
import Image from "next/image";

//const stripePromise = loadStripe(process.env.STRIPE_PUBLIC_KEY);

function Cart() {
  const router = useRouter();
  const items = useSelector(selectItems);
  const total = useSelector(selectTotal);
  const { data: session, loading } = useSession();
  const [disabled, setDisabled] = useState(false);
  const dispatch = useDispatch();

  // const createCheckoutSession = async () => {
  //   setDisabled(true);
  //   try {
  //     const stripe = await stripePromise;
  //     //call the backend to create a checkout session
  //     const checkoutSession = await axios.post("/api/create-checkout-session", {
  //       items: items,
  //       email: session.user.email,
  //     });

  //     //Redirect user/customer to Stripe Checkout
  //     const result = await stripe.redirectToCheckout({
  //       sessionId: checkoutSession.data.id,
  //     });

  //     if (result.error) {
  //       alert(result.error.message);
  //       console.error(result.error.message);
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     alert(err);
  //   }
  //   setDisabled(false);
  // };

  return (
    <>
      <Head>
        <title>Radon | Cart</title>
      </Head>
      <div className="bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100  py-10 md:px-6 heightFix">
        <main className="max-w-screen-xl mx-auto">
          {items?.length ? (
            <div className="my-6 shadow rounded-md ">
              <div className="flex flex-col md:p-8  p-6  bg-white border border-gray-200  dark:bg-gray-800 dark:border-gray-700">
                <h1 className="sm:text-2xl text-xl  font-semibold border-b-2 border-gray-200 pb-4 text-gray-400">
                  Shopping Cart
                </h1>
                <div className="flex justify-between items-center py-6">
                  <span className="font-medium text-lg text-blue-light">
                    Items
                    <span className="font-semibold text-xl ml-2">
                      {items?.length}
                    </span>
                  </span>
                  <button
                    className={`button-red py-2 px-8 xs:px-10 ${
                      disabled ? "opacity-50" : ""
                    }`}
                    onClick={() => dispatch(emptyCart())}
                    disabled={disabled}
                  >
                    Empty Cart
                  </button>
                </div>
                {items.map((item, i) => (
                  <CartProduct
                    key={`cart-product-${item?._id}`}
                    _id={item?._id}
                    name={item?.name}
                    price={item?.price}
                    slug={item?.slug}
                    description={item?.description}
                    category={item?.category}
                    image={item?.image}
                    qty={item?.qty}
                    border={i !== items?.length - 1}
                    disabled={disabled}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full  px-6 lg:py-20 sm:py-10 py-4">
              <div className="text-center md:max-w-none sm:w-auto mx-auto max-w-xs w-4/5">
                <Image
                  src="/img/empty_cart.svg"
                  alt=""
                  width={350}
                  height={350}
                  // objectFit="contain"
                />
                <h3 className="lg:text-2xl text-xl font-medium mt-4">
                  Your Cart is Empty
                </h3>
              </div>
            </div>
          )}
          {items?.length ? (
            <div className="flex flex-col bg-white border border-gray-200  dark:bg-gray-800 dark:border-gray-700 md:p-10  py-8 px-6 shadow-md rounded-md md:text-xl sm:text-lg text-base my-10">
              <h2 className="whitespace-nowrap font-semibold overflow-x-auto hideScrollBar">
                Subtotal ({items.length} items) :
                <span className="font-bold text-red-500 mx-2">
                  <Currency quantity={total} currency="NGN" />
                </span>
              </h2>
              {!session ? (
                <button
                  role="link"
                  className="button mt-6 lg:text-lg text-base py-2"
                  onClick={() => router.push("login?redirect=/login")}
                >
                  Login
                </button>
              ) : (
                <button
                  role="link"
                  className={`button mt-6 flex items-center justify-center lg:text-lg text-base  py-2 ${
                    disabled ? "opacity-50" : ""
                  }`}
                  onClick={() => router.push("login?redirect=/shipping")}
                  // onClick={!disabled ? createCheckoutSession : () => {}}
                  disabled={disabled}
                >
                  <CreditCardIcon className="sm:w-6 w-5" />
                  <span className="ml-2">Proceed to checkout </span>
                </button>
              )}
            </div>
          ) : (
            <></>
          )}
        </main>
      </div>
    </>
  );
}

// export default Cart;
export default dynamic(() => Promise.resolve(Cart), { ssr: false });
