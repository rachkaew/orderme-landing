import { NextResponse } from "next/server";
import { verifyApplicationEmail } from "@/lib/applications";
import { sendAdminNewApplicationNotice } from "@/lib/mail";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token") || "";
  if (!token) {
    return NextResponse.json({ error: "ไม่มี token" }, { status: 400 });
  }
  const result = await verifyApplicationEmail(token);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  if (!result.already) {
    await sendAdminNewApplicationNotice(result.app);
  }
  return NextResponse.json({
    ok: true,
    already: result.already,
    name: result.app.name,
    email: result.app.email,
  });
}

export async function POST(req: Request) {
  let token = "";
  try {
    const body = await req.json();
    token = String(body.token || "");
  } catch {
    return NextResponse.json({ error: "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
  }
  if (!token) return NextResponse.json({ error: "ไม่มี token" }, { status: 400 });
  const result = await verifyApplicationEmail(token);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  if (!result.already) {
    await sendAdminNewApplicationNotice(result.app);
  }
  return NextResponse.json({
    ok: true,
    already: result.already,
    name: result.app.name,
    email: result.app.email,
  });
}
