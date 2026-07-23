import type { NextConfig } from "next";

// แอปจริง — ใช้โดเมนของเรา ไม่โชว์ railway.app
const APP_URL = "https://app.ordermeapp.com";

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
