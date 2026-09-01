import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import {
  getApplication,
  listApplications,
  managerUsernameFromSlug,
  updateApplication,
} from "@/lib/applications";
import { readContent } from "@/lib/content";
import { sendCredentialsEmail, suggestedUsername } from "@/lib/mail";

export const dynamic = "force-dynamic";

function siteUrl() {
  return (process.env.SITE_URL || "https://www.ordermeapp.com").replace(/\/$/, "");
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const applications = await listApplications();
  return NextResponse.json({ applications });
}

export async function POST(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    id?: string;
    action?: "approve" | "reject" | "resend_credentials";
    username?: string;
    password?: string;
    adminNote?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
  }

  const id = body.id || "";
  const action = body.action;
  const app = await getApplication(id);
  if (!app) return NextResponse.json({ error: "ไม่พบคำขอ" }, { status: 404 });

  if (action === "reject") {
    const updated = await updateApplication(id, {
      status: "rejected",
      rejectedAt: new Date().toISOString(),
      adminNote: (body.adminNote || "").trim(),
    });
    return NextResponse.json({ ok: true, application: updated });
  }

  if (action === "approve" || action === "resend_credentials") {
    const username =
      (body.username || "").trim() ||
      suggestedUsername(app) ||
      managerUsernameFromSlug(app.slug);
    const password = (body.password || "").trim();
    if (!username) {
      return NextResponse.json({ error: "กรุณาระบุ username" }, { status: 400 });
    }
    if (action === "approve" && password.length < 4) {
      return NextResponse.json(
        { error: "กรุณาระบุรหัสผ่านเริ่มต้นอย่างน้อย 4 ตัวอักษร (สร้างในแอพก่อน แล้วส่งอีเมล)" },
        { status: 400 }
      );
    }
    if (action === "resend_credentials" && password.length < 4) {
      return NextResponse.json({ error: "กรุณาระบุรหัสผ่านที่จะแจ้งในอีเมล" }, { status: 400 });
    }

    const content = await readContent();
    const manualLinks = content.manuals.map((m) => ({
      title: m.title,
      url: `${siteUrl()}/api/manuals/${m.id}`,
    }));

    const mail = await sendCredentialsEmail({
      app,
      username,
      password,
      manualLinks,
    });
    if (!mail.ok) {
      return NextResponse.json(
        { error: "ส่งอีเมลไม่สำเร็จ", detail: mail.error },
        { status: 502 }
      );
    }

    const updated = await updateApplication(id, {
      status: "approved",
      managerUsername: username,
      approvedAt: app.approvedAt || new Date().toISOString(),
      credentialsSentAt: new Date().toISOString(),
      adminNote: (body.adminNote || app.adminNote || "").trim(),
    });

    return NextResponse.json({
      ok: true,
      application: updated,
      mailMode: mail.mode,
      hint: "สร้างร้านในแอพ Admin (SYSTEM) ด้วยข้อมูลชุดนี้ก่อน/คู่กับการส่งอีเมล",
    });
  }

  return NextResponse.json({ error: "action ไม่ถูกต้อง" }, { status: 400 });
}
