import type { NextConfig } from "next";

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
};

export default nextConfig;
