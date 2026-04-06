#!/bin/bash
# P-02 コストシミュレーション 動画生成スクリプト
# スライド画像 + edge-tts音声 → MP4動画

set -e
cd "$(dirname "$0")"

VOICE="${EDGE_TTS_VOICE:-ja-JP-NanamiNeural}"
RATE="${TTS_SPEED:-+0%}"
AUDIO_DIR="audio"
SLIDE_DIR="スライド画像"
OUTPUT="動画.mp4"

mkdir -p "$AUDIO_DIR"

echo "═══════════════════════════════════════"
echo "  Step 1: 音声生成 (edge-tts)"
echo "═══════════════════════════════════════"

# Read narrations from JSON and generate audio
node -e "
const fs = require('fs');
const narrations = JSON.parse(fs.readFileSync('narrations.json', 'utf-8'));
for (const [key, text] of Object.entries(narrations)) {
  console.log(key + '|||' + text);
}
" | while IFS='|||' read -r num text; do
  padded=$(printf "%02d" "$num")
  audioFile="$AUDIO_DIR/slide_${padded}.mp3"
  if [ -f "$audioFile" ]; then
    echo "  [skip] slide_${padded}.mp3 (exists)"
    continue
  fi
  echo "  [gen]  slide_${padded}.mp3 ..."
  edge-tts --voice "$VOICE" --rate="$RATE" --text "$text" --write-media "$audioFile" 2>/dev/null
done

echo ""
echo "═══════════════════════════════════════"
echo "  Step 2: 動画結合"
echo "═══════════════════════════════════════"

# Build concat file
CONCAT_FILE=$(mktemp /tmp/concat_XXXXXX.txt)
TEMP_DIR=$(mktemp -d /tmp/slides_XXXXXX)

for i in $(seq 1 12); do
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
done

echo ""
echo "  [concat] Final video..."
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
