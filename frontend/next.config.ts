import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.rareblocks.xyz",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.s3.ap-south-1.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "e-com-s3.ap-south-1.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
        pathname: "/**",
      }
    ],
    // unoptimized: true, // Set to true if upstream continues to return 400 errors
  },
};

export default nextConfig;
