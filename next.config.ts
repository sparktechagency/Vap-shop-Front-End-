/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        //
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
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
