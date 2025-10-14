import type { NextConfig } from "next";
import path from 'path';

const nextConfig: NextConfig = {
  /* config options here */
  outputFileTracingRoot: path.resolve(__dirname),
  
  // Proxy pour contourner CORS en développement
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://praxis-api.bestwebapp.tech/:path*',
      },
    ];
  },
  
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
      '@dashboard': path.resolve(__dirname, 'src/app/(features)/dashboard'),
    };
    return config;
  },
};

export default nextConfig;
