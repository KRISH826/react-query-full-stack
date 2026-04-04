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
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "s3-ecomkp16.s3.ap-south-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "e-com-s3.s3.ap-south-1.amazonaws.com", // ← Use this
      },
      {
        protocol: "https",
        hostname: "e-com-s3.s3.ap-southeast-2.amazonaws.com", // ← Use this
      },
    ],
  },

};

export default nextConfig;
