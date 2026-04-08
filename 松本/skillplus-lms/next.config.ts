import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopackは日本語パスでクラッシュするため無効化（Next.js 16 bug）
  bundlePagesRouterDependencies: false,
};

export default nextConfig;
