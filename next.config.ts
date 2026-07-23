import type { NextConfig } from "next";

// เปลี่ยน URL นี้เป็น Railway URL จริงของแอป
const APP_URL = process.env.APP_URL || "https://orderme-production.up.railway.app";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/app",
        destination: APP_URL,
        permanent: false,
      },
      {
        source: "/app/:path*",
        destination: `${APP_URL}/:path*`,
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
