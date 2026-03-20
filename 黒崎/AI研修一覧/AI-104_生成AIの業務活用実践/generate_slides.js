const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const {
  FaFileAlt, FaChartBar, FaSearch, FaLightbulb, FaCog,
  FaClock, FaArrowRight, FaCheckCircle, FaArrowDown,
  FaBullseye, FaEnvelope, FaClipboardList, FaRocket,
  FaUsers, FaStar, FaChevronRight, FaTable
} = require("react-icons/fa");

// =====================================================
// CONSULTING-GRADE DESIGN SYSTEM
// =====================================================

const C = {
  white: "FFFFFF",
  offWhite: "FAFBFC",
  lightGray: "F3F4F6",
  navy: "1B2A4A",
  navyLight: "2D4A7A",
  accent: "2563EB",
  accentLight: "DBEAFE",
  accentMid: "93C5FD",
  textDark: "111827",
  textBody: "374151",
  textMuted: "9CA3AF",
  textLight: "6B7280",
  green: "059669",
  greenBg: "D1FAE5",
  amber: "D97706",
  amberBg: "FEF3C7",
  red: "DC2626",
  redBg: "FEE2E2",
  border: "E5E7EB",
};

const F = {
  sans: "Calibri",
  size: {
    hero: 44, h1: 32, h2: 22, h3: 18, body: 16,
    label: 13, caption: 11, tag: 10,
  }
};

const L = { W: 10, H: 5.625, mx: 0.75, my: 0.5, gap: 0.3 };

// Icon helper
async function icon(IconComponent, color, size = 256) {
  const svg = ReactDOMServer.renderToStaticMarkup(
    React.createElement(IconComponent, { color: `#${color}`, size: String(size) })
  );
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

// Layout primitives
function addTopBar(slide, pres) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: L.W, h: 0.035, fill: { color: C.accent }
  });
}

function addFooter(slide, num, total, pres) {
  slide.addShape(pres.shapes.LINE, {
    x: L.mx, y: L.H - 0.4, w: L.W - L.mx * 2, h: 0,
    line: { color: C.border, width: 0.5 }
  });
  slide.addText(`${num} / ${total}`, {
    x: L.W - 1.5, y: L.H - 0.38, w: 1.2, h: 0.3,
    fontSize: F.size.caption, fontFace: F.sans,
    color: C.textMuted, align: "right", margin: 0
  });
  slide.addText("AI-104", {
    x: L.mx, y: L.H - 0.38, w: 2, h: 0.3,
    fontSize: F.size.caption, fontFace: F.sans,
    color: C.textMuted, align: "left", margin: 0
  });
}

function addSectionTitle(slide, title, pres, tag) {
  if (tag) {
    slide.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.45, w: tag.length * 0.12 + 0.4, h: 0.3,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    slide.addText(tag, {
      x: L.mx, y: 0.45, w: tag.length * 0.12 + 0.4, h: 0.3,
      fontSize: F.size.tag, fontFace: F.sans, bold: true,
      color: C.accent, align: "center", valign: "middle"
    });
  }
  slide.addText(title, {
    x: L.mx, y: tag ? 0.85 : 0.35, w: 8.5, h: 0.55,
    fontSize: F.size.h1, fontFace: F.sans, bold: true,
    color: C.textDark, margin: 0
  });
}

async function main() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "Gorilla Knowledge";
  pres.title = "AI-104: 生成AIの業務活用実践 — 日常業務をAIで効率化する";

  const T = 12;

  // Pre-render icons
  const ic = {
    fileAlt: await icon(FaFileAlt, C.accent),
    chartBar: await icon(FaChartBar, C.green),
    search: await icon(FaSearch, C.amber),
    lightbulb: await icon(FaLightbulb, C.amber),
    cog: await icon(FaCog, C.accent),
    clock: await icon(FaClock, C.red),
    arrowRight: await icon(FaArrowRight, C.accent),
    arrowDown: await icon(FaArrowDown, C.accent),
    check: await icon(FaCheckCircle, C.green),
    checkBlue: await icon(FaCheckCircle, C.accent),
    target: await icon(FaBullseye, C.accent),
    envelope: await icon(FaEnvelope, C.accent),
    clipboard: await icon(FaClipboardList, C.accent),
    rocket: await icon(FaRocket, C.accent),
    users: await icon(FaUsers, C.accent),
    star: await icon(FaStar, C.amber),
    chevron: await icon(FaChevronRight, C.textMuted),
    table: await icon(FaTable, C.accent),
  };

  // ============================================================
  // SLIDE 1: TITLE (Navy background)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };

    s.addImage({ data: ic.rocket, x: (L.W - 0.7) / 2, y: 1.0, w: 0.7, h: 0.7 });

    s.addText("生成AIの業務活用実践", {
      x: 0.5, y: 1.9, w: 9, h: 0.9,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center", margin: 0
    });

    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 2.95, w: 3, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });

    s.addText("日常業務をAIで効率化する", {
      x: 0.5, y: 3.15, w: 9, h: 0.5,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", margin: 0
    });

    s.addText("AI-104   |   全社員向け（AI-103修了者）   |   10分", {
      x: 0.5, y: 4.2, w: 9, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textMuted, align: "center", margin: 0
    });
  }

  // ============================================================
  // SLIDE 2: GOALS
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "今日のゴール", pres);
    addFooter(s, 2, T, pres);

    const goals = [
      "生成AIで効率化できる5つの業務カテゴリを挙げられる",
      "各業務での具体的なプロンプト例を実践できる",
      "AI活用のBefore/After（工数削減）を定量的にイメージできる",
    ];

    goals.forEach((g, i) => {
      const y = 1.25 + i * 1.15;
      s.addText(String(i + 1), {
        x: L.mx, y: y + 0.05, w: 0.55, h: 0.55,
        fontSize: F.size.h2, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: C.accent }, shape: pres.shapes.OVAL
      });
      s.addText(g, {
        x: L.mx + 0.8, y, w: 7.5, h: 0.65,
        fontSize: F.size.h3, fontFace: F.sans,
        color: C.textDark, valign: "middle", margin: 0
      });
      if (i < 2) {
        s.addShape(pres.shapes.LINE, {
          x: L.mx, y: y + 0.85, w: L.W - L.mx * 2, h: 0,
          line: { color: C.border, width: 0.5 }
        });
      }
    });
  }

  // ============================================================
  // SLIDE 3: 5 CATEGORIES (5 card grid)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "生成AIで効率化できる5つの業務", pres);
    addFooter(s, 3, T, pres);

    const categories = [
      { ic: ic.fileAlt, label: "文書作成", desc: "メール・議事録・報告書", color: C.accent, bg: C.accentLight },
      { ic: ic.chartBar, label: "データ分析", desc: "集計・グラフ解釈・レポート", color: C.green, bg: C.greenBg },
      { ic: ic.search, label: "リサーチ", desc: "市場調査・競合分析・論文要約", color: C.amber, bg: C.amberBg },
      { ic: ic.lightbulb, label: "アイデア出し", desc: "企画・コピー・ブレスト", color: C.amber, bg: C.amberBg },
      { ic: ic.cog, label: "ワークフロー自動化", desc: "定型作業・テンプレート", color: C.accent, bg: C.accentLight },
    ];

    // Row 1: 3 cards, Row 2: 2 cards centered
    const cardW = 2.55;
    const cardH = 2.6;
    const cardGap = 0.25;

    // Row 1
    const row1StartX = (L.W - (cardW * 3 + cardGap * 2)) / 2;
    const row1Y = 1.1;
    // Row 2
    const row2StartX = (L.W - (cardW * 2 + cardGap)) / 2;
    const row2Y = 1.1 + cardH + 0.2;

    categories.forEach((cat, i) => {
      let x, y;
      if (i < 3) {
        x = row1StartX + i * (cardW + cardGap);
        y = row1Y;
      } else {
        x = row2StartX + (i - 3) * (cardW + cardGap);
        y = row2Y;
      }

      // Card border
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: cardH,
        fill: { color: C.white },
        line: { color: C.border, width: 0.75 }
      });
      // Top color band
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 0.06, fill: { color: cat.color }
      });
      // Icon circle
      s.addShape(pres.shapes.OVAL, {
        x: x + (cardW - 0.6) / 2, y: y + 0.3, w: 0.6, h: 0.6,
        fill: { color: cat.bg }
      });
      s.addImage({ data: cat.ic, x: x + (cardW - 0.35) / 2, y: y + 0.42, w: 0.35, h: 0.35 });
      // Label
      s.addText(cat.label, {
        x, y: y + 1.1, w: cardW, h: 0.45,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, align: "center", margin: 0
      });
      // Divider
      s.addShape(pres.shapes.LINE, {
        x: x + 0.4, y: y + 1.65, w: cardW - 0.8, h: 0,
        line: { color: C.border, width: 0.5 }
      });
      // Description
      s.addText(cat.desc, {
        x, y: y + 1.75, w: cardW, h: 0.6,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textLight, align: "center", margin: [0, 0.15, 0, 0.15]
      });
    });
  }

  // ============================================================
  // SLIDE 4: CATEGORY 1 - Document Creation
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);

    // Tag
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.35, w: 1.2, h: 0.28,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    s.addText("活用 ①", {
      x: L.mx, y: 0.35, w: 1.2, h: 0.28,
      fontSize: F.size.tag, fontFace: F.sans, bold: true,
      color: C.accent, align: "center", valign: "middle"
    });
    s.addText("文書作成", {
      x: L.mx, y: 0.7, w: 8, h: 0.5,
      fontSize: F.size.h1, fontFace: F.sans, bold: true,
      color: C.textDark, margin: 0
    });
    s.addText("メール・議事録・報告書の作成をAIで大幅スピードアップ", {
      x: L.mx, y: 1.2, w: 8.5, h: 0.3,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textLight, margin: 0
    });
    addFooter(s, 4, T, pres);

    // Before/After table
    const tblX = L.mx;
    const tblY = 1.7;
    const cols = [2.5, 1.8, 1.8, 1.4];
    const tblW = cols.reduce((a, b) => a + b, 0);
    const rowH = 0.5;
    const headers = ["業務", "従来", "AI活用後", "削減率"];

    // Header
    s.addShape(pres.shapes.RECTANGLE, {
      x: tblX, y: tblY, w: tblW, h: rowH,
      fill: { color: C.accent }
    });
    let cx = tblX;
    headers.forEach((h, i) => {
      s.addText(h, {
        x: cx + 0.15, y: tblY, w: cols[i] - 0.15, h: rowH,
        fontSize: F.size.label, fontFace: F.sans, bold: true,
        color: C.white, valign: "middle", margin: 0
      });
      cx += cols[i];
    });

    const rows = [
      ["メール作成", "15分", "3分", "80%"],
      ["議事録作成", "30分", "5分", "83%"],
      ["報告書ドラフト", "60分", "15分", "75%"],
    ];

    rows.forEach((row, ri) => {
      const ry = tblY + (ri + 1) * rowH;
      const bg = ri % 2 === 0 ? C.offWhite : C.white;
      s.addShape(pres.shapes.RECTANGLE, {
        x: tblX, y: ry, w: tblW, h: rowH, fill: { color: bg }
      });
      cx = tblX;
      row.forEach((cell, ci) => {
        s.addText(cell, {
          x: cx + 0.15, y: ry, w: cols[ci] - 0.15, h: rowH,
          fontSize: F.size.body, fontFace: F.sans,
          bold: ci === 3, color: ci === 3 ? C.green : C.textBody,
          valign: "middle", margin: 0
        });
        cx += cols[ci];
      });
    });

    // Prompt example box
    const promptY = 3.55;
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: promptY, w: L.W - L.mx * 2, h: 1.1,
      fill: { color: C.accentLight }
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: promptY, w: 0.05, h: 1.1, fill: { color: C.accent }
    });
    s.addText("プロンプト例", {
      x: L.mx + 0.25, y: promptY + 0.05, w: 3, h: 0.3,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.accent, margin: 0
    });
    s.addText("「以下の会議メモをもとに、議事録を作成してください。\n参加者・決定事項・次のアクションを整理してください。」", {
      x: L.mx + 0.25, y: promptY + 0.35, w: L.W - L.mx * 2 - 0.5, h: 0.65,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textBody, margin: 0
    });
  }

  // ============================================================
  // SLIDE 5: CATEGORY 2 - Data Analysis
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);

    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.35, w: 1.2, h: 0.28,
      fill: { color: C.greenBg }, rectRadius: 0.05
    });
    s.addText("活用 ②", {
      x: L.mx, y: 0.35, w: 1.2, h: 0.28,
      fontSize: F.size.tag, fontFace: F.sans, bold: true,
      color: C.green, align: "center", valign: "middle"
    });
    s.addText("データ分析・集計の補助", {
      x: L.mx, y: 0.7, w: 8, h: 0.5,
      fontSize: F.size.h1, fontFace: F.sans, bold: true,
      color: C.textDark, margin: 0
    });
    s.addText("Excelデータの要約、グラフ解釈、レポート作成をAIがサポート", {
      x: L.mx, y: 1.2, w: 8.5, h: 0.3,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textLight, margin: 0
    });
    addFooter(s, 5, T, pres);

    // Before/After highlight
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 1.7, w: L.W - L.mx * 2, h: 0.65,
      fill: { color: C.greenBg }
    });
    s.addImage({ data: ic.clock, x: L.mx + 0.2, y: 1.82, w: 0.35, h: 0.35 });
    s.addText("データ要約:  40分  →  10分（75%削減）", {
      x: L.mx + 0.75, y: 1.7, w: 7, h: 0.65,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.green, valign: "middle", margin: 0
    });

    // Examples
    const examples = [
      "Excelのデータを貼り付けて「売上の傾向を分析して」",
      "グラフを見せて「この推移から読み取れるポイントを3つ挙げて」",
      "「前年同期比で異常値があれば指摘して」",
    ];

    examples.forEach((e, i) => {
      const y = 2.6 + i * 0.55;
      s.addImage({ data: ic.chevron, x: L.mx + 0.15, y: y + 0.12, w: 0.2, h: 0.2 });
      s.addText(e, {
        x: L.mx + 0.55, y, w: 7.5, h: 0.45,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, valign: "middle", margin: 0
      });
    });

    // Prompt box
    const promptY = 4.3;
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: promptY, w: L.W - L.mx * 2, h: 0.75,
      fill: { color: C.accentLight }
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: promptY, w: 0.05, h: 0.75, fill: { color: C.accent }
    });
    s.addText("プロンプト例: 「以下の売上データを分析して、上位3つのトレンドと注意すべきポイントを教えてください。」", {
      x: L.mx + 0.25, y: promptY, w: L.W - L.mx * 2 - 0.5, h: 0.75,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textBody, valign: "middle", margin: 0
    });
  }

  // ============================================================
  // SLIDE 6: CATEGORY 3 - Research
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);

    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.35, w: 1.2, h: 0.28,
      fill: { color: C.amberBg }, rectRadius: 0.05
    });
    s.addText("活用 ③", {
      x: L.mx, y: 0.35, w: 1.2, h: 0.28,
      fontSize: F.size.tag, fontFace: F.sans, bold: true,
      color: C.amber, align: "center", valign: "middle"
    });
    s.addText("リサーチ・情報収集", {
      x: L.mx, y: 0.7, w: 8, h: 0.5,
      fontSize: F.size.h1, fontFace: F.sans, bold: true,
      color: C.textDark, margin: 0
    });
    s.addText("市場調査・競合分析・論文要約を効率化", {
      x: L.mx, y: 1.2, w: 8.5, h: 0.3,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textLight, margin: 0
    });
    addFooter(s, 6, T, pres);

    // Before/After highlight
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 1.7, w: L.W - L.mx * 2, h: 0.65,
      fill: { color: C.amberBg }
    });
    s.addImage({ data: ic.clock, x: L.mx + 0.2, y: 1.82, w: 0.35, h: 0.35 });
    s.addText("市場調査レポート:  3時間  →  45分（75%削減）", {
      x: L.mx + 0.75, y: 1.7, w: 7.5, h: 0.65,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.amber, valign: "middle", margin: 0
    });

    // 3 use cases with left accent
    const useCases = [
      { label: "市場調査", prompt: "「〇〇業界の2025年トレンドを5つ教えて」" },
      { label: "競合分析", prompt: "「A社とB社のサービスを比較表にして」" },
      { label: "論文要約", prompt: "「この論文の要点を3つにまとめて」" },
    ];

    useCases.forEach((uc, i) => {
      const y = 2.65 + i * 0.7;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.6,
        fill: { color: C.offWhite }
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: 0.05, h: 0.6, fill: { color: C.amber }
      });
      s.addText(uc.label, {
        x: L.mx + 0.3, y, w: 1.5, h: 0.6,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.textDark, valign: "middle", margin: 0
      });
      s.addText(uc.prompt, {
        x: L.mx + 2.0, y, w: 6.0, h: 0.6,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, valign: "middle", margin: 0
      });
    });

    // Note
    s.addText("※ AIの情報には古いものや不正確なものが混じる場合あり → 一次ソースで裏取りを", {
      x: L.mx, y: 4.85, w: L.W - L.mx * 2, h: 0.3,
      fontSize: F.size.label, fontFace: F.sans, italic: true,
      color: C.textLight, margin: 0
    });
  }

  // ============================================================
  // SLIDE 7: CATEGORY 4 - Brainstorming
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);

    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.35, w: 1.2, h: 0.28,
      fill: { color: C.amberBg }, rectRadius: 0.05
    });
    s.addText("活用 ④", {
      x: L.mx, y: 0.35, w: 1.2, h: 0.28,
      fontSize: F.size.tag, fontFace: F.sans, bold: true,
      color: C.amber, align: "center", valign: "middle"
    });
    s.addText("アイデア出し・ブレスト", {
      x: L.mx, y: 0.7, w: 8, h: 0.5,
      fontSize: F.size.h1, fontFace: F.sans, bold: true,
      color: C.textDark, margin: 0
    });
    s.addText("企画書・キャッチコピー・会議のファシリテーションに活用", {
      x: L.mx, y: 1.2, w: 8.5, h: 0.3,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textLight, margin: 0
    });
    addFooter(s, 7, T, pres);

    // Before/After
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 1.7, w: L.W - L.mx * 2, h: 0.65,
      fill: { color: C.amberBg }
    });
    s.addImage({ data: ic.clock, x: L.mx + 0.2, y: 1.82, w: 0.35, h: 0.35 });
    s.addText("企画案ブレスト:  60分  →  15分（75%削減）", {
      x: L.mx + 0.75, y: 1.7, w: 7, h: 0.65,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.amber, valign: "middle", margin: 0
    });

    // 3 examples
    const examples = [
      { label: "企画書", prompt: "「新入社員向け研修企画を5案出して」" },
      { label: "キャッチコピー", prompt: "「〇〇商品のキャッチコピーを10案考えて」" },
      { label: "会議準備", prompt: "「このテーマで議論すべき論点を5つ挙げて」" },
    ];

    examples.forEach((e, i) => {
      const y = 2.65 + i * 0.7;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.6,
        fill: { color: C.offWhite }
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: 0.05, h: 0.6, fill: { color: C.amber }
      });
      s.addText(e.label, {
        x: L.mx + 0.3, y, w: 2.0, h: 0.6,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.textDark, valign: "middle", margin: 0
      });
      s.addText(e.prompt, {
        x: L.mx + 2.5, y, w: 5.5, h: 0.6,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, valign: "middle", margin: 0
      });
    });

    // Insight
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.85, w: L.W - L.mx * 2, h: 0.35,
      fill: { color: C.accentLight }
    });
    s.addImage({ data: ic.lightbulb, x: L.mx + 0.15, y: 4.88, w: 0.25, h: 0.25 });
    s.addText("AIの案をそのまま使うのではなく、発想のきっかけとして活用する", {
      x: L.mx + 0.55, y: 4.85, w: 7.5, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", margin: 0
    });
  }

  // ============================================================
  // SLIDE 8: CATEGORY 5 - Workflow Automation
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);

    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.35, w: 1.2, h: 0.28,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    s.addText("活用 ⑤", {
      x: L.mx, y: 0.35, w: 1.2, h: 0.28,
      fontSize: F.size.tag, fontFace: F.sans, bold: true,
      color: C.accent, align: "center", valign: "middle"
    });
    s.addText("ワークフロー自動化", {
      x: L.mx, y: 0.7, w: 8, h: 0.5,
      fontSize: F.size.h1, fontFace: F.sans, bold: true,
      color: C.textDark, margin: 0
    });
    s.addText("定型作業の効率化・テンプレート活用で日々の業務をスマートに", {
      x: L.mx, y: 1.2, w: 8.5, h: 0.3,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textLight, margin: 0
    });
    addFooter(s, 8, T, pres);

    // Before/After
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 1.7, w: L.W - L.mx * 2, h: 0.65,
      fill: { color: C.accentLight }
    });
    s.addImage({ data: ic.clock, x: L.mx + 0.2, y: 1.82, w: 0.35, h: 0.35 });
    s.addText("定型メール:  10分/件  →  2分/件（80%削減）", {
      x: L.mx + 0.75, y: 1.7, w: 7, h: 0.65,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", margin: 0
    });

    // Examples
    const items = [
      { label: "定型作業", desc: "お礼メール、フォローアップメールのテンプレート化" },
      { label: "テンプレート活用", desc: "報告書フォーマットの自動生成・再利用" },
      { label: "チェックリスト", desc: "プロジェクトのタスク洗い出し、抜け漏れ防止" },
    ];

    items.forEach((item, i) => {
      const y = 2.65 + i * 0.7;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.6,
        fill: { color: C.offWhite }
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: 0.05, h: 0.6, fill: { color: C.accent }
      });
      s.addText(item.label, {
        x: L.mx + 0.3, y, w: 2.3, h: 0.6,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.textDark, valign: "middle", margin: 0
      });
      s.addText(item.desc, {
        x: L.mx + 2.8, y, w: 5.2, h: 0.6,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, valign: "middle", margin: 0
      });
    });

    // Insight
    s.addText("小さな効率化の積み重ねが、大きな時間の節約につながる", {
      x: L.mx, y: 4.85, w: L.W - L.mx * 2, h: 0.3,
      fontSize: F.size.label, fontFace: F.sans, italic: true,
      color: C.textLight, margin: 0
    });
  }

  // ============================================================
  // SLIDE 9: BEFORE/AFTER SUMMARY TABLE
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "Before/After 総まとめ", pres);
    addFooter(s, 9, T, pres);

    const colW = [2.5, 1.8, 1.8, 1.4];
    const tblW = colW.reduce((a, b) => a + b, 0);
    const tblX = (L.W - tblW) / 2;
    const tblY = 1.15;
    const rowH = 0.52;

    const headers = ["業務", "従来の時間", "AI活用後", "削減率"];

    // Header
    s.addShape(pres.shapes.RECTANGLE, {
      x: tblX, y: tblY, w: tblW, h: rowH,
      fill: { color: C.navy }
    });
    let cx = tblX;
    headers.forEach((h, i) => {
      s.addText(h, {
        x: cx, y: tblY, w: colW[i], h: rowH,
        fontSize: F.size.label, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle"
      });
      cx += colW[i];
    });

    const rows = [
      ["メール作成", "15分", "3分", "80%"],
      ["議事録作成", "30分", "5分", "83%"],
      ["データ要約", "40分", "10分", "75%"],
      ["市場調査", "3時間", "45分", "75%"],
      ["企画ブレスト", "60分", "15分", "75%"],
      ["定型メール", "10分/件", "2分/件", "80%"],
    ];

    rows.forEach((row, ri) => {
      cx = tblX;
      const ry = tblY + (ri + 1) * rowH;
      const bg = ri % 2 === 0 ? C.offWhite : C.white;
      row.forEach((cell, ci) => {
        s.addShape(pres.shapes.RECTANGLE, {
          x: cx, y: ry, w: colW[ci], h: rowH,
          fill: { color: bg }
        });
        s.addText(cell, {
          x: cx, y: ry, w: colW[ci], h: rowH,
          fontSize: F.size.body, fontFace: F.sans,
          bold: ci === 3, color: ci === 3 ? C.green : C.textDark,
          align: "center", valign: "middle"
        });
        cx += colW[ci];
      });
    });

    // Bottom insight
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.65, w: L.W - L.mx * 2, h: 0.5,
      fill: { color: C.accentLight }
    });
    s.addImage({ data: ic.star, x: L.mx + 0.2, y: 4.73, w: 0.3, h: 0.3 });
    s.addText("いずれも70〜80%以上の時間削減。年間数百時間の業務時間を創出できるポテンシャル。", {
      x: L.mx + 0.7, y: 4.65, w: 7.5, h: 0.5,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", margin: 0
    });
  }

  // ============================================================
  // SLIDE 10: SUCCESS TIPS
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "AI活用 成功のコツ", pres);
    addFooter(s, 10, T, pres);

    const tips = [
      {
        icon: ic.arrowRight, num: "1",
        title: "段階的に導入する",
        desc: "いきなり全業務に適用せず、まずは1つの業務から始める",
        color: C.accent, bg: C.accentLight
      },
      {
        icon: ic.checkBlue, num: "2",
        title: "小さく始める",
        desc: "メール1通、議事録1件から。完璧を目指さなくてOK",
        color: C.green, bg: C.greenBg
      },
      {
        icon: ic.users, num: "3",
        title: "チームで共有する",
        desc: "良いプロンプトやうまくいった事例は、チームの資産になる",
        color: C.amber, bg: C.amberBg
      },
    ];

    tips.forEach((t, i) => {
      const y = 1.2 + i * 1.15;

      // Card
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.95,
        fill: { color: C.white },
        line: { color: C.border, width: 0.5 }
      });
      // Left accent
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: 0.05, h: 0.95, fill: { color: t.color }
      });

      // Number circle
      s.addText(t.num, {
        x: L.mx + 0.3, y: y + 0.2, w: 0.5, h: 0.5,
        fontSize: F.size.h2, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: t.color }, shape: pres.shapes.OVAL
      });

      // Title
      s.addText(t.title, {
        x: L.mx + 1.1, y: y + 0.05, w: 7, h: 0.4,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, valign: "middle", margin: 0
      });
      // Desc
      s.addText(t.desc, {
        x: L.mx + 1.1, y: y + 0.5, w: 7, h: 0.35,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textLight, valign: "top", margin: 0
      });
    });

    // Bottom callout
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.6, w: L.W - L.mx * 2, h: 0.5,
      fill: { color: C.navy }
    });
    s.addText("「完璧を目指さず、まず使ってみること」が最大のコツ", {
      x: L.mx + 0.3, y: 4.6, w: L.W - L.mx * 2 - 0.6, h: 0.5,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.white, align: "center", valign: "middle"
    });
  }

  // ============================================================
  // SLIDE 11: SUMMARY
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.offWhite };
    addTopBar(s, pres);
    addSectionTitle(s, "まとめ", pres);
    addFooter(s, 11, T, pres);

    const items = [
      { label: "5大カテゴリ", text: "文書作成・データ分析・リサーチ・アイデア出し・自動化", color: C.accent },
      { label: "具体プロンプト", text: "目的と条件を明確に伝えることで精度が上がる", color: C.green },
      { label: "工数削減", text: "各業務で70〜80%以上の時間短縮が見込める", color: C.amber },
      { label: "成功のコツ", text: "小さく始めて、段階的に広げ、チームで共有する", color: C.red },
    ];

    items.forEach((item, i) => {
      const y = 1.2 + i * 0.95;

      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.75,
        fill: { color: C.white },
        line: { color: C.border, width: 0.5 }
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: 0.05, h: 0.75, fill: { color: item.color }
      });
      s.addText(item.label, {
        x: L.mx + 0.35, y, w: 2.0, h: 0.75,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: item.color, valign: "middle", margin: 0
      });
      s.addText(item.text, {
        x: L.mx + 2.5, y, w: 5.8, h: 0.75,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textDark, valign: "middle", margin: 0
      });
    });
  }

  // ============================================================
  // SLIDE 12: END (Navy background)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };

    s.addText("お疲れさまでした！", {
      x: 0.5, y: 1.2, w: 9, h: 0.8,
      fontSize: 36, fontFace: F.sans, bold: true,
      color: C.white, align: "center", margin: 0
    });

    // CTA box
    s.addShape(pres.shapes.RECTANGLE, {
      x: 2.5, y: 2.3, w: 5, h: 2.2,
      fill: { color: C.white }
    });

    s.addText("確認テスト（5問）", {
      x: 2.5, y: 2.5, w: 5, h: 0.55,
      fontSize: F.size.h2, fontFace: F.sans, bold: true,
      color: C.textDark, align: "center", margin: 0
    });

    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 3.1, w: 3, h: 0,
      line: { color: C.border, width: 0.5 }
    });

    s.addText("80%以上の正答で修了", {
      x: 2.5, y: 3.25, w: 5, h: 0.45,
      fontSize: F.size.h3, fontFace: F.sans,
      color: C.accent, align: "center", margin: 0
    });

    s.addText("次の動画: AI-105", {
      x: 2.5, y: 3.8, w: 5, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textMuted, align: "center", margin: 0
    });
  }

  // Write
  const out = "/Users/kurosakiyuto/Downloads/開発/gorilla-knowledge/黒崎/AI研修一覧/AI-104_生成AIの業務活用実践/スライド.pptx";
  await pres.writeFile({ fileName: out });
  console.log("Generated:", out);
}

main().catch(console.error);
