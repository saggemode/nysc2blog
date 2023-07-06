import React, { useEffect, useState } from "react";
import { productData } from "@/rawstatic/data";
import styles from "@/styles/styles";
import ProductCard from "./ProductCard";

const SuggestedProduct = ({
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
}) => {
  const [products, setProducts] = useState(null);

  useEffect(() => {
    const d = productData && productData.filter((i) => i.category === category);
    setProducts(d);
  }, [category]);

  return (
    <div>
      <div className={`p-4 ${styles.section}`}>
        <h2
          className={`${styles.heading} text-[25px] font-[500] border-b mb-5`}
        >
          Related Product
        </h2>
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
          {/* {products.map((i, index) => (
            <ProductCard data={i} key={index} />
            <h2 key={index}>hello</h2>
          ))} */}

          <h2>{category}:hello</h2>
        </div>
      </div>
    </div>
  );
};

export default SuggestedProduct;
