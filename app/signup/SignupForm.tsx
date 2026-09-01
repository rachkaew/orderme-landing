"use client";

import { useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, Mail } from "lucide-react";

type FormState = {
  name: string;
  phone: string;
  email: string;
  address: string;
  slug: string;
  plan: "starter" | "shop" | "pro";
  applicantFirstName: string;
  applicantLastName: string;
  applicantPhone: string;
  applicantAddress: string;
};

const initial: FormState = {
  name: "",
  phone: "",
  email: "",
  address: "",
  slug: "",
  plan: "shop",
  applicantFirstName: "",
  applicantLastName: "",
  applicantPhone: "",
  applicantAddress: "",
};

function normalizeSlug(raw: string) {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

function formatPhone(raw: string) {
  return raw.replace(/\D/g, "").slice(0, 10);
}

const fieldCls =
  "w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-300";

export default function SignupForm() {
  const [form, setForm] = useState<FormState>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<{ email: string } | null>(null);

  const usernamePreview = useMemo(() => {
    const s = normalizeSlug(form.slug);
    return s ? `${s}_manager` : "—";
  }, [form.slug]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        slug: normalizeSlug(form.slug),
        phone: formatPhone(form.phone),
        applicantPhone: formatPhone(form.applicantPhone),
      }),
    });
    const data = await res.json().catch(() => ({}));
    setSubmitting(false);
    if (!res.ok) {
      setError(data.error || "สมัครไม่สำเร็จ");
      return;
    }
    setDone({ email: data.email || form.email });
  }

  if (done) {
    return (
      <div className="rounded-3xl border border-primary-100 bg-white p-8 shadow-sm text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 text-primary-600">
          <Mail size={28} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">ตรวจสอบอีเมลของคุณ</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          ส่งลิงก์ยืนยันไปที่ <strong className="text-gray-900">{done.email}</strong> แล้ว
          กดยืนยันภายใน 24 ชั่วโมงเพื่อส่งคำขอเปิดร้านเข้าสู่คิวตรวจสอบ
        </p>
        <p className="text-sm text-gray-500">
          ไม่เจออีเมล? ดูที่โฟลเดอร์ Spam / Junk หรือติดต่อทีมงาน
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">ข้อมูลร้าน</h2>
        <p className="text-sm text-gray-500 mt-1">
          กรอกข้อมูลเดียวกับที่ทีมแอดมินใช้เปิดร้าน — หลังยืนยันอีเมล รอตรวจสอบไม่เกิน 24 ชม.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-1">
          <span className="mb-1 block text-xs font-medium text-gray-500">ชื่อร้าน *</span>
          <input className={fieldCls} required value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="เช่น ร้านก๋วยเตี๋ยวเรือ" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-gray-500">เบอร์โทรร้าน</span>
          <input className={fieldCls} inputMode="numeric" maxLength={10} value={form.phone} onChange={(e) => set("phone", formatPhone(e.target.value))} placeholder="0811111111" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-gray-500">อีเมลร้าน *</span>
          <input className={fieldCls} type="email" required value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="shop@example.com" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-gray-500">แพ็กเกจ</span>
          <select className={fieldCls} value={form.plan} onChange={(e) => set("plan", e.target.value as FormState["plan"])}>
            <option value="starter">เริ่มต้น (Starter)</option>
            <option value="shop">หน้าร้าน (Shop)</option>
            <option value="pro">เจ้าของร้าน (Pro)</option>
          </select>
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-xs font-medium text-gray-500">ที่อยู่ร้าน</span>
          <input className={fieldCls} value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="ที่อยู่สำหรับจัดส่ง / ติดต่อ" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-gray-500">Slug * (URL: /r/slug)</span>
          <input
            className={fieldCls}
            required
            value={form.slug}
            onChange={(e) => set("slug", e.target.value)}
            onBlur={() => set("slug", normalizeSlug(form.slug))}
            placeholder="fsh"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-gray-500">Username ผู้จัดการ (อัตโนมัติ)</span>
          <input className={`${fieldCls} bg-gray-50 text-primary-700 font-medium`} value={usernamePreview} readOnly />
          <span className="mt-1 block text-[11px] text-gray-400">
            แอดมินจะส่ง username นี้ไปทางอีเมลหลังอนุมัติ พร้อมคู่มือ
          </span>
        </label>
      </div>

      <div className="mt-8 mb-4 border-t border-gray-100 pt-6">
        <h2 className="text-xl font-bold text-gray-900">ข้อมูลผู้สมัคร</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-gray-500">ชื่อ *</span>
          <input className={fieldCls} required value={form.applicantFirstName} onChange={(e) => set("applicantFirstName", e.target.value)} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-gray-500">นามสกุล *</span>
          <input className={fieldCls} required value={form.applicantLastName} onChange={(e) => set("applicantLastName", e.target.value)} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-gray-500">เบอร์โทรผู้สมัคร</span>
          <input className={fieldCls} inputMode="numeric" maxLength={10} value={form.applicantPhone} onChange={(e) => set("applicantPhone", formatPhone(e.target.value))} />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-xs font-medium text-gray-500">ที่อยู่ตามบัตรประชาชน</span>
          <textarea className={`${fieldCls} min-h-[72px]`} value={form.applicantAddress} onChange={(e) => set("applicantAddress", e.target.value)} />
        </label>
      </div>

      <ul className="mt-6 space-y-2 text-sm text-gray-600">
        <li className="flex gap-2 items-start">
          <CheckCircle2 size={16} className="text-primary-500 mt-0.5 shrink-0" />
          ยืนยันอีเมลผ่าน Resend ก่อนเข้าคิวตรวจสอบ
        </li>
        <li className="flex gap-2 items-start">
          <CheckCircle2 size={16} className="text-primary-500 mt-0.5 shrink-0" />
          รอแอดมินตรวจสอบไม่เกิน 24 ชั่วโมง
        </li>
        <li className="flex gap-2 items-start">
          <CheckCircle2 size={16} className="text-primary-500 mt-0.5 shrink-0" />
          เมื่ออนุมัติ จะได้รับ username + คู่มือทางอีเมล
        </li>
      </ul>

      {error && (
        <p className="mt-4 rounded-xl bg-red-50 text-red-700 text-sm px-4 py-3">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="mt-6 inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-primary-500 px-6 py-3.5 text-sm font-semibold text-white hover:bg-primary-600 disabled:opacity-60"
      >
        {submitting ? "กำลังส่ง..." : "สมัครเปิดร้าน"}
        <ArrowRight size={16} />
      </button>
    </form>
  );
}
