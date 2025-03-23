import type { NextConfig } from "next";
/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isProd ? "/my-next-app" : "",
  images: { unoptimized: true },

  /**
   * ✅ Automatically transpile ALL `rc-*` packages dynamically
   */
  transpilePackages: [
    "antd",
    "@ant-design",
    ...[
      "rc-util",
      "rc-motion",
      "rc-pagination",
      "rc-picker",
      "rc-dialog",
      "rc-menu",
      "rc-tooltip",
      "rc-drawer",
      "rc-dropdown",
      "rc-tree",
      "rc-table",
      "rc-field-form",
      "rc-input",
      "rc-steps",
      "rc-collapse",
      "rc-checkbox",
      "rc-radio",
      "rc-slider",
      "rc-tabs",
      "rc-upload",
      "rc-tree-select",
      "rc-switch",
      "rc-textarea",
      "rc-tooltip",
      "rc-image",
      "rc-progress",
      "rc-segmented",
      "rc-mentions",
      "rc-resize-observer",
      "rc-virtual-list",
      "rc-watermark",
      "rc-notification",
      "rc-select",
      "rc-rate",
      "rc-time-picker",
      "rc-trigger",
      "rc-dropdown",
      "rc-form",
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
