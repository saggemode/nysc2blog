import Image from "next/image";
import Currency from "react-currency-formatter";
import { useDispatch } from "react-redux";

import Fade from "react-reveal/Fade";
import { useRouter } from "next/router";
import Link from "next/link";
import { ShoppingCartIcon } from "@heroicons/react/24/solid";
import { addToCart } from "@/slices/cartSlice";

function User({ _id, slug, name, price, description, category, image }) {
  const dispatch = useDispatch();
  const router = useRouter();
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
      <div className="relative flex flex-col   bg-white z-20  md:p-8 p-6 rounded-md shadow-lg">
        <p className="absolute top-2 right-3 text-xs italic text-gray-400 capitalize">
          {category}
        </p>
        <Image
          src={image}
          height={300}
          width={350}
          alt=""
          // fill
          // objectFit="contain"
          className="cursor-pointer"
          onClick={() => router.push(`/product-details/${_id}`)}
        />
        <h4 className="my-3 link font-medium capitalize">
          <Link href={`/product-details/${_id}`}>{name}</Link>
        </h4>
        <p className="text-xs  mb-2 line-clamp-2 text-gray-500 link">
          <Link href={`/product-details/${_id}`}>{description}</Link>
        </p>
        <div className="mb-5 mt-2 font-bold text-gray-700">
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
