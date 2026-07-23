#!/bin/bash
# ดับเบิลคลิกเพื่อ push โค้ด → Railway deploy เองอัตโนมัติ
# (ไม่ถามรหัสผ่าน — ตั้งบน Railway ไว้แล้ว)
cd "$(dirname "$0")" || exit 1

# ให้หา git / railway ได้แม้เปิดจาก Finder
export PATH="/usr/local/bin:/opt/homebrew/bin:$HOME/.local/node/bin:$HOME/.local/bin:$PATH"

echo "======================================"
echo "  OrderMe Landing — Deploy อัตโนมัติ"
echo "======================================"
echo ""

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "❌ ไม่พบ git repo ในโฟลเดอร์นี้"
  read -r -p "กด Enter เพื่อปิด..."
  exit 1
fi

echo "กำลัง commit + push โค้ด..."
git add -A

if git diff --cached --quiet; then
  echo "ไม่มีไฟล์ใหม่ — กำลัง push สถานะปัจจุบัน..."
else
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
