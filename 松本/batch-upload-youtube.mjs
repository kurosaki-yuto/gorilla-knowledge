#!/usr/bin/env node
/**
 * A-101〜A-112 の動画を YouTube 限定公開でアップロードし、
 * 既存の Supabase 講座レコードの video_url を更新するバッチスクリプト
 */

import { google } from "googleapis";
import { readFileSync, writeFileSync, existsSync, createReadStream, statSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { createServer } from "http";
import https from "https";

// === 設定 ===
const SUPABASE_URL = "https://tkdwqsoyheousodvtmuj.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrZHdxc295aGVvdXNvZHZ0bXVqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzkyMDgxNiwiZXhwIjoyMDg5NDk2ODE2fQ.wZH-PrN_-pyjUOhn0s2Q5eUFoeSMhYrTnJlMo6niwdI";
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:9876";
const TOKEN_PATH = join(tmpdir(), "yt-cli-token.json");

const BASE_DIR = "/Users/matsumotoshuntasuku/AI研修講座/gorilla-knowledge/黒崎/AI研修一覧";

const COURSES = [
  { id: "14a19983-6967-4caf-ac51-834136acd8ab", folder: "A-101_AIとは何か", title: "A-101: AIとは何か" },
  { id: "fe52fe5f-8307-4248-8d5c-1cb8c4075030", folder: "A-102_生成AIの仕組み", title: "A-102: 生成AIの仕組み" },
  { id: "b6bdbb0d-cc2a-4822-9c46-baf620acf7ab", folder: "A-103_主要AIツール徹底比較", title: "A-103: 主要AIツール徹底比較" },
  { id: "bd3f3c31-82ef-4f85-846c-be8b7bd333da", folder: "A-104_AIにできること・できないこと", title: "A-104: AIにできること・できないこと" },
  { id: "1a09ed28-6279-4047-9455-bf5d618a14a3", folder: "A-105_プロンプトの基本", title: "A-105: プロンプトの基本" },
  { id: "fb2ec073-f51e-45da-9b6b-89ad89eac8d1", folder: "A-106_プロンプト実践テクニック", title: "A-106: プロンプト実践テクニック" },
  { id: "7de062f6-405d-461f-9d6c-6a83ae2ae783", folder: "A-107_AI時代の情報リテラシー", title: "A-107: AI時代の情報リテラシー" },
  { id: "d4d327eb-2316-4611-8557-76282e62f9b9", folder: "A-108_AIと著作権・個人情報", title: "A-108: AIと著作権・個人情報" },
  { id: "5110b8d1-c0f7-4749-a223-1f4ea622e362", folder: "A-109_社内AI利用ガイドライン", title: "A-109: 社内AI利用ガイドライン" },
  { id: "7f072a26-115d-46ba-a888-95bc1daca9d1", folder: "A-110_AIで変わる仕事の未来", title: "A-110: AIで変わる仕事の未来" },
  { id: "451fb513-a7a4-42d9-b4a2-e15a48bfc930", folder: "A-111_業務別AI活用マップ", title: "A-111: 業務別AI活用マップ" },
  { id: "ff146501-0a27-4433-8996-2fc64e37d526", folder: "A-112_AI導入の第一歩", title: "A-112: AI導入の第一歩" },
];

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// === ヘルパー ===
function loadToken() {
  try { return JSON.parse(readFileSync(TOKEN_PATH, "utf-8")); } catch { return null; }
}
function saveToken(token) {
  writeFileSync(TOKEN_PATH, JSON.stringify(token));
}
function formatSize(bytes) {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// === Supabase REST (fetch不要、https直接) ===
function supabasePatch(courseId, data) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(data);
    const url = new URL(`${SUPABASE_URL}/rest/v1/courses?id=eq.${courseId}`);
    const req = https.request({
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: "PATCH",
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
        "Prefer": "return=representation",
      },
    }, (res) => {
      let d = "";
      res.on("data", (c) => d += c);
      res.on("end", () => resolve({ status: res.statusCode, body: d }));
    });
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

// === YouTube認証 ===
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
        description: `AI研修講座: ${title}`,
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

// === メイン ===
async function main() {
  console.log("━━━ A-101〜A-112 YouTube一括アップロード ━━━\n");

  await authenticate();

  const results = [];

  for (const course of COURSES) {
    const videoPath = join(BASE_DIR, course.folder, "動画.mp4");

    console.log(`\n[${ COURSES.indexOf(course) + 1}/12] ${course.title}`);

    if (!existsSync(videoPath)) {
      console.log(`  ⚠ 動画ファイルなし - スキップ`);
      results.push({ title: course.title, status: "SKIP", url: "" });
      continue;
    }

    try {
      const videoUrl = await uploadToYouTube(videoPath, course.title);

      // Supabase の video_url を更新
      const resp = await supabasePatch(course.id, { video_url: videoUrl });
      if (resp.status === 200 || resp.status === 204) {
        console.log(`  ✓ Supabase更新完了`);
        results.push({ title: course.title, status: "OK", url: videoUrl });
      } else {
        console.log(`  ✗ Supabase更新失敗: ${resp.status} ${resp.body}`);
        results.push({ title: course.title, status: "DB_ERROR", url: videoUrl });
      }
    } catch (e) {
      console.log(`  ✗ エラー: ${e.message}`);
      results.push({ title: course.title, status: "ERROR", url: "" });
    }
  }

  // サマリー
  console.log("\n\n━━━ 結果サマリー ━━━");
  for (const r of results) {
    const icon = r.status === "OK" ? "✓" : r.status === "SKIP" ? "⚠" : "✗";
    console.log(`  ${icon} ${r.title}  ${r.url}`);
  }

  const ok = results.filter(r => r.status === "OK").length;
  const skip = results.filter(r => r.status === "SKIP").length;
  const err = results.filter(r => r.status === "ERROR" || r.status === "DB_ERROR").length;
  console.log(`\n完了: ${ok}成功 / ${skip}スキップ / ${err}エラー`);
}

main().catch((e) => {
  console.error("致命的エラー:", e.message);
  process.exit(1);
});
