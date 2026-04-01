#!/usr/bin/env npx tsx
/**
 * ページのDOM構造を調査するデバッグツール
 * 録画シナリオを書く前に、入力欄のセレクタを確認する。
 *
 * 使い方:
 *   npx tsx src/debug-page.ts [URL]
 *   npx tsx src/debug-page.ts https://chatgpt.com
 *   npx tsx src/debug-page.ts https://www.perplexity.ai
 */

import { chromium } from "playwright";

const url = process.argv[2] || "https://www.perplexity.ai";

async function main() {
  console.log(`[調査] ${url}\n`);

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(5000);

  await page.screenshot({ path: "debug-screenshot.png" });
  console.log("[screenshot] debug-screenshot.png\n");

  // 入力系要素を探す
  const selectors = [
    "textarea",
    "input[type='text']",
    "[contenteditable='true']",
    "[role='textbox']",
    "[placeholder]",
    "input",
  ];

  console.log("=== 入力要素の検出結果 ===\n");
  for (const sel of selectors) {
    const count = await page.locator(sel).count();
    if (count > 0) {
      const first = page.locator(sel).first();
      const tag = await first.evaluate((el) => el.tagName);
      const placeholder = await first.getAttribute("placeholder");
      const role = await first.getAttribute("role");
      const id = await first.getAttribute("id");
      const cls = await first.evaluate((el) => el.className.slice(0, 80));
      console.log(`✓ ${sel}`);
      console.log(`  count=${count} tag=${tag} id="${id}" role="${role}" placeholder="${placeholder}"`);
      console.log(`  class="${cls}"`);
      console.log();
    }
  }

  // ボタン要素も調査
  console.log("=== 送信ボタンの候補 ===\n");
  const buttons = await page.evaluate(() => {
    const els = document.querySelectorAll("button, [role='button'], [type='submit']");
    return Array.from(els)
      .map((el) => ({
        tag: el.tagName,
        text: el.textContent?.trim().slice(0, 50),
        ariaLabel: el.getAttribute("aria-label"),
        testId: el.getAttribute("data-testid"),
        id: el.id,
      }))
      .filter((b) => b.text || b.ariaLabel || b.testId)
      .slice(0, 10);
  });
  for (const btn of buttons) {
    console.log(`  <${btn.tag}> "${btn.text}" aria="${btn.ariaLabel}" testid="${btn.testId}" id="${btn.id}"`);
  }

  console.log("\n=== 推奨セレクタ ===\n");
  const inputs = await page.evaluate(() => {
    const els = document.querySelectorAll("textarea, [contenteditable='true'], [role='textbox']");
    return Array.from(els).map((el) => ({
      id: el.id,
      role: el.getAttribute("role"),
      tag: el.tagName,
    }));
  });
  if (inputs.length > 0) {
    const best = inputs[0];
    if (best.id) {
      console.log(`入力欄: #${best.id}`);
    } else if (best.role) {
      console.log(`入力欄: [role='${best.role}']`);
    } else {
      console.log(`入力欄: ${best.tag.toLowerCase()}`);
    }
  }

  await browser.close();
}

main().catch(console.error);
