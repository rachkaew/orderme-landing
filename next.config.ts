import type { NextConfig } from "next";

// แอปจริงอยู่ที่ app.ordermeapp.com (ตั้ง APP_URL บน Railway Variables ได้)
const APP_URL = process.env.APP_URL || "https://app.ordermeapp.com";

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
