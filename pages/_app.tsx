import type { AppProps } from "next/app";
import "@/styles/global.css"; // Ensure global styles are loaded

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
    </>
  );
}
