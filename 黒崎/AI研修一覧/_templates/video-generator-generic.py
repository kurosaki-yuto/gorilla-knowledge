#!/usr/bin/env python3
"""
汎用 動画生成スクリプト
スライド画像 + AI音声ナレーション → MP4動画

Usage:
  python3 video-generator-generic.py <course_dir>

必要ツール:
  - edge-tts ... テキスト → 音声
  - ffmpeg / ffprobe ... 画像 + 音声 → 動画
"""

import asyncio
import json
import os
import subprocess
import sys
from pathlib import Path

VOICE = "ja-JP-NanamiNeural"
RATE = "+5%"


async def generate_audio(slide_num, text, output_path):
    """edge-ttsで音声生成"""
    import edge_tts
    communicate = edge_tts.Communicate(text, VOICE, rate=RATE)
    await communicate.save(str(output_path))
    print(f"  [音声] スライド{slide_num}: OK")


def create_video(images, audio_dir, output_path):
    """画像 + 音声 → MP4動画"""
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
    if len(sys.argv) < 2:
        print("Usage: python3 video-generator-generic.py <course_dir>")
        sys.exit(1)

    base_dir = Path(sys.argv[1]).resolve()
    narrations_file = base_dir / "narrations.json"
    slide_dir = base_dir / "スライド画像"
    output_video = base_dir / "動画.mp4"
    temp_dir = base_dir / "_temp_video"

    if not narrations_file.exists():
        print(f"ERROR: {narrations_file} が見つかりません")
        sys.exit(1)

    with open(narrations_file, "r") as f:
        narrations = json.load(f)

    # スライド画像を取得（番号順）
    images = []
    for i in range(1, 20):
        img = slide_dir / f"スライド{i}.png"
        if img.exists():
            images.append(img)

    if not images:
        print(f"ERROR: スライド画像が見つかりません: {slide_dir}")
        sys.exit(1)

    print(f"\n=== {base_dir.name} ===")
    print(f"スライド: {len(images)}枚, ナレーション: {len(narrations)}件")

    # 音声生成
    temp_dir.mkdir(exist_ok=True)
    audio_dir = temp_dir / "audio"
    audio_dir.mkdir(exist_ok=True)

    print("\n[音声生成] edge-tts ...")
    tasks = []
    for slide_num_str, text in narrations.items():
        slide_num = int(slide_num_str)
        audio_path = audio_dir / f"slide_{slide_num:02d}.mp3"
        tasks.append(generate_audio(slide_num, text, audio_path))
    await asyncio.gather(*tasks)

    # 動画生成
    print("\n[動画生成] ffmpeg ...")
    create_video(images, audio_dir, output_video)
    print("\n=== 完了 ===")


if __name__ == "__main__":
    asyncio.run(main())
