#!/usr/bin/env node
/**
 * AI動画生成講座 5本をYouTube限定公開 → Supabase更新
 */
import { google } from "googleapis";
import { readFileSync, writeFileSync, existsSync, createReadStream, statSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { createServer } from "http";
import https from "https";

const SUPABASE_URL = "https://tkdwqsoyheousodvtmuj.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrZHdxc295aGVvdXNvZHZ0bXVqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzkyMDgxNiwiZXhwIjoyMDg5NDk2ODE2fQ.wZH-PrN_-pyjUOhn0s2Q5eUFoeSMhYrTnJlMo6niwdI";
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:9876";
const TOKEN_PATH = join(tmpdir(), "yt-cli-token.json");
const BASE = "/Users/matsumotoshuntasuku/AI研修講座/gorilla-knowledge/黒崎/AI研修一覧/AI動画生成";

const COURSES = [
  { id: "f12651db-98ac-43d3-a125-f7ee3ee74b7e", folder: "P-01_なぜ今AI動画なのか", title: "P-01: なぜ今AI動画なのか" },
  { id: "b6efa68b-534a-4f1f-9724-38c40541bfad", folder: "P-02_Veo3実践", title: "P-02: Veo3完全攻略" },
  { id: "325dac7e-6154-4e06-8d53-fabe68042c02", folder: "P-03_Runway_HeyGen実践", title: "P-03: Runway＋HeyGen実践" },
  { id: "f4b5d190-84eb-4e39-be2e-68072bb0fcee", folder: "P-04_ElevenLabs実践", title: "P-04: ElevenLabs実践" },
  { id: "f950598d-1e56-4b5f-8d01-4a8dc786ecc0", folder: "P-05_ツール連携ワークフロー", title: "P-05: ツール連携ワークフロー" },
];

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

function loadToken() { try { return JSON.parse(readFileSync(TOKEN_PATH, "utf-8")); } catch { return null; } }
function saveToken(t) { writeFileSync(TOKEN_PATH, JSON.stringify(t)); }

function supabasePatch(courseId, data) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(data);
    const url = new URL(`${SUPABASE_URL}/rest/v1/courses?id=eq.${courseId}`);
    const req = https.request({ hostname: url.hostname, path: url.pathname + url.search, method: "PATCH",
      headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body), "Prefer": "return=representation" }
    }, (res) => { let d = ""; res.on("data", c => d += c); res.on("end", () => resolve({ status: res.statusCode })); });
    req.on("error", reject); req.write(body); req.end();
  });
}

async function authenticate() {
  const token = loadToken();
  if (token) { oauth2Client.setCredentials(token); oauth2Client.on("tokens", t => saveToken({ ...loadToken(), ...t })); console.log("✓ YouTube認証済み\n"); return; }
  console.log("YouTube認証が必要です...");
  const url = oauth2Client.generateAuthUrl({ access_type: "offline", scope: ["https://www.googleapis.com/auth/youtube.upload"], prompt: "consent" });
  const code = await new Promise((resolve) => {
    const server = createServer((req, res) => {
      const u = new URL(req.url, "http://localhost:9876"); const code = u.searchParams.get("code");
      if (code) { res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" }); res.end("<h2>認証完了！閉じてOK</h2>"); server.close(); resolve(code); }
    });
    server.listen(9876, () => { console.log(`\n認証URL:\n${url}\n`); import("child_process").then(({ exec }) => exec(`open "${url}"`)); });
  });
  const { tokens } = await oauth2Client.getToken(code);
  saveToken(tokens); oauth2Client.setCredentials(tokens); oauth2Client.on("tokens", t => saveToken({ ...loadToken(), ...t }));
  console.log("✓ YouTube認証完了\n");
}

async function main() {
  console.log("━━━ AI動画生成講座 YouTube一括アップロード ━━━\n");
  await authenticate();
  const youtube = google.youtube({ version: "v3", auth: oauth2Client });
  const results = [];

  for (const course of COURSES) {
    const videoPath = join(BASE, course.folder, "動画.mp4");
    console.log(`\n[${COURSES.indexOf(course) + 1}/5] ${course.title}`);
    if (!existsSync(videoPath)) { console.log("  ⚠ 動画なし"); results.push({ title: course.title, status: "SKIP" }); continue; }
    const fileSize = statSync(videoPath).size;
    console.log(`  アップロード中... (${(fileSize/1024/1024).toFixed(1)}MB)`);
    try {
      const res = await youtube.videos.insert({
        part: ["snippet", "status"],
        requestBody: { snippet: { title: `AI動画生成講座 ${course.title}`, description: `AI研修: ${course.title}`, categoryId: "27" }, status: { privacyStatus: "unlisted" } },
        media: { body: createReadStream(videoPath) },
      });
      const videoUrl = `https://youtu.be/${res.data.id}`;
      console.log(`  ✓ ${videoUrl}`);
      const resp = await supabasePatch(course.id, { video_url: videoUrl });
      console.log(`  ✓ Supabase更新 (${resp.status})`);
      results.push({ title: course.title, status: "OK", url: videoUrl });
    } catch (e) {
      console.log(`  ✗ ${e.message}`);
      results.push({ title: course.title, status: "ERROR" });
    }
  }

  console.log("\n━━━ 結果 ━━━");
  results.forEach(r => console.log(`  ${r.status === "OK" ? "✓" : "✗"} ${r.title} ${r.url || ""}`));
}

main().catch(e => { console.error("Error:", e.message); process.exit(1); });
