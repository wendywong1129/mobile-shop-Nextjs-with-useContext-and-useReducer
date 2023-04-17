// /api/admin/sales
import { getSession } from "next-auth/react";
import db from "../../../utils/db";
import Order from "../../../models/Order";

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session || (session && !session.user.isAdmin)) {
    return res.status(401).send("Error: Login as admin required");
  }

  await db.connect();

  const salesData = await Order.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
        totalSales: { $sum: "$totalPrice" },
      },
    },
  ]);
  // console.log("salesData:", salesData);
  // console.log("totalSales:",salesData[0].totalSales);

  await db.disconnect();

  res.send(salesData);
};

export default handler;
