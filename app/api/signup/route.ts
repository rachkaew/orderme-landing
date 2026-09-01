import { NextResponse } from "next/server";
import {
  createApplication,
  emailPending,
  isValidEmail,
  isValidPhone,
  normalizeSlug,
  slugTaken,
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
    return NextResponse.json({ error: "กรุณากรอก slug (ภาษาอังกฤษ/ตัวเลข) อย่างน้อย 2 ตัวอักษร" }, { status: 400 });
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
    return NextResponse.json({ error: "เบอร์โทรผู้สมัครต้องเป็น 10 หลัก ขึ้นต้นด้วย 0" }, { status: 400 });
  }
  if (await slugTaken(slug)) {
    return NextResponse.json({ error: "slug นี้มีคนใช้แล้ว หรือรอตรวจสอบอยู่" }, { status: 409 });
  }
  if (await emailPending(email)) {
    return NextResponse.json(
      { error: "อีเมลนี้มีคำขอที่รออยู่แล้ว กรุณาตรวจกล่องจดหมายหรือรอการอนุมัติ" },
      { status: 409 }
    );
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
    return NextResponse.json(
      { error: "ส่งอีเมลยืนยันไม่สำเร็จ กรุณาลองใหม่หรือติดต่อทีมงาน", detail: mail.error },
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
