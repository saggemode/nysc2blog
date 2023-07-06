import React from "react";
import { productData } from "@/rawstatic/data";
import ProductCard from "./ProductCard";

const FeaturedProduct = () => {
  return (
    <div>
      <div className="w-11/12 mx-auto">
        <div className="text-[27px] text-center md:text-start font-[600] font-Roboto pb-[20px]">
          <h1>Featured Products</h1>
        </div>
        <div className="grid grid-cols-2 gap-[20px] md:grid-cols-3 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-4 xl:gap-[30px] mb-12 border-0 pr-5 pl-5">
          {productData &&
            productData.map((i, index) => <ProductCard data={i} key={index} />)}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProduct;
