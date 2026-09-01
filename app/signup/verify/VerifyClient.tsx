"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

export default function VerifyClient({ token }: { token: string }) {
  const [state, setState] = useState<"loading" | "ok" | "error">("loading");
  const [message, setMessage] = useState("");
  const [shopName, setShopName] = useState("");

  useEffect(() => {
    if (!token) {
      setState("error");
      setMessage("ลิงก์ไม่ถูกต้อง");
      return;
    }
    let cancelled = false;
    (async () => {
      const res = await fetch("/api/signup/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json().catch(() => ({}));
      if (cancelled) return;
      if (!res.ok) {
        setState("error");
        setMessage(data.error || "ยืนยันไม่สำเร็จ");
        return;
      }
      setShopName(data.name || "");
      setState("ok");
      setMessage(
        data.already
          ? "อีเมลนี้ยืนยันแล้ว คำขออยู่ในคิวตรวจสอบ"
          : "ยืนยันอีเมลสำเร็จ ส่งคำขอเข้าสู่คิวตรวจสอบแล้ว"
      );
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-gray-100 bg-white p-8 shadow-sm text-center">
        {state === "loading" && (
          <>
            <div className="mx-auto mb-4 h-12 w-12 animate-pulse rounded-2xl bg-primary-100" />
            <p className="text-gray-600">กำลังยืนยันอีเมล...</p>
          </>
        )}
        {state === "ok" && (
          <>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-600">
              <CheckCircle2 size={28} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">รอตรวจสอบ</h1>
            {shopName && (
              <p className="text-sm text-gray-500 mb-2">ร้าน: {shopName}</p>
            )}
            <p className="text-gray-600 leading-relaxed mb-4">{message}</p>
            <div className="flex items-start gap-2 rounded-2xl bg-primary-50 px-4 py-3 text-left text-sm text-primary-900">
              <Clock size={16} className="mt-0.5 shrink-0" />
              <span>
                ทีมงานจะตรวจสอบคำขอภายใน <strong>ไม่เกิน 24 ชั่วโมง</strong>
                เมื่ออนุมัติ จะส่ง <strong>username</strong> พร้อมคู่มือไปทางอีเมลของคุณ
              </span>
            </div>
            <Link href="/" className="mt-6 inline-block text-sm font-medium text-primary-600 hover:underline">
              กลับหน้าแรก
            </Link>
          </>
        )}
        {state === "error" && (
          <>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600">
              <XCircle size={28} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">ยืนยันไม่สำเร็จ</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <Link
              href="/signup"
              className="inline-flex rounded-2xl bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-600"
            >
              สมัครใหม่
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
