/**
 * 手動ログイン → セッション保存スクリプト
 *
 * 使い方:
 *   npx tsx src/manual-login.ts
 *
 * ブラウザが開くので、手動でGoogleログインしてください。
 * ログイン完了後、Enterキーを押すとセッションが保存されます。
 */
import { chromium } from "playwright";
import { writeFileSync, mkdirSync } from "fs";
import * as readline from "readline";

async function main() {
  mkdirSync("./sessions", { recursive: true });

  // 実際のChrome風のブラウザで起動（ボット検知回避）
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
  await page.goto("https://www.perplexity.ai", { waitUntil: "domcontentloaded", timeout: 60000 });

  console.log("\n==========================================");
  console.log("ブラウザが開きました。");
  console.log("Perplexityにログインしてください。");
  console.log("ログイン完了後、ここでEnterキーを押してください。");
  console.log("==========================================\n");

  // Enterキー待機
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  await new Promise<void>(resolve => {
    rl.question("ログイン完了したらEnterを押してください: ", () => {
      rl.close();
      resolve();
    });
  });

  // セッション保存
  const state = await context.storageState();
  writeFileSync("./sessions/perplexity.json", JSON.stringify(state, null, 2));
  console.log("✓ セッション保存完了: ./sessions/perplexity.json");

  // ログイン後のUIを確認
  await page.screenshot({ path: "/tmp/logged_in.png" });
  console.log("✓ スクリーンショット: /tmp/logged_in.png");

  await browser.close();
  console.log("✓ 完了");
}

main().catch(console.error);
