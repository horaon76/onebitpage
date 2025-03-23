import type { NextConfig } from "next";
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
  transpilePackages: [/^rc-.*/], // Force Next.js to transpile rc-* packages
  images: { unoptimized: true },
  experimental: {
    esmExternals: "loose", // Enables ESM support
  },
  webpack: (config: { module: { rules: { test: RegExp; include: RegExp; type: string; }[]; }; }) => {
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: "javascript/auto",
    });
    return config;
  },
});

export default nextConfig;
