import type { NextConfig } from "next";
import redirects from "./content/redirects.json";

const nextConfig: NextConfig = {
  // The isolated development previews use 127.0.0.1 on ports 3001+.
  // Allow HMR for that same local host without widening production origins.
  allowedDevOrigins: ["127.0.0.1"],
  images: {
    qualities: [70, 75],
  },
  turbopack: {
    root: process.cwd(),
  },
  // 2026-09 통합 개편: 대표 글로 합친 기존 URL을 영구 이동한다 (docs/adsense-consolidation-map.csv).
  async redirects() {
    return redirects.map(({ source, destination }) => ({ source, destination, permanent: true }));
  },
};

export default nextConfig;
