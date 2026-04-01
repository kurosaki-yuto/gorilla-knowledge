/**
 * AI研修スライド デザインシステム
 * コンサルティングファーム品質（McKinsey/BCG/NotebookLM style）
 *
 * 設計原則:
 * - 白ベース + ネイビータイトル（サンドイッチ構造）
 * - 1色アクセント + セマンティックカラーのみ
 * - 本文16pt以上、タイトル32pt以上
 * - 余白たっぷり、装飾なし
 * - レイアウトにバリエーション（テーブル/カード/フロー図）
 */

// =====================================================
// カラーパレット（60/30/10 ルール）
// 60% = 背景白, 30% = テキスト/カード, 10% = アクセント
// =====================================================

const COLORS = {
  // 背景
  white: "FFFFFF",
  offWhite: "FAFBFC",
  lightGray: "F3F4F6",

  // タイトルスライド用ネイビー
  navy: "1B2A4A",
  navyLight: "2D4A7A",

  // アクセント（1色のみ — 抑制的に使う）
  accent: "2563EB",
  accentLight: "DBEAFE",
  accentMid: "93C5FD",

  // テキスト階層（コントラスト順）
  textDark: "111827",     // 見出し
  textBody: "374151",     // 本文
  textLight: "6B7280",    // 補足
  textMuted: "9CA3AF",    // キャプション

  // セマンティック（必要な場面でのみ使用）
  green: "059669",
  greenBg: "D1FAE5",
  amber: "D97706",
  amberBg: "FEF3C7",
  red: "DC2626",
  redBg: "FEE2E2",

  // 罫線
  border: "E5E7EB",
};

// =====================================================
// フォント
// =====================================================

const FONTS = {
  primary: "Calibri",    // コンサル標準
  size: {
    hero: 44,            // タイトルスライド
    h1: 32,              // セクションタイトル
    h2: 22,              // カードタイトル
    h3: 18,              // サブヘッダー
    body: 16,            // 本文（これ以下にしない）
    label: 13,           // ラベル
    caption: 11,         // キャプション
    tag: 10,             // タグ
  }
};

// =====================================================
// レイアウト（インチ単位）
// =====================================================

const LAYOUT = {
  W: 10,                 // スライド幅
  H: 5.625,              // スライド高さ（16:9）
  mx: 0.75,              // 左右マージン
  my: 0.5,               // 上下マージン
  gap: 0.3,              // 要素間ギャップ
  cardPad: 0.3,          // カード内パディング
};

// =====================================================
// スライドヘルパー関数
// =====================================================

/**
 * トップバー（ブランドアイデンティティ）
 * 全コンテンツスライドに表示
 */
function addTopBar(slide, pres) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: LAYOUT.W, h: 0.035,
    fill: { color: COLORS.accent }
  });
}

/**
 * フッター（スライド番号 + コースID）
 */
function addFooter(slide, courseId, num, total) {
  slide.addShape(pres.shapes.LINE, {
    x: LAYOUT.mx, y: LAYOUT.H - 0.4,
    w: LAYOUT.W - LAYOUT.mx * 2, h: 0,
    line: { color: COLORS.border, width: 0.5 }
  });
  slide.addText(`${num} / ${total}`, {
    x: LAYOUT.W - 1.5, y: LAYOUT.H - 0.38, w: 1.2, h: 0.3,
    fontSize: FONTS.size.caption, fontFace: FONTS.primary,
    color: COLORS.textMuted, align: "right", margin: 0
  });
  slide.addText(courseId, {
    x: LAYOUT.mx, y: LAYOUT.H - 0.38, w: 2, h: 0.3,
    fontSize: FONTS.size.caption, fontFace: FONTS.primary,
    color: COLORS.textMuted, align: "left", margin: 0
  });
}

/**
 * セクションタイトル（左揃え、太字）
 */
function addSectionTitle(slide, title) {
  slide.addText(title, {
    x: LAYOUT.mx, y: 0.35, w: 8.5, h: 0.55,
    fontSize: FONTS.size.h1, fontFace: FONTS.primary, bold: true,
    color: COLORS.textDark, margin: 0
  });
}

/**
 * 番号タグ（01, 02, 03...）
 */
function addNumberTag(slide, pres, num, color, bgColor) {
  const numStr = String(num).padStart(2, "0");
  slide.addShape(pres.shapes.RECTANGLE, {
    x: LAYOUT.mx, y: 0.35, w: 0.7, h: 0.28,
    fill: { color: bgColor }, rectRadius: 0.05
  });
  slide.addText(numStr, {
    x: LAYOUT.mx, y: 0.35, w: 0.7, h: 0.28,
    fontSize: FONTS.size.tag, fontFace: FONTS.primary, bold: true,
    color: color, align: "center", valign: "middle"
  });
}

// =====================================================
// アイコンレンダラー
// =====================================================

const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");

async function renderIcon(IconComponent, color, size = 256) {
  const svg = ReactDOMServer.renderToStaticMarkup(
    React.createElement(IconComponent, { color: `#${color}`, size: String(size) })
  );
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

// =====================================================
// エクスポート
// =====================================================

module.exports = {
  COLORS,
  FONTS,
  LAYOUT,
  addTopBar,
  addFooter,
  addSectionTitle,
  addNumberTag,
  renderIcon,
};
