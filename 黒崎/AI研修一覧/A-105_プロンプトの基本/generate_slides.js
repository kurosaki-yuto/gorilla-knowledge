const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const {
  FaPencilAlt, FaBullseye, FaComments, FaTimesCircle,
  FaCheckCircle, FaCubes, FaTheaterMasks, FaClipboardList,
  FaExchangeAlt, FaTools, FaBookOpen, FaTrophy,
  FaChevronRight, FaUtensils, FaLightbulb, FaExclamationTriangle,
  FaListOl, FaSlidersH, FaBan, FaRocket
} = require("react-icons/fa");

// =====================================================
// DESIGN SYSTEM
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
  purple: "7C3AED",
  purpleBg: "E9D5FF",
  border: "E5E7EB",
};

const F = {
  sans: "Calibri",
  size: {
    hero: 44, h1: 32, h2: 22, h3: 18, body: 16, label: 13, caption: 11, tag: 10,
  }
};

const L = {
  W: 10, H: 5.625, mx: 0.75, my: 0.5, gap: 0.3,
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

function addFooter(slide, pres, num, total) {
  slide.addShape(pres.shapes.LINE, {
    x: L.mx, y: L.H - 0.4, w: L.W - L.mx * 2, h: 0,
    line: { color: C.border, width: 0.5 }
  });
  slide.addText(`${num} / ${total}`, {
    x: L.W - 1.5, y: L.H - 0.38, w: 1.2, h: 0.3,
    fontSize: F.size.caption, fontFace: F.sans,
    color: C.textMuted, align: "right", margin: 0
  });
  slide.addText("A-105", {
    x: L.mx, y: L.H - 0.38, w: 2, h: 0.3,
    fontSize: F.size.caption, fontFace: F.sans,
    color: C.textMuted, align: "left", margin: 0
  });
}

function addSectionTitle(slide, pres, title, tag) {
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
  pres.title = "A-105: プロンプトの基本〜AIへの指示の出し方";

  // Pre-render icons
  const ic = {
    pencil: await icon(FaPencilAlt, C.accent),
    target: await icon(FaBullseye, C.accent),
    comments: await icon(FaComments, C.accent),
    times: await icon(FaTimesCircle, C.red),
    check: await icon(FaCheckCircle, C.green),
    cubes: await icon(FaCubes, C.accent),
    mask: await icon(FaTheaterMasks, C.accent),
    clipboard: await icon(FaClipboardList, C.purple),
    exchange: await icon(FaExchangeAlt, C.accent),
    tools: await icon(FaTools, C.amber),
    book: await icon(FaBookOpen, C.accent),
    trophy: await icon(FaTrophy, C.accent),
    chevron: await icon(FaChevronRight, C.textMuted),
    utensils: await icon(FaUtensils, C.amber),
    bulb: await icon(FaLightbulb, C.amber),
    warn: await icon(FaExclamationTriangle, C.red),
    listOl: await icon(FaListOl, C.green),
    sliders: await icon(FaSlidersH, C.amber),
    ban: await icon(FaBan, C.red),
    rocket: await icon(FaRocket, C.accent),
    pencilNavy: await icon(FaPencilAlt, C.navyLight),
    checkBlue: await icon(FaCheckCircle, C.accent),
  };

  const T = 12;

  // ============================================================
  // SLIDE 1: TITLE (Navy)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };

    s.addImage({ data: ic.pencil, x: (L.W - 0.7) / 2, y: 1.0, w: 0.7, h: 0.7 });

    s.addText("プロンプトの基本", {
      x: 0.5, y: 1.9, w: 9, h: 0.9,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center", margin: 0
    });

    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 2.95, w: 3, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });

    s.addText("AIへの指示の出し方", {
      x: 0.5, y: 3.15, w: 9, h: 0.5,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", margin: 0
    });

    s.addText("A-105   |   全社員向け   |   20分", {
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
    addSectionTitle(s, pres, "今日のゴール");
    addFooter(s, pres, 2, T);

    const goals = [
      "プロンプトとは何かを説明できる",
      "良いプロンプトの5つの要素（役割・文脈・指示・形式・制約）を使える",
      "悪いプロンプトと良いプロンプトの違いを具体例で比較できる",
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
  // SLIDE 3: WHAT IS PROMPT
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, pres, "プロンプトとは何か？", "BASICS");
    addFooter(s, pres, 3, T);

    // Flow diagram
    const flowItems = [
      { text: "あなた", color: C.accent, bg: C.accentLight },
      { text: "プロンプト", color: C.white, bg: C.accent },
      { text: "AI", color: C.accent, bg: C.accentLight },
      { text: "回答", color: C.green, bg: C.greenBg },
    ];
    const fW = 1.8;
    const fGap = 0.4;
    const fTotalW = fW * 4 + fGap * 3;
    const fStartX = (L.W - fTotalW) / 2;
    const fY = 1.5;

    flowItems.forEach((item, i) => {
      const x = fStartX + i * (fW + fGap);
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: fY, w: fW, h: 0.55,
        fill: { color: item.bg }, rectRadius: 0.05
      });
      s.addText(item.text, {
        x, y: fY, w: fW, h: 0.55,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: item.color, align: "center", valign: "middle"
      });
      if (i < 3) {
        s.addImage({ data: ic.chevron, x: x + fW + 0.08, y: fY + 0.15, w: 0.2, h: 0.2 });
      }
    });

    // Three key points
    const points = [
      { icon: ic.comments, title: "AIとの会話の入り口", desc: "AIに入力する文章はすべてプロンプト", color: C.accent, bg: C.accentLight },
      { icon: ic.target, title: "指示の質 = 回答の質", desc: "曖昧な指示→曖昧な回答、具体的→的確", color: C.green, bg: C.greenBg },
      { icon: ic.utensils, title: "プロンプトは「レシピ」", desc: "同じAIでも書き方次第で結果が全く変わる", color: C.amber, bg: C.amberBg },
    ];

    const cardW = 2.6;
    const cardGap = 0.25;
    const totalW = cardW * 3 + cardGap * 2;
    const startX = (L.W - totalW) / 2;

    points.forEach((item, i) => {
      const x = startX + i * (cardW + cardGap);
      const y = 2.4;
      const h = 2.3;

      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h,
        fill: { color: C.white },
        line: { color: C.border, width: 0.75 }
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 0.06, fill: { color: item.color }
      });
      s.addShape(pres.shapes.OVAL, {
        x: x + (cardW - 0.65) / 2, y: y + 0.3, w: 0.65, h: 0.65,
        fill: { color: item.bg }
      });
      s.addImage({ data: item.icon, x: x + (cardW - 0.35) / 2, y: y + 0.45, w: 0.35, h: 0.35 });
      s.addText(item.title, {
        x: x + 0.15, y: y + 1.1, w: cardW - 0.3, h: 0.5,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.textDark, align: "center", valign: "middle", margin: 0
      });
      s.addText(item.desc, {
        x: x + 0.15, y: y + 1.65, w: cardW - 0.3, h: 0.5,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textLight, align: "center", valign: "top", margin: 0
      });
    });
  }

  // ============================================================
  // SLIDE 4: BAD PROMPTS
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, pres, "なぜAIの回答がイマイチなのか？", "ANTI-PATTERN");
    addFooter(s, pres, 4, T);

    const badExamples = [
      { prompt: "「いい感じにして」", issue: "何を、どう？ AIには分からない" },
      { prompt: "「マーケティングについて教えて」", issue: "範囲が広すぎて一般論しか返せない" },
      { prompt: "「文章を書いて」", issue: "メール？ ブログ？ 誰向け？ 何文字？" },
    ];

    badExamples.forEach((e, i) => {
      const y = 1.5 + i * 0.85;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.7,
        fill: { color: C.redBg }
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: 0.05, h: 0.7, fill: { color: C.red }
      });
      s.addImage({ data: ic.times, x: L.mx + 0.25, y: y + 0.17, w: 0.3, h: 0.3 });
      s.addText(e.prompt, {
        x: L.mx + 0.75, y, w: 3.8, h: 0.7,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.textDark, valign: "middle", margin: 0
      });
      s.addText("→ " + e.issue, {
        x: L.mx + 4.6, y, w: 4.0, h: 0.7,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.red, valign: "middle", margin: 0
      });
    });

    // Key message
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.2, w: L.W - L.mx * 2, h: 0.65,
      fill: { color: C.navy }
    });
    s.addText("共通点: 具体性がない・前提がない・ゴールが不明確 → 指示を改善すればAIは変わる", {
      x: L.mx + 0.3, y: 4.2, w: L.W - L.mx * 2 - 0.6, h: 0.65,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.white, align: "center", valign: "middle"
    });
  }

  // ============================================================
  // SLIDE 5: 5 ELEMENTS
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, pres, "良いプロンプトの5つの要素", "FRAMEWORK");
    addFooter(s, pres, 5, T);

    const elements = [
      { letter: "R", label: "役割", en: "Role", desc: "どんな専門家として振る舞うか", color: C.accent, bg: C.accentLight },
      { letter: "C", label: "文脈", en: "Context", desc: "背景情報・前提条件", color: C.purple, bg: C.purpleBg },
      { letter: "I", label: "指示", en: "Instruction", desc: "具体的にやってほしいこと", color: C.green, bg: C.greenBg },
      { letter: "F", label: "形式", en: "Format", desc: "出力の形・長さ・構成", color: C.amber, bg: C.amberBg },
      { letter: "C", label: "制約", en: "Constraint", desc: "やってはいけないこと・条件", color: C.red, bg: C.redBg },
    ];

    const cardW = 1.55;
    const cardGap = 0.15;
    const totalW = cardW * 5 + cardGap * 4;
    const startX = (L.W - totalW) / 2;

    elements.forEach((el, i) => {
      const x = startX + i * (cardW + cardGap);
      const y = 1.3;
      const h = 3.5;

      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h,
        fill: { color: C.white },
        line: { color: C.border, width: 0.75 }
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 0.06, fill: { color: el.color }
      });
      // Letter circle
      s.addText(el.letter, {
        x: x + (cardW - 0.55) / 2, y: y + 0.3, w: 0.55, h: 0.55,
        fontSize: F.size.h2, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: el.color }, shape: pres.shapes.OVAL
      });
      // Label
      s.addText(el.label, {
        x: x + 0.1, y: y + 1.1, w: cardW - 0.2, h: 0.45,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, align: "center", valign: "middle", margin: 0
      });
      // English
      s.addText(el.en, {
        x: x + 0.1, y: y + 1.55, w: cardW - 0.2, h: 0.3,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textMuted, align: "center", valign: "middle", margin: 0
      });
      // Separator
      s.addShape(pres.shapes.LINE, {
        x: x + 0.2, y: y + 2.0, w: cardW - 0.4, h: 0,
        line: { color: C.border, width: 0.5 }
      });
      // Description
      s.addText(el.desc, {
        x: x + 0.1, y: y + 2.15, w: cardW - 0.2, h: 0.8,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textBody, align: "center", valign: "top", margin: 0
      });
    });
  }

  // ============================================================
  // SLIDE 6: ROLE & CONTEXT
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, pres, "役割と文脈 — AIに「前提」を伝える", "DEEP DIVE");
    addFooter(s, pres, 6, T);

    // Left column: Role
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 1.3, w: 4.0, h: 2.2,
      fill: { color: C.white }, line: { color: C.border, width: 0.75 }
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 1.3, w: 4.0, h: 0.06, fill: { color: C.accent }
    });
    s.addText("役割の例", {
      x: L.mx + 0.2, y: 1.5, w: 3.5, h: 0.35,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.accent, margin: 0
    });
    const roles = [
      "10年経験のあるWebデザイナー",
      "中学生に教える理科の先生",
      "IT企業の採用担当者",
    ];
    roles.forEach((r, i) => {
      s.addImage({ data: ic.checkBlue, x: L.mx + 0.2, y: 2.0 + i * 0.4, w: 0.2, h: 0.2 });
      s.addText(r, {
        x: L.mx + 0.55, y: 1.93 + i * 0.4, w: 3.3, h: 0.35,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textBody, valign: "middle", margin: 0
      });
    });

    // Right column: Context
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx + 4.25, y: 1.3, w: 4.25, h: 2.2,
      fill: { color: C.white }, line: { color: C.border, width: 0.75 }
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx + 4.25, y: 1.3, w: 4.25, h: 0.06, fill: { color: C.purple }
    });
    s.addText("文脈の例", {
      x: L.mx + 4.45, y: 1.5, w: 3.8, h: 0.35,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.purple, margin: 0
    });
    const contexts = [
      "飲食店を経営、新メニュー開発中",
      "営業チーム5人のリーダー",
      "来月の展示会に出展予定",
    ];
    contexts.forEach((c, i) => {
      s.addImage({ data: ic.checkBlue, x: L.mx + 4.45, y: 2.0 + i * 0.4, w: 0.2, h: 0.2 });
      s.addText(c, {
        x: L.mx + 4.8, y: 1.93 + i * 0.4, w: 3.5, h: 0.35,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textBody, valign: "middle", margin: 0
      });
    });

    // Before/After
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.75, w: 4.0, h: 1.0,
      fill: { color: C.redBg }
    });
    s.addText("Before", {
      x: L.mx + 0.15, y: 3.8, w: 1.5, h: 0.3,
      fontSize: F.size.tag, fontFace: F.sans, bold: true, color: C.red
    });
    s.addText("「集客方法を教えて」", {
      x: L.mx + 0.15, y: 4.1, w: 3.7, h: 0.5,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textDark, valign: "top", margin: 0
    });

    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx + 4.25, y: 3.75, w: 4.25, h: 1.0,
      fill: { color: C.greenBg }
    });
    s.addText("After", {
      x: L.mx + 4.4, y: 3.8, w: 1.5, h: 0.3,
      fontSize: F.size.tag, fontFace: F.sans, bold: true, color: C.green
    });
    s.addText("「あなたは飲食店コンサルタントです。駅前ラーメン店の平日ランチ集客を低予算で3つ教えて」", {
      x: L.mx + 4.4, y: 4.1, w: 3.9, h: 0.55,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textDark, valign: "top", margin: 0
    });
  }

  // ============================================================
  // SLIDE 7: INSTRUCTION
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, pres, "指示 — 「何をしてほしいか」を明確に", "DEEP DIVE");
    addFooter(s, pres, 7, T);

    // Comparison table
    const comparisons = [
      { vague: "「教えて」", clear: "「3つのステップに分けて説明して」" },
      { vague: "「まとめて」", clear: "「要点を5つの箇条書きにまとめて」" },
      { vague: "「考えて」", clear: "「メリ3つ・デメ3つを表形式で比較して」" },
    ];

    // Headers
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 1.4, w: 3.5, h: 0.4, fill: { color: C.redBg }
    });
    s.addText("曖昧な指示", {
      x: L.mx, y: 1.4, w: 3.5, h: 0.4,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.red, align: "center", valign: "middle"
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx + 3.75, y: 1.4, w: 4.75, h: 0.4, fill: { color: C.greenBg }
    });
    s.addText("明確な指示", {
      x: L.mx + 3.75, y: 1.4, w: 4.75, h: 0.4,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.green, align: "center", valign: "middle"
    });

    comparisons.forEach((c, i) => {
      const y = 1.95 + i * 0.55;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.45, fill: { color: C.offWhite }
      });
      s.addText(c.vague, {
        x: L.mx + 0.15, y, w: 3.2, h: 0.45,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textDark, valign: "middle", margin: 0
      });
      s.addImage({ data: ic.chevron, x: L.mx + 3.35, y: y + 0.1, w: 0.2, h: 0.2 });
      s.addText(c.clear, {
        x: L.mx + 3.75, y, w: 4.75, h: 0.45,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.green, valign: "middle", margin: 0
      });
    });

    // 3 tips
    s.addText("指示を明確にする3つのコツ", {
      x: L.mx, y: 3.65, w: 5, h: 0.35,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.textDark, margin: 0
    });

    const tips = [
      { num: "1", text: "動詞を具体的にする（比較/要約/翻訳）" },
      { num: "2", text: "数を指定する（「いくつか」→「5つ」）" },
      { num: "3", text: "ステップに分解する（複雑→小さく分ける）" },
    ];

    tips.forEach((t, i) => {
      const y = 4.1 + i * 0.4;
      s.addText(t.num, {
        x: L.mx + 0.1, y, w: 0.35, h: 0.35,
        fontSize: F.size.label, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: C.green }, shape: pres.shapes.OVAL
      });
      s.addText(t.text, {
        x: L.mx + 0.6, y, w: 7.5, h: 0.35,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textBody, valign: "middle", margin: 0
      });
    });
  }

  // ============================================================
  // SLIDE 8: FORMAT & CONSTRAINT
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, pres, "形式と制約 — アウトプットをコントロールする", "DEEP DIVE");
    addFooter(s, pres, 8, T);

    // Format column
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 1.3, w: 4.0, h: 2.6,
      fill: { color: C.white }, line: { color: C.border, width: 0.75 }
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 1.3, w: 4.0, h: 0.06, fill: { color: C.amber }
    });
    s.addText("形式の指定例", {
      x: L.mx + 0.2, y: 1.5, w: 3.5, h: 0.35,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.amber, margin: 0
    });
    const formats = [
      "「箇条書きで」「番号付きリストで」",
      "「表形式（項目/メリ/デメ）で」",
      "「300文字以内で」「見出し付きで」",
      "「メール文面として」",
    ];
    formats.forEach((f, i) => {
      s.addImage({ data: ic.checkBlue, x: L.mx + 0.2, y: 2.0 + i * 0.4, w: 0.2, h: 0.2 });
      s.addText(f, {
        x: L.mx + 0.55, y: 1.93 + i * 0.4, w: 3.3, h: 0.35,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textBody, valign: "middle", margin: 0
      });
    });

    // Constraint column
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx + 4.25, y: 1.3, w: 4.25, h: 2.6,
      fill: { color: C.white }, line: { color: C.border, width: 0.75 }
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx + 4.25, y: 1.3, w: 4.25, h: 0.06, fill: { color: C.red }
    });
    s.addText("制約の指定例", {
      x: L.mx + 4.45, y: 1.5, w: 3.8, h: 0.35,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.red, margin: 0
    });
    const constraints = [
      "「専門用語を使わず中学生にも分かる言葉で」",
      "「日本市場に限定して」",
      "「ネガティブな表現は避けて」",
      "「競合ブランド名は使わないで」",
    ];
    constraints.forEach((c, i) => {
      s.addImage({ data: ic.ban, x: L.mx + 4.45, y: 2.0 + i * 0.4, w: 0.2, h: 0.2 });
      s.addText(c, {
        x: L.mx + 4.8, y: 1.93 + i * 0.4, w: 3.5, h: 0.35,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textBody, valign: "middle", margin: 0
      });
    });

    // Key message
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.2, w: L.W - L.mx * 2, h: 0.6,
      fill: { color: C.accentLight }
    });
    s.addImage({ data: ic.bulb, x: L.mx + 0.2, y: 4.3, w: 0.3, h: 0.3 });
    s.addText("形式 =「どんな形で出すか」  /  制約 =「何をやらないか」→ 出力を自在にコントロール", {
      x: L.mx + 0.7, y: 4.2, w: 7.5, h: 0.6,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", margin: 0
    });
  }

  // ============================================================
  // SLIDE 9: BEFORE/AFTER
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, pres, "実践！ Before → After", "PRACTICE");
    addFooter(s, pres, 9, T);

    // Before
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 1.4, w: 3.8, h: 2.5,
      fill: { color: C.redBg }
    });
    s.addText("Before", {
      x: L.mx + 0.15, y: 1.5, w: 1.5, h: 0.3,
      fontSize: F.size.label, fontFace: F.sans, bold: true, color: C.red
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx + 0.15, y: 1.95, w: 3.5, h: 0.55,
      fill: { color: C.white }, rectRadius: 0.05
    });
    s.addText("新商品のキャッチコピーを考えて", {
      x: L.mx + 0.3, y: 1.95, w: 3.2, h: 0.55,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textDark, valign: "middle", margin: 0
    });
    s.addText("→ 「素敵な毎日を」...抽象的で使えない", {
      x: L.mx + 0.15, y: 2.7, w: 3.5, h: 0.4,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.red, valign: "middle", margin: 0
    });

    // After
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx + 4.1, y: 1.4, w: 4.4, h: 2.5,
      fill: { color: C.greenBg }
    });
    s.addText("After（5要素を活用）", {
      x: L.mx + 4.25, y: 1.5, w: 3.5, h: 0.3,
      fontSize: F.size.label, fontFace: F.sans, bold: true, color: C.green
    });

    const afterLines = [
      { tag: "[役割]", text: "コピーライターとして", color: C.accent },
      { tag: "[文脈]", text: "20代女性向けオーガニック美容液", color: C.purple },
      { tag: "[指示]", text: "キャッチコピーを5案", color: C.green },
      { tag: "[形式]", text: "各20文字以内、理由付き", color: C.amber },
      { tag: "[制約]", text: "競合名は使わない", color: C.red },
    ];

    afterLines.forEach((l, i) => {
      const y = 1.95 + i * 0.35;
      s.addText(l.tag, {
        x: L.mx + 4.25, y, w: 0.8, h: 0.3,
        fontSize: F.size.caption, fontFace: F.sans, bold: true,
        color: l.color, valign: "middle", margin: 0
      });
      s.addText(l.text, {
        x: L.mx + 5.1, y, w: 3.2, h: 0.3,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textDark, valign: "middle", margin: 0
      });
    });

    s.addText("→ ターゲットに刺さる具体的な5案が出る", {
      x: L.mx + 4.25, y: 3.55, w: 4.0, h: 0.3,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.green, valign: "middle", margin: 0
    });

    // Bottom key message
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.2, w: L.W - L.mx * 2, h: 0.6,
      fill: { color: C.navy }
    });
    s.addText("同じAIでもプロンプトの書き方だけでこれだけ差が出る ― これがプロンプトの力", {
      x: L.mx + 0.3, y: 4.2, w: L.W - L.mx * 2 - 0.6, h: 0.6,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.white, align: "center", valign: "middle"
    });
  }

  // ============================================================
  // SLIDE 10: TIPS & TRICKS
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, pres, "よくある失敗と改善テクニック", "TIPS");
    addFooter(s, pres, 10, T);

    // Failure patterns
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 1.3, w: 4.0, h: 3.0,
      fill: { color: C.white }, line: { color: C.border, width: 0.75 }
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 1.3, w: 4.0, h: 0.06, fill: { color: C.red }
    });
    s.addText("失敗パターン → 対策", {
      x: L.mx + 0.2, y: 1.5, w: 3.5, h: 0.35,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.red, margin: 0
    });

    const failures = [
      { fail: "回答が長すぎる", fix: "→「3行で」「100字以内で」" },
      { fail: "的外れな回答", fix: "→ 文脈と役割を追加" },
      { fail: "一般論しか出ない", fix: "→ 具体的な条件を追加" },
      { fail: "話が脱線する", fix: "→「この質問だけ答えて」" },
    ];

    failures.forEach((f, i) => {
      const y = 2.0 + i * 0.5;
      if (i > 0) {
        s.addShape(pres.shapes.LINE, {
          x: L.mx + 0.2, y, w: 3.6, h: 0,
          line: { color: C.border, width: 0.5 }
        });
      }
      s.addText(f.fail, {
        x: L.mx + 0.2, y: y + 0.05, w: 1.8, h: 0.35,
        fontSize: F.size.label, fontFace: F.sans, bold: true,
        color: C.red, valign: "middle", margin: 0
      });
      s.addText(f.fix, {
        x: L.mx + 2.0, y: y + 0.05, w: 1.8, h: 0.35,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.accent, valign: "middle", margin: 0
      });
    });

    // Advanced techniques
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx + 4.25, y: 1.3, w: 4.25, h: 3.0,
      fill: { color: C.white }, line: { color: C.border, width: 0.75 }
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx + 4.25, y: 1.3, w: 4.25, h: 0.06, fill: { color: C.accent }
    });
    s.addText("上級テクニック", {
      x: L.mx + 4.45, y: 1.5, w: 3.8, h: 0.35,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.accent, margin: 0
    });

    // Technique 1
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx + 4.45, y: 2.1, w: 3.85, h: 0.9,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    s.addText("「ステップバイステップで考えて」", {
      x: L.mx + 4.6, y: 2.15, w: 3.5, h: 0.4,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", margin: 0
    });
    s.addText("AIの思考の質が上がる", {
      x: L.mx + 4.6, y: 2.55, w: 3.5, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textBody, valign: "top", margin: 0
    });

    // Technique 2
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx + 4.45, y: 3.15, w: 3.85, h: 0.9,
      fill: { color: C.greenBg }, rectRadius: 0.05
    });
    s.addText("「回答前に前提条件を確認して」", {
      x: L.mx + 4.6, y: 3.2, w: 3.5, h: 0.4,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.green, valign: "middle", margin: 0
    });
    s.addText("認識ズレを防げる", {
      x: L.mx + 4.6, y: 3.6, w: 3.5, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textBody, valign: "top", margin: 0
    });
  }

  // ============================================================
  // SLIDE 11: SUMMARY
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, pres, "今日のまとめ");
    addFooter(s, pres, 11, T);

    const summaryItems = [
      { icon: ic.pencil, title: "プロンプト = 指示文", desc: "指示の質がそのまま回答の質に。\n曖昧な指示 → 曖昧な回答。具体的 → 的確。", color: C.accent, bg: C.accentLight },
      { icon: ic.cubes, title: "5つの要素: RCIFC", desc: "役割・文脈・指示・形式・制約。\n状況に応じて組み合わせる。", color: C.green, bg: C.greenBg },
      { icon: ic.rocket, title: "まず「具体的に」", desc: "完璧でなくてOK。「もう少し具体的に書けないかな？」\nと問いかけるだけで回答は確実に良くなる。", color: C.amber, bg: C.amberBg },
    ];

    const cardW = 2.6;
    const cardGap = 0.25;
    const totalW = cardW * 3 + cardGap * 2;
    const startX = (L.W - totalW) / 2;

    summaryItems.forEach((item, i) => {
      const x = startX + i * (cardW + cardGap);
      const y = 1.2;
      const h = 2.8;

      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h,
        fill: { color: C.white },
        line: { color: C.border, width: 0.75 }
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 0.06, fill: { color: item.color }
      });
      s.addShape(pres.shapes.OVAL, {
        x: x + (cardW - 0.65) / 2, y: y + 0.3, w: 0.65, h: 0.65,
        fill: { color: item.bg }
      });
      s.addImage({ data: item.icon, x: x + (cardW - 0.35) / 2, y: y + 0.45, w: 0.35, h: 0.35 });
      s.addText(item.title, {
        x: x + 0.15, y: y + 1.1, w: cardW - 0.3, h: 0.5,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.textDark, align: "center", valign: "middle", margin: 0
      });
      s.addShape(pres.shapes.LINE, {
        x: x + 0.3, y: y + 1.7, w: cardW - 0.6, h: 0,
        line: { color: C.border, width: 0.5 }
      });
      s.addText(item.desc, {
        x: x + 0.15, y: y + 1.85, w: cardW - 0.3, h: 0.8,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textBody, align: "center", valign: "top", margin: 0
      });
    });

    // Key message
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.3, w: L.W - L.mx * 2, h: 0.6,
      fill: { color: C.navy }
    });
    s.addText("プロンプトは「練習」で上手くなる ― 今日からどんどん試してみよう！", {
      x: L.mx + 0.3, y: 4.3, w: L.W - L.mx * 2 - 0.6, h: 0.6,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.white, align: "center", valign: "middle"
    });
  }

  // ============================================================
  // SLIDE 12: END (Navy)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };

    s.addImage({ data: ic.trophy, x: (L.W - 0.7) / 2, y: 1.2, w: 0.7, h: 0.7 });

    s.addText("お疲れさまでした！", {
      x: 0.5, y: 2.1, w: 9, h: 0.7,
      fontSize: F.size.h1 + 4, fontFace: F.sans, bold: true,
      color: C.white, align: "center", margin: 0
    });

    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 2.95, w: 3, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });

    const endItems = [
      "このあと確認テスト（5問）があります",
      "80%以上の正答で修了です",
      "5つの要素を思い出しながらチャレンジ！",
    ];

    endItems.forEach((item, i) => {
      s.addText(item, {
        x: 1, y: 3.2 + i * 0.45, w: 8, h: 0.4,
        fontSize: F.size.h3, fontFace: F.sans,
        color: C.accentMid, align: "center", valign: "middle", margin: 0
      });
    });
  }

  // ============================================================
  // SAVE
  // ============================================================
  const outPath = __dirname + "/スライド.pptx";
  await pres.writeFile({ fileName: outPath });
  console.log("Generated:", outPath);
}

main().catch(err => { console.error(err); process.exit(1); });
