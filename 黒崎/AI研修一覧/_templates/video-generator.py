#!/usr/bin/env python3
"""
AI研修 動画生成パイプライン（汎用版）

使い方:
  python3 video-generator.py <コースフォルダ> <ナレーションJSONパス>

ナレーションJSON形式:
  {
    "1": "スライド1のナレーション...",
    "2": "スライド2のナレーション...",
    ...
  }

必要ツール:
  - LibreOffice (soffice)
  - pdftoppm (poppler)
  - edge-tts
  - ffmpeg
"""

import asyncio
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path


# === 設定 ===
VOICE = "ja-JP-NanamiNeural"
RATE = "+5%"


def find_soffice():
    paths = [
        "/Applications/LibreOffice.app/Contents/MacOS/soffice",
        "soffice",
        "libreoffice",
    ]
    for p in paths:
        if os.path.exists(p):
            return p
        if subprocess.run(["which", p], capture_output=True).returncode == 0:
            return p
    print("ERROR: LibreOffice が見つかりません")
    sys.exit(1)


def pptx_to_images(pptx_path: Path, temp_dir: Path):
    """PPTX → PDF → PNG"""
    print("[変換] PPTX → PDF ...")
    soffice = find_soffice()
    subprocess.run([
        soffice, "--headless", "--convert-to", "pdf",
        "--outdir", str(temp_dir), str(pptx_path)
    ], check=True, capture_output=True)

    pdf_files = list(temp_dir.glob("*.pdf"))
    if not pdf_files:
        print("ERROR: PDF変換に失敗")
        sys.exit(1)
    pdf_path = pdf_files[0]

    print("[変換] PDF → PNG ...")
    subprocess.run([
        "pdftoppm", "-png", "-r", "300", str(pdf_path),
        str(temp_dir / "slide")
    ], check=True)

    images = sorted(temp_dir.glob("slide-*.png"))
    print(f"  [画像] {len(images)}枚のスライド画像を生成")
    return images


async def generate_audio(slide_num, text, output_path):
    """edge-ttsで音声生成"""
    import edge_tts
    communicate = edge_tts.Communicate(text, VOICE, rate=RATE)
    await communicate.save(str(output_path))
    print(f"  [音声] スライド{slide_num}: {output_path.name}")


def create_video(images, audio_dir, output_path):
    """画像 + 音声 → MP4"""
    print("[動画] 結合中 ...")
    parts = []
    concat_list = audio_dir / "concat.txt"

    for i, img_path in enumerate(images):
        slide_num = i + 1
        audio_path = audio_dir / f"slide_{slide_num:02d}.mp3"
        part_path = audio_dir / f"part_{slide_num:02d}.mp4"

        if not audio_path.exists():
            print(f"  WARNING: スライド{slide_num}の音声なし、スキップ")
            continue

        result = subprocess.run([
            "ffprobe", "-v", "error", "-show_entries", "format=duration",
            "-of", "json", str(audio_path)
        ], capture_output=True, text=True)
        duration = float(json.loads(result.stdout)["format"]["duration"])
        total_duration = duration + 1.0

        subprocess.run([
            "ffmpeg", "-y",
            "-loop", "1", "-i", str(img_path),
            "-i", str(audio_path),
            "-c:v", "libx264", "-tune", "stillimage",
            "-c:a", "aac", "-b:a", "192k",
            "-pix_fmt", "yuv420p",
            "-vf", "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2",
            "-t", str(total_duration),
            "-af", "adelay=500|500,apad=pad_dur=0.5",
            str(part_path)
        ], check=True, capture_output=True)

        parts.append(part_path)
        print(f"  [パーツ] スライド{slide_num}: {total_duration:.1f}秒")

    with open(concat_list, "w") as f:
        for part in parts:
            f.write(f"file '{part}'\n")

    subprocess.run([
        "ffmpeg", "-y",
        "-f", "concat", "-safe", "0", "-i", str(concat_list),
        "-c", "copy", str(output_path)
    ], check=True, capture_output=True)

    result = subprocess.run([
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "json", str(output_path)
    ], capture_output=True, text=True)
    total = float(json.loads(result.stdout)["format"]["duration"])
    print(f"\n[完成] {output_path}")
    print(f"  総尺: {int(total // 60)}分{int(total % 60)}秒")


async def main():
    if len(sys.argv) < 3:
        print("Usage: python3 video-generator.py <コースフォルダ> <ナレーションJSON>")
        sys.exit(1)

    course_dir = Path(sys.argv[1])
    narration_path = Path(sys.argv[2])

    pptx_file = course_dir / "スライド.pptx"
    output_video = course_dir / "動画.mp4"
    temp_dir = course_dir / "_temp_video"
    preview_dir = course_dir / "スライド画像"

    if not pptx_file.exists():
        print(f"ERROR: {pptx_file} が見つかりません")
        sys.exit(1)

    with open(narration_path, "r") as f:
        narrations = json.load(f)

    # 一時ディレクトリ
    temp_dir.mkdir(exist_ok=True)
    audio_dir = temp_dir / "audio"
    audio_dir.mkdir(exist_ok=True)

    # Step 1: スライド → 画像
    images = pptx_to_images(pptx_file, temp_dir)

    # プレビュー用コピー
    preview_dir.mkdir(exist_ok=True)
    for img in images:
        num = img.stem.split("-")[-1].lstrip("0") or "0"
        shutil.copy2(img, preview_dir / f"スライド{num}.png")
    print(f"  [プレビュー] {preview_dir}")

    # Step 2: 音声生成
    print("\n[音声生成] edge-tts ...")
    tasks = []
    for slide_num_str, text in narrations.items():
        slide_num = int(slide_num_str)
        audio_path = audio_dir / f"slide_{slide_num:02d}.mp3"
        tasks.append(generate_audio(slide_num, text, audio_path))
    await asyncio.gather(*tasks)

    # Step 3: 動画生成
    print("\n[動画生成] ffmpeg ...")
    create_video(images, audio_dir, output_video)

    print(f"\n=== 完了 ===")
    print(f"動画: {output_video}")
    print(f"プレビュー: {preview_dir}")


if __name__ == "__main__":
    asyncio.run(main())
