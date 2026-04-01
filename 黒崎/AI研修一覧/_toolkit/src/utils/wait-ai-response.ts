import { Page } from "playwright";

/**
 * AI応答の完了を検知する
 * DOM内のテキスト変化が安定（2秒間変化なし）したら完了と判定
 */
export async function waitForAIResponse(
  page: Page,
  options: { timeout?: number; stableMs?: number } = {}
): Promise<void> {
  const { timeout = 30000, stableMs = 2000 } = options;
  const startTime = Date.now();

  let lastText = await getPageText(page);
  let lastChangeTime = Date.now();

  while (Date.now() - startTime < timeout) {
    await page.waitForTimeout(500);
    const currentText = await getPageText(page);

    if (currentText !== lastText) {
      lastText = currentText;
      lastChangeTime = Date.now();
    }

    // テキストが stableMs 間変化していなければ完了
    if (Date.now() - lastChangeTime >= stableMs) {
      return;
    }
  }

  console.warn(`[waitForAI] ${timeout}ms タイムアウト（応答は部分的かもしれません）`);
}

async function getPageText(page: Page): Promise<string> {
  return page.evaluate(() => document.body.innerText);
}
