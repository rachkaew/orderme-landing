import { createHmac, timingSafeEqual, randomBytes } from "crypto";
import { cookies } from "next/headers";
import path from "path";
import fs from "fs/promises";

export const COOKIE_NAME = "om_admin";

function secret() {
  return process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "dev-secret-change-me";
}

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "orderme-admin";
}

export function signSession(): string {
  return createHmac("sha256", secret()).update("orderme-landing-admin").digest("hex");
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const expected = signSession();
  try {
    const a = Buffer.from(token);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const jar = await cookies();
  return verifySessionToken(jar.get(COOKIE_NAME)?.value);
}

export function getDataDir() {
  return process.env.DATA_DIR || path.join(process.cwd(), "data");
}

export function getContentPath() {
  return path.join(getDataDir(), "content.json");
}

export function getManualsDir() {
  return path.join(getDataDir(), "uploads", "manuals");
}

export async function ensureDataDirs() {
  await fs.mkdir(getManualsDir(), { recursive: true });
}

export function safeFilename(name: string) {
  const base = path.basename(name).replace(/[^a-zA-Z0-9._\u0E00-\u0E7F-]/g, "_");
  const id = randomBytes(4).toString("hex");
  return `${id}-${base}`;
}
