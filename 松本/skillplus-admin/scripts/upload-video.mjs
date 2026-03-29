#!/usr/bin/env node
/**
 * MP4 → YouTube限定公開アップロード → Supabase講座に自動登録
 *
 * 使い方:
 *   node scripts/upload-video.mjs <MP4ファイルパス> [講座名]
 *
 * 例:
 *   node scripts/upload-video.mjs ~/Desktop/lecture01.mp4 "AIの基本"
 *   node scripts/upload-video.mjs ./videos/*.mp4   ← 複数ファイル一括も可
 *
 * 初回のみYouTube認証が必要（ブラウザが開きます）
 */

import { google } from "googleapis";
import { createClient } from "@supabase/supabase-js";
import { readFileSync, writeFileSync, existsSync, createReadStream, statSync } from "fs";
import { join, basename } from "path";
import { tmpdir } from "os";
import { createServer } from "http";

// === 設定 ===
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://tkdwqsoyheousodvtmuj.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const CLIENT_ID = process.env.YOUTUBE_CLIENT_ID || "";
const CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET || "";
const REDIRECT_URI = "http://localhost:9876";
const TOKEN_PATH = join(tmpdir(), "yt-cli-token.json");

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// === ヘルパー ===
function loadToken() {
  try { return JSON.parse(readFileSync(TOKEN_PATH, "utf-8")); } catch { return null; }
}

function saveToken(token) {
  writeFileSync(TOKEN_PATH, JSON.stringify(token));
}

function parseDuration(iso) {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return 0;
  return (parseInt(m[1] || "0") * 3600) + (parseInt(m[2] || "0") * 60) + (parseInt(m[3] || "0"));
}

function formatSize(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

// === YouTube認証 ===
async function authenticate() {
  const token = loadToken();
  if (token) {
    oauth2Client.setCredentials(token);
    oauth2Client.on("tokens", (t) => saveToken({ ...loadToken(), ...t }));
    console.log("✓ YouTube認証済み");
    return;
  }

  console.log("YouTube認証が必要です。ブラウザが開きます...");

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/youtube.upload"],
    prompt: "consent",
  });

  // ローカルサーバーでコールバックを受け取る
  const code = await new Promise((resolve, reject) => {
    const server = createServer(async (req, res) => {
      const u = new URL(req.url, `http://localhost:9876`);
      const code = u.searchParams.get("code");
      if (code) {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end("<h2>認証完了！このタブを閉じてください。</h2><script>setTimeout(()=>window.close(),1000)</script>");
        server.close();
        resolve(code);
      } else {
        res.writeHead(400);
        res.end("Error");
        server.close();
        reject(new Error("認証失敗"));
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

// === YouTube アップロード ===
async function uploadToYouTube(filePath, title) {
  const youtube = google.youtube({ version: "v3", auth: oauth2Client });
  const fileSize = statSync(filePath).size;

  console.log(`  アップロード中... (${formatSize(fileSize)})`);

  const res = await youtube.videos.insert({
    part: ["snippet", "status"],
    requestBody: {
      snippet: {
        title,
        description: `自動アップロード: ${title}`,
        categoryId: "27",
      },
      status: { privacyStatus: "unlisted" },
    },
    media: { body: createReadStream(filePath) },
  });

  const videoId = res.data.id;
  const videoUrl = `https://youtu.be/${videoId}`;
  console.log(`  ✓ YouTube URL: ${videoUrl}`);

  // 動画の長さを取得（処理待ち）
  let durationSeconds = 0;
  for (let i = 0; i < 5; i++) {
    await new Promise((r) => setTimeout(r, 3000));
    try {
      const details = await youtube.videos.list({
        part: ["contentDetails"],
        id: [videoId],
      });
      const dur = details.data.items?.[0]?.contentDetails?.duration;
      if (dur && dur !== "P0D") {
        durationSeconds = parseDuration(dur);
        break;
      }
    } catch {}
    console.log(`  動画処理中... (${i + 1}/5)`);
  }

  if (durationSeconds > 0) {
    console.log(`  ✓ 動画時間: ${Math.floor(durationSeconds / 60)}分${durationSeconds % 60}秒`);
  } else {
    console.log(`  ⚠ 動画時間の取得に失敗（YouTube処理中）。手動で設定してください。`);
  }

  return { videoId, videoUrl, durationSeconds };
}

// === Supabase に講座登録 ===
async function registerCourse(title, videoUrl, durationSeconds, categoryId) {
  if (!categoryId) {
    // カテゴリーが指定されてない場合、最初のカテゴリーを使う
    const { data: cats } = await supabase.from("categories").select("id, name").limit(5);
    if (!cats || cats.length === 0) {
      console.log("  ⚠ カテゴリーが見つかりません。Supabaseへの登録をスキップ。");
      return null;
    }
    console.log(`\n  利用可能なカテゴリー:`);
    cats.forEach((c, i) => console.log(`    ${i + 1}. ${c.name} (${c.id})`));
    console.log(`  → 最初のカテゴリー「${cats[0].name}」に登録します`);
    categoryId = cats[0].id;
  }

  const { data, error } = await supabase.from("courses").insert({
    category_id: categoryId,
    name: title,
    description: "",
    video_url: videoUrl,
    is_published: true,
    duration_seconds: durationSeconds,
    thumbnail_url: "",
  }).select("id").single();

  if (error) {
    console.log(`  ⚠ Supabase登録エラー: ${error.message}`);
    return null;
  }

  console.log(`  ✓ Supabase講座ID: ${data.id}`);
  return data.id;
}

// === メイン ===
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
使い方:
  node scripts/upload-video.mjs <MP4ファイル> [講座名] [カテゴリーID]

例:
  node scripts/upload-video.mjs ~/Desktop/lecture.mp4
  node scripts/upload-video.mjs ~/Desktop/lecture.mp4 "AIの基本"
  node scripts/upload-video.mjs ~/Desktop/lecture.mp4 "AIの基本" カテゴリーUUID

オプション:
  --list-categories  カテゴリー一覧を表示
`);
    process.exit(0);
  }

  if (args[0] === "--list-categories") {
    const { data } = await supabase
      .from("categories")
      .select("id, name, training_id, trainings!inner(name)")
      .order("training_id");
    if (data) {
      console.log("\nカテゴリー一覧:");
      data.forEach((c) => {
        console.log(`  ${c.id}  ${c.trainings?.name} > ${c.name}`);
      });
    }
    process.exit(0);
  }

  await authenticate();

  for (const filePath of [args[0]]) {
    if (!existsSync(filePath)) {
      console.log(`✗ ファイルが見つかりません: ${filePath}`);
      continue;
    }

    const title = args[1] || basename(filePath).replace(/\.[^.]+$/, "");
    const categoryId = args[2] || null;

    console.log(`\n━━━ ${title} ━━━`);
    console.log(`  ファイル: ${filePath}`);

    const { videoUrl, durationSeconds } = await uploadToYouTube(filePath, title);
    await registerCourse(title, videoUrl, durationSeconds, categoryId);

    console.log(`  ✓ 完了！\n`);
  }
}

main().catch((e) => {
  console.error("エラー:", e.message);
  process.exit(1);
});
