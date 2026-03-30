const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const {
  FaPencilAlt, FaListOl, FaChevronRight, FaLightbulb,
  FaCheckCircle, FaTimesCircle, FaBrain, FaArrowRight,
  FaExclamationTriangle, FaSearch, FaFileAlt, FaChartBar,
  FaCogs, FaStar, FaLock, FaTable, FaCode, FaEnvelope,
  FaClipboardList, FaLayerGroup
} = require("react-icons/fa");

// =====================================================
// DESIGN SYSTEM — COLORS / FONTS / LAYOUT
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
  tab1: "98D4BB",
  tab2: "C7B8EA",
  tab3: "F4B8C5",
  tab4: "A8D8EA",
  tab5: "FFE6A7",
};

const F = {
  sans: "Calibri",
  sansBold: "Calibri",
  size: {
    hero: 44,
    h1: 32,
    h2: 22,
    h3: 18,
    body: 16,
    label: 13,
    caption: 11,
    tag: 10,
  }
};

const L = {
  W: 10,
  H: 5.625,
  mx: 0.75,
  my: 0.5,
  gap: 0.3,
};

// Icon helper
async function icon(IconComponent, color, size = 256) {
  const svg = ReactDOMServer.renderToStaticMarkup(
    React.createElement(IconComponent, { color: `#${color}`, size: String(size) })
  );
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

let pres;

// Layout primitives
function addTopBar(slide) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: L.W, h: 0.035, fill: { color: C.accent }
  });
}

function addFooter(slide, num, total) {
  slide.addShape(pres.shapes.LINE, {
    x: L.mx, y: L.H - 0.4, w: L.W - L.mx * 2, h: 0,
    line: { color: C.border, width: 0.5 }
  });
  slide.addText(`${num} / ${total}`, {
    x: L.W - 1.5, y: L.H - 0.38, w: 1.2, h: 0.3,
    fontSize: F.size.caption, fontFace: F.sans,
    color: C.textMuted, align: "right", margin: 0
  });
  slide.addText("A-106", {
    x: L.mx, y: L.H - 0.38, w: 2, h: 0.3,
    fontSize: F.size.caption, fontFace: F.sans,
    color: C.textMuted, align: "left", margin: 0
  });
}

function addSectionTitle(slide, title, tag) {
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
  pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "Gorilla Knowledge";
  pres.title = "A-106: プロンプト実践テクニック — AIの回答精度を引き上げる応用スキル";

  // Pre-render icons
  const ic = {
    pencil: await icon(FaPencilAlt, C.accent),
    list: await icon(FaListOl, C.accent),
    bulb: await icon(FaLightbulb, C.amber),
    check: await icon(FaCheckCircle, C.green),
    cross: await icon(FaTimesCircle, C.red),
    brain: await icon(FaBrain, C.accent),
    arrow: await icon(FaArrowRight, C.accent),
    warn: await icon(FaExclamationTriangle, C.amber),
    search: await icon(FaSearch, C.accent),
    file: await icon(FaFileAlt, C.accent),
    chart: await icon(FaChartBar, C.accent),
    cogs: await icon(FaCogs, C.accent),
    star: await icon(FaStar, C.amber),
    lock: await icon(FaLock, C.red),
    table: await icon(FaTable, C.accent),
    code: await icon(FaCode, C.accent),
    envelope: await icon(FaEnvelope, C.accent),
    clipboard: await icon(FaClipboardList, C.accent),
    layer: await icon(FaLayerGroup, C.accent),
  };

  const T = 12;

  // ============================================================
  // SLIDE 1: TITLE
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };

    s.addImage({ data: ic.pencil, x: (L.W - 0.7) / 2, y: 1.0, w: 0.7, h: 0.7 });

    s.addText("プロンプト実践テクニック", {
      x: 0.5, y: 1.9, w: 9, h: 0.9,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center", margin: 0
    });

    s.addShape(pres.shapes.LINE, {
      x: 3.0, y: 2.95, w: 4, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });

    s.addText("AIの回答精度を引き上げる応用スキル", {
      x: 0.5, y: 3.15, w: 9, h: 0.5,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", margin: 0
    });

    s.addText("A-106   |   入門〜中級   |   20分", {
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
    addTopBar(s);
    addSectionTitle(s, "今日のゴール");
    addFooter(s, 2, T);

    const goals = [
      "Few-shot（例示）プロンプティングを実践できる",
      "Chain-of-Thought（段階的思考）の使い方を理解する",
      "ステップバイステップ指示、出力形式指定、制約条件設定を使い分けられる",
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
  // SLIDE 3: 5 TECHNIQUES OVERVIEW
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addSectionTitle(s, "プロンプト実践テクニック 5選");
    addFooter(s, 3, T);

    const techs = [
      { num: "01", label: "Few-shot", desc: "例を見せて精度UP", color: C.tab1, ic: ic.search },
      { num: "02", label: "CoT", desc: "段階的に考えさせる", color: C.tab2, ic: ic.brain },
      { num: "03", label: "Step指示", desc: "作業を分解する", color: C.tab3, ic: ic.clipboard },
      { num: "04", label: "形式指定", desc: "使える形で出力", color: C.tab4, ic: ic.table },
      { num: "05", label: "制約設定", desc: "ルールで品質を守る", color: C.tab5, ic: ic.lock },
    ];

    const cardW = 1.55;
    const cardGap = 0.15;
    const totalW = cardW * 5 + cardGap * 4;
    const startX = (L.W - totalW) / 2;

    techs.forEach((t, i) => {
      const x = startX + i * (cardW + cardGap);
      const y = 1.15;
      const h = 3.6;

      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h,
        fill: { color: C.white },
        line: { color: C.border, width: 0.75 }
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 0.06, fill: { color: t.color }
      });
      s.addText(t.num, {
        x: x + (cardW - 0.4) / 2, y: y + 0.25, w: 0.4, h: 0.4,
        fontSize: F.size.h2, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: C.accent }, shape: pres.shapes.OVAL
      });
      s.addImage({ data: t.ic, x: x + (cardW - 0.35) / 2, y: y + 0.85, w: 0.35, h: 0.35 });
      s.addText(t.label, {
        x, y: y + 1.4, w: cardW, h: 0.4,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, align: "center", margin: 0
      });
      s.addText(t.desc, {
        x: x + 0.1, y: y + 2.0, w: cardW - 0.2, h: 0.8,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textLight, align: "center", valign: "top", margin: 0
      });
    });
  }

  // ============================================================
  // SLIDE 4: FEW-SHOT BASICS
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addSectionTitle(s, "テクニック1 — Few-shot（例示）", "Technique 01");
    addFooter(s, 4, T);

    // Definition
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 1.15, w: L.W - L.mx * 2, h: 0.55,
      fill: { color: C.accentLight }
    });
    s.addText("期待する入出力の「例」を2〜3個示してからタスクを依頼する", {
      x: L.mx + 0.2, y: 1.15, w: L.W - L.mx * 2 - 0.4, h: 0.55,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", margin: 0
    });

    // Two columns
    const colW = 3.9;
    const colY = 1.95;
    const colH = 2.7;

    // Zero-shot (bad)
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: colY, w: colW, h: colH,
      fill: { color: C.white }, line: { color: C.red, width: 1.5 }
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: colY, w: colW, h: 0.45,
      fill: { color: C.redBg }
    });
    s.addImage({ data: ic.cross, x: L.mx + 0.12, y: colY + 0.08, w: 0.25, h: 0.25 });
    s.addText("Zero-shot（例なし）", {
      x: L.mx + 0.45, y: colY, w: 3, h: 0.45,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.red, valign: "middle", margin: 0
    });
    s.addText("「レビューをポジティブ・ネガティブ・\nニュートラルに分類して」", {
      x: L.mx + 0.2, y: colY + 0.65, w: colW - 0.4, h: 0.7,
      fontSize: F.size.label, fontFace: F.sans, italic: true,
      color: C.textBody, valign: "middle", margin: 0
    });
    s.addText("→ 判断基準が曖昧...", {
      x: L.mx + 0.2, y: colY + 1.8, w: colW - 0.4, h: 0.4,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.red, valign: "middle", margin: 0
    });

    // Arrow
    s.addImage({ data: ic.arrow, x: L.mx + colW + 0.1, y: colY + colH / 2 - 0.2, w: 0.35, h: 0.35 });

    // Few-shot (good)
    const rx = L.mx + colW + 0.6;
    s.addShape(pres.shapes.RECTANGLE, {
      x: rx, y: colY, w: colW, h: colH,
      fill: { color: C.white }, line: { color: C.green, width: 1.5 }
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: rx, y: colY, w: colW, h: 0.45,
      fill: { color: C.greenBg }
    });
    s.addImage({ data: ic.check, x: rx + 0.12, y: colY + 0.08, w: 0.25, h: 0.25 });
    s.addText("Few-shot（例あり）", {
      x: rx + 0.45, y: colY, w: 3, h: 0.45,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.green, valign: "middle", margin: 0
    });

    const examples = [
      "例1: 「最高です!」→ ポジティブ",
      "例2: 「届くのが遅い」→ ネガティブ",
      "例3: 「普通に使える」→ ニュートラル",
    ];
    examples.forEach((ex, i) => {
      s.addText(ex, {
        x: rx + 0.2, y: colY + 0.6 + i * 0.35, w: colW - 0.4, h: 0.3,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textBody, valign: "middle", margin: 0
      });
    });
    s.addText("→ 精度が大幅UP!", {
      x: rx + 0.2, y: colY + 1.8, w: colW - 0.4, h: 0.4,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.green, valign: "middle", margin: 0
    });

    // Bottom tip
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.85, w: L.W - L.mx * 2, h: 0.4,
      fill: { color: C.navy }
    });
    s.addText("Point: 例は2〜3個で十分。代表的なパターンを厳選する", {
      x: L.mx + 0.3, y: 4.85, w: L.W - L.mx * 2 - 0.6, h: 0.4,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.white, valign: "middle", margin: 0
    });
  }

  // ============================================================
  // SLIDE 5: FEW-SHOT APPLIED
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addSectionTitle(s, "Few-shot 応用 — 業務での活用シーン", "Technique 01 応用");
    addFooter(s, 5, T);

    const cases = [
      { label: "トーン統一", desc: "チャット → ビジネスメール変換", ic: ic.envelope, color: C.tab1 },
      { label: "データ整形", desc: "住所の正規化・フォーマット変換", ic: ic.chart, color: C.tab4 },
      { label: "分類・ラベル付け", desc: "問い合わせカテゴリ振り分け", ic: ic.layer, color: C.tab2 },
    ];

    const cardW = 2.6;
    const cardGap = 0.25;
    const totalW = cardW * 3 + cardGap * 2;
    const startX = (L.W - totalW) / 2;

    cases.forEach((c, i) => {
      const x = startX + i * (cardW + cardGap);
      const y = 1.35;
      const h = 2.5;

      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h,
        fill: { color: C.white }, line: { color: C.border, width: 0.75 }
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 0.06, fill: { color: c.color }
      });
      s.addImage({ data: c.ic, x: x + (cardW - 0.4) / 2, y: y + 0.3, w: 0.4, h: 0.4 });
      s.addText(c.label, {
        x, y: y + 0.85, w: cardW, h: 0.4,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, align: "center", margin: 0
      });
      s.addText(c.desc, {
        x: x + 0.15, y: y + 1.4, w: cardW - 0.3, h: 0.8,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textLight, align: "center", valign: "top", margin: 0
      });
    });

    // Bottom insight
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.15, w: L.W - L.mx * 2, h: 0.55,
      fill: { color: C.accentLight }
    });
    s.addImage({ data: ic.bulb, x: L.mx + 0.2, y: 4.22, w: 0.35, h: 0.35 });
    s.addText("核心: 言葉で基準を説明するより、具体例を見せるほうが早くて正確", {
      x: L.mx + 0.7, y: 4.15, w: L.W - L.mx * 2 - 1, h: 0.55,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", margin: 0
    });
  }

  // ============================================================
  // SLIDE 6: CHAIN-OF-THOUGHT BASICS
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addSectionTitle(s, "テクニック2 — Chain-of-Thought", "Technique 02");
    s.addText("段階的思考", {
      x: L.mx, y: 1.05, w: 8.5, h: 0.3,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textLight, margin: 0
    });
    addFooter(s, 6, T);

    const colW = 3.9;
    const colY = 1.35;
    const colH = 2.8;

    // Normal prompt
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: colY, w: colW, h: colH,
      fill: { color: C.white }, line: { color: C.red, width: 1.5 }
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: colY, w: colW, h: 0.45,
      fill: { color: C.redBg }
    });
    s.addText("通常プロンプト", {
      x: L.mx + 0.2, y: colY, w: 3, h: 0.45,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.red, valign: "middle", margin: 0
    });
    s.addText("「マーケティング予算100万円の\n最適な配分を教えて」", {
      x: L.mx + 0.2, y: colY + 0.65, w: colW - 0.4, h: 0.7,
      fontSize: F.size.label, fontFace: F.sans, italic: true,
      color: C.textBody, valign: "middle", margin: 0
    });
    s.addText("→ 根拠が薄い即答...", {
      x: L.mx + 0.2, y: colY + 2.0, w: colW - 0.4, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.red, valign: "middle", margin: 0
    });

    // Arrow
    s.addImage({ data: ic.arrow, x: L.mx + colW + 0.1, y: colY + colH / 2 - 0.2, w: 0.35, h: 0.35 });

    // CoT prompt
    const rx = L.mx + colW + 0.6;
    s.addShape(pres.shapes.RECTANGLE, {
      x: rx, y: colY, w: colW, h: colH,
      fill: { color: C.white }, line: { color: C.green, width: 1.5 }
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: rx, y: colY, w: colW, h: 0.45,
      fill: { color: C.greenBg }
    });
    s.addText("CoTプロンプト", {
      x: rx + 0.2, y: colY, w: 3, h: 0.45,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.green, valign: "middle", margin: 0
    });

    const steps = [
      "1. 市場状況を分析",
      "2. 各チャネルのROI推定",
      "3. 優先順位を決定",
      "4. 金額配分を提示",
      "5. 根拠を説明",
    ];
    steps.forEach((st, i) => {
      s.addText(st, {
        x: rx + 0.2, y: colY + 0.6 + i * 0.3, w: colW - 0.4, h: 0.25,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textBody, valign: "middle", margin: 0
      });
    });
    s.addText("→ 論理的で説得力のある回答!", {
      x: rx + 0.2, y: colY + 2.0, w: colW - 0.4, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.green, valign: "middle", margin: 0
    });

    // Bottom
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.45, w: L.W - L.mx * 2, h: 0.4,
      fill: { color: C.navy }
    });
    s.addText("効果的な場面: 計算 / 比較分析 / 意思決定 / 原因分析", {
      x: L.mx + 0.3, y: 4.45, w: L.W - L.mx * 2 - 0.6, h: 0.4,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.white, valign: "middle", margin: 0
    });
  }

  // ============================================================
  // SLIDE 7: COT APPLIED
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addSectionTitle(s, "Chain-of-Thought 応用テクニック", "Technique 02 応用");
    addFooter(s, 7, T);

    const colW = 3.9;
    const colY = 1.35;
    const colH = 1.8;

    // Pattern A
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: colY, w: colW, h: colH,
      fill: { color: C.white }, line: { color: C.tab2, width: 1.5 }
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: colY, w: colW, h: 0.4,
      fill: { color: "E8E0F7" }
    });
    s.addText("構文A: 「まず〜、次に〜、最後に〜」", {
      x: L.mx + 0.15, y: colY, w: colW - 0.3, h: 0.4,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", margin: 0
    });
    s.addText("まず課題を洗い出して\n次に解決策を3つずつ提案して\n最後に優先順位をつけて", {
      x: L.mx + 0.2, y: colY + 0.55, w: colW - 0.4, h: 0.9,
      fontSize: F.size.label, fontFace: F.sans, italic: true,
      color: C.textBody, valign: "middle", margin: 0
    });

    // Pattern B
    const rx = L.mx + colW + 0.7;
    s.addShape(pres.shapes.RECTANGLE, {
      x: rx, y: colY, w: colW, h: colH,
      fill: { color: C.white }, line: { color: C.tab4, width: 1.5 }
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: rx, y: colY, w: colW, h: 0.4,
      fill: { color: "D4EDFA" }
    });
    s.addText("構文B: 「理由→結論」", {
      x: rx + 0.15, y: colY, w: colW - 0.3, h: 0.4,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", margin: 0
    });
    s.addText("理由を3つ挙げてから\n結論を出してください", {
      x: rx + 0.2, y: colY + 0.55, w: colW - 0.4, h: 0.9,
      fontSize: F.size.label, fontFace: F.sans, italic: true,
      color: C.textBody, valign: "middle", margin: 0
    });

    // Before/After
    const baY = 3.5;
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: baY, w: (L.W - L.mx * 2) / 2 - 0.1, h: 1.0,
      fill: { color: C.redBg }, line: { color: C.border, width: 0.5 }
    });
    s.addText("Before", {
      x: L.mx + 0.15, y: baY + 0.05, w: 1, h: 0.25,
      fontSize: F.size.tag, fontFace: F.sans, bold: true,
      color: C.red, margin: 0
    });
    s.addText("「コスト削減案を教えて」\n→ 思いつきの一般論", {
      x: L.mx + 0.15, y: baY + 0.35, w: 3.7, h: 0.55,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textBody, margin: 0
    });

    const afterX = L.mx + (L.W - L.mx * 2) / 2 + 0.1;
    s.addShape(pres.shapes.RECTANGLE, {
      x: afterX, y: baY, w: (L.W - L.mx * 2) / 2 - 0.1, h: 1.0,
      fill: { color: C.greenBg }, line: { color: C.border, width: 0.5 }
    });
    s.addText("After", {
      x: afterX + 0.15, y: baY + 0.05, w: 1, h: 0.25,
      fontSize: F.size.tag, fontFace: F.sans, bold: true,
      color: C.green, margin: 0
    });
    s.addText("「コスト構造→削減手法→投資対効果」\n→ 根拠のある具体策", {
      x: afterX + 0.15, y: baY + 0.35, w: 3.7, h: 0.55,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textBody, margin: 0
    });
  }

  // ============================================================
  // SLIDE 8: STEP-BY-STEP
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addSectionTitle(s, "テクニック3 — ステップバイステップ指示", "Technique 03");
    addFooter(s, 8, T);

    // Difference note
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 1.15, w: L.W - L.mx * 2, h: 0.5,
      fill: { color: C.accentLight }
    });
    s.addText("CoT = 考え方を指定  /  ステップバイステップ = 作業手順を分解", {
      x: L.mx + 0.2, y: 1.15, w: L.W - L.mx * 2 - 0.4, h: 0.5,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", margin: 0
    });

    // Steps
    const stepData = [
      { num: "Step 1", label: "抽出", desc: "データから主要な傾向を3つ抽出" },
      { num: "Step 2", label: "分析", desc: "各傾向の原因を分析" },
      { num: "Step 3", label: "提案", desc: "各課題に対する改善策を提案" },
      { num: "Step 4", label: "要約", desc: "エグゼクティブサマリーを200文字で作成" },
    ];

    stepData.forEach((st, i) => {
      const y = 1.9 + i * 0.6;
      // Step number badge
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: 0.85, h: 0.45,
        fill: { color: C.accent }, rectRadius: 0.05
      });
      s.addText(st.num, {
        x: L.mx, y, w: 0.85, h: 0.45,
        fontSize: F.size.tag, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle"
      });
      s.addText(`${st.label}: ${st.desc}`, {
        x: L.mx + 1.05, y, w: 7.2, h: 0.45,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textDark, valign: "middle", margin: 0
      });
      if (i < 3) {
        s.addShape(pres.shapes.LINE, {
          x: L.mx + 0.4, y: y + 0.45, w: 0, h: 0.15,
          line: { color: C.accent, width: 1.5 }
        });
      }
    });

    // Bottom tips
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.45, w: L.W - L.mx * 2, h: 0.45,
      fill: { color: C.navy }
    });
    s.addText("Point: 各ステップの出力を具体的に / ステップは5つ以内", {
      x: L.mx + 0.3, y: 4.45, w: L.W - L.mx * 2 - 0.6, h: 0.45,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.white, valign: "middle", margin: 0
    });
  }

  // ============================================================
  // SLIDE 9: OUTPUT FORMAT
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addSectionTitle(s, "テクニック4 — 出力形式指定", "Technique 04");
    addFooter(s, 9, T);

    // Format chips
    const formats = ["箇条書き", "番号リスト", "表（テーブル）", "JSON", "マークダウン", "CSV"];
    formats.forEach((f, i) => {
      const x = L.mx + i * 1.35;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: 1.15, w: 1.2, h: 0.35,
        fill: { color: C.accentLight }, rectRadius: 0.15
      });
      s.addText(f, {
        x, y: 1.15, w: 1.2, h: 0.35,
        fontSize: F.size.tag, fontFace: F.sans, bold: true,
        color: C.accent, align: "center", valign: "middle"
      });
    });

    // Two columns
    const colW = 3.9;
    const colY = 1.8;
    const colH = 2.5;

    // Same question, different format
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: colY, w: colW, h: colH,
      fill: { color: C.white }, line: { color: C.tab4, width: 1.5 }
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: colY, w: colW, h: 0.4,
      fill: { color: "D4EDFA" }
    });
    s.addText("同じ質問でも形式で変わる", {
      x: L.mx + 0.15, y: colY, w: colW - 0.3, h: 0.4,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", margin: 0
    });
    s.addText("「競合A社・B社・C社の特徴を教えて」\n\n+ 「箇条書きで」→ リスト\n+ 「表形式で」→ 比較表\n+ 「JSON形式で」→ データ", {
      x: L.mx + 0.2, y: colY + 0.5, w: colW - 0.4, h: 1.8,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textBody, valign: "top", margin: 0
    });

    // Template approach
    const rx = L.mx + colW + 0.7;
    s.addShape(pres.shapes.RECTANGLE, {
      x: rx, y: colY, w: colW, h: colH,
      fill: { color: C.white }, line: { color: C.tab5, width: 1.5 }
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: rx, y: colY, w: colW, h: 0.4,
      fill: { color: "FFF3D4" }
    });
    s.addText("上級: テンプレートを渡す", {
      x: rx + 0.15, y: colY, w: colW - 0.3, h: 0.4,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.amber, valign: "middle", margin: 0
    });
    s.addText("以下のテンプレートに従って:\n\n件名:（ここに件名）\n本文:（ここに本文）\n署名:（ここに署名）", {
      x: rx + 0.2, y: colY + 0.5, w: colW - 0.4, h: 1.8,
      fontSize: F.size.label, fontFace: F.sans, italic: true,
      color: C.textBody, valign: "top", margin: 0
    });
  }

  // ============================================================
  // SLIDE 10: CONSTRAINTS
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addSectionTitle(s, "テクニック5 — 制約条件設定", "Technique 05");
    addFooter(s, 10, T);

    // 3 constraint types
    const types = [
      { label: "禁止事項", desc: "専門用語を使わない\n個人名を含めない\n推測で回答しない", color: C.red, bg: C.redBg },
      { label: "必須条件", desc: "必ずデータを引用\n必ず3つ以上の選択肢", color: C.accent, bg: C.accentLight },
      { label: "品質基準", desc: "新入社員にもわかるレベル\n経営会議で使える品質", color: C.amber, bg: C.amberBg },
    ];

    const cardW = 2.6;
    const cardGap = 0.2;
    const totalW = cardW * 3 + cardGap * 2;
    const startX = (L.W - totalW) / 2;

    types.forEach((t, i) => {
      const x = startX + i * (cardW + cardGap);
      const y = 1.15;

      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 1.6,
        fill: { color: C.white }, line: { color: C.border, width: 0.75 }
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 0.06, fill: { color: t.color }
      });
      s.addText(t.label, {
        x, y: y + 0.15, w: cardW, h: 0.35,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: t.color, align: "center", margin: 0
      });
      s.addText(t.desc, {
        x: x + 0.15, y: y + 0.55, w: cardW - 0.3, h: 0.9,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textBody, align: "center", valign: "top", margin: 0
      });
    });

    // Before/After
    const colW = 3.9;
    const baY = 3.05;
    const baH = 1.6;

    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: baY, w: colW, h: baH,
      fill: { color: C.white }, line: { color: C.red, width: 1 }
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: baY, w: colW, h: 0.35,
      fill: { color: C.redBg }
    });
    s.addText("制約なし", {
      x: L.mx + 0.15, y: baY, w: 2, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.red, valign: "middle", margin: 0
    });
    s.addText("「リモートワークのFAQを作って」\n→ 一般的で冗長...", {
      x: L.mx + 0.15, y: baY + 0.45, w: colW - 0.3, h: 0.8,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textBody, margin: 0
    });

    const rx = L.mx + colW + 0.7;
    s.addShape(pres.shapes.RECTANGLE, {
      x: rx, y: baY, w: colW, h: baH,
      fill: { color: C.white }, line: { color: C.green, width: 1 }
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: rx, y: baY, w: colW, h: 0.35,
      fill: { color: C.greenBg }
    });
    s.addText("制約あり", {
      x: rx + 0.15, y: baY, w: 2, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.green, valign: "middle", margin: 0
    });
    s.addText("各回答100文字以内 / 専門用語禁止\n具体的手順を含める / 社内規定番号記載\n→ 簡潔で実用的!", {
      x: rx + 0.15, y: baY + 0.45, w: colW - 0.3, h: 0.8,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textBody, margin: 0
    });
  }

  // ============================================================
  // SLIDE 11: USAGE GUIDE
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addSectionTitle(s, "テクニック使い分けガイド");
    addFooter(s, 11, T);

    // Table header
    const tY = 1.15;
    const tH = 0.4;
    const colWidths = [2.2, 3.2, 2.0];
    const colStarts = [L.mx, L.mx + 2.2, L.mx + 5.4];

    // Header row
    ["テクニック", "最適な場面", "効果"].forEach((h, i) => {
      s.addShape(pres.shapes.RECTANGLE, {
        x: colStarts[i], y: tY, w: colWidths[i], h: tH,
        fill: { color: C.accent }
      });
      s.addText(h, {
        x: colStarts[i], y: tY, w: colWidths[i], h: tH,
        fontSize: F.size.label, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle"
      });
    });

    const rows = [
      ["Few-shot", "分類・変換・フォーマット統一", "精度向上"],
      ["Chain-of-Thought", "分析・判断・推論", "論理性向上"],
      ["ステップバイステップ", "複雑な作業の分解", "網羅性向上"],
      ["出力形式指定", "レポート・データ整理", "実用性向上"],
      ["制約条件設定", "品質管理・トーン統一", "安定性向上"],
    ];

    rows.forEach((row, ri) => {
      const rowY = tY + tH + ri * 0.45;
      const bg = ri % 2 === 0 ? C.lightGray : C.white;
      row.forEach((cell, ci) => {
        s.addShape(pres.shapes.RECTANGLE, {
          x: colStarts[ci], y: rowY, w: colWidths[ci], h: 0.45,
          fill: { color: bg }, line: { color: C.border, width: 0.5 }
        });
        s.addText(cell, {
          x: colStarts[ci], y: rowY, w: colWidths[ci], h: 0.45,
          fontSize: F.size.label, fontFace: F.sans,
          color: ci === 0 ? C.accent : C.textDark,
          bold: ci === 0,
          align: "center", valign: "middle"
        });
      });
    });

    // Combination hint
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.15, w: L.W - L.mx * 2, h: 0.55,
      fill: { color: C.accentLight }
    });
    s.addImage({ data: ic.star, x: L.mx + 0.15, y: 4.23, w: 0.3, h: 0.3 });
    s.addText("組み合わせのヒント: Few-shot + 出力形式指定 + 制約条件 → 単独より高い精度", {
      x: L.mx + 0.6, y: 4.15, w: L.W - L.mx * 2 - 0.8, h: 0.55,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", margin: 0
    });
  }

  // ============================================================
  // SLIDE 12: SUMMARY & TEST
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };

    s.addText("まとめ", {
      x: 0.5, y: 0.4, w: 9, h: 0.6,
      fontSize: F.size.h1, fontFace: F.sans, bold: true,
      color: C.white, align: "center", margin: 0
    });

    const summary = [
      { num: "01", label: "Few-shot", desc: "例を見せて精度UP", color: C.tab1 },
      { num: "02", label: "CoT", desc: "段階的に考えさせる", color: C.tab2 },
      { num: "03", label: "Step指示", desc: "作業を分解する", color: C.tab3 },
      { num: "04", label: "形式指定", desc: "使える形で出力", color: C.tab4 },
      { num: "05", label: "制約設定", desc: "ルールで品質を守る", color: C.tab5 },
    ];

    const cardW = 1.55;
    const cardGap = 0.15;
    const totalW = cardW * 5 + cardGap * 4;
    const startX = (L.W - totalW) / 2;

    summary.forEach((item, i) => {
      const x = startX + i * (cardW + cardGap);
      const y = 1.2;

      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 2.2,
        fill: { color: "2A3A5A" },
        line: { color: item.color, width: 1.5 }
      });
      s.addText(item.num, {
        x, y: y + 0.2, w: cardW, h: 0.5,
        fontSize: F.size.h1, fontFace: F.sans, bold: true,
        color: item.color, align: "center", margin: 0
      });
      s.addText(item.label, {
        x, y: y + 0.75, w: cardW, h: 0.4,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.white, align: "center", margin: 0
      });
      s.addText(item.desc, {
        x: x + 0.1, y: y + 1.3, w: cardW - 0.2, h: 0.6,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.accentMid, align: "center", valign: "top", margin: 0
      });
    });

    // CTA
    s.addShape(pres.shapes.RECTANGLE, {
      x: 2.0, y: 3.7, w: 6, h: 1.0,
      fill: { color: C.accent }, rectRadius: 0.1
    });
    s.addText("お疲れさまでした！", {
      x: 2.0, y: 3.75, w: 6, h: 0.5,
      fontSize: F.size.h2, fontFace: F.sans, bold: true,
      color: C.white, align: "center", margin: 0
    });
    s.addText("確認テスト（5問）に挑戦 — 80%以上で修了", {
      x: 2.0, y: 4.2, w: 6, h: 0.4,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.accentMid, align: "center", margin: 0
    });

    s.addText("A-106   |   プロンプト実践テクニック   |   20分", {
      x: 0.5, y: 5.0, w: 9, h: 0.3,
      fontSize: F.size.caption, fontFace: F.sans,
      color: C.textMuted, align: "center", margin: 0
    });
  }

  // Save
  const outPath = __dirname + "/スライド.pptx";
  await pres.writeFile({ fileName: outPath });
  console.log("✅ Generated:", outPath);
}

main().catch(err => {
  console.error("❌ Error:", err);
  process.exit(1);
});
