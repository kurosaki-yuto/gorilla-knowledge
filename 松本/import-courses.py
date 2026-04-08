#!/usr/bin/env python3
"""A-101〜A-112の content_json と quizzes を Supabase に一括登録するスクリプト"""

import json
import re
import os
import uuid
import subprocess
import requests

SUPABASE_URL = "https://tkdwqsoyheousodvtmuj.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrZHdxc295aGVvdXNvZHZ0bXVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5MjA4MTYsImV4cCI6MjA4OTQ5NjgxNn0.7udwO6nMGyisej4b43suN9bHbAWvXiT6GinGtUdlRmU"

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation",
}

BASE_DIR = "/Users/matsumotoshuntasuku/AI研修講座/gorilla-knowledge/黒崎/AI研修一覧"

COURSES = [
    {"id": "14a19983-6967-4caf-ac51-834136acd8ab", "folder": "A-101_AIとは何か"},
    {"id": "fe52fe5f-8307-4248-8d5c-1cb8c4075030", "folder": "A-102_生成AIの仕組み"},
    {"id": "b6bdbb0d-cc2a-4822-9c46-baf620acf7ab", "folder": "A-103_主要AIツール徹底比較"},
    {"id": "bd3f3c31-82ef-4f85-846c-be8b7bd333da", "folder": "A-104_AIにできること・できないこと"},
    {"id": "1a09ed28-6279-4047-9455-bf5d618a14a3", "folder": "A-105_プロンプトの基本"},
    {"id": "fb2ec073-f51e-45da-9b6b-89ad89eac8d1", "folder": "A-106_プロンプト実践テクニック"},
    {"id": "7de062f6-405d-461f-9d6c-6a83ae2ae783", "folder": "A-107_AI時代の情報リテラシー"},
    {"id": "d4d327eb-2316-4611-8557-76282e62f9b9", "folder": "A-108_AIと著作権・個人情報"},
    {"id": "5110b8d1-c0f7-4749-a223-1f4ea622e362", "folder": "A-109_社内AI利用ガイドライン"},
    {"id": "7f072a26-115d-46ba-a888-95bc1daca9d1", "folder": "A-110_AIで変わる仕事の未来"},
    {"id": "451fb513-a7a4-42d9-b4a2-e15a48bfc930", "folder": "A-111_業務別AI活用マップ"},
    {"id": "ff146501-0a27-4433-8996-2fc64e37d526", "folder": "A-112_AI導入の第一歩"},
]


def make_block(block_type, text="", level=2):
    """BlockNote editor block を生成"""
    block = {
        "id": str(uuid.uuid4()),
        "type": block_type,
        "props": {
            "textColor": "default",
            "textAlignment": "left",
            "backgroundColor": "default",
        },
        "content": [],
        "children": [],
    }
    if block_type == "heading":
        block["props"]["level"] = level
    if text:
        block["content"] = [{"text": text, "type": "text", "styles": {}}]
    return block


def parse_script(text):
    """台本.mdから学習目標と本文（スライドごとのナレーション）を抽出"""
    goals = []
    narration_sections = []
    current_slide_title = None
    current_paragraphs = []

    lines = text.split("\n")
    in_goals = False

    for line in lines:
        stripped = line.strip()

        # 学習目標セクション検出（スライド内容の箇条書きから）
        if "学習目標" in stripped or ("ゴール" in stripped and "##" in stripped):
            in_goals = True
            continue

        if in_goals:
            if stripped.startswith("##") or stripped.startswith("---") or stripped.startswith("**【ナレーション"):
                in_goals = False
            else:
                # - item, * item, ✅ item, 1. item, 番号付きインデント
                m = re.match(r"^[-*✅]\s+(.+)", stripped)
                m2 = re.match(r"^\d+[.．]\s*(.+)", stripped)
                if m:
                    goal = m.group(1).strip()
                    if goal and "学習目標" not in goal:
                        goals.append(goal)
                elif m2:
                    goal = m2.group(1).strip()
                    if goal:
                        goals.append(goal)
                continue

        # スライドセクション検出
        m = re.match(r"^##\s*(?:スライド\s*\d+[：:．.]*\s*)?(.+)", stripped)
        if m:
            if current_slide_title and current_paragraphs:
                narration_sections.append((current_slide_title, current_paragraphs))
            title = m.group(1).strip()
            # (75秒) などの時間表記を除去
            title = re.sub(r"[（(]\d+秒[）)]", "", title).strip()
            current_slide_title = title
            current_paragraphs = []
            continue

        # ナレーション本文（メタ情報はスキップ）
        if stripped.startswith(">") or stripped.startswith("```") or stripped.startswith("|"):
            continue
        if stripped.startswith("# ") and not stripped.startswith("## "):
            continue
        if "ナレーション台本" in stripped:
            continue
        # スライド内容のメタ行はスキップ
        if stripped.startswith("**【スライド内容】**") or stripped.startswith("**【ナレーション】**"):
            continue
        if stripped.startswith("- ") and current_slide_title:
            # スライド内容の箇条書きはスキップ
            continue

        if current_slide_title and stripped:
            # 装飾記号を除去
            clean = re.sub(r"^\*\*(.+)\*\*$", r"\1", stripped)
            clean = re.sub(r"^「(.+)」$", r"\1", clean)
            if clean and not clean.startswith("---"):
                current_paragraphs.append(clean)

    if current_slide_title and current_paragraphs:
        narration_sections.append((current_slide_title, current_paragraphs))

    return goals, narration_sections


def parse_quiz(text):
    """テスト.mdからクイズデータを抽出"""
    quizzes = []
    lines = text.split("\n")
    i = 0

    while i < len(lines):
        line = lines[i].strip()

        # 問題検出: "## 問題 1" or "## Q1." format
        if re.match(r"^##\s*(問題\s*\d+|Q\d+[.．])", line):
            question = ""
            choices = []
            correct_answer = -1

            # "## Q1. 質問文..." 形式の場合、同じ行に質問がある
            q_inline = re.match(r"^##\s*Q\d+[.．]\s*(.+)", line)
            if q_inline:
                question = q_inline.group(1).strip().strip("*")

            i += 1
            # 問題文を探す（まだ見つかっていない場合）
            if not question:
                while i < len(lines):
                    stripped = lines[i].strip()
                    if stripped.startswith("**") and stripped.endswith("**"):
                        question = stripped.strip("*").strip()
                        i += 1
                        break
                    elif stripped and not stripped.startswith("#") and not stripped.startswith("-"):
                        question = stripped.strip("*").strip()
                        i += 1
                        break
                    i += 1

            # 選択肢を探す
            while i < len(lines):
                stripped = lines[i].strip()
                m = re.match(r"^-\s*([A-D])[.．]\s*(.+)", stripped)
                if m:
                    choices.append(m.group(2).strip())
                elif stripped.startswith("<details>"):
                    # <details>内の正解を探す
                    while i < len(lines):
                        stripped = lines[i].strip()
                        m2 = re.match(r"^\*\*([A-D])[.．]\s*", stripped)
                        if m2:
                            correct_answer = ord(m2.group(1)) - ord("A")
                            break
                        i += 1
                    break
                elif re.match(r"^\*\*正解[：:]\s*([A-D])\*\*", stripped):
                    # **正解: C** 形式
                    m3 = re.match(r"^\*\*正解[：:]\s*([A-D])\*\*", stripped)
                    correct_answer = ord(m3.group(1)) - ord("A")
                    break
                elif stripped.startswith("---") and choices:
                    break
                i += 1

            if question and len(choices) == 4 and correct_answer >= 0:
                quizzes.append({
                    "question": question,
                    "choices": choices,
                    "correct_answer": correct_answer,
                })

        i += 1

    return quizzes


def build_content_json(course_name, goals, narration_sections):
    """content_json (above/below) を構築"""
    above = []
    # "この講座について" セクション
    above.append(make_block("heading", "この講座について", 2))
    above.append(make_block("paragraph"))
    above.append(make_block("bulletListItem", "動画を最後まで視聴してください"))
    above.append(make_block("bulletListItem", "動画の後に確認テストがあります（80%以上で合格）"))
    above.append(make_block("paragraph"))

    # "学習目標" セクション
    if goals:
        above.append(make_block("heading", "学習目標", 2))
        above.append(make_block("paragraph", "この講座を終えると、以下ができるようになります："))
        above.append(make_block("paragraph"))
        for goal in goals:
            above.append(make_block("bulletListItem", goal))
        above.append(make_block("paragraph"))

    # below: 動画の要約（ナレーション本文）
    below = []
    below.append(make_block("heading", "動画の要約", 2))
    below.append(make_block("paragraph"))

    for title, paragraphs in narration_sections:
        below.append(make_block("paragraph", title))
        for p in paragraphs:
            below.append(make_block("paragraph", p))
        below.append(make_block("paragraph"))

    below.append(make_block("paragraph", "確認テストへ"))
    below.append(make_block("paragraph", "お疲れさまでした。このあと確認テストがあります。5問中4問正解で修了です。今の内容を思い出しながら挑戦してみてください。"))
    below.append(make_block("paragraph"))

    return {"above": above, "below": below}


def main():
    all_quizzes = []

    for course in COURSES:
        folder_path = os.path.join(BASE_DIR, course["folder"])
        script_path = os.path.join(folder_path, "台本.md")
        test_path = os.path.join(folder_path, "テスト.md")

        print(f"\n{'='*60}")
        print(f"Processing: {course['folder']}")

        # 台本を読む
        with open(script_path, "r") as f:
            script_text = f.read()
        goals, narration_sections = parse_script(script_text)
        print(f"  Goals: {len(goals)}, Narration sections: {len(narration_sections)}")

        # content_json 構築
        content_json = build_content_json(course["folder"], goals, narration_sections)
        print(f"  Above blocks: {len(content_json['above'])}, Below blocks: {len(content_json['below'])}")

        # 動画のdurationを取得
        video_path = os.path.join(folder_path, "動画.mp4")
        duration_seconds = 1200  # デフォルト20分
        if os.path.exists(video_path):
            try:
                result = subprocess.run(
                    ["ffprobe", "-v", "error", "-show_entries", "format=duration",
                     "-of", "default=noprint_wrappers=1:nokey=1", video_path],
                    capture_output=True, text=True
                )
                duration_seconds = int(float(result.stdout.strip()))
            except Exception:
                pass
        print(f"  Duration: {duration_seconds}s")

        # content_json + duration を更新
        resp = requests.patch(
            f"{SUPABASE_URL}/rest/v1/courses?id=eq.{course['id']}",
            headers=HEADERS,
            json={"content_json": content_json, "duration_seconds": duration_seconds},
        )
        if resp.status_code in (200, 204):
            print(f"  ✓ content_json + duration updated")
        else:
            print(f"  ✗ update failed: {resp.status_code} {resp.text}")

        # テストを読む
        with open(test_path, "r") as f:
            test_text = f.read()
        quizzes = parse_quiz(test_text)
        print(f"  Quizzes: {len(quizzes)}")

        for idx, q in enumerate(quizzes):
            all_quizzes.append({
                "course_id": course["id"],
                "question": q["question"],
                "choices": q["choices"],
                "correct_answer": q["correct_answer"],
                "sort_order": idx + 1,
            })

    # 既存クイズを削除してから一括登録
    course_ids = [c["id"] for c in COURSES]
    for cid in course_ids:
        requests.delete(
            f"{SUPABASE_URL}/rest/v1/quizzes?course_id=eq.{cid}",
            headers=HEADERS,
        )
    print(f"  ✓ Existing quizzes deleted")

    if all_quizzes:
        print(f"\n{'='*60}")
        print(f"Inserting {len(all_quizzes)} quizzes...")
        resp = requests.post(
            f"{SUPABASE_URL}/rest/v1/quizzes",
            headers=HEADERS,
            json=all_quizzes,
        )
        if resp.status_code in (200, 201):
            result = resp.json()
            print(f"  ✓ {len(result)} quizzes inserted")
        else:
            print(f"  ✗ Quiz insert failed: {resp.status_code} {resp.text}")

    print("\nDone!")


if __name__ == "__main__":
    main()
