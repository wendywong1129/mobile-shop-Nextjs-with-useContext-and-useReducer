// /api/auth/updateProfile
import { getSession } from "next-auth/react";
import bcrypt from "bcryptjs";
import db from "../../../utils/db";
import User from "../../../models/User";

async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(400).send({ message: `${req.method} not supported` });
  }

  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send({ message: "Login required" });
  }

  const { user } = session;
  const { name, email, password } = req.body;

  if (
    !name ||
    !email ||
    !email.includes("@") ||
    (password && password.trim().length < 6)
  ) {
    res.status(422).json({
      message: "Validation Error",
    });
    return;
  }

  await db.connect();

  const updatedUser = await User.findById(user._id);
  updatedUser.name = name;
  updatedUser.email = email;
  if (password) {
    updatedUser.password = bcrypt.hashSync(password);
  }
  await updatedUser.save();

  await db.disconnect();

  res.send({
    message: "User updated successfully",
  });
}

export default handler;
