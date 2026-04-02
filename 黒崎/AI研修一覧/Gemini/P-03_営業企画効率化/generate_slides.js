#!/usr/bin/env node
/**
 * P-03: 営業・企画業務の効率化 - スライド生成スクリプト
 *
 * 使用法:
 *   node generate_slides.js
 *
 * 出力:
 *   スライド.pptx
 *
 * 依存関係:
 *   npm install pptxgen-js
 */

const PptxGenJS = require("pptxgenjs");

// スライド設定（16:9）
const prs = new PptxGenJS();
prs.defineLayout({ name: "16:9", width: 10, height: 5.625 });
prs.defineLayout({ name: "16:9" });

// カラーパレット（デザインシステムに準拠）
const COLORS = {
  white: "FFFFFF",
  navy: "1B2A4A",
  navyLight: "2D4A7A",
  accent: "2563EB",
  accentLight: "DBEAFE",
  textDark: "111827",
  textBody: "374151",
  textLight: "6B7280",
  border: "E5E7EB",
  green: "059669",
  greenBg: "D1FAE5",
  red: "DC2626",
};

// フォント設定
const FONTS = {
  primary: "Calibri",
  sizeHero: 44,
  sizeH1: 32,
  sizeH2: 22,
  sizeH3: 18,
  sizeBody: 16,
  sizeLabel: 13,
};

// ====================================
// ヘルパー関数
// ====================================

function addTitleSlide(prs, title, subtitle, metadata) {
  const slide = prs.addSlide();
  slide.background = { color: COLORS.navy };

  // タイトル
  slide.addText(title, {
    x: 0.75,
    y: 1.5,
    w: 8.5,
    h: 1.2,
    fontSize: FONTS.sizeHero,
    fontFace: FONTS.primary,
    color: COLORS.white,
    bold: true,
    align: "left",
  });

  // サブタイトル
  slide.addText(subtitle, {
    x: 0.75,
    y: 2.8,
    w: 8.5,
    h: 1,
    fontSize: FONTS.sizeH2,
    fontFace: FONTS.primary,
    color: COLORS.accentLight,
    align: "left",
  });

  // メタデータ
  slide.addText(`${metadata}`, {
    x: 0.75,
    y: 4.8,
    w: 8.5,
    h: 0.5,
    fontSize: FONTS.sizeLabel,
    fontFace: FONTS.primary,
    color: COLORS.white,
    align: "left",
  });
}

function addContentSlide(prs, title, content) {
  const slide = prs.addSlide();
  slide.background = { color: COLORS.white };

  // ヘッダー背景
  slide.addShape(prs.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 10,
    h: 0.8,
    fill: { color: COLORS.navy },
    line: { type: "none" },
  });

  // タイトル
  slide.addText(title, {
    x: 0.75,
    y: 0.15,
    w: 8.5,
    h: 0.5,
    fontSize: FONTS.sizeH1,
    fontFace: FONTS.primary,
    bold: true,
    color: COLORS.white,
    align: "left",
  });

  // コンテンツを追加（y位置は1.0から開始）
  let currentY = 1.2;

  if (Array.isArray(content)) {
    content.forEach((item, idx) => {
      if (item.type === "heading") {
        slide.addText(item.text, {
          x: 0.75,
          y: currentY,
          w: 8.5,
          h: 0.4,
          fontSize: FONTS.sizeH3,
          fontFace: FONTS.primary,
          bold: true,
          color: COLORS.textDark,
          align: "left",
        });
        currentY += 0.5;
      } else if (item.type === "bullet") {
        slide.addText(item.text, {
          x: 1.2,
          y: currentY,
          w: 8,
          h: 0.5,
          fontSize: FONTS.sizeBody,
          fontFace: FONTS.primary,
          color: COLORS.textBody,
          align: "left",
          valign: "top",
        });
        currentY += 0.65;
      } else if (item.type === "subheading") {
        slide.addText(item.text, {
          x: 0.75,
          y: currentY,
          w: 8.5,
          h: 0.35,
          fontSize: FONTS.sizeH3,
          fontFace: FONTS.primary,
          bold: false,
          color: COLORS.accent,
          align: "left",
        });
        currentY += 0.45;
      }
    });
  }
}

function addDemoSlide(prs, title) {
  const slide = prs.addSlide();
  slide.background = { color: COLORS.white };

  // ヘッダー背景
  slide.addShape(prs.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 10,
    h: 0.8,
    fill: { color: COLORS.navy },
    line: { type: "none" },
  });

  // タイトル
  slide.addText(title, {
    x: 0.75,
    y: 0.15,
    w: 8.5,
    h: 0.5,
    fontSize: FONTS.sizeH1,
    fontFace: FONTS.primary,
    bold: true,
    color: COLORS.white,
    align: "left",
  });

  // デモコンテンツプレースホルダー
  slide.addShape(prs.ShapeType.rect, {
    x: 0.75,
    y: 1.2,
    w: 8.5,
    h: 3.8,
    fill: { color: COLORS.lightGray },
    line: { color: COLORS.border, width: 1 },
  });

  slide.addText("【実演動画が挿入されます】\n提案書自動生成デモンストレーション\n（80.6秒）", {
    x: 0.75,
    y: 2.5,
    w: 8.5,
    h: 1.5,
    fontSize: FONTS.sizeBody,
    fontFace: FONTS.primary,
    color: COLORS.textLight,
    align: "center",
    valign: "middle",
  });
}

// ====================================
// スライド定義
// ====================================

// スライド1: タイトル
addTitleSlide(
  prs,
  "営業・企画業務の効率化",
  "Gemini Enterprise で提案書を自動生成する",
  "P-03 | 営業・企画職向け実践 | 12分"
);

// スライド2: 課題
addContentSlide(prs, "なぜ提案書作成に時間がかかる？", [
  { type: "heading", text: "主な課題" },
  { type: "bullet", text: "顧客情報の整理・分析（1～2時間）" },
  { type: "bullet", text: "テンプレートのカスタマイズと文章作成" },
  { type: "bullet", text: "修正・校正の手作業" },
  { type: "bullet", text: "複数案の検討・比較" },
  { type: "subheading", text: "結果：初稿だけで 4～6時間（業務全体の 20～30%）" },
]);

// スライド3: 自動化戦略
addContentSlide(prs, "Gemini での自動化戦略", [
  { type: "heading", text: "4つのステップ" },
  { type: "bullet", text: "ステップ 1: 顧客情報を詳しく入力 → Gemini が分析・整理" },
  { type: "bullet", text: "ステップ 2: 提案書の構成を指定 → 初稿を自動生成" },
  { type: "bullet", text: "ステップ 3: JSON 形式で出力 → 他ツール（Docs, PowerPoint）との連携" },
  { type: "bullet", text: "ステップ 4: 人間による創造的修正 → 最終提案へ" },
  { type: "subheading", text: "初稿作成：従来 4～6時間 → わずか 30分以内" },
]);

// スライド4: 実演前のポイント
addContentSlide(prs, "実演で見るポイント", [
  { type: "heading", text: "5つの重要なポイント" },
  { type: "bullet", text: "複雑な指示の与え方（プロンプトエンジニアリング）" },
  { type: "bullet", text: "プロンプトの工夫による精度向上" },
  { type: "bullet", text: "JSON 形式出力の効率性" },
  { type: "bullet", text: "実績値：初稿作成が 30分以内に完成" },
  { type: "bullet", text: "時間短縮率：従来比 80～90% 削減" },
]);

// スライド5: 実演（デモスライド）
addDemoSlide(prs, "実演：提案書自動生成デモ");

// スライド6: ベストプラクティス
addContentSlide(prs, "精度を上げる 5つのコツ", [
  { type: "heading", text: "プロンプトエンジニアリング" },
  { type: "bullet", text: "顧客情報は「できるだけ詳しく」入力する" },
  { type: "bullet", text: "提案書の構成を「箇条書き」で明確に指示" },
  { type: "bullet", text: "文字数・形式・トーンを「具体的に」指定する" },
  { type: "bullet", text: "初稿はレビュー前提（完璧さを求めない）" },
  { type: "bullet", text: "複数案は「バリエーション指示」で効率化" },
]);

// スライド7: まとめ
addContentSlide(prs, "コースのまとめ", [
  { type: "heading", text: "4つの重要なポイント" },
  { type: "bullet", text: "提案書作成は AI で 80～90% 高速化できる" },
  { type: "bullet", text: "プロンプトの質で出力の質が大きく変わる" },
  { type: "bullet", text: "JSON 形式で Google Docs/PowerPoint との自動連携が可能" },
  { type: "bullet", text: "最終品質は人間の創造的修正が決める" },
  { type: "subheading", text: "次のステップ：実務で実践 → チーム全体で共有" },
]);

// ファイル出力
prs.writeFile({ fileName: "スライド.pptx" });
console.log("✓ スライド.pptx を生成しました");
