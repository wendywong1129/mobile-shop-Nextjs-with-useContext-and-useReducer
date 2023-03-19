// /api/orders
import { getSession } from "next-auth/react";
import db from "../../../utils/db";
import Order from "../../../models/Order";

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send("Login required");
  }

  await db.connect();

  const { user } = session;
  const newOrder = new Order({
    ...req.body,
    user: user._id,
  });
  const placedOrder = await newOrder.save();
  await db.disconnect();
  res.status(201).send(placedOrder);
};
export default handler;
