// /api/admin/users/:id/edit
import { getSession } from "next-auth/react";
import db from "../../../../../utils/db";
import User from "../../../../../models/User";

const getHandler = async (req, res) => {
  await db.connect();

  const user = await User.findById(req.query.id);

  await db.disconnect();

  res.send(user);
};

const putHandler = async (req, res) => {
  await db.connect();

  const updatedUser = await User.findById(req.query.id);
  if (updatedUser) {
    const { name, email, isAdmin } = req.body;
    updatedUser.name = name;
    updatedUser.email = email;
    updatedUser.isAdmin = isAdmin;
    if (updatedUser.email === "admin@gmail.com" && !updatedUser.isAdmin) {
      return res
        .status(400)
        .send({ message: "Authorization of admin cannot be canceled" });
    }
    await updatedUser.save();

    await db.disconnect();

    res.send({ message: "User updated successfully" });
  } else {
    await db.disconnect();

    res.status(404).send({ message: "User not found" });
  }
};

const deleteHandler = async (req, res) => {
  await db.connect();

  const user = await User.findById(req.query.id);

  if (user) {
    if (user.email === "admin@gmail.com") {
      return res.status(400).send({ message: "Admin cannot be deleted" });
    }
    await user.deleteOne();

    await db.disconnect();

    res.send({ message: "User deleted successfully" });
  } else {
    await db.disconnect();

    res.status(404).send({ message: "User not found" });
  }
};

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session || !session.user.isAdmin) {
    return res.status(401).send("Login as admin required");
  }

  if (req.method === "GET") {
    return getHandler(req, res);
  } else if (req.method === "PUT") {
    return putHandler(req, res);
  } else if (req.method === "DELETE") {
    return deleteHandler(req, res);
  } else {
    return res.status(400).send({ message: `${req.method} not supported` });
  }
};

export default handler;
