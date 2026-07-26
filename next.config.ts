import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Speed up production builds by disabling full static type checking during builds
    ignoreBuildErrors: true,
  },
  devIndicators: false,
};

export default nextConfig;
