import type { NextConfig } from "next";
/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isProd ? "/onebitpage" : "",
  images: { unoptimized: true },

  /**
   * ✅ Automatically transpile ALL `rc-*` packages dynamically
   */
  transpilePackages: [
    "antd",
    "@ant-design",
    ...[
     "antd",
    "rc-util",
    "rc-menu",
    "rc-picker",
    "rc-dialog",
    "rc-dropdown",
    "rc-tree",
    "rc-input"
    ],
  ],

  webpack: (config) => {
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: "javascript/auto",
    });
    return config;
  },
};

export default nextConfig;
