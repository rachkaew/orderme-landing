#!/bin/bash
# ดับเบิลคลิกไฟล์นี้เพื่อ:
# 1) ตั้งค่าหลังบ้านบน Railway (ครั้งแรก)
# 2) push โค้ดขึ้น GitHub → Railway deploy เอง
cd "$(dirname "$0")" || exit 1

echo "======================================"
echo "  OrderMe Landing — Deploy อัตโนมัติ"
echo "======================================"
echo ""

if ! command -v railway >/dev/null 2>&1; then
  echo "❌ ยังไม่มี Railway CLI"
  echo "ติดตั้ง: npm i -g @railway/cli"
  read -r -p "กด Enter เพื่อปิด..."
  exit 1
fi

railway service orderme-landing >/dev/null 2>&1 || true

echo "กำลังเช็ค Variables บน Railway..."
HAS_PASS=$(railway variable list --service orderme-landing --kv 2>/dev/null | grep -c '^ADMIN_PASSWORD=' || true)
HAS_DATA=$(railway variable list --service orderme-landing --kv 2>/dev/null | grep -c '^DATA_DIR=' || true)

if [ "$HAS_PASS" = "0" ] || [ "$HAS_DATA" = "0" ]; then
  echo ""
  echo "ตั้งค่ารหัสผ่านหลังบ้าน (ใช้เข้า /admin)"
  read -r -s -p "พิมพ์รหัสผ่านที่ต้องการ: " ADMIN_PASS
  echo ""
  if [ -z "$ADMIN_PASS" ]; then
    echo "❌ ต้องใส่รหัสผ่าน"
    read -r -p "กด Enter เพื่อปิด..."
    exit 1
  fi
  ADMIN_SEC=$(openssl rand -hex 24)
  echo "กำลังบันทึก Variables + Volume บน Railway..."
  railway volume list --json 2>/dev/null | grep -q 'orderme-landing-volume' || \
    railway volume add -m /data --json >/dev/null 2>&1 || true
  railway variable set \
    "ADMIN_PASSWORD=$ADMIN_PASS" \
    "ADMIN_SECRET=$ADMIN_SEC" \
    "DATA_DIR=/data" \
    --service orderme-landing
  echo "✅ ตั้งค่าหลังบ้านแล้ว"
else
  echo "✅ Variables พร้อมอยู่แล้ว"
fi

echo ""
echo "กำลัง commit + push โค้ด..."
git add -A
if ! git diff --cached --quiet; then
  git commit -m "deploy: update landing $(date '+%Y-%m-%d %H:%M')" || true
fi

if git push origin main; then
  echo ""
  echo "✅ Push สำเร็จ — Railway จะ deploy เอง ~1-2 นาที"
  echo "   หน้าเว็บ: https://www.ordermeapp.com"
  echo "   หลังบ้าน: https://www.ordermeapp.com/admin"
else
  echo ""
  echo "❌ Push ไม่สำเร็จ — อาจต้อง login GitHub ใหม่"
fi

echo ""
read -r -p "กด Enter เพื่อปิดหน้าต่างนี้..."
