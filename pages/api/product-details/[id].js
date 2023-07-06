import Product from "@/models/Product";
import db from "@/util/db";

const handler = async (req, res) => {
  try {
    await db.connect();
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
export default handler;
