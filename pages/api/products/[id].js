import nc from "next-connect";
import db from "@/util/db";
import { getProduct } from "@/backend/controllers/productControllers";

const handler = nc();
db.connect();
handler.get(getProduct);
export default handler;

