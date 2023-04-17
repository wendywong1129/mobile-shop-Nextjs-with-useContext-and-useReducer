// /api/products/:id
import db from "../../../../utils/db";
import Product from "../../../../models/Product";

const handler = async (req, res) => {
  const {
    query: { id },
  } = req;

  await db.connect();

  const product = await Product.findById(id);

  await db.disconnect();

  res.send(product);
};

export default handler;
