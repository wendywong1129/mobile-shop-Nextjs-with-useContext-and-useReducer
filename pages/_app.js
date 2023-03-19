import { useRouter } from "next/router";
import { SessionProvider, useSession } from "next-auth/react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { StoreProvider } from "../utils/store";
import "../styles/globals.css";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <StoreProvider>
        <PayPalScriptProvider deferLoading={true}>
          {Component.auth ? (
            <Auth adminOnly={Component.auth.adminOnly}>
              <Component {...pageProps} />
            </Auth>
          ) : (
            <Component {...pageProps} />
          )}
        </PayPalScriptProvider>
      </StoreProvider>
    </SessionProvider>
  );
}

function Auth({ children, adminOnly }) {
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
