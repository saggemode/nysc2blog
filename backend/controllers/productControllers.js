import Product from "@/models/Product";
import APIFilters from "../APIFilters";

export const newProduct = async (req, res, next) => {
  const product = await Product.create(req.body);
  res.status(201).json({
    product,
  });
};

export const getProducts = async (req, res, next) => {
  try {
    let products = await Product.find();
    products = JSON.parse(JSON.stringify(products));
 
    return res.status(200).json(products);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }

};

export const getProduct = async (req, res, next) => {
  try {
    let product;
    try {
      product = await Product.findById(req.query.id);
    } catch (err) {
      console.error(err);
      return res.status(400).json({ message: "Bad Request" });
    }
    if (!product) {
      return res.status(404).json({ message: "Not Found" });
    }
    product = JSON.parse(JSON.stringify(product));
    await db.disconnect();
    return res.status(200).json(product);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
