#!/usr/bin/env node
/**
 * P-05: 実装事例・使い方・未来へ - スライド生成スクリプト
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
  lightGray: "F3F4F6",
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
          h: 0.6,
          fontSize: FONTS.sizeBody,
          fontFace: FONTS.primary,
          color: COLORS.textBody,
          align: "left",
          valign: "top",
        });
        currentY += 0.7;
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
      } else if (item.type === "stat") {
        // 統計情報（大きく表示）
        slide.addText(item.label, {
          x: 0.75,
          y: currentY,
          w: 4,
          h: 0.35,
          fontSize: FONTS.sizeLabel,
          fontFace: FONTS.primary,
          color: COLORS.textLight,
          align: "left",
        });
        slide.addText(item.value, {
          x: 0.75,
          y: currentY + 0.35,
          w: 4,
          h: 0.5,
          fontSize: FONTS.sizeH2,
          fontFace: FONTS.primary,
          bold: true,
          color: COLORS.accent,
          align: "left",
        });
        currentY += 0.9;
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

  slide.addText("【実演動画が挿入されます】\n導入後の時系列的な効果と最初の3ステップ\n（92.3秒）", {
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
  "実装事例・使い方・未来へ",
  "企業導入事例から見る Gemini の効果",
  "P-05 | 全員向け | 12分"
);

// スライド2: J:COM の事例
addContentSlide(prs, "企業導入事例① J:COM", [
  { type: "heading", text: "コールセンター通話分析の自動化" },
  { type: "bullet", text: "導入内容：通話内容の AI 分析・要約" },
  { type: "bullet", text: "削減効果：月あたり 1,500時間" },
  { type: "bullet", text: "これは従業員 50名 分の丸1ヶ月分" },
  { type: "subheading", text: "人間にしかできない カスタマーサービスに注力可能" },
]);

// スライド3: note 社の事例
addContentSlide(prs, "企業導入事例② note 株式会社", [
  { type: "heading", text: "Google Apps Script × Gemini で業務自動化" },
  { type: "bullet", text: "導入内容：バックオフィス業務の自動化" },
  { type: "bullet", text: "削減効果：毎日 1時間、月間 約3時間" },
  { type: "bullet", text: "特徴：専門知識不要で自動化実現" },
  { type: "subheading", text: "スタートアップでも導入可能な手軽さ" },
]);

// スライド4: 日本特殊陶業
addContentSlide(prs, "企業導入事例③ 日本特殊陶業", [
  { type: "heading", text: "製造業での大規模パイロット試験" },
  { type: "bullet", text: "試験規模：15部署・40名" },
  { type: "bullet", text: "ユースケース発掘：60件" },
  { type: "bullet", text: "削減効果：週あたり 3.1時間" },
  { type: "bullet", text: "その後：全社展開を決定" },
  { type: "subheading", text: "業種を問わず導入可能な汎用性" },
]);

// スライド5: 実演（デモスライド）
addDemoSlide(prs, "実演：導入後の3ヶ月・6ヶ月・1年");

// スライド6: Incubeta 社の事例
addContentSlide(prs, "企業導入事例④ Incubeta 社", [
  { type: "heading", text: "マーケティング業務での効率化" },
  { type: "bullet", text: "導入内容：広告キャンペーン最適化" },
  { type: "bullet", text: "成果：ROI を 50% 向上" },
  { type: "bullet", text: "効果対象：マーケティング・営業資料作成" },
  { type: "subheading", text: "創造的な仕事にシフトできる" },
]);

// スライド7: 平均的な削減効果
addContentSlide(prs, "業務時間削減の実績", [
  { type: "heading", text: "Gemini Enterprise 導入企業の平均" },
  { type: "stat", label: "1人あたり年間削減時間", value: "200時間" },
  { type: "subheading", text: "→ 1日あたり約30分、創造的な仕事に充当可能" },
  { type: "heading", text: "最大効率化の例" },
  { type: "stat", label: "効率化率", value: "最大 92%" },
  { type: "subheading", text: "→ 12時間 → 1時間で完成（資料作成・日報など）" },
]);

// スライド8: Gmail での使い方
addContentSlide(prs, "基本的な使い方① Gmail", [
  { type: "heading", text: "メール対応の自動化" },
  { type: "bullet", text: "受信メールを読んで、自動でドラフト生成" },
  { type: "bullet", text: "顧客問い合わせ → 複数案を提案" },
  { type: "bullet", text: "営業担当者が調整して送信" },
  { type: "bullet", text: "効果：メール対応時間 50% 削減" },
  { type: "subheading", text: "毎日使うメールで小さく成功体験" },
]);

// スライド9: ドキュメント・スプレッドシート
addContentSlide(prs, "基本的な使い方② Docs・Sheets", [
  { type: "heading", text: "ドキュメント：提案書の自動生成" },
  { type: "bullet", text: "『3パターンの提案書を作成』と指示" },
  { type: "bullet", text: "即座に複数案が完成" },
  { type: "heading", text: "スプレッドシート：データ分析" },
  { type: "bullet", text: "営業データからグラフを自動生成" },
  { type: "bullet", text: "複数部門データをレポート統合" },
]);

// スライド10: Meet・カレンダー
addContentSlide(prs, "基本的な使い方③ Meet・Calendar", [
  { type: "heading", text: "Google Meet：会議記録の自動化" },
  { type: "bullet", text: "通話内容の自動文字起こし" },
  { type: "bullet", text: "要点の自動抽出 → 議事録完成" },
  { type: "heading", text: "Google カレンダー：スケジュール最適化" },
  { type: "bullet", text: "複数人のスケジュールから最適時間を提案" },
  { type: "bullet", text: "予定の重複を自動検出" },
]);

// スライド11: セキュリティ
addContentSlide(prs, "セキュリティ・プライバシー対応", [
  { type: "heading", text: "企業向けセキュリティ認証" },
  { type: "bullet", text: "HIPAA（医療業界）対応" },
  { type: "bullet", text: "FedRAMP（米国政府機関）対応" },
  { type: "bullet", text: "ISO 27001（国際セキュリティ標準）対応" },
  { type: "subheading", text: "医療・政府機関で使われるレベルのセキュリティ" },
]);

// スライド12: データ保護
addContentSlide(prs, "データ置き場と暗号化", [
  { type: "heading", text: "企業が選べるセキュリティオプション" },
  { type: "bullet", text: "CMEK：企業自身が暗号化キーを保有" },
  { type: "bullet", text: "EKM・HSM：外部キーマネージャー対応" },
  { type: "bullet", text: "DLP：データ損失防止機能で重要情報を保護" },
  { type: "subheading", text: "業界最高水準のセキュリティで安心" },
]);

// スライド13: 導入可能性
addContentSlide(prs, "業種・規模を問わず導入可能", [
  { type: "heading", text: "導入企業の多様性" },
  { type: "bullet", text: "J:COM のような大企業" },
  { type: "bullet", text: "note のような急成長スタートアップ" },
  { type: "bullet", text: "日本特殊陶業のような製造業" },
  { type: "bullet", text: "Incubeta のようなマーケティング企業" },
  { type: "subheading", text: "どんな会社でも、Gemini は活躍の場がある" },
]);

// スライド14: まとめ
addContentSlide(prs, "今日のポイント（まとめ）", [
  { type: "heading", text: "3つの重要ポイント" },
  { type: "bullet", text: "1. Gemini は年間 200時間 の時間削減を実現" },
  { type: "bullet", text: "2. 使い方はシンプル：Gmail から始めて段階的に" },
  { type: "bullet", text: "3. セキュリティは業界最高水準 → 安心して導入可能" },
]);

// スライド15: 次のステップ
addContentSlide(prs, "次のステップ", [
  { type: "heading", text: "最初の3ステップ（実演で確認）" },
  { type: "bullet", text: "ステップ 1：Gmail での自動ドラフト機能から始める" },
  { type: "bullet", text: "ステップ 2：ドキュメントで提案書テンプレートを作成" },
  { type: "bullet", text: "ステップ 3：スプレッドシートで営業データを分析" },
  { type: "subheading", text: "誰でも今週中に始められる" },
]);

// スライド16: 最終メッセージ
addContentSlide(prs, "P-01 から P-05 までのまとめ", [
  { type: "heading", text: "この5部構成の目的" },
  { type: "bullet", text: "P-01：Gemini Enterprise の基本を理解する" },
  { type: "bullet", text: "P-02：Google Workspace 統合を把握する" },
  { type: "bullet", text: "P-03：営業・企画での実践例を学ぶ" },
  { type: "bullet", text: "P-04：セキュリティ・カスタマイズを習得する" },
  { type: "bullet", text: "P-05：実装事例から導入判断・実運用へ" },
  { type: "subheading", text: "皆さんが自信を持って導入できるようにサポート" },
]);

// ファイル出力
prs.writeFile({ fileName: "スライド.pptx" });
console.log("✓ スライド.pptx を生成しました");
