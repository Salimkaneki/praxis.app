import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, 'src'),
      '@dashboard': require('path').resolve(__dirname, 'src/app/(features)/dashboard'),
    };
    return config;
  },
};

export default nextConfig;
