#!/usr/bin/env python3
"""
動画結合スクリプト

スライド動画 + 操作録画 + ナレーション音声を結合して完成動画を作る。

使い方:
  # パート動画の合成（スライド + 録画 + ナレーション）
  python3 compose-video.py \
    --slides-dir <スライド画像ディレクトリ> \
    --recording <操作録画.webm> \
    --narrations <narrations.json> \
    --output <出力.mp4>

  # 複数パートの結合
  python3 compose-video.py \
    --parts part1.mp4 part2.mp4 part3.mp4 \
    --output <出力.mp4>

必要ツール:
  - ffmpeg
  - edge-tts
"""

import argparse
import asyncio
import json
import subprocess
import sys
from pathlib import Path


VOICE = "ja-JP-NanamiNeural"
RATE = "+5%"


async def generate_audio(text: str, output_path: Path):
    """edge-ttsで音声生成"""
    import edge_tts
    communicate = edge_tts.Communicate(text, VOICE, rate=RATE)
    await communicate.save(str(output_path))


def get_duration(path: Path) -> float:
    """メディアファイルの長さを取得"""
    result = subprocess.run([
        "ffprobe", "-v", "error",
        "-show_entries", "format=duration",
        "-of", "json", str(path)
    ], capture_output=True, text=True)
    return float(json.loads(result.stdout)["format"]["duration"])


def create_slide_video(image_path: Path, audio_path: Path, output_path: Path):
    """スライド画像 + 音声 → 動画パーツ"""
    duration = get_duration(audio_path) + 1.0  # 余白1秒

    subprocess.run([
        "ffmpeg", "-y",
        "-loop", "1", "-i", str(image_path),
        "-i", str(audio_path),
        "-c:v", "libx264", "-tune", "stillimage",
        "-c:a", "aac", "-b:a", "192k",
        "-pix_fmt", "yuv420p",
        "-vf", "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2",
        "-t", str(duration),
        "-af", "adelay=500|500,apad=pad_dur=0.5",
        str(output_path)
    ], check=True, capture_output=True)

    return duration


def normalize_recording(recording_path: Path, output_path: Path):
    """操作録画を標準フォーマットに変換（webm → mp4, 解像度統一）"""
    subprocess.run([
        "ffmpeg", "-y",
        "-i", str(recording_path),
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-vf", "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2",
        "-an",  # 録画の音声は不要
        str(output_path)
    ], check=True, capture_output=True)


def concat_videos(video_paths: list[Path], output_path: Path, fade: bool = True):
    """複数動画を結合（オプションでフェードトランジション）"""
    if not fade or len(video_paths) == 1:
        # シンプル結合
        concat_file = output_path.parent / "_concat_list.txt"
        with open(concat_file, "w") as f:
            for vp in video_paths:
                f.write(f"file '{vp}'\n")

        subprocess.run([
            "ffmpeg", "-y",
            "-f", "concat", "-safe", "0",
            "-i", str(concat_file),
            "-c", "copy",
            str(output_path)
        ], check=True, capture_output=True)

        concat_file.unlink()
    else:
        # xfadeトランジション付き結合
        # 2つずつ順番に結合
        current = video_paths[0]
        for i in range(1, len(video_paths)):
            next_video = video_paths[i]
            temp_out = output_path.parent / f"_xfade_temp_{i}.mp4"

            duration = get_duration(current)
            offset = max(0, duration - 1.0)  # 1秒のフェード

            subprocess.run([
                "ffmpeg", "-y",
                "-i", str(current),
                "-i", str(next_video),
                "-filter_complex",
                f"[0:v][1:v]xfade=transition=fade:duration=1:offset={offset}[v];"
                f"[0:a][1:a]acrossfade=d=1[a]",
                "-map", "[v]", "-map", "[a]",
                "-c:v", "libx264", "-c:a", "aac",
                str(temp_out)
            ], check=True, capture_output=True)

            # 前の一時ファイルを削除
            if i > 1:
                prev_temp = output_path.parent / f"_xfade_temp_{i-1}.mp4"
                prev_temp.unlink(missing_ok=True)

            current = temp_out

        # 最終出力にリネーム
        current.rename(output_path)


async def compose_part(
    slides_dir: Path,
    recording_path: Path | None,
    narrations: dict,
    output_path: Path,
):
    """パート動画を合成: スライド動画群 + 操作録画 → パート動画"""
    temp_dir = output_path.parent / "_temp_compose"
    temp_dir.mkdir(parents=True, exist_ok=True)
    audio_dir = temp_dir / "audio"
    audio_dir.mkdir(exist_ok=True)

    slide_images = sorted(slides_dir.glob("*.png"))
    if not slide_images:
        print(f"ERROR: スライド画像が見つかりません: {slides_dir}")
        sys.exit(1)

    print(f"[合成] スライド: {len(slide_images)}枚")

    # 1. ナレーション音声を生成
    print("[音声生成] edge-tts ...")
    audio_tasks = []
    for slide_num_str, text in narrations.items():
        slide_num = int(slide_num_str)
        audio_path = audio_dir / f"slide_{slide_num:02d}.mp3"
        audio_tasks.append(generate_audio(text, audio_path))
    await asyncio.gather(*audio_tasks)
    print(f"  {len(audio_tasks)}件の音声を生成")

    # 2. スライド動画パーツを生成
    print("[動画] スライドパーツ生成 ...")
    parts = []
    for i, img_path in enumerate(slide_images):
        slide_num = i + 1
        audio_path = audio_dir / f"slide_{slide_num:02d}.mp3"
        part_path = temp_dir / f"slide_{slide_num:02d}.mp4"

        if not audio_path.exists():
            print(f"  WARNING: スライド{slide_num}の音声なし、スキップ")
            continue

        duration = create_slide_video(img_path, audio_path, part_path)
        parts.append(part_path)
        print(f"  スライド{slide_num}: {duration:.1f}秒")

    # 3. 操作録画があれば追加
    if recording_path and recording_path.exists():
        print(f"[録画] 操作録画を追加: {recording_path}")
        normalized = temp_dir / "recording_normalized.mp4"
        normalize_recording(recording_path, normalized)

        rec_duration = get_duration(normalized)
        print(f"  録画長: {rec_duration:.1f}秒")

        # 録画に無音音声を追加
        with_audio = temp_dir / "recording_with_audio.mp4"
        subprocess.run([
            "ffmpeg", "-y",
            "-i", str(normalized),
            "-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo",
            "-c:v", "copy", "-c:a", "aac", "-shortest",
            str(with_audio)
        ], check=True, capture_output=True)

        parts.append(with_audio)

    # 4. 全パーツ結合
    print("[結合] 全パーツを結合 ...")
    concat_videos(parts, output_path, fade=True)

    total_duration = get_duration(output_path)
    print(f"\n[完成] {output_path}")
    print(f"  総尺: {int(total_duration // 60)}分{int(total_duration % 60)}秒")

    # 一時ファイル削除
    import shutil
    shutil.rmtree(temp_dir, ignore_errors=True)


def concat_parts_mode(part_paths: list[Path], output_path: Path):
    """複数パート動画を結合"""
    print(f"[結合] {len(part_paths)}パートを結合")
    for p in part_paths:
        if not p.exists():
            print(f"ERROR: {p} が見つかりません")
            sys.exit(1)
        d = get_duration(p)
        print(f"  {p.name}: {int(d // 60)}分{int(d % 60)}秒")

    concat_videos(part_paths, output_path, fade=True)
    total = get_duration(output_path)
    print(f"\n[完成] {output_path}")
    print(f"  総尺: {int(total // 60)}分{int(total % 60)}秒")


def main():
    parser = argparse.ArgumentParser(description="動画結合スクリプト")

    # パート合成モード
    parser.add_argument("--slides-dir", help="スライド画像ディレクトリ")
    parser.add_argument("--recording", help="操作録画ファイル（省略可）")
    parser.add_argument("--narrations", help="ナレーションJSONファイル")

    # パート結合モード
    parser.add_argument("--parts", nargs="+", help="結合するパート動画ファイル群")

    # 共通
    parser.add_argument("--output", required=True, help="出力ファイルパス")

    args = parser.parse_args()

    if args.parts:
        # パート結合モード
        concat_parts_mode(
            [Path(p) for p in args.parts],
            Path(args.output)
        )
    elif args.slides_dir and args.narrations:
        # パート合成モード
        with open(args.narrations, "r") as f:
            narrations = json.load(f)
        asyncio.run(compose_part(
            slides_dir=Path(args.slides_dir),
            recording_path=Path(args.recording) if args.recording else None,
            narrations=narrations,
            output_path=Path(args.output),
        ))
    else:
        parser.print_help()
        sys.exit(1)


if __name__ == "__main__":
    main()
