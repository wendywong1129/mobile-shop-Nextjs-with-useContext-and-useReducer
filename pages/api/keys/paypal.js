// /api/keys/paypal
import { getSession } from "next-auth/react";

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send("Login required");
  }
  res.send(process.env.PAYPAL_CLIENT_ID);
};
export default handler;
