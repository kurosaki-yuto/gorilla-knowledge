const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const {
  FaPencilAlt, FaUserTie, FaListOl, FaChevronRight, FaLightbulb,
  FaCheckCircle, FaTimesCircle, FaBrain, FaArrowRight, FaComments,
  FaExclamationTriangle, FaSearch, FaFileAlt, FaChartBar, FaEnvelope,
  FaCogs, FaStar, FaLink
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

// Layout primitives
function addTopBar(slide, pres) {
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
  slide.addText("AI-103", {
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

let pres;

async function main() {
  pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "Gorilla Knowledge";
  pres.title = "AI-103: プロンプトエンジニアリング基礎 — AIから良い回答を引き出す技術";

  // Pre-render icons
  const ic = {
    pencil: await icon(FaPencilAlt, C.accent),
    user: await icon(FaUserTie, C.accent),
    list: await icon(FaListOl, C.accent),
    chevron: await icon(FaChevronRight, C.textMuted),
    bulb: await icon(FaLightbulb, C.amber),
    check: await icon(FaCheckCircle, C.green),
    checkBlue: await icon(FaCheckCircle, C.accent),
    cross: await icon(FaTimesCircle, C.red),
    brain: await icon(FaBrain, C.accent),
    arrow: await icon(FaArrowRight, C.accent),
    chat: await icon(FaComments, C.accent),
    warn: await icon(FaExclamationTriangle, C.amber),
    search: await icon(FaSearch, C.accent),
    file: await icon(FaFileAlt, C.accent),
    chart: await icon(FaChartBar, C.accent),
    envelope: await icon(FaEnvelope, C.accent),
    cogs: await icon(FaCogs, C.accent),
    star: await icon(FaStar, C.amber),
    link: await icon(FaLink, C.accent),
  };

  const T = 12;

  // ============================================================
  // SLIDE 1: TITLE (Navy background)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };

    s.addImage({ data: ic.pencil, x: (L.W - 0.7) / 2, y: 1.0, w: 0.7, h: 0.7 });

    s.addText("プロンプトエンジニアリング基礎", {
      x: 0.5, y: 1.9, w: 9, h: 0.9,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center", margin: 0
    });

    s.addShape(pres.shapes.LINE, {
      x: 3.0, y: 2.95, w: 4, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });

    s.addText("AIから良い回答を引き出す技術", {
      x: 0.5, y: 3.15, w: 9, h: 0.5,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", margin: 0
    });

    s.addText("AI-103   |   全社員向け   |   10分", {
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
    addSectionTitle(s, "今日のゴール");
    addFooter(s, 2, T);

    const goals = [
      "プロンプトとは何か、なぜ重要かを説明できる",
      "良いプロンプトの5つの要素（役割・文脈・指示・形式・制約）を使いこなせる",
      "実務で使えるプロンプトテクニック（Few-shot、CoT等）を実践できる",
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
  // SLIDE 3: WHAT IS A PROMPT?
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "プロンプトとは何か？");
    addFooter(s, 3, T);

    // Key definition box
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 1.15, w: L.W - L.mx * 2, h: 0.85,
      fill: { color: C.accentLight }
    });
    s.addText("AIに出す「指示文」— 指示の出し方でAIの答えが劇的に変わる", {
      x: L.mx + 0.3, y: 1.15, w: L.W - L.mx * 2 - 0.6, h: 0.85,
      fontSize: F.size.h2, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", margin: 0
    });

    // Restaurant analogy - two columns
    const colW = 3.8;
    const colY = 2.35;
    const colH = 2.0;

    // Bad order
    const lx = L.mx;
    s.addShape(pres.shapes.RECTANGLE, {
      x: lx, y: colY, w: colW, h: colH,
      fill: { color: C.redBg }, line: { color: C.border, width: 0.5 }
    });
    s.addImage({ data: ic.cross, x: lx + 0.2, y: colY + 0.15, w: 0.3, h: 0.3 });
    s.addText("曖昧な注文", {
      x: lx + 0.6, y: colY + 0.1, w: 2.5, h: 0.4,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.red, valign: "middle", margin: 0
    });
    s.addText("「何かおいしいもの」", {
      x: lx + 0.3, y: colY + 0.65, w: colW - 0.6, h: 0.4,
      fontSize: F.size.body, fontFace: F.sans, italic: true,
      color: C.textBody, valign: "middle", margin: 0
    });
    s.addText("→ 何が出てくるかわからない", {
      x: lx + 0.3, y: colY + 1.15, w: colW - 0.6, h: 0.4,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textLight, valign: "middle", margin: 0
    });

    // Arrow
    s.addImage({ data: ic.arrow, x: L.mx + colW + 0.15, y: colY + colH / 2 - 0.2, w: 0.4, h: 0.4 });

    // Good order
    const rx = L.mx + colW + 0.7;
    s.addShape(pres.shapes.RECTANGLE, {
      x: rx, y: colY, w: colW, h: colH,
      fill: { color: C.greenBg }, line: { color: C.border, width: 0.5 }
    });
    s.addImage({ data: ic.check, x: rx + 0.2, y: colY + 0.15, w: 0.3, h: 0.3 });
    s.addText("具体的な注文", {
      x: rx + 0.6, y: colY + 0.1, w: 2.5, h: 0.4,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.green, valign: "middle", margin: 0
    });
    s.addText("「魚料理で、辛くなくて、\nご飯に合うもの」", {
      x: rx + 0.3, y: colY + 0.6, w: colW - 0.6, h: 0.55,
      fontSize: F.size.body, fontFace: F.sans, italic: true,
      color: C.textBody, valign: "middle", margin: 0
    });
    s.addText("→ 期待通りの料理が出てくる", {
      x: rx + 0.3, y: colY + 1.15, w: colW - 0.6, h: 0.4,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textLight, valign: "middle", margin: 0
    });

    // Bottom insight
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.55, w: L.W - L.mx * 2, h: 0.5,
      fill: { color: C.navy }
    });
    s.addText("プロンプトエンジニアリング = AIから最大限の価値を引き出す「指示の技術」", {
      x: L.mx + 0.3, y: 4.55, w: L.W - L.mx * 2 - 0.6, h: 0.5,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.white, align: "center", valign: "middle"
    });
  }

  // ============================================================
  // SLIDE 4: 5 ELEMENTS OF A GOOD PROMPT
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "良いプロンプトの5つの要素");
    addFooter(s, 4, T);

    const elements = [
      { num: "1", label: "役割", en: "Role", desc: "AIに演じてほしい立場", color: C.accent, bg: C.accentLight, ic: ic.user },
      { num: "2", label: "文脈", en: "Context", desc: "背景情報・状況説明", color: C.green, bg: C.greenBg, ic: ic.search },
      { num: "3", label: "指示", en: "Instruction", desc: "やってほしいこと", color: C.amber, bg: C.amberBg, ic: ic.list },
      { num: "4", label: "形式", en: "Format", desc: "出力の形・構造", color: C.accent, bg: C.accentLight, ic: ic.file },
      { num: "5", label: "制約", en: "Constraint", desc: "守ってほしい条件", color: C.red, bg: C.redBg, ic: ic.cogs },
    ];

    const cardW = 1.55;
    const cardGap = 0.15;
    const totalW = cardW * 5 + cardGap * 4;
    const startX = (L.W - totalW) / 2;

    elements.forEach((e, i) => {
      const x = startX + i * (cardW + cardGap);
      const y = 1.15;
      const h = 3.6;

      // Card
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h,
        fill: { color: C.white },
        line: { color: C.border, width: 0.75 }
      });

      // Top color band
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 0.06, fill: { color: e.color }
      });

      // Number
      s.addText(e.num, {
        x: x + (cardW - 0.4) / 2, y: y + 0.25, w: 0.4, h: 0.4,
        fontSize: F.size.h2, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: e.color }, shape: pres.shapes.OVAL
      });

      // Icon
      s.addImage({ data: e.ic, x: x + (cardW - 0.35) / 2, y: y + 0.85, w: 0.35, h: 0.35 });

      // Label (JP)
      s.addText(e.label, {
        x, y: y + 1.4, w: cardW, h: 0.4,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, align: "center", margin: 0
      });

      // Label (EN)
      s.addText(e.en, {
        x, y: y + 1.8, w: cardW, h: 0.3,
        fontSize: F.size.caption, fontFace: F.sans,
        color: C.textMuted, align: "center", margin: 0
      });

      // Divider
      s.addShape(pres.shapes.LINE, {
        x: x + 0.2, y: y + 2.25, w: cardW - 0.4, h: 0,
        line: { color: C.border, width: 0.5 }
      });

      // Description
      s.addText(e.desc, {
        x: x + 0.1, y: y + 2.4, w: cardW - 0.2, h: 0.8,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textLight, align: "center", valign: "top", margin: 0
      });
    });
  }

  // ============================================================
  // SLIDE 5: BEFORE / AFTER COMPARISON
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "実践比較: 悪いプロンプト vs 良いプロンプト");
    addFooter(s, 5, T);

    // BAD example
    const badX = L.mx;
    const badY = 1.1;
    const colW = 4.0;
    const colH = 3.7;

    s.addShape(pres.shapes.RECTANGLE, {
      x: badX, y: badY, w: colW, h: colH,
      fill: { color: C.white }, line: { color: C.red, width: 1.5 }
    });
    // Header
    s.addShape(pres.shapes.RECTANGLE, {
      x: badX, y: badY, w: colW, h: 0.5,
      fill: { color: C.redBg }
    });
    s.addImage({ data: ic.cross, x: badX + 0.15, y: badY + 0.08, w: 0.3, h: 0.3 });
    s.addText("悪いプロンプト", {
      x: badX + 0.55, y: badY, w: 3, h: 0.5,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.red, valign: "middle", margin: 0
    });

    // Bad prompt text
    s.addText("「メールを書いて」", {
      x: badX + 0.3, y: badY + 0.75, w: colW - 0.6, h: 0.5,
      fontSize: F.size.body, fontFace: F.sans, italic: true,
      color: C.textBody, valign: "middle", margin: 0
    });

    // Problems
    const problems = ["誰に？", "何のメール？", "どんなトーン？", "何文字？"];
    problems.forEach((p, i) => {
      s.addText(`  ${p}`, {
        x: badX + 0.3, y: badY + 1.4 + i * 0.45, w: colW - 0.6, h: 0.4,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.red, valign: "middle", margin: 0
      });
    });

    s.addText("→ 的外れな汎用メールが出力", {
      x: badX + 0.3, y: badY + 3.2, w: colW - 0.6, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.red, valign: "middle", margin: 0
    });

    // GOOD example
    const goodX = L.mx + colW + 0.5;

    s.addShape(pres.shapes.RECTANGLE, {
      x: goodX, y: badY, w: colW, h: colH,
      fill: { color: C.white }, line: { color: C.green, width: 1.5 }
    });
    // Header
    s.addShape(pres.shapes.RECTANGLE, {
      x: goodX, y: badY, w: colW, h: 0.5,
      fill: { color: C.greenBg }
    });
    s.addImage({ data: ic.check, x: goodX + 0.15, y: badY + 0.08, w: 0.3, h: 0.3 });
    s.addText("良いプロンプト", {
      x: goodX + 0.55, y: badY, w: 3, h: 0.5,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.green, valign: "middle", margin: 0
    });

    // Good prompt elements
    const elems = [
      { tag: "役割", text: "営業部のリーダーとして" },
      { tag: "文脈", text: "顧客訪問のアポ取り" },
      { tag: "指示", text: "メールを書いて" },
      { tag: "形式", text: "200文字程度" },
      { tag: "制約", text: "丁寧・日時候補3つ" },
    ];

    elems.forEach((e, i) => {
      const ey = badY + 0.7 + i * 0.52;
      // Tag
      s.addShape(pres.shapes.RECTANGLE, {
        x: goodX + 0.2, y: ey, w: 0.65, h: 0.35,
        fill: { color: C.accentLight }, rectRadius: 0.05
      });
      s.addText(e.tag, {
        x: goodX + 0.2, y: ey, w: 0.65, h: 0.35,
        fontSize: F.size.tag, fontFace: F.sans, bold: true,
        color: C.accent, align: "center", valign: "middle"
      });
      s.addText(e.text, {
        x: goodX + 1.0, y: ey, w: 2.7, h: 0.35,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textBody, valign: "middle", margin: 0
      });
    });

    s.addText("→ そのまま使える高品質メール", {
      x: goodX + 0.3, y: badY + 3.2, w: colW - 0.6, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.green, valign: "middle", margin: 0
    });
  }

  // ============================================================
  // SLIDE 6: FEW-SHOT
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);

    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.35, w: 1.4, h: 0.28,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    s.addText("TECHNIQUE 1", {
      x: L.mx, y: 0.35, w: 1.4, h: 0.28,
      fontSize: F.size.tag, fontFace: F.sans, bold: true,
      color: C.accent, align: "center", valign: "middle"
    });
    s.addText("Few-shot — 例を示す", {
      x: L.mx, y: 0.7, w: 8, h: 0.5,
      fontSize: F.size.h1, fontFace: F.sans, bold: true,
      color: C.textDark, margin: 0
    });
    s.addText("期待する入出力の「お手本」を2〜3個先に見せるテクニック", {
      x: L.mx, y: 1.2, w: 8.5, h: 0.3,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textLight, margin: 0
    });
    addFooter(s, 6, T);

    // Example: Sentiment analysis
    s.addText("例: 商品レビューの感情分析", {
      x: L.mx, y: 1.7, w: 4, h: 0.35,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.accent, margin: 0
    });

    // Few-shot examples in styled boxes
    const examples = [
      { input: "この商品は最高です！", output: "ポジティブ", bg: C.greenBg, color: C.green },
      { input: "届くのが遅かった。", output: "ネガティブ", bg: C.redBg, color: C.red },
    ];

    examples.forEach((ex, i) => {
      const y = 2.2 + i * 0.7;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.55,
        fill: { color: C.offWhite }, line: { color: C.border, width: 0.5 }
      });
      s.addText("入力:", {
        x: L.mx + 0.2, y, w: 0.6, h: 0.55,
        fontSize: F.size.label, fontFace: F.sans, bold: true,
        color: C.textMuted, valign: "middle", margin: 0
      });
      s.addText(ex.input, {
        x: L.mx + 0.9, y, w: 4.5, h: 0.55,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, valign: "middle", margin: 0
      });
      s.addImage({ data: ic.arrow, x: 6.0, y: y + 0.12, w: 0.3, h: 0.3 });
      s.addShape(pres.shapes.RECTANGLE, {
        x: 6.5, y: y + 0.08, w: 1.6, h: 0.38,
        fill: { color: ex.bg }, rectRadius: 0.05
      });
      s.addText(ex.output, {
        x: 6.5, y: y + 0.08, w: 1.6, h: 0.38,
        fontSize: F.size.label, fontFace: F.sans, bold: true,
        color: ex.color, align: "center", valign: "middle"
      });
    });

    // Then the actual task
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.7, w: L.W - L.mx * 2, h: 0.55,
      fill: { color: C.accentLight }, line: { color: C.accent, width: 1 }
    });
    s.addText("入力:", {
      x: L.mx + 0.2, y: 3.7, w: 0.6, h: 0.55,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", margin: 0
    });
    s.addText("値段の割に普通でした。   →  分類してください！", {
      x: L.mx + 0.9, y: 3.7, w: 6.5, h: 0.55,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", margin: 0
    });

    // Tip
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.45, w: L.W - L.mx * 2, h: 0.5,
      fill: { color: C.amberBg }
    });
    s.addImage({ data: ic.bulb, x: L.mx + 0.2, y: 4.53, w: 0.3, h: 0.3 });
    s.addText("ポイント: 例は2〜3個で十分。代表的なパターンを見せるのがコツ。", {
      x: L.mx + 0.7, y: 4.45, w: 7.5, h: 0.5,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.amber, valign: "middle", margin: 0
    });
  }

  // ============================================================
  // SLIDE 7: CHAIN-OF-THOUGHT
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);

    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.35, w: 1.4, h: 0.28,
      fill: { color: C.greenBg }, rectRadius: 0.05
    });
    s.addText("TECHNIQUE 2", {
      x: L.mx, y: 0.35, w: 1.4, h: 0.28,
      fontSize: F.size.tag, fontFace: F.sans, bold: true,
      color: C.green, align: "center", valign: "middle"
    });
    s.addText("Chain-of-Thought — 段階的に考えさせる", {
      x: L.mx, y: 0.7, w: 8.5, h: 0.5,
      fontSize: F.size.h1, fontFace: F.sans, bold: true,
      color: C.textDark, margin: 0
    });
    s.addText("AIに思考過程をステップバイステップで説明させるテクニック", {
      x: L.mx, y: 1.2, w: 8.5, h: 0.3,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textLight, margin: 0
    });
    addFooter(s, 7, T);

    // Flow diagram
    const steps = [
      { label: "Step 1", text: "A社のコストを\n計算", color: C.accent },
      { label: "Step 2", text: "B社のコストを\n計算", color: C.accent },
      { label: "Step 3", text: "両者を比較し\n結論", color: C.green },
    ];

    const fW = 2.2;
    const fGap = 0.55;
    const fTotalW = fW * 3 + fGap * 2;
    const fStartX = (L.W - fTotalW) / 2;
    const fY = 1.75;

    steps.forEach((step, i) => {
      const x = fStartX + i * (fW + fGap);
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: fY, w: fW, h: 1.1,
        fill: { color: C.offWhite }, line: { color: step.color, width: 1 }
      });
      s.addText(step.label, {
        x, y: fY + 0.1, w: fW, h: 0.3,
        fontSize: F.size.label, fontFace: F.sans, bold: true,
        color: step.color, align: "center", margin: 0
      });
      s.addText(step.text, {
        x, y: fY + 0.4, w: fW, h: 0.6,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textDark, align: "center", valign: "middle", margin: 0
      });
      if (i < 2) {
        s.addImage({ data: ic.chevron, x: x + fW + 0.15, y: fY + 0.4, w: 0.2, h: 0.2 });
      }
    });

    // Comparison: without CoT vs with CoT
    const cmpY = 3.2;
    // Without
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: cmpY, w: 4.0, h: 0.85,
      fill: { color: C.redBg }
    });
    s.addImage({ data: ic.cross, x: L.mx + 0.15, y: cmpY + 0.25, w: 0.3, h: 0.3 });
    s.addText("一気に聞く", {
      x: L.mx + 0.55, y: cmpY + 0.05, w: 3.2, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.red, valign: "middle", margin: 0
    });
    s.addText("「A社とB社を比較して」", {
      x: L.mx + 0.55, y: cmpY + 0.4, w: 3.2, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans, italic: true,
      color: C.textBody, valign: "middle", margin: 0
    });

    // With
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx + 4.5, y: cmpY, w: 4.0, h: 0.85,
      fill: { color: C.greenBg }
    });
    s.addImage({ data: ic.check, x: L.mx + 4.65, y: cmpY + 0.25, w: 0.3, h: 0.3 });
    s.addText("段階を踏む（CoT）", {
      x: L.mx + 5.05, y: cmpY + 0.05, w: 3.2, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.green, valign: "middle", margin: 0
    });
    s.addText("「まずA社→次にB社→比較」", {
      x: L.mx + 5.05, y: cmpY + 0.4, w: 3.2, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans, italic: true,
      color: C.textBody, valign: "middle", margin: 0
    });

    // Tip
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.3, w: L.W - L.mx * 2, h: 0.5,
      fill: { color: C.amberBg }
    });
    s.addImage({ data: ic.bulb, x: L.mx + 0.2, y: 4.38, w: 0.3, h: 0.3 });
    s.addText("計算・比較分析・論理的判断が必要な場面で特に効果的", {
      x: L.mx + 0.7, y: 4.3, w: 7.5, h: 0.5,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.amber, valign: "middle", margin: 0
    });
  }

  // ============================================================
  // SLIDE 8: ROLE + FORMAT
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);

    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.35, w: 1.4, h: 0.28,
      fill: { color: C.amberBg }, rectRadius: 0.05
    });
    s.addText("TECHNIQUE 3", {
      x: L.mx, y: 0.35, w: 1.4, h: 0.28,
      fontSize: F.size.tag, fontFace: F.sans, bold: true,
      color: C.amber, align: "center", valign: "middle"
    });
    s.addText("ロール指定 & 出力形式指定", {
      x: L.mx, y: 0.7, w: 8, h: 0.5,
      fontSize: F.size.h1, fontFace: F.sans, bold: true,
      color: C.textDark, margin: 0
    });
    s.addText("「誰として」回答するか + 「どんな形で」出力するかを組み合わせる", {
      x: L.mx, y: 1.2, w: 8.5, h: 0.3,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textLight, margin: 0
    });
    addFooter(s, 8, T);

    // Role examples
    const roles = [
      { role: "データアナリスト", effect: "分析的な視点で回答", ic: ic.chart },
      { role: "小学校の先生", effect: "わかりやすい言葉で説明", ic: ic.brain },
      { role: "マーケター", effect: "顧客目線の提案", ic: ic.user },
    ];

    roles.forEach((r, i) => {
      const y = 1.75 + i * 0.7;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: 4.0, h: 0.55,
        fill: { color: C.offWhite }, line: { color: C.border, width: 0.5 }
      });
      s.addImage({ data: r.ic, x: L.mx + 0.15, y: y + 0.08, w: 0.35, h: 0.35 });
      s.addText(`「${r.role}」`, {
        x: L.mx + 0.6, y, w: 3.0, h: 0.55,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.textDark, valign: "middle", margin: 0
      });
      s.addImage({ data: ic.arrow, x: L.mx + 4.15, y: y + 0.12, w: 0.25, h: 0.25 });
      s.addText(r.effect, {
        x: L.mx + 4.6, y, w: 3.5, h: 0.55,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, valign: "middle", margin: 0
      });
    });

    // Format examples
    s.addText("出力形式の指定例:", {
      x: L.mx, y: 3.95, w: 3, h: 0.35,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.accent, margin: 0
    });

    const formats = ["表形式", "箇条書き", "JSON形式", "○文字以内"];
    const fStartX = L.mx;
    formats.forEach((fmt, i) => {
      const x = fStartX + i * 2.1;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: 4.35, w: 1.9, h: 0.4,
        fill: { color: C.accentLight }, rectRadius: 0.05
      });
      s.addText(fmt, {
        x, y: 4.35, w: 1.9, h: 0.4,
        fontSize: F.size.label, fontFace: F.sans, bold: true,
        color: C.accent, align: "center", valign: "middle"
      });
    });
  }

  // ============================================================
  // SLIDE 9: PRACTICAL EXAMPLES (3 patterns)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "実践例 — 3つの業務シーン");
    addFooter(s, 9, T);

    // Table header
    const tblX = L.mx;
    const tblY = 1.1;
    const colW = [1.6, 6.9];
    const rowH = 1.1;

    // Header
    s.addShape(pres.shapes.RECTANGLE, {
      x: tblX, y: tblY, w: colW[0] + colW[1], h: 0.45,
      fill: { color: C.accent }
    });
    s.addText("シーン", {
      x: tblX + 0.15, y: tblY, w: colW[0], h: 0.45,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.white, valign: "middle", margin: 0
    });
    s.addText("プロンプト例", {
      x: tblX + colW[0] + 0.15, y: tblY, w: colW[1], h: 0.45,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.white, valign: "middle", margin: 0
    });

    const rows = [
      {
        scene: "メール作成",
        prompt: "あなたは営業担当です。田中部長へのお礼メールを書いてください。\n内容: 打ち合わせのお礼 + 次回日程の提案。丁寧なビジネス文体、200文字程度。",
        ic: ic.envelope, color: C.accent
      },
      {
        scene: "要約",
        prompt: "以下の議事録を、決定事項・未決事項・次のアクションの3つに分けて、\n箇条書きで要約してください。各項目は1行30文字以内。",
        ic: ic.file, color: C.green
      },
      {
        scene: "データ分析",
        prompt: "あなたはデータアナリストです。以下の売上データから前月比の変動が\n大きい上位3カテゴリを特定し、考えられる原因を表形式で提示してください。",
        ic: ic.chart, color: C.amber
      },
    ];

    rows.forEach((r, ri) => {
      const ry = tblY + 0.45 + ri * rowH;
      const bg = ri % 2 === 0 ? C.offWhite : C.white;

      s.addShape(pres.shapes.RECTANGLE, {
        x: tblX, y: ry, w: colW[0] + colW[1], h: rowH,
        fill: { color: bg }
      });
      // Left accent
      s.addShape(pres.shapes.RECTANGLE, {
        x: tblX, y: ry, w: 0.04, h: rowH, fill: { color: r.color }
      });

      // Scene label
      s.addImage({ data: r.ic, x: tblX + 0.2, y: ry + (rowH - 0.3) / 2, w: 0.3, h: 0.3 });
      s.addText(r.scene, {
        x: tblX + 0.6, y: ry, w: colW[0] - 0.6, h: rowH,
        fontSize: F.size.label, fontFace: F.sans, bold: true,
        color: r.color, valign: "middle", margin: 0
      });

      // Prompt
      s.addText(r.prompt, {
        x: tblX + colW[0] + 0.15, y: ry + 0.1, w: colW[1] - 0.3, h: rowH - 0.2,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textBody, valign: "middle", margin: 0
      });
    });

    // Bottom tip
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.8, w: L.W - L.mx * 2, h: 0.4,
      fill: { color: C.accentLight }
    });
    s.addText("いずれも5つの要素（役割・文脈・指示・形式・制約）の複数が含まれている", {
      x: L.mx + 0.3, y: 4.8, w: L.W - L.mx * 2 - 0.6, h: 0.4,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.accent, align: "center", valign: "middle"
    });
  }

  // ============================================================
  // SLIDE 10: COMMON MISTAKES
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "よくある失敗パターンと改善法");
    addFooter(s, 10, T);

    const mistakes = [
      {
        num: "1", title: "曖昧すぎる",
        bad: "「いい感じにまとめて」",
        good: "「箇条書き5つで、各30文字以内に」",
        color: C.red, bg: C.redBg
      },
      {
        num: "2", title: "長すぎる（複数タスク混在）",
        bad: "1プロンプトにあれもこれも",
        good: "1プロンプト = 1タスクに分割",
        color: C.amber, bg: C.amberBg
      },
      {
        num: "3", title: "前提なし",
        bad: "「企画書を書いて」（背景ゼロ）",
        good: "対象者・目的・状況を必ず添える",
        color: C.red, bg: C.redBg
      },
    ];

    mistakes.forEach((m, i) => {
      const y = 1.1 + i * 1.2;

      // Card
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 1.0,
        fill: { color: C.white }, line: { color: C.border, width: 0.5 }
      });
      // Left accent
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: 0.05, h: 1.0, fill: { color: m.color }
      });

      // Number + Title
      s.addText(m.num, {
        x: L.mx + 0.2, y: y + 0.05, w: 0.4, h: 0.4,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: m.color }, shape: pres.shapes.OVAL
      });
      s.addText(m.title, {
        x: L.mx + 0.75, y: y + 0.05, w: 3, h: 0.4,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, valign: "middle", margin: 0
      });

      // Bad
      s.addImage({ data: ic.cross, x: L.mx + 0.3, y: y + 0.55, w: 0.22, h: 0.22 });
      s.addText(m.bad, {
        x: L.mx + 0.6, y: y + 0.5, w: 3.5, h: 0.35,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.red, valign: "middle", margin: 0
      });

      // Arrow + Good
      s.addImage({ data: ic.arrow, x: 4.8, y: y + 0.55, w: 0.22, h: 0.22 });
      s.addImage({ data: ic.check, x: 5.2, y: y + 0.55, w: 0.22, h: 0.22 });
      s.addText(m.good, {
        x: 5.5, y: y + 0.5, w: 3.5, h: 0.35,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.green, valign: "middle", margin: 0
      });
    });

    // Bottom
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.7, w: L.W - L.mx * 2, h: 0.45,
      fill: { color: C.navy }
    });
    s.addText("この3つを意識するだけで、AIの回答品質は大幅に向上します", {
      x: L.mx + 0.3, y: 4.7, w: L.W - L.mx * 2 - 0.6, h: 0.45,
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
    addSectionTitle(s, "まとめ");
    addFooter(s, 11, T);

    const items = [
      { label: "プロンプト", text: "AIへの「指示文」。質が回答を決める", color: C.accent },
      { label: "5つの要素", text: "役割・文脈・指示・形式・制約", color: C.green },
      { label: "テクニック", text: "Few-shot / Chain-of-Thought / ロール指定", color: C.amber },
      { label: "失敗回避", text: "具体的に・1タスクずつ・前提を伝える", color: C.red },
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
        x: L.mx + 0.35, y, w: 1.8, h: 0.75,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: item.color, valign: "middle", margin: 0
      });
      s.addText(item.text, {
        x: L.mx + 2.2, y, w: 6.0, h: 0.75,
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

    s.addText("次の動画: AI-104", {
      x: 2.5, y: 3.8, w: 5, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textMuted, align: "center", margin: 0
    });
  }

  // Write
  const out = "/Users/kurosakiyuto/Downloads/開発/gorilla-knowledge/黒崎/AI研修一覧/AI-103_プロンプトエンジニアリング基礎/スライド.pptx";
  await pres.writeFile({ fileName: out });
  console.log("Generated:", out);
}

main().catch(console.error);
