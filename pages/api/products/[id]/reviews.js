// /api/products/:id/reviews
import { getSession } from "next-auth/react";
import db from "../../../../utils/db";
import Product from "../../../../models/Product";

const getHandler = async (req, res) => {
  await db.connect();

  const product = await Product.findById(req.query.id);

  await db.disconnect();

  if (product) {
    res.send(product.reviews);
  } else {
    await db.disconnect();

    res.status(404).send({ message: "Product not found" });
  }
};

const postHandler = async (req, res) => {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).send("Login required");
  }
  const { user } = session;

  await db.connect();

  const product = await Product.findById(req.query.id);
  if (product) {
    const existingReview = product.reviews?.find(
      (review) => review.user == user._id
    );
    if (existingReview) {
      await Product.updateOne(
        { _id: req.query.id, "reviews._id": existingReview._id },
        {
          $set: {
            "reviews.$.comment": req.body.comment,
            "reviews.$.rating": Number(req.body.rating),
          },
        }
      );
      const updatedProduct = await Product.findById(req.query.id);
      updatedProduct.numReviews = updatedProduct.reviews.length;
      updatedProduct.rating =
        updatedProduct.reviews.reduce(
          (total, review) => review.rating + total,
          0
        ) / updatedProduct.reviews.length;
      await updatedProduct.save();

      await db.disconnect();

      res.send({ message: "Review updated successfully" });
    } else {
      const { rating, comment } = req.body;
      const newReview = {
        user: user._id,
        name: user.name,
        rating: Number(rating),
        comment: comment,
      };
      product.reviews.push(newReview);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((total, review) => review.rating + total, 0) /
        product.reviews.length;
      await product.save();

      await db.disconnect();

      res.status(201).send(newReview);
    }
  } else {
    await db.disconnect();

    res.status(404).send({ message: "Product not found" });
  }
};

const handler = async (req, res) => {
  if (req.method === "GET") {
    return getHandler(req, res);
  } else if (req.method === "POST") {
    return postHandler(req, res);
  } else {
    return res.status(400).send({ message: `${req.method} not supported` });
  }
};

export default handler;
