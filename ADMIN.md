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
| `RESEND_API_KEY` | `re_...` | **จำเป็นสำหรับสมัครเปิดร้าน** (ส่งอีเมลยืนยัน + แจ้ง username) |
| `EMAIL_FROM` | `OrderMe <noreply@ordermeapp.com>` | โดเมนต้อง verify ใน Resend |
| `SITE_URL` | `https://www.ordermeapp.com` | ใช้สร้างลิงก์ยืนยันอีเมล |
| `ADMIN_NOTIFY_EMAIL` | อีเมลทีมงาน | แจ้งเมื่อมีคำขอใหม่หลังยืนยันอีเมล |
| `APP_LOGIN_URL` | `https://app.ordermeapp.com` | ใส่ในอีเมลส่ง username |

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
