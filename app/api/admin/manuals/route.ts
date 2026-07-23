import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { ensureDataDirs, getManualsDir, isAuthenticated, safeFilename } from "@/lib/auth";
import { readContent, writeContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function GET() {
  const content = await readContent();
  return NextResponse.json({ manuals: content.manuals });
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  const title = String(form.get("title") || "").trim();

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "ไม่พบไฟล์" }, { status: 400 });
  }

  const allowed = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  if (!allowed.includes(file.type) && !/\.(pdf|doc|docx)$/i.test(file.name)) {
    return NextResponse.json({ error: "รองรับเฉพาะ PDF / DOC / DOCX" }, { status: 400 });
  }

  if (file.size > 20 * 1024 * 1024) {
    return NextResponse.json({ error: "ไฟล์ใหญ่เกิน 20MB" }, { status: 400 });
  }

  await ensureDataDirs();
  const filename = safeFilename(file.name);
  const buf = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(getManualsDir(), filename), buf);

  const content = await readContent();
  const item = {
    id: filename,
    title: title || file.name,
    filename,
    originalName: file.name,
    uploadedAt: new Date().toISOString(),
  };
  content.manuals = [item, ...content.manuals];
  await writeContent(content);

  return NextResponse.json({ ok: true, manual: item });
}

export async function DELETE(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "missing id" }, { status: 400 });
  }

  const content = await readContent();
  const item = content.manuals.find((m) => m.id === id);
  if (!item) {
    return NextResponse.json({ error: "ไม่พบไฟล์" }, { status: 404 });
  }

  try {
    await fs.unlink(path.join(getManualsDir(), item.filename));
  } catch {
    // ignore missing file on disk
  }

  content.manuals = content.manuals.filter((m) => m.id !== id);
  await writeContent(content);
  return NextResponse.json({ ok: true });
}
