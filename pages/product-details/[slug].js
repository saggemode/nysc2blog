import React, { useRef } from "react";
import db from "@/util/db";
import Product from "@/models/Product";

import ProductDetails from "@/components/Product/ProductDetails";
import SuggestedProduct from "@/components/Product/SuggestedProduct";
import MetaTag from "@/components/MetaTag";

function productDetails({ product ,fileredProducts}) {
  const imgRef = useRef(null);

  const setImgPreview = (url) => {
    imgRef.current.src = url;
  };

  const inStock = product?.countInStock >= 1;

  return (
    <>
      <MetaTag
        title={product?.name}
        description={"A Full Stack Developer who try to write technical blogs."}
        siteUrl={"https://next-ecomtailwin.vercel.app/"}
        previewImage={
          "https://next-ecomtailwin.vercel.app/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fnext-ecom-tailwind%2Fimage%2Fupload%2Fv1657406132%2Fppdbacwi02hqwbwhttjp.jpg&w=1920&q=75"
        }
      />
      {/* <BreadCrumbs breadCrumbs={breadCrumbs} /> */}
      <ProductDetails
        _id={product?._id}
        slug={product?.slug}
        name={product?.name}
        price={product?.price}
        rating={product?.rating}
        description={product?.description}
        category={product?.category}
        brand={product?.brand}
        image={product?.image}
        inStock={inStock}
      />

      <SuggestedProduct
        _id={fileredProducts?._id}
        slug={fileredProducts?.slug}
        name={fileredProducts?.name}
        price={fileredProducts?.price}
        rating={fileredProducts?.rating}
        description={fileredProducts?.description}
        category={fileredProducts?.category}
        brand={fileredProducts?.brand}
        image={fileredProducts?.image}
        inStock={inStock}
      />
    </>
  );
}

export default productDetails;

// export const getStaticPaths = async () => {
//   await db.connect();
//   const products = await Product.find({});
//   const paths = products.map((product) => ({
//     params: { slug: product.slug },
//   }));
//   return {
//     paths,
//     fallback: true,
//   };
// };

// export const getStaticProps = async (context) => {
//   let product;
//   const { params } = context;
//   const { slug } = params;
//   try {
//     await db.connect();
//     product = await product.findOne({ slug });
//   } catch (err) {
//     console.error(err);
//     return {
//       notFound: true,
//     };
//   }
//   if (!product) {
//     return {
//       notFound: true,
//     };
//   }
//   product = JSON.parse(JSON.stringify(product));
//   return {
//     props: {
//       product,
//     },
//     revalidate: 1,
//   };
// };

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;
  const { category } = params;

  await db.connect();
  const product = await Product.findOne({ slug }, "-reviews").lean();
  //const product = await Product.findOne({ slug }).lean();
  const fileredProducts = await Product.find({ category });
  await db.disconnect();
  return {
    props: {
      product: product ? db.convertDocToObj(product) : null,
      fileredProducts
    },
  };
}
