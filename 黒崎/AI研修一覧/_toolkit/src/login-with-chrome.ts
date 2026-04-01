import { chromium } from "playwright";
import { writeFileSync, mkdirSync, readFileSync } from "fs";
import { resolve } from "path";

// .env から認証情報を読み込む
function loadEnv() {
  try {
    const envPath = resolve(__dirname, "../.env");
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

if (!EMAIL || !PASSWORD) {
  console.error("エラー: .env に GOOGLE_EMAIL と GOOGLE_PASSWORD を設定してください");
  process.exit(1);
}

async function main() {
  mkdirSync("./sessions", { recursive: true });

  // システムのChromeを使用（ボット検知回避）
  const browser = await chromium.launch({
    headless: false,
    channel: "chrome",
    args: ["--disable-blink-features=AutomationControlled"],
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
  });

  const page = await context.newPage();

  // Perplexityのログインページへ直接
  console.log("[1] Perplexityログインページへ...");
  await page.goto("https://www.perplexity.ai", { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(4000);
  await page.screenshot({ path: "/tmp/step1.png" });

  // Googleログインボタンを探す
  console.log("[2] Googleログインボタンを探す...");
  const googleBtn = page.locator("button:has-text('Google'), a:has-text('Google'), button:has-text('Googleで続ける')").first();

  if (await googleBtn.count() === 0) {
    // サインインモーダルを開く
    const signInBtn = page.locator("button:has-text('サインイン'), button:has-text('Sign in'), button:has-text('ログイン')").first();
    if (await signInBtn.count() > 0) {
      await signInBtn.click();
      await page.waitForTimeout(2000);
    } else {
      // Computer ボタンをクリックしてログイン画面へ
      await page.goto("https://www.perplexity.ai/search/new", { waitUntil: "domcontentloaded", timeout: 30000 });
      await page.waitForTimeout(3000);
    }
    await page.screenshot({ path: "/tmp/step2.png" });
  }

  // Googleログインボタン再確認
  const googleBtnRetry = page.locator("button:has-text('Google'), button:has-text('Googleで続ける'), button:has-text('Continue with Google')").first();
  if (await googleBtnRetry.count() > 0) {
    console.log("[3] Googleボタンをクリック...");
    await googleBtnRetry.click();
    await page.waitForTimeout(3000);
  } else {
    // 直接Google OAuthへ
    console.log("[3] Google OAuth URLへ直接移動...");
    await page.goto("https://www.perplexity.ai/api/auth/signin/google?callbackUrl=https%3A%2F%2Fwww.perplexity.ai%2F", {
      waitUntil: "domcontentloaded", timeout: 30000
    });
    await page.waitForTimeout(3000);
  }
  await page.screenshot({ path: "/tmp/step3.png" });

  // Google OAuth フォーム
  console.log("[4] Googleアカウント入力...");

  // メール入力
  const emailField = page.locator("input[type='email']");
  if (await emailField.count() > 0) {
    await emailField.fill(EMAIL);
    await page.waitForTimeout(500);
    const nextBtn = page.locator("button:has-text('次へ'), button:has-text('Next'), #identifierNext").first();
    if (await nextBtn.count() > 0) {
      await nextBtn.click();
    } else {
      await page.keyboard.press("Enter");
    }
    await page.waitForTimeout(3000);
    await page.screenshot({ path: "/tmp/step4_email.png" });
  }

  // パスワード入力
  const pwField = page.locator("input[type='password']");
  if (await pwField.count() > 0) {
    await pwField.fill(PASSWORD);
    await page.waitForTimeout(500);
    const loginBtn = page.locator("button:has-text('次へ'), button:has-text('Next'), #passwordNext").first();
    if (await loginBtn.count() > 0) {
      await loginBtn.click();
    } else {
      await page.keyboard.press("Enter");
    }
    await page.waitForTimeout(5000);
    await page.screenshot({ path: "/tmp/step5_password.png" });
  }

  // ログイン完了待機
  await page.waitForTimeout(5000);

  // Perplexityに戻っているか確認
  const currentUrl = page.url();
  console.log("[5] 現在のURL:", currentUrl);
  await page.screenshot({ path: "/tmp/step6_final.png" });

  // セッション保存
  const state = await context.storageState();
  writeFileSync("./sessions/perplexity.json", JSON.stringify(state, null, 2));
  console.log("\n✓ セッション保存完了");

  // ログイン後UIの確認
  if (!currentUrl.includes("perplexity.ai")) {
    await page.goto("https://www.perplexity.ai", { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForTimeout(4000);
    await page.screenshot({ path: "/tmp/step7_perplexity.png" });
    console.log("✓ Perplexityのトップ画面: /tmp/step7_perplexity.png");
  }

  await browser.close();
}

main().catch(console.error);
