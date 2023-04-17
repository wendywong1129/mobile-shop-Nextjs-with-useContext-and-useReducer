// /api/admin/summary
import { getSession } from "next-auth/react";
import db from "../../../utils/db";
import Order from "../../../models/Order";
import Product from "../../../models/Product";
import User from "../../../models/User";

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session || (session && !session.user.isAdmin)) {
    return res.status(401).send("Error: Login as admin required");
  }

  await db.connect();

  const ordersCount = await Order.countDocuments();
  const productsCount = await Product.countDocuments();
  const usersCount = await User.countDocuments();

  const ordersPriceGroup = await Order.aggregate([
    {
      $group: {
        _id: null,
        sales: { $sum: "$totalPrice" },
      },
    },
  ]);
  const ordersPrice =
    ordersPriceGroup.length > 0 ? ordersPriceGroup[0].sales : 0;
  // console.log("ordersPriceGroup:", ordersPriceGroup);
  // console.log("ordersPrice:", ordersPrice);

  await db.disconnect();

  res.send({ ordersCount, productsCount, usersCount, ordersPrice });
};

export default handler;
