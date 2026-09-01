"use client";

import { useCallback, useEffect, useState } from "react";

type Application = {
  id: string;
  createdAt: string;
  status: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  slug: string;
  plan: string;
  applicantFirstName: string;
  applicantLastName: string;
  applicantPhone: string;
  applicantAddress: string;
  emailVerified: boolean;
  adminNote: string;
  managerUsername: string | null;
  credentialsSentAt: string | null;
};

const statusLabel: Record<string, string> = {
  pending_verification: "รอยืนยันอีเมล",
  pending_review: "รอตรวจสอบ",
  approved: "อนุมัติแล้ว",
  rejected: "ปฏิเสธ",
};

export default function AdminApplications({ onMsg }: { onMsg: (m: string) => void }) {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Application | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("1234");
  const [adminNote, setAdminNote] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/applications");
    setLoading(false);
    if (!res.ok) {
      onMsg("โหลดคำขอไม่สำเร็จ");
      return;
    }
    const data = await res.json();
    setApps(data.applications || []);
  }, [onMsg]);

  useEffect(() => {
    load();
  }, [load]);

  function openApp(a: Application) {
    setSelected(a);
    setUsername(a.managerUsername || `${a.slug}_manager`);
    setPassword("1234");
    setAdminNote(a.adminNote || "");
  }

  async function act(action: "approve" | "reject" | "resend_credentials") {
    if (!selected) return;
    setBusy(true);
    const res = await fetch("/api/admin/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: selected.id,
        action,
        username,
        password,
        adminNote,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      onMsg(data.error || "ดำเนินการไม่สำเร็จ");
      return;
    }
    onMsg(
      action === "reject"
        ? "ปฏิเสธ / ยกเลิกคำขอแล้ว — ผู้สมัครสามารถกรอกฟอร์มใหม่ได้"
        : "ส่งอีเมล username + คู่มือแล้ว · อย่าลืมสร้างร้านในแอพ Admin ด้วยข้อมูลชุดเดียวกัน"
    );
    setSelected(data.application || null);
    await load();
  }

  const pending = apps.filter((a) => a.status === "pending_review");

  return (
    <div>
      <section className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <h2 className="font-semibold text-gray-900">
            คำขอเปิดร้าน
            {pending.length > 0 && (
              <span className="ml-2 text-xs font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                รอตรวจ {pending.length}
              </span>
            )}
          </h2>
          <button
            type="button"
            onClick={load}
            className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50"
          >
            รีเฟรช
          </button>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          ขั้นตอนอนุมัติ: 1) สร้างร้านในแอพ OrderMe Admin ด้วยข้อมูลชุดนี้ 2) กดส่งอีเมล username + คู่มือจากหน้านี้
        </p>

        {loading ? (
          <p className="text-sm text-gray-500">กำลังโหลด...</p>
        ) : apps.length === 0 ? (
          <p className="text-sm text-gray-500">ยังไม่มีคำขอ</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {apps.map((a) => (
              <li key={a.id}>
                <button
                  type="button"
                  onClick={() => openApp(a)}
                  className={`w-full text-left py-3 px-2 rounded-xl hover:bg-gray-50 ${
                    selected?.id === a.id ? "bg-primary-50" : ""
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium text-gray-900 text-sm">{a.name}</p>
                    <span className="text-[11px] font-medium text-gray-500">
                      {statusLabel[a.status] || a.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {a.applicantFirstName} {a.applicantLastName} · {a.email} · /r/{a.slug}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {selected && (
        <section className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
          <h2 className="font-semibold text-gray-900 mb-4">รายละเอียด · {selected.name}</h2>
          <dl className="grid sm:grid-cols-2 gap-3 text-sm mb-4">
            <div>
              <dt className="text-xs text-gray-400">สถานะ</dt>
              <dd>{statusLabel[selected.status] || selected.status}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-400">แพ็กเกจ</dt>
              <dd>{selected.plan}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-400">Slug</dt>
              <dd>/r/{selected.slug}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-400">อีเมล</dt>
              <dd>{selected.email}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-400">โทรร้าน</dt>
              <dd>{selected.phone || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-400">ที่อยู่ร้าน</dt>
              <dd>{selected.address || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-400">ผู้สมัคร</dt>
              <dd>
                {selected.applicantFirstName} {selected.applicantLastName}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-gray-400">โทรผู้สมัคร</dt>
              <dd>{selected.applicantPhone || "—"}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs text-gray-400">ที่อยู่ตามบัตร</dt>
              <dd>{selected.applicantAddress || "—"}</dd>
            </div>
          </dl>

          {(selected.status === "pending_verification" ||
            selected.status === "pending_review" ||
            selected.status === "approved") && (
            <div className="border-t border-gray-100 pt-4 space-y-3">
              {(selected.status === "pending_review" || selected.status === "approved") && (
                <>
                  <label className="block">
                    <span className="text-xs font-medium text-gray-500">Username ที่จะส่ง</span>
                    <input
                      className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-medium text-gray-500">รหัสผ่านเริ่มต้น (ตรงกับที่สร้างในแอพ)</span>
                    <input
                      className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </label>
                </>
              )}
              <label className="block">
                <span className="text-xs font-medium text-gray-500">โน้ตแอดมิน</span>
                <textarea
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm min-h-[64px]"
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                />
              </label>
              <div className="flex flex-wrap gap-2 pt-1">
                {selected.status === "pending_review" && (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => act("approve")}
                    className="px-4 py-2 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 disabled:opacity-50"
                  >
                    อนุมัติ + ส่งอีเมล
                  </button>
                )}
                {(selected.status === "pending_verification" ||
                  selected.status === "pending_review") && (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => act("reject")}
                    className="px-4 py-2 rounded-xl border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 disabled:opacity-50"
                  >
                    {selected.status === "pending_verification"
                      ? "ยกเลิกคำขอ (ให้สมัครใหม่ได้)"
                      : "ปฏิเสธ"}
                  </button>
                )}
                {selected.status === "approved" && (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => act("resend_credentials")}
                    className="px-4 py-2 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 disabled:opacity-50"
                  >
                    ส่งอีเมลอีกครั้ง
                  </button>
                )}
              </div>
              {selected.credentialsSentAt && (
                <p className="text-xs text-gray-400">
                  ส่งอีเมลล่าสุด: {new Date(selected.credentialsSentAt).toLocaleString("th-TH")}
                </p>
              )}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
