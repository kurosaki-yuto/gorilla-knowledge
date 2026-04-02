#!/usr/bin/env python3
"""
P-04 動画生成スクリプト（シンプル版）
スライド画像 → MP4動画（ナレーション同期なし）

使い方:
  python3 generate-video-simple.py
"""

import json
import subprocess
import sys
from pathlib import Path
import tempfile

def get_duration(media_path: Path) -> float:
    """FFprobeでメディアの長さを取得"""
    try:
        result = subprocess.run([
            "ffprobe", "-v", "error",
            "-show_entries", "format=duration",
            "-of", "json", str(media_path)
        ], capture_output=True, text=True, timeout=30)
        data = json.loads(result.stdout)
        return float(data.get("format", {}).get("duration", 5))
    except:
        return 5.0


def create_slide_video(image_path: Path, duration: float, output_path: Path) -> bool:
    """スライド画像 → MP4パーツ（固定尺）"""
    if not image_path.exists():
        print(f"❌ 画像未検出: {image_path}")
        return False

    cmd = [
        "ffmpeg", "-y",
        "-loop", "1", "-i", str(image_path),
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-vf", "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2",
        "-t", str(duration),
        str(output_path)
    ]

    try:
        subprocess.run(cmd, check=True, capture_output=True, timeout=60)
        return True
    except Exception as e:
        print(f"❌ スライド動画生成エラー: {e}")
        return False


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
            str(output_path)
        ]
        subprocess.run(cmd, check=True, capture_output=True, timeout=300)
        return True
    except Exception as e:
        print(f"❌ 動画結合エラー: {e}")
        return False
    finally:
        import os
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

    # スライド画像ディレクトリを確認
    if not slides_dir.exists():
        print(f"❌ スライド画像ディレクトリ未検出: {slides_dir}")
        return False

    # 各スライド画像から動画パーツを作成
    with tempfile.TemporaryDirectory() as tmpdir:
        tmpdir_path = Path(tmpdir)
        video_parts = []
        total_duration = 0

        print("\n🎥 スライド動画を生成中...")
        for idx, slide in enumerate(narrations['slides'], 1):
            slide_num = slide['slide_num']
            narration_duration = slide.get('duration_seconds', 60)

            slide_image = slides_dir / f"slide_{slide_num:02d}.png"
            if not slide_image.exists():
                print(f"  [{idx}/{len(narrations['slides'])}] スライド {slide_num} - ❌ 画像未検出")
                continue

            # スライド動画を作成
            video_part = tmpdir_path / f"part_{idx:02d}.mp4"
            print(f"  [{idx}/{len(narrations['slides'])}] スライド {slide_num} - ", end='', flush=True)

            if create_slide_video(slide_image, narration_duration, video_part):
                video_parts.append(str(video_part))
                total_duration += narration_duration
                print(f"✅ ({narration_duration}秒)")
            else:
                print("❌")

        if not video_parts:
            print("❌ スライド動画を作成できませんでした")
            return False

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
