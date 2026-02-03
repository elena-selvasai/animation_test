import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export',

  images: {
    unoptimized: true,
  },

  // GitHub Pages 배포 시에만 basePath 적용
  ...(isProd && { basePath: '/animation-sample' }),
};

export default nextConfig;
