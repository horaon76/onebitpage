import type { AppProps } from "next/app";
import Header from "@/components/Header";

import "@/styles/global.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";

export default function MyApp({ Component, pageProps }: AppProps) {
  console.log("pageProps", pageProps);
  return (
    <Theme accentColor="green">
      <Header menu={pageProps.menu || {}} />
      <main style={{ padding: "20px" }}> {/* Ensure spacing so header isn't hidden */}
        <Component {...pageProps} />
      </main>
    </Theme>
  );
}


