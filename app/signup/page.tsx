import type { Metadata } from "next";
import Link from "next/link";
import SignupForm from "./SignupForm";

export const metadata: Metadata = {
  title: "สมัครเปิดร้าน — OrderMe",
  description: "สมัครเปิดร้านบน OrderMe ยืนยันอีเมล แล้วรอตรวจสอบไม่เกิน 24 ชั่วโมง",
};

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-white">
      <header className="border-b border-primary-100/60 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="font-bold text-gray-900">
            Order<span className="text-primary-500">Me</span>
          </Link>
          <Link href="/app" className="text-sm font-medium text-gray-600 hover:text-primary-600">
            เข้าสู่ระบบ
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-10 sm:py-14">
        <div className="mb-8 text-center sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-500 mb-2">
            เปิดร้านเอง
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            สมัครเปิดร้าน OrderMe
          </h1>
          <p className="text-gray-500 max-w-xl">
            กรอกข้อมูลร้านและผู้สมัคร ยืนยันอีเมล แล้วรอทีมงานตรวจสอบ ไม่เกิน 24 ชั่วโมง
            เมื่อผ่านจะส่ง username พร้อมคู่มือไปที่อีเมลของคุณ
          </p>
        </div>
        <SignupForm />
      </main>
    </div>
  );
}
