#!/usr/bin/env python3
"""
実演付き動画ビルドスクリプト（汎用版）

スライド画像 + ナレーション + 実演録画 → 1本の動画を合成する。
実演スライドでは録画にナレーションをオーバーレイする。

使い方:
  python3 build-with-demo.py \
    --course-dir <講座ディレクトリ> \
    --narrations <narrations.json> \
    --demo-slides "5=recordings/basic-search.webm,8=recordings/followup.webm"

引数:
  --course-dir    講座ディレクトリ（スライド画像/ が入っている場所）
  --narrations    narrations.json のパス（省略時はcourse-dir内を探す）
  --demo-slides   実演スライドの指定（"スライド番号=録画ファイルパス" をカンマ区切り）
  --output        出力ファイルパス（省略時は course-dir/動画.mp4）
"""

import argparse
import asyncio
import json
import shutil
import subprocess
import sys
from pathlib import Path

VOICE = "ja-JP-NanamiNeural"
RATE = "+5%"


def get_duration(path: Path) -> float:
    result = subprocess.run([
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "json", str(path)
    ], capture_output=True, text=True)
    return float(json.loads(result.stdout)["format"]["duration"])


async def generate_audio(text: str, output_path: Path):
    import edge_tts
    communicate = edge_tts.Communicate(text, VOICE, rate=RATE)
    await communicate.save(str(output_path))


def make_slide_part(img: Path, audio: Path, out: Path) -> float:
    """スライド画像 + 音声 → 動画パーツ"""
    dur = get_duration(audio) + 1.0
    subprocess.run([
        "ffmpeg", "-y",
        "-loop", "1", "-i", str(img),
        "-i", str(audio),
        "-c:v", "libx264", "-tune", "stillimage",
        "-c:a", "aac", "-b:a", "192k",
        "-pix_fmt", "yuv420p",
        "-vf", "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2",
        "-t", str(dur),
        "-af", "adelay=500|500,apad=pad_dur=0.5",
        str(out)
    ], check=True, capture_output=True)
    return dur


def make_demo_part(recording: Path, audio: Path, out: Path) -> float:
    """実演録画 + ナレーション音声 → 動画パーツ"""
    rec_dur = get_duration(recording)
    audio_dur = get_duration(audio)
    final_dur = max(rec_dur, audio_dur + 1.0)

    # 録画をMP4に変換+解像度統一
    normalized = out.parent / f"{out.stem}_norm.mp4"
    subprocess.run([
        "ffmpeg", "-y",
        "-i", str(recording),
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-vf", "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2",
        "-an", "-t", str(final_dur),
        str(normalized)
    ], check=True, capture_output=True)

    # ナレーション音声をオーバーレイ（1秒遅延で開始）
    final = out.parent / f"{out.stem}_final.mp4"
    subprocess.run([
        "ffmpeg", "-y",
        "-i", str(normalized),
        "-i", str(audio),
        "-filter_complex",
        f"[1:a]adelay=1000|1000,apad=pad_dur={final_dur}[a]",
        "-map", "0:v", "-map", "[a]",
        "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
        "-t", str(final_dur),
        str(final)
    ], check=True, capture_output=True)

    final.rename(out)
    normalized.unlink(missing_ok=True)
    return final_dur


def parse_demo_slides(demo_str: str) -> dict[int, Path]:
    """"5=path/to/file.webm,8=path/to/file2.webm" → {5: Path, 8: Path}"""
    if not demo_str:
        return {}
    result = {}
    for pair in demo_str.split(","):
        num_str, path_str = pair.strip().split("=", 1)
        result[int(num_str)] = Path(path_str)
    return result


async def main():
    parser = argparse.ArgumentParser(description="実演付き動画ビルド（汎用版）")
    parser.add_argument("--course-dir", required=True, help="講座ディレクトリ")
    parser.add_argument("--narrations", help="narrations.json パス")
    parser.add_argument("--demo-slides", default="", help="実演スライド指定 '5=file.webm,8=file2.webm'")
    parser.add_argument("--output", help="出力ファイルパス")
    args = parser.parse_args()

    course_dir = Path(args.course_dir).resolve()
    slides_dir = course_dir / "スライド画像"
    narrations_path = Path(args.narrations) if args.narrations else course_dir / "narrations.json"
    output_path = Path(args.output) if args.output else course_dir / "動画.mp4"
    demo_config = parse_demo_slides(args.demo_slides)

    temp = course_dir / "_build_temp"
    temp.mkdir(parents=True, exist_ok=True)
    audio_dir = temp / "audio"
    audio_dir.mkdir(exist_ok=True)

    # ナレーション読み込み
    with open(narrations_path) as f:
        narrations = json.load(f)

    total_slides = len(narrations)
    print(f"[設定] 講座: {course_dir.name}")
    print(f"[設定] スライド: {total_slides}枚")
    print(f"[設定] 実演: {list(demo_config.keys()) if demo_config else 'なし'}")

    # 1. 全スライドの音声を生成
    print(f"\n[音声生成] {total_slides}スライド分...")
    tasks = []
    for num_str, text in narrations.items():
        num = int(num_str)
        audio_path = audio_dir / f"slide_{num:02d}.mp3"
        tasks.append(generate_audio(text, audio_path))
    await asyncio.gather(*tasks)
    print(f"  完了: {len(tasks)}件")

    # 2. スライド画像マッピング
    slide_images = {}
    for img in slides_dir.glob("*.png"):
        name = img.stem.replace("スライド", "").replace("slide-", "").lstrip("0") or "0"
        slide_images[int(name)] = img

    # 3. パーツ生成
    parts = []
    for slide_num in range(1, total_slides + 1):
        audio_path = audio_dir / f"slide_{slide_num:02d}.mp3"
        part_path = temp / f"part_{slide_num:02d}.mp4"

        if not audio_path.exists():
            print(f"  WARNING: スライド{slide_num}の音声なし、スキップ")
            continue

        if slide_num in demo_config:
            recording = demo_config[slide_num]
            if not recording.exists():
                print(f"  ERROR: 録画ファイルが見つかりません: {recording}")
                sys.exit(1)
            print(f"[Part {slide_num}] ★ 実演録画 + ナレーション: {recording.name}")
            dur = make_demo_part(recording, audio_path, part_path)
        else:
            img = slide_images.get(slide_num)
            if not img:
                print(f"  WARNING: スライド{slide_num}の画像なし、スキップ")
                continue
            print(f"[Part {slide_num}] スライド + ナレーション")
            dur = make_slide_part(img, audio_path, part_path)

        parts.append(part_path)
        print(f"  → {dur:.1f}秒")

    # 4. 全パーツ結合
    print(f"\n[結合] {len(parts)}パーツ...")
    concat_file = temp / "concat.txt"
    with open(concat_file, "w") as f:
        for p in parts:
            f.write(f"file '{p.name}'\n")

    subprocess.run([
        "ffmpeg", "-y",
        "-f", "concat", "-safe", "0",
        "-i", str(concat_file),
        "-c", "copy",
        str(output_path)
    ], check=True, capture_output=True, cwd=str(temp))

    total = get_duration(output_path)
    demo_count = sum(1 for s in range(1, total_slides + 1) if s in demo_config)
    slide_count = total_slides - demo_count

    print(f"\n{'='*50}")
    print(f"[完成] {output_path}")
    print(f"  総尺: {int(total // 60)}分{int(total % 60)}秒")
    print(f"  スライドパート: {slide_count}枚")
    print(f"  実演パート: {demo_count}本 {list(demo_config.keys())}")
    print(f"{'='*50}")

    # 一時ファイル削除
    shutil.rmtree(temp, ignore_errors=True)


if __name__ == "__main__":
    asyncio.run(main())
