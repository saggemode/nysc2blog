import { getSession } from "next-auth/react";
const slugify = require("slugify");
import Product from "@/models/Product";
import db from "@/util/db";

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(400).send({ message: `${req.method} not supported` });
  }

  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send({ message: "signin required" });
  }

  const {
    name,
    slug,
    price,
    image,
    category,
    brand,
    countInStock,
    description,
  } = req.body;
  // if (
  //   !name ||
  //   !slug ||
  //   !price ||
  //   !image ||
  //   !category ||
  //   !brand ||
  //   !countInStock ||
  //   !description
  // ) {
  //   res.status(422).json({
  //     message: "Validation error",
  //   });
  //   return;
  // }

  await db.connect();

  const existingSlug = await Product.findOne({ slug: slug });
  if (existingSlug) {
    res.status(422).json({ message: "Slug exists already!" });
    await db.disconnect();
    return;
  }

  const newProduct = new Product({
    name,
    slug,
    price,
    image,
    category,
    brand,
    countInStock,
    description,
  });

  const product = await newProduct.save();
  await db.disconnect();
  res.status(201).json(product);
  // res.status(201).send({
  //   message: "Created product!",
  //   name: product.name,
  //   slug: product.slug,
  //   price: product.price,
  //   image: product.image,
  //   category: product.category,
  //   brand: product.brand,
  //   countInStock: product.countInStock,
  //   description: product.description,
  // });
}

export default handler;
