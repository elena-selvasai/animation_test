import type { NextConfig } from "next";

const nextConfig: NextConfig = {
output: 'export',

images: {
  unoptimized: true,
},

basePath: '/animation-sample',
};

export default nextConfig;
