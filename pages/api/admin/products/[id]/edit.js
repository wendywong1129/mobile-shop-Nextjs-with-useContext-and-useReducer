// /api/admin/products/:id/edit
import { getSession } from "next-auth/react";
import db from "../../../../../utils/db";
import Product from "../../../../../models/Product";

const getHandler = async (req, res) => {
  await db.connect();

  const product = await Product.findById(req.query.id);

  await db.disconnect();

  res.send(product);
};

const putHandler = async (req, res) => {
  await db.connect();

  const updatedProduct = await Product.findById(req.query.id);
  if (updatedProduct) {
    const {
      name,
      slug,
      price,
      category,
      image,
      brand,
      countInStock,
      description,
    } = req.body;
    updatedProduct.name = name;
    updatedProduct.slug = slug;
    updatedProduct.price = price;
    updatedProduct.category = category;
    updatedProduct.image = image;
    updatedProduct.brand = brand;
    updatedProduct.countInStock = countInStock;
    updatedProduct.description = description;
    await updatedProduct.save();

    await db.disconnect();

    res.send({ message: "Product updated successfully" });
  } else {
    await db.disconnect();

    res.status(404).send({ message: "Product not found" });
  }
};

const deleteHandler = async (req, res) => {
  await db.connect();

  const deletedProduct = await Product.findById(req.query.id);
  if (deletedProduct) {
    await deletedProduct.deleteOne();

    await db.disconnect();

    res.send({
      message: "Product deleted successfully",
    });
  } else {
    await db.disconnect();

    res.status(404).send({ message: "Product not found" });
  }
};

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session || (session && !session.user.isAdmin)) {
    return res.status(401).send("Login as admin required");
  }

  if (req.method === "GET") {
    return getHandler(req, res);
  } else if (req.method === "PUT") {
    return putHandler(req, res);
  } else if (req.method === "DELETE") {
    return deleteHandler(req, res);
  } else {
    return res.status(400).send({ message: `${req.method} not supported` });
  }
};

export default handler;
