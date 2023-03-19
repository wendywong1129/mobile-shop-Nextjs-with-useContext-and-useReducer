// /api/admin/orders
import { getSession } from "next-auth/react";
import db from "../../../../utils/db";
import Order from "../../../../models/Order";

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session || (session && !session.user.isAdmin)) {
    return res.status(401).send("Login as admin required");
  }
  if (req.method === "GET") {
    await db.connect();

    const orders = await Order.find({}).populate("user", "name");

    await db.disconnect();

    res.send(orders);
  } else {
    return res.status(400).send({ message: `${req.method} not supported` });
  }
};

export default handler;
