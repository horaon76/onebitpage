import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" suppressHydrationWarning>
      <Head>
        <meta name="description" content="A static Next.js site on GitHub Pages" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
