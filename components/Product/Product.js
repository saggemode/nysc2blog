import React, { useState } from "react";
import Image from "next/image";
import Currency from "react-currency-formatter";
import { useDispatch } from "react-redux";
import { addToCart } from "../../slices/CartSlice";
import Fade from "react-reveal/Fade";
import { useRouter } from "next/router";
import Link from "next/link";
import { Rating } from "@mui/material";
import { ShoppingCartIcon } from "@heroicons/react/24/solid";


function Product({
  _id,
  slug,
  name,
  rating,
  price,
  description,
  category,
  image,
}) {
  const [click, setClick] = useState(false);
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
        description,
        category,
        image,
        qty: 1,
        toast: true,
      })
    );
  };

  return (
    <Fade bottom>
      <div className="relative flex flex-col   bg-white border border-gray-200  dark:bg-gray-800 dark:border-gray-700 z-20  md:p-8 p-6 rounded-md shadow-lg">
        <p className="absolute top-2 right-3 text-xs italic text-gray-400 capitalize">
          {category}
        </p>
        <Image
          src={image}
          height={300}
          width={350}
          alt={name}
          className="cursor-pointer"
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
        <button
          className="mt-auto button flex items-center justify-center"
          onClick={addItemToCart}
        >
          <ShoppingCartIcon className="w-4" />
          <span className="ml-2">Add to Cart</span>
        </button>
      </div>
    </Fade>
  );
}

export default Product;
