/**
 * OpenAI Whisper APIでワードレベルタイムスタンプ取得 → フィラー＋長い無音をカット
 */
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const OPENAI_API_KEY = "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";
const DIR = "/Users/kurosakiyuto/Downloads/開発/LMS/GPT講座";

// フィラーワードリスト
const FILLERS = [
  "えーと", "えーっと", "えっと", "えー", "えーー", "ええと",
  "あの", "あのー", "あのう", "あのですね",
  "うーん", "うん", "うーんと",
  "まあ", "まー",
  "そのー", "その",
  "なんか", "なんていうか",
  "ちょっと",
];

// フィラー判定（部分一致）
function isFiller(word: string): boolean {
  const w = word.replace(/[、。．，]/g, "").trim();
  if (!w) return false;
  return FILLERS.some(f => w === f || w === f + "ー" || w === f + "っ");
}

interface WordSegment {
  word: string;
  start: number;
  end: number;
}

async function transcribeWithWords(audioPath: string): Promise<WordSegment[]> {
  const formData = new FormData();
  formData.append("file", new Blob([fs.readFileSync(audioPath)]), path.basename(audioPath));
  formData.append("model", "whisper-1");
  formData.append("language", "ja");
  formData.append("response_format", "verbose_json");
  formData.append("timestamp_granularities[]", "word");

  const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${OPENAI_API_KEY}` },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Whisper API error: ${res.status} ${err}`);
  }

  const data = await res.json() as any;
  return (data.words || []).map((w: any) => ({
    word: w.word,
    start: w.start,
    end: w.end,
  }));
}

// 保持する区間を計算（フィラーと2秒以上の無音を除去）
function computeKeepSegments(words: WordSegment[], totalDuration: number): Array<{start: number; end: number}> {
  if (words.length === 0) return [{ start: 0, end: totalDuration }];

  const cutRanges: Array<{start: number; end: number}> = [];

  // フィラー単語をカット対象に追加
  for (const w of words) {
    if (isFiller(w.word)) {
      cutRanges.push({ start: w.start, end: w.end });
    }
  }

  // 単語間の長い無音（1.5秒以上）を短縮（0.4秒残す）
  for (let i = 0; i < words.length - 1; i++) {
    const gap = words[i + 1].start - words[i].end;
    if (gap > 1.5) {
      // 0.4秒だけ残して残りをカット
      cutRanges.push({
        start: words[i].end + 0.4,
        end: words[i + 1].start,
      });
    }
  }

  // 冒頭の無音
  if (words[0].start > 2.0) {
    cutRanges.push({ start: 0.5, end: words[0].start - 0.3 });
  }

  // 末尾の無音
  const lastWord = words[words.length - 1];
  if (totalDuration - lastWord.end > 2.0) {
    cutRanges.push({ start: lastWord.end + 0.5, end: totalDuration - 0.1 });
  }

  if (cutRanges.length === 0) return [{ start: 0, end: totalDuration }];

  // カット範囲をソート＆マージ
  cutRanges.sort((a, b) => a.start - b.start);
  const merged: typeof cutRanges = [cutRanges[0]];
  for (let i = 1; i < cutRanges.length; i++) {
    const last = merged[merged.length - 1];
    if (cutRanges[i].start <= last.end + 0.05) {
      last.end = Math.max(last.end, cutRanges[i].end);
    } else {
      merged.push(cutRanges[i]);
    }
  }

  // カット範囲の反転 → 保持範囲
  const keep: Array<{start: number; end: number}> = [];
  let pos = 0;
  for (const cut of merged) {
    if (cut.start > pos + 0.05) {
      keep.push({ start: pos, end: cut.start });
    }
    pos = cut.end;
  }
  if (pos < totalDuration - 0.05) {
    keep.push({ start: pos, end: totalDuration });
  }

  return keep;
}

// ffmpegで保持区間だけ結合
function buildCleanVideo(inputPath: string, segments: Array<{start: number; end: number}>, outputPath: string) {
  // セグメントが多すぎる場合はfilter_complexで処理
  const filterParts: string[] = [];
  const concatInputs: string[] = [];

  for (let i = 0; i < segments.length; i++) {
    const s = segments[i];
    const duration = s.end - s.start;
    filterParts.push(`[0:v]trim=start=${s.start.toFixed(3)}:duration=${duration.toFixed(3)},setpts=PTS-STARTPTS[v${i}];`);
    filterParts.push(`[0:a]atrim=start=${s.start.toFixed(3)}:duration=${duration.toFixed(3)},asetpts=PTS-STARTPTS[a${i}];`);
    concatInputs.push(`[v${i}][a${i}]`);
  }

  const filterComplex = filterParts.join("") +
    `${concatInputs.join("")}concat=n=${segments.length}:v=1:a=1[outv][outa]`;

  const cmd = `ffmpeg -y -i "${inputPath}" -filter_complex "${filterComplex}" -map "[outv]" -map "[outa]" -c:v libx264 -preset fast -crf 23 -c:a aac -b:a 128k "${outputPath}"`;

  execSync(cmd, { stdio: "pipe", maxBuffer: 50 * 1024 * 1024, timeout: 600000 });
}

async function main() {
  console.log("\n🔇 フィラー＋無音カット処理開始\n");

  for (let i = 1; i <= 5; i++) {
    const partNum = String(i).padStart(2, "0");
    const audioPath = path.join(DIR, `audio_part${i}.mp3`);
    const videoPath = path.join(DIR, `Part${i}.mp4`);
    const outputPath = path.join(DIR, `Part${i}_clean.mp4`);

    console.log(`[Part ${i}] 音声認識中...`);
    const words = await transcribeWithWords(audioPath);
    console.log(`  ${words.length}個のワード検出`);

    // フィラー数カウント
    const fillerCount = words.filter(w => isFiller(w.word)).length;
    console.log(`  フィラー: ${fillerCount}個`);

    // 動画の長さ取得
    const durationStr = execSync(`ffprobe -v quiet -show_entries format=duration -of csv=p=0 "${videoPath}"`).toString().trim();
    const totalDuration = parseFloat(durationStr);

    const keepSegments = computeKeepSegments(words, totalDuration);
    const keepDuration = keepSegments.reduce((sum, s) => sum + (s.end - s.start), 0);
    const cutDuration = totalDuration - keepDuration;
    console.log(`  カット: ${cutDuration.toFixed(1)}秒 (${(cutDuration / totalDuration * 100).toFixed(1)}%)`);
    console.log(`  出力: ${(keepDuration / 60).toFixed(1)}分`);

    console.log(`  動画処理中...`);
    buildCleanVideo(videoPath, keepSegments, outputPath);
    console.log(`  ✅ ${outputPath}`);
    console.log();
  }

  console.log("=== フィラーカット完了 ===\n");
}

main().catch(err => { console.error("❌", err); process.exit(1); });
