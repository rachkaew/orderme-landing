import { NextResponse } from "next/server";
import {
  createApplication,
  findPendingByEmail,
  isValidEmail,
  isValidPhone,
  normalizeSlug,
  refreshVerification,
  slugTaken,
  updateApplication,
  type CreateApplicationInput,
} from "@/lib/applications";
import { mailConfigured, sendVerificationEmail } from "@/lib/mail";

export const dynamic = "force-dynamic";

const PLANS = new Set(["starter", "shop", "pro"]);

export async function POST(req: Request) {
  let body: Partial<CreateApplicationInput>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
  }

  const name = (body.name || "").trim();
  const email = (body.email || "").trim().toLowerCase();
  const slug = normalizeSlug(body.slug || "");
  const phone = (body.phone || "").trim();
  const applicantPhone = (body.applicantPhone || "").trim();
  const plan = (body.plan || "shop") as CreateApplicationInput["plan"];
  const applicantFirstName = (body.applicantFirstName || "").trim();
  const applicantLastName = (body.applicantLastName || "").trim();
  const applicantAddress = (body.applicantAddress || "").trim();
  const address = (body.address || "").trim();

  if (!name) return NextResponse.json({ error: "กรุณากรอกชื่อร้าน" }, { status: 400 });
  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "กรุณากรอกอีเมลให้ถูกต้อง" }, { status: 400 });
  }
  if (!slug || slug.length < 2) {
    return NextResponse.json(
      { error: "กรุณากรอก slug (ภาษาอังกฤษ/ตัวเลข) อย่างน้อย 2 ตัวอักษร" },
      { status: 400 }
    );
  }
  if (!applicantFirstName || !applicantLastName) {
    return NextResponse.json({ error: "กรุณากรอกชื่อและนามสกุลผู้สมัคร" }, { status: 400 });
  }
  if (!PLANS.has(plan)) {
    return NextResponse.json({ error: "แพ็กเกจไม่ถูกต้อง" }, { status: 400 });
  }
  if (phone && !isValidPhone(phone)) {
    return NextResponse.json({ error: "เบอร์โทรร้านต้องเป็น 10 หลัก ขึ้นต้นด้วย 0" }, { status: 400 });
  }
  if (applicantPhone && !isValidPhone(applicantPhone)) {
    return NextResponse.json(
      { error: "เบอร์โทรผู้สมัครต้องเป็น 10 หลัก ขึ้นต้นด้วย 0" },
      { status: 400 }
    );
  }

  const existing = await findPendingByEmail(email);

  // มีคำขอรอยืนยันอีเมล → ส่งลิงก์ใหม่ (ไม่บล็อก)
  if (existing?.status === "pending_verification") {
    if (await slugTaken(slug, existing.id)) {
      return NextResponse.json({ error: "slug นี้มีคนใช้แล้ว หรือรอตรวจสอบอยู่" }, { status: 409 });
    }
    const refreshed = await refreshVerification(existing.id);
    if (!refreshed) {
      return NextResponse.json({ error: "อัปเดตคำขอไม่สำเร็จ" }, { status: 500 });
    }
    const app =
      (await updateApplication(refreshed.id, {
        name,
        phone,
        address,
        slug,
        plan,
        applicantFirstName,
        applicantLastName,
        applicantPhone,
        applicantAddress,
      })) || refreshed;
    const mail = await sendVerificationEmail(app);
    if (!mail.ok) {
      return NextResponse.json(
        {
          error: `ส่งอีเมลยืนยันไม่สำเร็จ: ${mail.error || "unknown"}`,
          detail: mail.error,
        },
        { status: 502 }
      );
    }
    return NextResponse.json({
      ok: true,
      id: app.id,
      email: app.email,
      resent: true,
      mailMode: mail.mode,
      mailConfigured: mailConfigured(),
      message: "ส่งลิงก์ยืนยันใหม่ไปที่อีเมลแล้ว กรุณาเปิดอีเมลและกดยืนยัน",
    });
  }

  // ยืนยันอีเมลแล้ว รอแอดมินตรวจ
  if (existing?.status === "pending_review") {
    return NextResponse.json(
      {
        error:
          "อีเมลนี้ยืนยันแล้ว และอยู่ในคิวรอตรวจสอบ (ไม่เกิน 24 ชม.) กรุณารออีเมลแจ้ง username จากทีมงาน",
      },
      { status: 409 }
    );
  }

  if (await slugTaken(slug)) {
    return NextResponse.json({ error: "slug นี้มีคนใช้แล้ว หรือรอตรวจสอบอยู่" }, { status: 409 });
  }

  const app = await createApplication({
    name,
    phone,
    email,
    address,
    slug,
    plan,
    applicantFirstName,
    applicantLastName,
    applicantPhone,
    applicantAddress,
  });

  const mail = await sendVerificationEmail(app);
  if (!mail.ok) {
    await updateApplication(app.id, {
      status: "rejected",
      rejectedAt: new Date().toISOString(),
      adminNote: `auto-reject: ส่งอีเมลไม่สำเร็จ (${mail.error || "unknown"})`,
    });
    return NextResponse.json(
      {
        error: `ส่งอีเมลยืนยันไม่สำเร็จ: ${mail.error || "unknown"} — ตรวจ RESEND_API_KEY / EMAIL_FROM บน Railway`,
        detail: mail.error,
      },
      { status: 502 }
    );
  }

  return NextResponse.json({
    ok: true,
    id: app.id,
    email: app.email,
    mailMode: mail.mode,
    mailConfigured: mailConfigured(),
    message: "ส่งลิงก์ยืนยันไปที่อีเมลแล้ว กรุณาเปิดอีเมลและกดยืนยัน",
  });
}
