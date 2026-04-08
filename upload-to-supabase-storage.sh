#!/bin/bash
# 全動画をSupabase Storageにアップロードし、courses.video_urlを更新する

SB_URL="https://tkdwqsoyheousodvtmuj.supabase.co"
SB_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrZHdxc295aGVvdXNvZHZ0bXVqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzkyMDgxNiwiZXhwIjoyMDg5NDk2ODE2fQ.wZH-PrN_-pyjUOhn0s2Q5eUFoeSMhYrTnJlMo6niwdI"
BUCKET="course-videos"
BASE="/Users/matsumotoshuntasuku/AI研修講座/gorilla-knowledge/黒崎/AI研修一覧/_loom_upload"

uploaded=0
failed=0

for stage_dir in "$BASE"/*/; do
  stage_name=$(basename "$stage_dir")
  echo ""
  echo "=== $stage_name ==="

  for mp4 in "$stage_dir"*.mp4; do
    [ -f "$mp4" ] || continue
    filename=$(basename "$mp4")
    storage_path="${stage_name}/${filename}"

    size=$(stat -f%z "$mp4" 2>/dev/null || stat -c%s "$mp4" 2>/dev/null)
    size_mb=$(echo "scale=1; $size / 1048576" | bc)

    echo -n "  $filename ($size_mb MB)... "

    # アップロード
    http_code=$(curl -s -o /dev/null -w "%{http_code}" \
      -X POST "$SB_URL/storage/v1/object/$BUCKET/$storage_path" \
      -H "apikey: $SB_KEY" \
      -H "Authorization: Bearer $SB_KEY" \
      -H "Content-Type: video/mp4" \
      -H "x-upsert: true" \
      --data-binary "@$mp4")

    if [ "$http_code" = "200" ]; then
      echo "OK"
      uploaded=$((uploaded + 1))
    else
      echo "FAIL ($http_code)"
      failed=$((failed + 1))
    fi
  done
done

echo ""
echo "================================"
echo "Done! Uploaded: $uploaded, Failed: $failed"
