#!/usr/bin/env tsx
/**
 * 既存PPTXを使ってパイプライン(TTS→動画→YouTube→LMS)を実行
 */
import fs from "fs";
import path from "path";
import { config } from "dotenv";

// lms-pipeline の各ステップを import
const pipelineDir = path.resolve(__dirname, "../lms-pipeline/src");

config({ path: path.resolve(__dirname, "../lms-pipeline/.env") });

async function main() {
  // 動的import（lms-pipeline のビルドを回避）
  const { generateTTS } = await import(path.join(pipelineDir, "step2-tts.js"));
  const { generateVideo } = await import(path.join(pipelineDir, "step3-video.js"));
  const { uploadToYouTube } = await import(path.join(pipelineDir, "step4-youtube.js"));
  const { registerToLMS } = await import(path.join(pipelineDir, "step5-lms.js"));

  const allParts = [
    { name: "part1", pptx: "part1.pptx" },
    { name: "part2", pptx: "part2.pptx" },
    { name: "part3", pptx: "part3.pptx" },
    { name: "part5", pptx: "part5.pptx" },
  ];

  const baseDir = __dirname;
  const args = process.argv.slice(2);
  const skipYouTube = args.includes("--skip-youtube");
  const skipLMS = args.includes("--skip-lms");

  // 特定パート指定: npx tsx run-pipeline.ts part2 part3
  const specified = args.filter(a => !a.startsWith("--"));
  const parts = specified.length > 0
    ? allParts.filter(p => specified.includes(p.name))
    : allParts;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.error("❌ OPENAI_API_KEY が未設定です。lms-pipeline/.env を確認してください。");
    process.exit(1);
  }

  for (const part of parts) {
    const outlinePath = path.join(baseDir, "output", `${part.name}.json`);
    const pptxPath = path.join(baseDir, part.pptx);
    const outputDir = path.join(baseDir, "output", part.name);

    if (!fs.existsSync(outlinePath)) {
      console.log(`⚠️ ${outlinePath} が見つかりません。スキップ。`);
      continue;
    }
    if (!fs.existsSync(pptxPath)) {
      console.log(`⚠️ ${pptxPath} が見つかりません。スキップ。`);
      continue;
    }

    fs.mkdirSync(outputDir, { recursive: true });

    const outline = JSON.parse(fs.readFileSync(outlinePath, "utf-8"));
    console.log(`\n${"═".repeat(50)}`);
    console.log(`🚀 ${outline.title}`);
    console.log(`${"═".repeat(50)}`);

    // Step 2: TTS
    const audioDir = await generateTTS(outline, outputDir, apiKey);

    // Step 3: Video（既存PPTXを使用）
    const videoPath = await generateVideo(outline, pptxPath, audioDir, outputDir);

    if (!videoPath) {
      console.log(`❌ ${part.name} の動画生成に失敗しました。`);
      continue;
    }

    // Step 4: YouTube
    let youtubeUrl: string | null = null;
    if (!skipYouTube) {
      youtubeUrl = await uploadToYouTube(outline, videoPath, {
        clientId: process.env.YOUTUBE_CLIENT_ID || "",
        clientSecret: process.env.YOUTUBE_CLIENT_SECRET || "",
        refreshToken: process.env.YOUTUBE_REFRESH_TOKEN || "",
      });
    }

    // Step 5: LMS
    if (!skipLMS) {
      await registerToLMS(outline, youtubeUrl, {
        adminUrl: process.env.LMS_ADMIN_URL || "https://lms-admin-neon.vercel.app",
        email: process.env.LMS_ADMIN_EMAIL || "",
        password: process.env.LMS_ADMIN_PASSWORD || "",
      });
    }

    console.log(`✅ ${part.name} 完了`);
  }

  console.log(`\n${"═".repeat(50)}`);
  console.log(`✅ 全パート完了!`);
  console.log(`${"═".repeat(50)}\n`);
}

main().catch(console.error);
