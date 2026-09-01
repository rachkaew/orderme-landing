import fs from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";
import { ensureDataDirs, getDataDir } from "./auth";

export type ApplicationStatus =
  | "pending_verification"
  | "pending_review"
  | "approved"
  | "rejected";

export type ShopApplication = {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: ApplicationStatus;
  /** Shop fields (mirror OrderMe admin create) */
  name: string;
  phone: string;
  email: string;
  address: string;
  slug: string;
  plan: "starter" | "shop" | "pro";
  applicantFirstName: string;
  applicantLastName: string;
  applicantPhone: string;
  applicantAddress: string;
  /** Email verification */
  emailVerified: boolean;
  verifyToken: string | null;
  verifyExpiresAt: string | null;
  verifiedAt: string | null;
  /** Admin decision */
  adminNote: string;
  managerUsername: string | null;
  approvedAt: string | null;
  credentialsSentAt: string | null;
  rejectedAt: string | null;
};

type Store = { applications: ShopApplication[] };

function storePath() {
  return path.join(getDataDir(), "applications.json");
}

async function readStore(): Promise<Store> {
  await ensureDataDirs();
  try {
    const raw = await fs.readFile(storePath(), "utf8");
    const parsed = JSON.parse(raw) as Store;
    return { applications: Array.isArray(parsed.applications) ? parsed.applications : [] };
  } catch {
    return { applications: [] };
  }
}

async function writeStore(store: Store) {
  await ensureDataDirs();
  await fs.writeFile(storePath(), JSON.stringify(store, null, 2), "utf8");
}

export function normalizeSlug(raw: string) {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

export function managerUsernameFromSlug(slug: string) {
  const s = normalizeSlug(slug);
  return s ? `${s}_manager` : "";
}

export function isValidPhone(phone: string) {
  return /^0\d{9}$/.test(phone);
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export async function listApplications(): Promise<ShopApplication[]> {
  const store = await readStore();
  return store.applications.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getApplication(id: string) {
  const store = await readStore();
  return store.applications.find((a) => a.id === id) || null;
}

export async function findByVerifyToken(token: string) {
  const store = await readStore();
  return store.applications.find((a) => a.verifyToken === token) || null;
}

export async function slugTaken(slug: string, exceptId?: string) {
  const n = normalizeSlug(slug);
  if (!n) return false;
  const store = await readStore();
  return store.applications.some(
    (a) =>
      a.id !== exceptId &&
      a.slug === n &&
      a.status !== "rejected"
  );
}

export async function emailPending(email: string) {
  const e = email.trim().toLowerCase();
  const store = await readStore();
  return store.applications.some(
    (a) =>
      a.email.toLowerCase() === e &&
      (a.status === "pending_verification" || a.status === "pending_review")
  );
}

export async function findPendingByEmail(email: string) {
  const e = email.trim().toLowerCase();
  const store = await readStore();
  return (
    store.applications.find(
      (a) =>
        a.email.toLowerCase() === e &&
        (a.status === "pending_verification" || a.status === "pending_review")
    ) || null
  );
}

/** สร้าง token ยืนยันใหม่ (ใช้เมื่อส่งอีเมลซ้ำ) */
export async function refreshVerification(appId: string) {
  const token = randomBytes(24).toString("hex");
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  return updateApplication(appId, {
    status: "pending_verification",
    emailVerified: false,
    verifyToken: token,
    verifyExpiresAt: expires,
    verifiedAt: null,
  });
}

export type CreateApplicationInput = {
  name: string;
  phone: string;
  email: string;
  address: string;
  slug: string;
  plan: "starter" | "shop" | "pro";
  applicantFirstName: string;
  applicantLastName: string;
  applicantPhone: string;
  applicantAddress: string;
};

export async function createApplication(input: CreateApplicationInput) {
  const now = new Date().toISOString();
  const token = randomBytes(24).toString("hex");
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  const app: ShopApplication = {
    id: randomBytes(8).toString("hex"),
    createdAt: now,
    updatedAt: now,
    status: "pending_verification",
    name: input.name.trim(),
    phone: input.phone.trim(),
    email: input.email.trim().toLowerCase(),
    address: input.address.trim(),
    slug: normalizeSlug(input.slug),
    plan: input.plan,
    applicantFirstName: input.applicantFirstName.trim(),
    applicantLastName: input.applicantLastName.trim(),
    applicantPhone: input.applicantPhone.trim(),
    applicantAddress: input.applicantAddress.trim(),
    emailVerified: false,
    verifyToken: token,
    verifyExpiresAt: expires,
    verifiedAt: null,
    adminNote: "",
    managerUsername: null,
    approvedAt: null,
    credentialsSentAt: null,
    rejectedAt: null,
  };
  const store = await readStore();
  store.applications.unshift(app);
  await writeStore(store);
  return app;
}

export async function updateApplication(
  id: string,
  patch: Partial<ShopApplication>
) {
  const store = await readStore();
  const idx = store.applications.findIndex((a) => a.id === id);
  if (idx < 0) return null;
  store.applications[idx] = {
    ...store.applications[idx],
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  await writeStore(store);
  return store.applications[idx];
}

export async function verifyApplicationEmail(token: string) {
  const app = await findByVerifyToken(token);
  if (!app) return { ok: false as const, error: "ลิงก์ไม่ถูกต้องหรือหมดอายุ" };
  if (app.emailVerified && app.status === "pending_review") {
    return { ok: true as const, app, already: true };
  }
  if (!app.verifyExpiresAt || new Date(app.verifyExpiresAt) < new Date()) {
    return { ok: false as const, error: "ลิงก์ยืนยันหมดอายุแล้ว กรุณาสมัครใหม่" };
  }
  const updated = await updateApplication(app.id, {
    emailVerified: true,
    verifiedAt: new Date().toISOString(),
    status: "pending_review",
    verifyToken: null,
    verifyExpiresAt: null,
  });
  return { ok: true as const, app: updated!, already: false };
}
