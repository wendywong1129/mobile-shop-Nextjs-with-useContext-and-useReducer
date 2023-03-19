// /api/admin/users
import { getSession } from "next-auth/react";
import db from "../../../../utils/db";
import User from "../../../../models/User";

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session || !session.user.isAdmin) {
    return res.status(401).send("Login as admin required");
  }

  await db.connect();

  const users = await User.find({});

  await db.disconnect();

  res.send(users);
};

export default handler;
