#!/usr/bin/env node
/**
 * AI画像生成講座（5本）を YouTube 限定公開でアップロード
 *
 * 使い方:
 *   node upload-ai-image-youtube.mjs
 *   node upload-ai-image-youtube.mjs --dry-run   # ファイル確認のみ
 */

import { google } from "googleapis";
import { readFileSync, writeFileSync, existsSync, createReadStream, statSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { createServer } from "http";
import https from "https";

// === 設定 ===
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:9876";
const TOKEN_PATH = join(tmpdir(), "yt-cli-token.json");

const BASE_DIR = "/Users/matsumotoshuntasuku/AI研修講座/gorilla-knowledge/黒崎/AI研修一覧";

const COURSES = [
  { folder: "AI画像生成/P-01_なぜAI画像生成なのか", title: "【AI画像生成】なぜAI画像生成なのか" },
  { folder: "AI画像生成/P-02_まず1枚作る", title: "【AI画像生成】まず1枚作る" },
  { folder: "AI画像生成/P-03_SNS素材テンプレート実践", title: "【AI画像生成】SNS素材テンプレート実践" },
  { folder: "AI画像生成/P-04_広告バナー制作", title: "【AI画像生成】広告バナー制作" },
  { folder: "AI画像生成/P-05_クオリティ改善と次のステップ", title: "【AI画像生成】クオリティ改善と次のステップ" },
];

const RESULTS_FILE = join(BASE_DIR, "AI画像生成/youtube-urls.json");

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

function loadToken() {
  try { return JSON.parse(readFileSync(TOKEN_PATH, "utf-8")); } catch { return null; }
}
function saveToken(token) {
  writeFileSync(TOKEN_PATH, JSON.stringify(token));
}
function formatSize(bytes) {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function authenticate() {
  const token = loadToken();
  if (token) {
    oauth2Client.setCredentials(token);
    oauth2Client.on("tokens", (t) => saveToken({ ...loadToken(), ...t }));
    console.log("✓ YouTube認証済み（トークン再利用）\n");
    return;
  }

  console.log("YouTube認証が必要です。ブラウザが開きます...");
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/youtube.upload"],
    prompt: "consent",
  });

  const code = await new Promise((resolve, reject) => {
    const server = createServer((req, res) => {
      const u = new URL(req.url, "http://localhost:9876");
      const code = u.searchParams.get("code");
      if (code) {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end("<h2>認証完了！このタブを閉じてください。</h2>");
        server.close();
        resolve(code);
      }
    });
    server.listen(9876, () => {
      console.log(`\n認証URL:\n${url}\n`);
      import("child_process").then(({ exec }) => exec(`open "${url}"`));
    });
  });

  const { tokens } = await oauth2Client.getToken(code);
  saveToken(tokens);
  oauth2Client.setCredentials(tokens);
  oauth2Client.on("tokens", (t) => saveToken({ ...loadToken(), ...t }));
  console.log("✓ YouTube認証完了\n");
}

async function uploadToYouTube(filePath, title) {
  const youtube = google.youtube({ version: "v3", auth: oauth2Client });
  const fileSize = statSync(filePath).size;

  console.log(`  アップロード中... (${formatSize(fileSize)})`);

  const res = await youtube.videos.insert({
    part: ["snippet", "status"],
    requestBody: {
      snippet: {
        title,
        description: `AI研修講座: ${title}\n\nAI画像生成でマーケティング素材を量産する`,
        categoryId: "27", // Education
      },
      status: { privacyStatus: "unlisted" },
    },
    media: { body: createReadStream(filePath) },
  });

  const videoId = res.data.id;
  const videoUrl = `https://youtu.be/${videoId}`;
  console.log(`  ✓ YouTube URL: ${videoUrl}`);
  return videoUrl;
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");

  console.log("━━━ AI画像生成講座 YouTube一括アップロード ━━━\n");

  // ファイル確認
  console.log("📋 対象ファイル:\n");
  for (const [i, course] of COURSES.entries()) {
    const fp = join(BASE_DIR, course.folder, "動画.mp4");
    if (existsSync(fp)) {
      const size = formatSize(statSync(fp).size);
      console.log(`  ✅ [${i + 1}/5] ${course.title}  (${size})`);
    } else {
      console.log(`  ❌ [${i + 1}/5] ${course.title}  → ファイルなし`);
    }
  }

  if (dryRun) {
    console.log("\n--dry-run: ここまで");
    return;
  }

  await authenticate();

  const results = [];

  for (const [i, course] of COURSES.entries()) {
    const videoPath = join(BASE_DIR, course.folder, "動画.mp4");

    console.log(`\n[${i + 1}/5] ${course.title}`);

    if (!existsSync(videoPath)) {
      console.log(`  ⚠ 動画ファイルなし - スキップ`);
      results.push({ title: course.title, status: "SKIP", url: "" });
      continue;
    }

    try {
      const videoUrl = await uploadToYouTube(videoPath, course.title);
      results.push({ title: course.title, status: "OK", url: videoUrl });
    } catch (e) {
      console.log(`  ✗ エラー: ${e.message}`);
      results.push({ title: course.title, status: "ERROR", url: "" });
    }
  }

  // 結果を保存
  writeFileSync(RESULTS_FILE, JSON.stringify(results, null, 2));
  console.log(`\n📄 結果保存: ${RESULTS_FILE}`);

  // サマリー
  console.log("\n━━━ 結果サマリー ━━━");
  for (const r of results) {
    const icon = r.status === "OK" ? "✓" : r.status === "SKIP" ? "⚠" : "✗";
    console.log(`  ${icon} ${r.title}  ${r.url}`);
  }

  const ok = results.filter(r => r.status === "OK").length;
  const err = results.filter(r => r.status !== "OK").length;
  console.log(`\n完了: ${ok}成功 / ${err}エラー`);
}

main().catch((e) => {
  console.error("致命的エラー:", e.message);
  process.exit(1);
});
