import type { NextConfig } from "next";
import path from "path";
/** @type {import('next').NextConfig} */
const withTM = require("next-transpile-modules")([
  "rc-util", 
  "antd",
  "rc-pagination",
  "rc-picker",
  "rc-input"
]); // Add modules to transpile
const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = withTM({
  output: "export",
  basePath: "/onebitpage", // Change this if needed
  assetPrefix: "/onebitpage/",
  transpilePackages: [/^rc-.*/, "antd"],  
  images: { unoptimized: true },
  experimental: {
    esmExternals: "loose", // Enables ESM support
  },
  webpack: (config: {
    resolve: any; module: { rules: { test: RegExp; include: RegExp; type: string; }[]; }; 
}) => {
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: "javascript/auto",
    });
     // Ensure `resolve` is properly initialized
     if (!config.resolve) {
      config.resolve = {}; // Initialize `resolve` if it doesn't exist
    }

    // Add alias for `rc-util`
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "rc-util": path.resolve(__dirname, "node_modules/rc-util"),
    };

    return config;
  },
});

export default nextConfig;
