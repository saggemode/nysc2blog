import db from "@/util/db";
import Category from "@/models/Category";

const handler = async (req, res) => {
  try {
    await db.connect();
    let categories = await Category.find({});
    categories = JSON.parse(JSON.stringify(categories));
    await db.disconnect();
    return res.status(200).json(categories);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export default handler;
