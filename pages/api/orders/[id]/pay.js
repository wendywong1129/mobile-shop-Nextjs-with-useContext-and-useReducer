// /api/orders/:id/pay
import { getSession } from "next-auth/react";
import db from "../../../../utils/db";
import Order from "../../../../models/Order";

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send("Error: Login required");
  }

  await db.connect();

  const { id } = req.query;
  const order = await Order.findById(id);
  if (order) {
    if (order.isPaid) {
      return res.status(400).send({ message: "Error: order is already paid" });
    }
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      email_address: req.body.email_address,
    };
    const paidOrder = await order.save();

    await db.disconnect();

    res.send({ message: "Order paid successfully", order: paidOrder });
  } else {
    await db.disconnect();

    res.status(404).send({ message: "Error: order not found" });
  }
};

export default handler;
