/** @type {import('tailwindcss').Config} */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["img.icons8.com", "10.0.80.13"],
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
