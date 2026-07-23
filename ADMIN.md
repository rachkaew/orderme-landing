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
| `DATA_DIR` | `/data` | เก็บข้อความ + ไฟล์คู่มือ |

## Volume บน Railway (สำคัญมาก)

ถ้าไม่มี volume ข้อมูลจะหายทุกครั้งที่ redeploy

1. service `orderme-landing` → **Settings** หรือ canvas → **+ Volume**
2. Mount path: `/data`
3. ตั้ง Variable `DATA_DIR=/data`
4. Redeploy

## ฟีเจอร์

- แก้ข้อความ Hero / Stats / Features / Pricing / CTA / ติดต่อ
- อัปโหลดคู่มือ PDF/DOC/DOCX
- หน้าเว็บแสดงปุ่มดาวน์โหลดอัตโนมัติเมื่อมีไฟล์
