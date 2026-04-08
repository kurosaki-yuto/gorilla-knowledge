#!/usr/bin/env node
/**
 * Loom一括アップロードスクリプト
 * Playwrightでブラウザ自動操作してLoomに動画をアップロードする
 *
 * 使い方:
 *   node upload-to-loom.mjs            # 全件アップロード
 *   node upload-to-loom.mjs --stage 1  # Stage1のみ
 *   node upload-to-loom.mjs --dry-run  # ファイル確認のみ
 */

import { chromium } from "playwright";
import { existsSync, statSync, writeFileSync, readFileSync } from "fs";
import { join } from "path";

const BASE = "/Users/matsumotoshuntasuku/AI研修講座/gorilla-knowledge/黒崎/AI研修一覧";
const PROGRESS_FILE = join(BASE, ".loom-upload-progress.json");
const LOOM_URL = "https://www.loom.com/looms/videos";

const CURRICULUM = [
  { stage: 1, title: "【Stage1-1】AIとは何か", file: "A-101_AIとは何か/動画.mp4" },
  { stage: 1, title: "【Stage1-2】生成AIの仕組み", file: "A-102_生成AIの仕組み/動画.mp4" },
  { stage: 1, title: "【Stage1-3】AIにできること・できないこと", file: "A-104_AIにできること・できないこと/動画.mp4" },
  { stage: 1, title: "【Stage1-4】主要AIツール徹底比較", file: "A-103_主要AIツール徹底比較/動画.mp4" },
  { stage: 2, title: "【Stage2-1】AI時代の情報リテラシー", file: "A-107_AI時代の情報リテラシー/動画.mp4" },
  { stage: 2, title: "【Stage2-2】AIと著作権・個人情報", file: "A-108_AIと著作権・個人情報/動画.mp4" },
  { stage: 2, title: "【Stage2-3】社内AI利用ガイドライン", file: "A-109_社内AI利用ガイドライン/動画.mp4" },
  { stage: 3, title: "【Stage3-1】プロンプトの基本", file: "A-105_プロンプトの基本/動画.mp4" },
  { stage: 3, title: "【Stage3-2】プロンプト実践テクニック", file: "A-106_プロンプト実践テクニック/動画.mp4" },
  { stage: 4, title: "【ChatGPT-1】Part1", file: "GPT講座/Part1_clean.mp4" },
  { stage: 4, title: "【ChatGPT-2】Part2", file: "GPT講座/Part2_clean.mp4" },
  { stage: 4, title: "【ChatGPT-3】Part3", file: "GPT講座/Part3_clean.mp4" },
  { stage: 4, title: "【ChatGPT-4】Part4", file: "GPT講座/Part4_clean.mp4" },
  { stage: 4, title: "【ChatGPT-5】Part5", file: "GPT講座/Part5_clean.mp4" },
  { stage: 4, title: "【Claude-1】Claudeとは", file: "Claude/Part1_Claudeとは/スライド.mp4" },
  { stage: 4, title: "【Claude-2】プロジェクト&アーティファクト", file: "Claude/Part2_プロジェクト&アーティファクト/Part2_edited.mp4" },
  { stage: 4, title: "【Claude-3】長文処理&Web検索", file: "Claude/Part3_長文処理&Web検索/100万トークン長文処理 & Web検索活用.mp4" },
  { stage: 4, title: "【Claude-4】Claude Code&MCP", file: "Claude/Part4_Claude_Code&MCP/Part4_edited.mp4" },
  { stage: 4, title: "【Claude-5】Co-work&実践", file: "Claude/Part5_Co-work&実践/Part5_edited.mp4" },
  { stage: 4, title: "【Gemini-1】Gemini Enterpriseとは", file: "Gemini/P-01_Gemini_Enterprise_とは/動画.mp4" },
  { stage: 4, title: "【Gemini-2】Workspace統合実演", file: "Gemini/P-02_Workspace_統合実演/動画.mp4" },
  { stage: 4, title: "【Gemini-3】営業企画効率化", file: "Gemini/P-03_営業企画効率化/動画.mp4" },
  { stage: 4, title: "【Gemini-4】セキュリティ・対象者", file: "Gemini/P-04_セキュリティ・対象者/動画.mp4" },
  { stage: 4, title: "【Gemini-5】実装事例・未来へ", file: "Gemini/P-05_実装事例・未来へ/動画.mp4" },
  { stage: 4, title: "【Perplexity-1】なぜ今Perplexityなのか", file: "Perplexity/P-01_なぜ今Perplexityなのか/動画.mp4" },
  { stage: 4, title: "【Perplexity-2】基本的な検索の使い方", file: "Perplexity/P-02_基本的な検索の使い方/動画.mp4" },
  { stage: 4, title: "【Perplexity-3】高度な検索テクニック", file: "Perplexity/P-03_高度な検索テクニック/動画.mp4" },
  { stage: 4, title: "【Perplexity-4】Google検索との使い分け", file: "Perplexity/P-04_Google検索との使い分け/動画.mp4" },
  { stage: 4, title: "【Perplexity-5】業務でPerplexityを活用する", file: "Perplexity/P-05_業務でPerplexityを活用する/動画.mp4" },
  { stage: 5, title: "【AI資料作成-1】なぜAIで資料を作るべきなのか", file: "AIプレゼン資料作成/P-01_なぜAIで資料を作るべきなのか/動画.mp4" },
  { stage: 5, title: "【AI資料作成-2】Claudeで提案書を設計する", file: "AIプレゼン資料作成/P-02_Claudeで提案書を設計する/動画.mp4" },
  { stage: 5, title: "【AI資料作成-3】Claudeでスライド化する", file: "AIプレゼン資料作成/P-03_Claudeでスライド化する/動画.mp4" },
  { stage: 5, title: "【AI資料作成-4】業務別テンプレート実践", file: "AIプレゼン資料作成/P-04_業務別テンプレート実践/動画.mp4" },
  { stage: 5, title: "【AI資料作成-5】最強ワークフローと総まとめ", file: "AIプレゼン資料作成/P-05_最強ワークフローと総まとめ/動画.mp4" },
  { stage: 5, title: "【AI画像生成-1】なぜAI画像生成なのか", file: "AI画像生成/P-01_なぜAI画像生成なのか/動画.mp4" },
  { stage: 5, title: "【AI画像生成-2】まず1枚作る", file: "AI画像生成/P-02_まず1枚作る/動画.mp4" },
  { stage: 5, title: "【AI画像生成-3】SNS素材テンプレート実践", file: "AI画像生成/P-03_SNS素材テンプレート実践/動画.mp4" },
  { stage: 5, title: "【AI画像生成-4】広告バナー制作", file: "AI画像生成/P-04_広告バナー制作/動画.mp4" },
  { stage: 5, title: "【AI画像生成-5】クオリティ改善と次のステップ", file: "AI画像生成/P-05_クオリティ改善と次のステップ/動画.mp4" },
  { stage: 5, title: "【AI動画生成-1】なぜVeo3一本でいいのか", file: "AI動画生成/P-01_なぜVeo3一本でいいのか/動画.mp4" },
  { stage: 5, title: "【AI動画生成-2】Veo3基本操作", file: "AI動画生成/P-02_Veo3基本操作/動画.mp4" },
  { stage: 5, title: "【AI動画生成-3】プロンプト設計マスター", file: "AI動画生成/P-03_プロンプト設計マスター/動画.mp4" },
  { stage: 5, title: "【AI動画生成-4】SNS×PDCA戦略", file: "AI動画生成/P-04_SNS×PDCA戦略/動画.mp4" },
  { stage: 5, title: "【AI動画生成-5】業界別テンプレートと実践", file: "AI動画生成/P-05_業界別テンプレートと実践/動画.mp4" },
  { stage: 6, title: "【戦略-1】AIで変わる仕事の未来", file: "A-110_AIで変わる仕事の未来/動画.mp4" },
  { stage: 6, title: "【戦略-2】業務別AI活用マップ", file: "A-111_業務別AI活用マップ/動画.mp4" },
  { stage: 6, title: "【戦略-3】AI導入の第一歩", file: "A-112_AI導入の第一歩/動画.mp4" },
  { stage: 6, title: "【戦略-4】全ツール総整理", file: "ツール選定ロードマップ/P-01_全ツール総整理/動画.mp4" },
  { stage: 6, title: "【戦略-5】コストシミュレーション", file: "ツール選定ロードマップ/P-02_コストシミュレーション/動画.mp4" },
  { stage: 6, title: "【戦略-6】90日ロードマップ設計", file: "ツール選定ロードマップ/P-03_90日ロードマップ設計/動画.mp4" },
  { stage: 6, title: "【戦略-7】KPI設定と実践", file: "ツール選定ロードマップ/P-04_KPI設定と実践/動画.mp4" },
  { stage: 6, title: "【戦略-8】Pack6総まとめ", file: "ツール選定ロードマップ/P-05_Pack6総まとめ/動画.mp4" },
];

function loadProgress() {
  try { return JSON.parse(readFileSync(PROGRESS_FILE, "utf-8")); }
  catch { return { uploaded: [] }; }
}
function saveProgress(progress) {
  writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}
function formatSize(bytes) {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function uploadOneVideo(page, fullPath, title, index, total) {
  console.log(`\n📤 [${index}/${total}] ${title}`);

  // 1. Loomのビデオライブラリに移動（loadで十分、networkidleは使わない）
  await page.goto(LOOM_URL, { waitUntil: "load", timeout: 30000 });
  await sleep(3000);

  // 2. "New video" ボタンをクリック
  const newVideoBtn = page.locator('button:has-text("New video")');
  await newVideoBtn.waitFor({ state: "visible", timeout: 15000 });
  await newVideoBtn.click();
  await sleep(1500);

  // 3. ドロップダウンから "Upload a video" を選択
  const uploadOption = page.locator('text="Upload a video"');
  await uploadOption.waitFor({ state: "visible", timeout: 5000 });
  await uploadOption.click();
  await sleep(2000);

  // 4. "browse files" をクリックしてfileChooserでファイルを選択
  const [fileChooser] = await Promise.all([
    page.waitForEvent("filechooser", { timeout: 10000 }),
    page.locator('text="browse files"').click(),
  ]);
  await fileChooser.setFiles(fullPath);
  console.log(`   📁 ファイル選択完了`);
  await sleep(2000);

  // 4.5 "Upload 1 file" ボタンをクリック
  const uploadBtn = page.locator('button:has-text("Upload 1 file"), button:has-text("Upload")').first();
  await uploadBtn.waitFor({ state: "visible", timeout: 10000 });
  await uploadBtn.click();
  console.log(`   ⏳ アップロード開始...`);

  // 5. アップロード進行を監視（プログレスバーが表示→完了、または動画ページに遷移）
  // Loomはアップロード後に自動的に動画詳細ページ（/share/）に遷移する
  let uploaded = false;
  for (let wait = 0; wait < 60; wait++) {
    await sleep(5000);
    const currentUrl = page.url();
    if (currentUrl.includes("/share/")) {
      console.log(`   ✅ アップロード完了！`);
      uploaded = true;
      break;
    }
    // プログレス表示を確認
    if (wait % 6 === 5) {
      console.log(`   ⏳ まだアップロード中... (${(wait + 1) * 5}秒経過)`);
    }
  }

  if (!uploaded) {
    // 5分経っても遷移しない場合はスクリーンショットで状態確認
    const ssPath = join(BASE, `_upload_status_${index}.png`);
    await page.screenshot({ path: ssPath });
    console.log(`   ⚠️  タイムアウト。状態: ${ssPath}`);
    // アップロード自体はバックグラウンドで続いてる可能性が高いので、次に進む
  }

  // 6. タイトルを変更（動画詳細ページに遷移していた場合）
  if (uploaded) {
    await sleep(2000);
    try {
      const titleEl = page.locator('[data-testid="video_title"], h1[contenteditable], [contenteditable="true"]').first();
      if (await titleEl.isVisible({ timeout: 5000 })) {
        await titleEl.click({ clickCount: 3 });
        await sleep(300);
        await page.keyboard.press("Meta+a");
        await page.keyboard.type(title);
        await page.keyboard.press("Tab");
        console.log(`   📝 タイトル: ${title}`);
      }
    } catch (e) {
      console.log(`   ⚠️  タイトル設定スキップ`);
    }
  }

  await sleep(2000);
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const stageFilter = args.includes("--stage")
    ? parseInt(args[args.indexOf("--stage") + 1])
    : null;

  let videos = CURRICULUM;
  if (stageFilter) videos = videos.filter(v => v.stage === stageFilter);

  // ファイル存在チェック
  console.log("\n📋 アップロード対象の確認\n");
  let missing = 0;
  for (const v of videos) {
    const fp = join(BASE, v.file);
    if (existsSync(fp)) {
      console.log(`  ✅ ${v.title}  (${formatSize(statSync(fp).size)})`);
    } else {
      console.log(`  ❌ ${v.title}  → ファイルなし`);
      missing++;
    }
  }
  console.log(`\n合計: ${videos.length}本 (${missing}本なし)`);
  if (dryRun) return;

  // 進捗チェック
  const progress = loadProgress();
  const remaining = videos.filter(v =>
    existsSync(join(BASE, v.file)) && !progress.uploaded.includes(v.file)
  );
  if (remaining.length === 0) {
    console.log("\n✅ すべてアップロード済み！");
    return;
  }
  console.log(`\n🚀 ${remaining.length}本をアップロードします\n`);

  // ブラウザ起動（固定プロファイルでセッション維持）
  const browser = await chromium.launchPersistentContext("/tmp/loom-upload-profile", {
    headless: false,
    channel: "chrome",
    viewport: { width: 1400, height: 900 },
    args: ["--disable-blink-features=AutomationControlled"],
  });

  const page = browser.pages()[0] || await browser.newPage();
  await page.goto(LOOM_URL, { waitUntil: "load", timeout: 60000 });
  await sleep(3000);

  // ログイン確認 - "New video" ボタンが表示されるまで待つ
  console.log('🔐 Loomのログインを確認中... (未ログインならブラウザでログインしてください)');
  try {
    await page.locator('button:has-text("New video")').waitFor({ state: "visible", timeout: 300000 });
    console.log("✅ ログイン済み・ライブラリ表示確認");
  } catch {
    console.error("❌ 5分以内にログインが完了しませんでした");
    process.exit(1);
  }

  // アップロード実行
  for (let i = 0; i < remaining.length; i++) {
    const v = remaining[i];
    const fullPath = join(BASE, v.file);

    try {
      await uploadOneVideo(page, fullPath, v.title, i + 1, remaining.length);
      progress.uploaded.push(v.file);
      saveProgress(progress);
    } catch (err) {
      console.error(`   ❌ エラー: ${err.message.slice(0, 120)}`);
      const ssPath = join(BASE, `_error_${i}.png`);
      await page.screenshot({ path: ssPath });
      console.log(`   📸 ${ssPath}`);
    }

    // 次の動画まで待機
    if (i < remaining.length - 1) {
      console.log("   ⏸️  5秒待機...");
      await sleep(5000);
    }
  }

  console.log(`\n\n🎉 完了！ 成功: ${progress.uploaded.length}本`);

  // ブラウザは閉じない（ユーザーが確認できるように）
  console.log("📌 ブラウザはそのまま開いています。手動で閉じてください。");
  // プロセスを生かしておくために無限待機
  await new Promise(() => {});
}

main().catch(err => {
  console.error("致命的エラー:", err);
  process.exit(1);
});
