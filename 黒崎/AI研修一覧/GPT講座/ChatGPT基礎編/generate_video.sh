#!/bin/bash
# ChatGPT基礎編 動画生成スクリプト
# スライド画像 + edge-tts音声 + Loom実践動画 → MP4動画

set -e
cd "$(dirname "$0")"

AUDIO_DIR="audio"
SLIDE_DIR="スライド画像"
LOOM_VIDEO="loom_demo.mp4"
OUTPUT="動画.mp4"

CONCAT_FILE=$(mktemp /tmp/concat_XXXXXX.txt)
TEMP_DIR=$(mktemp -d /tmp/slides_XXXXXX)

echo "═══════════════════════════════════════"
echo "  Step 1: スライド動画セグメント作成"
echo "═══════════════════════════════════════"

for i in $(seq 1 21); do
  padded=$(printf "%02d" "$i")
  slideImg="$SLIDE_DIR/slide-${padded}.png"
  audioFile="$AUDIO_DIR/slide_${padded}.mp3"
  segFile="$TEMP_DIR/seg_${padded}.mp4"

  if [ ! -f "$slideImg" ]; then
    echo "  [warn] Missing: $slideImg"
    continue
  fi
  if [ ! -f "$audioFile" ]; then
    echo "  [warn] Missing: $audioFile"
    continue
  fi

  # Get audio duration
  duration=$(ffprobe -v quiet -show_entries format=duration -of csv=p=0 "$audioFile")
  # Add 1 second padding
  total_duration=$(echo "$duration + 1.0" | bc)

  echo "  [seg]  Slide $padded (${total_duration}s)"

  # Create video segment: image + audio
  ffmpeg -y -loop 1 -i "$slideImg" -i "$audioFile" \
    -c:v libx264 -tune stillimage -c:a aac -b:a 192k \
    -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=white" \
    -pix_fmt yuv420p -t "$total_duration" \
    -shortest "$segFile" 2>/dev/null

  echo "file '$segFile'" >> "$CONCAT_FILE"

  # Insert Loom demo video after slide 16 (after all feature narrations)
  if [ "$i" -eq 16 ]; then
    echo ""
    echo "═══════════════════════════════════════"
    echo "  Step 2: Loom実践動画の挿入"
    echo "═══════════════════════════════════════"
    LOOM_SEG="$TEMP_DIR/loom_reencoded.mp4"
    ffmpeg -y -i "$LOOM_VIDEO" \
      -c:v libx264 -c:a aac -b:a 192k \
      -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=black" \
      -pix_fmt yuv420p \
      "$LOOM_SEG" 2>/dev/null
    echo "  [loom] Inserted ($(ffprobe -v quiet -show_entries format=duration -of csv=p=0 "$LOOM_SEG" | cut -d. -f1)s)"
    echo "file '$LOOM_SEG'" >> "$CONCAT_FILE"
    echo ""
    echo "═══════════════════════════════════════"
    echo "  Step 3: 残りスライド (17-21)"
    echo "═══════════════════════════════════════"
  fi
done

echo ""
echo "═══════════════════════════════════════"
echo "  Step 4: 最終動画の結合"
echo "═══════════════════════════════════════"

ffmpeg -y -f concat -safe 0 -i "$CONCAT_FILE" \
  -c:v libx264 -c:a aac -movflags +faststart \
  "$OUTPUT" 2>/dev/null

# Cleanup
rm -rf "$TEMP_DIR" "$CONCAT_FILE"

echo ""
echo "═══════════════════════════════════════"
echo "  Complete: $OUTPUT"
SIZE=$(ls -lh "$OUTPUT" | awk '{print $5}')
DURATION=$(ffprobe -v quiet -show_entries format=duration -of csv=p=0 "$OUTPUT" | cut -d. -f1)
echo "  Size: $SIZE | Duration: ${DURATION}s"
echo "═══════════════════════════════════════"
