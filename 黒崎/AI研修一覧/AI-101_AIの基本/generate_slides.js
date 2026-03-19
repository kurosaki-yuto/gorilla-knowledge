const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const {
  FaBrain, FaBullseye, FaRobot, FaCogs, FaDatabase, FaMagic,
  FaLightbulb, FaExclamationTriangle, FaCheckCircle, FaArrowRight,
  FaFileAlt, FaSearch, FaComments, FaShieldAlt, FaCopyright
} = require("react-icons/fa");

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

// Color palette: Teal Trust (AI/Tech feel)
const C = {
  primary: "0F172A",    // deep navy
  secondary: "1E293B",  // dark slate
  accent: "0891B2",     // cyan/teal
  accentLight: "22D3EE", // light cyan
  bg: "F8FAFC",         // off-white
  bgDark: "0F172A",     // navy bg
  text: "1E293B",       // dark text
  textLight: "94A3B8",  // muted text
  white: "FFFFFF",
  card: "F1F5F9",       // card bg
  green: "10B981",
  orange: "F59E0B",
  red: "EF4444",
};

const FONT_H = "Arial Black";
const FONT_B = "Arial";

const makeShadow = () => ({ type: "outer", color: "000000", blur: 8, offset: 3, angle: 135, opacity: 0.1 });

async function main() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "Gorilla Knowledge";
  pres.title = "AI-101: AIの基本 — 仕組みと種類を理解する";

  const iconBrain = await iconToBase64Png(FaBrain, `#${C.accentLight}`, 256);
  const iconTarget = await iconToBase64Png(FaBullseye, `#${C.accent}`, 256);
  const iconRobot = await iconToBase64Png(FaRobot, `#${C.accent}`, 256);
  const iconCogs = await iconToBase64Png(FaCogs, `#${C.accent}`, 256);
  const iconDb = await iconToBase64Png(FaDatabase, `#${C.accent}`, 256);
  const iconMagic = await iconToBase64Png(FaMagic, `#${C.accent}`, 256);
  const iconBulb = await iconToBase64Png(FaLightbulb, `#${C.orange}`, 256);
  const iconWarn = await iconToBase64Png(FaExclamationTriangle, `#${C.orange}`, 256);
  const iconCheck = await iconToBase64Png(FaCheckCircle, `#${C.green}`, 256);
  const iconArrow = await iconToBase64Png(FaArrowRight, `#${C.accentLight}`, 256);
  const iconFile = await iconToBase64Png(FaFileAlt, `#${C.accent}`, 256);
  const iconSearch = await iconToBase64Png(FaSearch, `#${C.accent}`, 256);
  const iconChat = await iconToBase64Png(FaComments, `#${C.accent}`, 256);
  const iconShield = await iconToBase64Png(FaShieldAlt, `#${C.red}`, 256);
  const iconCopy = await iconToBase64Png(FaCopyright, `#${C.orange}`, 256);

  // ===== SLIDE 1: Title =====
  {
    const slide = pres.addSlide();
    slide.background = { color: C.bgDark };
    // Accent bar top
    slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accent } });
    // Icon
    slide.addImage({ data: iconBrain, x: 4.5, y: 0.7, w: 1, h: 1 });
    // Title
    slide.addText("AIの基本", {
      x: 0.5, y: 1.8, w: 9, h: 0.9,
      fontSize: 44, fontFace: FONT_H, color: C.white, align: "center", margin: 0
    });
    slide.addText("仕組みと種類を理解する", {
      x: 0.5, y: 2.7, w: 9, h: 0.6,
      fontSize: 22, fontFace: FONT_B, color: C.accentLight, align: "center", margin: 0
    });
    // Meta info
    slide.addText("AI-101  |  全社員向け入門  |  10分", {
      x: 0.5, y: 3.6, w: 9, h: 0.4,
      fontSize: 14, fontFace: FONT_B, color: C.textLight, align: "center", margin: 0
    });
    // Bottom bar
    slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.325, w: 10, h: 0.3, fill: { color: C.accent } });
  }

  // ===== SLIDE 2: Goals =====
  {
    const slide = pres.addSlide();
    slide.background = { color: C.bg };
    slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accent } });
    slide.addImage({ data: iconTarget, x: 0.5, y: 0.4, w: 0.45, h: 0.45 });
    slide.addText("今日のゴール", {
      x: 1.1, y: 0.35, w: 5, h: 0.55,
      fontSize: 28, fontFace: FONT_H, color: C.primary, margin: 0
    });

    const goals = [
      { num: "1", text: "AIとは何かを一言で説明できる" },
      { num: "2", text: "AIの3つの種類を区別できる" },
      { num: "3", text: "自分の業務でAIが使えそうな場面をイメージできる" },
    ];

    goals.forEach((g, i) => {
      const y = 1.3 + i * 1.3;
      slide.addShape(pres.shapes.RECTANGLE, { x: 0.8, y, w: 8.4, h: 1.05, fill: { color: C.white }, shadow: makeShadow() });
      slide.addShape(pres.shapes.RECTANGLE, { x: 0.8, y, w: 0.08, h: 1.05, fill: { color: C.accent } });
      slide.addText(g.num, {
        x: 1.15, y: y + 0.15, w: 0.6, h: 0.6,
        fontSize: 24, fontFace: FONT_H, color: C.white, align: "center", valign: "middle",
        fill: { color: C.accent }, shape: pres.shapes.OVAL
      });
      slide.addText(g.text, {
        x: 2.0, y, w: 6.8, h: 1.05,
        fontSize: 18, fontFace: FONT_B, color: C.text, valign: "middle", margin: 0
      });
    });
  }

  // ===== SLIDE 3: What is AI? =====
  {
    const slide = pres.addSlide();
    slide.background = { color: C.bg };
    slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accent } });
    slide.addImage({ data: iconRobot, x: 0.5, y: 0.4, w: 0.45, h: 0.45 });
    slide.addText("AIって結局なに?", {
      x: 1.1, y: 0.35, w: 5, h: 0.55,
      fontSize: 28, fontFace: FONT_H, color: C.primary, margin: 0
    });

    // Big definition card
    slide.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.2, w: 8.4, h: 1.2, fill: { color: C.primary }, shadow: makeShadow() });
    slide.addText("人間がやっていた「判断」を\nコンピュータにやらせる技術", {
      x: 0.8, y: 1.2, w: 8.4, h: 1.2,
      fontSize: 22, fontFace: FONT_H, color: C.white, align: "center", valign: "middle"
    });

    // Comparison: Human vs AI
    // Human side
    slide.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 2.8, w: 3.9, h: 2.2, fill: { color: C.white }, shadow: makeShadow() });
    slide.addText("人間", {
      x: 0.8, y: 2.85, w: 3.9, h: 0.5,
      fontSize: 18, fontFace: FONT_H, color: C.accent, align: "center", margin: 0
    });
    slide.addText([
      { text: "データを見る", options: { breakLine: true, fontSize: 14 } },
      { text: "  ↓", options: { breakLine: true, fontSize: 14, color: C.textLight } },
      { text: "考える", options: { breakLine: true, fontSize: 14 } },
      { text: "  ↓", options: { breakLine: true, fontSize: 14, color: C.textLight } },
      { text: "判断する", options: { fontSize: 14 } },
    ], { x: 0.8, y: 3.35, w: 3.9, h: 1.6, fontFace: FONT_B, color: C.text, align: "center", valign: "middle" });

    // Arrow
    slide.addImage({ data: iconArrow, x: 4.75, y: 3.6, w: 0.5, h: 0.5 });

    // AI side
    slide.addShape(pres.shapes.RECTANGLE, { x: 5.3, y: 2.8, w: 3.9, h: 2.2, fill: { color: C.white }, shadow: makeShadow() });
    slide.addText("AI", {
      x: 5.3, y: 2.85, w: 3.9, h: 0.5,
      fontSize: 18, fontFace: FONT_H, color: C.accent, align: "center", margin: 0
    });
    slide.addText([
      { text: "データを入れる", options: { breakLine: true, fontSize: 14 } },
      { text: "  ↓", options: { breakLine: true, fontSize: 14, color: C.textLight } },
      { text: "計算する", options: { breakLine: true, fontSize: 14 } },
      { text: "  ↓", options: { breakLine: true, fontSize: 14, color: C.textLight } },
      { text: "答えを出す", options: { fontSize: 14 } },
    ], { x: 5.3, y: 3.35, w: 3.9, h: 1.6, fontFace: FONT_B, color: C.text, align: "center", valign: "middle" });
  }

  // ===== SLIDE 4: 3 Types Overview =====
  {
    const slide = pres.addSlide();
    slide.background = { color: C.bgDark };
    slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accent } });
    slide.addText("AIの3つの種類", {
      x: 0.5, y: 0.3, w: 9, h: 0.6,
      fontSize: 28, fontFace: FONT_H, color: C.white, margin: 0
    });

    const types = [
      { icon: iconCogs, label: "ルールベースAI", sub: "人間がルールを書く", color: C.accent },
      { icon: iconDb, label: "機械学習AI", sub: "データからルールを学ぶ", color: C.green },
      { icon: iconMagic, label: "生成AI", sub: "新しいコンテンツを作る", color: C.orange },
    ];

    types.forEach((t, i) => {
      const x = 0.6 + i * 3.1;
      slide.addShape(pres.shapes.RECTANGLE, { x, y: 1.3, w: 2.8, h: 3.2, fill: { color: C.secondary }, shadow: makeShadow() });
      slide.addShape(pres.shapes.RECTANGLE, { x, y: 1.3, w: 2.8, h: 0.06, fill: { color: t.color } });
      slide.addImage({ data: t.icon, x: x + 1.05, y: 1.7, w: 0.7, h: 0.7 });
      slide.addText(t.label, {
        x, y: 2.6, w: 2.8, h: 0.5,
        fontSize: 16, fontFace: FONT_H, color: C.white, align: "center", margin: 0
      });
      slide.addText(t.sub, {
        x, y: 3.2, w: 2.8, h: 0.5,
        fontSize: 13, fontFace: FONT_B, color: C.textLight, align: "center", margin: 0
      });
    });

    // Arrow labels
    slide.addText("進化の流れ →", {
      x: 0.5, y: 4.8, w: 9, h: 0.4,
      fontSize: 13, fontFace: FONT_B, color: C.textLight, align: "center", margin: 0
    });
  }

  // ===== SLIDE 5: Rule-based AI =====
  {
    const slide = pres.addSlide();
    slide.background = { color: C.bg };
    slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accent } });
    slide.addImage({ data: iconCogs, x: 0.5, y: 0.4, w: 0.45, h: 0.45 });
    slide.addText("① ルールベースAI", {
      x: 1.1, y: 0.35, w: 6, h: 0.55,
      fontSize: 28, fontFace: FONT_H, color: C.primary, margin: 0
    });
    slide.addText("「もし〇〇なら△△する」をプログラムで書く", {
      x: 1.1, y: 0.9, w: 8, h: 0.4,
      fontSize: 14, fontFace: FONT_B, color: C.textLight, margin: 0
    });

    // Examples
    const examples = [
      { q: "「営業時間は?」", a: "→「9時〜18時です」", label: "チャットボット" },
      { q: "金額が10万円以上", a: "→ 部長承認が必要", label: "経費精算" },
      { q: "件名に「当選」を含む", a: "→ 迷惑メールへ", label: "メールフィルタ" },
    ];

    examples.forEach((e, i) => {
      const y = 1.6 + i * 0.9;
      slide.addShape(pres.shapes.RECTANGLE, { x: 0.8, y, w: 8.4, h: 0.75, fill: { color: C.white }, shadow: makeShadow() });
      slide.addText(e.label, {
        x: 1.0, y, w: 1.8, h: 0.75,
        fontSize: 13, fontFace: FONT_H, color: C.accent, valign: "middle", margin: 0
      });
      slide.addText(e.q + "  " + e.a, {
        x: 2.9, y, w: 6.0, h: 0.75,
        fontSize: 14, fontFace: FONT_B, color: C.text, valign: "middle", margin: 0
      });
    });

    // Pros/Cons
    slide.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 4.4, w: 4.0, h: 0.9, fill: { color: "ECFDF5" } });
    slide.addImage({ data: iconCheck, x: 0.95, y: 4.55, w: 0.35, h: 0.35 });
    slide.addText("動きが予測できる・説明しやすい", {
      x: 1.4, y: 4.4, w: 3.3, h: 0.9,
      fontSize: 13, fontFace: FONT_B, color: C.text, valign: "middle", margin: 0
    });

    slide.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 4.4, w: 4.0, h: 0.9, fill: { color: "FEF2F2" } });
    slide.addImage({ data: iconWarn, x: 5.35, y: 4.55, w: 0.35, h: 0.35 });
    slide.addText("ルールにないことは対応不可", {
      x: 5.8, y: 4.4, w: 3.3, h: 0.9,
      fontSize: 13, fontFace: FONT_B, color: C.text, valign: "middle", margin: 0
    });
  }

  // ===== SLIDE 6: Machine Learning =====
  {
    const slide = pres.addSlide();
    slide.background = { color: C.bg };
    slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.green } });
    slide.addImage({ data: iconDb, x: 0.5, y: 0.4, w: 0.45, h: 0.45 });
    slide.addText("② 機械学習AI", {
      x: 1.1, y: 0.35, w: 6, h: 0.55,
      fontSize: 28, fontFace: FONT_H, color: C.primary, margin: 0
    });
    slide.addText("データからパターンを自動で見つける", {
      x: 1.1, y: 0.9, w: 8, h: 0.4,
      fontSize: 14, fontFace: FONT_B, color: C.textLight, margin: 0
    });

    // Flow diagram
    const flowItems = ["大量のデータ", "学習", "パターン発見", "予測・分類"];
    flowItems.forEach((item, i) => {
      const x = 0.6 + i * 2.35;
      slide.addShape(pres.shapes.RECTANGLE, { x, y: 1.5, w: 2.0, h: 0.7, fill: { color: i === 3 ? C.green : C.accent } });
      slide.addText(item, {
        x, y: 1.5, w: 2.0, h: 0.7,
        fontSize: 13, fontFace: FONT_H, color: C.white, align: "center", valign: "middle"
      });
      if (i < 3) {
        slide.addText("→", {
          x: x + 2.0, y: 1.5, w: 0.35, h: 0.7,
          fontSize: 18, fontFace: FONT_B, color: C.textLight, align: "center", valign: "middle"
        });
      }
    });

    // Examples
    const mlExamples = [
      { label: "売上予測", desc: "過去の販売データ → 来月の売上を予測" },
      { label: "異常検知", desc: "工場のセンサー → 故障の予兆を検知" },
      { label: "レコメンド", desc: "購買履歴 → 「この商品もおすすめ」" },
    ];

    mlExamples.forEach((e, i) => {
      const y = 2.6 + i * 0.8;
      slide.addShape(pres.shapes.RECTANGLE, { x: 0.8, y, w: 8.4, h: 0.65, fill: { color: C.white }, shadow: makeShadow() });
      slide.addText(e.label, {
        x: 1.0, y, w: 1.6, h: 0.65,
        fontSize: 13, fontFace: FONT_H, color: C.green, valign: "middle", margin: 0
      });
      slide.addText(e.desc, {
        x: 2.7, y, w: 6.2, h: 0.65,
        fontSize: 14, fontFace: FONT_B, color: C.text, valign: "middle", margin: 0
      });
    });

    // Pros/Cons
    slide.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 4.6, w: 4.0, h: 0.8, fill: { color: "ECFDF5" } });
    slide.addImage({ data: iconCheck, x: 0.95, y: 4.7, w: 0.35, h: 0.35 });
    slide.addText("人間が気づかないパターンも発見", {
      x: 1.4, y: 4.6, w: 3.3, h: 0.8,
      fontSize: 13, fontFace: FONT_B, color: C.text, valign: "middle", margin: 0
    });

    slide.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 4.6, w: 4.0, h: 0.8, fill: { color: "FEF2F2" } });
    slide.addImage({ data: iconWarn, x: 5.35, y: 4.7, w: 0.35, h: 0.35 });
    slide.addText("なぜその答えか説明しにくい", {
      x: 5.8, y: 4.6, w: 3.3, h: 0.8,
      fontSize: 13, fontFace: FONT_B, color: C.text, valign: "middle", margin: 0
    });
  }

  // ===== SLIDE 7: Generative AI =====
  {
    const slide = pres.addSlide();
    slide.background = { color: C.bg };
    slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.orange } });
    slide.addImage({ data: iconMagic, x: 0.5, y: 0.4, w: 0.45, h: 0.45 });
    slide.addText("③ 生成AI", {
      x: 1.1, y: 0.25, w: 4, h: 0.55,
      fontSize: 28, fontFace: FONT_H, color: C.primary, margin: 0
    });
    slide.addText("← いま最も注目", {
      x: 3.5, y: 0.25, w: 3, h: 0.55,
      fontSize: 16, fontFace: FONT_H, color: C.orange, margin: 0
    });
    slide.addText("「新しいコンテンツ」を作り出せるAI", {
      x: 1.1, y: 0.8, w: 8, h: 0.4,
      fontSize: 14, fontFace: FONT_B, color: C.textLight, margin: 0
    });

    const genExamples = [
      { label: "文章生成", tools: "ChatGPT / Claude", desc: "メール文、議事録要約、企画書のたたき台" },
      { label: "画像生成", tools: "Midjourney / DALL-E", desc: "デザイン案、イメージ画像" },
      { label: "コード生成", tools: "GitHub Copilot", desc: "プログラムの自動生成" },
    ];

    genExamples.forEach((e, i) => {
      const y = 1.5 + i * 1.1;
      slide.addShape(pres.shapes.RECTANGLE, { x: 0.8, y, w: 8.4, h: 0.9, fill: { color: C.white }, shadow: makeShadow() });
      slide.addShape(pres.shapes.RECTANGLE, { x: 0.8, y, w: 0.08, h: 0.9, fill: { color: C.orange } });
      slide.addText(e.label, {
        x: 1.1, y, w: 1.5, h: 0.45,
        fontSize: 15, fontFace: FONT_H, color: C.primary, valign: "bottom", margin: 0
      });
      slide.addText(e.tools, {
        x: 1.1, y: y + 0.45, w: 1.5, h: 0.4,
        fontSize: 11, fontFace: FONT_B, color: C.textLight, valign: "top", margin: 0
      });
      slide.addText(e.desc, {
        x: 2.8, y, w: 6.2, h: 0.9,
        fontSize: 14, fontFace: FONT_B, color: C.text, valign: "middle", margin: 0
      });
    });

    // Callout
    slide.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 4.6, w: 8.4, h: 0.8, fill: { color: "FFFBEB" } });
    slide.addImage({ data: iconBulb, x: 0.95, y: 4.7, w: 0.35, h: 0.35 });
    slide.addText("2022年末〜爆発的に普及。業務への影響が最も大きい領域", {
      x: 1.5, y: 4.6, w: 7.5, h: 0.8,
      fontSize: 14, fontFace: FONT_B, color: C.text, valign: "middle", margin: 0
    });
  }

  // ===== SLIDE 8: 3 Types Comparison =====
  {
    const slide = pres.addSlide();
    slide.background = { color: C.bgDark };
    slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accent } });
    slide.addText("3つの種類まとめ", {
      x: 0.5, y: 0.3, w: 9, h: 0.6,
      fontSize: 28, fontFace: FONT_H, color: C.white, margin: 0
    });

    const headers = ["", "ルールベース", "機械学習", "生成AI"];
    const rows = [
      ["やり方", "人間がルールを書く", "データから学ぶ", "データから学んで作る"],
      ["得意なこと", "決まった応答", "予測・分類", "新規コンテンツ生成"],
      ["身近な例", "チャットボット", "レコメンド", "ChatGPT"],
      ["難易度", "低", "中", "高"],
    ];

    const colW = [1.8, 2.5, 2.5, 2.5];
    const startX = 0.6;
    const startY = 1.2;
    const rowH = 0.8;

    // Header row
    let cx = startX;
    headers.forEach((h, i) => {
      slide.addShape(pres.shapes.RECTANGLE, { x: cx, y: startY, w: colW[i], h: rowH, fill: { color: C.accent } });
      slide.addText(h, {
        x: cx, y: startY, w: colW[i], h: rowH,
        fontSize: 14, fontFace: FONT_H, color: C.white, align: "center", valign: "middle"
      });
      cx += colW[i] + 0.05;
    });

    // Data rows
    rows.forEach((row, ri) => {
      cx = startX;
      const ry = startY + (ri + 1) * (rowH + 0.05);
      row.forEach((cell, ci) => {
        const bgColor = ci === 0 ? C.secondary : "1A2332";
        slide.addShape(pres.shapes.RECTANGLE, { x: cx, y: ry, w: colW[ci], h: rowH, fill: { color: bgColor } });
        slide.addText(cell, {
          x: cx, y: ry, w: colW[ci], h: rowH,
          fontSize: ci === 0 ? 13 : 14,
          fontFace: ci === 0 ? FONT_H : FONT_B,
          color: ci === 0 ? C.accentLight : C.white,
          align: "center", valign: "middle"
        });
        cx += colW[ci] + 0.05;
      });
    });
  }

  // ===== SLIDE 9: Business Use Cases =====
  {
    const slide = pres.addSlide();
    slide.background = { color: C.bg };
    slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accent } });
    slide.addImage({ data: iconBulb, x: 0.5, y: 0.4, w: 0.45, h: 0.45 });
    slide.addText("あなたの業務ではどう使える?", {
      x: 1.1, y: 0.35, w: 7, h: 0.55,
      fontSize: 26, fontFace: FONT_H, color: C.primary, margin: 0
    });

    const useCases = [
      { icon: iconFile, label: "文書作成", desc: "メール下書き、報告書の要約、翻訳" },
      { icon: iconSearch, label: "情報整理", desc: "議事録作成、データの分類・集計" },
      { icon: iconChat, label: "アイデア出し", desc: "企画のブレスト、キャッチコピー案" },
      { icon: iconDb, label: "調査・リサーチ", desc: "市場調査の要約、競合分析の補助" },
    ];

    useCases.forEach((u, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = 0.6 + col * 4.6;
      const y = 1.2 + row * 1.7;

      slide.addShape(pres.shapes.RECTANGLE, { x, y, w: 4.2, h: 1.4, fill: { color: C.white }, shadow: makeShadow() });
      slide.addImage({ data: u.icon, x: x + 0.2, y: y + 0.3, w: 0.5, h: 0.5 });
      slide.addText(u.label, {
        x: x + 0.9, y: y + 0.15, w: 3.0, h: 0.5,
        fontSize: 16, fontFace: FONT_H, color: C.primary, valign: "middle", margin: 0
      });
      slide.addText(u.desc, {
        x: x + 0.9, y: y + 0.7, w: 3.0, h: 0.5,
        fontSize: 13, fontFace: FONT_B, color: C.textLight, valign: "top", margin: 0
      });
    });

    // Key message
    slide.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 4.6, w: 8.8, h: 0.8, fill: { color: "EFF6FF" } });
    slide.addText("「AIに全部任せる」のではなく「AIに下書きさせて人間が仕上げる」が基本", {
      x: 0.8, y: 4.6, w: 8.4, h: 0.8,
      fontSize: 14, fontFace: FONT_H, color: C.accent, align: "center", valign: "middle"
    });
  }

  // ===== SLIDE 10: Cautions =====
  {
    const slide = pres.addSlide();
    slide.background = { color: C.bg };
    slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.red } });
    slide.addImage({ data: iconWarn, x: 0.5, y: 0.4, w: 0.45, h: 0.45 });
    slide.addText("AIを使うときの3つの注意点", {
      x: 1.1, y: 0.35, w: 7, h: 0.55,
      fontSize: 26, fontFace: FONT_H, color: C.primary, margin: 0
    });

    const cautions = [
      { icon: iconShield, num: "1", title: "機密情報を入れない", desc: "社外のAIサービスに顧客情報や社内機密を入力しない\n会社のAI利用ルールを確認すること", color: C.red },
      { icon: iconWarn, num: "2", title: "答えを鵜呑みにしない", desc: "AIは自信満々に間違えることがある（ハルシネーション）\n必ず人間がファクトチェックする", color: C.orange },
      { icon: iconCopy, num: "3", title: "著作権に注意する", desc: "AI生成物の著作権は法的にグレーな部分がある\nそのまま外部公開する場合は上長に確認", color: C.orange },
    ];

    cautions.forEach((c, i) => {
      const y = 1.2 + i * 1.35;
      slide.addShape(pres.shapes.RECTANGLE, { x: 0.8, y, w: 8.4, h: 1.15, fill: { color: C.white }, shadow: makeShadow() });
      slide.addShape(pres.shapes.RECTANGLE, { x: 0.8, y, w: 0.08, h: 1.15, fill: { color: c.color } });
      slide.addText(c.num, {
        x: 1.1, y: y + 0.2, w: 0.55, h: 0.55,
        fontSize: 22, fontFace: FONT_H, color: C.white, align: "center", valign: "middle",
        fill: { color: c.color }, shape: pres.shapes.OVAL
      });
      slide.addText(c.title, {
        x: 1.9, y: y + 0.05, w: 7.0, h: 0.45,
        fontSize: 17, fontFace: FONT_H, color: C.primary, valign: "middle", margin: 0
      });
      slide.addText(c.desc, {
        x: 1.9, y: y + 0.5, w: 7.0, h: 0.6,
        fontSize: 12, fontFace: FONT_B, color: C.textLight, valign: "top", margin: 0
      });
    });
  }

  // ===== SLIDE 11: Summary =====
  {
    const slide = pres.addSlide();
    slide.background = { color: C.bgDark };
    slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accent } });
    slide.addImage({ data: iconCheck, x: 4.5, y: 0.4, w: 0.6, h: 0.6 });
    slide.addText("今日のまとめ", {
      x: 0.5, y: 1.0, w: 9, h: 0.6,
      fontSize: 30, fontFace: FONT_H, color: C.white, align: "center", margin: 0
    });

    const summaryItems = [
      { label: "AIとは", text: "「人間の判断をコンピュータにやらせる技術」" },
      { label: "3つの種類", text: "ルールベース → 機械学習 → 生成AI" },
      { label: "業務活用", text: "下書き・要約・アイデア出し・リサーチに有効" },
      { label: "注意点", text: "機密情報NG / 鵜呑みNG / 著作権に注意" },
    ];

    summaryItems.forEach((s, i) => {
      const y = 1.9 + i * 0.85;
      slide.addShape(pres.shapes.RECTANGLE, { x: 1.0, y, w: 8.0, h: 0.7, fill: { color: C.secondary } });
      slide.addText(s.label, {
        x: 1.2, y, w: 1.8, h: 0.7,
        fontSize: 14, fontFace: FONT_H, color: C.accentLight, valign: "middle", margin: 0
      });
      slide.addText(s.text, {
        x: 3.0, y, w: 5.8, h: 0.7,
        fontSize: 14, fontFace: FONT_B, color: C.white, valign: "middle", margin: 0
      });
    });
  }

  // ===== SLIDE 12: Next Steps =====
  {
    const slide = pres.addSlide();
    slide.background = { color: C.bgDark };
    slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accent } });

    slide.addText("お疲れさまでした!", {
      x: 0.5, y: 1.0, w: 9, h: 0.7,
      fontSize: 32, fontFace: FONT_H, color: C.white, align: "center", margin: 0
    });

    // Test info card
    slide.addShape(pres.shapes.RECTANGLE, { x: 2.0, y: 2.0, w: 6.0, h: 2.2, fill: { color: C.secondary }, shadow: makeShadow() });
    slide.addShape(pres.shapes.RECTANGLE, { x: 2.0, y: 2.0, w: 6.0, h: 0.06, fill: { color: C.accent } });

    slide.addText("確認テスト（5問）", {
      x: 2.0, y: 2.2, w: 6.0, h: 0.6,
      fontSize: 20, fontFace: FONT_H, color: C.white, align: "center", margin: 0
    });
    slide.addText("80%以上の正答で修了です", {
      x: 2.0, y: 2.8, w: 6.0, h: 0.5,
      fontSize: 16, fontFace: FONT_B, color: C.accentLight, align: "center", margin: 0
    });
    slide.addText("次の動画: AI-102 生成AIでできること・できないこと", {
      x: 2.0, y: 3.5, w: 6.0, h: 0.5,
      fontSize: 13, fontFace: FONT_B, color: C.textLight, align: "center", margin: 0
    });

    // Bottom bar
    slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.325, w: 10, h: 0.3, fill: { color: C.accent } });
  }

  const outputPath = "/Users/kurosakiyuto/Downloads/開発/gorilla-knowledge/黒崎/AI研修一覧/AI-101_AIの基本/スライド.pptx";
  await pres.writeFile({ fileName: outputPath });
  console.log("Generated:", outputPath);
}

main().catch(console.error);
