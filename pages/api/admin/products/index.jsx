// import { getSession } from "next-auth/react";
// import Product from "@/models/Product";
// import db from "@/utils/db";

// const handler = async (req, res) => {
//   const session = await getSession({ req });
//   if (!session || !session.user.isAdmin) {
//     return res.status(401).send("admin signin required");
//   }
//   // const { user } = session;
//   if (req.method === "GET") {
//     return getHandler(req, res);
//   }
//   if (req.method === "POST") {
//     return postHandler(req, res);
//   } else {
//     return res.status(400).send({ message: "Method not allowed" });
//   }
// };

// const getHandler = async (req, res) => {
//   await db.connect();
//   const products = await Product.find({});
//   await db.disconnect();
//   res.send(products);
// };

// const postHandler = async (req, res) => {
//   await db.connect();
//   const product = await new Product(req.body);
//   try {
//     await product.save();
//     await db.disconnect();
//     res.send({ message: "Product creation successfully" });
//   } catch (error) {
//     await db.disconnect();
//     res.status(500).send({ message: "Product creation Failed" });
//   }
// };
// export default handler;


import nc from "next-connect";
import db from "@/util/db";

import {
  getProducts,
  newProduct,
} from "@/backend/controllers/productControllers";

const handler = nc();

db.connect();

handler.get(getProducts);
handler.post(newProduct);

export default handler;
