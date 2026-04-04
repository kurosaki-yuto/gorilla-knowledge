/**
 * カット済み動画を再アップロード → 旧動画削除 → LMS更新
 */
import fs from "fs";
import path from "path";
import { config } from "dotenv";
import { google } from "googleapis";

config({ path: path.join(import.meta.dirname, "../lms-pipeline/.env") });

const SERVICE_KEY = (() => {
  try {
    const env = fs.readFileSync(path.join(import.meta.dirname, "../lms-admin/.env.local"), "utf-8");
    const m = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/);
    return m ? m[1].trim() : "";
  } catch { return ""; }
})();
const BASE = "https://ajfwzicdperweolgifkb.supabase.co/rest/v1";
const HEADERS: Record<string, string> = {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
  "Content-Type": "application/json",
  Prefer: "return=representation",
};

const oauth2 = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET
);
oauth2.setCredentials({ refresh_token: process.env.YOUTUBE_REFRESH_TOKEN });
const youtube = google.youtube({ version: "v3", auth: oauth2 });

const DIR = import.meta.dirname;

// 旧動画ID（削除対象）
const OLD_IDS = ["pxLIpNGvDBs", "y40igPMfuhg", "hcPajfrCKrw", "dyS0YWk5ZlQ", "2_Lujpj0pys"];

const PARTS = [
  { file: "Part1_clean.mp4", title: "ChatGPTの全体像と最新モデル整理", contentId: "cnt-gpt-01" },
  { file: "Part2_clean.mp4", title: "セットアップと業務文書作成", contentId: "cnt-gpt-02" },
  { file: "Part3_clean.mp4", title: "キャンバス機能とデータ分析", contentId: "cnt-gpt-03" },
  { file: "Part4_clean.mp4", title: "画像生成（DALL-E）とキャンバス活用", contentId: "cnt-gpt-04" },
  { file: "Part5_clean.mp4", title: "GPTs作成ライブデモ", contentId: "cnt-gpt-05" },
];

async function main() {
  console.log("\n🔄 カット済み動画を再アップロード\n");

  // 旧動画削除
  for (const oldId of OLD_IDS) {
    try {
      await youtube.videos.delete({ id: oldId });
      console.log(`🗑️  旧動画削除: ${oldId}`);
    } catch (e: any) {
      console.log(`⚠️  旧動画削除スキップ: ${oldId} (${e.message})`);
    }
  }
  console.log();

  for (let i = 0; i < PARTS.length; i++) {
    const part = PARTS[i];
    const videoPath = path.join(DIR, part.file);

    console.log(`[${i + 1}/5] ${part.title}`);
    console.log("  📤 アップロード中...");

    const response = await youtube.videos.insert({
      part: ["snippet", "status"],
      requestBody: {
        snippet: {
          title: `【ChatGPT実践】${part.title}`,
          description: `ChatGPT実践：万能AIアシスタントを業務に組み込む（Part ${i + 1}/5）\n#AI研修 #ChatGPT #eラーニング`,
          tags: ["AI研修", "ChatGPT", "eラーニング", "LMS", "実践"],
          defaultLanguage: "ja",
          defaultAudioLanguage: "ja",
        },
        status: {
          privacyStatus: "unlisted",
          selfDeclaredMadeForKids: false,
        },
      },
      media: { body: fs.createReadStream(videoPath) },
    });

    const videoId = response.data.id;
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    console.log(`  ✅ ${embedUrl}`);

    // LMS更新
    await fetch(`${BASE}/contents?id=eq.${part.contentId}`, {
      method: "PATCH",
      headers: HEADERS,
      body: JSON.stringify({ video_url: embedUrl }),
    });
    console.log(`  ✅ LMS更新`);
    console.log();
  }

  console.log("=== 再アップロード完了 ===\n");
}

main().catch(err => { console.error("❌", err); process.exit(1); });
