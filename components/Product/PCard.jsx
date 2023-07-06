import React, { useState } from "react";
import Link from "next/link";
import styles from "@/styles/styles";
import Image from "next/image";
import { Rating } from "@mui/material";
import Currency from "react-currency-formatter";
import { useDispatch } from "react-redux";
import { addToCart } from "../../slices/CartSlice";
import Fade from "react-reveal/Fade";
import { useRouter } from "next/router";

import { ShoppingCartIcon } from "@heroicons/react/24/solid";
import ProductDetailsCard from "./ProductDetailsCard";
import {
  AiFillHeart,
  AiFillStar,
  AiOutlineEye,
  AiOutlineHeart,
  AiOutlineShoppingCart,
  AiOutlineStar,
} from "react-icons/ai";

const PCard = ({
  _id,
  slug,
  name,
  rating,
  price,
  description,
  category,
  image,
}) => {
  const [click, setClick] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const d = name;
  var names = d.replace(/\s+/g, "-");

  // const d = data.name;
  // const product_name = d.replace(/\s+/g, "-");

  const addItemToCart = () => {
    //Sending the product as an action to the REDUX store... the cart slice
    dispatch(
      addToCart({
        _id,
        slug,
        name,
        price,
        rating,
        description,
        category,
        image,
        qty: 1,
        toast: true,
      })
    );
  };

  return (
    <>
      {/* <div className="w-full h-[370px] bg-white rounded-lg shadow-sm p-3 relative cursor-pointer"> */}
      <div className="relative flex flex-col   bg-white border border-gray-200  dark:bg-gray-800 dark:border-gray-700 z-20  md:p-8 p-6 rounded-md shadow-lg">
        <div className="flex justify-end"></div>
        <p className="absolute top-2 right-3 text-xs italic text-gray-400 capitalize">
          {category}
        </p>

        <Image
          src={image}
          alt=""
          height={300}
          width={350}
          className="cursor-pointer w-full h-[170px] object-contain"
          onClick={() => router.push(`/product-details/${slug}`)}
        />

        <h4 className="my-3 link font-medium capitalize">
          <Link href={`/product-details/${slug}`}>
            {name.length > 13 ? name.slice(0, 13) + " ..." : name}
          </Link>
        </h4>

        <p className="text-sm  mb-2 line-clamp-2  text-gray-600  dark:text-gray-300 link">
          <Link href={`/product-details/${slug}`}>{description}</Link>
        </p>

        <div className="flex flex-row my-3">
          <Rating value={rating} readOnly></Rating> 
        </div>

        <div className="mb-5 mt-2 font-bold  text-gray-700 dark:text-gray-300">
          <Currency quantity={price} currency="NGN" />
        </div>

        {/* side options */}
        <div className="pt-5 mt-5">
          {click ? (
            <AiFillHeart
              size={22}
              className="cursor-pointer absolute right-2 top-5"
              onClick={() => setClick(!click)}
              color={click ? "red" : "#333"}
              title="Remove from wishlist"
            />
          ) : (
            <AiOutlineHeart
              size={22}
              className="cursor-pointer absolute right-2 top-5"
              onClick={() => setClick(!click)}
              color={click ? "red" : "#333"}
              title="Add to wishlist"
            />
          )}
          <AiOutlineEye
            size={22}
            className="cursor-pointer absolute right-2 top-14"
            onClick={() => setOpen(!open)}
            color="#333"
            title="Quick view"
          />
          <AiOutlineShoppingCart
            size={25}
            className="cursor-pointer absolute right-2 top-24"
            onClick={() => setOpen(!open)}
            color="#444"
            title="Add to cart"
          />
          {open ? <ProductDetailsCard setOpen={setOpen} data={data} /> : null}
        </div>
        <button
          className="mt-auto button flex items-center justify-center"
          onClick={addItemToCart}
        >
          <ShoppingCartIcon className="w-4" />
          <span className="ml-2">Add to Cart</span>
        </button>
      </div>
    </>
  );
};

export default PCard;
