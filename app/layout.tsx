import type { Metadata } from "next";
import { IBM_Plex_Sans_Thai } from "next/font/google";
import "./globals.css";

const ibmPlexSansThai = IBM_Plex_Sans_Thai({
  variable: "--font-ibm-plex-sans-thai",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

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
    <html lang="th" className={`${ibmPlexSansThai.variable} scroll-smooth`}>
      <body className="min-h-screen bg-white antialiased">{children}</body>
    </html>
  );
}
