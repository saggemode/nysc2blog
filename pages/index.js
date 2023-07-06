import db from "@/util/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Banner from "@/components/Banner/Banner";
import ProductFeed from "@/components/Product/ProductFeed";
import getCategories from "@/util/getCategories";
import getProducts from "@/util/getProducts";
import Categories from "@/components/Category/Categories";

export default function Home(props) {
  const { products, error } = getProducts(props?.products);
  const { categories, error: err } = getCategories(props?.categories);

  if (err) {
    console.error(err);
  }

  if (error) {
    console.error(error);
  }

  return (
    <>
      <Banner />
      <Categories />
      {/* <BestDeals />
      <Events /> */}
      {/* <FeaturedProduct /> */}
      <ProductFeed products={products} categories={categories} />
    </>
  );
}

export const getStaticProps = async () => {
  await db.connect();
  let products = await Product.find({}).lean();
  products = JSON.parse(JSON.stringify(products));

  let categories = await Category.find({}).lean();
  categories = JSON.parse(JSON.stringify(categories));

  return {
    props: {
      products,
      categories,
    },
    revalidate: 1,
  };
};
