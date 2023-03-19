// /api/orders/history
import { getSession } from "next-auth/react";
import db from "../../../utils/db";
import Order from "../../../models/Order";

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send({ message: "Login required" });
  }

  await db.connect();

  const { user } = session;
  const orders = await Order.find({ user: user._id });

  await db.disconnect();

  res.send(orders);
};

export default handler;
