# Admin CMS — หลังบ้านหน้าขาย OrderMe

## เข้าใช้งาน

- URL: `https://www.ordermeapp.com/admin`
- รหัสผ่านเริ่มต้น (local): `orderme-admin`
- บน Railway ต้องตั้ง `ADMIN_PASSWORD` เอง

## Variables ที่ต้องใส่บน Railway (`orderme-landing`)

| Name | Value | หมายเหตุ |
|------|-------|----------|
| `ADMIN_PASSWORD` | รหัสผ่านที่แข็งแรง | **จำเป็น** |
| `ADMIN_SECRET` | สตริงสุ่มยาวๆ | แนะนำ (เซ็น cookie) |
| `DATA_DIR` | `/data` | เก็บข้อความ + ไฟล์คู่มือ + คำขอเปิดร้าน |
| `RESEND_API_KEY` | `re_...` **คีย์เต็มจาก Resend** (ยาวมาก ไม่ใช่แค่ `re_xxxx` สั้นๆ) | **จำเป็น** — ถ้าผิดอีเมลจะไม่ไป |
| `EMAIL_FROM` | `OrderMe <noreply@ordermeapp.com>` | โดเมนต้อง **Verify** ใน Resend Domains |
| `SITE_URL` | `https://www.ordermeapp.com` | ใช้สร้างลิงก์ยืนยันอีเมล |
| `ADMIN_NOTIFY_EMAIL` | อีเมลทีมงาน | แจ้งเมื่อมีคำขอใหม่หลังยืนยันอีเมล |
| `ORDERME_API_URL` | `https://app.ordermeapp.com` | API แอพสำหรับสร้างร้านตอนอนุมัติ |
| `ORDERME_SYSTEM_KEY` | ค่าเดียวกับ `SYSTEM_KEY` ของ service **orderme** | **จำเป็น** ถ้าไม่มี จะส่งเมลได้แต่สร้างร้านในแอพไม่ได้ |

### อนุมัติร้าน (สำคัญ)

กด **อนุมัติ** ที่ `/admin` จะ:
1. เรียก `POST /api/system/branches` สร้างร้าน + username `{slug}_manager` ในแอพ
2. ส่งอีเมล username + คู่มือให้ลูกค้า

ถ้าเคยส่งเมลไปแล้วแต่ยังไม่มีร้านในแอพ → เปิดคำขอนั้น กด **สร้างร้านในแอพตอนนี้** (ใส่รหัสผ่านให้ตรงกับที่ส่งไป)

### ตั้งค่า Resend ให้ส่งเมลได้

1. เปิด [https://resend.com/api-keys](https://resend.com/api-keys) → **Create API Key** → คัดลอกคีย์ทั้งหมด (ขึ้นต้น `re_` และยาว)
2. วางใน Railway Variable `RESEND_API_KEY` (อย่าตัดกลางคัน)
3. ไป [Domains](https://resend.com/domains) → Add `ordermeapp.com` → ใส่ DNS ที่ Porkbun ตามที่ Resend บอก → รอสถานะ **Verified**
4. ตั้ง `EMAIL_FROM` เป็นอีเมลบนโดเมนนั้น เช่น `OrderMe <noreply@ordermeapp.com>`
5. **Redeploy / Restart** service `orderme-landing`

**ทดสอบเร็วโดยยังไม่ verify โดเมน:** ใช้ `EMAIL_FROM=OrderMe <onboarding@resend.dev>`  
(ส่งได้เฉพาะไปยังอีเมลเจ้าของบัญชี Resend เท่านั้น)

Log บน Railway ที่เจอตอนนี้: `API key is invalid` → คีย์ที่ใส่ยังไม่ใช่คีย์จริง/วางไม่ครบ

## กฎห้ามซ้ำ (หน้าสมัครสาธารณะ `/signup`)

| ฟิลด์ | ห้ามซ้ำ? |
|------|----------|
| อีเมล | ใช่ (ยกเว้นคำขอที่ถูกปฏิเสธ) |
| slug | ใช่ |
| เบอร์โทรผู้สมัคร | ใช่ |
| **เบอร์โทรร้าน** | **ไม่ห้าม** — เจ้าของคนเดียวเปิดหลายร้านได้ |

หลายร้านของเจ้าของคนเดียว: สร้างร้านในแอพ Admin ได้เบอร์ซ้ำ จากนั้นผูกบัญชี **ผู้ดูแลหลายสาขา (HQ)** ที่แท็บ ผู้ใช้ → ผู้ดูแลหลายสาขา เพื่อล็อกอินครั้งเดียวแล้วสลับร้าน

## Volume บน Railway (สำคัญมาก)

ถ้าไม่มี volume ข้อมูลจะหายทุกครั้งที่ redeploy

**หมายเหตุ:** `/data` ไม่ใช่เมนูที่ต้องไปค้นหา — เป็น path ที่**พิมพ์เอง**ตอนสร้าง Volume

### วิธีสร้าง (Dashboard)

1. เปิดโปรเจกต์ `orderme` → คลิก service **`orderme-landing`**
2. เลือกอย่างใดอย่างหนึ่ง:
   - บน canvas: คลิกขวาพื้นที่ว่าง → **Add Volume** → เลือก service `orderme-landing`  
   - หรือกด `⌘K` / `Ctrl+K` → พิมพ์ **Add Volume**
   - หรือเปิด service → แท็บ **Settings** → เลื่อนหาหัวข้อ **Volumes** → **Add Volume**
3. ช่อง **Mount Path** พิมพ์: `/data` (มี slash นำหน้า)
4. บันทึก แล้วไปแท็บ **Variables** ของ `orderme-landing` ใส่:
   - `DATA_DIR` = `/data`
5. **Redeploy** service

### ถ้าเคยสร้างไว้แล้ว

คลิก service `orderme-landing` → **Settings** → **Volumes**  
ควรเห็น volume (เช่น `orderme-landing-volume`) และ Mount Path เป็น `/data`  
ถ้าเห็นแล้ว ไม่ต้องสร้างใหม่ — แค่เช็กว่า Variable `DATA_DIR=/data` มีอยู่

## ฟีเจอร์

- แก้ข้อความ Hero / Stats / Features / Pricing / CTA / ติดต่อ
- อัปโหลดคู่มือ PDF/DOC/DOCX (ลิงก์จะถูกแนบในอีเมลอนุมัติร้าน)
- หน้าเว็บแสดงปุ่มดาวน์โหลดอัตโนมัติเมื่อมีไฟล์
- **คำขอเปิดร้าน:** ดู / อนุมัติ / ปฏิเสธ / ส่ง username + คู่มือทางอีเมล

## Flow สมัครเปิดร้าน

1. ร้านกรอกฟอร์มที่ `/signup` (ข้อมูลเดียวกับหน้าสร้างร้านในแอพ Admin)
2. ระบบส่งอีเมลยืนยันผ่าน Resend
3. ผู้สมัครกดลิงก์ → สถานะ “รอตรวจสอบ” + ข้อความรอไม่เกิน 24 ชม.
4. แอดมินเปิด `/admin` แท็บ **คำขอเปิดร้าน**
5. สร้างร้านในแอพ OrderMe Admin ด้วยข้อมูลชุดเดียวกัน
6. กด **อนุมัติ + ส่งอีเมล** (ใส่ username + รหัสผ่านเริ่มต้นให้ตรงกับที่สร้างในแอพ)
7. ผู้สมัครได้อีเมล username + ลิงก์คู่มือ

Local โดยไม่มี `RESEND_API_KEY`: อีเมลจะ log ใน console ของเซิร์ฟเวอร์แทน
