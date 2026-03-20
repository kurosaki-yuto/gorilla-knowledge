const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const {
  FaUsers, FaRocket, FaBrain, FaHandshake, FaChartLine, FaCogs,
  FaGraduationCap, FaLightbulb, FaCheckCircle, FaArrowRight,
  FaChevronRight, FaBullseye, FaComments, FaFileAlt, FaStar,
  FaSearch, FaDesktop, FaMicrophone, FaShieldAlt, FaTrophy
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
  slide.addText("AI-106", {
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
  pres.title = "AI-106: AIで変わる働き方 — チーム・組織でのAI活用戦略";

  // Pre-render icons
  const ic = {
    users: await icon(FaUsers, C.accent),
    rocket: await icon(FaRocket, C.accent),
    brain: await icon(FaBrain, C.accent),
    handshake: await icon(FaHandshake, C.navyLight),
    chart: await icon(FaChartLine, C.accent),
    cogs: await icon(FaCogs, C.accent),
    grad: await icon(FaGraduationCap, C.accent),
    bulb: await icon(FaLightbulb, C.amber),
    check: await icon(FaCheckCircle, C.green),
    checkBlue: await icon(FaCheckCircle, C.accent),
    arrow: await icon(FaArrowRight, C.accent),
    chevron: await icon(FaChevronRight, C.textMuted),
    target: await icon(FaBullseye, C.accent),
    comments: await icon(FaComments, C.accent),
    file: await icon(FaFileAlt, C.accent),
    star: await icon(FaStar, C.amber),
    search: await icon(FaSearch, C.accent),
    desktop: await icon(FaDesktop, C.green),
    mic: await icon(FaMicrophone, C.amber),
    shield: await icon(FaShieldAlt, C.green),
    trophy: await icon(FaTrophy, C.amber),
    brainAmber: await icon(FaBrain, C.amber),
    brainGreen: await icon(FaBrain, C.green),
    usersNavy: await icon(FaUsers, C.navyLight),
    rocketGreen: await icon(FaRocket, C.green),
    cogsAmber: await icon(FaCogs, C.amber),
  };

  const T = 12; // total slides

  // ============================================================
  // SLIDE 1: TITLE
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };

    s.addImage({ data: ic.users, x: (L.W - 0.7) / 2, y: 1.0, w: 0.7, h: 0.7 });

    s.addText("AIで変わる働き方", {
      x: 0.5, y: 1.9, w: 9, h: 0.9,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center", margin: 0
    });

    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 2.95, w: 3, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });

    s.addText("チーム・組織でのAI活用戦略", {
      x: 0.5, y: 3.15, w: 9, h: 0.5,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", margin: 0
    });

    s.addText("AI-106   |   全社員向け（AI-101修了者）   |   10分", {
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
      "AI時代に求められる3つのスキル（質問力・判断力・創造力）を説明できる",
      "チームでのAI活用事例と導入ステップを理解できる",
      "今後のAIトレンド（エージェント・マルチモーダル等）をイメージできる",
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
  // SLIDE 3: AI vs HUMAN ROLES (2-column comparison)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "AIと人間の役割分担", pres);
    addFooter(s, 3, T, pres);

    const colW = 3.8;
    const colY = 1.2;
    const colH = 3.2;
    const lx = L.mx;
    const rx = L.W - L.mx - colW;

    // AI column
    s.addShape(pres.shapes.RECTANGLE, {
      x: lx, y: colY, w: colW, h: colH,
      fill: { color: C.offWhite }, line: { color: C.border, width: 0.5 }
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: lx, y: colY, w: colW, h: 0.06, fill: { color: C.accent }
    });
    s.addImage({ data: ic.cogs, x: lx + 0.3, y: colY + 0.25, w: 0.35, h: 0.35 });
    s.addText("AIが得意なこと", {
      x: lx + 0.75, y: colY + 0.2, w: 2.8, h: 0.45,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", margin: 0
    });

    const aiItems = [
      "大量データの高速処理",
      "パターン認識・分類",
      "定型作業の自動化",
      "24時間・365日稼働",
    ];
    aiItems.forEach((item, i) => {
      s.addImage({ data: ic.checkBlue, x: lx + 0.3, y: colY + 0.85 + i * 0.55, w: 0.22, h: 0.22 });
      s.addText(item, {
        x: lx + 0.65, y: colY + 0.78 + i * 0.55, w: 2.9, h: 0.4,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, valign: "middle", margin: 0
      });
    });

    // Human column
    s.addShape(pres.shapes.RECTANGLE, {
      x: rx, y: colY, w: colW, h: colH,
      fill: { color: C.offWhite }, line: { color: C.border, width: 0.5 }
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: rx, y: colY, w: colW, h: 0.06, fill: { color: C.green }
    });
    s.addImage({ data: ic.usersNavy, x: rx + 0.3, y: colY + 0.25, w: 0.35, h: 0.35 });
    s.addText("人間が得意なこと", {
      x: rx + 0.75, y: colY + 0.2, w: 2.8, h: 0.45,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.green, valign: "middle", margin: 0
    });

    const humanItems = [
      "文脈の理解と共感",
      "創造的な判断",
      "倫理的な意思決定",
      "信頼関係の構築",
    ];
    humanItems.forEach((item, i) => {
      s.addImage({ data: ic.check, x: rx + 0.3, y: colY + 0.85 + i * 0.55, w: 0.22, h: 0.22 });
      s.addText(item, {
        x: rx + 0.65, y: colY + 0.78 + i * 0.55, w: 2.9, h: 0.4,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, valign: "middle", margin: 0
      });
    });

    // Arrow between columns
    s.addImage({ data: ic.arrow, x: lx + colW + 0.3, y: colY + colH / 2 - 0.25, w: 0.5, h: 0.5 });

    // Bottom insight
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.55, w: L.W - L.mx * 2, h: 0.55, fill: { color: C.navy }
    });
    s.addText([
      { text: "「奪われる」ではなく ", options: { color: C.accentMid } },
      { text: "「役割分担する」", options: { color: C.white, bold: true } },
      { text: " がこれからの働き方", options: { color: C.accentMid } },
    ], {
      x: L.mx + 0.3, y: 4.55, w: L.W - L.mx * 2 - 0.6, h: 0.55,
      fontSize: F.size.body, fontFace: F.sans,
      align: "center", valign: "middle"
    });
  }

  // ============================================================
  // SLIDE 4: 3 SKILLS (3-card layout)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "AI時代に求められる3つのスキル", pres);
    addFooter(s, 4, T, pres);

    const skills = [
      { ic: ic.comments, label: "質問力", sub: "的確な指示で\nAIの力を引き出す", color: C.accent, bgColor: C.accentLight },
      { ic: ic.target, label: "判断力", sub: "AIの出力を評価し\n正しく使う", color: C.green, bgColor: C.greenBg },
      { ic: ic.bulb, label: "創造力", sub: "AIにできない\n発想・企画を生む", color: C.amber, bgColor: C.amberBg },
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
  // SLIDE 5: CASE STUDY 1 - Sales Team
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);

    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.35, w: 1.0, h: 0.28,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    s.addText("事例 01", {
      x: L.mx, y: 0.35, w: 1.0, h: 0.28,
      fontSize: F.size.tag, fontFace: F.sans, bold: true,
      color: C.accent, align: "center", valign: "middle"
    });
    s.addText("営業チームでのAI活用", {
      x: L.mx, y: 0.7, w: 8, h: 0.5,
      fontSize: F.size.h1, fontFace: F.sans, bold: true,
      color: C.textDark, margin: 0
    });
    s.addText("提案書自動生成 → 人間がカスタマイズ", {
      x: L.mx, y: 1.2, w: 8, h: 0.3,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textLight, margin: 0
    });
    addFooter(s, 5, T, pres);

    // Flow: AI generates → Human customizes
    const flowY = 1.8;
    const boxW = 3.5;
    const boxH = 1.5;

    // AI box
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: flowY, w: boxW, h: boxH,
      fill: { color: C.accentLight }, line: { color: C.accent, width: 0.5 }
    });
    s.addImage({ data: ic.cogs, x: L.mx + 0.3, y: flowY + 0.2, w: 0.35, h: 0.35 });
    s.addText("AI", {
      x: L.mx + 0.75, y: flowY + 0.15, w: 2.5, h: 0.4,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", margin: 0
    });
    s.addText("過去の提案書・製品情報から\nたたき台を自動生成", {
      x: L.mx + 0.3, y: flowY + 0.65, w: boxW - 0.6, h: 0.7,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textBody, valign: "top", margin: 0
    });

    // Arrow
    s.addImage({ data: ic.arrow, x: L.mx + boxW + 0.35, y: flowY + boxH / 2 - 0.2, w: 0.4, h: 0.4 });

    // Human box
    const rx = L.mx + boxW + 1.1;
    s.addShape(pres.shapes.RECTANGLE, {
      x: rx, y: flowY, w: boxW, h: boxH,
      fill: { color: C.greenBg }, line: { color: C.green, width: 0.5 }
    });
    s.addImage({ data: ic.usersNavy, x: rx + 0.3, y: flowY + 0.2, w: 0.35, h: 0.35 });
    s.addText("人間", {
      x: rx + 0.75, y: flowY + 0.15, w: 2.5, h: 0.4,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.green, valign: "middle", margin: 0
    });
    s.addText("顧客の課題に合わせて\n内容をカスタマイズ", {
      x: rx + 0.3, y: flowY + 0.65, w: boxW - 0.6, h: 0.7,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textBody, valign: "top", margin: 0
    });

    // Results
    const resY = 3.65;
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: resY, w: 4.0, h: 0.55, fill: { color: C.greenBg }
    });
    s.addImage({ data: ic.check, x: L.mx + 0.15, y: resY + 0.1, w: 0.3, h: 0.3 });
    s.addText("提案書作成時間 50%短縮", {
      x: L.mx + 0.6, y: resY, w: 3.2, h: 0.55,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.green, valign: "middle", margin: 0
    });

    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx + 4.5, y: resY, w: 4.0, h: 0.55, fill: { color: C.greenBg }
    });
    s.addImage({ data: ic.check, x: L.mx + 4.65, y: resY + 0.1, w: 0.3, h: 0.3 });
    s.addText("顧客対応件数 1.5倍に", {
      x: L.mx + 5.1, y: resY, w: 3.2, h: 0.55,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.green, valign: "middle", margin: 0
    });
  }

  // ============================================================
  // SLIDE 6: CASE STUDY 2 - Admin Department
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);

    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.35, w: 1.0, h: 0.28,
      fill: { color: C.greenBg }, rectRadius: 0.05
    });
    s.addText("事例 02", {
      x: L.mx, y: 0.35, w: 1.0, h: 0.28,
      fontSize: F.size.tag, fontFace: F.sans, bold: true,
      color: C.green, align: "center", valign: "middle"
    });
    s.addText("管理部門でのAI活用", {
      x: L.mx, y: 0.7, w: 8, h: 0.5,
      fontSize: F.size.h1, fontFace: F.sans, bold: true,
      color: C.textDark, margin: 0
    });
    s.addText("経費精算・報告書の自動化", {
      x: L.mx, y: 1.2, w: 8, h: 0.3,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textLight, margin: 0
    });
    addFooter(s, 6, T, pres);

    // Flow
    const flowY = 1.8;
    const boxW = 3.5;
    const boxH = 1.5;

    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: flowY, w: boxW, h: boxH,
      fill: { color: C.accentLight }, line: { color: C.accent, width: 0.5 }
    });
    s.addImage({ data: ic.cogs, x: L.mx + 0.3, y: flowY + 0.2, w: 0.35, h: 0.35 });
    s.addText("AI", {
      x: L.mx + 0.75, y: flowY + 0.15, w: 2.5, h: 0.4,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", margin: 0
    });
    s.addText("経費データ自動分類\n異常値検知・報告書下書き", {
      x: L.mx + 0.3, y: flowY + 0.65, w: boxW - 0.6, h: 0.7,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textBody, valign: "top", margin: 0
    });

    s.addImage({ data: ic.arrow, x: L.mx + boxW + 0.35, y: flowY + boxH / 2 - 0.2, w: 0.4, h: 0.4 });

    const rx = L.mx + boxW + 1.1;
    s.addShape(pres.shapes.RECTANGLE, {
      x: rx, y: flowY, w: boxW, h: boxH,
      fill: { color: C.greenBg }, line: { color: C.green, width: 0.5 }
    });
    s.addImage({ data: ic.usersNavy, x: rx + 0.3, y: flowY + 0.2, w: 0.35, h: 0.35 });
    s.addText("人間", {
      x: rx + 0.75, y: flowY + 0.15, w: 2.5, h: 0.4,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.green, valign: "middle", margin: 0
    });
    s.addText("最終確認と承認\n分析・改善提案に集中", {
      x: rx + 0.3, y: flowY + 0.65, w: boxW - 0.6, h: 0.7,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textBody, valign: "top", margin: 0
    });

    const resY = 3.65;
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: resY, w: 4.0, h: 0.55, fill: { color: C.greenBg }
    });
    s.addImage({ data: ic.check, x: L.mx + 0.15, y: resY + 0.1, w: 0.3, h: 0.3 });
    s.addText("月次処理時間 60%削減", {
      x: L.mx + 0.6, y: resY, w: 3.2, h: 0.55,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.green, valign: "middle", margin: 0
    });

    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx + 4.5, y: resY, w: 4.0, h: 0.55, fill: { color: C.greenBg }
    });
    s.addImage({ data: ic.check, x: L.mx + 4.65, y: resY + 0.1, w: 0.3, h: 0.3 });
    s.addText("入力ミス ほぼゼロに", {
      x: L.mx + 5.1, y: resY, w: 3.2, h: 0.55,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.green, valign: "middle", margin: 0
    });
  }

  // ============================================================
  // SLIDE 7: CASE STUDY 3 - Planning Department
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);

    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.35, w: 1.0, h: 0.28,
      fill: { color: C.amberBg }, rectRadius: 0.05
    });
    s.addText("事例 03", {
      x: L.mx, y: 0.35, w: 1.0, h: 0.28,
      fontSize: F.size.tag, fontFace: F.sans, bold: true,
      color: C.amber, align: "center", valign: "middle"
    });
    s.addText("企画部門でのAI活用", {
      x: L.mx, y: 0.7, w: 8, h: 0.5,
      fontSize: F.size.h1, fontFace: F.sans, bold: true,
      color: C.textDark, margin: 0
    });
    s.addText("マーケティング分析・コンテンツ生成", {
      x: L.mx, y: 1.2, w: 8, h: 0.3,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textLight, margin: 0
    });
    addFooter(s, 7, T, pres);

    const flowY = 1.8;
    const boxW = 3.5;
    const boxH = 1.5;

    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: flowY, w: boxW, h: boxH,
      fill: { color: C.accentLight }, line: { color: C.accent, width: 0.5 }
    });
    s.addImage({ data: ic.cogs, x: L.mx + 0.3, y: flowY + 0.2, w: 0.35, h: 0.35 });
    s.addText("AI", {
      x: L.mx + 0.75, y: flowY + 0.15, w: 2.5, h: 0.4,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", margin: 0
    });
    s.addText("市場データ分析\nトレンド抽出・文案下書き", {
      x: L.mx + 0.3, y: flowY + 0.65, w: boxW - 0.6, h: 0.7,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textBody, valign: "top", margin: 0
    });

    s.addImage({ data: ic.arrow, x: L.mx + boxW + 0.35, y: flowY + boxH / 2 - 0.2, w: 0.4, h: 0.4 });

    const rx = L.mx + boxW + 1.1;
    s.addShape(pres.shapes.RECTANGLE, {
      x: rx, y: flowY, w: boxW, h: boxH,
      fill: { color: C.greenBg }, line: { color: C.green, width: 0.5 }
    });
    s.addImage({ data: ic.usersNavy, x: rx + 0.3, y: flowY + 0.2, w: 0.35, h: 0.35 });
    s.addText("人間", {
      x: rx + 0.75, y: flowY + 0.15, w: 2.5, h: 0.4,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.green, valign: "middle", margin: 0
    });
    s.addText("戦略立案\nクリエイティブの最終仕上げ", {
      x: rx + 0.3, y: flowY + 0.65, w: boxW - 0.6, h: 0.7,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textBody, valign: "top", margin: 0
    });

    const resY = 3.65;
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: resY, w: 4.0, h: 0.55, fill: { color: C.greenBg }
    });
    s.addImage({ data: ic.check, x: L.mx + 0.15, y: resY + 0.1, w: 0.3, h: 0.3 });
    s.addText("リサーチ工数 70%削減", {
      x: L.mx + 0.6, y: resY, w: 3.2, h: 0.55,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.green, valign: "middle", margin: 0
    });

    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx + 4.5, y: resY, w: 4.0, h: 0.55, fill: { color: C.greenBg }
    });
    s.addImage({ data: ic.check, x: L.mx + 4.65, y: resY + 0.1, w: 0.3, h: 0.3 });
    s.addText("施策スピード 2倍に", {
      x: L.mx + 5.1, y: resY, w: 3.2, h: 0.55,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.green, valign: "middle", margin: 0
    });
  }

  // ============================================================
  // SLIDE 8: 4 STEPS FOR AI ADOPTION (Flow diagram)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "AI導入の4ステップ", pres);
    addFooter(s, 8, T, pres);

    const steps = [
      { num: "1", label: "課題特定", desc: "「何に時間がかかるか」\nをリストアップ", color: C.accent, bg: C.accentLight },
      { num: "2", label: "ツール選定", desc: "課題に合ったAIツールを\n選ぶ（セキュリティも確認）", color: C.green, bg: C.greenBg },
      { num: "3", label: "小さく試す", desc: "1チーム・1業務で\nトライアル実施", color: C.amber, bg: C.amberBg },
      { num: "4", label: "展開", desc: "知見をマニュアル化\n他チームに広げる", color: C.accent, bg: C.accentLight },
    ];

    const stepW = 1.85;
    const stepGap = 0.35;
    const totalW = stepW * 4 + stepGap * 3;
    const startX = (L.W - totalW) / 2;
    const stepY = 1.2;
    const stepH = 2.8;

    steps.forEach((st, i) => {
      const x = startX + i * (stepW + stepGap);

      // Card
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: stepY, w: stepW, h: stepH,
        fill: { color: C.white },
        line: { color: C.border, width: 0.75 }
      });

      // Top color band
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: stepY, w: stepW, h: 0.06, fill: { color: st.color }
      });

      // Number circle
      s.addText(st.num, {
        x: x + (stepW - 0.5) / 2, y: stepY + 0.3, w: 0.5, h: 0.5,
        fontSize: F.size.h2, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: st.color }, shape: pres.shapes.OVAL
      });

      // Label
      s.addText(st.label, {
        x, y: stepY + 1.0, w: stepW, h: 0.45,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, align: "center", margin: 0
      });

      // Divider
      s.addShape(pres.shapes.LINE, {
        x: x + 0.3, y: stepY + 1.55, w: stepW - 0.6, h: 0,
        line: { color: C.border, width: 0.5 }
      });

      // Description
      s.addText(st.desc, {
        x: x + 0.15, y: stepY + 1.7, w: stepW - 0.3, h: 0.9,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textLight, align: "center", valign: "top", margin: 0
      });

      // Arrow between steps
      if (i < 3) {
        s.addImage({ data: ic.chevron, x: x + stepW + 0.06, y: stepY + stepH / 2 - 0.12, w: 0.2, h: 0.2 });
      }
    });

    // Bottom insight
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.2, w: L.W - L.mx * 2, h: 0.45,
      fill: { color: C.accentLight }
    });
    s.addImage({ data: ic.bulb, x: L.mx + 0.2, y: 4.27, w: 0.28, h: 0.28 });
    s.addText("「小さく始めて、大きく広げる」が成功の秘訣", {
      x: L.mx + 0.65, y: 4.2, w: 7.5, h: 0.45,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", margin: 0
    });
  }

  // ============================================================
  // SLIDE 9: AI TRENDS 2025-2026 (3-card)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "AIトレンド 2025-2026", pres);
    addFooter(s, 9, T, pres);

    const trends = [
      { ic: ic.rocket, label: "AIエージェント", sub: "複数のタスクを\n自律的にこなすAI", desc: "会議設定→案内メール→資料準備を一括実行", color: C.accent, bgColor: C.accentLight },
      { ic: ic.mic, label: "マルチモーダルAI", sub: "テキスト・画像・音声を\n統合的に扱えるAI", desc: "写真を見せて「要約して」が可能に", color: C.amber, bgColor: C.amberBg },
      { ic: ic.shield, label: "ローカルAI", sub: "社内環境で動かせる\n小型AI", desc: "機密データを外に出さずにAI活用", color: C.green, bgColor: C.greenBg },
    ];

    const cardW = 2.55;
    const cardGap = 0.3;
    const totalW = cardW * 3 + cardGap * 2;
    const startX = (L.W - totalW) / 2;

    trends.forEach((t, i) => {
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

      s.addShape(pres.shapes.OVAL, {
        x: x + (cardW - 0.7) / 2, y: y + 0.3, w: 0.7, h: 0.7,
        fill: { color: t.bgColor }
      });
      s.addImage({ data: t.ic, x: x + (cardW - 0.4) / 2, y: y + 0.45, w: 0.4, h: 0.4 });

      s.addText(t.label, {
        x, y: y + 1.2, w: cardW, h: 0.45,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, align: "center", margin: 0
      });

      s.addText(t.sub, {
        x: x + 0.15, y: y + 1.7, w: cardW - 0.3, h: 0.7,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, align: "center", valign: "top", margin: 0
      });

      s.addShape(pres.shapes.LINE, {
        x: x + 0.3, y: y + 2.5, w: cardW - 0.6, h: 0,
        line: { color: C.border, width: 0.5 }
      });

      s.addText(t.desc, {
        x: x + 0.15, y: y + 2.65, w: cardW - 0.3, h: 0.6,
        fontSize: F.size.label, fontFace: F.sans, italic: true,
        color: C.textLight, align: "center", valign: "top", margin: 0
      });
    });
  }

  // ============================================================
  // SLIDE 10: CONTINUOUS LEARNING
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "学び続ける3つの方法", pres);
    addFooter(s, 10, T, pres);

    const methods = [
      { icon: ic.desktop, num: "1", title: "日常業務でAIを使ってみる", desc: "メールの下書き、議事録の整理、ちょっとした調べ物。毎日1回でもAIを使う習慣をつけましょう。", color: C.accent, bg: C.accentLight },
      { icon: ic.search, num: "2", title: "AI関連ニュースをキャッチアップ", desc: "新しいツールや機能は次々に登場します。週に一度でもAI関連の記事に目を通しておくと差がつきます。", color: C.amber, bg: C.amberBg },
      { icon: ic.users, num: "3", title: "社内共有会で知見を共有する", desc: "自分の便利な使い方をシェアし、他の人のアイデアをもらう。チーム全体のAIスキルが底上げされます。", color: C.green, bg: C.greenBg },
    ];

    methods.forEach((m, i) => {
      const y = 1.2 + i * 1.15;

      // Left accent bar
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: 0.05, h: 0.95, fill: { color: m.color }
      });

      // Icon circle
      s.addShape(pres.shapes.OVAL, {
        x: L.mx + 0.3, y: y + 0.15, w: 0.6, h: 0.6,
        fill: { color: m.bg }
      });
      s.addImage({ data: m.icon, x: L.mx + 0.4, y: y + 0.25, w: 0.4, h: 0.4 });

      // Title
      s.addText(m.title, {
        x: L.mx + 1.2, y: y + 0.05, w: 7, h: 0.4,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, valign: "middle", margin: 0
      });
      // Description
      s.addText(m.desc, {
        x: L.mx + 1.2, y: y + 0.5, w: 7, h: 0.4,
        fontSize: F.size.label, fontFace: F.sans,
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
    addSectionTitle(s, "まとめ", pres);
    addFooter(s, 11, T, pres);

    const items = [
      { label: "役割分担", text: "AIが得意なことはAIに、人間は人間にしかできないことに集中", color: C.accent },
      { label: "3つのスキル", text: "質問力・判断力・創造力を磨く", color: C.green },
      { label: "導入ステップ", text: "課題特定 → ツール選定 → 小さく試す → 展開", color: C.amber },
      { label: "未来のトレンド", text: "AIエージェント / マルチモーダル / ローカルAIが進化中", color: C.accent },
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
  // SLIDE 12: END (Series completion)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };

    s.addImage({ data: ic.trophy, x: (L.W - 0.6) / 2, y: 0.7, w: 0.6, h: 0.6 });

    s.addText("AI研修シリーズ 全6コース修了！", {
      x: 0.5, y: 1.4, w: 9, h: 0.7,
      fontSize: 30, fontFace: F.sans, bold: true,
      color: C.white, align: "center", margin: 0
    });

    // CTA box
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

    s.addText("学んだことを明日から実践しましょう！", {
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
  const out = "/Users/kurosakiyuto/Downloads/開発/gorilla-knowledge/黒崎/AI研修一覧/AI-106_AIで変わる働き方/スライド.pptx";
  await pres.writeFile({ fileName: out });
  console.log("Generated:", out);
}

main().catch(console.error);
