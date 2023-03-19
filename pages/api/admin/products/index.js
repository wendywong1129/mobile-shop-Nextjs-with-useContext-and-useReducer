// /api/admin/products
import { getSession } from "next-auth/react";
import db from "../../../../utils/db";
import Product from "../../../../models/Product";

const getHandler = async (req, res) => {
  await db.connect();

  const products = await Product.find({});

  await db.disconnect();

  res.send(products);
};

const postHandler = async (req, res) => {
  const {
    name,
    slug,
    image,
    price,
    category,
    brand,
    countInStock,
    description,
  } = req.body;

  await db.connect();

  const newProduct = new Product({
    name: name,
    slug: slug,
    image: image,
    price: price,
    category: category,
    brand: brand,
    countInStock: countInStock,
    description: description,
  });
  const createdProduct = await newProduct.save();

  await db.disconnect();

  res.send({
    message: "Product created successfully",
    product: createdProduct,
  });
};

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session || !session.user.isAdmin) {
    return res.status(401).send("Login as admin required");
  }

  if (req.method === "GET") {
    return getHandler(req, res);
  } else if (req.method === "POST") {
    return postHandler(req, res);
  } else {
    return res.status(400).send({ message: `${req.method} not supported` });
  }
};

export default handler;
