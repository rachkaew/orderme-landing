import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OrderMe — สั่งอาหารง่าย แค่แชท ไม่ต้องโหลดแอป",
  description:
    "ระบบรับออเดอร์ผ่านแชทสำหรับร้านอาหาร รองรับหลายสาขา ชำระเงินด้วย QR Code ติดตั้งเป็น PWA ได้ทันที",
  openGraph: {
    title: "OrderMe — สั่งอาหารง่าย แค่แชท",
    description: "ระบบรับออเดอร์ผ่านแชทสำหรับร้านอาหาร รองรับหลายสาขา",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-white antialiased">{children}</body>
    </html>
  );
}
