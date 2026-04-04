#!/usr/bin/env npx tsx
/**
 * Chromeプロファイル使用の画面録画スクリプト
 *
 * 実際のChromeブラウザのプロファイル（Googleログイン済み）を使って録画する。
 * Playwrightの独自ブラウザではなく、ユーザーのChromeプロファイルのクッキーを活用。
 *
 * 使い方:
 *   npx tsx src/record-with-chrome.ts --scenario scenarios/xxx.json --output recordings/xxx/
 *
 * 注意: Chrome本体を閉じてから実行すること（プロファイルロック回避）
 */

import { readFileSync, mkdirSync, cpSync, existsSync } from "fs";
import { resolve, join } from "path";
import { chromium, Page } from "playwright";

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

const CHROME_PROFILE = resolve(
  process.env.HOME || "",
  "Library/Application Support/Google/Chrome"
);

async function waitForAIResponse(
  page: Page,
  opts: { timeout?: number; stableMs?: number } = {}
) {
  const timeout = opts.timeout || 30000;
  const stableMs = opts.stableMs || 2000;
  const start = Date.now();
  let lastText = "";
  let stableSince = 0;

  while (Date.now() - start < timeout) {
    const text = await page.evaluate(() => document.body.innerText).catch(() => "");
    if (text !== lastText) {
      lastText = text;
      stableSince = Date.now();
    } else if (Date.now() - stableSince >= stableMs && stableSince > 0) {
      console.log(`  → AI応答安定 (${((Date.now() - start) / 1000).toFixed(1)}秒)`);
      return;
    }
    await page.waitForTimeout(500);
  }
  console.log(`  → AI応答タイムアウト (${timeout / 1000}秒)`);
}

async function main() {
  const args = parseArgs();
  const scenario: Scenario = JSON.parse(readFileSync(args.scenario, "utf-8"));
  const outputDir = resolve(args.output);
  mkdirSync(outputDir, { recursive: true });

  const viewport = scenario.viewport || { width: 1920, height: 1080 };

  // Chromeプロファイルのコピーを作成（ロック回避）
  const tempProfile = resolve("/tmp/chrome-playwright-profile");
  if (!existsSync(tempProfile)) {
    console.log("[準備] Chromeプロファイルをコピー中...");
    cpSync(CHROME_PROFILE, tempProfile, {
      recursive: true,
      filter: (src) => {
        // 大きなキャッシュや不要ファイルをスキップ
        if (src.includes("/Cache/") || src.includes("/Code Cache/") ||
            src.includes("/GPUCache/") || src.includes("/Service Worker/") ||
            src.includes("/IndexedDB/") || src.includes("SingletonLock") ||
            src.includes("SingletonSocket") || src.includes("SingletonCookie")) {
          return false;
        }
        return true;
      },
    });
    console.log("  → コピー完了");
  }

  console.log(`[録画開始] ${scenario.service} — ${scenario.url}`);
  console.log(`[解像度] ${viewport.width}x${viewport.height}`);

  const context = await chromium.launchPersistentContext(
    join(tempProfile, "Default"),
    {
      headless: false,
      channel: "chrome",
      viewport,
      recordVideo: { dir: outputDir, size: viewport },
      args: [
        "--disable-blink-features=AutomationControlled",
        "--no-sandbox",
        "--start-fullscreen",
      ],
      ignoreDefaultArgs: ["--enable-automation"],
    }
  );

  const page = context.pages()[0] || (await context.newPage());

  try {
    await page.goto(scenario.url, { waitUntil: "domcontentloaded", timeout: 60000 });
    console.log(`[移動] ${scenario.url}`);

    // 全画面
    await page.evaluate(() => document.documentElement.requestFullscreen().catch(() => {}));
    await page.waitForTimeout(2000);

    // ポップアップ閉じる
    await page.keyboard.press("Escape").catch(() => {});
    await page.waitForTimeout(500);

    // ステップ実行
    for (let i = 0; i < scenario.steps.length; i++) {
      const step = scenario.steps[i];
      console.log(`[Step ${i + 1}/${scenario.steps.length}] ${step.action}${getStepDetail(step)}`);
      await executeStep(page, step);
    }

    await page.waitForTimeout(2000);
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
      await page.waitForSelector(step.selector, { timeout: 10000 });
      await page.click(step.selector);
      await page.waitForTimeout(300);
      break;
    case "type":
      if (step.selector) {
        await page.waitForSelector(step.selector, { timeout: 10000 });
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
      await waitForAIResponse(page, { timeout: step.timeout, stableMs: step.stableMs });
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
      await page.evaluate(
        ({ sel, dur }) => {
          const el = document.querySelector(sel);
          if (!el) return;
          const orig = (el as HTMLElement).style.cssText;
          (el as HTMLElement).style.cssText += "outline: 3px solid red !important; outline-offset: 2px !important;";
          setTimeout(() => { (el as HTMLElement).style.cssText = orig; }, dur);
        },
        { sel: step.selector, dur }
      );
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
    case "waitForAI": return ` (timeout: ${(step as any).timeout || 30000}ms)`;
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
    console.error("Usage: npx tsx src/record-with-chrome.ts --scenario <path.json> [--output <dir>]");
    process.exit(1);
  }
  return { scenario: resolve(scenario), output };
}

main().catch((err) => { console.error(err); process.exit(1); });
