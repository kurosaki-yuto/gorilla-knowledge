#!/usr/bin/env python3
"""
全講座をSupabase LMSに一括インポートするスクリプト
- Stage1-6のカリキュラム構成に基づいてtraining/category/courseを作成
- LoomのURLを video_url に設定
- 台本.md → content_json (BlockNote)
- テスト.md → quizzes テーブル
- 動画.mp4 → duration_seconds (ffprobe)
"""

import json
import re
import os
import uuid
import subprocess
from typing import Optional
import requests

SUPABASE_URL = "https://tkdwqsoyheousodvtmuj.supabase.co"
SUPABASE_KEY = (
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
    "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrZHdxc295aGVvdXNvZHZ0bXVqIiwi"
    "cm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzkyMDgxNiwiZXhwIjoyMDg5"
    "NDk2ODE2fQ.wZH-PrN_-pyjUOhn0s2Q5eUFoeSMhYrTnJlMo6niwdI"
)

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation",
}

BASE = "/Users/matsumotoshuntasuku/AI研修講座/gorilla-knowledge/黒崎/AI研修一覧"

# Loom URLs（フォルダ順 = Newest to Oldest なので逆順に対応）
LOOM_URLS: dict[str, str] = {
    # Stage1
    "A-101_AIとは何か": "https://www.loom.com/share/5ff99fd454674ca3a3702b0eb9863b25",
    "A-102_生成AIの仕組み": "https://www.loom.com/share/cffea79f80984f869dbebe2a255ad2a8",
    "A-104_AIにできること・できないこと": "https://www.loom.com/share/44e10a6901fc4cc2be22f99b26a58241",
    "A-103_主要AIツール徹底比較": "https://www.loom.com/share/c9a71734cbb246f89540920c9f8a87ff",
    # Stage2
    "A-107_AI時代の情報リテラシー": "https://www.loom.com/share/f5422a782d9647bf88c9eb6a93642c0a",
    "A-108_AIと著作権・個人情報": "https://www.loom.com/share/8d4a0e32a89e4223bd712f34b42564d6",
    "A-109_社内AI利用ガイドライン": "https://www.loom.com/share/391c45a67f344692b5c9f81a89038f2b",
    # Stage3
    "A-105_プロンプトの基本": "https://www.loom.com/share/7bf5111c781042e8bdc442de5afad710",
    "A-106_プロンプト実践テクニック": "https://www.loom.com/share/a4aa968",  # TODO: フルURL取得
    # Stage4 - ChatGPT
    "GPT講座/Part1": "https://www.loom.com/share/2d8e6cb477ef47aa891373611003361e",
    "GPT講座/Part2": "https://www.loom.com/share/49af8f751d9a41979d0fd5de6bc77717",
    "GPT講座/Part3": "https://www.loom.com/share/7c867011330a476aab95d4a84138902a",
    "GPT講座/Part4": "https://www.loom.com/share/ebcc598fece34799af5fcd2806c7f4bc",
    "GPT講座/Part5": "https://www.loom.com/share/20a5b89d27794b92a7db4c175569e7a8",
    # Stage4 - Claude
    "Claude/Part1_Claudeとは": "https://www.loom.com/share/378688e1e3fa464399bef53f48e9c83b",
    "Claude/Part2_プロジェクト&アーティファクト": "https://www.loom.com/share/e5dfae19b79e4e8f96e07b31de71018f",
    "Claude/Part3_長文処理&Web検索": "https://www.loom.com/share/3b4c8b036cd948ccb2b1fb14812ece73",
    "Claude/Part4_Claude_Code&MCP": "https://www.loom.com/share/81d0c37db912425cbececb5df4714a8b",
    "Claude/Part5_Co-work&実践": "https://www.loom.com/share/f33ba06a99f6488bb9004b331326c658",
    # Stage4 - Gemini
    "Gemini/P-01_Gemini_Enterprise_とは": "https://www.loom.com/share/0d6276a235e540f9a4f8edfbabe906da",
    "Gemini/P-02_Workspace_統合実演": "https://www.loom.com/share/fb339efcce8e466d8edc8d58bf667314",
    "Gemini/P-03_営業企画効率化": "https://www.loom.com/share/1be9835f69ae464f89e402e77acffd07",
    "Gemini/P-04_セキュリティ・対象者": "https://www.loom.com/share/280243a94a8746aea57f15fcb985686c",
    "Gemini/P-05_実装事例・未来へ": "https://www.loom.com/share/8a029adb5c214f9eb74b5a0a56d58639",
    # Stage4 - Perplexity
    "Perplexity/P-01_なぜ今Perplexityなのか": "https://www.loom.com/share/693d4652b30e418f911dee97d111daf8",
    "Perplexity/P-02_基本的な検索の使い方": "https://www.loom.com/share/7e01a93bfc2647a1972da8a96d9e3e61",
    "Perplexity/P-03_高度な検索テクニック": "https://www.loom.com/share/651b7f4a85954bf0939ee4cc91b921bd",
    "Perplexity/P-04_Google検索との使い分け": "https://www.loom.com/share/235ef1f07d0e4d119d6e6dab5f5962d9",
    "Perplexity/P-05_業務でPerplexityを活用する": "https://www.loom.com/share/53dcba4b037a45aabd75c6d1aaea0fa4",
    # Stage5 - AI資料作成
    "AIプレゼン資料作成/P-01_なぜAIで資料を作るべきなのか": "https://www.loom.com/share/c56a9b7d93fe4fdf96644c1ad572bd2f",
    "AIプレゼン資料作成/P-02_Claudeで提案書を設計する": "https://www.loom.com/share/9d3464e9e3e64332a3bc8e089cfcaf47",
    "AIプレゼン資料作成/P-03_Claudeでスライド化する": "https://www.loom.com/share/12653941f9e1469ba49621e91f68b80d",
    "AIプレゼン資料作成/P-04_業務別テンプレート実践": "https://www.loom.com/share/ff09c09250bf4c219ad34ee14ad05ba2",
    "AIプレゼン資料作成/P-05_最強ワークフローと総まとめ": "https://www.loom.com/share/68e805cb10fd42aba7a3240532fb7c54",
    # Stage5 - AI画像生成
    "AI画像生成/P-01_なぜAI画像生成なのか": "https://www.loom.com/share/0cf960d603f94764a4b6fae2ad8dc825",
    "AI画像生成/P-02_まず1枚作る": "https://www.loom.com/share/e738b3f646b14bedbfe2077b3309668e",
    "AI画像生成/P-03_SNS素材テンプレート実践": "https://www.loom.com/share/6cfbba1eb2934f0a97db51cacb821d51",
    "AI画像生成/P-04_広告バナー制作": "https://www.loom.com/share/c91e321913ca40f4a15a258c2cd2571b",
    "AI画像生成/P-05_クオリティ改善と次のステップ": "https://www.loom.com/share/22f541f75d374971bcf69a4c60a9e2d1",
    # Stage5 - AI動画生成
    "AI動画生成/P-01_なぜVeo3一本でいいのか": "https://www.loom.com/share/6d00d130dc6f447eabe5f194e90f5602",
    "AI動画生成/P-02_Veo3基本操作": "https://www.loom.com/share/ced996150eae4e4895790c81521b425a",
    "AI動画生成/P-03_プロンプト設計マスター": "https://www.loom.com/share/495a6a60abf6455a9a95a5f954aa485c",
    "AI動画生成/P-04_SNS×PDCA戦略": "https://www.loom.com/share/0432a53519704e30a77944716ed03a9d",
    "AI動画生成/P-05_業界別テンプレートと実践": "https://www.loom.com/share/83e9a643fc9140d6b4de8b5aabf7fed0",
    # Stage6
    "A-110_AIで変わる仕事の未来": "https://www.loom.com/share/d3c67dcbf0754cb39618f97ce2c26281",
    "A-111_業務別AI活用マップ": "https://www.loom.com/share/558f70fe1da4452d87bccb0f58ef00e9",
    "A-112_AI導入の第一歩": "https://www.loom.com/share/5d69767812734c3ebe617adb59be05e6",
    "ツール選定ロードマップ/P-01_全ツール総整理": "https://www.loom.com/share/35b42c3f0729457190318158cc600f2d",
    "ツール選定ロードマップ/P-02_コストシミュレーション": "https://www.loom.com/share/f7e40175d87749f6b5ebcb2212f9511b",
    "ツール選定ロードマップ/P-03_90日ロードマップ設計": "https://www.loom.com/share/cef32f979d524cf8b0200fe2f266f088",
    "ツール選定ロードマップ/P-04_KPI設定と実践": "https://www.loom.com/share/a9fe11beec914220bf04f438ff3200fd",
    "ツール選定ロードマップ/P-05_Pack6総まとめ": "https://www.loom.com/share/3c2c03df75d74cd6bed35ebca89df56a",
}

# 既存のA-101〜A-112コースID（Supabaseに既に存在する）
EXISTING_COURSE_IDS: dict[str, str] = {
    "A-101_AIとは何か": "14a19983-6967-4caf-ac51-834136acd8ab",
    "A-102_生成AIの仕組み": "fe52fe5f-8307-4248-8d5c-1cb8c4075030",
    "A-103_主要AIツール徹底比較": "b6bdbb0d-cc2a-4822-9c46-baf620acf7ab",
    "A-104_AIにできること・できないこと": "bd3f3c31-82ef-4f85-846c-be8b7bd333da",
    "A-105_プロンプトの基本": "1a09ed28-6279-4047-9455-bf5d618a14a3",
    "A-106_プロンプト実践テクニック": "fb2ec073-f51e-45da-9b6b-89ad89eac8d1",
    "A-107_AI時代の情報リテラシー": "7de062f6-405d-461f-9d6c-6a83ae2ae783",
    "A-108_AIと著作権・個人情報": "d4d327eb-2316-4611-8557-76282e62f9b9",
    "A-109_社内AI利用ガイドライン": "5110b8d1-c0f7-4749-a223-1f4ea622e362",
    "A-110_AIで変わる仕事の未来": "7f072a26-115d-46ba-a888-95bc1daca9d1",
    "A-111_業務別AI活用マップ": "451fb513-a7a4-42d9-b4a2-e15a48bfc930",
    "A-112_AI導入の第一歩": "ff146501-0a27-4433-8996-2fc64e37d526",
}

# カリキュラム定義
CURRICULUM = [
    # (stage_name, category_name, sort_order, folder_key, display_name, video_file)
    # Stage 1
    ("Stage1: AIを知る", "AIとは何か", 1, "A-101_AIとは何か", "AIとは何か", "動画.mp4"),
    ("Stage1: AIを知る", "生成AIの仕組み", 2, "A-102_生成AIの仕組み", "生成AIの仕組み", "動画.mp4"),
    ("Stage1: AIを知る", "AIにできること・できないこと", 3, "A-104_AIにできること・できないこと", "AIにできること・できないこと", "動画.mp4"),
    ("Stage1: AIを知る", "主要AIツール徹底比較", 4, "A-103_主要AIツール徹底比較", "主要AIツール徹底比較", "動画.mp4"),
    # Stage 2
    ("Stage2: 安全に使う", "AI時代の情報リテラシー", 1, "A-107_AI時代の情報リテラシー", "AI時代の情報リテラシー", "動画.mp4"),
    ("Stage2: 安全に使う", "AIと著作権・個人情報", 2, "A-108_AIと著作権・個人情報", "AIと著作権・個人情報", "動画.mp4"),
    ("Stage2: 安全に使う", "社内AI利用ガイドライン", 3, "A-109_社内AI利用ガイドライン", "社内AI利用ガイドライン", "動画.mp4"),
    # Stage 3
    ("Stage3: プロンプト", "プロンプトの基本", 1, "A-105_プロンプトの基本", "プロンプトの基本", "動画.mp4"),
    ("Stage3: プロンプト", "プロンプト実践テクニック", 2, "A-106_プロンプト実践テクニック", "プロンプト実践テクニック", "動画.mp4"),
    # Stage 4 - ChatGPT
    ("Stage4: ChatGPT", "ChatGPT Part1", 1, "GPT講座/Part1", "ChatGPT Part1", "Part1_clean.mp4"),
    ("Stage4: ChatGPT", "ChatGPT Part2", 2, "GPT講座/Part2", "ChatGPT Part2", "Part2_clean.mp4"),
    ("Stage4: ChatGPT", "ChatGPT Part3", 3, "GPT講座/Part3", "ChatGPT Part3", "Part3_clean.mp4"),
    ("Stage4: ChatGPT", "ChatGPT Part4", 4, "GPT講座/Part4", "ChatGPT Part4", "Part4_clean.mp4"),
    ("Stage4: ChatGPT", "ChatGPT Part5", 5, "GPT講座/Part5", "ChatGPT Part5", "Part5_clean.mp4"),
    # Stage 4 - Claude
    ("Stage4: Claude", "Claudeとは", 1, "Claude/Part1_Claudeとは", "Claudeとは", "スライド.mp4"),
    ("Stage4: Claude", "プロジェクト&アーティファクト", 2, "Claude/Part2_プロジェクト&アーティファクト", "プロジェクト&アーティファクト", "Part2_edited.mp4"),
    ("Stage4: Claude", "長文処理&Web検索", 3, "Claude/Part3_長文処理&Web検索", "長文処理&Web検索", "100万トークン長文処理 & Web検索活用.mp4"),
    ("Stage4: Claude", "Claude Code&MCP", 4, "Claude/Part4_Claude_Code&MCP", "Claude Code&MCP", "Part4_edited.mp4"),
    ("Stage4: Claude", "Co-work&実践", 5, "Claude/Part5_Co-work&実践", "Co-work&実践", "Part5_edited.mp4"),
    # Stage 4 - Gemini
    ("Stage4: Gemini", "Gemini Enterpriseとは", 1, "Gemini/P-01_Gemini_Enterprise_とは", "Gemini Enterpriseとは", "動画.mp4"),
    ("Stage4: Gemini", "Workspace統合実演", 2, "Gemini/P-02_Workspace_統合実演", "Workspace統合実演", "動画.mp4"),
    ("Stage4: Gemini", "営業企画効率化", 3, "Gemini/P-03_営業企画効率化", "営業企画効率化", "動画.mp4"),
    ("Stage4: Gemini", "セキュリティ・対象者", 4, "Gemini/P-04_セキュリティ・対象者", "セキュリティ・対象者", "動画.mp4"),
    ("Stage4: Gemini", "実装事例・未来へ", 5, "Gemini/P-05_実装事例・未来へ", "実装事例・未来へ", "動画.mp4"),
    # Stage 4 - Perplexity
    ("Stage4: Perplexity", "なぜ今Perplexityなのか", 1, "Perplexity/P-01_なぜ今Perplexityなのか", "なぜ今Perplexityなのか", "動画.mp4"),
    ("Stage4: Perplexity", "基本的な検索の使い方", 2, "Perplexity/P-02_基本的な検索の使い方", "基本的な検索の使い方", "動画.mp4"),
    ("Stage4: Perplexity", "高度な検索テクニック", 3, "Perplexity/P-03_高度な検索テクニック", "高度な検索テクニック", "動画.mp4"),
    ("Stage4: Perplexity", "Google検索との使い分け", 4, "Perplexity/P-04_Google検索との使い分け", "Google検索との使い分け", "動画.mp4"),
    ("Stage4: Perplexity", "業務でPerplexityを活用する", 5, "Perplexity/P-05_業務でPerplexityを活用する", "業務でPerplexityを活用する", "動画.mp4"),
    # Stage 4 - Manus（動画未生成）
    ("Stage4: Manus", "Manusとは", 1, "Manus/P-01_Manusとは", "Manusとは", None),
    ("Stage4: Manus", "リサーチ業務を自動化する", 2, "Manus/P-02_リサーチ業務を自動化する", "リサーチ業務を自動化する", None),
    ("Stage4: Manus", "データ分析をManusに任せる", 3, "Manus/P-03_データ分析をManusに任せる", "データ分析をManusに任せる", None),
    ("Stage4: Manus", "制作物をManusで量産する", 4, "Manus/P-04_制作物をManusで量産する", "制作物をManusで量産する", None),
    ("Stage4: Manus", "6ツール使い分けと運用ルール", 5, "Manus/P-05_6ツール使い分けと運用ルール", "6ツール使い分けと運用ルール", None),
    # Stage 5 - AI資料作成
    ("Stage5: AIプレゼン資料作成", "なぜAIで資料を作るべきなのか", 1, "AIプレゼン資料作成/P-01_なぜAIで資料を作るべきなのか", "なぜAIで資料を作るべきなのか", "動画.mp4"),
    ("Stage5: AIプレゼン資料作成", "Claudeで提案書を設計する", 2, "AIプレゼン資料作成/P-02_Claudeで提案書を設計する", "Claudeで提案書を設計する", "動画.mp4"),
    ("Stage5: AIプレゼン資料作成", "Claudeでスライド化する", 3, "AIプレゼン資料作成/P-03_Claudeでスライド化する", "Claudeでスライド化する", "動画.mp4"),
    ("Stage5: AIプレゼン資料作成", "業務別テンプレート実践", 4, "AIプレゼン資料作成/P-04_業務別テンプレート実践", "業務別テンプレート実践", "動画.mp4"),
    ("Stage5: AIプレゼン資料作成", "最強ワークフローと総まとめ", 5, "AIプレゼン資料作成/P-05_最強ワークフローと総まとめ", "最強ワークフローと総まとめ", "動画.mp4"),
    # Stage 5 - AI画像生成
    ("Stage5: AI画像生成", "なぜAI画像生成なのか", 1, "AI画像生成/P-01_なぜAI画像生成なのか", "なぜAI画像生成なのか", "動画.mp4"),
    ("Stage5: AI画像生成", "まず1枚作る", 2, "AI画像生成/P-02_まず1枚作る", "まず1枚作る", "動画.mp4"),
    ("Stage5: AI画像生成", "SNS素材テンプレート実践", 3, "AI画像生成/P-03_SNS素材テンプレート実践", "SNS素材テンプレート実践", "動画.mp4"),
    ("Stage5: AI画像生成", "広告バナー制作", 4, "AI画像生成/P-04_広告バナー制作", "広告バナー制作", "動画.mp4"),
    ("Stage5: AI画像生成", "クオリティ改善と次のステップ", 5, "AI画像生成/P-05_クオリティ改善と次のステップ", "クオリティ改善と次のステップ", "動画.mp4"),
    # Stage 5 - AI動画生成
    ("Stage5: AI動画生成", "なぜVeo3一本でいいのか", 1, "AI動画生成/P-01_なぜVeo3一本でいいのか", "なぜVeo3一本でいいのか", "動画.mp4"),
    ("Stage5: AI動画生成", "Veo3基本操作", 2, "AI動画生成/P-02_Veo3基本操作", "Veo3基本操作", "動画.mp4"),
    ("Stage5: AI動画生成", "プロンプト設計マスター", 3, "AI動画生成/P-03_プロンプト設計マスター", "プロンプト設計マスター", "動画.mp4"),
    ("Stage5: AI動画生成", "SNS×PDCA戦略", 4, "AI動画生成/P-04_SNS×PDCA戦略", "SNS×PDCA戦略", "動画.mp4"),
    ("Stage5: AI動画生成", "業界別テンプレートと実践", 5, "AI動画生成/P-05_業界別テンプレートと実践", "業界別テンプレートと実践", "動画.mp4"),
    # Stage 6
    ("Stage6: 戦略・導入", "AIで変わる仕事の未来", 1, "A-110_AIで変わる仕事の未来", "AIで変わる仕事の未来", "動画.mp4"),
    ("Stage6: 戦略・導入", "業務別AI活用マップ", 2, "A-111_業務別AI活用マップ", "業務別AI活用マップ", "動画.mp4"),
    ("Stage6: 戦略・導入", "AI導入の第一歩", 3, "A-112_AI導入の第一歩", "AI導入の第一歩", "動画.mp4"),
    ("Stage6: 戦略・導入", "全ツール総整理", 4, "ツール選定ロードマップ/P-01_全ツール総整理", "全ツール総整理", "動画.mp4"),
    ("Stage6: 戦略・導入", "コストシミュレーション", 5, "ツール選定ロードマップ/P-02_コストシミュレーション", "コストシミュレーション", "動画.mp4"),
    ("Stage6: 戦略・導入", "90日ロードマップ設計", 6, "ツール選定ロードマップ/P-03_90日ロードマップ設計", "90日ロードマップ設計", "動画.mp4"),
    ("Stage6: 戦略・導入", "KPI設定と実践", 7, "ツール選定ロードマップ/P-04_KPI設定と実践", "KPI設定と実践", "動画.mp4"),
    ("Stage6: 戦略・導入", "Pack6総まとめ", 8, "ツール選定ロードマップ/P-05_Pack6総まとめ", "Pack6総まとめ", "動画.mp4"),
]


# ===== BlockNote helpers =====

def make_block(block_type: str, text: str = "", level: int = 2) -> dict:
    block = {
        "id": str(uuid.uuid4()),
        "type": block_type,
        "props": {"textColor": "default", "textAlignment": "left", "backgroundColor": "default"},
        "content": [],
        "children": [],
    }
    if block_type == "heading":
        block["props"]["level"] = level
    if text:
        block["content"] = [{"text": text, "type": "text", "styles": {}}]
    return block


# ===== Parsers =====

def parse_script(text: str) -> tuple[list[str], list[tuple[str, list[str]]]]:
    goals: list[str] = []
    narration_sections: list[tuple[str, list[str]]] = []
    current_slide_title: Optional[str] = None
    current_paragraphs: list[str] = []
    in_goals = False

    for line in text.split("\n"):
        stripped = line.strip()
        if "学習目標" in stripped or ("ゴール" in stripped and "##" in stripped):
            in_goals = True
            continue
        if in_goals:
            if stripped.startswith("##") or stripped.startswith("---") or stripped.startswith("**【ナレーション"):
                in_goals = False
            else:
                m = re.match(r"^[-*✅]\s+(.+)", stripped)
                m2 = re.match(r"^\d+[.．]\s*(.+)", stripped)
                if m:
                    goal = m.group(1).strip()
                    if goal and "学習目標" not in goal:
                        goals.append(goal)
                elif m2:
                    goals.append(m2.group(1).strip())
                continue

        m = re.match(r"^##\s*(?:スライド\s*\d+[：:．.]*\s*)?(.+)", stripped)
        if m:
            if current_slide_title and current_paragraphs:
                narration_sections.append((current_slide_title, current_paragraphs))
            title = re.sub(r"[（(]\d+秒[）)]", "", m.group(1).strip()).strip()
            current_slide_title = title
            current_paragraphs = []
            continue

        if stripped.startswith(">") or stripped.startswith("```") or stripped.startswith("|"):
            continue
        if stripped.startswith("# ") and not stripped.startswith("## "):
            continue
        if "ナレーション台本" in stripped:
            continue
        if stripped.startswith("**【スライド内容】**") or stripped.startswith("**【ナレーション】**"):
            continue
        if stripped.startswith("- ") and current_slide_title:
            continue

        if current_slide_title and stripped:
            clean = re.sub(r"^\*\*(.+)\*\*$", r"\1", stripped)
            clean = re.sub(r"^「(.+)」$", r"\1", clean)
            if clean and not clean.startswith("---"):
                current_paragraphs.append(clean)

    if current_slide_title and current_paragraphs:
        narration_sections.append((current_slide_title, current_paragraphs))
    return goals, narration_sections


def parse_quiz(text: str) -> list[dict]:
    quizzes: list[dict] = []
    lines = text.split("\n")
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        if re.match(r"^##\s*(問題\s*\d+|Q\d+[.．])", line):
            question = ""
            choices: list[str] = []
            correct_answer = -1
            q_inline = re.match(r"^##\s*Q\d+[.．]\s*(.+)", line)
            if q_inline:
                question = q_inline.group(1).strip().strip("*")
            i += 1
            if not question:
                while i < len(lines):
                    s = lines[i].strip()
                    if s.startswith("**") and s.endswith("**"):
                        question = s.strip("*").strip()
                        i += 1
                        break
                    elif s and not s.startswith("#") and not s.startswith("-"):
                        question = s.strip("*").strip()
                        i += 1
                        break
                    i += 1
            while i < len(lines):
                s = lines[i].strip()
                m = re.match(r"^-\s*([A-D])[.．]\s*(.+)", s)
                if m:
                    choices.append(m.group(2).strip())
                elif s.startswith("<details>"):
                    while i < len(lines):
                        s = lines[i].strip()
                        m2 = re.match(r"^\*\*([A-D])[.．]\s*", s)
                        if m2:
                            correct_answer = ord(m2.group(1)) - ord("A")
                            break
                        i += 1
                    break
                elif re.match(r"^\*\*正解[：:]\s*([A-D])\*\*", s):
                    m3 = re.match(r"^\*\*正解[：:]\s*([A-D])\*\*", s)
                    if m3:
                        correct_answer = ord(m3.group(1)) - ord("A")
                    break
                elif s.startswith("---") and choices:
                    break
                i += 1
            if question and len(choices) == 4 and correct_answer >= 0:
                quizzes.append({"question": question, "choices": choices, "correct_answer": correct_answer})
        i += 1
    return quizzes


def build_content_json(name: str, goals: list[str], narration_sections: list[tuple[str, list[str]]]) -> dict:
    above = [
        make_block("heading", "この講座について", 2),
        make_block("paragraph"),
        make_block("bulletListItem", "動画を最後まで視聴してください"),
        make_block("bulletListItem", "動画の後に確認テストがあります（80%以上で合格）"),
        make_block("paragraph"),
    ]
    if goals:
        above.append(make_block("heading", "学習目標", 2))
        above.append(make_block("paragraph", "この講座を終えると、以下ができるようになります："))
        above.append(make_block("paragraph"))
        for goal in goals:
            above.append(make_block("bulletListItem", goal))
        above.append(make_block("paragraph"))

    below = [make_block("heading", "動画の要約", 2), make_block("paragraph")]
    for title, paragraphs in narration_sections:
        below.append(make_block("paragraph", title))
        for p in paragraphs:
            below.append(make_block("paragraph", p))
        below.append(make_block("paragraph"))
    below.append(make_block("paragraph", "お疲れさまでした。このあと確認テストがあります。5問中4問正解で修了です。"))
    return {"above": above, "below": below}


def get_duration(video_path: str) -> int:
    if not os.path.exists(video_path):
        return 600  # デフォルト10分
    try:
        result = subprocess.run(
            ["ffprobe", "-v", "error", "-show_entries", "format=duration",
             "-of", "default=noprint_wrappers=1:nokey=1", video_path],
            capture_output=True, text=True,
        )
        return int(float(result.stdout.strip()))
    except Exception:
        return 600


# ===== Supabase API helpers =====

def supabase_get(table: str, params: str = "") -> list[dict]:
    r = requests.get(f"{SUPABASE_URL}/rest/v1/{table}?{params}", headers=HEADERS)
    r.raise_for_status()
    return r.json()


def supabase_post(table: str, data: list[dict] | dict) -> list[dict]:
    r = requests.post(f"{SUPABASE_URL}/rest/v1/{table}", headers=HEADERS, json=data)
    if r.status_code not in (200, 201):
        print(f"  POST {table} failed: {r.status_code} {r.text[:200]}")
    return r.json() if r.status_code in (200, 201) else []


def supabase_patch(table: str, filter_str: str, data: dict) -> bool:
    r = requests.patch(f"{SUPABASE_URL}/rest/v1/{table}?{filter_str}", headers=HEADERS, json=data)
    return r.status_code in (200, 204)


def supabase_delete(table: str, filter_str: str) -> bool:
    r = requests.delete(f"{SUPABASE_URL}/rest/v1/{table}?{filter_str}", headers=HEADERS)
    return r.status_code in (200, 204)


# ===== Main =====

def main() -> None:
    print("=" * 60)
    print("AI研修 全講座一括インポート")
    print("=" * 60)

    # 1. Training（研修プログラム）を作成 or 取得
    trainings = supabase_get("trainings", "name=eq.AI研修カリキュラム")
    if trainings:
        training_id = trainings[0]["id"]
        print(f"\nTraining exists: {training_id}")
    else:
        training_id = str(uuid.uuid4())
        supabase_post("trainings", {
            "id": training_id,
            "name": "AI研修カリキュラム",
            "description": "6段階のAI研修プログラム（全52講座）",
            "is_published": True,
        })
        print(f"\nTraining created: {training_id}")

    # 2. カテゴリを作成（Stage別）
    stage_names = list(dict.fromkeys(c[0] for c in CURRICULUM))
    category_ids: dict[str, str] = {}

    for idx, stage_name in enumerate(stage_names):
        cats = supabase_get("categories", f"training_id=eq.{training_id}&name=eq.{stage_name}")
        if cats:
            category_ids[stage_name] = cats[0]["id"]
            print(f"  Category exists: {stage_name}")
        else:
            cat_id = str(uuid.uuid4())
            supabase_post("categories", {
                "id": cat_id,
                "training_id": training_id,
                "name": stage_name,
                "sort_order": idx + 1,
            })
            category_ids[stage_name] = cat_id
            print(f"  Category created: {stage_name}")

    # 3. 各講座をインポート
    all_quizzes: list[dict] = []
    course_ids_to_clean: list[str] = []

    for stage_name, cat_name, sort_order, folder_key, display_name, video_file in CURRICULUM:
        print(f"\n{'='*50}")
        print(f"  {display_name} ({folder_key})")

        folder_path = os.path.join(BASE, folder_key)
        category_id = category_ids[stage_name]
        loom_url = LOOM_URLS.get(folder_key, "")

        # 動画のduration取得
        if video_file:
            video_path = os.path.join(folder_path, video_file)
            duration = get_duration(video_path)
        else:
            duration = 600

        # 台本.md → content_json
        script_path = os.path.join(folder_path, "台本.md")
        content_json = None
        if os.path.exists(script_path):
            with open(script_path, "r") as f:
                goals, narration = parse_script(f.read())
            content_json = build_content_json(display_name, goals, narration)
            print(f"  台本: {len(goals)} goals, {len(narration)} sections")
        else:
            print(f"  台本: なし")

        # テスト.md → quizzes
        test_path = os.path.join(folder_path, "テスト.md")
        quizzes: list[dict] = []
        if os.path.exists(test_path):
            with open(test_path, "r") as f:
                quizzes = parse_quiz(f.read())
            print(f"  テスト: {len(quizzes)} questions")
        else:
            print(f"  テスト: なし")

        # 既存コースか新規か判定
        existing_id = EXISTING_COURSE_IDS.get(folder_key)

        if existing_id:
            # 既存コースを更新（video_url + content_json + duration）
            course_id = existing_id
            update_data: dict = {
                "video_url": loom_url,
                "duration_seconds": duration,
                "category_id": category_id,
                "is_published": True,
            }
            if content_json:
                update_data["content_json"] = content_json
            ok = supabase_patch("courses", f"id=eq.{course_id}", update_data)
            print(f"  UPDATE {'OK' if ok else 'FAIL'}: {course_id}")
        else:
            # 新規コース作成
            course_id = str(uuid.uuid4())
            course_data = {
                "id": course_id,
                "category_id": category_id,
                "name": display_name,
                "description": f"{stage_name} - {display_name}",
                "video_url": loom_url,
                "duration_seconds": duration,
                "is_published": bool(loom_url),  # 動画なしは非公開
            }
            if content_json:
                course_data["content_json"] = content_json
            result = supabase_post("courses", course_data)
            print(f"  INSERT: {course_id} ({'OK' if result else 'FAIL'})")

        course_ids_to_clean.append(course_id)

        # クイズをバッファに追加
        for idx, q in enumerate(quizzes):
            all_quizzes.append({
                "course_id": course_id,
                "question": q["question"],
                "choices": q["choices"],
                "correct_answer": q["correct_answer"],
                "sort_order": idx + 1,
            })

    # 4. 既存クイズを削除して一括登録
    print(f"\n{'='*60}")
    print(f"Quizzes: {len(all_quizzes)} questions total")

    for cid in course_ids_to_clean:
        supabase_delete("quizzes", f"course_id=eq.{cid}")
    print("  Existing quizzes deleted")

    # バッチで挿入（50件ずつ）
    for i in range(0, len(all_quizzes), 50):
        batch = all_quizzes[i:i + 50]
        supabase_post("quizzes", batch)
        print(f"  Inserted quizzes {i + 1}-{i + len(batch)}")

    print(f"\n{'='*60}")
    print(f"DONE! {len(CURRICULUM)} courses imported")
    print(f"  Quizzes: {len(all_quizzes)}")
    print(f"  Training: {training_id}")


if __name__ == "__main__":
    main()
