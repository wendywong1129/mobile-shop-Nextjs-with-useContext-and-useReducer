// /api/orders/:id
import { getSession } from "next-auth/react";
import db from "../../../../utils/db";
import Order from "../../../../models/Order";

const handler = async (req, res) => {
  const {
    query: { id },
  } = req;

  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send("Error: Login required");
  }

  await db.connect();

  const order = await Order.findById(id);

  await db.disconnect();

  res.send(order);
};

export default handler;
