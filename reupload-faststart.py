#!/usr/bin/env python3
"""faststart変換済みMP4をSupabase Storageに再アップロード"""
import os
import requests

SB_URL = "https://tkdwqsoyheousodvtmuj.supabase.co"
SB_KEY = (
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
    "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrZHdxc295aGVvdXNvZHZ0bXVqIiwi"
    "cm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzkyMDgxNiwiZXhwIjoyMDg5"
    "NDk2ODE2fQ.wZH-PrN_-pyjUOhn0s2Q5eUFoeSMhYrTnJlMo6niwdI"
)
BUCKET = "course-videos"
BASE = "/tmp/faststart"

STAGE_MAP = {
    "01_Stage1_AIを知る": "stage1",
    "02_Stage2_安全に使う": "stage2",
    "03_Stage3_プロンプト": "stage3",
    "04_Stage4_ChatGPT": "stage4-chatgpt",
    "05_Stage4_Claude": "stage4-claude",
    "06_Stage4_Gemini": "stage4-gemini",
    "07_Stage4_Perplexity": "stage4-perplexity",
    "08_Stage5_AI資料作成": "stage5-slides",
    "09_Stage5_AI動画生成": "stage5-video",
    "10_Stage6_戦略・導入": "stage6",
}

HEADERS = {"apikey": SB_KEY, "Authorization": f"Bearer {SB_KEY}"}
ok = 0
fail = 0

for stage_dir in sorted(os.listdir(BASE)):
    stage_path = os.path.join(BASE, stage_dir)
    if not os.path.isdir(stage_path):
        continue
    eng = STAGE_MAP.get(stage_dir, stage_dir.split("_")[0])
    print(f"\n=== {stage_dir} → {eng}/ ===")
    for fn in sorted(os.listdir(stage_path)):
        if not fn.endswith(".mp4"):
            continue
        fp = os.path.join(stage_path, fn)
        num = fn.split("_")[0]
        key = f"{eng}/{num}.mp4"
        sz = os.path.getsize(fp) / (1024*1024)
        print(f"  {fn} ({sz:.1f}MB) → {key}... ", end="", flush=True)
        with open(fp, "rb") as f:
            r = requests.post(
                f"{SB_URL}/storage/v1/object/{BUCKET}/{key}",
                headers={**HEADERS, "Content-Type": "video/mp4", "x-upsert": "true"},
                data=f,
            )
        if r.status_code == 200:
            print("OK")
            ok += 1
        else:
            print(f"FAIL({r.status_code})")
            fail += 1

print(f"\nDone: {ok} OK, {fail} FAIL")
