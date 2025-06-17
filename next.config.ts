/** @type {import('tailwindcss').Config} */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["img.icons8.com"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  css: {
    experimental: {
      engine: "oxide",
    },
  },
};

export default nextConfig;
