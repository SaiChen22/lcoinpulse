import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.coingecko.com',
        port: '',
      },
    {
      protocol: 'https',
      hostname:'coin-images.coingecko.com'
    }]
  }
};

export default nextConfig;
