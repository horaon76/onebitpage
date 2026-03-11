import type { AppProps } from "next/app";
import Header from "@/components/HeaderNew";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

import "@radix-ui/themes/styles.css";
import "@/styles/global.css";
import "@/styles/tutorial.css";
import "@/styles/ShooterGame.module.css";
import { Theme } from "@radix-ui/themes";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Theme accentColor="blue">
        <div className="site-wrapper">
          <Header menu={pageProps.menu || {}} />
          <main className="site-main">
            <Component {...pageProps} />
          </main>
          <Footer />
        </div>
      </Theme>
    </ThemeProvider>
  );
}


