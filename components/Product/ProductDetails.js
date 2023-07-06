import Image from "next/image";
import { addToCart } from "../../slices/CartSlice";
import { useDispatch } from "react-redux";
import Currency from "react-currency-formatter";
import { useRouter } from "next/router";
import Skeleton from "react-loading-skeleton";
import { ShoppingCartIcon } from "@heroicons/react/24/solid";
import { Rating } from '@mui/material';
import { LightBulbIcon } from "@heroicons/react/24/solid";
// import BreadCrumbs from "@/components/Layout/BreadCrumbs";
import StarRatings from "react-star-ratings";

function ProductDetails({
  _id,
  slug,
  name,
  price,
  description,
  category,
  brand,
  rating,
  image,
  inStock,
  product,
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const addItemToCart = () =>
    dispatch(
      addToCart({
        _id,
        slug,
        name,
        price,
        description,
        category,
        brand,
        rating,
        image,
        qty: 1,
        toast: true,
      })
    );

  const buyNow = () => {
    dispatch(
      addToCart({
        _id,
        slug,
        name,
        price,
        description,
        category,
        brand,
        rating,
        image,
        qty: 1,
        toast: false,
      })
    );
    router.push("/cart");
  };

  return (
    <div className='flex flex-col items-start gap-4 sm:flex-row md:gap-6 lg:justify-center lg:gap-8'>
    {/* <div className="heightFix px-6 lg:py-32 md:py-28 py-12 pb-20"> */}
      <div className="max-w-screen-xl flex items-center mx-auto">
        <div className="flex md:flex-row flex-col md:justify-between w-full md:gap-4 gap-8">
          {router.isFallback ? (
            <Skeleton width={400} height={400} />
          ) : (
            <div className="mx-auto">
              <Image src={image} alt="" width={400} height={400} />
            </div>
          )}
          <div className="flex-grow xl:max-w-2xl lg:max-w-xl  md:max-w-md">
            {router.isFallback ? (
              <Skeleton count={12} />
            ) : (
              <>
                <h3 className="font-bold xl:text-4xl  lg:text-3xl text-2xl mb-2 capitalize">
                  {name}
                </h3>
                {/* <p className="text-justify text-sm lg:text-base my-6">
                  <StarRatings
                    rating={rating}
                    starRatedColor="#ffb829"
                    numberOfStars={5}
                    starDimension="20px"
                    starSpacing="2px"
                    name="rating"
                  />
                </p> */}
                {/* <p className="text-blue-light capitalize mb-4 font-medium">
                  {category}
                </p> */}

                <p className="text-justify text-sm lg:text-base my-4">
                  <b className="font-medium w-36 inline-block">Category:</b>
                  <span className=" text-blue-light capitalize">{category}</span>
                </p>

                <p className="text-justify text-sm lg:text-base my-6">
                  <b className="font-medium w-36 inline-block">Brand:</b>
                  <span className=" text-blue-light capitalize">{brand}</span>
                </p>

                <p className="text-justify text-sm lg:text-base my-6">
                  {description}
                </p>
                <p className="text-justify text-sm lg:text-base my-6">
                  <b className="font-medium w-36 inline-block">Stock</b>
                  {inStock ? (
                    <span className="text-green-500">In Stock</span>
                  ) : (
                    <span className="text-red-500">Out of Stock</span>
                  )}
                </p>
                <p className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
                  <Currency quantity={price} currency="NGN" />
                </p>
                <div className="mt-10 flex xs:flex-row flex-col sm:gap-8 gap-6">
                  <button
                    className="button px-10  py-2 flex items-center justify-center"
                    onClick={addItemToCart}
                  >
                    <ShoppingCartIcon className="w-4" />
                    <span className="ml-2">Add to Cart</span>
                  </button>
                  <button
                    className=" button-green px-10   py-2 flex items-center justify-center"
                    onClick={buyNow}
                  >
                    <LightBulbIcon className="w-4" />
                    <span className="ml-2">Buy Now</span>
                  </button>

                 
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
