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
import { createShopInOrderme, ordermeCreateConfigured } from "@/lib/ordermeApi";

export const dynamic = "force-dynamic";

function siteUrl() {
  return (process.env.SITE_URL || "https://www.ordermeapp.com").replace(/\/$/, "");
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const applications = await listApplications();
  return NextResponse.json({
    applications,
    ordermeCreateConfigured: ordermeCreateConfigured(),
  });
}

export async function POST(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    id?: string;
    action?: "approve" | "reject" | "resend_credentials" | "create_shop";
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

  if (action === "approve" || action === "resend_credentials" || action === "create_shop") {
    // OrderMe บังคับ username = {slug}_manager
    const username = managerUsernameFromSlug(app.slug) || suggestedUsername(app);
    const password = (body.password || "").trim();
    if (!username) {
      return NextResponse.json({ error: "slug ไม่ถูกต้อง จึงสร้าง username ไม่ได้" }, { status: 400 });
    }
    if (password.length < 4) {
      return NextResponse.json(
        { error: "กรุณาระบุรหัสผ่านเริ่มต้นอย่างน้อย 4 ตัวอักษร" },
        { status: 400 }
      );
    }

    let shop = null as Awaited<ReturnType<typeof createShopInOrderme>> | null;

    // สร้างร้านในแอพก่อนส่งเมล (ยกเว้น resend ที่สร้างแล้ว)
    const needCreate =
      action === "approve" ||
      action === "create_shop" ||
      (action === "resend_credentials" && !app.branchId && !app.shopCreatedAt);

    if (needCreate) {
      if (!ordermeCreateConfigured()) {
        return NextResponse.json(
          {
            error:
              "ยังไม่ได้ตั้ง ORDERME_SYSTEM_KEY — ใส่ Variable บน orderme-landing แล้ว redeploy (คัดลอก SYSTEM_KEY จาก service orderme)",
          },
          { status: 503 }
        );
      }
      shop = await createShopInOrderme(app, password);
      if (!shop.ok) {
        return NextResponse.json(
          { error: `สร้างร้านในแอพไม่สำเร็จ: ${shop.error}`, detail: shop.error },
          { status: 502 }
        );
      }
    }

    let mailMode: string | undefined;
    if (action !== "create_shop") {
      const content = await readContent();
      const manualLinks = content.manuals.map((m) => ({
        title: m.title,
        url: `${siteUrl()}/api/manuals/${m.id}`,
      }));
      const mail = await sendCredentialsEmail({
        app,
        username: shop && shop.ok ? shop.managerUsername : username,
        password,
        manualLinks,
      });
      if (!mail.ok) {
        return NextResponse.json(
          {
            error: `สร้างร้านแล้วแต่ส่งอีเมลไม่สำเร็จ: ${mail.error || "unknown"}`,
            detail: mail.error,
            shop,
          },
          { status: 502 }
        );
      }
      mailMode = mail.mode;
    }

    const patch: Parameters<typeof updateApplication>[1] = {
      status: "approved",
      managerUsername: shop && shop.ok ? shop.managerUsername : username,
      approvedAt: app.approvedAt || new Date().toISOString(),
      adminNote: (body.adminNote || app.adminNote || "").trim(),
    };
    if (action !== "create_shop") {
      patch.credentialsSentAt = new Date().toISOString();
    }
    if (shop && shop.ok) {
      if (shop.branchId) patch.branchId = shop.branchId;
      patch.shopCreatedAt = app.shopCreatedAt || new Date().toISOString();
      if (shop.alreadyExisted) {
        patch.adminNote = `${patch.adminNote || ""} · ร้าน/slug มีในแอพอยู่แล้ว`.trim();
      }
    }

    const updated = await updateApplication(id, patch);

    return NextResponse.json({
      ok: true,
      application: updated,
      shop,
      mailMode,
      message:
        action === "create_shop"
          ? "สร้างร้านในแอพแล้ว"
          : "สร้างร้านในแอพ + ส่งอีเมล username แล้ว",
    });
  }

  return NextResponse.json({ error: "action ไม่ถูกต้อง" }, { status: 400 });
}
