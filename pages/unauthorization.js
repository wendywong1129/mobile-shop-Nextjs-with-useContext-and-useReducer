import { useRouter } from "next/router";
import Layout from "../components/Layout";

export default function UnauthorizationPage() {
  const router = useRouter();
  const { message } = router.query;

  return (
    <Layout title="Unauthorization Page">
      <h1 className="mb-2 text-3xl font-bold">Access Denied</h1>
      {message && <div className="text-xl text-pink-600 font-semibold">{message}</div>}
    </Layout>
  );
}
