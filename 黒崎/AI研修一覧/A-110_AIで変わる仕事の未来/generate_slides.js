const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const {
  FaRocket, FaBrain, FaChartLine, FaCogs, FaLightbulb,
  FaCheckCircle, FaArrowRight, FaChevronRight, FaBullseye,
  FaComments, FaUsers, FaShieldAlt, FaTrophy, FaLaptopCode,
  FaHandshake, FaPaintBrush, FaHeadset, FaClipboardList,
  FaStar, FaGraduationCap, FaFileAlt
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

// =====================================================
// LAYOUT PRIMITIVES
// =====================================================

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
  slide.addText("A-110", {
    x: L.mx, y: L.H - 0.38, w: 2, h: 0.3,
    fontSize: F.size.caption, fontFace: F.sans,
    color: C.textMuted, align: "left", margin: 0
  });
}

function addSectionTitle(slide, title) {
  slide.addText(title, {
    x: L.mx, y: 0.35, w: 8.5, h: 0.55,
    fontSize: F.size.h1, fontFace: F.sans, bold: true,
    color: C.textDark, margin: 0
  });
}

// Before/After case study slide
function addCaseStudy(slide, pres, {tag, tagColor, tagBg, title, subtitle, beforeItems, afterItems, afterColor, humanRole, icons, num, total}) {
  addTopBar(slide, pres);

  // Tag
  slide.addShape(pres.shapes.RECTANGLE, {
    x: L.mx, y: 0.35, w: 1.5, h: 0.28,
    fill: { color: tagBg }, rectRadius: 0.05
  });
  slide.addText(tag, {
    x: L.mx, y: 0.35, w: 1.5, h: 0.28,
    fontSize: F.size.tag, fontFace: F.sans, bold: true,
    color: tagColor, align: "center", valign: "middle"
  });

  // Title
  slide.addText(title, {
    x: L.mx, y: 0.7, w: 8, h: 0.5,
    fontSize: F.size.h1, fontFace: F.sans, bold: true,
    color: C.textDark, margin: 0
  });

  // Subtitle
  slide.addText(subtitle, {
    x: L.mx, y: 1.15, w: 8, h: 0.3,
    fontSize: F.size.body, fontFace: F.sans,
    color: C.textLight, margin: 0
  });

  const flowY = 1.6;
  const boxW = 3.5;
  const boxH = 1.5;

  // Before box
  slide.addShape(pres.shapes.RECTANGLE, {
    x: L.mx, y: flowY, w: boxW, h: boxH,
    fill: { color: C.offWhite }, line: { color: C.border, width: 0.5 }
  });
  slide.addText("Before", {
    x: L.mx + 0.3, y: flowY + 0.1, w: 2, h: 0.35,
    fontSize: F.size.h3, fontFace: F.sans, bold: true,
    color: C.textMuted, valign: "middle", margin: 0
  });
  beforeItems.forEach((item, i) => {
    slide.addText("・" + item, {
      x: L.mx + 0.3, y: flowY + 0.5 + i * 0.3, w: boxW - 0.6, h: 0.3,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textLight, valign: "middle", margin: 0
    });
  });

  // Arrow
  slide.addImage({ data: icons.arrow, x: L.mx + boxW + 0.35, y: flowY + boxH / 2 - 0.2, w: 0.4, h: 0.4 });

  // After box
  const rx = L.mx + boxW + 1.1;
  slide.addShape(pres.shapes.RECTANGLE, {
    x: rx, y: flowY, w: boxW, h: boxH,
    fill: { color: C.white }, line: { color: afterColor, width: 1 }
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: rx, y: flowY, w: boxW, h: 0.06, fill: { color: afterColor }
  });
  slide.addText("After (AI)", {
    x: rx + 0.3, y: flowY + 0.1, w: 2.5, h: 0.35,
    fontSize: F.size.h3, fontFace: F.sans, bold: true,
    color: afterColor, valign: "middle", margin: 0
  });
  afterItems.forEach((item, i) => {
    slide.addText("・" + item, {
      x: rx + 0.3, y: flowY + 0.5 + i * 0.3, w: boxW - 0.6, h: 0.3,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textBody, valign: "middle", margin: 0
    });
  });

  // Human role bar
  const roleY = 3.35;
  slide.addShape(pres.shapes.RECTANGLE, {
    x: L.mx, y: roleY, w: L.W - L.mx * 2, h: 0.5,
    fill: { color: C.greenBg }, line: { color: C.green, width: 0.5 }
  });
  slide.addImage({ data: icons.users, x: L.mx + 0.15, y: roleY + 0.08, w: 0.3, h: 0.3 });
  slide.addText("人間の役割: " + humanRole, {
    x: L.mx + 0.6, y: roleY, w: L.W - L.mx * 2 - 0.9, h: 0.5,
    fontSize: F.size.label, fontFace: F.sans, bold: true,
    color: C.green, valign: "middle", margin: 0
  });

  addFooter(slide, num, total, pres);
}

async function main() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "Gorilla Knowledge";
  pres.title = "A-110: AIで変わる仕事の未来";

  // Pre-render icons
  const ic = {
    rocket: await icon(FaRocket, C.accent),
    brain: await icon(FaBrain, C.accent),
    chart: await icon(FaChartLine, C.accent),
    cogs: await icon(FaCogs, C.accent),
    bulb: await icon(FaLightbulb, C.amber),
    check: await icon(FaCheckCircle, C.green),
    checkBlue: await icon(FaCheckCircle, C.accent),
    arrow: await icon(FaArrowRight, C.accent),
    chevron: await icon(FaChevronRight, C.textMuted),
    target: await icon(FaBullseye, C.accent),
    comments: await icon(FaComments, C.accent),
    users: await icon(FaUsers, C.accent),
    usersNavy: await icon(FaUsers, C.navyLight),
    shield: await icon(FaShieldAlt, C.green),
    trophy: await icon(FaTrophy, C.amber),
    laptop: await icon(FaLaptopCode, C.accent),
    handshake: await icon(FaHandshake, C.accent),
    paint: await icon(FaPaintBrush, C.amber),
    headset: await icon(FaHeadset, C.green),
    clipboard: await icon(FaClipboardList, C.accent),
    star: await icon(FaStar, C.amber),
    grad: await icon(FaGraduationCap, C.accent),
    file: await icon(FaFileAlt, C.accent),
    brainAmber: await icon(FaBrain, C.amber),
    rocketGreen: await icon(FaRocket, C.green),
  };

  const T = 12;

  // ============================================================
  // SLIDE 1: TITLE
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };

    s.addImage({ data: ic.rocket, x: (L.W - 0.7) / 2, y: 1.0, w: 0.7, h: 0.7 });

    s.addText("AIで変わる仕事の未来", {
      x: 0.5, y: 1.9, w: 9, h: 0.9,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center", margin: 0
    });

    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 2.95, w: 3, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });

    s.addText("あなたのキャリアを進化させるAI活用戦略", {
      x: 0.5, y: 3.15, w: 9, h: 0.5,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", margin: 0
    });

    s.addText("A-110   |   全社員向け   |   20分", {
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
    addFooter(s, 2, T, pres);

    const goals = [
      "AI時代に必要な3つのスキル（問いを立てる力・判断力・創造力）を説明できる",
      "AIによって変化する職種・業務の具体例を5つ以上挙げられる",
      "自分のキャリアにAIをどう活かすかの行動計画を立てられる",
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
  // SLIDE 3: 3 WAVES (3-card)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "AIが仕事を変える3つの波");
    addFooter(s, 3, T, pres);

    const waves = [
      { ic: ic.cogs, label: "第1波: 自動化", sub: "定型業務を\nAIが代替", desc: "データ入力 / 集計 / 分類", color: C.accent, bgColor: C.accentLight },
      { ic: ic.rocketGreen, label: "第2波: 拡張", sub: "人間の能力を\nAIが強化", desc: "分析支援 / 創作補助 / 翻訳", color: C.green, bgColor: C.greenBg },
      { ic: ic.star, label: "第3波: 変革", sub: "まったく新しい\n仕事の誕生", desc: "AI運用 / プロンプト設計 / 倫理監査", color: C.amber, bgColor: C.amberBg },
    ];

    const cardW = 2.55;
    const cardGap = 0.3;
    const totalW = cardW * 3 + cardGap * 2;
    const startX = (L.W - totalW) / 2;

    waves.forEach((t, i) => {
      const x = startX + i * (cardW + cardGap);
      const y = 1.15;
      const h = 3.5;

      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h,
        fill: { color: C.white },
        line: { color: C.border, width: 0.75 }
      });

      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 0.06, fill: { color: t.color }
      });

      s.addShape(pres.shapes.OVAL, {
        x: x + (cardW - 0.7) / 2, y: y + 0.4, w: 0.7, h: 0.7,
        fill: { color: t.bgColor }
      });
      s.addImage({ data: t.ic, x: x + (cardW - 0.4) / 2, y: y + 0.55, w: 0.4, h: 0.4 });

      s.addText(t.label, {
        x, y: y + 1.35, w: cardW, h: 0.5,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, align: "center", margin: 0
      });

      s.addShape(pres.shapes.LINE, {
        x: x + 0.4, y: y + 2.0, w: cardW - 0.8, h: 0,
        line: { color: C.border, width: 0.5 }
      });

      s.addText(t.sub, {
        x: x + 0.2, y: y + 2.1, w: cardW - 0.4, h: 0.6,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textLight, align: "center", valign: "top", margin: 0
      });

      s.addText(t.desc, {
        x: x + 0.15, y: y + 2.8, w: cardW - 0.3, h: 0.5,
        fontSize: F.size.label, fontFace: F.sans, italic: true,
        color: C.textMuted, align: "center", valign: "top", margin: 0
      });
    });
  }

  // ============================================================
  // SLIDE 4: 3 SKILLS (3-card)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "AI時代に必要な3つのスキル");
    addFooter(s, 4, T, pres);

    const skills = [
      { ic: ic.comments, label: "問いを立てる力", sub: "AIに正しい質問をする\n何を聞くかで結果が変わる", color: C.accent, bgColor: C.accentLight },
      { ic: ic.target, label: "判断力", sub: "AIの回答を評価し\n使うか使わないか決める", color: C.green, bgColor: C.greenBg },
      { ic: ic.bulb, label: "創造力", sub: "AIが生み出せない\n独自のアイデアを創る", color: C.amber, bgColor: C.amberBg },
    ];

    const cardW = 2.55;
    const cardGap = 0.3;
    const totalW = cardW * 3 + cardGap * 2;
    const startX = (L.W - totalW) / 2;

    skills.forEach((t, i) => {
      const x = startX + i * (cardW + cardGap);
      const y = 1.15;
      const h = 3.5;

      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h,
        fill: { color: C.white },
        line: { color: C.border, width: 0.75 }
      });

      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 0.06, fill: { color: t.color }
      });

      s.addShape(pres.shapes.OVAL, {
        x: x + (cardW - 0.7) / 2, y: y + 0.4, w: 0.7, h: 0.7,
        fill: { color: t.bgColor }
      });
      s.addImage({ data: t.ic, x: x + (cardW - 0.4) / 2, y: y + 0.55, w: 0.4, h: 0.4 });

      s.addText(t.label, {
        x, y: y + 1.35, w: cardW, h: 0.5,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, align: "center", margin: 0
      });

      s.addShape(pres.shapes.LINE, {
        x: x + 0.4, y: y + 2.0, w: cardW - 0.8, h: 0,
        line: { color: C.border, width: 0.5 }
      });

      s.addText(t.sub, {
        x: x + 0.2, y: y + 2.15, w: cardW - 0.4, h: 0.8,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textLight, align: "center", valign: "top", margin: 0
      });
    });
  }

  // ============================================================
  // SLIDE 5: 職種の変化トレンド
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);

    // Tag
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.35, w: 1.8, h: 0.28,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    s.addText("キャリア視点 01", {
      x: L.mx, y: 0.35, w: 1.8, h: 0.28,
      fontSize: F.size.tag, fontFace: F.sans, bold: true,
      color: C.accent, align: "center", valign: "middle"
    });

    // Title
    s.addText("職種の変化トレンド", {
      x: L.mx, y: 0.7, w: 8, h: 0.5,
      fontSize: F.size.h1, fontFace: F.sans, bold: true,
      color: C.textDark, margin: 0
    });

    const categories = [
      { label: "縮小する役割", items: ["単純データ入力", "定型レポート作成", "一次翻訳"], color: C.red, bgColor: C.redBg },
      { label: "拡張する役割", items: ["データアナリスト", "コンサルタント", "PM"], color: C.accent, bgColor: C.accentLight },
      { label: "新しく生まれる役割", items: ["プロンプトエンジニア", "AI倫理監査", "AI導入コンサルタント"], color: C.green, bgColor: C.greenBg },
    ];

    const cardW = 2.55;
    const cardGap = 0.3;
    const totalW = cardW * 3 + cardGap * 2;
    const startX = (L.W - totalW) / 2;
    const cardY = 1.4;
    const cardH = 3.0;

    categories.forEach((cat, i) => {
      const x = startX + i * (cardW + cardGap);

      s.addShape(pres.shapes.RECTANGLE, {
        x, y: cardY, w: cardW, h: cardH,
        fill: { color: C.white }, line: { color: C.border, width: 0.75 }
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: cardY, w: cardW, h: 0.06, fill: { color: cat.color }
      });

      s.addShape(pres.shapes.RECTANGLE, {
        x: x + 0.3, y: cardY + 0.3, w: cardW - 0.6, h: 0.4,
        fill: { color: cat.bgColor }, rectRadius: 0.05
      });
      s.addText(cat.label, {
        x: x + 0.3, y: cardY + 0.3, w: cardW - 0.6, h: 0.4,
        fontSize: F.size.label, fontFace: F.sans, bold: true,
        color: cat.color, align: "center", valign: "middle"
      });

      s.addShape(pres.shapes.LINE, {
        x: x + 0.4, y: cardY + 0.95, w: cardW - 0.8, h: 0,
        line: { color: C.border, width: 0.5 }
      });

      cat.items.forEach((item, j) => {
        s.addText("・" + item, {
          x: x + 0.3, y: cardY + 1.15 + j * 0.45, w: cardW - 0.6, h: 0.4,
          fontSize: F.size.body, fontFace: F.sans,
          color: C.textBody, valign: "middle", margin: 0
        });
      });
    });

    addFooter(s, 5, T, pres);
  }

  // ============================================================
  // SLIDE 6: AI時代に価値が上がるスキル・下がるスキル
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);

    // Tag
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.35, w: 1.8, h: 0.28,
      fill: { color: C.greenBg }, rectRadius: 0.05
    });
    s.addText("キャリア視点 02", {
      x: L.mx, y: 0.35, w: 1.8, h: 0.28,
      fontSize: F.size.tag, fontFace: F.sans, bold: true,
      color: C.green, align: "center", valign: "middle"
    });

    // Title
    s.addText("AI時代に価値が上がるスキル・下がるスキル", {
      x: L.mx, y: 0.7, w: 8.5, h: 0.5,
      fontSize: F.size.h1, fontFace: F.sans, bold: true,
      color: C.textDark, margin: 0
    });

    const colW = 3.8;
    const colGap = 0.5;
    const colStartX = (L.W - colW * 2 - colGap) / 2;
    const colY = 1.4;
    const colH = 3.2;

    // 価値が上がる column
    const upX = colStartX;
    s.addShape(pres.shapes.RECTANGLE, {
      x: upX, y: colY, w: colW, h: colH,
      fill: { color: C.white }, line: { color: C.green, width: 1 }
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: upX, y: colY, w: colW, h: 0.06, fill: { color: C.green }
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: upX + 0.3, y: colY + 0.25, w: colW - 0.6, h: 0.4,
      fill: { color: C.greenBg }, rectRadius: 0.05
    });
    s.addText("価値が上がる", {
      x: upX + 0.3, y: colY + 0.25, w: colW - 0.6, h: 0.4,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.green, align: "center", valign: "middle"
    });

    const upItems = ["課題設定力", "異分野を繋ぐ力", "対人コミュニケーション", "倫理的判断力"];
    upItems.forEach((item, i) => {
      s.addImage({ data: ic.check, x: upX + 0.3, y: colY + 0.95 + i * 0.5, w: 0.22, h: 0.22 });
      s.addText(item, {
        x: upX + 0.65, y: colY + 0.9 + i * 0.5, w: colW - 1.0, h: 0.35,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textDark, valign: "middle", margin: 0
      });
    });

    // 価値が下がる column
    const downX = colStartX + colW + colGap;
    s.addShape(pres.shapes.RECTANGLE, {
      x: downX, y: colY, w: colW, h: colH,
      fill: { color: C.white }, line: { color: C.textMuted, width: 1 }
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: downX, y: colY, w: colW, h: 0.06, fill: { color: C.textMuted }
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: downX + 0.3, y: colY + 0.25, w: colW - 0.6, h: 0.4,
      fill: { color: C.lightGray }, rectRadius: 0.05
    });
    s.addText("価値が下がる", {
      x: downX + 0.3, y: colY + 0.25, w: colW - 0.6, h: 0.4,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.textMuted, align: "center", valign: "middle"
    });

    const downItems = ["定型作業の正確さ", "単純な記憶力", "情報検索速度"];
    downItems.forEach((item, i) => {
      s.addImage({ data: ic.chevron, x: downX + 0.3, y: colY + 0.95 + i * 0.5, w: 0.22, h: 0.22 });
      s.addText(item, {
        x: downX + 0.65, y: colY + 0.9 + i * 0.5, w: colW - 1.0, h: 0.35,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textLight, valign: "middle", margin: 0
      });
    });

    addFooter(s, 6, T, pres);
  }

  // ============================================================
  // SLIDE 7: 代替ではなく協働
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);

    // Tag
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.35, w: 1.8, h: 0.28,
      fill: { color: C.amberBg }, rectRadius: 0.05
    });
    s.addText("キャリア視点 03", {
      x: L.mx, y: 0.35, w: 1.8, h: 0.28,
      fontSize: F.size.tag, fontFace: F.sans, bold: true,
      color: C.amber, align: "center", valign: "middle"
    });

    // Title
    s.addText("代替ではなく協働", {
      x: L.mx, y: 0.7, w: 8, h: 0.5,
      fontSize: F.size.h1, fontFace: F.sans, bold: true,
      color: C.textDark, margin: 0
    });

    const patterns = [
      { num: "1", label: "効率化型", desc: "既存業務の高速化", examples: "事務・経理・CS", color: C.accent, bgColor: C.accentLight },
      { num: "2", label: "高度化型", desc: "専門性の底上げ", examples: "コンサル・エンジニア・マーケ", color: C.green, bgColor: C.greenBg },
      { num: "3", label: "創出型", desc: "新しい職種の誕生", examples: "AI運用・データ倫理・プロンプト設計", color: C.amber, bgColor: C.amberBg },
    ];

    const rowW = L.W - L.mx * 2;
    const rowH = 0.85;
    const rowGap = 0.2;
    const rowStartY = 1.45;

    patterns.forEach((p, i) => {
      const y = rowStartY + i * (rowH + rowGap);

      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: rowW, h: rowH,
        fill: { color: C.white }, line: { color: C.border, width: 0.75 }
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: 0.05, h: rowH, fill: { color: p.color }
      });

      // Number circle
      s.addText(p.num, {
        x: L.mx + 0.3, y: y + (rowH - 0.45) / 2, w: 0.45, h: 0.45,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: p.color }, shape: pres.shapes.OVAL
      });

      // Label
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx + 1.0, y: y + 0.15, w: 1.5, h: 0.35,
        fill: { color: p.bgColor }, rectRadius: 0.05
      });
      s.addText(p.label, {
        x: L.mx + 1.0, y: y + 0.15, w: 1.5, h: 0.35,
        fontSize: F.size.label, fontFace: F.sans, bold: true,
        color: p.color, align: "center", valign: "middle"
      });

      // Description
      s.addText(p.desc, {
        x: L.mx + 2.75, y: y + 0.05, w: 2.8, h: 0.4,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.textDark, valign: "middle", margin: 0
      });

      // Examples
      s.addText(p.examples, {
        x: L.mx + 2.75, y: y + 0.42, w: 4.5, h: 0.35,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textLight, valign: "middle", margin: 0
      });
    });

    addFooter(s, 7, T, pres);
  }

  // ============================================================
  // SLIDE 8: キャリアの分岐点
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);

    // Tag
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.35, w: 1.8, h: 0.28,
      fill: { color: C.redBg }, rectRadius: 0.05
    });
    s.addText("キャリア視点 04", {
      x: L.mx, y: 0.35, w: 1.8, h: 0.28,
      fontSize: F.size.tag, fontFace: F.sans, bold: true,
      color: C.red, align: "center", valign: "middle"
    });

    // Title
    s.addText("キャリアの分岐点", {
      x: L.mx, y: 0.7, w: 8, h: 0.5,
      fontSize: F.size.h1, fontFace: F.sans, bold: true,
      color: C.textDark, margin: 0
    });

    const pathW = 3.8;
    const pathGap = 0.5;
    const pathStartX = (L.W - pathW * 2 - pathGap) / 2;
    const pathY = 1.4;
    const pathH = 2.4;

    // AIを使う側
    const useX = pathStartX;
    s.addShape(pres.shapes.RECTANGLE, {
      x: useX, y: pathY, w: pathW, h: pathH,
      fill: { color: C.white }, line: { color: C.accent, width: 1 }
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: useX, y: pathY, w: pathW, h: 0.06, fill: { color: C.accent }
    });
    s.addImage({ data: ic.rocket, x: useX + (pathW - 0.4) / 2, y: pathY + 0.3, w: 0.4, h: 0.4 });
    s.addText("AIを使う側", {
      x: useX, y: pathY + 0.8, w: pathW, h: 0.4,
      fontSize: F.size.h2, fontFace: F.sans, bold: true,
      color: C.accent, align: "center", margin: 0
    });
    s.addShape(pres.shapes.LINE, {
      x: useX + 0.4, y: pathY + 1.3, w: pathW - 0.8, h: 0,
      line: { color: C.border, width: 0.5 }
    });
    s.addText("AI活用スキルで\n生産性と市場価値UP", {
      x: useX + 0.3, y: pathY + 1.45, w: pathW - 0.6, h: 0.7,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textBody, align: "center", valign: "top", margin: 0
    });

    // AIに使われる側
    const usedX = pathStartX + pathW + pathGap;
    s.addShape(pres.shapes.RECTANGLE, {
      x: usedX, y: pathY, w: pathW, h: pathH,
      fill: { color: C.white }, line: { color: C.textMuted, width: 1 }
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: usedX, y: pathY, w: pathW, h: 0.06, fill: { color: C.textMuted }
    });
    s.addImage({ data: ic.chevron, x: usedX + (pathW - 0.4) / 2, y: pathY + 0.3, w: 0.4, h: 0.4 });
    s.addText("AIに使われる側", {
      x: usedX, y: pathY + 0.8, w: pathW, h: 0.4,
      fontSize: F.size.h2, fontFace: F.sans, bold: true,
      color: C.textMuted, align: "center", margin: 0
    });
    s.addShape(pres.shapes.LINE, {
      x: usedX + 0.4, y: pathY + 1.3, w: pathW - 0.8, h: 0,
      line: { color: C.border, width: 0.5 }
    });
    s.addText("AIの指示通りの作業\n単純労働化リスク", {
      x: usedX + 0.3, y: pathY + 1.45, w: pathW - 0.6, h: 0.7,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textLight, align: "center", valign: "top", margin: 0
    });

    // Bottom message
    const msgY = 4.05;
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: msgY, w: L.W - L.mx * 2, h: 0.5,
      fill: { color: C.amberBg }
    });
    s.addImage({ data: ic.bulb, x: L.mx + 0.2, y: msgY + 0.1, w: 0.28, h: 0.28 });
    s.addText("AIリテラシーは全職種共通の基礎スキルになる", {
      x: L.mx + 0.65, y: msgY, w: 7.5, h: 0.5,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.amber, valign: "middle", margin: 0
    });

    addFooter(s, 8, T, pres);
  }

  // ============================================================
  // SLIDE 9: CASE STUDY - エンジニア・IT部門
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addCaseStudy(s, pres, {
      tag: "変化する仕事 05", tagColor: C.accent, tagBg: C.accentLight,
      title: "エンジニア・IT部門", subtitle: "AI搭載ツールで開発効率を飛躍的に向上",
      beforeItems: ["コードを一行一行手書き", "バグ原因究明に数時間", "ドキュメント作成が後回し"],
      afterItems: ["コード補完・生成", "バグ自動検出・修正提案", "ドキュメント自動生成"],
      afterColor: C.accent,
      humanRole: "アーキテクチャ設計 / 要件定義 / コードレビューと品質管理",
      icons: ic, num: 9, total: T
    });
  }

  // ============================================================
  // SLIDE 10: ACTION PLAN (4-step flow)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "AIキャリア行動計画の立て方");
    addFooter(s, 10, T, pres);

    const steps = [
      { num: "1", label: "棚卸し", desc: "業務を「定型/判断/\n創造」に分類", color: C.accent, bg: C.accentLight },
      { num: "2", label: "AI活用ポイント\n特定", desc: "定型業務から\nAI化を検討", color: C.green, bg: C.greenBg },
      { num: "3", label: "スキルアップ\n計画", desc: "3つのスキルを強化する\n学習計画を作る", color: C.amber, bg: C.amberBg },
      { num: "4", label: "実践と\n振り返り", desc: "週1回AIツールを試し\n効果を記録", color: C.accent, bg: C.accentLight },
    ];

    const stepW = 1.85;
    const stepGap = 0.35;
    const totalW = stepW * 4 + stepGap * 3;
    const startX = (L.W - totalW) / 2;
    const stepY = 1.2;
    const stepH = 2.8;

    steps.forEach((st, i) => {
      const x = startX + i * (stepW + stepGap);

      s.addShape(pres.shapes.RECTANGLE, {
        x, y: stepY, w: stepW, h: stepH,
        fill: { color: C.white },
        line: { color: C.border, width: 0.75 }
      });

      s.addShape(pres.shapes.RECTANGLE, {
        x, y: stepY, w: stepW, h: 0.06, fill: { color: st.color }
      });

      s.addText(st.num, {
        x: x + (stepW - 0.5) / 2, y: stepY + 0.3, w: 0.5, h: 0.5,
        fontSize: F.size.h2, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: st.color }, shape: pres.shapes.OVAL
      });

      s.addText(st.label, {
        x, y: stepY + 1.0, w: stepW, h: 0.55,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, align: "center", margin: 0
      });

      s.addShape(pres.shapes.LINE, {
        x: x + 0.3, y: stepY + 1.65, w: stepW - 0.6, h: 0,
        line: { color: C.border, width: 0.5 }
      });

      s.addText(st.desc, {
        x: x + 0.15, y: stepY + 1.8, w: stepW - 0.3, h: 0.9,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textLight, align: "center", valign: "top", margin: 0
      });

      if (i < 3) {
        s.addImage({ data: ic.chevron, x: x + stepW + 0.06, y: stepY + stepH / 2 - 0.12, w: 0.2, h: 0.2 });
      }
    });

    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.2, w: L.W - L.mx * 2, h: 0.45,
      fill: { color: C.amberBg }
    });
    s.addImage({ data: ic.bulb, x: L.mx + 0.2, y: 4.27, w: 0.28, h: 0.28 });
    s.addText("小さなサイクルを回し続けることがAI時代のキャリアを切り拓く", {
      x: L.mx + 0.65, y: 4.2, w: 7.5, h: 0.45,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.amber, valign: "middle", margin: 0
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
    addFooter(s, 11, T, pres);

    const items = [
      { label: "3つの波", text: "自動化 → 拡張 → 変革。仕事を奪うのではなく質を変える", color: C.accent },
      { label: "3つのスキル", text: "問いを立てる力・判断力・創造力がAI時代の武器", color: C.green },
      { label: "5つの変化", text: "営業・経理・サポート・企画・エンジニア全てでAI活用が進む", color: C.amber },
      { label: "行動計画", text: "棚卸し → AI活用ポイント特定 → スキルアップ → 実践と振り返り", color: C.accent },
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
        x: L.mx + 2.4, y, w: 5.8, h: 0.75,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textDark, valign: "middle", margin: 0
      });
    });
  }

  // ============================================================
  // SLIDE 12: END
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };

    s.addImage({ data: ic.trophy, x: (L.W - 0.6) / 2, y: 0.7, w: 0.6, h: 0.6 });

    s.addText("AIを味方に、キャリアを進化させよう", {
      x: 0.5, y: 1.4, w: 9, h: 0.7,
      fontSize: 30, fontFace: F.sans, bold: true,
      color: C.white, align: "center", margin: 0
    });

    s.addShape(pres.shapes.RECTANGLE, {
      x: 2.0, y: 2.3, w: 6, h: 2.5,
      fill: { color: C.white }, rectRadius: 0.1
    });

    s.addText("確認テスト（5問）", {
      x: 2.0, y: 2.5, w: 6, h: 0.55,
      fontSize: F.size.h2, fontFace: F.sans, bold: true,
      color: C.textDark, align: "center", margin: 0
    });

    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 3.1, w: 3, h: 0,
      line: { color: C.border, width: 0.5 }
    });

    s.addText("80%以上の正答で修了", {
      x: 2.0, y: 3.25, w: 6, h: 0.45,
      fontSize: F.size.h3, fontFace: F.sans,
      color: C.accent, align: "center", margin: 0
    });

    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 3.8, w: 3, h: 0,
      line: { color: C.border, width: 0.5 }
    });

    s.addText("今日から1つ、AIツールを使ってみましょう！", {
      x: 2.0, y: 3.95, w: 6, h: 0.45,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.green, align: "center", margin: 0
    });

    s.addText("お疲れさまでした！", {
      x: 0.5, y: 4.8, w: 9, h: 0.4,
      fontSize: F.size.h3, fontFace: F.sans,
      color: C.accentMid, align: "center", margin: 0
    });
  }

  // Write
  const out = "/Users/kurosakiyuto/Downloads/開発/gorilla-knowledge/黒崎/AI研修一覧/A-110_AIで変わる仕事の未来/スライド.pptx";
  await pres.writeFile({ fileName: out });
  console.log("Generated:", out);
}

main().catch(console.error);
