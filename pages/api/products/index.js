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
