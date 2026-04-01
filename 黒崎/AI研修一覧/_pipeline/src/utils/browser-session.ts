import { BrowserContext, chromium } from "playwright";
import { existsSync, mkdirSync } from "fs";
import { join } from "path";

const SESSION_DIR = process.env.SESSION_DIR || "./sessions";

/**
 * ブラウザコンテキストを作成する
 * セッション（Cookie等）があれば復元、なければ新規作成
 */
export async function createBrowserContext(
  serviceName: string,
  options: {
    viewport?: { width: number; height: number };
    recordVideo?: { dir: string; size?: { width: number; height: number } };
  } = {}
): Promise<{ context: BrowserContext; close: () => Promise<void> }> {
  const sessionPath = getSessionPath(serviceName);

  mkdirSync(SESSION_DIR, { recursive: true });

  const browser = await chromium.launch({
    headless: false,
    args: ["--start-fullscreen"],
  });

  const contextOptions: any = {
    viewport: options.viewport || { width: 1920, height: 1080 },
    recordVideo: options.recordVideo,
    locale: "ja-JP",
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  };

  // 既存セッションがあれば復元
  if (existsSync(sessionPath)) {
    console.log(`[session] ${serviceName} のセッションを復元`);
    contextOptions.storageState = sessionPath;
  }

  const context = await browser.newContext(contextOptions);

  const close = async () => {
    // セッションを保存
    const state = await context.storageState();
    const { writeFileSync } = await import("fs");
    writeFileSync(sessionPath, JSON.stringify(state, null, 2));
    console.log(`[session] ${serviceName} のセッションを保存`);
    await context.close();
    await browser.close();
  };

  return { context, close };
}

function getSessionPath(serviceName: string): string {
  return join(SESSION_DIR, `${serviceName}.json`);
}
