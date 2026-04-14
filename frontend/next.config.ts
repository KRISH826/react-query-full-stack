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
  async rewrites() {
    return [
      {
        // All /api/* calls are proxied to your Express backend.
        // This makes the browser treat them as same-origin, so
        // SameSite=Lax cookies (refreshToken, email) are sent
        // on POST requests without needing SameSite=None + Secure.
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
