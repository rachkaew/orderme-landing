"use client";

import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import type { SiteContent } from "@/lib/content";

type Props = { initial: SiteContent };

function Field({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  const cls =
    "w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300";
  return (
    <label className="block mb-3">
      <span className="block text-xs font-medium text-gray-500 mb-1">{label}</span>
      {multiline ? (
        <textarea
          className={`${cls} min-h-[88px]`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input className={cls} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
      <h2 className="font-semibold text-gray-900 mb-4">{title}</h2>
      {children}
    </section>
  );
}

export default function AdminDashboard({ initial }: Props) {
  const router = useRouter();
  const [content, setContent] = useState<SiteContent>(initial);
  const [tab, setTab] = useState<"text" | "manuals">("text");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploading, setUploading] = useState(false);

  async function saveText() {
    setSaving(true);
    setMsg("");
    const res = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });
    setSaving(false);
    if (!res.ok) {
      setMsg("บันทึกไม่สำเร็จ");
      return;
    }
    setMsg("บันทึกข้อความแล้ว");
    router.refresh();
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  }

  async function onUpload(file: File | null) {
    if (!file) return;
    setUploading(true);
    setMsg("");
    const form = new FormData();
    form.append("file", file);
    form.append("title", uploadTitle || file.name);
    const res = await fetch("/api/admin/manuals", { method: "POST", body: form });
    setUploading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setMsg(data.error || "อัปโหลดไม่สำเร็จ");
      return;
    }
    const data = await res.json();
    setContent((c) => ({ ...c, manuals: [data.manual, ...c.manuals] }));
    setUploadTitle("");
    setMsg("อัปโหลดคู่มือแล้ว");
  }

  async function removeManual(id: string) {
    if (!confirm("ลบไฟล์นี้?")) return;
    const res = await fetch(`/api/admin/manuals?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      setMsg("ลบไม่สำเร็จ");
      return;
    }
    setContent((c) => ({ ...c, manuals: c.manuals.filter((m) => m.id !== id) }));
    setMsg("ลบไฟล์แล้ว");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <p className="font-bold text-gray-900">
            Order<span className="text-primary-500">Me</span> Admin
          </p>
          <div className="flex items-center gap-2">
            <a href="/" target="_blank" className="text-xs text-gray-500 hover:text-primary-600">
              ดูหน้าเว็บ
            </a>
            <button
              onClick={logout}
              className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50"
            >
              ออกจากระบบ
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setTab("text")}
            className={`px-4 py-2 rounded-xl text-sm font-medium ${
              tab === "text" ? "bg-primary-500 text-white" : "bg-white border border-gray-200"
            }`}
          >
            แก้ข้อความ
          </button>
          <button
            onClick={() => setTab("manuals")}
            className={`px-4 py-2 rounded-xl text-sm font-medium ${
              tab === "manuals" ? "bg-primary-500 text-white" : "bg-white border border-gray-200"
            }`}
          >
            คู่มือ / ไฟล์
          </button>
        </div>

        {msg && (
          <p className="mb-4 text-sm text-primary-700 bg-primary-50 border border-primary-100 rounded-xl px-3 py-2">
            {msg}
          </p>
        )}

        {tab === "text" && (
          <>
            <Section title="Hero / หน้าแรก">
              <Field
                label="Badge (คั่นด้วย , )"
                value={content.hero.badges.join(", ")}
                onChange={(v) =>
                  setContent({
                    ...content,
                    hero: {
                      ...content.hero,
                      badges: v.split(",").map((s) => s.trim()).filter(Boolean),
                    },
                  })
                }
              />
              <Field
                label="หัวข้อบรรทัด 1"
                value={content.hero.titleLine1}
                onChange={(v) => setContent({ ...content, hero: { ...content.hero, titleLine1: v } })}
              />
              <Field
                label="หัวข้อสีส้ม"
                value={content.hero.titleHighlight}
                onChange={(v) =>
                  setContent({ ...content, hero: { ...content.hero, titleHighlight: v } })
                }
              />
              <Field
                label="หัวข้อบรรทัด 3"
                value={content.hero.titleLine3}
                onChange={(v) => setContent({ ...content, hero: { ...content.hero, titleLine3: v } })}
              />
              <Field
                label="คำอธิบาย"
                multiline
                value={content.hero.subtitle}
                onChange={(v) => setContent({ ...content, hero: { ...content.hero, subtitle: v } })}
              />
              <Field
                label="ปุ่มหลัก"
                value={content.hero.primaryCta}
                onChange={(v) => setContent({ ...content, hero: { ...content.hero, primaryCta: v } })}
              />
              <Field
                label="ปุ่มรอง"
                value={content.hero.secondaryCta}
                onChange={(v) =>
                  setContent({ ...content, hero: { ...content.hero, secondaryCta: v } })
                }
              />
              <Field
                label="ข้อความใต้ปุ่ม"
                value={content.hero.trustLine}
                onChange={(v) => setContent({ ...content, hero: { ...content.hero, trustLine: v } })}
              />
            </Section>

            <Section title="ฟีเจอร์">
              <Field
                label="หัวข้อ"
                value={content.features.title}
                onChange={(v) =>
                  setContent({ ...content, features: { ...content.features, title: v } })
                }
              />
              <Field
                label="คำอธิบาย"
                multiline
                value={content.features.subtitle}
                onChange={(v) =>
                  setContent({ ...content, features: { ...content.features, subtitle: v } })
                }
              />
              {content.features.items.map((item, i) => (
                <div key={i} className="border-t border-gray-100 pt-3 mt-3">
                  <p className="text-xs text-gray-400 mb-2">ฟีเจอร์ {i + 1}</p>
                  <Field
                    label="ชื่อ"
                    value={item.title}
                    onChange={(v) => {
                      const items = [...content.features.items];
                      items[i] = { ...items[i], title: v };
                      setContent({
                        ...content,
                        features: { ...content.features, items },
                      });
                    }}
                  />
                  <Field
                    label="รายละเอียด"
                    multiline
                    value={item.desc}
                    onChange={(v) => {
                      const items = [...content.features.items];
                      items[i] = { ...items[i], desc: v };
                      setContent({
                        ...content,
                        features: { ...content.features, items },
                      });
                    }}
                  />
                </div>
              ))}
            </Section>

            <Section title="ราคา">
              <Field
                label="หัวข้อ"
                value={content.pricing.title}
                onChange={(v) =>
                  setContent({ ...content, pricing: { ...content.pricing, title: v } })
                }
              />
              <Field
                label="คำอธิบาย"
                multiline
                value={content.pricing.subtitle}
                onChange={(v) =>
                  setContent({ ...content, pricing: { ...content.pricing, subtitle: v } })
                }
              />
              {content.pricing.plans.map((plan, i) => (
                <div key={plan.name} className="border-t border-gray-100 pt-3 mt-3">
                  <p className="text-xs text-gray-400 mb-2">แพ็ก {plan.name}</p>
                  <Field
                    label="ราคา"
                    value={plan.price}
                    onChange={(v) => {
                      const plans = [...content.pricing.plans];
                      plans[i] = { ...plans[i], price: v };
                      setContent({ ...content, pricing: { ...content.pricing, plans } });
                    }}
                  />
                  <Field
                    label="ช่วงเวลา"
                    value={plan.period}
                    onChange={(v) => {
                      const plans = [...content.pricing.plans];
                      plans[i] = { ...plans[i], period: v };
                      setContent({ ...content, pricing: { ...content.pricing, plans } });
                    }}
                  />
                  <Field
                    label="คำอธิบายแพ็ก"
                    value={plan.desc}
                    onChange={(v) => {
                      const plans = [...content.pricing.plans];
                      plans[i] = { ...plans[i], desc: v };
                      setContent({ ...content, pricing: { ...content.pricing, plans } });
                    }}
                  />
                  <Field
                    label="ข้อความปุ่ม"
                    value={plan.cta}
                    onChange={(v) => {
                      const plans = [...content.pricing.plans];
                      plans[i] = { ...plans[i], cta: v };
                      setContent({ ...content, pricing: { ...content.pricing, plans } });
                    }}
                  />
                  <Field
                    label="รายการฟีเจอร์ (บรรทัดละ 1 ข้อ)"
                    multiline
                    value={plan.features.join("\n")}
                    onChange={(v) => {
                      const plans = [...content.pricing.plans];
                      plans[i] = {
                        ...plans[i],
                        features: v.split("\n").map((s) => s.trim()).filter(Boolean),
                      };
                      setContent({ ...content, pricing: { ...content.pricing, plans } });
                    }}
                  />
                </div>
              ))}
            </Section>

            <Section title="CTA + ติดต่อ">
              <Field
                label="หัวข้อ CTA"
                value={content.cta.title}
                onChange={(v) => setContent({ ...content, cta: { ...content.cta, title: v } })}
              />
              <Field
                label="คำอธิบาย CTA"
                multiline
                value={content.cta.subtitle}
                onChange={(v) => setContent({ ...content, cta: { ...content.cta, subtitle: v } })}
              />
              <Field
                label="URL LINE"
                value={content.contact.lineUrl}
                onChange={(v) =>
                  setContent({ ...content, contact: { ...content.contact, lineUrl: v } })
                }
              />
              <Field
                label="LINE ID"
                value={content.contact.lineId}
                onChange={(v) =>
                  setContent({ ...content, contact: { ...content.contact, lineId: v } })
                }
              />
              <Field
                label="เบอร์โทร"
                value={content.contact.phone}
                onChange={(v) =>
                  setContent({ ...content, contact: { ...content.contact, phone: v } })
                }
              />
            </Section>

            <Section title="หัวข้อส่วนคู่มือ (หน้าเว็บ)">
              <Field
                label="หัวข้อ"
                value={content.manualsSection.title}
                onChange={(v) =>
                  setContent({
                    ...content,
                    manualsSection: { ...content.manualsSection, title: v },
                  })
                }
              />
              <Field
                label="คำอธิบาย"
                multiline
                value={content.manualsSection.subtitle}
                onChange={(v) =>
                  setContent({
                    ...content,
                    manualsSection: { ...content.manualsSection, subtitle: v },
                  })
                }
              />
            </Section>

            <button
              onClick={saveText}
              disabled={saving}
              className="w-full py-3 rounded-2xl bg-primary-500 text-white font-semibold text-sm hover:bg-primary-600 disabled:opacity-50"
            >
              {saving ? "กำลังบันทึก..." : "บันทึกข้อความทั้งหมด"}
            </button>
          </>
        )}

        {tab === "manuals" && (
          <Section title="อัปโหลดคู่มือ">
            <Field
              label="ชื่อที่แสดงบนเว็บ"
              value={uploadTitle}
              onChange={setUploadTitle}
            />
            <label className="block mb-4">
              <span className="block text-xs font-medium text-gray-500 mb-1">
                เลือกไฟล์ (PDF / DOC / DOCX สูงสุด 20MB)
              </span>
              <input
                type="file"
                accept=".pdf,.doc,.docx,application/pdf"
                disabled={uploading}
                onChange={(e) => onUpload(e.target.files?.[0] || null)}
                className="block w-full text-sm"
              />
            </label>

            <div className="space-y-2">
              {content.manuals.length === 0 && (
                <p className="text-sm text-gray-400">ยังไม่มีไฟล์คู่มือ</p>
              )}
              {content.manuals.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 px-3 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{m.title}</p>
                    <p className="text-xs text-gray-400 truncate">{m.originalName}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <a
                      href={`/api/manuals/${encodeURIComponent(m.id)}`}
                      className="text-xs px-2.5 py-1.5 rounded-lg bg-primary-50 text-primary-700"
                    >
                      ดาวน์โหลด
                    </a>
                    <button
                      onClick={() => removeManual(m.id)}
                      className="text-xs px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600"
                    >
                      ลบ
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}
      </main>
    </div>
  );
}
