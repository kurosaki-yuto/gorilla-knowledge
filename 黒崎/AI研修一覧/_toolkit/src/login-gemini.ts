/**
 * Gemini ログイン → セッション保存スクリプト
 *
 * gemini.google.com にGoogleアカウントでログインし、セッションを保存する。
 *
 * 使い方:
 *   npx tsx src/login-gemini.ts
 */
import "dotenv/config";
import { chromium } from "playwright";
import { writeFileSync, mkdirSync, existsSync, readFileSync } from "fs";

const EMAIL = process.env.GOOGLE_EMAIL || "";
const PASSWORD = process.env.GOOGLE_PASSWORD || "";
const SESSION_PATH = "./sessions/gemini.json";

if (!EMAIL || !PASSWORD) {
  console.error("エラー: .env に GOOGLE_EMAIL と GOOGLE_PASSWORD を設定してください");
  process.exit(1);
}

async function main() {
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
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    locale: "ja-JP",
  });

  const page = await context.newPage();

  // 1. Gemini にアクセス
  console.log("[1] gemini.google.com にアクセス...");
  await page.goto("https://gemini.google.com", { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: "/tmp/gemini_login_01.png" });

  // 2. ログインボタンをクリック（右上）
  console.log("[2] ログインボタンを探す...");
  const loginSelectors = [
    "a[href*='accounts.google.com']",
    "button:has-text('ログイン')",
    "button:has-text('Sign in')",
    "a:has-text('ログイン')",
    "a:has-text('Sign in')",
    "[aria-label*='ログイン']",
    "[aria-label*='Sign in']",
  ];

  let clicked = false;
  for (const sel of loginSelectors) {
    const count = await page.locator(sel).count();
    if (count > 0) {
      await page.locator(sel).first().click();
      clicked = true;
      console.log(`  → ${sel} クリック`);
      break;
    }
  }

  if (!clicked) {
    console.log("  → ログインボタンが見つからない。直接Googleログインページへ...");
    await page.goto("https://accounts.google.com/signin/v2/identifier?service=bard&flowName=GlifWebSignIn", {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });
  }

  await page.waitForTimeout(3000);
  await page.screenshot({ path: "/tmp/gemini_login_02.png" });

  // 3. メールアドレス入力
  console.log("[3] メールアドレス入力...");
  const emailInput = page.locator("input[type='email']");
  if (await emailInput.count() > 0) {
    await emailInput.fill(EMAIL);
    await page.keyboard.press("Enter");
    await page.waitForTimeout(4000);
    await page.screenshot({ path: "/tmp/gemini_login_03_email.png" });
  }

  // 4. パスキー認証スキップ — ページが読み込まれるまで待つ
  console.log("[4] パスキー認証ページを待機...");
  try {
    await page.waitForSelector("text=別の方法を試す", { timeout: 15000 });
    console.log("  → 「別の方法を試す」を発見、クリック");
    await page.click("text=別の方法を試す");
    await page.waitForTimeout(3000);
    await page.screenshot({ path: "/tmp/gemini_login_04a_alt.png" });

    // パスワードオプションを選択
    const pwSelectors = [
      "text=パスワードを入力",
      "text=Enter your password",
      "[data-challengeid='4']",
      "li:has-text('パスワード')",
    ];
    for (const sel of pwSelectors) {
      const count = await page.locator(sel).count();
      if (count > 0) {
        console.log(`  → ${sel} クリック`);
        await page.locator(sel).first().click();
        await page.waitForTimeout(3000);
        break;
      }
    }
  } catch {
    console.log("  → パスキーページなし、パスワード入力を試行");
  }

  // 5. パスワード入力 — フィールドが出るまで待つ
  console.log("[5] パスワード入力...");
  try {
    await page.waitForSelector("input[type='password']", { timeout: 15000 });
    const passwordInput = page.locator("input[type='password']");
    await passwordInput.fill(PASSWORD);
    await page.keyboard.press("Enter");
    await page.waitForTimeout(8000);
    await page.screenshot({ path: "/tmp/gemini_login_04_password.png" });
  } catch {
    console.log("  → パスワードフィールドが見つからない");
    await page.screenshot({ path: "/tmp/gemini_login_04_no_password.png" });
  }

  // 6. Geminiへのリダイレクト待機
  console.log("[6] Geminiページ遷移待機...");
  try {
    await page.waitForURL("**/gemini.google.com/**", { timeout: 30000 });
  } catch {
    console.log("  → URL待機タイムアウト（すでにGeminiにいるかも）");
  }

  await page.waitForTimeout(5000);
  await page.screenshot({ path: "/tmp/gemini_login_05_result.png" });

  // 7. ログイン確認 — 入力欄があるか
  const hasTextarea = await page.locator("textarea, [role='textbox'][contenteditable='true']").count();
  console.log(`  → 入力欄検出: ${hasTextarea > 0 ? "✓ ログイン成功" : "✗ ログイン未確認"}`);

  // 8. セッション保存
  console.log("\n[セッション保存]");
  const state = await context.storageState();
  writeFileSync(SESSION_PATH, JSON.stringify(state, null, 2));
  console.log(`✓ 保存: ${SESSION_PATH}`);

  await browser.close();
  console.log("✓ 完了");
}

main().catch(console.error);
