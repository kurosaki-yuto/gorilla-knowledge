const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const {
  FaRobot, FaBullseye, FaCheckCircle,
  FaLightbulb, FaShieldAlt,
  FaLock, FaArrowRight, FaBalanceScale,
  FaFileAlt, FaClipboardList, FaChartBar,
  FaGlobe, FaUsers, FaCode, FaSitemap,
  FaSearch, FaDollarSign, FaCogs
} = require("react-icons/fa");

// =====================================================
// DESIGN SYSTEM
// =====================================================
const C = {
  white: "FFFFFF", offWhite: "FAFBFC", lightGray: "F3F4F6",
  navy: "1B2A4A", navyLight: "2D4A7A",
  accent: "2563EB", accentLight: "DBEAFE", accentMid: "93C5FD",
  textDark: "111827", textBody: "374151", textLight: "6B7280", textMuted: "9CA3AF",
  green: "059669", greenBg: "D1FAE5",
  amber: "D97706", amberBg: "FEF3C7",
  red: "DC2626", redBg: "FEE2E2",
  border: "E5E7EB",
  chatgpt: "10A37F", chatgptBg: "E6F7F1",
  claude: "D4A27F", claudeBg: "FDF2E9",
  gemini: "4285F4", geminiBg: "E8F0FE",
  copilot: "0078D4", copilotBg: "E5F1FB",
  llama: "0668E1", llamaBg: "E3F0FD",
  deepseek: "4A6CF7", deepseekBg: "EEF1FE",
};

const F = { sans: "Calibri", size: { hero: 40, h1: 28, h2: 20, h3: 16, body: 14, label: 12, caption: 10 } };
const L = { W: 10, H: 5.625, mx: 0.75, my: 0.5, gap: 0.3 };
const T = 16; // total slides

// Icon helper
async function icon(IconComponent, color, size = 256) {
  const svg = ReactDOMServer.renderToStaticMarkup(
    React.createElement(IconComponent, { color: `#${color}`, size: String(size) })
  );
  return "image/png;base64," + (await sharp(Buffer.from(svg)).png().toBuffer()).toString("base64");
}

// Layout primitives
function addTopBar(slide, pres) {
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: L.W, h: 0.035, fill: { color: C.accent } });
}

function addFooter(slide, num, total, pres) {
  slide.addShape(pres.shapes.LINE, {
    x: L.mx, y: L.H - 0.4, w: L.W - L.mx * 2, h: 0,
    line: { color: C.border, width: 0.5 }
  });
  slide.addText(`${num} / ${total}`, {
    x: L.W - 1.5, y: L.H - 0.38, w: 1.2, h: 0.3,
    fontSize: F.size.caption, fontFace: F.sans, color: C.textMuted, align: "right", shrinkText: true
  });
  slide.addText("A-103", {
    x: L.mx, y: L.H - 0.38, w: 2, h: 0.3,
    fontSize: F.size.caption, fontFace: F.sans, color: C.textMuted, align: "left", shrinkText: true
  });
}

function addSectionTitle(slide, title, tag) {
  if (tag) {
    slide.addShape(global._pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.15, w: tag.length * 0.1 + 0.4, h: 0.28,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    slide.addText(tag, {
      x: L.mx, y: 0.15, w: tag.length * 0.1 + 0.4, h: 0.28,
      fontSize: F.size.caption, fontFace: F.sans, bold: true,
      color: C.accent, align: "center", valign: "middle", shrinkText: true
    });
  }
  slide.addText(title, {
    x: L.mx, y: tag ? 0.5 : 0.15, w: 8.5, h: 0.5,
    fontSize: F.size.h1, fontFace: F.sans, bold: true,
    color: C.textDark, shrinkText: true
  });
}

function addToolCard(slide, pres, x, y, w, h, toolName, color, bg, desc) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h, fill: { color: C.white }, line: { color: C.border, width: 0.75 }
  });
  slide.addShape(pres.shapes.RECTANGLE, { x, y, w, h: 0.05, fill: { color } });
  slide.addText(toolName, {
    x: x + 0.15, y: y + 0.1, w: w - 0.3, h: 0.3,
    fontSize: F.size.h3, fontFace: F.sans, bold: true, color, valign: "middle", shrinkText: true
  });
  slide.addText(desc, {
    x: x + 0.15, y: y + 0.42, w: w - 0.3, h: h - 0.55,
    fontSize: F.size.label, fontFace: F.sans, color: C.textLight, valign: "top", lineSpacingMultiple: 1.2, shrinkText: true
  });
}

async function main() {
  const pres = new pptxgen();
  global._pres = pres;
  pres.layout = "LAYOUT_16x9";
  pres.author = "Gorilla Knowledge";
  pres.title = "A-103: 主要AIツール徹底比較（2026年3月版）";

  const ic = {
    robot: await icon(FaRobot, C.accent),
    target: await icon(FaBullseye, C.accent),
    check: await icon(FaCheckCircle, C.green),
    bulb: await icon(FaLightbulb, C.amber),
    shield: await icon(FaShieldAlt, C.red),
    lock: await icon(FaLock, C.red),
    arrow: await icon(FaArrowRight, C.accent),
    balance: await icon(FaBalanceScale, C.accent),
    file: await icon(FaFileAlt, C.accent),
    clipboard: await icon(FaClipboardList, C.accent),
    chart: await icon(FaChartBar, C.accent),
    globe: await icon(FaGlobe, C.accent),
    users: await icon(FaUsers, C.accent),
    code: await icon(FaCode, C.accent),
    sitemap: await icon(FaSitemap, C.accent),
    search: await icon(FaSearch, C.accent),
    dollar: await icon(FaDollarSign, C.amber),
    cogs: await icon(FaCogs, C.accent),
  };

  // ============================================================
  // SLIDE 1: TITLE (Navy)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };
    s.addImage({ data: ic.balance, x: (L.W - 0.6) / 2, y: 0.8, w: 0.6, h: 0.6 });
    s.addText("主要AIツール徹底比較", {
      x: 0.5, y: 1.6, w: 9, h: 0.8,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center", shrinkText: true
    });
    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 2.55, w: 3, h: 0, line: { color: C.accentMid, width: 1.5 }
    });
    s.addText("2026年版 — 最適なAIを選ぶための完全ガイド", {
      x: 0.5, y: 2.75, w: 9, h: 0.45,
      fontSize: F.size.h2, fontFace: F.sans, color: C.accentMid, align: "center", shrinkText: true
    });
    s.addText("A-103   |   全社員向け   |   20分", {
      x: 0.5, y: 4.2, w: 9, h: 0.3,
      fontSize: F.size.label, fontFace: F.sans, color: C.textMuted, align: "center", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 2: GOALS
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "今日のゴール");
    addFooter(s, 2, T, pres);

    const goals = [
      "ChatGPT / Claude / Gemini / Copilotの特徴を説明できる",
      "用途に応じて最適なAIツールを選択できる",
      "無料版と有料版の違い、企業利用時の注意点を理解する",
    ];
    goals.forEach((g, i) => {
      const y = 1.1 + i * 1.1;
      s.addText(String(i + 1), {
        x: L.mx, y: y + 0.05, w: 0.5, h: 0.5,
        fontSize: F.size.h2, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: C.accent }, shape: pres.shapes.OVAL, shrinkText: true
      });
      s.addText(g, {
        x: L.mx + 0.7, y, w: 7.5, h: 0.6,
        fontSize: F.size.h3, fontFace: F.sans, color: C.textDark, valign: "middle", shrinkText: true
      });
      if (i < 2) {
        s.addShape(pres.shapes.LINE, {
          x: L.mx, y: y + 0.8, w: L.W - L.mx * 2, h: 0, line: { color: C.border, width: 0.5 }
        });
      }
    });
  }

  // ============================================================
  // SLIDE 3: 2026 AI LANDSCAPE
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "2026年のAIツール勢力図", "LANDSCAPE");
    addFooter(s, 3, T, pres);

    const tools = [
      { name: "ChatGPT", co: "OpenAI", stat: "週間9億ユーザー", color: C.chatgpt, bg: C.chatgptBg },
      { name: "Claude", co: "Anthropic", stat: "1Mトークン対応", color: C.claude, bg: C.claudeBg },
      { name: "Gemini", co: "Google", stat: "Workspace統合", color: C.gemini, bg: C.geminiBg },
      { name: "Copilot", co: "Microsoft", stat: "GPT-5搭載", color: C.copilot, bg: C.copilotBg },
      { name: "Llama 4", co: "Meta", stat: "オープンソース", color: C.llama, bg: C.llamaBg },
      { name: "DeepSeek", co: "中国発OSS", stat: "推論特化", color: C.deepseek, bg: C.deepseekBg },
    ];

    const cardW = 2.55, cardH = 1.25, gapX = 0.3, gapY = 0.25;
    tools.forEach((t, i) => {
      const col = i % 3, row = Math.floor(i / 3);
      const x = L.mx + col * (cardW + gapX);
      const y = 1.1 + row * (cardH + gapY);
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: cardH, fill: { color: C.white }, line: { color: C.border, width: 0.75 }
      });
      s.addShape(pres.shapes.RECTANGLE, { x, y, w: cardW, h: 0.04, fill: { color: t.color } });
      s.addText(`${t.name}`, {
        x: x + 0.12, y: y + 0.1, w: cardW - 0.24, h: 0.28,
        fontSize: F.size.body, fontFace: F.sans, bold: true, color: t.color, shrinkText: true
      });
      s.addText(t.co, {
        x: x + 0.12, y: y + 0.38, w: cardW - 0.24, h: 0.22,
        fontSize: F.size.caption, fontFace: F.sans, color: C.textLight, shrinkText: true
      });
      s.addText(t.stat, {
        x: x + 0.12, y: y + 0.65, w: cardW - 0.24, h: 0.28,
        fontSize: F.size.label, fontFace: F.sans, bold: true, color: C.textBody, shrinkText: true
      });
    });

    // Legend
    s.addText("商用クローズド（左4つ）  vs  オープンソース（右2つ）", {
      x: L.mx, y: 3.85, w: 8, h: 0.3,
      fontSize: F.size.label, fontFace: F.sans, color: C.textMuted, shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 4: ChatGPT DETAIL
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "ChatGPT — GPT-5世代の実力", "ChatGPT");
    addFooter(s, 4, T, pres);

    // Left: Strengths
    s.addText("Strengths", {
      x: L.mx, y: 1.05, w: 4, h: 0.3,
      fontSize: F.size.body, fontFace: F.sans, bold: true, color: C.green, shrinkText: true
    });
    ["GPT-5.3 Instant / o3-pro搭載", "週間9億ユーザーの圧倒的普及", "画像生成・GPTs・コード対応", "Free/Go $8/Plus $20/Pro $200"].forEach((t, i) => {
      s.addText(`✓  ${t}`, {
        x: L.mx + 0.15, y: 1.4 + i * 0.35, w: 4.2, h: 0.32,
        fontSize: F.size.label, fontFace: F.sans, color: C.textBody, shrinkText: true
      });
    });

    // Right: Cautions
    s.addText("Cautions", {
      x: 5.5, y: 1.05, w: 4, h: 0.3,
      fontSize: F.size.body, fontFace: F.sans, bold: true, color: C.amber, shrinkText: true
    });
    ["回答精度にムラがある", "無料版に広告が導入"].forEach((t, i) => {
      s.addText(`⚠  ${t}`, {
        x: 5.65, y: 1.4 + i * 0.35, w: 3.8, h: 0.32,
        fontSize: F.size.label, fontFace: F.sans, color: C.textBody, shrinkText: true
      });
    });

    // Best for
    s.addShape(pres.shapes.RECTANGLE, {
      x: 5.5, y: 2.4, w: 3.8, h: 0.7,
      fill: { color: C.chatgptBg }, rectRadius: 0.08
    });
    s.addText("Best for: アイデア出し / 文章作成\n画像生成 / 翻訳 / 汎用利用", {
      x: 5.65, y: 2.45, w: 3.5, h: 0.6,
      fontSize: F.size.label, fontFace: F.sans, color: C.chatgpt, shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 5: Claude DETAIL
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "Claude — 安全性と長文処理の強み", "Claude");
    addFooter(s, 5, T, pres);

    s.addText("Strengths", {
      x: L.mx, y: 1.05, w: 4, h: 0.3,
      fontSize: F.size.body, fontFace: F.sans, bold: true, color: C.green, shrinkText: true
    });
    ["Opus 4.6 / Sonnet 4.6（1Mトークン）", "論理的精度とビジネス文書品質", "Claude Codeでコーディング支援", "Free / Pro $17-20 / Max $100"].forEach((t, i) => {
      s.addText(`✓  ${t}`, {
        x: L.mx + 0.15, y: 1.4 + i * 0.35, w: 4.2, h: 0.32,
        fontSize: F.size.label, fontFace: F.sans, color: C.textBody, shrinkText: true
      });
    });

    s.addText("Cautions", {
      x: 5.5, y: 1.05, w: 4, h: 0.3,
      fontSize: F.size.body, fontFace: F.sans, bold: true, color: C.amber, shrinkText: true
    });
    ["画像生成は非対応"].forEach((t, i) => {
      s.addText(`⚠  ${t}`, {
        x: 5.65, y: 1.4 + i * 0.35, w: 3.8, h: 0.32,
        fontSize: F.size.label, fontFace: F.sans, color: C.textBody, shrinkText: true
      });
    });

    s.addShape(pres.shapes.RECTANGLE, {
      x: 5.5, y: 2.4, w: 3.8, h: 0.7,
      fill: { color: C.claudeBg }, rectRadius: 0.08
    });
    s.addText("Best for: 長文分析 / 契約書作成\nコーディング / ビジネス文書", {
      x: 5.65, y: 2.45, w: 3.5, h: 0.6,
      fontSize: F.size.label, fontFace: F.sans, color: C.claude, shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 6: Gemini DETAIL
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "Gemini — Google統合の威力", "Gemini");
    addFooter(s, 6, T, pres);

    s.addText("Strengths", {
      x: L.mx, y: 1.05, w: 4, h: 0.3,
      fontSize: F.size.body, fontFace: F.sans, bold: true, color: C.green, shrinkText: true
    });
    ["3.1 Pro / Flash Live搭載", "Google Workspace完全統合", "リアルタイム検索で最新情報", "Free / AI Pro $19.99 / Ultra $124.99"].forEach((t, i) => {
      s.addText(`✓  ${t}`, {
        x: L.mx + 0.15, y: 1.4 + i * 0.35, w: 4.2, h: 0.32,
        fontSize: F.size.label, fontFace: F.sans, color: C.textBody, shrinkText: true
      });
    });

    s.addText("Cautions", {
      x: 5.5, y: 1.05, w: 4, h: 0.3,
      fontSize: F.size.body, fontFace: F.sans, bold: true, color: C.amber, shrinkText: true
    });
    ["AI Ultra高額（$124.99/月）", "独自差別化がやや弱い"].forEach((t, i) => {
      s.addText(`⚠  ${t}`, {
        x: 5.65, y: 1.4 + i * 0.35, w: 3.8, h: 0.32,
        fontSize: F.size.label, fontFace: F.sans, color: C.textBody, shrinkText: true
      });
    });

    s.addShape(pres.shapes.RECTANGLE, {
      x: 5.5, y: 2.4, w: 3.8, h: 0.7,
      fill: { color: C.geminiBg }, rectRadius: 0.08
    });
    s.addText("Best for: リサーチ / Gmail連携\nGoogle Docs / リアルタイム検索", {
      x: 5.65, y: 2.45, w: 3.5, h: 0.6,
      fontSize: F.size.label, fontFace: F.sans, color: C.gemini, shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 7: Copilot DETAIL
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "Microsoft Copilot — Office連携の決定版", "Copilot");
    addFooter(s, 7, T, pres);

    s.addText("Strengths", {
      x: L.mx, y: 1.05, w: 4, h: 0.3,
      fontSize: F.size.body, fontFace: F.sans, bold: true, color: C.green, shrinkText: true
    });
    ["GPT-5搭載", "Word / Excel / PPT / Teams統合", "企業向けセキュリティ設計", "Web無料 / M365 Copilot $30/月"].forEach((t, i) => {
      s.addText(`✓  ${t}`, {
        x: L.mx + 0.15, y: 1.4 + i * 0.35, w: 4.2, h: 0.32,
        fontSize: F.size.label, fontFace: F.sans, color: C.textBody, shrinkText: true
      });
    });

    s.addText("Cautions", {
      x: 5.5, y: 1.05, w: 4, h: 0.3,
      fontSize: F.size.body, fontFace: F.sans, bold: true, color: C.amber, shrinkText: true
    });
    ["M365ライセンス必須", "コストが他ツールより高い"].forEach((t, i) => {
      s.addText(`⚠  ${t}`, {
        x: 5.65, y: 1.4 + i * 0.35, w: 3.8, h: 0.32,
        fontSize: F.size.label, fontFace: F.sans, color: C.textBody, shrinkText: true
      });
    });

    s.addShape(pres.shapes.RECTANGLE, {
      x: 5.5, y: 2.4, w: 3.8, h: 0.7,
      fill: { color: C.copilotBg }, rectRadius: 0.08
    });
    s.addText("Best for: Word文書 / Excel分析\nPPT作成 / Teams会議要約", {
      x: 5.65, y: 2.45, w: 3.5, h: 0.6,
      fontSize: F.size.label, fontFace: F.sans, color: C.copilot, shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 8: OPEN SOURCE
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "オープンソース勢力", "OPEN SOURCE");
    addFooter(s, 8, T, pres);

    // Llama 4
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 1.05, w: 3.9, h: 2.1,
      fill: { color: C.white }, line: { color: C.border, width: 0.75 }
    });
    s.addShape(pres.shapes.RECTANGLE, { x: L.mx, y: 1.05, w: 3.9, h: 0.05, fill: { color: C.llama } });
    s.addText("Llama 4（Meta）", {
      x: L.mx + 0.15, y: 1.15, w: 3.6, h: 0.3,
      fontSize: F.size.h3, fontFace: F.sans, bold: true, color: C.llama, shrinkText: true
    });
    ["Scout / Maverick 2モデル", "無料で自社サーバー展開可", "商用利用 + カスタマイズ自由"].forEach((t, i) => {
      s.addText(`✓  ${t}`, {
        x: L.mx + 0.15, y: 1.55 + i * 0.32, w: 3.6, h: 0.3,
        fontSize: F.size.label, fontFace: F.sans, color: C.textBody, shrinkText: true
      });
    });

    // DeepSeek
    s.addShape(pres.shapes.RECTANGLE, {
      x: 5.35, y: 1.05, w: 3.9, h: 2.1,
      fill: { color: C.white }, line: { color: C.border, width: 0.75 }
    });
    s.addShape(pres.shapes.RECTANGLE, { x: 5.35, y: 1.05, w: 3.9, h: 0.05, fill: { color: C.deepseek } });
    s.addText("DeepSeek（中国発）", {
      x: 5.5, y: 1.15, w: 3.6, h: 0.3,
      fontSize: F.size.h3, fontFace: F.sans, bold: true, color: C.deepseek, shrinkText: true
    });
    ["V3 / R1 モデル", "推論タスクに特に強い", "無料 / オープンソース"].forEach((t, i) => {
      s.addText(`✓  ${t}`, {
        x: 5.5, y: 1.55 + i * 0.32, w: 3.6, h: 0.3,
        fontSize: F.size.label, fontFace: F.sans, color: C.textBody, shrinkText: true
      });
    });

    // Shared note
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.4, w: L.W - L.mx * 2, h: 0.55,
      fill: { color: C.amberBg }, rectRadius: 0.06
    });
    s.addText("共通注意: 自社サーバー運用の技術力が必要 / データ社外流出ゼロを実現可能", {
      x: L.mx + 0.15, y: 3.42, w: L.W - L.mx * 2 - 0.3, h: 0.5,
      fontSize: F.size.label, fontFace: F.sans, color: C.amber, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 9: PRICING COMPARISON
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "無料版 vs 有料版 比較表", "PRICING");
    addFooter(s, 9, T, pres);

    const tableW = L.W - L.mx * 2;
    const cols = [
      { name: "ツール", width: 1.4 },
      { name: "無料版", width: 2.5 },
      { name: "有料版", width: 2.8 },
      { name: "月額", width: 1.8 },
    ];
    const rows = [
      ["ChatGPT", "GPT-5.3(広告あり/制限)", "Plus: o3-pro等全モデル", "Go $8 / Plus $20"],
      ["Claude", "Sonnet 4.6(制限あり)", "Pro: Opus 4.6+1Mトークン", "Pro $17-20"],
      ["Gemini", "基本チャット機能", "AI Pro: Workspace連携", "AI Pro $19.99"],
      ["Copilot", "Web版のみ", "M365: Office完全統合", "M365 $30/月"],
    ];

    const headerRow = cols.map(c => ({
      text: c.name,
      options: { bold: true, color: C.white, fill: { color: C.accent }, fontSize: F.size.label }
    }));
    const dataRows = rows.map(row => row.map((cell, ci) => ({
      text: cell,
      options: { align: ci === 0 ? "left" : "left", bold: ci === 0, color: C.textBody, fontSize: F.size.label }
    })));

    s.addTable([headerRow, ...dataRows], {
      x: L.mx, y: 1.1, w: tableW,
      border: { type: "solid", color: C.border, pt: 0.5 },
      colW: cols.map(c => c.width),
      fontSize: F.size.label, fontFace: F.sans,
      align: "left", valign: "middle", rowH: 0.5,
    });

    s.addText("まず無料版で試して、業務に合うか確認してから有料版を検討", {
      x: L.mx, y: 3.75, w: 8, h: 0.3,
      fontSize: F.size.label, fontFace: F.sans, color: C.accent, bold: true, shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 10: TASK-BASED RECOMMENDATIONS
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "業務別おすすめツール", "RECOMMENDATIONS");
    addFooter(s, 10, T, pres);

    const recs = [
      { task: "文書作成", tool: "ChatGPT / Claude", note: "速度ならChatGPT、正確さならClaude", color: C.chatgpt },
      { task: "データ分析", tool: "Copilot / Claude", note: "ExcelならCopilot、PDF/CSVならClaude", color: C.copilot },
      { task: "コーディング", tool: "Claude Code / ChatGPT", note: "自律エージェントならClaude Code", color: C.claude },
      { task: "リサーチ", tool: "Gemini / ChatGPT", note: "リアルタイム検索ならGemini", color: C.gemini },
    ];

    recs.forEach((r, i) => {
      const y = 1.05 + i * 0.85;
      // Card bg
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.7,
        fill: { color: C.offWhite }, line: { color: C.border, width: 0.5 }, rectRadius: 0.06
      });
      s.addShape(pres.shapes.RECTANGLE, { x: L.mx, y, w: 0.06, h: 0.7, fill: { color: r.color } });
      s.addText(r.task, {
        x: L.mx + 0.25, y: y + 0.05, w: 1.8, h: 0.6,
        fontSize: F.size.body, fontFace: F.sans, bold: true, color: C.textDark, valign: "middle", shrinkText: true
      });
      s.addText(r.tool, {
        x: 2.8, y: y + 0.02, w: 3.2, h: 0.35,
        fontSize: F.size.body, fontFace: F.sans, bold: true, color: r.color, shrinkText: true
      });
      s.addText(r.note, {
        x: 2.8, y: y + 0.35, w: 6, h: 0.3,
        fontSize: F.size.caption, fontFace: F.sans, color: C.textLight, shrinkText: true
      });
    });
  }

  // ============================================================
  // SLIDE 11: ENTERPRISE SELECTION
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "企業導入時の選定ポイント", "ENTERPRISE");
    addFooter(s, 11, T, pres);

    const points = [
      { num: "1", title: "セキュリティ", desc: "データの学習利用ポリシーを確認\nエンタープライズ契約の有無", color: C.red, ic: ic.shield },
      { num: "2", title: "コスト", desc: "ユーザー数 × 月額で総コスト試算\n100人×Copilot = 年$36,000", color: C.amber, ic: ic.dollar },
      { num: "3", title: "統合性", desc: "M365環境 → Copilot\nGoogle環境 → Gemini", color: C.accent, ic: ic.cogs },
    ];

    points.forEach((p, i) => {
      const y = 1.05 + i * 1.05;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.9,
        fill: { color: C.white }, line: { color: C.border, width: 0.75 }
      });
      s.addShape(pres.shapes.RECTANGLE, { x: L.mx, y, w: 0.07, h: 0.9, fill: { color: p.color } });
      s.addImage({ data: p.ic, x: L.mx + 0.25, y: y + 0.18, w: 0.4, h: 0.4 });
      s.addText(`${p.num}. ${p.title}`, {
        x: L.mx + 0.85, y: y + 0.05, w: 6.5, h: 0.32,
        fontSize: F.size.h3, fontFace: F.sans, bold: true, color: p.color, shrinkText: true
      });
      s.addText(p.desc, {
        x: L.mx + 0.85, y: y + 0.4, w: 7, h: 0.45,
        fontSize: F.size.label, fontFace: F.sans, color: C.textBody, lineSpacingMultiple: 1.2, shrinkText: true
      });
    });
  }

  // ============================================================
  // SLIDE 12: DATA PRIVACY
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "データプライバシーの注意点", "PRIVACY");
    addFooter(s, 12, T, pres);

    // Warning box
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 1.05, w: L.W - L.mx * 2, h: 0.65,
      fill: { color: C.redBg }, rectRadius: 0.06
    });
    s.addImage({ data: ic.lock, x: L.mx + 0.15, y: 1.12, w: 0.35, h: 0.35 });
    s.addText("無料版では入力データがAI学習に使われる可能性あり", {
      x: L.mx + 0.65, y: 1.08, w: 7.5, h: 0.55,
      fontSize: F.size.body, fontFace: F.sans, bold: true, color: C.red, valign: "middle", shrinkText: true
    });

    // NG items
    s.addText("入力NGデータ", {
      x: L.mx, y: 1.9, w: 4, h: 0.3,
      fontSize: F.size.body, fontFace: F.sans, bold: true, color: C.textDark, shrinkText: true
    });
    ["個人情報・顧客データ", "未公開の財務情報", "機密プロジェクト情報"].forEach((t, i) => {
      s.addText(`✕  ${t}`, {
        x: L.mx + 0.15, y: 2.25 + i * 0.32, w: 4, h: 0.3,
        fontSize: F.size.label, fontFace: F.sans, color: C.red, shrinkText: true
      });
    });

    // Solution
    s.addText("対策", {
      x: 5.5, y: 1.9, w: 4, h: 0.3,
      fontSize: F.size.body, fontFace: F.sans, bold: true, color: C.textDark, shrinkText: true
    });
    ["有料版/エンタープライズ版を利用", "オープンソースでオンプレミス運用", "ツールごとのポリシーを確認"].forEach((t, i) => {
      s.addText(`✓  ${t}`, {
        x: 5.65, y: 2.25 + i * 0.32, w: 3.8, h: 0.3,
        fontSize: F.size.label, fontFace: F.sans, color: C.green, shrinkText: true
      });
    });
  }

  // ============================================================
  // SLIDE 13: MULTI-TOOL STRATEGY
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "複数ツール使い分け戦略", "STRATEGY");
    addFooter(s, 13, T, pres);

    // Main strategy
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 1.05, w: L.W - L.mx * 2, h: 0.55,
      fill: { color: C.accentLight }, rectRadius: 0.06
    });
    s.addText("メインツール 1つ  +  サブツール 1-2つ  が最適解", {
      x: L.mx + 0.15, y: 1.08, w: L.W - L.mx * 2 - 0.3, h: 0.5,
      fontSize: F.size.body, fontFace: F.sans, bold: true, color: C.accent, valign: "middle", shrinkText: true
    });

    // Example
    s.addText("例: 3ツール体制", {
      x: L.mx, y: 1.8, w: 8, h: 0.3,
      fontSize: F.size.body, fontFace: F.sans, bold: true, color: C.textDark, shrinkText: true
    });

    const examples = [
      { role: "メイン", tool: "ChatGPT", use: "日常の文書作成・チャット", color: C.chatgpt },
      { role: "サブ1", tool: "Claude", use: "長文分析・正確性重視の作業", color: C.claude },
      { role: "サブ2", tool: "Copilot", use: "Excel/Word/Teams業務", color: C.copilot },
    ];
    examples.forEach((e, i) => {
      const y = 2.2 + i * 0.5;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: 1.0, h: 0.38,
        fill: { color: e.color }, rectRadius: 0.04
      });
      s.addText(e.role, {
        x: L.mx, y, w: 1.0, h: 0.38,
        fontSize: F.size.label, fontFace: F.sans, bold: true, color: C.white, align: "center", valign: "middle", shrinkText: true
      });
      s.addText(`${e.tool} — ${e.use}`, {
        x: L.mx + 1.2, y, w: 7, h: 0.38,
        fontSize: F.size.body, fontFace: F.sans, color: C.textBody, valign: "middle", shrinkText: true
      });
    });

    s.addText("社内でルールを統一 → セキュリティ管理 + コスト管理を効率化", {
      x: L.mx, y: 3.95, w: 8, h: 0.3,
      fontSize: F.size.label, fontFace: F.sans, color: C.textLight, shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 14: FLOWCHART
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "ツール選定フローチャート", "FLOWCHART");
    addFooter(s, 14, T, pres);

    const steps = [
      { q: "Microsoft 365環境？", a: "Yes → Copilot", color: C.copilot, bg: C.copilotBg },
      { q: "Google Workspace環境？", a: "Yes → Gemini", color: C.gemini, bg: C.geminiBg },
      { q: "長文分析・正確さ最優先？", a: "Yes → Claude", color: C.claude, bg: C.claudeBg },
      { q: "データ社外NG？", a: "Yes → Llama 4 / DeepSeek", color: C.llama, bg: C.llamaBg },
      { q: "汎用的に使いたい", a: "→ ChatGPT", color: C.chatgpt, bg: C.chatgptBg },
    ];

    steps.forEach((st, i) => {
      const y = 1.05 + i * 0.62;
      // Question
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: 4.5, h: 0.48,
        fill: { color: C.offWhite }, line: { color: C.border, width: 0.5 }, rectRadius: 0.06
      });
      s.addText(st.q, {
        x: L.mx + 0.1, y, w: 4.3, h: 0.48,
        fontSize: F.size.label, fontFace: F.sans, color: C.textBody, valign: "middle", shrinkText: true
      });
      // Arrow + Answer
      s.addShape(pres.shapes.RECTANGLE, {
        x: 5.5, y, w: 3.75, h: 0.48,
        fill: { color: st.bg }, rectRadius: 0.06
      });
      s.addText(st.a, {
        x: 5.6, y, w: 3.55, h: 0.48,
        fontSize: F.size.label, fontFace: F.sans, bold: true, color: st.color, valign: "middle", shrinkText: true
      });
      // Connector arrow
      s.addText("→", {
        x: 5.25, y, w: 0.3, h: 0.48,
        fontSize: F.size.body, fontFace: F.sans, color: C.textMuted, align: "center", valign: "middle", shrinkText: true
      });
    });
  }

  // ============================================================
  // SLIDE 15: SUMMARY
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "まとめ");
    addFooter(s, 15, T, pres);

    const items = [
      "6つの主要ツールにはそれぞれ明確な得意分野がある",
      "業務環境とタスクに合わせてツールを選ぶのが成功の鍵",
      "無料版で試してから有料版を検討しよう",
      "セキュリティ・社内ルール・ファクトチェックは必須",
    ];
    items.forEach((item, i) => {
      const y = 1.1 + i * 0.75;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.6,
        fill: { color: i % 2 === 0 ? C.offWhite : C.white }, rectRadius: 0.06
      });
      s.addText(String(i + 1), {
        x: L.mx + 0.15, y: y + 0.08, w: 0.4, h: 0.4,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: C.accent }, shape: pres.shapes.OVAL, shrinkText: true
      });
      s.addText(item, {
        x: L.mx + 0.7, y, w: 7.5, h: 0.6,
        fontSize: F.size.h3, fontFace: F.sans, color: C.textDark, valign: "middle", shrinkText: true
      });
    });
  }

  // ============================================================
  // SLIDE 16: END (Navy)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };

    s.addText("ご視聴ありがとうございました", {
      x: 0.5, y: 1.2, w: 9, h: 0.7,
      fontSize: F.size.h1, fontFace: F.sans, bold: true,
      color: C.white, align: "center", shrinkText: true
    });

    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 2.1, w: 3, h: 0, line: { color: C.accentMid, width: 1.5 }
    });

    s.addShape(pres.shapes.RECTANGLE, {
      x: 2.5, y: 2.6, w: 5, h: 0.55,
      fill: { color: C.accent }, rectRadius: 0.08
    });
    s.addText("確認テスト（5問） — 80%以上で修了", {
      x: 2.5, y: 2.6, w: 5, h: 0.55,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.white, align: "center", valign: "middle", shrinkText: true
    });

    s.addText("A-103   |   主要AIツール徹底比較   |   16 / 16", {
      x: 0.5, y: 4.2, w: 9, h: 0.3,
      fontSize: F.size.caption, fontFace: F.sans,
      color: C.textMuted, align: "center", shrinkText: true
    });
  }

  // ============================================================
  // SAVE
  // ============================================================
  const outPath = __dirname + "/スライド.pptx";
  await pres.writeFile({ fileName: outPath });
  console.log(`[完了] ${outPath}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
