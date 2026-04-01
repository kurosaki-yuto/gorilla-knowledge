#!/usr/bin/env npx tsx
/**
 * 画面操作録画スクリプト
 *
 * Playwrightでブラウザを自動操作し、recordVideoで録画する。
 * シナリオJSONに従って操作を実行。
 *
 * 使い方:
 *   npx tsx src/record-screen.ts --scenario scenarios/perplexity-search.json [--output recordings/]
 */

import "dotenv/config";
import { readFileSync, mkdirSync } from "fs";
import { resolve, join } from "path";
import { Page } from "playwright";
import { createBrowserContext } from "./utils/browser-session.js";
import { waitForAIResponse } from "./utils/wait-ai-response.js";

// === 型定義 ===

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

// === メイン ===

async function main() {
  const args = parseArgs();
  const scenario: Scenario = JSON.parse(readFileSync(args.scenario, "utf-8"));

  const outputDir = resolve(args.output);
  mkdirSync(outputDir, { recursive: true });

  const viewport = scenario.viewport || { width: 1920, height: 1080 };

  console.log(`[録画開始] ${scenario.service} — ${scenario.url}`);
  console.log(`[解像度] ${viewport.width}x${viewport.height}`);
  console.log(`[ステップ数] ${scenario.steps.length}`);

  const { context, close } = await createBrowserContext(scenario.service, {
    viewport,
    recordVideo: {
      dir: outputDir,
      size: viewport,
    },
  });

  const page = await context.newPage();

  try {
    // 初期URL移動
    await page.goto(scenario.url, { waitUntil: "domcontentloaded", timeout: 60000 });
    console.log(`[移動] ${scenario.url}`);

    // 全画面表示（F11）
    await page.evaluate(() => document.documentElement.requestFullscreen().catch(() => {}));
    await page.waitForTimeout(1500);

    // ステップ実行
    for (let i = 0; i < scenario.steps.length; i++) {
      const step = scenario.steps[i];
      console.log(`[Step ${i + 1}/${scenario.steps.length}] ${step.action}${getStepDetail(step)}`);
      await executeStep(page, step);
    }

    // 最後に少し待つ（録画の締め）
    await page.waitForTimeout(2000);
    console.log(`[録画完了]`);
  } catch (err) {
    console.error(`[エラー] 録画中にエラーが発生:`, err);
    // エラーでもスクリーンショットを残す
    await page.screenshot({ path: join(outputDir, "error.png") });
    throw err;
  } finally {
    // 動画ファイルパスを取得
    const videoPath = await page.video()?.path();
    await close();
    if (videoPath) {
      console.log(`[出力] ${videoPath}`);
    }
  }
}

// === ステップ実行 ===

async function executeStep(page: Page, step: Step): Promise<void> {
  switch (step.action) {
    case "goto":
      await page.goto(step.url, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.waitForTimeout(500);
      break;

    case "click":
      await page.waitForSelector(step.selector, { timeout: 10000 });
      await page.click(step.selector);
      await page.waitForTimeout(300);
      break;

    case "type": {
      if (step.selector) {
        await page.waitForSelector(step.selector, { timeout: 10000 });
        await page.click(step.selector);
      }
      // 人間っぽいタイピング
      const delay = step.delay ?? 50;
      for (const char of step.text) {
        await page.keyboard.type(char, { delay });
      }
      await page.waitForTimeout(200);
      break;
    }

    case "press":
      await page.keyboard.press(step.key);
      await page.waitForTimeout(300);
      break;

    case "waitForAI":
      await waitForAIResponse(page, {
        timeout: step.timeout,
        stableMs: step.stableMs,
      });
      break;

    case "wait":
      await page.waitForTimeout(step.ms);
      break;

    case "scroll":
      await page.mouse.wheel(
        0,
        step.direction === "down" ? step.amount : -step.amount
      );
      await page.waitForTimeout(500);
      break;

    case "screenshot":
      await page.screenshot({ path: step.path, fullPage: false });
      break;

    case "highlight": {
      // 要素をハイライト表示（赤枠）
      const duration = step.duration ?? 2000;
      await page.evaluate(
        ({ sel, dur }) => {
          const el = document.querySelector(sel);
          if (!el) return;
          const orig = (el as HTMLElement).style.cssText;
          (el as HTMLElement).style.cssText += `
            outline: 3px solid red !important;
            outline-offset: 2px !important;
          `;
          setTimeout(() => {
            (el as HTMLElement).style.cssText = orig;
          }, dur);
        },
        { sel: step.selector, dur: duration }
      );
      await page.waitForTimeout(duration);
      break;
    }
  }
}

// === ユーティリティ ===

function getStepDetail(step: Step): string {
  switch (step.action) {
    case "click":
      return ` → ${step.description || step.selector}`;
    case "type":
      return ` → "${step.text.slice(0, 30)}${step.text.length > 30 ? "..." : ""}"`;
    case "press":
      return ` → ${step.key}`;
    case "waitForAI":
      return ` (timeout: ${step.timeout || 30000}ms)`;
    case "wait":
      return ` → ${step.ms}ms`;
    case "scroll":
      return ` → ${step.direction} ${step.amount}px`;
    default:
      return "";
  }
}

function parseArgs(): { scenario: string; output: string } {
  const args = process.argv.slice(2);
  let scenario = "";
  let output = "recordings";

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--scenario" && args[i + 1]) {
      scenario = args[++i];
    } else if (args[i] === "--output" && args[i + 1]) {
      output = args[++i];
    }
  }

  if (!scenario) {
    console.error("Usage: npx tsx src/record-screen.ts --scenario <path.json> [--output <dir>]");
    process.exit(1);
  }

  return { scenario: resolve(scenario), output };
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
