import { chromium } from "playwright";
import { writeFileSync, mkdirSync, readFileSync } from "fs";
import { resolve } from "path";

// .env から認証情報を読み込む
function loadEnv() {
  try {
    const envPath = resolve(process.cwd(), ".env");
    const content = readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (match) process.env[match[1].trim()] = match[2].trim();
    }
  } catch {}
}
loadEnv();

const EMAIL = process.env.GOOGLE_EMAIL || "";
const PASSWORD = process.env.GOOGLE_PASSWORD || "";
const SESSION_PATH = "./sessions/perplexity.json";

if (!EMAIL || !PASSWORD) {
  console.error("エラー: .env に GOOGLE_EMAIL と GOOGLE_PASSWORD を設定してください");
  console.error("  cp .env.example .env して編集してください");
  process.exit(1);
}

async function main() {
  mkdirSync("./sessions", { recursive: true });

  // ボット検知回避
  const browser = await chromium.launch({
    headless: false,
    channel: "chrome",
    args: [
      "--disable-blink-features=AutomationControlled",
      "--no-sandbox",
      "--disable-dev-shm-usage",
    ],
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  });
  const page = await context.newPage();

  console.log("[1] Perplexityにアクセス...");
  await page.goto("https://www.perplexity.ai", { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(5000);

  // ログインボタンを探してクリック
  console.log("[2] ログインボタンを探す...");
  const loginSelectors = [
    "button:has-text('サインイン')",
    "button:has-text('Sign in')",
    "a:has-text('サインイン')",
    "a:has-text('Sign in')",
    "[href*='login']",
    "[href*='signin']",
  ];

  let clicked = false;
  for (const sel of loginSelectors) {
    const count = await page.locator(sel).count();
    if (count > 0) {
      await page.click(sel);
      clicked = true;
      console.log(`  → ${sel} クリック`);
      break;
    }
  }

  if (!clicked) {
    // 直接ログインページへ
    await page.goto("https://www.perplexity.ai/settings/account", { waitUntil: "domcontentloaded", timeout: 30000 });
  }

  await page.waitForTimeout(2000);
  await page.screenshot({ path: "/tmp/login_01.png" });

  // Googleでログインボタンを探す
  console.log("[3] Googleでログインをクリック...");
  const googleSelectors = [
    "button:has-text('Google')",
    "a:has-text('Google')",
    "[aria-label*='Google']",
    "button:has-text('Googleで続ける')",
    "button:has-text('Continue with Google')",
  ];

  for (const sel of googleSelectors) {
    const count = await page.locator(sel).count();
    if (count > 0) {
      await page.click(sel);
      console.log(`  → ${sel} クリック`);
      break;
    }
  }

  await page.waitForTimeout(3000);
  await page.screenshot({ path: "/tmp/login_02.png" });

  // Google OAuth フロー
  console.log("[4] Google OAuthフロー...");

  // メールアドレス入力
  const emailInput = page.locator("input[type='email']");
  if (await emailInput.count() > 0) {
    console.log("  → メールアドレス入力");
    await emailInput.fill(EMAIL);
    await page.keyboard.press("Enter");
    await page.waitForTimeout(4000);
    await page.screenshot({ path: "/tmp/login_03_email.png" });
  }

  // パスキー認証をスキップして「別の方法を試す」→ パスワード入力
  const altMethod = page.locator("text=別の方法を試す").or(page.locator("text=Try another way"));
  if (await altMethod.count() > 0) {
    console.log("  → パスキー認証をスキップ（別の方法を試す）");
    await altMethod.first().click();
    await page.waitForTimeout(3000);
    await page.screenshot({ path: "/tmp/login_alt_method.png" });

    // パスワードオプションを選択
    const pwOption = page.locator("text=パスワードを入力").or(page.locator("text=Enter your password")).or(page.locator("[data-challengeid='4']"));
    if (await pwOption.count() > 0) {
      await pwOption.first().click();
      await page.waitForTimeout(3000);
    }
  }

  // パスワード入力
  const passwordInput = page.locator("input[type='password']");
  if (await passwordInput.count() > 0) {
    console.log("  → パスワード入力");
    await passwordInput.fill(PASSWORD);
    await page.keyboard.press("Enter");
    await page.waitForTimeout(8000);
    await page.screenshot({ path: "/tmp/login_04_password.png" });
  }

  // Cloudflareチャレンジ検出と待機
  const cloudflareCheck = await page.evaluate(() => {
    const text = document.body.innerText;
    return text.includes("セキュリティ検証") || text.includes("Cloudflare");
  });

  if (cloudflareCheck) {
    console.log("  → Cloudflareセキュリティ検証中...");
    await page.waitForTimeout(8000);
    await page.screenshot({ path: "/tmp/login_cloudflare.png" });
  }

  // Perplexityページへの遷移完了待機
  console.log("  → Perplexityページ遷移待機...");
  try {
    await page.waitForURL("**/perplexity.ai/**", { timeout: 30000 });
  } catch (e) {
    console.log("  → URLチェック失敗（Perplexityにいるかもしれません）");
  }

  await page.waitForTimeout(5000);
  await page.screenshot({ path: "/tmp/login_05_result.png" });
  console.log("  → スクリーンショット: /tmp/login_05_result.png");

  // セッション保存
  console.log("\n[セッション保存中...]");
  const state = await context.storageState();
  writeFileSync(SESSION_PATH, JSON.stringify(state, null, 2));
  console.log(`✓ セッション保存: ${SESSION_PATH}`);

  // ログイン後のUIを確認
  console.log("\n[確認] Perplexityトップページを訪問...");
  await page.goto("https://www.perplexity.ai", { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(5000);
  await page.screenshot({ path: "/tmp/login_06_loggedin.png" });
  console.log("✓ ログイン後の画面: /tmp/login_06_loggedin.png");

  // Focus / Pro Search ボタンを確認
  const buttons = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("button"))
      .map(b => b.textContent?.trim().slice(0, 60))
      .filter(Boolean);
  });
  console.log("\n✓ ボタン検出:", buttons.slice(0, 20));

  await browser.close();
}

main().catch(console.error);
