#!/usr/bin/env python3
"""全動画をSupabase Storageにアップロード → courses.video_urlを更新"""

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
BASE = "/Users/matsumotoshuntasuku/AI研修講座/gorilla-knowledge/黒崎/AI研修一覧/_loom_upload"

HEADERS = {
    "apikey": SB_KEY,
    "Authorization": f"Bearer {SB_KEY}",
}

# Stage名 → 英語フォルダ名マッピング
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

uploaded = 0
failed = 0
results: list[tuple[str, str, str]] = []  # (local_file, storage_url, display_name)

for stage_dir in sorted(os.listdir(BASE)):
    stage_path = os.path.join(BASE, stage_dir)
    if not os.path.isdir(stage_path):
        continue

    eng_dir = STAGE_MAP.get(stage_dir, stage_dir.split("_")[0])
    print(f"\n=== {stage_dir} → {eng_dir}/ ===")

    for filename in sorted(os.listdir(stage_path)):
        if not filename.endswith(".mp4"):
            continue

        filepath = os.path.join(stage_path, filename)
        size_mb = os.path.getsize(filepath) / (1024 * 1024)

        # 英数字のみのファイル名: 番号だけ使う (01.mp4, 02.mp4, ...)
        num = filename.split("_")[0]  # "01", "02", etc.
        storage_key = f"{eng_dir}/{num}.mp4"

        print(f"  {filename} ({size_mb:.1f} MB) → {storage_key}... ", end="", flush=True)

        with open(filepath, "rb") as f:
            resp = requests.post(
                f"{SB_URL}/storage/v1/object/{BUCKET}/{storage_key}",
                headers={**HEADERS, "Content-Type": "video/mp4", "x-upsert": "true"},
                data=f,
            )

        if resp.status_code == 200:
            public_url = f"{SB_URL}/storage/v1/object/public/{BUCKET}/{storage_key}"
            # ファイル名から講座名を推測
            display = filename.replace(".mp4", "").split("_", 1)[-1] if "_" in filename else filename
            results.append((filename, public_url, display))
            print("OK")
            uploaded += 1
        else:
            print(f"FAIL ({resp.status_code})")
            failed += 1

print(f"\n{'='*50}")
print(f"Uploaded: {uploaded}, Failed: {failed}")

# === courses テーブルの video_url を更新 ===
print(f"\n{'='*50}")
print("Updating courses.video_url to MP4 direct URLs...")

resp = requests.get(
    f"{SB_URL}/rest/v1/courses?select=id,name,video_url&limit=100",
    headers={**HEADERS, "Content-Type": "application/json"},
)
courses = resp.json()
print(f"Found {len(courses)} courses in DB")

update_count = 0
for filename, public_url, display in results:
    # コースを名前で照合
    matched = None
    for c in courses:
        cname = c["name"]
        # 完全一致 or 部分一致
        if display == cname or display in cname or cname in display:
            matched = c
            break
        # "A-101: AIとは何か" → "AIとは何か"
        clean_cname = cname.split(": ")[-1] if ": " in cname else cname
        if display == clean_cname or display in clean_cname or clean_cname in display:
            matched = c
            break

    if matched:
        resp = requests.patch(
            f"{SB_URL}/rest/v1/courses?id=eq.{matched['id']}",
            headers={**HEADERS, "Content-Type": "application/json"},
            json={"video_url": public_url},
        )
        status = "OK" if resp.status_code in (200, 204) else f"FAIL({resp.status_code})"
        print(f"  {status}: {matched['name']}")
        if resp.status_code in (200, 204):
            update_count += 1
            # マッチ済みを除外（重複防止）
            courses = [c for c in courses if c["id"] != matched["id"]]
    else:
        print(f"  SKIP: {display} (no match)")

print(f"\nUpdated {update_count} courses to MP4 direct URLs")
