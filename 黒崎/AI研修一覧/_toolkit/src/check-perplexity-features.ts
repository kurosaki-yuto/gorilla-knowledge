import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  console.log("[確認] ログインなしでPerplexityにアクセス");
  await page.goto("https://www.perplexity.ai", { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(4000);
  await page.screenshot({ path: "check-nologin.png" });

  // Focusボタン（+ボタン or フォーカス選択）を探す
  const focusSelectors = [
    "[data-testid='focus-selector']",
    "button:has-text('Focus')",
    "[aria-label*='focus']",
    "[aria-label*='Focus']",
    "button:has-text('Web')",
    "[class*='focus']",
  ];

  console.log("\n=== Focus機能の検出 ===");
  for (const sel of focusSelectors) {
    const count = await page.locator(sel).count();
    if (count > 0) console.log(`✓ ${sel} (count=${count})`);
  }

  // Pro Searchボタンを探す
  const proSelectors = [
    "button:has-text('Pro')",
    "[data-testid*='pro']",
    "[aria-label*='Pro']",
    "button:has-text('Deep')",
  ];
  console.log("\n=== Pro Search の検出 ===");
  for (const sel of proSelectors) {
    const count = await page.locator(sel).count();
    if (count > 0) {
      const text = await page.locator(sel).first().textContent();
      console.log(`✓ ${sel} text="${text?.trim()}" (count=${count})`);
    }
  }

  // +ボタンをクリックしてFocusオプションを確認
  console.log("\n=== +ボタンをクリックしてFocusオプション確認 ===");
  try {
    const plusBtn = page.locator("button").filter({ hasText: "+" }).or(
      page.locator("[class*='attach']")
    ).first();
    if (await plusBtn.count() > 0) {
      await plusBtn.click();
      await page.waitForTimeout(1500);
      await page.screenshot({ path: "check-focus-menu.png" });
      console.log("クリック完了 → check-focus-menu.png");
    }
  } catch (e) {
    console.log("クリックできず:", e);
  }

  // 全ボタンのテキストを取得
  console.log("\n=== ページ上のボタン一覧 ===");
  const buttons = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("button"))
      .map(b => ({ text: b.textContent?.trim().slice(0, 40), ariaLabel: b.getAttribute("aria-label") }))
      .filter(b => b.text || b.ariaLabel)
      .slice(0, 20);
  });
  buttons.forEach(b => console.log(`  "${b.text}" (aria: ${b.ariaLabel})`));

  await browser.close();
}

main().catch(console.error);
