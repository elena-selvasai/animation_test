import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export',

  images: {
    unoptimized: true,
  },

  // GitHub Pages 배포 시에만 basePath 적용 (저장소 이름과 일치해야 함)
  ...(isProd && { basePath: '/animation_test' }),
};

export default nextConfig;
