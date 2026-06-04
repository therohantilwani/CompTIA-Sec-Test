import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/CompTIA-Sec-Test",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
