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

// --- Color Palette ---
const C = {
  navy: "1E2761", deepNavy: "0D1B3E", midBlue: "3B5998",
  ice: "CADCFC", lightIce: "E8EEFB", white: "FFFFFF",
  accent: "4A90D9", accentBright: "5BA3F5",
  gray: "8899AA", darkText: "1A1A2E", lightGray: "F4F6FA",
};

const makeShadow = () => ({ type: "outer", blur: 8, offset: 3, angle: 135, color: "000000", opacity: 0.18 });

function newPres(title) {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "AI研修講座";
  pres.title = title;
  return pres;
}

// ============================================================
// Part builders
// ============================================================

function buildPart1(pres, icons) {
  // Slide 1: Traditional vs AI
  let slide = pres.addSlide();
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

  // Traditional (left)
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 1.85, w: 4.2, h: 3.2,
    fill: { color: C.navy }, shadow: makeShadow()
  });
  slide.addText("従来のやり方", {
    x: 0.6, y: 1.95, w: 4.2, h: 0.45,
    fontSize: 16, fontFace: "Calibri", color: C.gray,
    bold: true, align: "center", margin: 0
  });
  ["構成を考える","テンプレートを選ぶ","内容を書く","デザインを調整","修正を繰り返す"].forEach((step, i) => {
    const y = 2.5 + i * 0.45;
    slide.addShape(pres.shapes.RECTANGLE, { x: 1.0, y, w: 3.4, h: 0.35, fill: { color: C.deepNavy } });
    slide.addText(`${i+1}.  ${step}`, {
      x: 1.15, y, w: 3.1, h: 0.35,
      fontSize: 13, fontFace: "Calibri", color: C.white, valign: "middle", margin: 0
    });
  });
  slide.addText("3〜5時間", {
    x: 0.6, y: 4.65, w: 4.2, h: 0.35,
    fontSize: 14, fontFace: "Calibri", color: C.gray, bold: true, align: "center", margin: 0
  });

  // AI (right)
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.2, y: 1.85, w: 4.2, h: 3.2,
    fill: { color: C.accent, transparency: 15 }, shadow: makeShadow()
  });
  slide.addText("AIを活用", {
    x: 5.2, y: 1.95, w: 4.2, h: 0.45,
    fontSize: 16, fontFace: "Calibri", color: C.accentBright,
    bold: true, align: "center", margin: 0
  });
  ["テーマを伝える","構成が自動生成","デザインも自動","完成！"].forEach((step, i) => {
    const y = 2.5 + i * 0.45;
    slide.addImage({ data: icons.check, x: 5.55, y: y + 0.03, w: 0.28, h: 0.28 });
    slide.addText(step, {
      x: 5.95, y, w: 3.1, h: 0.35,
      fontSize: 14, fontFace: "Calibri", color: C.white, valign: "middle", bold: true, margin: 0
    });
  });
  slide.addText("10〜20分", {
    x: 5.2, y: 4.65, w: 4.2, h: 0.35,
    fontSize: 18, fontFace: "Calibri", color: C.accentBright, bold: true, align: "center", margin: 0
  });

  // Slide 2: Shift mindset
  slide = pres.addSlide();
  slide.background = { color: C.white };
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.navy } });

  slide.addText("Part 1", {
    x: 0.8, y: 0.35, w: 2, h: 0.35,
    fontSize: 12, fontFace: "Calibri", color: C.accent, charSpacing: 4, bold: true, margin: 0
  });
  slide.addText('「作業」から「思考」へシフトする', {
    x: 0.8, y: 0.65, w: 8, h: 0.7,
    fontSize: 28, fontFace: "Calibri", color: C.darkText, bold: true, margin: 0
  });

  // 90% stat
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: 1.6, w: 3.8, h: 2.8, fill: { color: C.navy }, shadow: makeShadow()
  });
  slide.addText("90%", {
    x: 0.8, y: 1.9, w: 3.8, h: 1.2,
    fontSize: 64, fontFace: "Calibri", color: C.accentBright, bold: true, align: "center", margin: 0
  });
  slide.addText("時間削減", {
    x: 0.8, y: 3.0, w: 3.8, h: 0.5,
    fontSize: 18, fontFace: "Calibri", color: C.white, align: "center", margin: 0
  });
  slide.addText("3〜5時間 → 10〜20分", {
    x: 0.8, y: 3.45, w: 3.8, h: 0.4,
    fontSize: 13, fontFace: "Calibri", color: C.ice, align: "center", margin: 0
  });

  // Cards
  [
    { title: "AI がやること", body: "レイアウト、配色、画像選定\nテンプレート作業を自動処理", iconKey: "rocketNavy" },
    { title: "人間がやること", body: "何を伝えるか、どう伝えるか\n提案の本質・戦略に集中", iconKey: "brainAccent" },
  ].forEach((card, i) => {
    const y = 1.6 + i * 1.5;
    slide.addShape(pres.shapes.RECTANGLE, { x: 5.2, y, w: 4.2, h: 1.3, fill: { color: C.lightIce }, shadow: makeShadow() });
    slide.addImage({ data: icons[card.iconKey], x: 5.5, y: y + 0.25, w: 0.5, h: 0.5 });
    slide.addText(card.title, { x: 6.2, y: y + 0.12, w: 2.9, h: 0.4, fontSize: 15, fontFace: "Calibri", color: C.navy, bold: true, margin: 0 });
    slide.addText(card.body, { x: 6.2, y: y + 0.5, w: 2.9, h: 0.65, fontSize: 12, fontFace: "Calibri", color: C.darkText, lineSpacingMultiple: 1.4, margin: 0 });
  });

  // Takeaway
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 4.6, w: 8.4, h: 0.55, fill: { color: C.navy } });
  slide.addImage({ data: icons.bulb, x: 1.1, y: 4.68, w: 0.35, h: 0.35 });
  slide.addText("PowerPointのスキルではなく、伝える力が武器になる時代", {
    x: 1.6, y: 4.6, w: 7.2, h: 0.55,
    fontSize: 14, fontFace: "Calibri", color: C.white, bold: true, valign: "middle", margin: 0
  });
}

function buildPart2(pres, icons) {
  // Slide 1: Gamma basics
  let slide = pres.addSlide();
  slide.background = { color: C.deepNavy };

  slide.addText("Part 2", {
    x: 0.8, y: 0.4, w: 2, h: 0.4,
    fontSize: 12, fontFace: "Calibri", color: C.accent, charSpacing: 4, bold: true, margin: 0
  });
  slide.addText("Gammaの基本", {
    x: 0.8, y: 0.75, w: 8, h: 0.7,
    fontSize: 30, fontFace: "Calibri", color: C.white, bold: true, margin: 0
  });
  slide.addText("プロンプト一つで美しい資料が完成するツール", {
    x: 0.8, y: 1.35, w: 8, h: 0.4,
    fontSize: 14, fontFace: "Calibri", color: C.white, margin: 0
  });

  // 4-step flow
  const gammaSteps = [
    { label: "プロンプト入力", iconKey: "pencil" },
    { label: "アウトライン\n自動生成", iconKey: "clipboard" },
    { label: "確認・調整", iconKey: "checkWhite" },
    { label: "スライド完成", iconKey: "starWhite" },
  ];
  gammaSteps.forEach((step, i) => {
    const x = 0.8 + i * 2.35;
    slide.addShape(pres.shapes.OVAL, { x: x + 0.55, y: 2.1, w: 1.0, h: 1.0, fill: { color: C.midBlue } });
    slide.addImage({ data: icons[step.iconKey], x: x + 0.75, y: 2.3, w: 0.6, h: 0.6 });
    slide.addText(step.label, { x, y: 3.25, w: 2.1, h: 0.65, fontSize: 12, fontFace: "Calibri", color: C.white, align: "center", valign: "top", margin: 0 });
    if (i < 3) slide.addImage({ data: icons.arrow, x: x + 1.9, y: 2.35, w: 0.35, h: 0.35 });
  });

  ["画像も自動で挿入される","Webページ形式でURL共有が可能","PPTXエクスポートにも対応"].forEach((f, i) => {
    const y = 4.2 + i * 0.4;
    slide.addImage({ data: icons.check, x: 1.0, y: y + 0.03, w: 0.28, h: 0.28 });
    slide.addText(f, { x: 1.45, y, w: 6, h: 0.35, fontSize: 13, fontFace: "Calibri", color: C.white, valign: "middle", margin: 0 });
  });

  // Slide 2: Before/After
  slide = pres.addSlide();
  slide.background = { color: C.white };
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.navy } });

  slide.addText("Part 2", { x: 0.8, y: 0.35, w: 2, h: 0.35, fontSize: 12, fontFace: "Calibri", color: C.accent, charSpacing: 4, bold: true, margin: 0 });
  slide.addText("Before / After 比較", { x: 0.8, y: 0.65, w: 8, h: 0.7, fontSize: 28, fontFace: "Calibri", color: C.darkText, bold: true, margin: 0 });

  const tableHeader = [
    { text: "", options: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 13, align: "center" } },
    { text: "PowerPoint", options: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 13, align: "center" } },
    { text: "Gamma", options: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 13, align: "center" } },
  ];
  const tableData = [tableHeader];
  [["10スライドの提案資料","3〜5時間","約5分"],["デザイン品質","テンプレート依存","プロ品質を自動生成"],["共有方法","ファイル添付","URL共有（Web形式）"],["修正作業","手動で再編集","プロンプトで即修正"]].forEach((row, ri) => {
    tableData.push(row.map((cell, ci) => ({
      text: cell,
      options: { fill: { color: ri % 2 === 0 ? C.lightIce : C.white }, color: C.darkText, fontSize: 12, align: ci === 0 ? "left" : "center", bold: ci === 0 }
    })));
  });
  slide.addTable(tableData, { x: 0.8, y: 1.6, w: 8.4, colW: [3.0, 2.7, 2.7], border: { pt: 0.5, color: C.ice }, rowH: [0.5, 0.5, 0.5, 0.5, 0.5] });

  // Prompt example
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 3.95, w: 8.4, h: 1.1, fill: { color: C.lightIce }, shadow: makeShadow() });
  slide.addImage({ data: icons.boltNavy, x: 1.1, y: 4.05, w: 0.35, h: 0.35 });
  slide.addText("入力プロンプト例", { x: 1.6, y: 4.0, w: 3, h: 0.4, fontSize: 14, fontFace: "Calibri", color: C.navy, bold: true, margin: 0 });
  slide.addText("「中小企業向けAI導入提案書を作成してください。構成：現状の課題、AI活用提案（3つ）、投資対効果、導入スケジュール…」", {
    x: 1.6, y: 4.38, w: 7.2, h: 0.55, fontSize: 11, fontFace: "Calibri", color: C.darkText, italic: true, margin: 0
  });
}

function buildPart3(pres, icons) {
  // Slide 1: Workflow
  let slide = pres.addSlide();
  slide.background = { color: C.deepNavy };

  slide.addText("Part 3", { x: 0.8, y: 0.4, w: 2, h: 0.4, fontSize: 12, fontFace: "Calibri", color: C.accent, charSpacing: 4, bold: true, margin: 0 });
  slide.addText("Claude + Gamma 連携", { x: 0.8, y: 0.75, w: 8, h: 0.7, fontSize: 30, fontFace: "Calibri", color: C.white, bold: true, margin: 0 });
  slide.addText("内容の質はClaudeで、ビジュアルはGammaで", { x: 0.8, y: 1.35, w: 8, h: 0.4, fontSize: 14, fontFace: "Calibri", color: C.white, margin: 0 });

  const steps = [
    { num: "Step 1", title: "Claudeに構成を依頼", body: "テーマ・対象・目的を明確に伝え\nスライドごとの内容を出力", iconKey: "comments" },
    { num: "Step 2", title: "Gammaに貼り付け", body: "「Paste in text」を選択\nアウトラインを確認・調整", iconKey: "file" },
    { num: "Step 3", title: "スライド生成・確認", body: "デザインが自動で完成\n必要に応じて微調整", iconKey: "starWhite" },
  ];
  steps.forEach((step, i) => {
    const x = 0.6 + i * 3.1;
    slide.addShape(pres.shapes.RECTANGLE, { x, y: 2.0, w: 2.85, h: 2.6, fill: { color: C.navy }, shadow: makeShadow() });
    slide.addShape(pres.shapes.RECTANGLE, { x: x + 0.2, y: 2.15, w: 1.0, h: 0.35, fill: { color: C.accentBright } });
    slide.addText(step.num, { x: x + 0.2, y: 2.15, w: 1.0, h: 0.35, fontSize: 11, fontFace: "Calibri", color: C.white, bold: true, align: "center", valign: "middle", margin: 0 });
    slide.addImage({ data: icons[step.iconKey], x: x + 1.05, y: 2.7, w: 0.65, h: 0.65 });
    slide.addText(step.title, { x: x + 0.2, y: 3.5, w: 2.45, h: 0.4, fontSize: 15, fontFace: "Calibri", color: C.white, bold: true, margin: 0 });
    slide.addText(step.body, { x: x + 0.2, y: 3.9, w: 2.45, h: 0.6, fontSize: 11, fontFace: "Calibri", color: C.ice, lineSpacingMultiple: 1.4, margin: 0 });
    if (i < 2) slide.addImage({ data: icons.arrow, x: x + 2.7, y: 3.0, w: 0.4, h: 0.4 });
  });

  slide.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 4.7, w: 8.8, h: 0.5, fill: { color: C.midBlue, transparency: 30 } });
  slide.addImage({ data: icons.bulbWhite, x: 0.85, y: 4.78, w: 0.3, h: 0.3 });
  slide.addText("Gammaだけでも作れるが、Claudeで先に内容を練ると提案の質が大きく上がる", {
    x: 1.3, y: 4.7, w: 7.8, h: 0.5, fontSize: 12, fontFace: "Calibri", color: C.white, valign: "middle", margin: 0
  });

  // Slide 2: Tips
  slide = pres.addSlide();
  slide.background = { color: C.white };
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.navy } });

  slide.addText("Part 3", { x: 0.8, y: 0.35, w: 2, h: 0.35, fontSize: 12, fontFace: "Calibri", color: C.accent, charSpacing: 4, bold: true, margin: 0 });
  slide.addText("Claudeへの指示で質が変わる", { x: 0.8, y: 0.65, w: 8, h: 0.7, fontSize: 28, fontFace: "Calibri", color: C.darkText, bold: true, margin: 0 });

  const tips = [
    { title: "対象者を明確にする", items: ["業種（製造業、IT、小売…）","役職（経営層、現場マネージャー…）","課題感（コスト削減、人手不足…）"], iconKey: "users" },
    { title: "目的を伝える", items: ["受注を取りたいのか","社内承認を得たいのか","情報共有が目的か"], iconKey: "clipboard" },
    { title: "制約を指定する", items: ["スライド数（5枚？10枚？）","トーン（フォーマル / カジュアル）","必須項目（数字、事例、比較）"], iconKey: "pencil" },
  ];
  tips.forEach((card, i) => {
    const x = 0.6 + i * 3.1;
    slide.addShape(pres.shapes.RECTANGLE, { x, y: 1.55, w: 2.85, h: 3.3, fill: { color: C.lightIce }, shadow: makeShadow() });
    slide.addShape(pres.shapes.OVAL, { x: x + 0.95, y: 1.75, w: 0.8, h: 0.8, fill: { color: C.navy } });
    slide.addImage({ data: icons[card.iconKey], x: x + 1.1, y: 1.9, w: 0.5, h: 0.5 });
    slide.addText(card.title, { x: x + 0.2, y: 2.7, w: 2.45, h: 0.4, fontSize: 15, fontFace: "Calibri", color: C.navy, bold: true, align: "center", margin: 0 });
    slide.addText(
      card.items.map((item, ii) => ({ text: item, options: { bullet: true, breakLine: ii < card.items.length - 1 } })),
      { x: x + 0.3, y: 3.2, w: 2.25, h: 1.4, fontSize: 12, fontFace: "Calibri", color: C.darkText, paraSpaceAfter: 6, valign: "top", margin: 0 }
    );
  });
}

function buildPart5(pres, icons) {
  // Slide 1: Time savings
  let slide = pres.addSlide();
  slide.background = { color: C.white };
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.navy } });

  slide.addText("Part 5", { x: 0.8, y: 0.35, w: 2, h: 0.35, fontSize: 12, fontFace: "Calibri", color: C.accent, charSpacing: 4, bold: true, margin: 0 });
  slide.addText("AI資料作成の時間削減効果", { x: 0.8, y: 0.65, w: 8, h: 0.7, fontSize: 28, fontFace: "Calibri", color: C.darkText, bold: true, margin: 0 });

  const savingsHeader = [
    { text: "業務", options: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 13, align: "center" } },
    { text: "Before", options: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 13, align: "center" } },
    { text: "After（Claude + Gamma）", options: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 13, align: "center" } },
  ];
  const savingsData = [savingsHeader];
  [["提案資料作成","3〜5時間","10〜20分"],["社内報告資料","1〜2時間","5〜10分"],["企画書","半日〜1日","20〜30分"]].forEach((row, ri) => {
    savingsData.push(row.map((cell, ci) => ({
      text: cell,
      options: { fill: { color: ri % 2 === 0 ? C.lightIce : C.white }, color: ci === 2 ? C.accent : C.darkText, fontSize: 13, align: "center", bold: ci === 2 }
    })));
  });
  slide.addTable(savingsData, { x: 0.8, y: 1.6, w: 8.4, colW: [2.8, 2.8, 2.8], border: { pt: 0.5, color: C.ice }, rowH: [0.55, 0.55, 0.55, 0.55] });

  slide.addText("Zone C 全体の振り返り", { x: 0.8, y: 3.9, w: 5, h: 0.4, fontSize: 16, fontFace: "Calibri", color: C.navy, bold: true, margin: 0 });
  [
    { label: "画像生成", tool: "DALL-E / Midjourney" },
    { label: "動画制作", tool: "Runway / HeyGen" },
    { label: "資料作成", tool: "Claude + Gamma" },
  ].forEach((item, i) => {
    const x = 0.8 + i * 2.9;
    slide.addShape(pres.shapes.RECTANGLE, { x, y: 4.35, w: 2.7, h: 0.75, fill: { color: C.lightIce }, shadow: makeShadow() });
    slide.addText(item.label, { x: x + 0.15, y: 4.37, w: 2.4, h: 0.35, fontSize: 14, fontFace: "Calibri", color: C.navy, bold: true, margin: 0 });
    slide.addText(item.tool, { x: x + 0.15, y: 4.68, w: 2.4, h: 0.3, fontSize: 11, fontFace: "Calibri", color: C.gray, margin: 0 });
  });

  // Slide 2: Summary + FAQ + Links
  slide = pres.addSlide();
  slide.background = { color: C.deepNavy };
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accentBright } });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.565, w: 10, h: 0.06, fill: { color: C.accentBright } });

  slide.addText("Part 5", { x: 0.8, y: 0.4, w: 2, h: 0.4, fontSize: 12, fontFace: "Calibri", color: C.accent, charSpacing: 4, bold: true, margin: 0 });
  slide.addText("まとめ", { x: 0.8, y: 0.75, w: 8, h: 0.7, fontSize: 30, fontFace: "Calibri", color: C.white, bold: true, margin: 0 });

  slide.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.7, w: 8.4, h: 1.4, fill: { color: C.navy }, shadow: makeShadow() });
  slide.addImage({ data: icons.brain, x: 1.2, y: 2.0, w: 0.7, h: 0.7 });
  slide.addText("AIが「作業」を担い、\n人間は「何を伝えるか」に集中する時代", {
    x: 2.2, y: 1.85, w: 6.5, h: 1.2,
    fontSize: 22, fontFace: "Calibri", color: C.white, bold: true, lineSpacingMultiple: 1.3, valign: "middle", margin: 0
  });

  slide.addText("よくある質問", { x: 0.8, y: 3.35, w: 3, h: 0.4, fontSize: 14, fontFace: "Calibri", color: C.accentBright, bold: true, margin: 0 });
  [
    { q: "Gammaは無料で使える？", a: "基本無料。高度な機能はPro版で。" },
    { q: "PPTXエクスポートできる？", a: "可能。ただしURL共有の方が手軽。" },
    { q: "Claude単体ではダメ？", a: "簡単な資料ならOK。深い提案はClaude+Gammaが最強。" },
  ].forEach((faq, i) => {
    const y = 3.8 + i * 0.5;
    slide.addText(`Q. ${faq.q}`, { x: 1.0, y, w: 3.8, h: 0.25, fontSize: 11, fontFace: "Calibri", color: C.white, bold: true, margin: 0 });
    slide.addText(`→ ${faq.a}`, { x: 1.0, y: y + 0.22, w: 3.8, h: 0.25, fontSize: 10, fontFace: "Calibri", color: C.white, margin: 0 });
  });

  slide.addText("リンク集", { x: 5.5, y: 3.35, w: 3, h: 0.4, fontSize: 14, fontFace: "Calibri", color: C.accentBright, bold: true, margin: 0 });
  slide.addShape(pres.shapes.RECTANGLE, { x: 5.5, y: 3.85, w: 3.8, h: 1.5, fill: { color: C.navy } });
  slide.addText([
    { text: "Gamma", options: { bold: true, breakLine: true, fontSize: 14 } },
    { text: "gamma.app", options: { color: C.accentBright, breakLine: true, fontSize: 12 } },
    { text: "", options: { breakLine: true, fontSize: 8 } },
    { text: "Claude", options: { bold: true, breakLine: true, fontSize: 14 } },
    { text: "claude.ai", options: { color: C.accentBright, fontSize: 12 } },
  ], { x: 5.8, y: 3.95, w: 3.2, h: 1.3, fontFace: "Calibri", color: C.white, margin: 0 });
}

// ============================================================
// Main
// ============================================================
async function main() {
  const icons = {};
  const iconList = [
    ["rocket", FaRocket, C.accentBright], ["bolt", FaBolt, C.accent],
    ["brain", FaBrain, C.white], ["magic", FaMagic, C.accentBright],
    ["clipboard", FaClipboardList, C.white], ["paint", FaPaintBrush, C.accentBright],
    ["link", FaLink, C.white], ["globe", FaGlobe, C.accentBright],
    ["pencil", FaPencilAlt, C.white], ["laptop", FaLaptopCode, C.accentBright],
    ["users", FaUsers, C.white], ["clock", FaClock, C.accentBright],
    ["check", FaCheckCircle, C.accentBright], ["arrow", FaArrowRight, C.white],
    ["bulb", FaLightbulb, C.accentBright], ["file", FaFileAlt, C.white],
    ["chart", FaChartBar, C.accentBright], ["comments", FaComments, C.white],
    ["question", FaQuestion, C.accentBright], ["star", FaStar, C.accentBright],
    ["checkWhite", FaCheckCircle, C.white], ["rocketNavy", FaRocket, C.navy],
    ["boltNavy", FaBolt, C.navy], ["brainAccent", FaBrain, C.accentBright],
    ["clockNavy", FaClock, C.navy], ["arrowAccent", FaArrowRight, C.accentBright],
    ["starWhite", FaStar, C.white], ["bulbWhite", FaLightbulb, C.white],
  ];
  for (const [name, comp, color] of iconList) {
    icons[name] = await iconToBase64Png(comp, `#${color}`);
  }

  const dir = "/Users/kurosakiyuto/Downloads/開発/LMS/lecture09-slides";

  const parts = [
    { name: "part1", title: "Part 1: なぜAIで資料を作るのか", builder: buildPart1 },
    { name: "part2", title: "Part 2: Gammaの基本", builder: buildPart2 },
    { name: "part3", title: "Part 3: Claude + Gamma連携", builder: buildPart3 },
    { name: "part5", title: "Part 5: まとめ", builder: buildPart5 },
  ];

  for (const part of parts) {
    const pres = newPres(part.title);
    part.builder(pres, icons);
    const path = `${dir}/${part.name}.pptx`;
    await pres.writeFile({ fileName: path });
    console.log(`Generated: ${path}`);
  }
}

main().catch(err => { console.error(err); process.exit(1); });
