#!/usr/bin/env python3
"""
P-04 動画生成スクリプト
スライド画像 + ナレーション音声 → MP4動画

使い方:
  python3 generate-video.py
"""

import json
import subprocess
import sys
import asyncio
from pathlib import Path
import tempfile
import os

VOICE = "ja-JP-NanamiNeural"
RATE = "+5%"

async def generate_audio_edge_tts(text: str, output_path: Path):
    """edge-ttsで音声を生成"""
    try:
        import edge_tts
        communicate = edge_tts.Communicate(text, VOICE, rate=RATE)
        await communicate.save(str(output_path))
        return True
    except Exception as e:
        print(f"⚠️  edge-tts エラー: {e}")
        return False


def get_duration(media_path: Path) -> float:
    """FFprobeでメディアの長さを取得"""
    try:
        result = subprocess.run([
            "ffprobe", "-v", "error",
            "-show_entries", "format=duration",
            "-of", "json", str(media_path)
        ], capture_output=True, text=True, timeout=30)
        data = json.loads(result.stdout)
        return float(data.get("format", {}).get("duration", 0))
    except Exception as e:
        print(f"⚠️  Duration取得エラー: {e}")
        return 5.0  # デフォルト5秒


def create_slide_video(image_path: Path, audio_path: Path, output_path: Path) -> float:
    """スライド画像 + 音声 → MP4パーツ"""
    if not image_path.exists():
        print(f"❌ 画像未検出: {image_path}")
        return 5.0

    if not audio_path.exists():
        print(f"❌ 音声ファイル未検出: {audio_path}")
        return 5.0

    duration = get_duration(audio_path) + 0.5  # 音声終了後0.5秒

    cmd = [
        "ffmpeg", "-y",
        "-loop", "1", "-i", str(image_path),
        "-i", str(audio_path),
        "-c:v", "libx264", "-tune", "stillimage",
        "-c:a", "aac", "-b:a", "192k",
        "-pix_fmt", "yuv420p",
        "-vf", "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2",
        "-t", str(duration),
        str(output_path)
    ]

    try:
        subprocess.run(cmd, check=True, capture_output=True, timeout=120)
        return duration
    except Exception as e:
        print(f"❌ スライド動画生成エラー: {e}")
        return duration


def concat_videos(video_parts: list, output_path: Path):
    """複数の動画ファイルを結合"""
    if not video_parts:
        print("❌ 結合する動画ファイルがありません")
        return False

    # concat demuxer用テキストファイル作成
    with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False) as f:
        for video in video_parts:
            f.write(f"file '{video}'\n")
        concat_file = f.name

    try:
        cmd = [
            "ffmpeg", "-y",
            "-f", "concat", "-safe", "0",
            "-i", concat_file,
            "-c", "copy",
            "-y", str(output_path)
        ]
        subprocess.run(cmd, check=True, capture_output=True, timeout=300)
        return True
    except Exception as e:
        print(f"❌ 動画結合エラー: {e}")
        return False
    finally:
        os.unlink(concat_file)


def main():
    """メイン処理"""
    script_dir = Path(__file__).parent

    # パスの設定
    narrations_json = script_dir / "narrations.json"
    slides_dir = script_dir / "スライド画像"
    output_video = script_dir / "動画.mp4"

    # 設定読み込み
    if not narrations_json.exists():
        print(f"❌ narrations.json未検出: {narrations_json}")
        return False

    with open(narrations_json, encoding='utf-8') as f:
        narrations = json.load(f)

    print(f"✅ {len(narrations['slides'])} スライド分のナレーション読み込み完了")

    # スライド画像ディレクトリを確認（存在しない場合は後で作成）
    if not slides_dir.exists():
        print(f"⚠️  スライド画像ディレクトリ未検出。後でスライド画像を配置してください: {slides_dir}")
        slides_dir.mkdir(parents=True, exist_ok=True)

    # ナレーション音声を生成し、スライド動画を作成
    with tempfile.TemporaryDirectory() as tmpdir:
        tmpdir_path = Path(tmpdir)
        video_parts = []
        total_duration = 0

        # 各スライドのナレーション音声を生成
        print("\n📝 ナレーション音声を生成中...")
        for idx, slide in enumerate(narrations['slides'], 1):
            slide_num = slide['slide_num']
            narration_text = slide['narration']

            # 音声ファイル出力
            audio_file = tmpdir_path / f"narration_{idx:02d}.mp3"

            print(f"  [{idx}/{len(narrations['slides'])}] スライド {slide_num} - ", end='', flush=True)

            # edge-ttsで音声生成
            try:
                asyncio.run(generate_audio_edge_tts(narration_text, audio_file))
                audio_duration = get_duration(audio_file)
                print(f"✅ ({audio_duration:.1f}秒)")
            except Exception as e:
                print(f"⚠️  {e}")
                # ダミー音声を作成（5秒のサイレンス）
                subprocess.run([
                    "ffmpeg", "-y", "-f", "lavfi",
                    "-i", "anullsrc=r=44100:cl=mono",
                    "-t", "5",
                    str(audio_file)
                ], capture_output=True, check=True)
                audio_duration = 5.0

            # スライド動画を作成
            slide_image = slides_dir / f"slide_{slide_num:02d}.png"
            if not slide_image.exists():
                # プレースホルダー画像を作成
                print(f"    ⚠️  スライド画像未検出: {slide_image}")
                print(f"    → プレースホルダー画像を作成します")

                # FFmpegで白い画像を作成
                subprocess.run([
                    "ffmpeg", "-y",
                    "-f", "lavfi", "-i", "color=white:s=1920x1080",
                    "-frames:v", "1", str(slide_image)
                ], capture_output=True, check=True)

            # スライド + 音声 → 動画パーツ
            video_part = tmpdir_path / f"part_{idx:02d}.mp4"
            duration = create_slide_video(slide_image, audio_file, video_part)
            video_parts.append(str(video_part))
            total_duration += duration

        # 動画パーツを結合
        print(f"\n🎬 動画を結合中 (合計 {total_duration:.1f}秒)...")
        if len(video_parts) == 1:
            # 1つの場合はコピー
            subprocess.run(["cp", video_parts[0], str(output_video)], check=True)
        else:
            concat_videos(video_parts, output_video)

        if output_video.exists():
            file_size = output_video.stat().st_size / (1024 * 1024)
            print(f"\n✅ 動画生成成功！")
            print(f"   出力: {output_video}")
            print(f"   サイズ: {file_size:.1f} MB")
            print(f"   尺: {total_duration:.0f}秒")
            return True
        else:
            print(f"\n❌ 動画生成失敗")
            return False


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
