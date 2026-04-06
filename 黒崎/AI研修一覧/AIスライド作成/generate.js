const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const {
  FaRocket, FaBolt, FaBrain, FaMagic,
  FaClipboardList, FaPaintBrush, FaLink, FaGlobe,
  FaPencilAlt, FaLaptopCode, FaUsers, FaClock,
  FaCheckCircle, FaArrowRight, FaLightbulb, FaFileAlt,
  FaChartBar, FaComments, FaQuestion, FaStar
} = require("react-icons/fa");

// --- Helpers ---
function renderIconSvg(IconComponent, color = "#000000", size = 256) {
  return ReactDOMServer.renderToStaticMarkup(
    React.createElement(IconComponent, { color, size: String(size) })
  );
}

async function iconToBase64Png(IconComponent, color, size = 256) {
  const svg = renderIconSvg(IconComponent, color, size);
  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + pngBuffer.toString("base64");
}

// --- Color Palette: Midnight Executive ---
const C = {
  navy:     "1E2761",
  deepNavy: "0D1B3E",
  midBlue:  "3B5998",
  ice:      "CADCFC",
  lightIce: "E8EEFB",
  white:    "FFFFFF",
  accent:   "4A90D9",
  accentBright: "5BA3F5",
  gray:     "8899AA",
  darkText: "1A1A2E",
  lightGray: "F4F6FA",
};

const makeShadow = () => ({ type: "outer", blur: 8, offset: 3, angle: 135, color: "000000", opacity: 0.18 });

async function main() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "AI研修講座";
  pres.title = "AIプレゼン&資料作成でクライアント提案を加速する";

  // Pre-render icons
  const icons = {};
  const iconList = [
    ["rocket", FaRocket, C.accentBright],
    ["bolt", FaBolt, C.accent],
    ["brain", FaBrain, C.white],
    ["magic", FaMagic, C.accentBright],
    ["clipboard", FaClipboardList, C.white],
    ["paint", FaPaintBrush, C.accentBright],
    ["link", FaLink, C.white],
    ["globe", FaGlobe, C.accentBright],
    ["pencil", FaPencilAlt, C.white],
    ["laptop", FaLaptopCode, C.accentBright],
    ["users", FaUsers, C.white],
    ["clock", FaClock, C.accentBright],
    ["check", FaCheckCircle, C.accentBright],
    ["arrow", FaArrowRight, C.white],
    ["bulb", FaLightbulb, C.accentBright],
    ["file", FaFileAlt, C.white],
    ["chart", FaChartBar, C.accentBright],
    ["comments", FaComments, C.white],
    ["question", FaQuestion, C.accentBright],
    ["star", FaStar, C.accentBright],
    ["checkWhite", FaCheckCircle, C.white],
    ["rocketNavy", FaRocket, C.navy],
    ["boltNavy", FaBolt, C.navy],
    ["brainAccent", FaBrain, C.accentBright],
    ["clockNavy", FaClock, C.navy],
    ["arrowAccent", FaArrowRight, C.accentBright],
    ["starWhite", FaStar, C.white],
    ["bulbWhite", FaLightbulb, C.white],
  ];
  for (const [name, comp, color] of iconList) {
    icons[name] = await iconToBase64Png(comp, `#${color}`);
  }

  // ============================================================
  // SLIDE 1: Title Slide
  // ============================================================
  let slide = pres.addSlide();
  slide.background = { color: C.deepNavy };

  // Subtle decorative shapes
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accentBright }
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.565, w: 10, h: 0.06, fill: { color: C.accentBright }
  });

  // Decorative circle
  slide.addShape(pres.shapes.OVAL, {
    x: 7.8, y: 0.3, w: 2.5, h: 2.5, fill: { color: C.navy, transparency: 50 }
  });
  slide.addShape(pres.shapes.OVAL, {
    x: 8.3, y: 0.6, w: 1.8, h: 1.8, fill: { color: C.midBlue, transparency: 60 }
  });

  slide.addImage({ data: icons.rocket, x: 8.7, y: 1.0, w: 0.9, h: 0.9 });

  slide.addText("Pack 6  |  Lecture 9", {
    x: 0.8, y: 1.0, w: 6, h: 0.5,
    fontSize: 14, fontFace: "Calibri", color: C.accent,
    charSpacing: 4, bold: true, margin: 0
  });

  slide.addText("AIプレゼン&資料作成で\nクライアント提案を加速する", {
    x: 0.8, y: 1.6, w: 7, h: 2.0,
    fontSize: 36, fontFace: "Calibri", color: C.white,
    bold: true, lineSpacingMultiple: 1.2, margin: 0
  });

  slide.addText("Claudeで内容を設計し、Gammaでスライド化する。\nこの2ステップで提案資料を完成させる。", {
    x: 0.8, y: 3.7, w: 7, h: 0.9,
    fontSize: 16, fontFace: "Calibri", color: C.white,
    lineSpacingMultiple: 1.5, margin: 0
  });

  // ============================================================
  // SLIDE 2: Agenda
  // ============================================================
  slide = pres.addSlide();
  slide.background = { color: C.white };

  // Top accent bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.navy }
  });

  slide.addText("AGENDA", {
    x: 0.8, y: 0.35, w: 3, h: 0.5,
    fontSize: 12, fontFace: "Calibri", color: C.accent,
    charSpacing: 6, bold: true, margin: 0
  });
  slide.addText("この講義の流れ", {
    x: 0.8, y: 0.7, w: 6, h: 0.6,
    fontSize: 28, fontFace: "Calibri", color: C.darkText, bold: true, margin: 0
  });

  const agendaItems = [
    { num: "01", title: "なぜAIで資料を作るのか", sub: "PowerPointとの違い", icon: "bolt" },
    { num: "02", title: "Gammaの基本", sub: "プロンプトからスライドを生成", icon: "magic" },
    { num: "03", title: "Claude + Gamma連携", sub: "内容設計からビジュアル化まで", icon: "link" },
    { num: "04", title: "実践ハンズオン", sub: "自分の業務テーマで資料作成", icon: "laptop" },
    { num: "05", title: "まとめ + 宿題", sub: "Zone C総整理と振り返り", icon: "star" },
  ];

  agendaItems.forEach((item, i) => {
    const yBase = 1.55 + i * 0.78;
    // Card background
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.8, y: yBase, w: 8.4, h: 0.65,
      fill: { color: i % 2 === 0 ? C.lightIce : C.white },
      shadow: makeShadow()
    });
    // Number
    slide.addText(item.num, {
      x: 0.95, y: yBase, w: 0.6, h: 0.65,
      fontSize: 20, fontFace: "Calibri", color: C.accent,
      bold: true, valign: "middle", margin: 0
    });
    // Title
    slide.addText(item.title, {
      x: 1.7, y: yBase + 0.05, w: 4.5, h: 0.35,
      fontSize: 16, fontFace: "Calibri", color: C.darkText,
      bold: true, margin: 0
    });
    // Subtitle
    slide.addText(item.sub, {
      x: 1.7, y: yBase + 0.35, w: 4.5, h: 0.25,
      fontSize: 11, fontFace: "Calibri", color: C.gray, margin: 0
    });
    // Icon
    slide.addImage({ data: icons[item.icon], x: 8.3, y: yBase + 0.12, w: 0.4, h: 0.4 });
  });

  // ============================================================
  // SLIDE 3: Part 1 - Why AI?
  // ============================================================
  slide = pres.addSlide();
  slide.background = { color: C.deepNavy };

  slide.addText("Part 1", {
    x: 0.8, y: 0.4, w: 2, h: 0.4,
    fontSize: 12, fontFace: "Calibri", color: C.accent,
    charSpacing: 4, bold: true, margin: 0
  });
  slide.addText("なぜAIで資料を作るのか", {
    x: 0.8, y: 0.75, w: 8, h: 0.7,
    fontSize: 30, fontFace: "Calibri", color: C.white, bold: true, margin: 0
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: 1.5, w: 2.5, h: 0.04, fill: { color: C.accentBright }
  });

  // Traditional workflow (left)
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 1.85, w: 4.2, h: 3.2,
    fill: { color: C.navy }, shadow: makeShadow()
  });
  slide.addText("従来のやり方", {
    x: 0.6, y: 1.95, w: 4.2, h: 0.45,
    fontSize: 16, fontFace: "Calibri", color: C.gray,
    bold: true, align: "center", margin: 0
  });

  const traditionalSteps = [
    "構成を考える",
    "テンプレートを選ぶ",
    "内容を書く",
    "デザインを調整",
    "修正を繰り返す",
  ];
  traditionalSteps.forEach((step, i) => {
    const y = 2.5 + i * 0.45;
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 1.0, y, w: 3.4, h: 0.35, fill: { color: C.deepNavy }
    });
    slide.addText(`${i + 1}.  ${step}`, {
      x: 1.15, y, w: 3.1, h: 0.35,
      fontSize: 13, fontFace: "Calibri", color: C.white, valign: "middle", margin: 0
    });
  });
  slide.addText("3〜5時間", {
    x: 0.6, y: 4.65, w: 4.2, h: 0.35,
    fontSize: 14, fontFace: "Calibri", color: C.gray,
    bold: true, align: "center", margin: 0
  });

  // AI workflow (right)
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.2, y: 1.85, w: 4.2, h: 3.2,
    fill: { color: C.accent, transparency: 15 }, shadow: makeShadow()
  });
  slide.addText("AIを活用", {
    x: 5.2, y: 1.95, w: 4.2, h: 0.45,
    fontSize: 16, fontFace: "Calibri", color: C.accentBright,
    bold: true, align: "center", margin: 0
  });

  const aiSteps = [
    "テーマを伝える",
    "構成が自動生成",
    "デザインも自動",
    "完成！",
  ];
  aiSteps.forEach((step, i) => {
    const y = 2.5 + i * 0.45;
    slide.addImage({ data: icons.check, x: 5.55, y: y + 0.03, w: 0.28, h: 0.28 });
    slide.addText(step, {
      x: 5.95, y, w: 3.1, h: 0.35,
      fontSize: 14, fontFace: "Calibri", color: C.white, valign: "middle",
      bold: true, margin: 0
    });
  });
  slide.addText("10〜20分", {
    x: 5.2, y: 4.65, w: 4.2, h: 0.35,
    fontSize: 18, fontFace: "Calibri", color: C.accentBright,
    bold: true, align: "center", margin: 0
  });

  // ============================================================
  // SLIDE 4: Part 1 continued - Shift mindset
  // ============================================================
  slide = pres.addSlide();
  slide.background = { color: C.white };
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.navy }
  });

  slide.addText("Part 1", {
    x: 0.8, y: 0.35, w: 2, h: 0.35,
    fontSize: 12, fontFace: "Calibri", color: C.accent,
    charSpacing: 4, bold: true, margin: 0
  });
  slide.addText('「作業」から「思考」へシフトする', {
    x: 0.8, y: 0.65, w: 8, h: 0.7,
    fontSize: 28, fontFace: "Calibri", color: C.darkText, bold: true, margin: 0
  });

  // Big stat callout
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: 1.6, w: 3.8, h: 2.8,
    fill: { color: C.navy }, shadow: makeShadow()
  });
  slide.addText("90%", {
    x: 0.8, y: 1.9, w: 3.8, h: 1.2,
    fontSize: 64, fontFace: "Calibri", color: C.accentBright,
    bold: true, align: "center", margin: 0
  });
  slide.addText("時間削減", {
    x: 0.8, y: 3.0, w: 3.8, h: 0.5,
    fontSize: 18, fontFace: "Calibri", color: C.white,
    align: "center", margin: 0
  });
  slide.addText("3〜5時間 → 10〜20分", {
    x: 0.8, y: 3.45, w: 3.8, h: 0.4,
    fontSize: 13, fontFace: "Calibri", color: C.ice,
    align: "center", margin: 0
  });

  // Right side: key message cards
  const shiftCards = [
    { title: "AI がやること", body: "レイアウト、配色、画像選定\nテンプレート作業を自動処理", iconKey: "rocketNavy" },
    { title: "人間がやること", body: "何を伝えるか、どう伝えるか\n提案の本質・戦略に集中", iconKey: "brainAccent" },
  ];
  shiftCards.forEach((card, i) => {
    const y = 1.6 + i * 1.5;
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 5.2, y, w: 4.2, h: 1.3,
      fill: { color: C.lightIce }, shadow: makeShadow()
    });
    slide.addImage({ data: icons[card.iconKey], x: 5.5, y: y + 0.25, w: 0.5, h: 0.5 });
    slide.addText(card.title, {
      x: 6.2, y: y + 0.12, w: 2.9, h: 0.4,
      fontSize: 15, fontFace: "Calibri", color: C.navy,
      bold: true, margin: 0
    });
    slide.addText(card.body, {
      x: 6.2, y: y + 0.5, w: 2.9, h: 0.65,
      fontSize: 12, fontFace: "Calibri", color: C.darkText,
      lineSpacingMultiple: 1.4, margin: 0
    });
  });

  // Key takeaway
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: 4.6, w: 8.4, h: 0.55,
    fill: { color: C.navy }
  });
  slide.addImage({ data: icons.bulb, x: 1.1, y: 4.68, w: 0.35, h: 0.35 });
  slide.addText("PowerPointのスキルではなく、伝える力が武器になる時代", {
    x: 1.6, y: 4.6, w: 7.2, h: 0.55,
    fontSize: 14, fontFace: "Calibri", color: C.white,
    bold: true, valign: "middle", margin: 0
  });

  // ============================================================
  // SLIDE 5: Part 2 - Gamma Basics
  // ============================================================
  slide = pres.addSlide();
  slide.background = { color: C.deepNavy };

  slide.addText("Part 2", {
    x: 0.8, y: 0.4, w: 2, h: 0.4,
    fontSize: 12, fontFace: "Calibri", color: C.accent,
    charSpacing: 4, bold: true, margin: 0
  });
  slide.addText("Gammaの基本", {
    x: 0.8, y: 0.75, w: 8, h: 0.7,
    fontSize: 30, fontFace: "Calibri", color: C.white, bold: true, margin: 0
  });
  slide.addText("プロンプト一つで美しい資料が完成するツール", {
    x: 0.8, y: 1.35, w: 8, h: 0.4,
    fontSize: 14, fontFace: "Calibri", color: C.white, margin: 0
  });

  // Process flow: 4 steps
  const gammaSteps = [
    { label: "プロンプト入力", iconKey: "pencil" },
    { label: "アウトライン\n自動生成", iconKey: "clipboard" },
    { label: "確認・調整", iconKey: "checkWhite" },
    { label: "スライド完成", iconKey: "starWhite" },
  ];
  gammaSteps.forEach((step, i) => {
    const x = 0.8 + i * 2.35;
    // Circle
    slide.addShape(pres.shapes.OVAL, {
      x: x + 0.55, y: 2.1, w: 1.0, h: 1.0,
      fill: { color: C.midBlue }
    });
    slide.addImage({ data: icons[step.iconKey], x: x + 0.75, y: 2.3, w: 0.6, h: 0.6 });
    slide.addText(step.label, {
      x, y: 3.25, w: 2.1, h: 0.65,
      fontSize: 12, fontFace: "Calibri", color: C.white,
      align: "center", valign: "top", margin: 0
    });
    // Arrow between steps
    if (i < 3) {
      slide.addImage({ data: icons.arrow, x: x + 1.9, y: 2.35, w: 0.35, h: 0.35 });
    }
  });

  // Features
  const features = [
    "画像も自動で挿入される",
    "Webページ形式でURL共有が可能",
    "PPTXエクスポートにも対応",
  ];
  features.forEach((f, i) => {
    const y = 4.2 + i * 0.4;
    slide.addImage({ data: icons.check, x: 1.0, y: y + 0.03, w: 0.28, h: 0.28 });
    slide.addText(f, {
      x: 1.45, y, w: 6, h: 0.35,
      fontSize: 13, fontFace: "Calibri", color: C.white, valign: "middle", margin: 0
    });
  });

  // ============================================================
  // SLIDE 6: Part 2 - Before/After
  // ============================================================
  slide = pres.addSlide();
  slide.background = { color: C.white };
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.navy }
  });

  slide.addText("Part 2", {
    x: 0.8, y: 0.35, w: 2, h: 0.35,
    fontSize: 12, fontFace: "Calibri", color: C.accent,
    charSpacing: 4, bold: true, margin: 0
  });
  slide.addText("Before / After 比較", {
    x: 0.8, y: 0.65, w: 8, h: 0.7,
    fontSize: 28, fontFace: "Calibri", color: C.darkText, bold: true, margin: 0
  });

  // Comparison table
  const tableHeader = [
    { text: "", options: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 13, align: "center" } },
    { text: "PowerPoint", options: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 13, align: "center" } },
    { text: "Gamma", options: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 13, align: "center" } },
  ];
  const tableRows = [
    ["10スライドの提案資料", "3〜5時間", "約5分"],
    ["デザイン品質", "テンプレート依存", "プロ品質を自動生成"],
    ["共有方法", "ファイル添付", "URL共有（Web形式）"],
    ["修正作業", "手動で再編集", "プロンプトで即修正"],
  ];
  const tableData = [tableHeader];
  tableRows.forEach((row, ri) => {
    tableData.push(row.map((cell, ci) => ({
      text: cell,
      options: {
        fill: { color: ri % 2 === 0 ? C.lightIce : C.white },
        color: C.darkText,
        fontSize: 12,
        align: ci === 0 ? "left" : "center",
        bold: ci === 0,
      }
    })));
  });

  slide.addTable(tableData, {
    x: 0.8, y: 1.6, w: 8.4,
    colW: [3.0, 2.7, 2.7],
    border: { pt: 0.5, color: C.ice },
    rowH: [0.5, 0.5, 0.5, 0.5, 0.5],
  });

  // Prompt example card
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: 3.95, w: 8.4, h: 1.1,
    fill: { color: C.lightIce }, shadow: makeShadow()
  });
  slide.addImage({ data: icons.boltNavy, x: 1.1, y: 4.05, w: 0.35, h: 0.35 });
  slide.addText("入力プロンプト例", {
    x: 1.6, y: 4.0, w: 3, h: 0.4,
    fontSize: 14, fontFace: "Calibri", color: C.navy, bold: true, margin: 0
  });
  slide.addText("「中小企業向けAI導入提案書を作成してください。構成：現状の課題、AI活用提案（3つ）、投資対効果、導入スケジュール…」", {
    x: 1.6, y: 4.38, w: 7.2, h: 0.55,
    fontSize: 11, fontFace: "Calibri", color: C.darkText, italic: true, margin: 0
  });

  // ============================================================
  // SLIDE 7: Part 3 - Claude + Gamma Workflow
  // ============================================================
  slide = pres.addSlide();
  slide.background = { color: C.deepNavy };

  slide.addText("Part 3", {
    x: 0.8, y: 0.4, w: 2, h: 0.4,
    fontSize: 12, fontFace: "Calibri", color: C.accent,
    charSpacing: 4, bold: true, margin: 0
  });
  slide.addText("Claude + Gamma 連携", {
    x: 0.8, y: 0.75, w: 8, h: 0.7,
    fontSize: 30, fontFace: "Calibri", color: C.white, bold: true, margin: 0
  });
  slide.addText("内容の質はClaudeで、ビジュアルはGammaで", {
    x: 0.8, y: 1.35, w: 8, h: 0.4,
    fontSize: 14, fontFace: "Calibri", color: C.white, margin: 0
  });

  // 3 step workflow
  const workflowSteps = [
    {
      num: "Step 1", title: "Claudeに構成を依頼",
      body: "テーマ・対象・目的を明確に伝え\nスライドごとの内容を出力",
      iconKey: "comments"
    },
    {
      num: "Step 2", title: "Gammaに貼り付け",
      body: "「Paste in text」を選択\nアウトラインを確認・調整",
      iconKey: "file"
    },
    {
      num: "Step 3", title: "スライド生成・確認",
      body: "デザインが自動で完成\n必要に応じて微調整",
      iconKey: "starWhite"
    },
  ];
  workflowSteps.forEach((step, i) => {
    const x = 0.6 + i * 3.1;
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y: 2.0, w: 2.85, h: 2.6,
      fill: { color: C.navy }, shadow: makeShadow()
    });
    // Step number badge
    slide.addShape(pres.shapes.RECTANGLE, {
      x: x + 0.2, y: 2.15, w: 1.0, h: 0.35,
      fill: { color: C.accentBright }
    });
    slide.addText(step.num, {
      x: x + 0.2, y: 2.15, w: 1.0, h: 0.35,
      fontSize: 11, fontFace: "Calibri", color: C.white,
      bold: true, align: "center", valign: "middle", margin: 0
    });
    // Icon
    slide.addImage({ data: icons[step.iconKey], x: x + 1.05, y: 2.7, w: 0.65, h: 0.65 });
    // Title
    slide.addText(step.title, {
      x: x + 0.2, y: 3.5, w: 2.45, h: 0.4,
      fontSize: 15, fontFace: "Calibri", color: C.white, bold: true, margin: 0
    });
    // Body
    slide.addText(step.body, {
      x: x + 0.2, y: 3.9, w: 2.45, h: 0.6,
      fontSize: 11, fontFace: "Calibri", color: C.ice,
      lineSpacingMultiple: 1.4, margin: 0
    });
    // Arrow
    if (i < 2) {
      slide.addImage({ data: icons.arrow, x: x + 2.7, y: 3.0, w: 0.4, h: 0.4 });
    }
  });

  // Bottom note
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 4.7, w: 8.8, h: 0.5,
    fill: { color: C.midBlue, transparency: 30 }
  });
  slide.addImage({ data: icons.bulbWhite, x: 0.85, y: 4.78, w: 0.3, h: 0.3 });
  slide.addText("Gammaだけでも作れるが、Claudeで先に内容を練ると提案の質が大きく上がる", {
    x: 1.3, y: 4.7, w: 7.8, h: 0.5,
    fontSize: 12, fontFace: "Calibri", color: C.white,
    valign: "middle", margin: 0
  });

  // ============================================================
  // SLIDE 8: Part 3 - Tips for Claude prompts
  // ============================================================
  slide = pres.addSlide();
  slide.background = { color: C.white };
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.navy }
  });

  slide.addText("Part 3", {
    x: 0.8, y: 0.35, w: 2, h: 0.35,
    fontSize: 12, fontFace: "Calibri", color: C.accent,
    charSpacing: 4, bold: true, margin: 0
  });
  slide.addText("Claudeへの指示で質が変わる", {
    x: 0.8, y: 0.65, w: 8, h: 0.7,
    fontSize: 28, fontFace: "Calibri", color: C.darkText, bold: true, margin: 0
  });

  const tipCards = [
    {
      title: "対象者を明確にする",
      items: ["業種（製造業、IT、小売…）", "役職（経営層、現場マネージャー…）", "課題感（コスト削減、人手不足…）"],
      iconKey: "users"
    },
    {
      title: "目的を伝える",
      items: ["受注を取りたいのか", "社内承認を得たいのか", "情報共有が目的か"],
      iconKey: "clipboard"
    },
    {
      title: "制約を指定する",
      items: ["スライド数（5枚？10枚？）", "トーン（フォーマル / カジュアル）", "必須項目（数字、事例、比較）"],
      iconKey: "pencil"
    },
  ];

  tipCards.forEach((card, i) => {
    const x = 0.6 + i * 3.1;
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.55, w: 2.85, h: 3.3,
      fill: { color: C.lightIce }, shadow: makeShadow()
    });
    // Icon circle
    slide.addShape(pres.shapes.OVAL, {
      x: x + 0.95, y: 1.75, w: 0.8, h: 0.8,
      fill: { color: C.navy }
    });
    slide.addImage({ data: icons[card.iconKey], x: x + 1.1, y: 1.9, w: 0.5, h: 0.5 });
    // Title
    slide.addText(card.title, {
      x: x + 0.2, y: 2.7, w: 2.45, h: 0.4,
      fontSize: 15, fontFace: "Calibri", color: C.navy,
      bold: true, align: "center", margin: 0
    });
    // Items
    slide.addText(
      card.items.map((item, ii) => ({
        text: item,
        options: { bullet: true, breakLine: ii < card.items.length - 1 }
      })),
      {
        x: x + 0.3, y: 3.2, w: 2.25, h: 1.4,
        fontSize: 12, fontFace: "Calibri", color: C.darkText,
        paraSpaceAfter: 6, valign: "top", margin: 0
      }
    );
  });

  // ============================================================
  // SLIDE 9: Part 4 - Hands-on
  // ============================================================
  slide = pres.addSlide();
  slide.background = { color: C.deepNavy };

  slide.addText("Part 4", {
    x: 0.8, y: 0.4, w: 2, h: 0.4,
    fontSize: 12, fontFace: "Calibri", color: C.accent,
    charSpacing: 4, bold: true, margin: 0
  });
  slide.addText("実践ハンズオン", {
    x: 0.8, y: 0.75, w: 8, h: 0.7,
    fontSize: 30, fontFace: "Calibri", color: C.white, bold: true, margin: 0
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: 1.5, w: 2.5, h: 0.04, fill: { color: C.accentBright }
  });

  // Practice 1
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 1.85, w: 4.2, h: 3.0,
    fill: { color: C.navy }, shadow: makeShadow()
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 1.85, w: 4.2, h: 0.45,
    fill: { color: C.accent }
  });
  slide.addText("実践 1：提案資料を作る", {
    x: 0.6, y: 1.85, w: 4.2, h: 0.45,
    fontSize: 14, fontFace: "Calibri", color: C.white,
    bold: true, align: "center", valign: "middle", margin: 0
  });

  const practice1Steps = [
    "Claudeに構成・内容を依頼",
    "Gammaに貼り付けてスライド生成",
    "生成されたスライドを確認",
  ];
  practice1Steps.forEach((step, i) => {
    const y = 2.5 + i * 0.48;
    slide.addShape(pres.shapes.OVAL, {
      x: 0.9, y: y + 0.02, w: 0.33, h: 0.33,
      fill: { color: C.accentBright }
    });
    slide.addText(`${i + 1}`, {
      x: 0.9, y: y + 0.02, w: 0.33, h: 0.33,
      fontSize: 11, fontFace: "Calibri", color: C.white,
      bold: true, align: "center", valign: "middle", margin: 0
    });
    slide.addText(step, {
      x: 1.4, y, w: 3.1, h: 0.38,
      fontSize: 12, fontFace: "Calibri", color: C.white, valign: "middle", margin: 0
    });
  });

  // Theme examples
  slide.addText("テーマ例", {
    x: 0.9, y: 4.0, w: 1.2, h: 0.25,
    fontSize: 10, fontFace: "Calibri", color: C.accent, bold: true, margin: 0
  });
  slide.addText("自社サービス紹介 / 社内AI活用提案\nクライアント業務改善提案", {
    x: 0.9, y: 4.25, w: 3.5, h: 0.45,
    fontSize: 10, fontFace: "Calibri", color: C.white,
    lineSpacingMultiple: 1.3, margin: 0
  });

  // Practice 2
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.2, y: 1.85, w: 4.2, h: 3.0,
    fill: { color: C.navy }, shadow: makeShadow()
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.2, y: 1.85, w: 4.2, h: 0.45,
    fill: { color: C.accentBright }
  });
  slide.addText("実践 2：ブラッシュアップ", {
    x: 5.2, y: 1.85, w: 4.2, h: 0.45,
    fontSize: 14, fontFace: "Calibri", color: C.white,
    bold: true, align: "center", valign: "middle", margin: 0
  });

  const practice2Steps = [
    "生成スライドを見返す",
    "改善点を洗い出す",
    "Claudeに修正を依頼",
    "Gammaで更新",
  ];
  practice2Steps.forEach((step, i) => {
    const y = 2.45 + i * 0.38;
    slide.addShape(pres.shapes.OVAL, {
      x: 5.5, y: y + 0.02, w: 0.33, h: 0.33,
      fill: { color: C.accent }
    });
    slide.addText(`${i + 1}`, {
      x: 5.5, y: y + 0.02, w: 0.33, h: 0.33,
      fontSize: 11, fontFace: "Calibri", color: C.white,
      bold: true, align: "center", valign: "middle", margin: 0
    });
    slide.addText(step, {
      x: 6.0, y, w: 3.1, h: 0.35,
      fontSize: 12, fontFace: "Calibri", color: C.white, valign: "middle", margin: 0
    });
  });

  // Check points
  slide.addText("確認する観点", {
    x: 5.5, y: 4.15, w: 1.8, h: 0.25,
    fontSize: 10, fontFace: "Calibri", color: C.accentBright, bold: true, margin: 0
  });
  slide.addText("根拠は具体的か / 流れに飛躍がないか\n次のアクションが明確か", {
    x: 5.5, y: 4.38, w: 3.5, h: 0.4,
    fontSize: 10, fontFace: "Calibri", color: C.white,
    lineSpacingMultiple: 1.3, margin: 0
  });

  // ============================================================
  // SLIDE 10: Part 5 - Time savings summary
  // ============================================================
  slide = pres.addSlide();
  slide.background = { color: C.white };
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.navy }
  });

  slide.addText("Part 5", {
    x: 0.8, y: 0.35, w: 2, h: 0.35,
    fontSize: 12, fontFace: "Calibri", color: C.accent,
    charSpacing: 4, bold: true, margin: 0
  });
  slide.addText("AI資料作成の時間削減効果", {
    x: 0.8, y: 0.65, w: 8, h: 0.7,
    fontSize: 28, fontFace: "Calibri", color: C.darkText, bold: true, margin: 0
  });

  // Time savings table
  const savingsHeader = [
    { text: "業務", options: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 13, align: "center" } },
    { text: "Before", options: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 13, align: "center" } },
    { text: "After（Claude + Gamma）", options: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 13, align: "center" } },
  ];
  const savingsRows = [
    ["提案資料作成", "3〜5時間", "10〜20分"],
    ["社内報告資料", "1〜2時間", "5〜10分"],
    ["企画書", "半日〜1日", "20〜30分"],
  ];
  const savingsData = [savingsHeader];
  savingsRows.forEach((row, ri) => {
    savingsData.push(row.map((cell, ci) => ({
      text: cell,
      options: {
        fill: { color: ri % 2 === 0 ? C.lightIce : C.white },
        color: ci === 2 ? C.accent : C.darkText,
        fontSize: 13,
        align: "center",
        bold: ci === 2,
      }
    })));
  });

  slide.addTable(savingsData, {
    x: 0.8, y: 1.6, w: 8.4,
    colW: [2.8, 2.8, 2.8],
    border: { pt: 0.5, color: C.ice },
    rowH: [0.55, 0.55, 0.55, 0.55],
  });

  // Zone C summary
  slide.addText("Zone C 全体の振り返り", {
    x: 0.8, y: 3.9, w: 5, h: 0.4,
    fontSize: 16, fontFace: "Calibri", color: C.navy, bold: true, margin: 0
  });

  const zoneItems = [
    { label: "画像生成", tool: "DALL-E / Midjourney", iconKey: "clockNavy" },
    { label: "動画制作", tool: "Runway / HeyGen", iconKey: "clockNavy" },
    { label: "資料作成", tool: "Claude + Gamma", iconKey: "clockNavy" },
  ];
  zoneItems.forEach((item, i) => {
    const x = 0.8 + i * 2.9;
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y: 4.35, w: 2.7, h: 0.75,
      fill: { color: C.lightIce }, shadow: makeShadow()
    });
    slide.addText(item.label, {
      x: x + 0.15, y: 4.37, w: 2.4, h: 0.35,
      fontSize: 14, fontFace: "Calibri", color: C.navy, bold: true, margin: 0
    });
    slide.addText(item.tool, {
      x: x + 0.15, y: 4.68, w: 2.4, h: 0.3,
      fontSize: 11, fontFace: "Calibri", color: C.gray, margin: 0
    });
  });

  // ============================================================
  // SLIDE 11: Part 5 - Key Takeaway + Links
  // ============================================================
  slide = pres.addSlide();
  slide.background = { color: C.deepNavy };

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accentBright }
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.565, w: 10, h: 0.06, fill: { color: C.accentBright }
  });

  slide.addText("Part 5", {
    x: 0.8, y: 0.4, w: 2, h: 0.4,
    fontSize: 12, fontFace: "Calibri", color: C.accent,
    charSpacing: 4, bold: true, margin: 0
  });
  slide.addText("まとめ", {
    x: 0.8, y: 0.75, w: 8, h: 0.7,
    fontSize: 30, fontFace: "Calibri", color: C.white, bold: true, margin: 0
  });

  // Key message
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: 1.7, w: 8.4, h: 1.4,
    fill: { color: C.navy }, shadow: makeShadow()
  });
  slide.addImage({ data: icons.brain, x: 1.2, y: 2.0, w: 0.7, h: 0.7 });
  slide.addText("AIが「作業」を担い、\n人間は「何を伝えるか」に集中する時代", {
    x: 2.2, y: 1.85, w: 6.5, h: 1.2,
    fontSize: 22, fontFace: "Calibri", color: C.white,
    bold: true, lineSpacingMultiple: 1.3, valign: "middle", margin: 0
  });

  // FAQ section
  slide.addText("よくある質問", {
    x: 0.8, y: 3.35, w: 3, h: 0.4,
    fontSize: 14, fontFace: "Calibri", color: C.accentBright, bold: true, margin: 0
  });

  const faqs = [
    { q: "Gammaは無料で使える？", a: "基本無料。高度な機能はPro版で。" },
    { q: "PPTXエクスポートできる？", a: "可能。ただしURL共有の方が手軽。" },
    { q: "Claude単体ではダメ？", a: "簡単な資料ならOK。深い提案はClaude+Gammaが最強。" },
  ];
  faqs.forEach((faq, i) => {
    const y = 3.8 + i * 0.5;
    slide.addText(`Q. ${faq.q}`, {
      x: 1.0, y, w: 3.8, h: 0.25,
      fontSize: 11, fontFace: "Calibri", color: C.white, bold: true, margin: 0
    });
    slide.addText(`→ ${faq.a}`, {
      x: 1.0, y: y + 0.22, w: 3.8, h: 0.25,
      fontSize: 10, fontFace: "Calibri", color: C.white, margin: 0
    });
  });

  // Links
  slide.addText("リンク集", {
    x: 5.5, y: 3.35, w: 3, h: 0.4,
    fontSize: 14, fontFace: "Calibri", color: C.accentBright, bold: true, margin: 0
  });

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.5, y: 3.85, w: 3.8, h: 1.5,
    fill: { color: C.navy }
  });
  slide.addText([
    { text: "Gamma", options: { bold: true, breakLine: true, fontSize: 14 } },
    { text: "gamma.app", options: { color: C.accentBright, breakLine: true, fontSize: 12 } },
    { text: "", options: { breakLine: true, fontSize: 8 } },
    { text: "Claude", options: { bold: true, breakLine: true, fontSize: 14 } },
    { text: "claude.ai", options: { color: C.accentBright, fontSize: 12 } },
  ], {
    x: 5.8, y: 3.95, w: 3.2, h: 1.3,
    fontFace: "Calibri", color: C.white, margin: 0
  });

  // ============================================================
  // Write file
  // ============================================================
  const outputPath = "/Users/kurosakiyuto/Downloads/開発/LMS/lecture09-slides/lecture09.pptx";
  await pres.writeFile({ fileName: outputPath });
  console.log("Generated: " + outputPath);
}

main().catch(err => { console.error(err); process.exit(1); });
