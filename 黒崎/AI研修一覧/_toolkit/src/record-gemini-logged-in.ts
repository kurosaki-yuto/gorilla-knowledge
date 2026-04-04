#!/usr/bin/env npx tsx
/**
 * Gemini ログイン済み録画スクリプト
 *
 * Chromeプロファイルを使ってGeminiにログインし、シナリオを録画する。
 *
 * 使い方:
 *   npx tsx src/record-gemini-logged-in.ts \
 *     --scenario scenarios/gemini-p02-workspace-integration.json \
 *     --output recordings/gemini-P-02/
 */

import { readFileSync, mkdirSync, writeFileSync } from "fs";
import { resolve, join } from "path";
import { chromium, Page, BrowserContext } from "playwright";

interface Scenario {
  service: string;
  url: string;
  viewport?: { width: number; height: number };
  steps: Step[];
}

type Step =
  | { action: "goto"; url: string }
  | { action: "click"; selector: string; description?: string }
  | { action: "type"; text: string; delay?: number; selector?: string }
  | { action: "press"; key: string }
  | { action: "waitForAI"; timeout?: number; stableMs?: number }
  | { action: "wait"; ms: number }
  | { action: "scroll"; direction: "up" | "down"; amount: number }
  | { action: "screenshot"; path: string }
  | { action: "highlight"; selector: string; duration?: number };

const CHROME_PROFILE = "/tmp/chrome-playwright-profile/Default";

async function waitForAIResponse(page: Page, opts: { timeout?: number; stableMs?: number } = {}) {
  const timeout = opts.timeout || 60000;
  const stableMs = opts.stableMs || 5000; // 5秒の安定で応答完了とみなす
  const start = Date.now();
  let lastText = "";
  let stableSince = 0;

  while (Date.now() - start < timeout) {
    const text = await page.evaluate(() => document.body.innerText).catch(() => "");
    if (text !== lastText) {
      lastText = text;
      stableSince = Date.now();
    } else if (Date.now() - stableSince >= stableMs && stableSince > 0) {
      console.log(`  → AI応答完了 (${((Date.now() - start) / 1000).toFixed(1)}秒)`);
      return;
    }
    await page.waitForTimeout(500);
  }
  console.log(`  → AI応答タイムアウト (${timeout / 1000}秒)`);
}

async function loginToGemini(page: Page): Promise<boolean> {
  console.log("[ログイン] Geminiへのログインを開始...");

  // 既にログイン済みかチェック
  const loginBtn = page.locator("a:has-text('ログイン'), button:has-text('ログイン'), a:has-text('Sign in'), button:has-text('Sign in')");
  if (await loginBtn.count() === 0) {
    console.log("  → 既にログイン済み");
    return true;
  }

  // 1. ログインボタンクリック
  await loginBtn.first().click();
  console.log("  [1] ログインボタンクリック");
  await page.waitForTimeout(5000);

  // 2. メールアドレス入力（ログインページが出た場合）
  const emailInput = page.locator("input[type='email']");
  if (await emailInput.count() > 0) {
    console.log("  [2] メールアドレス入力");
    await emailInput.fill("gkoinobori0505@gmail.com");
    await page.locator("button:has-text('次へ'), button:has-text('Next')").first().click();
    await page.waitForTimeout(5000);
    await page.screenshot({ path: "/tmp/gemini_login_step2.png" });
  }

  // 3. パスキー画面 → 「別の方法を試す」
  for (let retry = 0; retry < 3; retry++) {
    const altLink = page.locator("text=別の方法を試す").or(page.locator("text=Try another way"));
    if (await altLink.count() > 0) {
      console.log("  [3] パスキーをスキップ → 別の方法を試す");
      await altLink.first().click();
      await page.waitForTimeout(4000);
      await page.screenshot({ path: "/tmp/gemini_login_step3.png" });
      break;
    }
    // まだ表示されてない可能性、少し待つ
    await page.waitForTimeout(2000);
  }

  // 4. パスワード入力オプションを選択
  const pwOptionSelectors = [
    "div:has-text('パスワードを入力')",
    "li:has-text('パスワードを入力')",
    "text=パスワードを入力",
    "div:has-text('Enter your password')",
    "[data-challengeid='4']",
  ];
  for (const sel of pwOptionSelectors) {
    try {
      const el = page.locator(sel);
      if (await el.count() > 0) {
        console.log(`  [4] パスワード方式を選択: ${sel}`);
        await el.first().click();
        await page.waitForTimeout(4000);
        break;
      }
    } catch {}
  }
  await page.screenshot({ path: "/tmp/gemini_login_step4.png" });

  // 5. パスワード入力 — visible なフィールドを探す
  console.log("  [5] パスワード入力...");
  try {
    // visible なパスワードフィールドを待つ
    await page.waitForSelector("input[type='password']:visible", { timeout: 10000 });
    await page.locator("input[type='password']:visible").fill(process.env.GOOGLE_PASSWORD || "");
    await page.locator("button:has-text('次へ'), button:has-text('Next')").first().click();
    console.log("  → パスワード送信");
    await page.waitForTimeout(8000);
  } catch {
    console.log("  → visible パスワードフィールドなし、JavaScript で入力を試行");
    // fallback: JS で直接入力
    await page.evaluate((pw) => {
      const inputs = document.querySelectorAll("input[type='password']");
      for (const input of inputs) {
        (input as HTMLInputElement).value = pw;
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }, process.env.GOOGLE_PASSWORD || "");
    await page.waitForTimeout(1000);
    // 次へボタン
    const nextBtn = page.locator("button:has-text('次へ'), button:has-text('Next'), button[type='submit']");
    if (await nextBtn.count() > 0) {
      await nextBtn.first().click();
      await page.waitForTimeout(8000);
    }
  }

  await page.screenshot({ path: "/tmp/gemini_login_step5.png" });

  // 6. Geminiに戻るのを待つ
  try {
    await page.waitForURL("**/gemini.google.com/**", { timeout: 30000 });
  } catch {
    console.log("  → Geminiへの遷移待機タイムアウト");
  }

  await page.waitForTimeout(3000);
  await page.screenshot({ path: "/tmp/gemini_login_final.png" });

  // ログイン成功確認
  const stillHasLogin = await page.locator("a:has-text('ログイン'), a:has-text('Sign in')").count();
  if (stillHasLogin === 0) {
    console.log("  → ✓ ログイン成功!");
    return true;
  }

  console.log("  → ✗ ログイン失敗");
  return false;
}

async function main() {
  const args = parseArgs();
  const scenario: Scenario = JSON.parse(readFileSync(args.scenario, "utf-8"));
  const outputDir = resolve(args.output);
  mkdirSync(outputDir, { recursive: true });

  const viewport = scenario.viewport || { width: 1920, height: 1080 };

  console.log(`[設定] シナリオ: ${args.scenario}`);
  console.log(`[設定] 出力: ${outputDir}`);

  // ログイン + 録画を同一コンテキストで実行
  const context = await chromium.launchPersistentContext(CHROME_PROFILE, {
    headless: false,
    channel: "chrome",
    viewport,
    recordVideo: { dir: outputDir, size: viewport },
    args: [
      "--disable-blink-features=AutomationControlled",
      "--no-sandbox",
      "--start-fullscreen",
      "--disable-features=WebAuthentication",
      "--disable-webauthn",
    ],
    ignoreDefaultArgs: ["--enable-automation"],
    locale: "ja-JP",
  });

  const page = context.pages()[0] || await context.newPage();

  try {
    // 1. Geminiにアクセス
    await page.goto("https://gemini.google.com", { waitUntil: "domcontentloaded", timeout: 60000 });
    console.log(`[移動] ${scenario.url}`);
    await page.waitForTimeout(3000);

    // 2. ログインが必要ならログイン
    const needsLogin = await page.locator("a:has-text('ログイン'), a:has-text('Sign in')").count() > 0;
    if (needsLogin) {
      console.log("[ログイン必要]");
      const loggedIn = await loginToGemini(page);
      if (!loggedIn) {
        console.error("[エラー] ログインできませんでした");
        process.exit(1);
      }
      // ログイン後、Geminiトップに戻る
      await page.goto("https://gemini.google.com", { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.waitForTimeout(3000);
    } else {
      console.log("[ログイン済み]");
    }

    // 3. 録画開始前のクリーンな状態を確保
    await page.evaluate(() => document.documentElement.requestFullscreen().catch(() => {}));
    await page.waitForTimeout(2000);
    await page.keyboard.press("Escape").catch(() => {});
    await page.waitForTimeout(1000);

    // 4. シナリオ実行
    for (let i = 0; i < scenario.steps.length; i++) {
      const step = scenario.steps[i];
      console.log(`[Step ${i + 1}/${scenario.steps.length}] ${step.action}${getStepDetail(step)}`);
      await executeStep(page, step);
    }

    await page.waitForTimeout(3000);
    console.log(`[録画完了]`);
  } catch (err) {
    console.error(`[エラー]`, err);
    await page.screenshot({ path: join(outputDir, "error.png") });
    throw err;
  } finally {
    const videoPath = await page.video()?.path();
    await context.close();
    if (videoPath) console.log(`[出力] ${videoPath}`);
  }
}

async function executeStep(page: Page, step: Step): Promise<void> {
  switch (step.action) {
    case "goto":
      await page.goto(step.url, { waitUntil: "domcontentloaded", timeout: 60000 });
      break;
    case "click":
      await page.waitForSelector(step.selector, { timeout: 15000 });
      await page.click(step.selector);
      await page.waitForTimeout(300);
      break;
    case "type":
      if (step.selector) {
        await page.waitForSelector(step.selector, { timeout: 15000 });
        await page.click(step.selector);
      }
      for (const char of step.text) {
        await page.keyboard.type(char, { delay: step.delay ?? 50 });
      }
      await page.waitForTimeout(200);
      break;
    case "press":
      await page.keyboard.press(step.key);
      await page.waitForTimeout(300);
      break;
    case "waitForAI":
      await waitForAIResponse(page, { timeout: step.timeout, stableMs: step.stableMs || 5000 });
      await page.keyboard.press("Escape").catch(() => {});
      break;
    case "wait":
      await page.waitForTimeout(step.ms);
      break;
    case "scroll":
      await page.mouse.wheel(0, step.direction === "down" ? step.amount : -step.amount);
      await page.waitForTimeout(500);
      break;
    case "screenshot":
      await page.screenshot({ path: step.path });
      break;
    case "highlight": {
      const dur = step.duration ?? 2000;
      await page.evaluate(({ sel, dur }) => {
        const el = document.querySelector(sel);
        if (!el) return;
        const orig = (el as HTMLElement).style.cssText;
        (el as HTMLElement).style.cssText += "outline:3px solid red!important;outline-offset:2px!important;";
        setTimeout(() => { (el as HTMLElement).style.cssText = orig; }, dur);
      }, { sel: step.selector, dur });
      await page.waitForTimeout(dur);
      break;
    }
  }
}

function getStepDetail(step: Step): string {
  switch (step.action) {
    case "click": return ` → ${(step as any).description || step.selector}`;
    case "type": return ` → "${step.text.slice(0, 30)}..."`;
    case "press": return ` → ${step.key}`;
    case "waitForAI": return ` (timeout: ${(step as any).timeout || 60000}ms, stable: ${(step as any).stableMs || 5000}ms)`;
    case "wait": return ` → ${step.ms}ms`;
    case "scroll": return ` → ${step.direction} ${step.amount}px`;
    default: return "";
  }
}

function parseArgs(): { scenario: string; output: string } {
  const args = process.argv.slice(2);
  let scenario = "", output = "recordings";
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--scenario" && args[i + 1]) scenario = args[++i];
    else if (args[i] === "--output" && args[i + 1]) output = args[++i];
  }
  if (!scenario) {
    console.error("Usage: npx tsx src/record-gemini-logged-in.ts --scenario <path.json> --output <dir>");
    process.exit(1);
  }
  return { scenario: resolve(scenario), output };
}

main().catch((err) => { console.error(err); process.exit(1); });
