#!/bin/bash
SB_URL="https://tkdwqsoyheousodvtmuj.supabase.co"
SB_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrZHdxc295aGVvdXNvZHZ0bXVqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzkyMDgxNiwiZXhwIjoyMDg5NDk2ODE2fQ.wZH-PrN_-pyjUOhn0s2Q5eUFoeSMhYrTnJlMo6niwdI"
BUCKET="course-videos"
BASE="/tmp/faststart"

declare -A STAGE_MAP
STAGE_MAP["01_Stage1_AIを知る"]="stage1"
STAGE_MAP["02_Stage2_安全に使う"]="stage2"
STAGE_MAP["03_Stage3_プロンプト"]="stage3"
STAGE_MAP["04_Stage4_ChatGPT"]="stage4-chatgpt"
STAGE_MAP["05_Stage4_Claude"]="stage4-claude"
STAGE_MAP["06_Stage4_Gemini"]="stage4-gemini"
STAGE_MAP["07_Stage4_Perplexity"]="stage4-perplexity"
STAGE_MAP["08_Stage5_AI資料作成"]="stage5-slides"
STAGE_MAP["09_Stage5_AI動画生成"]="stage5-video"
STAGE_MAP["10_Stage6_戦略・導入"]="stage6"

ok=0
fail=0

for stage_dir in "$BASE"/*/; do
  dirname=$(basename "$stage_dir")
  eng="${STAGE_MAP[$dirname]:-${dirname%%_*}}"
  echo ""
  echo "=== $dirname → $eng/ ==="

  for mp4 in "$stage_dir"*.mp4; do
    [ -f "$mp4" ] || continue
    filename=$(basename "$mp4")
    num="${filename%%_*}"
    key="${eng}/${num}.mp4"
    size=$(stat -f%z "$mp4" 2>/dev/null || stat -c%s "$mp4" 2>/dev/null)
    size_mb=$(echo "scale=1; $size / 1048576" | bc)

    echo -n "  $filename ($size_mb MB) → $key... "

    http_code=$(curl -s -o /dev/null -w "%{http_code}" \
      -X POST "$SB_URL/storage/v1/object/$BUCKET/$key" \
      -H "apikey: $SB_KEY" \
      -H "Authorization: Bearer $SB_KEY" \
      -H "Content-Type: video/mp4" \
      -H "x-upsert: true" \
      --data-binary "@$mp4")

    if [ "$http_code" = "200" ]; then
      echo "OK"
      ok=$((ok + 1))
    else
      echo "FAIL ($http_code)"
      fail=$((fail + 1))
    fi
  done
done

echo ""
echo "Done: $ok OK, $fail FAIL"
