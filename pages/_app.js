import Router from "next/router";
import NProgress from "nprogress"; //nprogress module
import { Provider } from "react-redux";
import { SessionProvider, useSession } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "next-themes";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import "@/styles/globals.css";

// import "nprogress/nprogress.css";
import { SWRConfig } from "swr";
import fetcher from "@/util/fetch";
import { store } from "@/slices/store";
import Layout from "@/components/Layout/Layout";
import { AnimatePresence } from "framer-motion";

//Binding events.
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

function App({ Component, pageProps }) {
  const { pathname } = useRouter();
  return (
    <SessionProvider session={pageProps.session}>
      <SWRConfig
        value={{
          refreshInterval: 1000,
          fetcher,
        }}
      >
        <ThemeProvider enableSystem={true} attribute="class">
          <Provider store={store}>
            <Layout>
              <AnimatePresence mode="wait">
                <PayPalScriptProvider deferLoading={true}>
                  {Component.auth ? (
                    <Auth adminOnly={Component.auth.adminOnly}>
                      <Component {...pageProps} key={pathname} />
                    </Auth>
                  ) : (
                    <Component {...pageProps} key={pathname} />
                  )}
                  <ToastContainer limit={1} />
                </PayPalScriptProvider>
              </AnimatePresence>
            </Layout>
          </Provider>
        </ThemeProvider>
      </SWRConfig>
    </SessionProvider>
  );
}

function Auth({ children, adminOnly }) {
  const router = useRouter();
  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/unauthorized?message=login required");
    },
  });
  if (status === "loading") {
    return (
      <div className="justify-center items-center ">
        <CircularProgress />
        {/* <Skeleton width={100} count={12} /> */}
      </div>
    );
  }
  if (adminOnly && !session.user.isAdmin) {
    router.push("/unauthorized?message=admin login required");
  }

  return children;
}

export default App;
