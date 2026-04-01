#!/usr/bin/env python3
"""
P-02 実演付き動画ビルドスクリプト

構成:
  スライド1〜4 → スライド画像+ナレーション
  スライド5   → 実演録画(basic-search.webm) + ナレーション5をオーバーレイ
  スライド6〜7 → スライド画像+ナレーション
  スライド8   → 実演録画(followup.webm) + ナレーション8をオーバーレイ
  スライド9〜12 → スライド画像+ナレーション
"""

import asyncio
import json
import subprocess
import sys
from pathlib import Path

VOICE = "ja-JP-NanamiNeural"
RATE = "+5%"

BASE = Path("/Users/kurosakiyuto/Downloads/開発/gorilla-knowledge/黒崎/AI研修一覧")
P02 = BASE / "P-02_Perplexityの基本操作"
PIPELINE = BASE / "_pipeline"
SLIDES_DIR = P02 / "スライド画像"
RECORDINGS = PIPELINE / "recordings" / "p02"
TEMP = P02 / "_build_temp"
OUTPUT = P02 / "動画.mp4"


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
    """実演録画 + ナレーション音声 → 動画パーツ（録画にナレーションをオーバーレイ）"""
    rec_dur = get_duration(recording)
    audio_dur = get_duration(audio)

    # 録画が音声より短い場合は録画を引き伸ばす、長い場合は録画に合わせる
    final_dur = max(rec_dur, audio_dur + 1.0)

    # Step1: 録画をMP4に変換+解像度統一
    normalized = out.parent / f"{out.stem}_norm.mp4"
    subprocess.run([
        "ffmpeg", "-y",
        "-i", str(recording),
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-vf", "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2",
        "-an",
        "-t", str(final_dur),
        str(normalized)
    ], check=True, capture_output=True)

    # Step2: ナレーション音声をオーバーレイ
    subprocess.run([
        "ffmpeg", "-y",
        "-i", str(normalized),
        "-i", str(audio),
        "-c:v", "copy",
        "-c:a", "aac", "-b:a", "192k",
        "-af", "adelay=1000|1000,apad=pad_dur=0.5",
        "-shortest",
        str(out)
    ], check=True, capture_output=True)

    # 音声がない部分は無音にするため、再度最終尺に合わせる
    # 録画が長い場合は録画全体を使いたいので、shortestではなく録画尺に合わせる
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

    # 最終ファイルをリネーム
    final.rename(out)
    normalized.unlink(missing_ok=True)

    return final_dur


async def main():
    TEMP.mkdir(parents=True, exist_ok=True)
    audio_dir = TEMP / "audio"
    audio_dir.mkdir(exist_ok=True)

    # ナレーション読み込み
    with open(P02 / "narrations.json") as f:
        narrations = json.load(f)

    # 1. 全12スライドの音声を生成
    print("[音声生成] 全12スライド分...")
    tasks = []
    for num_str, text in narrations.items():
        num = int(num_str)
        audio_path = audio_dir / f"slide_{num:02d}.mp3"
        tasks.append(generate_audio(text, audio_path))
    await asyncio.gather(*tasks)
    print(f"  完了: {len(tasks)}件")

    # 2. スライド画像のソート
    slide_images = {}
    for img in SLIDES_DIR.glob("*.png"):
        # "スライド1.png" → 1
        num = int(img.stem.replace("スライド", ""))
        slide_images[num] = img

    # 3. パーツ生成
    parts = []
    demo_config = {
        5: RECORDINGS / "basic-search.webm",   # スライド5 = 実演（基本検索）
        8: RECORDINGS / "followup.webm",        # スライド8 = 実演（フォローアップ）
    }

    for slide_num in range(1, 13):
        audio_path = audio_dir / f"slide_{slide_num:02d}.mp3"
        part_path = TEMP / f"part_{slide_num:02d}.mp4"

        if slide_num in demo_config:
            # 実演パート: 録画 + ナレーションオーバーレイ
            recording = demo_config[slide_num]
            print(f"[Part {slide_num}] 実演録画 + ナレーション: {recording.name}")
            dur = make_demo_part(recording, audio_path, part_path)
        else:
            # スライドパート: 画像 + ナレーション
            img = slide_images.get(slide_num)
            if not img:
                print(f"  WARNING: スライド{slide_num}の画像なし、スキップ")
                continue
            print(f"[Part {slide_num}] スライド画像 + ナレーション")
            dur = make_slide_part(img, audio_path, part_path)

        parts.append(part_path)
        print(f"  → {dur:.1f}秒")

    # 4. 全パーツ結合
    print(f"\n[結合] {len(parts)}パーツを結合...")
    concat_file = TEMP / "concat.txt"
    with open(concat_file, "w") as f:
        for p in parts:
            f.write(f"file '{p.name}'\n")

    subprocess.run([
        "ffmpeg", "-y",
        "-f", "concat", "-safe", "0",
        "-i", str(concat_file),
        "-c", "copy",
        str(OUTPUT)
    ], check=True, capture_output=True, cwd=str(TEMP))

    total = get_duration(OUTPUT)
    print(f"\n{'='*50}")
    print(f"[完成] {OUTPUT}")
    print(f"  総尺: {int(total // 60)}分{int(total % 60)}秒")
    print(f"  スライドパート: 10枚")
    print(f"  実演パート: 2本（スライド5, スライド8）")
    print(f"{'='*50}")

    # 一時ファイル削除
    import shutil
    shutil.rmtree(TEMP, ignore_errors=True)


if __name__ == "__main__":
    asyncio.run(main())
