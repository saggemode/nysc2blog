import { getSession } from "next-auth/react";
import Category from "@/models/Category";
import db from "@/util/db";

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(400).send({ message: `${req.method} not supported` });
  }

  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send({ message: "signin required" });
  }

  const { categoryName } = req.body;
  if (!categoryName) {
    res.status(422).json({
      message: "Category can not be empty",
    });
    return;
  }

  await db.connect();

  const existingCatName = await Category.findOne({ categoryName: categoryName });
  if (existingCatName) {
    res.status(422).json({ message: "Category exists already!" });
    await db.disconnect();
    return;
  }

  const newCategory = new Category({
    categoryName,
  });

  const category = await newCategory.save();
  await db.disconnect();
  res.status(201).send({
    message: "Created Category!",
    categoryName: category.categoryName,
  });
}

export default handler;
