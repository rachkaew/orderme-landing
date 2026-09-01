#!/bin/bash
# ทดสอบหน้าเว็บขายบนเครื่อง (ยังไม่อัป Railway)
# รันจากโฟลเดอร์แคชนอก Documents เพราะ Next ค้างเมื่อรันตรงจาก Documents/@WORK

set -e
SRC="$(cd "$(dirname "$0")" && pwd)"
PREVIEW="$HOME/.cache/orderme-landing-preview"
PORT=3010
URL="http://127.0.0.1:${PORT}"
NODE="/Users/thanapan/.local/node/bin/node"
NPM="/Users/thanapan/.local/node/bin/npm"

export PATH="/Users/thanapan/.local/node/bin:/usr/local/bin:/opt/homebrew/bin:$PATH"
export NEXT_TELEMETRY_DISABLED=1
export DATA_DIR="$PREVIEW/data"
export ADMIN_PASSWORD="${ADMIN_PASSWORD:-preview}"
export ADMIN_SECRET="${ADMIN_SECRET:-preview-secret-local}"

clear
echo "======================================"
echo "  OrderMe — ทดสอบก่อนอัปเว็บ"
echo "  $URL"
echo "======================================"
echo ""

if [ ! -x "$NODE" ]; then
  echo "ERROR: ไม่พบ Node ที่ $NODE"
  read -r -p "กด Enter เพื่อปิด..."
  exit 1
fi

echo "1/4 คัดลอกโค้ดไปโฟลเดอร์ทดสอบ..."
mkdir -p "$PREVIEW"
rsync -a --delete \
  --exclude node_modules \
  --exclude .next \
  --exclude .git \
  --exclude data \
  --exclude "*.command" \
  "$SRC/" "$PREVIEW/"
mkdir -p "$PREVIEW/data"
# คัดลอก content ถ้ามี (ไม่ทับถ้าไม่มี)
if [ -d "$SRC/data" ]; then
  rsync -a "$SRC/data/" "$PREVIEW/data/" 2>/dev/null || true
fi

cd "$PREVIEW"

echo "2/4 ตรวจ dependencies..."
if [ ! -d node_modules/next ]; then
  "$NPM" install --no-audit --no-fund
fi

echo "3/4 ปิดพอร์ตเก่า (ถ้ามี)..."
lsof -tiTCP:"$PORT" -sTCP:LISTEN 2>/dev/null | xargs kill -9 2>/dev/null || true
sleep 1

echo "4/4 build แล้วเปิดเซิร์ฟเวอร์..."
"$NODE" ./node_modules/next/dist/bin/next build
echo ""
echo "พร้อมแล้ว → $URL"
echo "อย่าปิดหน้าต่างนี้จนกว่าจะดูเสร็จ"
echo "======================================"
echo ""

(
  for _ in $(seq 1 30); do
    code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 2 "$URL" 2>/dev/null || echo 0)
    if [ "$code" = "200" ]; then
      open "$URL"
      exit 0
    fi
    sleep 1
  done
  echo "ถ้าเบราว์เซอร์ไม่เปิดเอง ให้เข้า: $URL"
) &

exec "$NODE" ./node_modules/next/dist/bin/next start -H 127.0.0.1 -p "$PORT"
