const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const {
  FaBrain, FaBullseye, FaRobot, FaCogs, FaDatabase, FaMagic,
  FaLightbulb, FaExclamationTriangle, FaCheckCircle, FaArrowRight,
  FaFileAlt, FaSearch, FaComments, FaLock, FaEye, FaBalanceScale,
  FaChevronRight, FaPencilAlt, FaShoppingCart, FaEnvelope
} = require("react-icons/fa");

// =====================================================
// CONSULTING-GRADE DESIGN SYSTEM
// McKinsey / BCG / NotebookLM style
// White-base, clean, information-focused
// =====================================================

const C = {
  // Backgrounds
  white: "FFFFFF",
  offWhite: "FAFBFC",
  lightGray: "F3F4F6",

  // Primary navy (titles, key text)
  navy: "1B2A4A",
  navyLight: "2D4A7A",

  // Accent (one color only - restrained)
  accent: "2563EB",       // strong blue
  accentLight: "DBEAFE",  // very light blue bg
  accentMid: "93C5FD",    // medium blue

  // Text hierarchy
  textDark: "111827",      // headlines
  textBody: "374151",      // body text
  textMuted: "9CA3AF",     // captions, labels
  textLight: "6B7280",     // secondary text

  // Semantic (used sparingly)
  green: "059669",
  greenBg: "D1FAE5",
  amber: "D97706",
  amberBg: "FEF3C7",
  red: "DC2626",
  redBg: "FEE2E2",

  // Dividers
  border: "E5E7EB",
};

const F = {
  sans: "Calibri",       // Clean, universal, consulting-standard
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
  mx: 0.75,      // horizontal margin
  my: 0.5,       // vertical margin
  gap: 0.3,      // standard gap
};

// Icon helper
async function icon(IconComponent, color, size = 256) {
  const svg = ReactDOMServer.renderToStaticMarkup(
    React.createElement(IconComponent, { color: `#${color}`, size: String(size) })
  );
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

// =====================================================
// LAYOUT PRIMITIVES
// =====================================================

// Thin top bar (brand identity, appears on every slide)
function addTopBar(slide, pres) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: L.W, h: 0.035, fill: { color: C.accent }
  });
}

// Footer with slide number
function addFooter(slide, num, total) {
  // Divider line
  slide.addShape(pres.shapes.LINE, {
    x: L.mx, y: L.H - 0.4, w: L.W - L.mx * 2, h: 0,
    line: { color: C.border, width: 0.5 }
  });
  slide.addText(`${num} / ${total}`, {
    x: L.W - 1.5, y: L.H - 0.38, w: 1.2, h: 0.3,
    fontSize: F.size.caption, fontFace: F.sans,
    color: C.textMuted, align: "right", margin: 0
  });
  slide.addText("AI-101", {
    x: L.mx, y: L.H - 0.38, w: 2, h: 0.3,
    fontSize: F.size.caption, fontFace: F.sans,
    color: C.textMuted, align: "left", margin: 0
  });
}

// Section title (left-aligned, with optional label tag)
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

let pres; // global ref for helper functions

async function main() {
  pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "Gorilla Knowledge";
  pres.title = "AI-101: AIの基本 — 仕組みと種類を理解する";

  // Pre-render icons
  const ic = {
    brain: await icon(FaBrain, C.accent),
    target: await icon(FaBullseye, C.accent),
    robot: await icon(FaRobot, C.navyLight),
    cogs: await icon(FaCogs, C.accent),
    db: await icon(FaDatabase, C.green),
    magic: await icon(FaMagic, C.amber),
    bulb: await icon(FaLightbulb, C.amber),
    warn: await icon(FaExclamationTriangle, C.amber),
    check: await icon(FaCheckCircle, C.green),
    checkBlue: await icon(FaCheckCircle, C.accent),
    arrow: await icon(FaArrowRight, C.accent),
    file: await icon(FaFileAlt, C.accent),
    search: await icon(FaSearch, C.accent),
    chat: await icon(FaComments, C.accent),
    lock: await icon(FaLock, C.red),
    eye: await icon(FaEye, C.amber),
    balance: await icon(FaBalanceScale, C.red),
    pencil: await icon(FaPencilAlt, C.accent),
    cart: await icon(FaShoppingCart, C.accent),
    envelope: await icon(FaEnvelope, C.accent),
    chevron: await icon(FaChevronRight, C.textMuted),
  };

  const T = 12; // total slides

  // ============================================================
  // SLIDE 1: TITLE
  // Navy background, big centered title, minimal
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };

    s.addImage({ data: ic.brain, x: (L.W - 0.7) / 2, y: 1.0, w: 0.7, h: 0.7 });

    s.addText("AIの基本", {
      x: 0.5, y: 1.9, w: 9, h: 0.9,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center", margin: 0
    });

    // Thin divider
    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 2.95, w: 3, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });

    s.addText("仕組みと種類を理解する", {
      x: 0.5, y: 3.15, w: 9, h: 0.5,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", margin: 0
    });

    s.addText("AI-101   |   全社員向け   |   10分", {
      x: 0.5, y: 4.2, w: 9, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textMuted, align: "center", margin: 0
    });
  }

  // ============================================================
  // SLIDE 2: GOALS
  // Clean numbered list with accent color numbers
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);

    addSectionTitle(s, "今日のゴール");
    addFooter(s, 2, T);

    const goals = [
      "AIとは何かを一言で説明できる",
      "AIの3つの種類（ルールベース・機械学習・生成AI）を区別できる",
      "自分の業務でAIが使えそうな場面をイメージできる",
    ];

    goals.forEach((g, i) => {
      const y = 1.25 + i * 1.15;
      // Number circle
      s.addText(String(i + 1), {
        x: L.mx, y: y + 0.05, w: 0.55, h: 0.55,
        fontSize: F.size.h2, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: C.accent }, shape: pres.shapes.OVAL
      });
      // Text
      s.addText(g, {
        x: L.mx + 0.8, y, w: 7.5, h: 0.65,
        fontSize: F.size.h3, fontFace: F.sans,
        color: C.textDark, valign: "middle", margin: 0
      });
      // Divider
      if (i < 2) {
        s.addShape(pres.shapes.LINE, {
          x: L.mx, y: y + 0.85, w: L.W - L.mx * 2, h: 0,
          line: { color: C.border, width: 0.5 }
        });
      }
    });
  }

  // ============================================================
  // SLIDE 3: WHAT IS AI?
  // Key message in accent box + comparison diagram
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "AIとは何か？");
    addFooter(s, 3, T);

    // Key definition box (accent background)
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 1.15, w: L.W - L.mx * 2, h: 0.85,
      fill: { color: C.accentLight }
    });
    s.addText("人間がやっていた「判断」を、コンピュータにやらせる技術", {
      x: L.mx + 0.3, y: 1.15, w: L.W - L.mx * 2 - 0.6, h: 0.85,
      fontSize: F.size.h2, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", margin: 0
    });

    // Two column comparison
    const colW = 3.5;
    const colY = 2.35;
    const colH = 2.5;

    // Human column
    const lx = L.mx;
    s.addShape(pres.shapes.RECTANGLE, {
      x: lx, y: colY, w: colW, h: colH,
      fill: { color: C.offWhite }, line: { color: C.border, width: 0.5 }
    });
    s.addText("人間の判断", {
      x: lx, y: colY + 0.15, w: colW, h: 0.4,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.textDark, align: "center", margin: 0
    });
    const humanSteps = ["データを見る", "経験から考える", "判断する"];
    humanSteps.forEach((step, i) => {
      const sy = colY + 0.7 + i * 0.55;
      s.addText(`${i + 1}.  ${step}`, {
        x: lx + 0.4, y: sy, w: colW - 0.8, h: 0.4,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, valign: "middle", margin: 0
      });
    });

    // Arrow
    s.addImage({ data: ic.arrow, x: L.mx + colW + 0.35, y: 3.3, w: 0.5, h: 0.5 });

    // AI column
    const rx = L.mx + colW + 1.2;
    s.addShape(pres.shapes.RECTANGLE, {
      x: rx, y: colY, w: colW, h: colH,
      fill: { color: C.offWhite }, line: { color: C.border, width: 0.5 }
    });
    s.addText("AIの判断", {
      x: rx, y: colY + 0.15, w: colW, h: 0.4,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.accent, align: "center", margin: 0
    });
    const aiSteps = ["データを入れる", "パターンを計算", "答えを出す"];
    aiSteps.forEach((step, i) => {
      const sy = colY + 0.7 + i * 0.55;
      s.addText(`${i + 1}.  ${step}`, {
        x: rx + 0.4, y: sy, w: colW - 0.8, h: 0.4,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, valign: "middle", margin: 0
      });
    });

    // Bottom insight
    s.addText("AIは「考えている」わけではない。大量のデータからパターンを見つけて答えを出しているだけ。", {
      x: L.mx, y: 4.9, w: L.W - L.mx * 2, h: 0.3,
      fontSize: F.size.label, fontFace: F.sans, italic: true,
      color: C.textLight, margin: 0
    });
  }

  // ============================================================
  // SLIDE 4: 3 TYPES OVERVIEW
  // Three columns, clean cards
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "AIの3つの種類");
    addFooter(s, 4, T);

    const types = [
      { ic: ic.cogs, label: "ルールベースAI", sub: "人間がルールを書く", color: C.accent, bgColor: C.accentLight },
      { ic: ic.db, label: "機械学習AI", sub: "データからパターンを学ぶ", color: C.green, bgColor: C.greenBg },
      { ic: ic.magic, label: "生成AI", sub: "新しいコンテンツを作る", color: C.amber, bgColor: C.amberBg },
    ];

    const cardW = 2.55;
    const cardGap = 0.3;
    const totalW = cardW * 3 + cardGap * 2;
    const startX = (L.W - totalW) / 2;

    types.forEach((t, i) => {
      const x = startX + i * (cardW + cardGap);
      const y = 1.15;
      const h = 3.3;

      // Card
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h,
        fill: { color: C.white },
        line: { color: C.border, width: 0.75 }
      });

      // Top color band
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 0.06, fill: { color: t.color }
      });

      // Icon circle
      s.addShape(pres.shapes.OVAL, {
        x: x + (cardW - 0.7) / 2, y: y + 0.4, w: 0.7, h: 0.7,
        fill: { color: t.bgColor }
      });
      s.addImage({ data: t.ic, x: x + (cardW - 0.4) / 2, y: y + 0.55, w: 0.4, h: 0.4 });

      // Label
      s.addText(t.label, {
        x, y: y + 1.35, w: cardW, h: 0.5,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, align: "center", margin: 0
      });

      // Divider
      s.addShape(pres.shapes.LINE, {
        x: x + 0.4, y: y + 2.0, w: cardW - 0.8, h: 0,
        line: { color: C.border, width: 0.5 }
      });

      // Description
      s.addText(t.sub, {
        x, y: y + 2.15, w: cardW, h: 0.5,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textLight, align: "center", margin: 0
      });

      // Arrows between cards
      if (i < 2) {
        s.addImage({ data: ic.chevron, x: x + cardW + 0.06, y: y + h / 2 - 0.15, w: 0.2, h: 0.2 });
      }
    });

    // Bottom label
    s.addText("シンプル                                                                             高度", {
      x: startX, y: 4.6, w: totalW, h: 0.25,
      fontSize: F.size.caption, fontFace: F.sans,
      color: C.textMuted, margin: 0
    });
    s.addShape(pres.shapes.LINE, {
      x: startX, y: 4.55, w: totalW, h: 0,
      line: { color: C.border, width: 0.5, dashType: "dash" }
    });
  }

  // ============================================================
  // SLIDE 5: RULE-BASED AI
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);

    // Tag + title
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.35, w: 0.7, h: 0.28,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    s.addText("01", {
      x: L.mx, y: 0.35, w: 0.7, h: 0.28,
      fontSize: F.size.tag, fontFace: F.sans, bold: true,
      color: C.accent, align: "center", valign: "middle"
    });
    s.addText("ルールベースAI", {
      x: L.mx, y: 0.7, w: 8, h: 0.5,
      fontSize: F.size.h1, fontFace: F.sans, bold: true,
      color: C.textDark, margin: 0
    });
    s.addText("「もし〇〇なら△△する」— 人間がルールを全部書く", {
      x: L.mx, y: 1.2, w: 8, h: 0.3,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textLight, margin: 0
    });
    addFooter(s, 5, T);

    // Examples table
    const examples = [
      { ctx: "チャットボット", input: "「営業時間は？」", output: "「9時〜18時です」" },
      { ctx: "経費精算", input: "金額が10万円以上", output: "部長承認が必要" },
      { ctx: "メールフィルタ", input: "件名に「当選」を含む", output: "迷惑メールへ" },
    ];

    // Header row
    const tblX = L.mx;
    const tblY = 1.75;
    const cols = [2.0, 3.0, 3.5];
    const rowH = 0.6;
    const headers = ["場面", "入力", "出力"];

    // Header bg
    s.addShape(pres.shapes.RECTANGLE, {
      x: tblX, y: tblY, w: cols[0] + cols[1] + cols[2], h: rowH,
      fill: { color: C.offWhite }
    });
    let cx = tblX;
    headers.forEach((h, i) => {
      s.addText(h, {
        x: cx + 0.2, y: tblY, w: cols[i] - 0.2, h: rowH,
        fontSize: F.size.label, fontFace: F.sans, bold: true,
        color: C.textMuted, valign: "middle", margin: 0
      });
      cx += cols[i];
    });

    // Data rows
    examples.forEach((e, ri) => {
      const ry = tblY + (ri + 1) * rowH;
      // Row divider
      s.addShape(pres.shapes.LINE, {
        x: tblX, y: ry, w: cols[0] + cols[1] + cols[2], h: 0,
        line: { color: C.border, width: 0.5 }
      });
      const vals = [e.ctx, e.input, e.output];
      cx = tblX;
      vals.forEach((v, ci) => {
        s.addText(v, {
          x: cx + 0.2, y: ry, w: cols[ci] - 0.2, h: rowH,
          fontSize: F.size.body, fontFace: F.sans,
          bold: ci === 0,
          color: ci === 0 ? C.textDark : C.textBody,
          valign: "middle", margin: 0
        });
        cx += cols[ci];
      });
    });

    // Pros / Cons
    const bottomY = 4.05;
    // Pro
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: bottomY, w: 4.0, h: 0.55, fill: { color: C.greenBg }
    });
    s.addImage({ data: ic.check, x: L.mx + 0.15, y: bottomY + 0.1, w: 0.3, h: 0.3 });
    s.addText("動きが予測でき、説明しやすい", {
      x: L.mx + 0.6, y: bottomY, w: 3.2, h: 0.55,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.green, valign: "middle", margin: 0
    });
    // Con
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx + 4.5, y: bottomY, w: 4.0, h: 0.55, fill: { color: C.amberBg }
    });
    s.addImage({ data: ic.warn, x: L.mx + 4.65, y: bottomY + 0.1, w: 0.3, h: 0.3 });
    s.addText("想定外のことには対応できない", {
      x: L.mx + 5.1, y: bottomY, w: 3.2, h: 0.55,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.amber, valign: "middle", margin: 0
    });
  }

  // ============================================================
  // SLIDE 6: MACHINE LEARNING
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);

    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.35, w: 0.7, h: 0.28, fill: { color: C.greenBg }, rectRadius: 0.05
    });
    s.addText("02", {
      x: L.mx, y: 0.35, w: 0.7, h: 0.28,
      fontSize: F.size.tag, fontFace: F.sans, bold: true,
      color: C.green, align: "center", valign: "middle"
    });
    s.addText("機械学習AI", {
      x: L.mx, y: 0.7, w: 8, h: 0.5,
      fontSize: F.size.h1, fontFace: F.sans, bold: true,
      color: C.textDark, margin: 0
    });
    s.addText("人間がルールを書くのではなく、AIがデータからパターンを自分で見つける", {
      x: L.mx, y: 1.2, w: 8.5, h: 0.3,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textLight, margin: 0
    });
    addFooter(s, 6, T);

    // Flow: Data → Learn → Pattern → Predict
    const flowItems = ["大量のデータ", "学習", "パターン発見", "予測・分類"];
    const fW = 1.7;
    const fGap = 0.55;
    const fTotalW = fW * 4 + fGap * 3;
    const fStartX = (L.W - fTotalW) / 2;
    const fY = 1.75;

    flowItems.forEach((item, i) => {
      const x = fStartX + i * (fW + fGap);
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: fY, w: fW, h: 0.55,
        fill: { color: i === 3 ? C.green : C.accent },
        rectRadius: 0.05
      });
      s.addText(item, {
        x, y: fY, w: fW, h: 0.55,
        fontSize: F.size.label, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle"
      });
      if (i < 3) {
        s.addImage({ data: ic.chevron, x: x + fW + 0.15, y: fY + 0.15, w: 0.2, h: 0.2 });
      }
    });

    // Examples
    const mlExamples = [
      { label: "売上予測", desc: "過去の販売データから来月の売上を予測" },
      { label: "異常検知", desc: "工場のセンサーデータから故障の予兆を検知" },
      { label: "レコメンド", desc: "購買履歴をもとに「この商品もおすすめ」を表示" },
    ];

    mlExamples.forEach((e, i) => {
      const y = 2.7 + i * 0.65;
      if (i > 0) {
        s.addShape(pres.shapes.LINE, {
          x: L.mx, y, w: L.W - L.mx * 2, h: 0,
          line: { color: C.border, width: 0.5 }
        });
      }
      s.addText(e.label, {
        x: L.mx + 0.2, y, w: 1.5, h: 0.55,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.green, valign: "middle", margin: 0
      });
      s.addText(e.desc, {
        x: L.mx + 2.0, y, w: 6.5, h: 0.55,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, valign: "middle", margin: 0
      });
    });

    // Pros / Cons
    const bottomY = 4.55;
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: bottomY, w: 4.0, h: 0.5, fill: { color: C.greenBg }
    });
    s.addImage({ data: ic.check, x: L.mx + 0.15, y: bottomY + 0.08, w: 0.3, h: 0.3 });
    s.addText("人間が見逃すパターンも発見", {
      x: L.mx + 0.6, y: bottomY, w: 3.2, h: 0.5,
      fontSize: F.size.label, fontFace: F.sans, color: C.green, valign: "middle", margin: 0
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx + 4.5, y: bottomY, w: 4.0, h: 0.5, fill: { color: C.amberBg }
    });
    s.addImage({ data: ic.warn, x: L.mx + 4.65, y: bottomY + 0.08, w: 0.3, h: 0.3 });
    s.addText("なぜその答えか説明しにくい", {
      x: L.mx + 5.1, y: bottomY, w: 3.2, h: 0.5,
      fontSize: F.size.label, fontFace: F.sans, color: C.amber, valign: "middle", margin: 0
    });
  }

  // ============================================================
  // SLIDE 7: GENERATIVE AI
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);

    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.35, w: 0.7, h: 0.28, fill: { color: C.amberBg }, rectRadius: 0.05
    });
    s.addText("03", {
      x: L.mx, y: 0.35, w: 0.7, h: 0.28,
      fontSize: F.size.tag, fontFace: F.sans, bold: true,
      color: C.amber, align: "center", valign: "middle"
    });
    s.addText("生成AI", {
      x: L.mx, y: 0.7, w: 5, h: 0.5,
      fontSize: F.size.h1, fontFace: F.sans, bold: true,
      color: C.textDark, margin: 0
    });

    // "Most attention" badge
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.W - L.mx - 2.0, y: 0.75, w: 2.0, h: 0.35,
      fill: { color: C.amberBg }, rectRadius: 0.05
    });
    s.addText("いま最も注目", {
      x: L.W - L.mx - 2.0, y: 0.75, w: 2.0, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.amber, align: "center", valign: "middle"
    });

    s.addText("学習したデータをもとに、文章・画像・コードなど新しいコンテンツを「生成」する", {
      x: L.mx, y: 1.2, w: 8.5, h: 0.3,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textLight, margin: 0
    });
    addFooter(s, 7, T);

    // 3 examples with tools
    const genEx = [
      { label: "文章生成", tools: "ChatGPT / Claude", desc: "メール文、議事録要約、企画書のたたき台" },
      { label: "画像生成", tools: "Midjourney / DALL-E", desc: "デザイン案、イメージ画像" },
      { label: "コード生成", tools: "GitHub Copilot", desc: "プログラムの自動生成" },
    ];

    genEx.forEach((e, i) => {
      const y = 1.8 + i * 0.85;
      // Left border accent
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: 0.05, h: 0.7, fill: { color: C.amber }
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.7, fill: { color: C.offWhite }
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: 0.05, h: 0.7, fill: { color: C.amber }
      });

      s.addText(e.label, {
        x: L.mx + 0.3, y, w: 1.5, h: 0.4,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.textDark, valign: "bottom", margin: 0
      });
      s.addText(e.tools, {
        x: L.mx + 0.3, y: y + 0.38, w: 1.5, h: 0.3,
        fontSize: F.size.caption, fontFace: F.sans,
        color: C.textMuted, valign: "top", margin: 0
      });
      s.addText(e.desc, {
        x: L.mx + 2.2, y, w: 6.0, h: 0.7,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, valign: "middle", margin: 0
      });
    });

    // Insight box
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.55, w: L.W - L.mx * 2, h: 0.5,
      fill: { color: C.accentLight }
    });
    s.addImage({ data: ic.bulb, x: L.mx + 0.2, y: 4.63, w: 0.3, h: 0.3 });
    s.addText("2022年末〜爆発的に普及。業務への影響が最も大きい領域。", {
      x: L.mx + 0.7, y: 4.55, w: 7.5, h: 0.5,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", margin: 0
    });
  }

  // ============================================================
  // SLIDE 8: COMPARISON TABLE
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "3つの種類 — 比較");
    addFooter(s, 8, T);

    const colW = [1.8, 2.4, 2.4, 2.4];
    const tblW = colW.reduce((a, b) => a + b, 0);
    const tblX = (L.W - tblW) / 2;
    const tblY = 1.2;
    const rowH = 0.7;

    const headers = ["", "ルールベース", "機械学習", "生成AI"];
    const hdrColors = [C.offWhite, C.accent, C.green, C.amber];
    const rows = [
      ["やり方", "人間がルールを書く", "データから学ぶ", "データから学んで作る"],
      ["得意なこと", "決まった応答", "予測・分類", "新しいコンテンツ生成"],
      ["身近な例", "社内チャットボット", "Amazonレコメンド", "ChatGPT / Claude"],
    ];

    // Header
    let cx = tblX;
    headers.forEach((h, i) => {
      s.addShape(pres.shapes.RECTANGLE, {
        x: cx, y: tblY, w: colW[i], h: rowH,
        fill: { color: hdrColors[i] }
      });
      s.addText(h, {
        x: cx, y: tblY, w: colW[i], h: rowH,
        fontSize: F.size.label, fontFace: F.sans, bold: true,
        color: i === 0 ? C.textMuted : C.white,
        align: "center", valign: "middle"
      });
      cx += colW[i];
    });

    // Rows
    rows.forEach((row, ri) => {
      cx = tblX;
      const ry = tblY + (ri + 1) * rowH;
      row.forEach((cell, ci) => {
        const bg = ri % 2 === 0 ? C.offWhite : C.white;
        s.addShape(pres.shapes.RECTANGLE, {
          x: cx, y: ry, w: colW[ci], h: rowH,
          fill: { color: ci === 0 ? C.offWhite : bg }
        });
        s.addText(cell, {
          x: cx, y: ry, w: colW[ci], h: rowH,
          fontSize: ci === 0 ? F.size.label : F.size.body,
          fontFace: F.sans, bold: ci === 0,
          color: ci === 0 ? C.textMuted : C.textDark,
          align: "center", valign: "middle"
        });
        cx += colW[ci];
      });
    });
  }

  // ============================================================
  // SLIDE 9: BUSINESS USE CASES
  // 2x2 grid
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "あなたの業務ではどう使える？");
    addFooter(s, 9, T);

    const cases = [
      { icon: ic.envelope, label: "文書作成", desc: "メール下書き、報告書の要約、翻訳" },
      { icon: ic.search, label: "情報整理", desc: "議事録作成、データの分類・集計" },
      { icon: ic.chat, label: "アイデア出し", desc: "企画のブレスト、キャッチコピー案" },
      { icon: ic.cart, label: "調査・リサーチ", desc: "市場調査の要約、競合分析の補助" },
    ];

    const cardW = 4.0;
    const cardH = 1.2;
    const gapX = 0.5;
    const gapY = 0.4;

    cases.forEach((c, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = L.mx + col * (cardW + gapX);
      const y = 1.2 + row * (cardH + gapY);

      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: cardH,
        fill: { color: C.offWhite },
        line: { color: C.border, width: 0.5 }
      });

      s.addImage({ data: c.icon, x: x + 0.3, y: y + (cardH - 0.4) / 2, w: 0.4, h: 0.4 });

      s.addText(c.label, {
        x: x + 0.95, y: y + 0.15, w: 2.8, h: 0.4,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, valign: "middle", margin: 0
      });
      s.addText(c.desc, {
        x: x + 0.95, y: y + 0.6, w: 2.8, h: 0.4,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textLight, valign: "top", margin: 0
      });
    });

    // Key takeaway
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.0, w: L.W - L.mx * 2, h: 0.7,
      fill: { color: C.navy }
    });
    s.addText([
      { text: "「AIに全部任せる」のではなく ", options: { color: C.accentMid } },
      { text: "「AIに下書きさせて、人間が仕上げる」", options: { color: C.white, bold: true } },
      { text: " が基本", options: { color: C.accentMid } },
    ], {
      x: L.mx + 0.3, y: 4.0, w: L.W - L.mx * 2 - 0.6, h: 0.7,
      fontSize: F.size.body, fontFace: F.sans,
      align: "center", valign: "middle"
    });
  }

  // ============================================================
  // SLIDE 10: CAUTIONS
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "AIを使うときの3つの注意点");
    addFooter(s, 10, T);

    const cautions = [
      { icon: ic.lock, num: "1", title: "機密情報を入れない", desc: "社外AIに顧客情報や社内機密を入力しない。会社のAI利用ルールを確認。", color: C.red, bg: C.redBg },
      { icon: ic.eye, num: "2", title: "答えを鵜呑みにしない", desc: "AIは自信満々に間違える（ハルシネーション）。必ず人間がファクトチェック。", color: C.amber, bg: C.amberBg },
      { icon: ic.balance, num: "3", title: "著作権に注意する", desc: "AI生成物の著作権は法的にグレー。外部公開する場合は上長に確認。", color: C.red, bg: C.redBg },
    ];

    cautions.forEach((c, i) => {
      const y = 1.2 + i * 1.2;

      // Left accent bar
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: 0.05, h: 0.95, fill: { color: c.color }
      });

      // Icon
      s.addShape(pres.shapes.OVAL, {
        x: L.mx + 0.3, y: y + 0.15, w: 0.6, h: 0.6,
        fill: { color: c.bg }
      });
      s.addImage({ data: c.icon, x: L.mx + 0.4, y: y + 0.25, w: 0.4, h: 0.4 });

      // Title
      s.addText(c.title, {
        x: L.mx + 1.2, y: y + 0.05, w: 7, h: 0.4,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, valign: "middle", margin: 0
      });
      // Description
      s.addText(c.desc, {
        x: L.mx + 1.2, y: y + 0.5, w: 7, h: 0.4,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textLight, valign: "top", margin: 0
      });
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
      { label: "AIとは", text: "「人間の判断をコンピュータにやらせる技術」", color: C.accent },
      { label: "3つの種類", text: "ルールベース → 機械学習 → 生成AI", color: C.green },
      { label: "業務活用", text: "下書き・要約・アイデア出し・リサーチに有効", color: C.amber },
      { label: "注意点", text: "機密情報NG / 鵜呑みNG / 著作権に注意", color: C.red },
    ];

    items.forEach((item, i) => {
      const y = 1.2 + i * 0.95;

      // White card
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.75,
        fill: { color: C.white },
        line: { color: C.border, width: 0.5 }
      });
      // Color accent
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
  // SLIDE 12: END / CTA
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

    s.addText("次の動画: AI-102 生成AIでできること・できないこと", {
      x: 2.5, y: 3.8, w: 5, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textMuted, align: "center", margin: 0
    });
  }

  // Write
  const out = "/Users/kurosakiyuto/Downloads/開発/gorilla-knowledge/黒崎/AI研修一覧/AI-101_AIの基本/スライド.pptx";
  await pres.writeFile({ fileName: out });
  console.log("Generated:", out);
}

main().catch(console.error);
