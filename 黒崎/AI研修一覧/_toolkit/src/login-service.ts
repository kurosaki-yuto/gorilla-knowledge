/**
 * 汎用ログイン → セッション保存スクリプト
 * セッションは使い終わったらすぐ削除される前提。
 *
 * 使い方:
 *   npx tsx src/login-service.ts <service-name> <url>
 *
 * 例:
 *   npx tsx src/login-service.ts google-ai-studio https://aistudio.google.com
 *   npx tsx src/login-service.ts heygen https://app.heygen.com
 *   npx tsx src/login-service.ts elevenlabs https://elevenlabs.io
 */
import { chromium } from "playwright";
import { writeFileSync, mkdirSync } from "fs";
import * as readline from "readline";

async function main() {
  const serviceName = process.argv[2] || "service";
  const url = process.argv[3] || "https://example.com";
  const sessionPath = `./sessions/${serviceName}.json`;

  mkdirSync("./sessions", { recursive: true });

  const browser = await chromium.launch({
    headless: false,
    args: [
      "--disable-blink-features=AutomationControlled",
      "--no-sandbox",
    ],
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  });

  const page = await context.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });

  console.log(`\n${"=".repeat(50)}`);
  console.log(`ブラウザが開きました。`);
  console.log(`${serviceName} (${url}) にログインしてください。`);
  console.log(`ログイン完了後、ここでEnterキーを押してください。`);
  console.log(`${"=".repeat(50)}\n`);

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  await new Promise<void>(resolve => {
    rl.question("ログイン完了したらEnterを押してください: ", () => {
      rl.close();
      resolve();
    });
  });

  const state = await context.storageState();
  writeFileSync(sessionPath, JSON.stringify(state, null, 2));
  console.log(`✓ セッション保存: ${sessionPath}`);
  console.log(`⚠ 使用後は必ず削除: rm ${sessionPath}`);

  await browser.close();
}

main().catch(console.error);
