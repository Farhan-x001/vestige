import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Add your Next.js configuration options here
  reactStrictMode: true,
  // Example: enable image domains
  images: {
    domains: ['example.com'],
  },
  // Other config options...
};

export default nextConfig;
