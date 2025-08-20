import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL("https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/**"),
    ],
  },
};

export default nextConfig;
