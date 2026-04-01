import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  await page.goto("https://www.perplexity.ai", { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(5000);

  // スクリーンショット
  await page.screenshot({ path: "debug-screenshot.png" });
  console.log("[screenshot] debug-screenshot.png");

  // 入力欄を探す
  const selectors = [
    "textarea",
    "input[type='text']",
    "[contenteditable='true']",
    "[role='textbox']",
    "[placeholder]",
    "input",
  ];

  for (const sel of selectors) {
    const count = await page.locator(sel).count();
    if (count > 0) {
      const first = page.locator(sel).first();
      const tag = await first.evaluate(el => el.tagName);
      const placeholder = await first.getAttribute("placeholder");
      const role = await first.getAttribute("role");
      console.log(`[found] ${sel} → count=${count}, tag=${tag}, placeholder="${placeholder}", role="${role}"`);
    }
  }

  // ページ全体のHTML構造をダンプ（入力系のみ）
  const inputs = await page.evaluate(() => {
    const els = document.querySelectorAll("textarea, input, [contenteditable='true'], [role='textbox']");
    return Array.from(els).map(el => ({
      tag: el.tagName,
      type: (el as HTMLInputElement).type,
      placeholder: el.getAttribute("placeholder"),
      role: el.getAttribute("role"),
      className: el.className.slice(0, 100),
      id: el.id,
    }));
  });
  console.log("[inputs]", JSON.stringify(inputs, null, 2));

  await browser.close();
}

main().catch(console.error);
