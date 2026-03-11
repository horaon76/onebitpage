import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useTheme } from "./ThemeProvider";

// Dynamically import Giscus to avoid SSR issues (it uses the `window` object)
const Giscus = dynamic(() => import("@giscus/react"), { ssr: false });

export default function GiscusComments() {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <div className="giscus-wrapper">
      {/* key={router.asPath} forces a full remount on every route change so
          Giscus re-queries the correct discussion for the current page */}
      <Giscus
        key={router.asPath}
        repo="horaon76/onebitpage"
        repoId="R_kgDOOM-sUQ"
        category="onebitpage"
        categoryId="DIC_kwDOOM-sUc4CoYNm"
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={theme === "dark" ? "dark" : "light"}
        lang="en"
        loading="eager"
      />
    </div>
  );
}
