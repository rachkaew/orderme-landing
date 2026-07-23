import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { readContent, writeContent, type SiteContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function GET() {
  const content = await readContent();
  return NextResponse.json(content);
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as SiteContent;
  if (!body?.hero || !body?.cta) {
    return NextResponse.json({ error: "ข้อมูลไม่ครบ" }, { status: 400 });
  }

  const current = await readContent();
  const next: SiteContent = {
    ...current,
    ...body,
    manuals: current.manuals,
  };
  await writeContent(next);
  return NextResponse.json({ ok: true, content: next });
}
