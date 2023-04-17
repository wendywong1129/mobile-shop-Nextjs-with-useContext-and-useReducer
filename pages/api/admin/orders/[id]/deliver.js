// /api/admin/orders/:id/deliver
import { getSession } from "next-auth/react";
import db from "../../../../../utils/db";
import Order from "../../../../../models/Order";

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session || (session && !session.user.isAdmin)) {
    return res.status(401).send("Error: Login as admin required");
  }

  await db.connect();

  const { id } = req.query;
  const order = await Order.findById(id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const deliveredOrder = await order.save();

    await db.disconnect();

    res.send({
      message: "order delivered successfully",
      order: deliveredOrder,
    });
  } else {
    await db.disconnect();

    res.status(404).send({ message: "Error: Order not found" });
  }
};

export default handler;
