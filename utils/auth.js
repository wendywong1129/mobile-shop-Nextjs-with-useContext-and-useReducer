import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export default function Auth({ children, adminOnly }) {
  const router = useRouter();

  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/unauthorization?message=Login required");
    },
  });

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (adminOnly && !session.user.isAdmin) {
    router.push("/unauthorization?message=Login as admin required");
  }

  return children;
}
