import fs from "fs/promises";
import { ensureDataDirs, getContentPath } from "./auth";

export type SiteContent = {
  hero: {
    badges: string[];
    titleLine1: string;
    titleHighlight: string;
    titleLine3: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
    trustLine: string;
  };
  stats: { value: string; label: string; sub: string }[];
  features: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: { title: string; desc: string }[];
  };
  howItWorks: {
    eyebrow: string;
    title: string;
    subtitle: string;
    steps: { title: string; desc: string; role: string }[];
  };
  pricing: {
    eyebrow: string;
    title: string;
    subtitle: string;
    plans: {
      name: string;
      price: string;
      period: string;
      desc: string;
      cta: string;
      highlight: boolean;
      features: string[];
    }[];
  };
  cta: {
    title: string;
    subtitle: string;
    primaryCta: string;
    lineCta: string;
  };
  contact: {
    lineUrl: string;
    lineId: string;
    phone: string;
  };
  manualsSection: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  manuals: {
    id: string;
    title: string;
    filename: string;
    originalName: string;
    uploadedAt: string;
  }[];
};

export const defaultContent: SiteContent = {
  hero: {
    badges: ["PWA ติดตั้งได้ทันที", "ไม่ต้องโหลดแอป", "ฟรี 30 วัน"],
    titleLine1: "สั่งอาหารง่าย",
    titleHighlight: "แค่แชท",
    titleLine3: "ไม่ต้องโหลดแอป",
    subtitle:
      "ระบบรับออเดอร์ผ่านแชทสำหรับร้านอาหาร รองรับหลายสาขา ชำระเงินด้วย QR Code ลูกค้าเปิดผ่านเบราว์เซอร์ได้ทันที",
    primaryCta: "ทดลองใช้ฟรี 30 วัน",
    secondaryCta: "ดูวิธีการใช้งาน",
    trustLine: "ไม่ต้องใช้บัตรเครดิต · ยกเลิกได้ทุกเมื่อ · ตั้งค่าภายใน 10 นาที",
  },
  stats: [
    { value: "100+", label: "ร้านค้าที่ใช้งาน", sub: "ทั่วประเทศ" },
    { value: "5,000+", label: "ออเดอร์ต่อวัน", sub: "เฉลี่ยทุกวัน" },
    { value: "4.9", label: "คะแนนพึงพอใจ", sub: "จากเจ้าของร้าน" },
    { value: "∞", label: "จำนวนสาขา", sub: "ไม่จำกัด" },
  ],
  features: {
    eyebrow: "ฟีเจอร์",
    title: "ทุกอย่างที่ร้านอาหารต้องการ",
    subtitle: "ออกแบบมาเพื่อร้านอาหารไทยโดยเฉพาะ ใช้งานง่าย ตั้งค่าเร็ว ไม่ต้องมีทีม IT",
    items: [
      {
        title: "สั่งผ่านแชทสไตล์ LINE",
        desc: "ลูกค้าคุ้นเคยอยู่แล้ว ไม่ต้องเรียนรู้ใหม่ เปิดลิงก์ก็สั่งได้ทันที",
      },
      {
        title: "รองรับหลายสาขา",
        desc: "จัดการทุกสาขาจากระบบเดียว แยกเมนูและออเดอร์ตามสาขาอัตโนมัติ",
      },
      {
        title: "QR Code ชำระเงิน",
        desc: "สร้าง QR พร้อมเพย์ได้อัตโนมัติ ลูกค้าสแกนจ่ายได้ทันที ไม่ต้องรอทอน",
      },
      {
        title: "Realtime ทุกการเคลื่อนไหว",
        desc: "ออเดอร์ใหม่แจ้งเตือนทันที ลูกค้าเห็นสถานะการทำอาหารแบบ live",
      },
      {
        title: "ประวัติการสั่งซื้อ",
        desc: "ลูกค้าดูประวัติย้อนหลัง สั่งซ้ำเมนูโปรดได้ในคลิกเดียว",
      },
      {
        title: "ติดตั้งเป็น PWA ได้",
        desc: "ลูกค้าเพิ่มลงหน้าจอมือถือได้เลย ไม่ต้องขึ้น App Store ไม่ต้อง review",
      },
    ],
  },
  howItWorks: {
    eyebrow: "วิธีใช้งาน",
    title: "ง่ายมาก แค่ 3 ขั้นตอน",
    subtitle: "ตั้งค่าร้านภายใน 10 นาที ลูกค้าสั่งอาหารได้ทันทีโดยไม่ต้องดาวน์โหลดอะไรเพิ่ม",
    steps: [
      {
        title: "สแกน QR หรือเปิดลิงก์",
        desc: "ร้านแชร์ลิงก์หรือ QR Code ให้ลูกค้า เปิดผ่านเบราว์เซอร์ได้เลยโดยไม่ต้องโหลดอะไร",
        role: "ลูกค้า",
      },
      {
        title: "เลือกเมนู → แชทสั่ง → แนบ location",
        desc: "เลือกเมนูที่ชอบ ใส่ตัวเลือก แล้วส่งออเดอร์ผ่านแชท พร้อมแนบตำแหน่งที่อยู่ได้เลย",
        role: "ลูกค้า",
      },
      {
        title: "ร้านยืนยัน → QR จ่าย → รับอาหาร",
        desc: "ร้านรับออเดอร์ ส่ง QR ชำระเงิน ยืนยันการโอน แล้วทำอาหารส่งให้ทันที",
        role: "ร้านค้า",
      },
    ],
  },
  pricing: {
    eyebrow: "ราคา",
    title: "เลือกแพ็กเกจที่ใช่",
    subtitle: "ไม่มีค่าธรรมเนียมแอบแฝง ยกเลิกได้ทุกเมื่อ ย้ายแพ็กเกจได้ตลอด",
    plans: [
      {
        name: "Free",
        price: "ฟรี",
        period: "ตลอดไป",
        desc: "เหมาะสำหรับร้านเล็กที่เพิ่งเริ่มต้น",
        cta: "เริ่มใช้งาน",
        highlight: false,
        features: [
          "1 สาขา",
          "เมนูไม่จำกัด",
          "ออเดอร์สูงสุด 100 รายการ/เดือน",
          "แชทออเดอร์",
          "QR Code ชำระเงิน",
          "PWA บนมือถือ",
        ],
      },
      {
        name: "Pro",
        price: "990",
        period: "บาท/เดือน",
        desc: "สำหรับร้านที่ต้องการระบบครบครัน",
        cta: "ทดลองฟรี 30 วัน",
        highlight: true,
        features: [
          "หลายสาขา (ไม่จำกัด)",
          "ออเดอร์ไม่จำกัด",
          "Export รายงาน Excel",
          "Analytics ยอดขาย",
          "จัดการพนักงาน",
          "Priority support",
        ],
      },
      {
        name: "Enterprise",
        price: "ติดต่อ",
        period: "เราเพื่อราคาพิเศษ",
        desc: "สำหรับแฟรนไชส์หรือแบรนด์ขนาดใหญ่",
        cta: "ติดต่อทีมงาน",
        highlight: false,
        features: [
          "ทุกอย่างใน Pro",
          "Custom branding",
          "SLA การันตี uptime",
          "On-premise option",
          "Dedicated support",
          "Training & onboarding",
        ],
      },
    ],
  },
  cta: {
    title: "พร้อมเปิดรับออเดอร์แบบใหม่แล้วหรือยัง?",
    subtitle:
      "เริ่มต้นได้วันนี้ ไม่ต้องมีทีม IT ตั้งค่าเสร็จภายใน 10 นาที ทดลองใช้ฟรี 30 วัน ไม่ต้องใส่บัตรเครดิต",
    primaryCta: "ทดลองใช้ฟรี 30 วัน",
    lineCta: "ติดต่อผ่าน LINE",
  },
  contact: {
    lineUrl: "https://line.me",
    lineId: "@orderme.th",
    phone: "080-000-0000",
  },
  manualsSection: {
    eyebrow: "คู่มือ",
    title: "ดาวน์โหลดคู่มือการใช้งาน",
    subtitle: "ไฟล์ PDF สำหรับเจ้าของร้านและพนักงาน",
  },
  manuals: [],
};

export async function readContent(): Promise<SiteContent> {
  await ensureDataDirs();
  try {
    const raw = await fs.readFile(getContentPath(), "utf8");
    const parsed = JSON.parse(raw) as Partial<SiteContent>;
    return {
      ...defaultContent,
      ...parsed,
      hero: { ...defaultContent.hero, ...parsed.hero },
      features: { ...defaultContent.features, ...parsed.features },
      howItWorks: { ...defaultContent.howItWorks, ...parsed.howItWorks },
      pricing: { ...defaultContent.pricing, ...parsed.pricing },
      cta: { ...defaultContent.cta, ...parsed.cta },
      contact: { ...defaultContent.contact, ...parsed.contact },
      manualsSection: { ...defaultContent.manualsSection, ...parsed.manualsSection },
      stats: parsed.stats?.length ? parsed.stats : defaultContent.stats,
      manuals: parsed.manuals ?? [],
    };
  } catch {
    await writeContent(defaultContent);
    return defaultContent;
  }
}

export async function writeContent(content: SiteContent): Promise<void> {
  await ensureDataDirs();
  await fs.writeFile(getContentPath(), JSON.stringify(content, null, 2), "utf8");
}
