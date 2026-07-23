import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { getManualsDir } from "@/lib/auth";
import { readContent } from "@/lib/content";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const content = await readContent();
  const item = content.manuals.find((m) => m.id === id || m.filename === id);
  if (!item) {
    return NextResponse.json({ error: "ไม่พบไฟล์" }, { status: 404 });
  }

  const filePath = path.join(getManualsDir(), item.filename);
  try {
    const buf = await fs.readFile(filePath);
    const ext = path.extname(item.filename).toLowerCase();
    const type =
      ext === ".pdf"
        ? "application/pdf"
        : ext === ".docx"
          ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          : "application/octet-stream";

    return new NextResponse(new Uint8Array(buf), {
      headers: {
        "Content-Type": type,
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(item.originalName)}`,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ error: "ไฟล์หายจากระบบ" }, { status: 404 });
  }
}
