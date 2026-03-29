#!/usr/bin/env node
/**
 * AI研修一覧(AI-101〜106)を一括インポート
 * - 動画.mp4 → YouTube限定公開
 * - README.md → 学習目標 → 上テキスト（BlockNote contentJson）
 * - 台本.md → 講座内容要約 → 下テキスト（BlockNote contentJson）
 * - テスト.md → quizzesテーブルに登録
 */

import { google } from "googleapis";
import { createClient } from "@supabase/supabase-js";
import { readFileSync, writeFileSync, existsSync, createReadStream, statSync, readdirSync } from "fs";
import { join, basename } from "path";
import { tmpdir } from "os";
import { createServer } from "http";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://tkdwqsoyheousodvtmuj.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const CLIENT_ID = process.env.YOUTUBE_CLIENT_ID || "";
const CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET || "";
const REDIRECT_URI = "http://localhost:3002/api/youtube/callback";
const TOKEN_PATH = join(tmpdir(), "yt-cli-token.json");
const BASE_DIR = "/Users/matsumotoshuntasuku/AI研修講座/gorilla-knowledge/黒崎/AI研修一覧";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

function loadToken() { try { return JSON.parse(readFileSync(TOKEN_PATH, "utf-8")); } catch { return null; } }
function saveToken(t) { writeFileSync(TOKEN_PATH, JSON.stringify(t)); }
function parseDuration(iso) {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  return m ? (+(m[1]||0)*3600 + +(m[2]||0)*60 + +(m[3]||0)) : 0;
}

// BlockNote ブロック生成ヘルパー
function heading(text) {
  return { id: crypto.randomUUID(), type: "heading", props: { level: 2, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text, styles: {} }], children: [] };
}
function paragraph(text, bold = false) {
  return { id: crypto.randomUUID(), type: "paragraph", props: { textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: text ? [{ type: "text", text, styles: bold ? { bold: true } : {} }] : [], children: [] };
}
function bulletItem(text) {
  return { id: crypto.randomUUID(), type: "bulletListItem", props: { textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text, styles: {} }], children: [] };
}

// README.md → 上テキスト（学習目標・勉強方法）
function buildAboveBlocks(readmePath, courseCode, courseTitle) {
  const blocks = [];
  if (!existsSync(readmePath)) {
    blocks.push(heading("この講座について"));
    blocks.push(paragraph(`${courseCode}: ${courseTitle} の講座です。`));
    return blocks;
  }

  const content = readFileSync(readmePath, "utf-8");

  // 標準学習時間を取得
  const timeMatch = content.match(/標準学習時間:\s*(\d+分)/);
  const time = timeMatch ? timeMatch[1] : "10分";

  // 対象者を取得
  const targetMatch = content.match(/対象者\s*\|\s*(.+)/);
  const target = targetMatch ? targetMatch[1].trim() : "";

  blocks.push(heading("この講座の勉強方法"));
  blocks.push(paragraph(""));
  blocks.push(bulletItem(`標準学習時間: ${time}`));
  if (target) blocks.push(bulletItem(`対象: ${target}`));
  blocks.push(bulletItem("動画を最後まで視聴してください"));
  blocks.push(bulletItem("動画の後に確認テストがあります（80%以上で合格）"));
  blocks.push(paragraph(""));

  // 学習目標を取得
  const goalSection = content.match(/## 学習目標[\s\S]*?(?=\n## |$)/);
  if (goalSection) {
    blocks.push(heading("学習目標"));
    blocks.push(paragraph("この講座を終えると、以下ができるようになります："));
    blocks.push(paragraph(""));
    const goals = [...goalSection[0].matchAll(/\d+\.\s+\*\*(.+?)\*\*/g)];
    for (const g of goals) {
      blocks.push(bulletItem(g[1]));
    }
  }

  blocks.push(paragraph(""));
  return blocks;
}

// 台本.md → 下テキスト（講座内容サマリー）
function buildBelowBlocks(scriptPath) {
  const blocks = [];
  if (!existsSync(scriptPath)) return blocks;

  const content = readFileSync(scriptPath, "utf-8");

  blocks.push(heading("講座の内容"));
  blocks.push(paragraph(""));

  // スライドごとのタイトルと要約を取得
  const slides = content.split(/^## スライド \d+/m).slice(1);
  for (const slide of slides) {
    // スライドタイトルを取得
    const titleMatch = slide.match(/^:\s*(.+?)（/m);
    if (!titleMatch) continue;
    const slideTitle = titleMatch[1].trim();
    if (slideTitle === "タイトル" || slideTitle === "まとめ" || slideTitle === "エンディング") continue;

    // ナレーションの最初の文を取得
    const narrationMatch = slide.match(/\*\*【ナレーション】\*\*\n([\s\S]*?)(?=\n---|\n##|$)/);
    if (!narrationMatch) continue;
    const narration = narrationMatch[1].trim();
    const firstSentence = narration.split(/。/)[0] + "。";

    blocks.push(paragraph(slideTitle, true));
    blocks.push(paragraph(firstSentence));
    blocks.push(paragraph(""));
  }

  return blocks;
}

// テスト.md パーサー
function parseQuizMd(content) {
  const quizzes = [];
  const sections = content.split(/^## 問題 \d+/m).slice(1);
  for (const section of sections) {
    const questionMatch = section.match(/\*\*(.+?)\*\*/);
    if (!questionMatch) continue;
    const choiceMatches = [...section.matchAll(/^- ([A-D])\. (.+)$/gm)];
    if (choiceMatches.length < 2) continue;
    const choices = choiceMatches.map(m => m[2]);
    const answerMatch = section.match(/<summary>正解<\/summary>[\s\S]*?\*\*([A-D])\./);
    if (!answerMatch) continue;
    const correctIndex = answerMatch[1].charCodeAt(0) - 65;
    quizzes.push({ question: questionMatch[1], choices, correctAnswer: correctIndex });
  }
  return quizzes;
}

// YouTube認証
async function authenticate() {
  const token = loadToken();
  if (token) {
    oauth2Client.setCredentials(token);
    oauth2Client.on("tokens", t => saveToken({ ...loadToken(), ...t }));
    console.log("✓ YouTube認証済み\n");
    return;
  }
  console.log("YouTube認証が必要です。ブラウザが開きます...");
  console.log("ブラウザでGoogleアカウントにログインして許可してください。");
  console.log("認証完了後、自動で処理が続行されます。\n");

  const url = oauth2Client.generateAuthUrl({ access_type: "offline", scope: ["https://www.googleapis.com/auth/youtube.upload"], prompt: "consent" });
  import("child_process").then(({ exec }) => exec(`open "${url}"`));

  // 管理画面の /api/youtube/callback がトークンを TOKEN_PATH に保存するので、それを待つ
  // callback の保存先を合わせる
  const callbackTokenPath = join(tmpdir(), "youtube-token.json");
  for (let i = 0; i < 120; i++) {
    await new Promise(r => setTimeout(r, 2000));
    try {
      const t = JSON.parse(readFileSync(callbackTokenPath, "utf-8"));
      if (t && t.access_token) {
        writeFileSync(TOKEN_PATH, JSON.stringify(t));
        oauth2Client.setCredentials(t);
        oauth2Client.on("tokens", t2 => saveToken({ ...loadToken(), ...t2 }));
        console.log("✓ YouTube認証完了\n");
        return;
      }
    } catch {}
  }
  throw new Error("認証がタイムアウトしました。もう一度試してください。");
}

// YouTube アップロード
async function uploadToYouTube(filePath, title) {
  const youtube = google.youtube({ version: "v3", auth: oauth2Client });
  const size = statSync(filePath).size;
  console.log(`  YouTube アップロード中... (${(size / 1024 / 1024).toFixed(1)} MB)`);
  const res = await youtube.videos.insert({
    part: ["snippet", "status"],
    requestBody: { snippet: { title, description: `AI研修講座: ${title}`, categoryId: "27" }, status: { privacyStatus: "unlisted" } },
    media: { body: createReadStream(filePath) },
  });
  const videoId = res.data.id;
  const videoUrl = `https://youtu.be/${videoId}`;
  console.log(`  ✓ ${videoUrl}`);

  let durationSeconds = 0;
  for (let i = 0; i < 5; i++) {
    await new Promise(r => setTimeout(r, 3000));
    try {
      const d = await youtube.videos.list({ part: ["contentDetails"], id: [videoId] });
      const dur = d.data.items?.[0]?.contentDetails?.duration;
      if (dur && dur !== "P0D") { durationSeconds = parseDuration(dur); break; }
    } catch {}
  }
  if (durationSeconds > 0) console.log(`  ✓ 動画時間: ${Math.floor(durationSeconds / 60)}分${durationSeconds % 60}秒`);
  return { videoUrl, durationSeconds };
}

// === メイン ===
async function main() {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  AI研修 一括インポート");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  await authenticate();

  // 研修を作成
  const TRAINING_NAME = "AI研修基礎編";
  let { data: existing } = await supabase.from("trainings").select("id").eq("name", TRAINING_NAME);
  let trainingId;
  if (existing?.length > 0) {
    trainingId = existing[0].id;
    console.log(`✓ 研修「${TRAINING_NAME}」既存 (${trainingId})`);
  } else {
    const { data } = await supabase.from("trainings").insert({ name: TRAINING_NAME, description: "AI基礎研修シリーズ（AI-101〜106）" }).select("id").single();
    trainingId = data.id;
    console.log(`✓ 研修「${TRAINING_NAME}」作成 (${trainingId})`);
  }

  // フォルダ一覧
  const folders = readdirSync(BASE_DIR).filter(f => f.match(/^AI-10[1-6]/)).sort();
  console.log(`\n${folders.length}講座を処理します\n`);

  for (let i = 0; i < folders.length; i++) {
    const folder = folders[i];
    const dirPath = join(BASE_DIR, folder);
    const courseCode = folder.match(/^(AI-\d+)/)?.[1] || "";
    const courseTitle = folder.replace(/^AI-\d+_/, "");
    const fullTitle = `${courseCode}: ${courseTitle}`;

    console.log(`\n[${'='.repeat(40)}]`);
    console.log(`[${i + 1}/${folders.length}] ${fullTitle}`);
    console.log(`[${'='.repeat(40)}]`);

    // カテゴリー作成
    let { data: existCats } = await supabase.from("categories").select("id").eq("training_id", trainingId).eq("name", fullTitle);
    let categoryId;
    if (existCats?.length > 0) {
      categoryId = existCats[0].id;
      console.log(`  ✓ カテゴリー既存`);
    } else {
      const { data } = await supabase.from("categories").insert({ training_id: trainingId, name: fullTitle, sort_order: i + 1 }).select("id").single();
      categoryId = data.id;
      console.log(`  ✓ カテゴリー作成`);
    }

    // YouTube アップロード
    const mp4Path = join(dirPath, "動画.mp4");
    let videoUrl = "", durationSeconds = 0;
    if (existsSync(mp4Path)) {
      ({ videoUrl, durationSeconds } = await uploadToYouTube(mp4Path, fullTitle));
    } else {
      console.log(`  ⚠ 動画.mp4 なし`);
    }

    // contentJson（BlockNote形式）を生成
    const readmePath = join(dirPath, "README.md");
    const scriptPath = join(dirPath, "台本.md");
    const aboveBlocks = buildAboveBlocks(readmePath, courseCode, courseTitle);
    const belowBlocks = buildBelowBlocks(scriptPath);

    const contentJson = {
      sections: ["above", "video", "below"],
      above: aboveBlocks,
      below: belowBlocks,
    };

    // 講座説明（プレーンテキスト）
    let description = "";
    if (existsSync(readmePath)) {
      const readme = readFileSync(readmePath, "utf-8");
      const goals = [...readme.matchAll(/\d+\.\s+\*\*(.+?)\*\*/g)].map(g => g[1]);
      description = goals.join("\n");
    }

    // Supabase に講座登録
    const { data: courseData, error } = await supabase.from("courses").insert({
      category_id: categoryId,
      name: fullTitle,
      description,
      video_url: videoUrl,
      is_published: true,
      duration_seconds: durationSeconds,
      content_json: contentJson,
    }).select("id").single();

    if (error) { console.log(`  ✗ 講座登録エラー: ${error.message}`); continue; }
    const courseId = courseData.id;
    console.log(`  ✓ 講座登録完了`);

    // テスト問題を登録
    const testPath = join(dirPath, "テスト.md");
    if (existsSync(testPath)) {
      const quizzes = parseQuizMd(readFileSync(testPath, "utf-8"));
      for (let q = 0; q < quizzes.length; q++) {
        await supabase.from("quizzes").insert({
          course_id: courseId,
          question: quizzes[q].question,
          choices: quizzes[q].choices,
          correct_answer: quizzes[q].correctAnswer,
          sort_order: q,
        });
      }
      console.log(`  ✓ テスト ${quizzes.length}問 登録`);
    }

    console.log(`  ✓ 完了！`);
  }

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  全講座インポート完了！");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main().catch(e => { console.error("エラー:", e); process.exit(1); });
