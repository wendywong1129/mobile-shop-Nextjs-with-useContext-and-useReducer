// /api/auth/register
import bcrypt from "bcryptjs";
import db from "../../../utils/db";
import User from "../../../models/User";

async function handler(req, res) {
  if (req.method !== "POST") {
    return;
  }

  const { name, email, password } = req.body;
  if (
    !name ||
    !email ||
    !email.includes("@") ||
    !password ||
    password.trim().length < 6
  ) {
    res.status(422).json({
      message: "Invalid username or email or password",
    });
    return;
  }

  await db.connect();

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(422).json({ message: "User has already existed" });
    await db.disconnect();
    return;
  }
  const newUser = new User({
    name,
    email,
    password: bcrypt.hashSync(password),
    isAdmin: false,
  });
  const registeredUser = await newUser.save();

  await db.disconnect();

  res.status(201).send({
    message: "User registered successfully",
    _id: registeredUser._id,
    name: registeredUser.name,
    email: registeredUser.email,
    isAdmin: registeredUser.isAdmin,
  });
}

export default handler;
