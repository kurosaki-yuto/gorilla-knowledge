#!/bin/bash
# 生成済みのスライド画像+音声から動画を合成
set -e

BASE="/Users/kurosakiyuto/Downloads/開発/LMS/lecture09-slides/output"

for part in part1 part2 part3 part5; do
  DIR="$BASE/$part"
  IMAGES="$DIR/slides_images"
  AUDIO="$DIR/audio"
  TEMP="$DIR/temp_vid"

  # PPTX名を取得
  PPTX=$(ls "$DIR"/*.pptx 2>/dev/null | head -1)
  NAME=$(basename "$PPTX" .pptx)
  OUTPUT="$DIR/$NAME.mp4"

  echo "=== $part: $NAME ==="

  mkdir -p "$TEMP"

  CONCAT=""
  for img in "$IMAGES"/slide_*.png; do
    idx=$(basename "$img" | sed 's/slide_\([0-9]*\).png/\1/')
    audio_file="$AUDIO/audio_${idx}.mp3"
    segment="$TEMP/seg_${idx}.mp4"

    if [ ! -f "$audio_file" ]; then
      echo "  skip: no audio for slide $idx"
      continue
    fi

    dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$audio_file")
    dur_padded=$(echo "$dur + 0.5" | bc)
    echo "  slide $idx: ${dur}s"

    ffmpeg -y -loop 1 -i "$img" -i "$audio_file" \
      -c:v libx264 -tune stillimage -c:a aac -b:a 192k \
      -pix_fmt yuv420p -shortest -t "$dur_padded" \
      "$segment" 2>/dev/null

    CONCAT="${CONCAT}file '${segment}'\n"
  done

  echo -e "$CONCAT" > "$TEMP/concat.txt"

  ffmpeg -y -f concat -safe 0 -i "$TEMP/concat.txt" \
    -c:v libx264 -c:a aac "$OUTPUT" 2>/dev/null

  rm -rf "$TEMP"

  dur_total=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUTPUT")
  echo "  done: $OUTPUT (${dur_total}s)"
  echo
done

echo "=== ALL DONE ==="
