/**
 * 自動セッション保存ログインスクリプト
 * ブラウザが開く → ログインしてもらう → 60秒ごとにセッションを自動保存 → Ctrl+Cで終了
 *
 * 使い方:
 *   npx tsx src/auto-login.ts <service-name> <url>
 */
import { chromium } from "playwright";
import { writeFileSync, mkdirSync, unlinkSync, existsSync } from "fs";

async function main() {
  const serviceName = process.argv[2] || "service";
  const url = process.argv[3] || "https://example.com";
  const sessionPath = `./sessions/${serviceName}.json`;

  mkdirSync("./sessions", { recursive: true });

  const browser = await chromium.launch({
    headless: false,
    args: ["--disable-blink-features=AutomationControlled", "--no-sandbox"],
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  });

  const page = await context.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });

  console.log(`\nブラウザが開きました → ${serviceName} (${url}) にログインしてください`);
  console.log(`10秒ごとにセッションを自動保存します。ログイン後少し待ってください。\n`);

  // 10秒ごとにセッションを自動保存
  const interval = setInterval(async () => {
    try {
      const state = await context.storageState();
      writeFileSync(sessionPath, JSON.stringify(state, null, 2));
    } catch {}
  }, 10000);

  // ブラウザが閉じられたら終了
  browser.on("disconnected", () => {
    clearInterval(interval);
    console.log(`\n✓ セッション保存済み: ${sessionPath}`);
    console.log(`⚠ 使用後は必ず削除してください`);
    process.exit(0);
  });

  // Ctrl+Cで終了
  process.on("SIGINT", async () => {
    clearInterval(interval);
    try {
      const state = await context.storageState();
      writeFileSync(sessionPath, JSON.stringify(state, null, 2));
      console.log(`\n✓ 最終セッション保存: ${sessionPath}`);
    } catch {}
    await browser.close();
    process.exit(0);
  });

  // ブラウザが開いてる限り待つ
  await new Promise(() => {});
}

main().catch(console.error);
