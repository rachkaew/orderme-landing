import type { ShopApplication } from "./applications";
import { managerUsernameFromSlug } from "./applications";

function apiBase() {
  return (process.env.ORDERME_API_URL || process.env.APP_LOGIN_URL || "https://app.ordermeapp.com").replace(
    /\/$/,
    ""
  );
}

function systemKey() {
  return process.env.ORDERME_SYSTEM_KEY || process.env.SYSTEM_KEY || "";
}

export function ordermeCreateConfigured() {
  return Boolean(systemKey());
}

export type CreateShopResult =
  | {
      ok: true;
      branchId: number;
      slug: string;
      managerUsername: string;
      alreadyExisted?: boolean;
    }
  | { ok: false; error: string; status?: number };

/**
 * สร้างร้านในแอพ OrderMe (POST /api/system/branches)
 * username ผู้จัดการบังคับเป็น {slug}_manager
 */
export async function createShopInOrderme(
  app: ShopApplication,
  password: string
): Promise<CreateShopResult> {
  const key = systemKey();
  if (!key) {
    return {
      ok: false,
      error: "ยังไม่ได้ตั้ง ORDERME_SYSTEM_KEY บน orderme-landing",
    };
  }

  const username = managerUsernameFromSlug(app.slug);
  const body = {
    name: app.name,
    phone: app.phone || null,
    email: app.email || null,
    address: app.address || null,
    slug: app.slug,
    password,
    trialDays: 30,
    plan: app.plan || "shop",
    applicantFirstName: app.applicantFirstName || null,
    applicantLastName: app.applicantLastName || null,
    applicantPhone: app.applicantPhone || null,
    applicantAddress: app.applicantAddress || null,
  };

  const res = await fetch(`${apiBase()}/api/system/branches`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-system-key": key,
    },
    body: JSON.stringify(body),
  });

  const data = (await res.json().catch(() => ({}))) as {
    error?: string;
    branchId?: number;
    slug?: string;
    managerUsername?: string;
  };

  if (!res.ok) {
    // slug/username มีอยู่แล้ว → ถือว่าสร้างไว้แล้ว (ให้อนุมัติต่อได้)
    if (res.status === 409) {
      return {
        ok: true,
        branchId: 0,
        slug: app.slug,
        managerUsername: username,
        alreadyExisted: true,
      };
    }
    return {
      ok: false,
      error: data.error || `สร้างร้านในแอพไม่สำเร็จ (HTTP ${res.status})`,
      status: res.status,
    };
  }

  return {
    ok: true,
    branchId: Number(data.branchId) || 0,
    slug: data.slug || app.slug,
    managerUsername: data.managerUsername || username,
  };
}
