#!/bin/bash
set -e
BASE="/Users/kurosakiyuto/Downloads/開発/LMS/lecture09-slides"
PIPELINE="/Users/kurosakiyuto/Downloads/開発/LMS/lms-pipeline"
YAML="$BASE/course.yaml"

# Extract narrations from YAML per chapter, generate TTS, compose video
for PART_DIR in "$BASE"/Lec9-*/; do
  PART_ID=$(basename "$PART_DIR" | cut -d'_' -f1)
  PPTX="$PART_DIR/スライド.pptx"
  echo "=== $PART_ID ==="

  # Convert PPTX → PDF → PNG
  IMAGES="$PART_DIR/slides_images"
  mkdir -p "$IMAGES"
  soffice --headless --convert-to pdf --outdir "$PART_DIR" "$PPTX" 2>/dev/null
  PDF="$PART_DIR/スライド.pdf"
  pdftoppm -png -r 200 "$PDF" "$IMAGES/slide"
  for f in "$IMAGES"/slide-*.png; do
    new=$(echo "$f" | sed 's/slide-/slide_/')
    mv "$f" "$new" 2>/dev/null
  done
  echo "  images: $(ls "$IMAGES"/*.png | wc -l) slides"

  # Extract narrations from YAML and generate TTS
  AUDIO="$PART_DIR/audio"
  mkdir -p "$AUDIO"
  node -e "
    const yaml = require('$BASE/node_modules/js-yaml');
    const fs = require('fs');
    const data = yaml.load(fs.readFileSync('$YAML','utf-8'));
    const ch = data.chapters.find(c => c.id === '$PART_ID');
    if (!ch) { console.error('Chapter not found: $PART_ID'); process.exit(1); }
    const narr = ch.narrations || {};
    const out = {};
    Object.keys(narr).sort((a,b) => a-b).forEach(k => { out[k] = narr[k]; });
    fs.writeFileSync('$PART_DIR/narrations.json', JSON.stringify(out, null, 2));
    console.log('  narrations: ' + Object.keys(out).length + ' tracks');
  "

  # Generate TTS via OpenAI
  export $(grep -v '^#' "$PIPELINE/.env" | xargs)
  node -e "
    const OpenAI = require('$PIPELINE/node_modules/openai').default;
    const fs = require('fs');
    const narr = JSON.parse(fs.readFileSync('$PART_DIR/narrations.json','utf-8'));
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    (async () => {
      const keys = Object.keys(narr).sort((a,b) => a-b);
      for (let i = 0; i < keys.length; i++) {
        const idx = String(i+1).padStart(2,'0');
        const outPath = '$AUDIO/audio_' + idx + '.mp3';
        if (fs.existsSync(outPath)) { console.log('  [' + (i+1) + '/' + keys.length + '] skip (exists)'); continue; }
        console.log('  [' + (i+1) + '/' + keys.length + '] generating...');
        const resp = await openai.audio.speech.create({ model: 'tts-1-hd', voice: 'nova', input: narr[keys[i]], speed: 0.95 });
        fs.writeFileSync(outPath, Buffer.from(await resp.arrayBuffer()));
      }
      console.log('  TTS done');
    })();
  "
done

echo ""
echo "=== TTS完了。動画合成中... ==="
echo ""

# Compose videos
for PART_DIR in "$BASE"/Lec9-*/; do
  PART_ID=$(basename "$PART_DIR" | cut -d'_' -f1)
  IMAGES="$PART_DIR/slides_images"
  AUDIO="$PART_DIR/audio"
  TEMP="$PART_DIR/temp_vid"
  OUTPUT="$PART_DIR/$PART_ID.mp4"

  echo "=== $PART_ID: composing video ==="
  mkdir -p "$TEMP"

  CONCAT=""
  for img in "$IMAGES"/slide_*.png; do
    idx=$(basename "$img" | sed 's/slide_\([0-9]*\).png/\1/')
    audio_file="$AUDIO/audio_${idx}.mp3"
    segment="$TEMP/seg_${idx}.mp4"
    [ ! -f "$audio_file" ] && continue
    dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$audio_file")
    dur_padded=$(echo "$dur + 0.5" | bc)
    echo "  slide $idx: ${dur}s"
    ffmpeg -y -loop 1 -i "$img" -i "$audio_file" -c:v libx264 -tune stillimage -c:a aac -b:a 192k -pix_fmt yuv420p -shortest -t "$dur_padded" "$segment" 2>/dev/null
    CONCAT="${CONCAT}file '${segment}'\n"
  done

  echo -e "$CONCAT" > "$TEMP/concat.txt"
  ffmpeg -y -f concat -safe 0 -i "$TEMP/concat.txt" -c:v libx264 -c:a aac "$OUTPUT" 2>/dev/null
  rm -rf "$TEMP"
  dur_total=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUTPUT")
  mins=$(echo "$dur_total / 60" | bc)
  secs=$(echo "$dur_total % 60 / 1" | bc)
  echo "  done: ${mins}m${secs}s"
  echo ""
done

echo "=== ALL DONE ==="
