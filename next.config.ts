import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/newsletter", destination: "/softwarebrief", permanent: true },
      { source: "/newsletter/:path*", destination: "/softwarebrief/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
