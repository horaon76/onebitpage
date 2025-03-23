const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath: isProd ? "/onebitpage" : "",
  assetPrefix: isProd ? "/onebitpage/" : "",
  images: { unoptimized: true },
  compiler: {
    styledComponents: true,
  },
  webpack: (config: { module: { rules: { test: RegExp; include: RegExp; type: string; }[]; }; }) => {
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: "javascript/auto",
    });
    return config;
  },
};

export default nextConfig;
