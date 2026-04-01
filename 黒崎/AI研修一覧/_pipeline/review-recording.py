#!/usr/bin/env python3
"""
録画精査スクリプト

録画からスクリーンショットを抽出し、Claude Vision APIで精査する。
OK/NG判定を行い、NGの場合は理由を返す。

使い方:
  python3 review-recording.py --recording recordings/xxxx.webm --script 台本.md [--interval 5]
"""

import argparse
import base64
import json
import os
import subprocess
import sys
from pathlib import Path


def extract_screenshots(video_path: Path, output_dir: Path, interval: int = 5) -> list[Path]:
    """動画からスクリーンショットを定期抽出"""
    output_dir.mkdir(parents=True, exist_ok=True)
    pattern = str(output_dir / "frame_%04d.png")

    subprocess.run([
        "ffmpeg", "-y",
        "-i", str(video_path),
        "-vf", f"fps=1/{interval}",
        pattern
    ], check=True, capture_output=True)

    screenshots = sorted(output_dir.glob("frame_*.png"))
    print(f"[精査] {len(screenshots)}枚のスクリーンショットを抽出")
    return screenshots


def encode_image(path: Path) -> str:
    """画像をBase64エンコード"""
    with open(path, "rb") as f:
        return base64.standard_b64encode(f.read()).decode("utf-8")


def review_with_claude(screenshots: list[Path], script_text: str) -> dict:
    """Claude Vision APIで録画内容を精査"""
    try:
        from anthropic import Anthropic
    except ImportError:
        print("ERROR: anthropic パッケージが必要です。pip install anthropic を実行してください。")
        sys.exit(1)

    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("ERROR: ANTHROPIC_API_KEY が設定されていません")
        sys.exit(1)

    client = Anthropic(api_key=api_key)

    # 最大10枚に絞る（APIコスト制御）
    if len(screenshots) > 10:
        step = len(screenshots) // 10
        screenshots = screenshots[::step][:10]

    # メッセージ構築
    content = [
        {
            "type": "text",
            "text": f"""あなたはAI教育講座の品質管理担当です。
以下のスクリーンショットは、AIツールの実演操作を録画したものです。
台本の内容と照らし合わせて、録画が正しく行われたかを判定してください。

## 台本
{script_text[:2000]}

## チェック項目
1. 操作が正常に完了しているか（エラー画面がないか）
2. AIの出力が表示されているか
3. 画面が正しく表示されているか（白画面・ローディング中で止まっていないか）
4. 操作の順序が台本と一致しているか

## 回答形式
JSON形式で回答してください:
{{
  "result": "OK" or "NG",
  "confidence": 0.0〜1.0,
  "issues": ["問題1", "問題2"],
  "summary": "全体の所感"
}}"""
        }
    ]

    for ss in screenshots:
        content.append({
            "type": "image",
            "source": {
                "type": "base64",
                "media_type": "image/png",
                "data": encode_image(ss),
            }
        })

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1024,
        messages=[{"role": "user", "content": content}],
    )

    # JSONを抽出
    text = response.content[0].text
    try:
        # ```json ... ``` のパターンに対応
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0]
        elif "```" in text:
            text = text.split("```")[1].split("```")[0]
        return json.loads(text.strip())
    except (json.JSONDecodeError, IndexError):
        return {
            "result": "NG",
            "confidence": 0.0,
            "issues": ["Claude応答のJSON解析に失敗"],
            "summary": text[:200],
        }


def main():
    parser = argparse.ArgumentParser(description="録画精査スクリプト")
    parser.add_argument("--recording", required=True, help="録画ファイルパス")
    parser.add_argument("--script", required=True, help="台本ファイルパス")
    parser.add_argument("--interval", type=int, default=5, help="スクリーンショット間隔（秒）")
    args = parser.parse_args()

    recording = Path(args.recording)
    script_path = Path(args.script)

    if not recording.exists():
        print(f"ERROR: 録画ファイルが見つかりません: {recording}")
        sys.exit(1)
    if not script_path.exists():
        print(f"ERROR: 台本ファイルが見つかりません: {script_path}")
        sys.exit(1)

    script_text = script_path.read_text(encoding="utf-8")

    # スクリーンショット抽出
    temp_dir = recording.parent / "_review_temp"
    screenshots = extract_screenshots(recording, temp_dir, args.interval)

    if not screenshots:
        print("ERROR: スクリーンショットの抽出に失敗")
        sys.exit(1)

    # Claude Vision APIで精査
    print("[精査] Claude Vision APIで判定中...")
    result = review_with_claude(screenshots, script_text)

    # 結果出力
    print(f"\n{'='*50}")
    print(f"判定: {result['result']}")
    print(f"確信度: {result.get('confidence', 'N/A')}")
    if result.get("issues"):
        print(f"問題点:")
        for issue in result["issues"]:
            print(f"  - {issue}")
    print(f"所感: {result.get('summary', 'N/A')}")
    print(f"{'='*50}")

    # JSON結果を保存
    result_path = recording.parent / "review_result.json"
    result_path.write_text(json.dumps(result, ensure_ascii=False, indent=2))
    print(f"\n[保存] {result_path}")

    # 一時ファイル削除
    import shutil
    shutil.rmtree(temp_dir, ignore_errors=True)

    # 終了コード
    sys.exit(0 if result["result"] == "OK" else 1)


if __name__ == "__main__":
    main()
