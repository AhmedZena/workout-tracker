import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  compiler: {
    // Remove console statements in production except for errors
    removeConsole: {
      exclude: ['error']
    },
  },
};

export default nextConfig;
