"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "เข้าสู่ระบบไม่สำเร็จ");
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-primary-50 flex items-center justify-center px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
      >
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-xl bg-primary-500 flex items-center justify-center">
            <span className="text-white text-sm font-bold">O</span>
          </div>
          <div>
            <p className="font-bold text-gray-900">OrderMe Admin</p>
            <p className="text-xs text-gray-400">จัดการหน้าขาย</p>
          </div>
        </div>

        <label className="block text-sm font-medium text-gray-700 mb-1.5">รหัสผ่าน</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-primary-300"
          placeholder="ใส่รหัสผ่านแอดมิน"
          autoFocus
        />

        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

        <button
          type="submit"
          disabled={loading || !password}
          className="w-full rounded-xl bg-primary-500 text-white font-semibold py-2.5 text-sm hover:bg-primary-600 disabled:opacity-50"
        >
          {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </button>
      </form>
    </div>
  );
}
