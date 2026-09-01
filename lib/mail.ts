import { Resend } from "resend";
import type { ShopApplication } from "./applications";
import { managerUsernameFromSlug } from "./applications";

function siteUrl() {
  return (process.env.SITE_URL || "https://www.ordermeapp.com").replace(/\/$/, "");
}

function fromAddress() {
  return process.env.EMAIL_FROM || "OrderMe <onboarding@resend.dev>";
}

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export function mailConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

async function send(opts: { to: string; subject: string; html: string; text: string }) {
  const resend = getResend();
  if (!resend) {
    console.error("[mail] RESEND_API_KEY ยังไม่ได้ตั้ง — ไม่ได้ส่งอีเมลจริง");
    return {
      ok: false as const,
      error: "ยังไม่ได้ตั้ง RESEND_API_KEY บนเซิร์ฟเวอร์",
    };
  }
  const key = process.env.RESEND_API_KEY || "";
  if (key.length < 20) {
    console.error("[mail] RESEND_API_KEY สั้นผิดปกติ — น่าจะวางไม่ครบ");
    return {
      ok: false as const,
      error: "RESEND_API_KEY ไม่ถูกต้องหรือวางไม่ครบจาก Resend Dashboard",
    };
  }
  const { error } = await resend.emails.send({
    from: fromAddress(),
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
    text: opts.text,
  });
  if (error) {
    console.error("[mail:resend]", error);
    const msg = error.message || "ส่งอีเมลไม่สำเร็จ";
    return { ok: false as const, error: msg };
  }
  return { ok: true as const, mode: "resend" as const };
}

export async function sendVerificationEmail(app: ShopApplication) {
  const link = `${siteUrl()}/signup/verify?token=${app.verifyToken}`;
  const subject = "ยืนยันอีเมลสมัครเปิดร้าน OrderMe";
  const text = [
    `สวัสดีคุณ ${app.applicantFirstName || app.name}`,
    "",
    `กรุณายืนยันอีเมลเพื่อส่งคำขอเปิดร้าน "${app.name}"`,
    `ลิงก์ยืนยัน (หมดอายุใน 24 ชม.): ${link}`,
    "",
    "หากคุณไม่ได้สมัคร สามารถเพิกเฉยอีเมลนี้ได้",
    "— OrderMe",
  ].join("\n");
  const html = `
    <div style="font-family:sans-serif;max-width:520px;line-height:1.6;color:#111">
      <p>สวัสดีคุณ <strong>${escapeHtml(app.applicantFirstName || app.name)}</strong></p>
      <p>กรุณายืนยันอีเมลเพื่อส่งคำขอเปิดร้าน <strong>${escapeHtml(app.name)}</strong></p>
      <p style="margin:24px 0">
        <a href="${link}" style="background:#f97316;color:#fff;padding:12px 20px;border-radius:12px;text-decoration:none;font-weight:600">
          ยืนยันอีเมล
        </a>
      </p>
      <p style="font-size:13px;color:#666">ลิงก์หมดอายุใน 24 ชั่วโมง<br/>${escapeHtml(link)}</p>
      <p style="font-size:13px;color:#999">หากคุณไม่ได้สมัคร สามารถเพิกเฉยอีเมลนี้ได้</p>
    </div>
  `;
  return send({ to: app.email, subject, html, text });
}

export async function sendAdminNewApplicationNotice(app: ShopApplication) {
  const to = process.env.ADMIN_NOTIFY_EMAIL;
  if (!to) return { ok: true as const, skipped: true };
  const subject = `[OrderMe] คำขอเปิดร้านใหม่: ${app.name}`;
  const adminLink = `${siteUrl()}/admin`;
  const text = `มีคำขอเปิดร้านใหม่\nร้าน: ${app.name}\nSlug: ${app.slug}\nอีเมล: ${app.email}\nผู้สมัคร: ${app.applicantFirstName} ${app.applicantLastName}\nตรวจที่: ${adminLink}`;
  const html = `<p>มีคำขอเปิดร้านใหม่</p><ul>
    <li>ร้าน: <strong>${escapeHtml(app.name)}</strong></li>
    <li>Slug: ${escapeHtml(app.slug)}</li>
    <li>อีเมล: ${escapeHtml(app.email)}</li>
    <li>ผู้สมัคร: ${escapeHtml(`${app.applicantFirstName} ${app.applicantLastName}`)}</li>
  </ul><p><a href="${adminLink}">เปิดหลังบ้าน</a></p>`;
  return send({ to, subject, html, text });
}

export async function sendCredentialsEmail(opts: {
  app: ShopApplication;
  username: string;
  password: string;
  manualLinks: { title: string; url: string }[];
}) {
  const { app, username, password, manualLinks } = opts;
  const loginUrl = process.env.APP_LOGIN_URL || "https://app.ordermeapp.com";
  const subject = `ยินดีต้อนรับสู่ OrderMe — บัญชีร้าน ${app.name}`;
  const manualsText =
    manualLinks.length > 0
      ? manualLinks.map((m) => `- ${m.title}: ${m.url}`).join("\n")
      : "- (ยังไม่มีไฟล์คู่มือ — ติดต่อทีมงานได้หากต้องการ)";
  const text = [
    `สวัสดีคุณ ${app.applicantFirstName || app.name}`,
    "",
    `ร้าน "${app.name}" ได้รับการอนุมัติแล้ว`,
    "",
    `เข้าสู่ระบบ: ${loginUrl}`,
    `Username: ${username}`,
    `รหัสผ่านเริ่มต้น: ${password}`,
    `(ระบบจะให้เปลี่ยนรหัสผ่านเมื่อเข้าครั้งแรก)`,
    "",
    "คู่มือการใช้งาน:",
    manualsText,
    "",
    "หากมีคำถาม ติดต่อทีม OrderMe ได้เลย",
    "— OrderMe",
  ].join("\n");
  const manualsHtml =
    manualLinks.length > 0
      ? `<ul>${manualLinks.map((m) => `<li><a href="${m.url}">${escapeHtml(m.title)}</a></li>`).join("")}</ul>`
      : `<p style="color:#666">ยังไม่มีไฟล์คู่มือแนบ — ติดต่อทีมงานได้หากต้องการ</p>`;
  const html = `
    <div style="font-family:sans-serif;max-width:520px;line-height:1.6;color:#111">
      <p>สวัสดีคุณ <strong>${escapeHtml(app.applicantFirstName || app.name)}</strong></p>
      <p>ร้าน <strong>${escapeHtml(app.name)}</strong> ได้รับการอนุมัติแล้ว</p>
      <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:12px;padding:16px;margin:20px 0">
        <p style="margin:0 0 8px">เข้าสู่ระบบ: <a href="${loginUrl}">${escapeHtml(loginUrl)}</a></p>
        <p style="margin:0 0 8px">Username: <strong>${escapeHtml(username)}</strong></p>
        <p style="margin:0">รหัสผ่านเริ่มต้น: <strong>${escapeHtml(password)}</strong></p>
        <p style="margin:8px 0 0;font-size:12px;color:#666">ระบบจะให้เปลี่ยนรหัสผ่านเมื่อเข้าครั้งแรก</p>
      </div>
      <p><strong>คู่มือการใช้งาน</strong></p>
      ${manualsHtml}
      <p style="font-size:13px;color:#999">— OrderMe</p>
    </div>
  `;
  return send({ to: app.email, subject, html, text });
}

export function suggestedUsername(app: ShopApplication) {
  return app.managerUsername || managerUsernameFromSlug(app.slug);
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
