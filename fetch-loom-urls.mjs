#!/usr/bin/env node
/**
 * Loomの全フォルダ・動画URLを取得するスクリプト
 * ブラウザでログイン後、自動的に各フォルダを巡回してURLを収集する
 */

import { chromium } from "playwright";
import { writeFileSync } from "fs";

const LOOM_URL = "https://www.loom.com/looms/videos";
const OUTPUT_FILE = "/Users/matsumotoshuntasuku/AI研修講座/gorilla-knowledge/黒崎/AI研修一覧/loom-urls.json";

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  const browser = await chromium.launchPersistentContext("/tmp/loom-fetch-profile", {
    headless: false,
    channel: "chrome",
    viewport: { width: 1400, height: 900 },
  });

  const page = browser.pages()[0] || await browser.newPage();
  await page.goto(LOOM_URL, { waitUntil: "load", timeout: 60000 });

  // ログイン待ち
  console.log("🔐 Loomにログインしてください...");
  console.log("   ライブラリが表示されたら自動で収集を開始します");

  // フォルダが表示されるまで待つ
  await page.locator('text="Stage1"').first().waitFor({ state: "visible", timeout: 300000 });
  console.log("✅ ログイン確認\n");
  await sleep(3000);

  const results = {};

  // 全フォルダのリンクを取得
  const folderLinks = await page.locator('a[href*="/spaces/"]').all();
  const folderUrls = [];

  for (const link of folderLinks) {
    const href = await link.getAttribute("href");
    const text = await link.textContent();
    if (href && text && text.includes("Stage")) {
      folderUrls.push({ name: text.trim(), url: `https://www.loom.com${href}` });
    }
  }

  // フォルダが取れなかった場合、別のセレクターを試す
  if (folderUrls.length === 0) {
    console.log("フォルダリンクを別の方法で探索中...");
    // フォルダをクリックして中の動画URLを取得する方法
    const folderEls = await page.locator('[class*="folder"], [data-testid*="folder"]').all();
    console.log(`フォルダ要素: ${folderEls.length}個`);

    // ページのHTMLからフォルダURLを抽出
    const html = await page.content();
    const folderMatches = html.matchAll(/href="(\/spaces\/[^"]+)"/g);
    for (const m of folderMatches) {
      folderUrls.push({ name: "", url: `https://www.loom.com${m[1]}` });
    }

    // それでもダメならフォルダをクリック方式で
    if (folderUrls.length === 0) {
      console.log("直接フォルダをクリックして巡回します...");
      // フォルダ名のテキストでクリック
      const folderNames = [
        "01_Stage1", "02_Stage2", "03_Stage3",
        "04_", "05_", "06_", "07_", "08_", "09_", "10_"
      ];

      for (const prefix of folderNames) {
        try {
          await page.goto(LOOM_URL, { waitUntil: "load", timeout: 30000 });
          await sleep(2000);

          const folder = page.locator(`text=/${prefix}/`).first();
          const folderName = await folder.textContent().catch(() => prefix);
          await folder.click();
          await sleep(3000);

          // 動画のURLを取得
          const videoLinks = await page.locator('a[href*="/share/"]').all();
          const videos = [];
          for (const vl of videoLinks) {
            const href = await vl.getAttribute("href");
            const title = await vl.textContent().catch(() => "");
            if (href) {
              videos.push({
                title: title.trim(),
                url: href.startsWith("http") ? href : `https://www.loom.com${href}`
              });
            }
          }

          results[folderName.trim()] = videos;
          console.log(`📁 ${folderName.trim()}: ${videos.length}本`);
        } catch (e) {
          console.log(`⚠️ ${prefix}: ${e.message.slice(0, 60)}`);
        }
      }
    }
  }

  // フォルダURLが取れた場合、各フォルダを巡回
  if (folderUrls.length > 0) {
    for (const folder of folderUrls) {
      try {
        await page.goto(folder.url, { waitUntil: "load", timeout: 30000 });
        await sleep(3000);

        const videoLinks = await page.locator('a[href*="/share/"]').all();
        const videos = [];
        for (const vl of videoLinks) {
          const href = await vl.getAttribute("href");
          const title = await vl.textContent().catch(() => "");
          if (href) {
            videos.push({
              title: title.trim(),
              url: href.startsWith("http") ? href : `https://www.loom.com${href}`
            });
          }
        }

        results[folder.name || folder.url] = videos;
        console.log(`📁 ${folder.name}: ${videos.length}本`);
      } catch (e) {
        console.log(`⚠️ ${folder.name}: ${e.message.slice(0, 60)}`);
      }
    }
  }

  // 結果を保存
  writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));
  console.log(`\n💾 保存: ${OUTPUT_FILE}`);

  // 合計
  let total = 0;
  for (const [k, v] of Object.entries(results)) {
    total += v.length;
  }
  console.log(`📊 合計: ${total}本のURL取得`);

  await sleep(5000);
  await browser.close();
}

main().catch(err => {
  console.error("エラー:", err);
  process.exit(1);
});
