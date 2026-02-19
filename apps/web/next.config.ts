import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@loaddrop/shared", "@loaddrop/ui"],
};

export default nextConfig;
