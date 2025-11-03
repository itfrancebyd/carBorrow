import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // 'private-next-root-dir': __dirname
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig;
