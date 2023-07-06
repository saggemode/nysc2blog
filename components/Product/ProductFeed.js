// import Product from "./Product";
import PCard from "./PCard";
import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { AdjustmentsVerticalIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Dropdown from "../Dropdown/Dropdown";

function ProductFeed({ products, categories }) {
  const [dropDown, setDropDown] = useState(false);
  const [active, setActive] = useState(false);
  const [categoryActive, setCategoryActive] = useState("all");
  const [filteredProducts, setFilteredProducts] = useState(products);

  const activeCategoryHandler = (category) => {
    if (category === "all" || categoryActive === category) {
      setCategoryActive("all");
      return;
    }
    setCategoryActive(category);
    filterProducts(category);
  };

  const filterProducts = (category) => {
    setFilteredProducts(
      products.filter((product) => product?.category === category)
    );
  };

  return (
    <div
      className="w-full py-20 px-6 border border-gray-200 shadow-md dark:bg-gray-900 dark:border-gray-700 mt-10"
      id="products-feed"
    >
      {/* <div
        className={`${styles.section} relative ${styles.noramlFlex} justify-between`}
      >
        categories
      </div> */}
      <div className="flex items-center xl:space-x-12  lg:space-x-10 space-x-7  font-medium  lg:text-base text-sm">
        <span
          className="relative"
          onClick={() => setDropDown((value) => !value)}
        >
          <span className="flex items-center cursor-pointer">
            <Image
              src="/img/profile_pic.svg"
              loading="lazy"
              alt=""
              width="24"
              height="24"
              className="object-contain w-10 h-10 rounded-full mr-1 hover:shadow-md"
            />
            <ChevronDownIcon className="lg:w-6 w-4" />
          </span>
          {dropDown && (
            <div className="absolute top-14 ">
              <Dropdown
                hideDropDown={() => setDropDown(false)}
                menuPlacement="auto"
                minMenuHeight={300}
              />
            </div>
          )}
        </span>
      </div>
      <div className="flex items-center w-full max-w-screen-xl sm:mb-20 mb-16 gap-4  mx-auto overflow-x-auto hideScrollBar capitalize text-sm font-medium">
        <div>
          <AdjustmentsVerticalIcon className="w-6" />
        </div>
        <div
          className={` py-2 px-6   text-center rounded hover:bg-blue-light hover:text-white transition-all cursor-pointer ease-in-out duration-200 shadow ${
            categoryActive === "all" ? "bg-blue-light text-white" : ""
          }`}
          onClick={() => activeCategoryHandler("all")}
        >
          All
        </div>
        {categories?.map((category, i) => (
          <div
            key={`category-${i}`}
            className={`py-2 px-6  text-center whitespace-nowrap rounded hover:bg-blue-light hover:text-white transition-all cursor-pointer ease-in-out duration-200 shadow ${
              categoryActive === category?.categoryName
                ? "bg-blue-light text-white"
                : ""
            }`}
            onClick={() => activeCategoryHandler(category?.categoryName)}
          >
            {category?.categoryName}
          </div>
        ))}
      </div>
      {/* <div className="grid grid-cols-2 grid-flow-row-dense sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4  mx-auto max-w-screen-xl gap-x-6 gap-y-8">
        <>
          {(categoryActive === "all" ? products : filteredProducts)?.map(
            ({
              _id,
              slug,
              name,
              rating,
              price,
              description,
              category,
              image,
            }) => (
              <Product
                key={`product-${_id}`}
                _id={_id}
                name={name}
                slug={slug}
                rating={rating}
                price={price}
                description={description}
                category={category}
                image={image}
              />
            )
          )}
        </>
      </div> */}

      <div>
        <div className="text-[27px] text-center md:text-start font-[600] font-Roboto pb-[20px]">
          {/* <h1 className="w-11/12 mx-auto">Featured Products</h1> */}
        </div>
        <div className="grid grid-cols-2 grid-flow-row-dense gap-[20px] sm:grid-cols-2 md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-4 xl:gap-[30px] mb-12 border-0  mx-auto max-w-screen-xl gap-x-6 gap-y-8">
          {/* {productData &&
            productData.map((i, index) => <ProductCard data={i} key={index} />)} */}

          <>
            {(categoryActive === "all" ? products : filteredProducts)?.map(
              ({
                _id,
                slug,
                name,
                rating,
                price,
                description,
                category,
                image,
              }) => (
                <PCard
                  key={`product-${_id}`}
                  _id={_id}
                  name={name}
                  slug={slug}
                  rating={rating}
                  price={price}
                  description={description}
                  category={category}
                  image={image}
                />
              )
            )}
          </>
        </div>
      </div>
    </div>
  );
}

export default ProductFeed;
