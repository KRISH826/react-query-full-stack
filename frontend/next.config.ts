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
      {
        protocol: "https",
        hostname: "e-com-s3.s3.ap-south-1.amazonaws.com",
      }
    ],
  },
  // async rewrites() {
  //   return [
  //     {
  //       source: "/api/:path*",
  //       destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
  //     },
  //   ];
  // },
};

export default nextConfig;
