import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.rareblocks.xyz",
      },
      {
        protocol: "https",
        hostname: "s3-ecomkp16.s3.ap-south-1.amazonaws.com",
      },
    ],
  },

};

export default nextConfig;
