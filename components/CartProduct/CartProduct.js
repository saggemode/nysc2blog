import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import Currency from "react-currency-formatter";
import { useDispatch } from "react-redux";
import { updateQty, removeFromCart } from "@/slices/CartSlice";
import Fade from "react-reveal/Fade";

function CartProduct({
  _id,
  name,
  price,
  description,
  category,
  image,
  slug,
  qty,
  border,
  disabled,
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const total = price * qty;

  const removeItemFromCart = () => dispatch(removeFromCart({ _id }));
  const incQty = () =>
    dispatch(
      updateQty({
        _id,
        name,
        price,
        description,
        slug,
        category,
        image,
        qty: qty + 1,
      })
    );
  const decQty = () =>
    dispatch(
      updateQty({
        _id,
        name,
        price,
        description,
        slug,
        category,
        image,
        qty: qty - 1,
      })
    );

  return (
    <Fade bottom>
      <div
        className={`block bg-white   border-gray-200  dark:bg-gray-800 dark:border-gray-700 py-6 sm:grid sm:grid-cols-5 ${
          border ? "border-b border-gray-300" : ""
        }`}
      >
        <div className="text-center sm:text-left my-auto">
          <Image
            src={image}
            width={150}
            height={150}
            className="cursor-pointer"
            alt={name}
            onClick={() => router.push(`/product-details/${slug}`)}
          />
        </div>

        {/* Middle */}
        <div className="col-span-3 sm:p-4 mt-2 mb-6 sm:my-0">
          <h4 className="mb-3 link lg:text-xl md:text-lg text-base capitalize font-medium">
            <Link href={`/product-details/${slug}`}>{name}</Link>
          </h4>
          <p className="lg:text-sm text-xs my-2  mb-4 line-clamp-3 link text-gray-500">
            <Link href={`/product-details/${slug}`}>{description}</Link>
          </p>
          <span className="font-medium md:text-base text-sm dark:text-gray-100">
            {qty} × <Currency quantity={price} currency="NGN" /> =
            <span className="font-bold text-gray-500 mx-1 dark:text-gray-400">
              <Currency quantity={total} currency="NGN" />
            </span>
          </span>
        </div>

        {/* Buttons on the right of the products */}
        <div className="flex flex-col space-y-4 my-auto  justify-self-end">
          <div className="flex justify-between">
            <button
              className={`button sm:p-1 ${disabled ? "opacity-50" : ""}`}
              onClick={decQty}
              disabled={disabled}
            >
              <MinusIcon className="h-5" />
            </button>
            <div className="p-2 whitespace-normal sm:p-1 sm:whitespace-nowrap">
              <span className="font-bold md:text-base text-sm text-gray-700">
                {qty}
              </span>
            </div>
            <button
              className={`button sm:p-1 ${disabled ? "opacity-50" : ""}`}
              onClick={incQty}
              disabled={disabled}
            >
              <PlusIcon className="h-5" />
            </button>
          </div>
          <button
            className={`button py-2  lg:px-10 md:px-8 px-6 ${
              disabled ? "opacity-50" : ""
            }`}
            onClick={removeItemFromCart}
            disabled={disabled}
          >
            Remove
          </button>
        </div>
      </div>
    </Fade>
  );
}

export default CartProduct;
