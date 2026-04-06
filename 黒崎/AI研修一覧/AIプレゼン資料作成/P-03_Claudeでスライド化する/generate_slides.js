const pptxgen = require("pptxgenjs");

// =====================================================
// DESIGN SYSTEM (navy:1B2A4A, accent:2563EB, Calibri, 10x5.625)
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
    hero: 40, h1: 32, h2: 22, h3: 18, body: 16, label: 13, caption: 11, tag: 10,
  }
};

const L = { W: 10, H: 5.625, mx: 0.75, my: 0.5, gap: 0.3 };

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
    fontSize: F.size.caption, fontFace: F.sans, color: C.textMuted, align: "right"
  });
  slide.addText("P-03", {
    x: L.mx, y: L.H - 0.38, w: 2, h: 0.3,
    fontSize: F.size.caption, fontFace: F.sans, color: C.textMuted, align: "left"
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
    color: C.textDark
  });
}

function addCard(slide, pres, x, y, w, h, opts = {}) {
  const fill = opts.fill || C.offWhite;
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h, fill: { color: fill },
    line: { color: C.border, width: 0.5 }, rectRadius: 0.08
  });
  if (opts.borderTop) {
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y, w, h: 0.04, fill: { color: opts.borderTop }, rectRadius: 0.02
    });
  }
}

function addNumberCircle(slide, pres, x, y, num, color) {
  color = color || C.accent;
  slide.addShape(pres.shapes.OVAL, {
    x, y, w: 0.35, h: 0.35, fill: { color }
  });
  slide.addText(`${num}`, {
    x, y, w: 0.35, h: 0.35,
    fontSize: F.size.label, fontFace: F.sans, bold: true,
    color: C.white, align: "center", valign: "middle"
  });
}

async function main() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "Gorilla Knowledge";
  pres.title = "P-03: Claudeでスライド資料をビジュアル化する";

  const T = 12;

  // ============================================================
  // SLIDE 1: TITLE (navy)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };

    s.addText("Claudeでスライドを\nビジュアル化する", {
      x: 0.5, y: 1.2, w: 9, h: 1.4,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center", lineSpacingMultiple: 1.2
    });

    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 2.85, w: 3, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });

    s.addText("AIプレゼン資料作成  |  P-03", {
      x: 0.5, y: 3.1, w: 9, h: 0.5,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center"
    });

    s.addText("P-03   |   Claudeでスライド資料をビジュアル化する   |   約12分", {
      x: 0.5, y: 4.2, w: 9, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textMuted, align: "center"
    });
  }

  // ============================================================
  // SLIDE 2: TODAY'S GOAL
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "今日のゴール", pres);
    addFooter(s, 2, T, pres);

    const goals = [
      "「シンプルで見やすい」デザインの4原則を理解し、自分のスライドに適用できる",
      "Claudeにスライド生成を指示するプロンプトが書ける",
      "出力形式（Markdown、HTML、PPTX）の特徴と使い分けがわかる",
      "デザインの対話修正で、スライドの品質を段階的に高められる",
    ];

    goals.forEach((g, i) => {
      const y = 1.15 + i * 0.85;
      addCard(s, pres, L.mx, y, L.W - L.mx * 2, 0.7, { borderTop: C.accent });
      addNumberCircle(s, pres, L.mx + 0.15, y + 0.18, i + 1);
      s.addText(g, {
        x: L.mx + 0.65, y: y + 0.1, w: 7.5, h: 0.5,
        fontSize: F.size.body, fontFace: F.sans, color: C.textBody
      });
    });
  }

  // ============================================================
  // SLIDE 3: DESIGN 4 PRINCIPLES
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "「シンプルで見やすい」デザインの4原則", pres);
    addFooter(s, 3, T, pres);

    const principles = [
      { num: "\u2460", title: "余白たっぷり", desc: "情報を詰め込まない\n余白は「読みやすさ」を生む", color: C.accent },
      { num: "\u2461", title: "1スライド1メッセージ", desc: "1枚に言いたいことは\n1つだけ", color: C.green },
      { num: "\u2462", title: "色は2-3色", desc: "ベース色＋アクセント色\nだけで十分", color: C.amber },
      { num: "\u2463", title: "フォント統一", desc: "フォントは1種類\nサイズは3段階まで", color: C.navyLight },
    ];

    principles.forEach((p, i) => {
      const x = L.mx + i * 2.15;
      addCard(s, pres, x, 1.2, 1.95, 2.8, { fill: C.white, borderTop: p.color });

      s.addText(p.num, {
        x, y: 1.4, w: 1.95, h: 0.6,
        fontSize: 32, fontFace: F.sans, align: "center", valign: "middle", color: p.color
      });

      s.addText(p.title, {
        x: x + 0.1, y: 2.05, w: 1.75, h: 0.45,
        fontSize: F.size.h3, fontFace: F.sans, bold: true, color: C.textDark, align: "center"
      });

      s.addText(p.desc, {
        x: x + 0.1, y: 2.55, w: 1.75, h: 0.9,
        fontSize: F.size.label, fontFace: F.sans, color: C.textBody, align: "center"
      });
    });

    // Bottom message
    addCard(s, pres, L.mx, 4.2, L.W - L.mx * 2, 0.5, { fill: C.accentLight });
    s.addText("この講座のスライドも、まさにこの4原則で作られています", {
      x: L.mx, y: 4.2, w: L.W - L.mx * 2, h: 0.5,
      fontSize: F.size.body, fontFace: F.sans, bold: true, color: C.accent, align: "center", valign: "middle"
    });
  }

  // ============================================================
  // SLIDE 4: PROMPT TEMPLATE
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "Claudeへのスライド生成プロンプト", pres);
    addFooter(s, 4, T, pres);

    // Prompt block
    addCard(s, pres, L.mx, 1.15, L.W - L.mx * 2, 2.5, { fill: C.lightGray });

    const promptLines = [
      "以下の構成でスライド資料を作ってください。",
      "",
      "\u30FB1スライド1メッセージ",
      "\u30FB箇条書きは3\uFF5E5個まで",
      "\u30FB色はネイビー\uFF0B白\uFF0Bアクセント青",
      "\u30FB余白を十分に取る",
      "\u30FB\u30D5\u30A9\u30F3\u30C8\u306F\u30B4\u30B7\u30C3\u30AF\u4F53\u3067\u7D71\u4E00",
    ];

    s.addText(promptLines.join("\n"), {
      x: L.mx + 0.3, y: 1.25, w: 7.9, h: 2.3,
      fontSize: F.size.body, fontFace: F.sans, color: C.textDark,
      lineSpacingMultiple: 1.4
    });

    // Point callout
    addCard(s, pres, L.mx, 3.9, L.W - L.mx * 2, 0.7, { fill: C.navy });
    s.addText("\u2728 \u30DD\u30A4\u30F3\u30C8: \u30C7\u30B6\u30A4\u30F3\u306E4\u539F\u5247\u3092\u305D\u306E\u307E\u307E\u30D7\u30ED\u30F3\u30D7\u30C8\u306B\u542B\u3081\u308B", {
      x: L.mx, y: 3.9, w: L.W - L.mx * 2, h: 0.7,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.white, align: "center", valign: "middle"
    });
  }

  // ============================================================
  // SLIDE 5: DEMO 1 - Claude slide generation
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addFooter(s, 5, T, pres);

    // Demo badge
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.45, w: 1.6, h: 0.3,
      fill: { color: C.red }, rectRadius: 0.15
    });
    s.addText("\u25B6 \u5B9F\u6F14\u30D1\u30FC\u30C8", {
      x: L.mx, y: 0.45, w: 1.6, h: 0.3,
      fontSize: F.size.tag, fontFace: F.sans, bold: true,
      color: C.white, align: "center", valign: "middle"
    });

    s.addText("Claude\u306B\u30B9\u30E9\u30A4\u30C9\u8CC7\u6599\u3092\u4F5C\u3089\u305B\u308B", {
      x: L.mx, y: 0.85, w: 8.5, h: 0.55,
      fontSize: F.size.h1, fontFace: F.sans, bold: true,
      color: C.textDark
    });

    s.addText("\u69CB\u6210\u2192\u30B9\u30E9\u30A4\u30C9\u3078\u306E\u5909\u63DB\u3092\u5B9F\u6F14\u3057\u307E\u3059", {
      x: L.mx, y: 1.45, w: 8, h: 0.35,
      fontSize: F.size.body, fontFace: F.sans, color: C.textLight
    });

    const steps = [
      { num: "1", text: "P-02\u3067\u4F5C\u3063\u305F\u69CB\u6210\u3092Claude\u306B\u6E21\u3059" },
      { num: "2", text: "\u30C7\u30B6\u30A4\u30F3\u30EB\u30FC\u30EB\u3092\u542B\u3080\u30D7\u30ED\u30F3\u30D7\u30C8\u3092\u5165\u529B" },
      { num: "3", text: "\u751F\u6210\u3055\u308C\u305F\u30B9\u30E9\u30A4\u30C9\u3092\u78BA\u8A8D\u3059\u308B" },
    ];

    steps.forEach((step, i) => {
      const y = 2.0 + i * 0.7;
      addCard(s, pres, L.mx, y, L.W - L.mx * 2, 0.6, { fill: C.offWhite, borderTop: C.accent });
      addNumberCircle(s, pres, L.mx + 0.15, y + 0.13, step.num);
      s.addText(step.text, {
        x: L.mx + 0.65, y: y + 0.05, w: 7.5, h: 0.5,
        fontSize: F.size.body, fontFace: F.sans, color: C.textBody
      });
    });

    // Bottom hint
    addCard(s, pres, L.mx, 4.2, L.W - L.mx * 2, 0.5, { fill: C.amberBg });
    s.addText("\u624B\u52D5\u30671\u679A\u305A\u3064\u4F5C\u3063\u3066\u3044\u305F\u3089\u4F55\u6642\u9593\u3082\u304B\u304B\u308B\u4F5C\u696D\u304C\u3001\u6570\u5341\u79D2\u3067\u5B8C\u4E86", {
      x: L.mx, y: 4.2, w: L.W - L.mx * 2, h: 0.5,
      fontSize: F.size.body, fontFace: F.sans, bold: true, color: C.amber, align: "center", valign: "middle"
    });
  }

  // ============================================================
  // SLIDE 6: OUTPUT FORMAT COMPARISON
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "\u51FA\u529B\u5F62\u5F0F\u306E\u9078\u3073\u65B9", pres);
    addFooter(s, 6, T, pres);

    const formats = [
      {
        name: "Markdown\n\u2192 PPTX\u5909\u63DB", sub: "Marp\u306A\u3069\u3067\u5909\u63DB",
        features: ["\u30C6\u30AD\u30B9\u30C8\u4E2D\u5FC3\u306E\u8CC7\u6599\u5411\u3051", "\u624B\u8EFD\u3055\u25CE"],
        color: C.accent
      },
      {
        name: "HTML\n\u76F4\u63A5\u51FA\u529B", sub: "\u30D6\u30E9\u30A6\u30B6\u3067\u8868\u793A",
        features: ["\u30AB\u30B9\u30BF\u30DE\u30A4\u30BA\u81EA\u7531\u5EA6\u6700\u9AD8", "\u30A2\u30CB\u30E1\u30FC\u30B7\u30E7\u30F3\u5BFE\u5FDC"],
        color: C.green
      },
      {
        name: "\u30C6\u30AD\u30B9\u30C8\u30D9\u30FC\u30B9\n\u2192 \u624B\u52D5\u4ED5\u4E0A\u3052", sub: "PowerPoint\u306B\u6D41\u3057\u8FBC\u307F",
        features: ["\u65E2\u5B58\u30C6\u30F3\u30D7\u30EC\u30FC\u30C8\u6D3B\u7528", "\u793E\u5185\u5171\u6709\u5411\u3051"],
        color: C.amber
      },
    ];

    formats.forEach((f, i) => {
      const x = L.mx + i * 2.9;
      addCard(s, pres, x, 1.2, 2.6, 3.0, { fill: C.white, borderTop: f.color });

      s.addText(f.name, {
        x: x + 0.1, y: 1.4, w: 2.4, h: 0.7,
        fontSize: F.size.h3, fontFace: F.sans, bold: true, color: C.textDark, align: "center"
      });

      s.addText(f.sub, {
        x: x + 0.1, y: 2.15, w: 2.4, h: 0.3,
        fontSize: F.size.label, fontFace: F.sans, color: f.color, align: "center"
      });

      f.features.forEach((feat, fi) => {
        s.addText("\u2022 " + feat, {
          x: x + 0.25, y: 2.55 + fi * 0.4, w: 2.1, h: 0.35,
          fontSize: F.size.label, fontFace: F.sans, color: C.textBody
        });
      });
    });

    // Bottom
    addCard(s, pres, L.mx, 4.4, L.W - L.mx * 2, 0.45, { fill: C.lightGray });
    s.addText("\u7528\u9014\u306B\u5408\u308F\u305B\u3066\u9078\u3076 \u2014 \u6B63\u89E3\u306F1\u3064\u3067\u306F\u306A\u3044", {
      x: L.mx, y: 4.4, w: L.W - L.mx * 2, h: 0.45,
      fontSize: F.size.body, fontFace: F.sans, color: C.textLight, align: "center", valign: "middle"
    });
  }

  // ============================================================
  // SLIDE 7: DESIGN INSTRUCTION TIPS
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "\u30C7\u30B6\u30A4\u30F3\u6307\u793A\u306E\u30B3\u30C4", pres);
    addFooter(s, 7, T, pres);

    const approaches = [
      {
        title: "\u30C8\u30FC\u30F3\u6307\u5B9A",
        examples: "\u300C\u30B3\u30F3\u30B5\u30EB\u54C1\u8CEA\u3067\u300D\n\u300CMcKinsey\u98A8\u306B\u300D\n\u300CApple\u98A8\u306B\u30DF\u30CB\u30DE\u30EB\u3067\u300D",
        color: C.accent
      },
      {
        title: "\u30AB\u30E9\u30FC\u6307\u5B9A",
        examples: "\u300C\u30CD\u30A4\u30D3\u30FC\uFF0B\u767D\uFF0B\u30A2\u30AF\u30BB\u30F3\u30C8\u9752\u3067\u300D\n\u300C\u30E2\u30CE\u30C8\u30FC\u30F3\u3067\u300D\n\u300C\u6696\u8272\u7CFB\u3067\u300D",
        color: C.green
      },
      {
        title: "\u30EC\u30A4\u30A2\u30A6\u30C8\u6307\u5B9A",
        examples: "\u300C2\u30AB\u30E9\u30E0\u3067\u4E26\u3079\u3066\u300D\n\u300C\u30AB\u30FC\u30C9\u30EC\u30A4\u30A2\u30A6\u30C8\u3067\u300D\n\u300C\u4F59\u767D\u3092\u591A\u3081\u306B\u300D",
        color: C.amber
      },
    ];

    approaches.forEach((a, i) => {
      const x = L.mx + i * 2.9;
      addCard(s, pres, x, 1.2, 2.6, 2.6, { fill: C.white, borderTop: a.color });

      s.addText(a.title, {
        x: x + 0.1, y: 1.4, w: 2.4, h: 0.4,
        fontSize: F.size.h3, fontFace: F.sans, bold: true, color: C.textDark, align: "center"
      });

      s.addText(a.examples, {
        x: x + 0.2, y: 1.9, w: 2.2, h: 1.6,
        fontSize: F.size.label, fontFace: F.sans, color: C.textBody, align: "center",
        lineSpacingMultiple: 1.4
      });
    });

    // Bottom
    addCard(s, pres, L.mx, 4.1, L.W - L.mx * 2, 0.6, { fill: C.navy });
    s.addText("\u5177\u4F53\u7684\u306A\u53C2\u7167\u5148\u3092\u793A\u3059\u3068\u3001Claude\u306E\u51FA\u529B\u7CBE\u5EA6\u304C\u683C\u6BB5\u306B\u4E0A\u304C\u308B", {
      x: L.mx, y: 4.1, w: L.W - L.mx * 2, h: 0.6,
      fontSize: F.size.h3, fontFace: F.sans, bold: true, color: C.white, align: "center", valign: "middle"
    });
  }

  // ============================================================
  // SLIDE 8: DEMO 2 - Design iteration
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addFooter(s, 8, T, pres);

    // Demo badge
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.45, w: 1.6, h: 0.3,
      fill: { color: C.red }, rectRadius: 0.15
    });
    s.addText("\u25B6 \u5B9F\u6F14\u30D1\u30FC\u30C8", {
      x: L.mx, y: 0.45, w: 1.6, h: 0.3,
      fontSize: F.size.tag, fontFace: F.sans, bold: true,
      color: C.white, align: "center", valign: "middle"
    });

    s.addText("\u30C7\u30B6\u30A4\u30F3\u306E\u5BFE\u8A71\u4FEE\u6B63", {
      x: L.mx, y: 0.85, w: 8.5, h: 0.55,
      fontSize: F.size.h1, fontFace: F.sans, bold: true,
      color: C.textDark
    });

    s.addText("\u751F\u6210\u2192\u30D5\u30A3\u30FC\u30C9\u30D0\u30C3\u30AF\u2192\u6539\u5584\u306E\u6D41\u308C\u3092\u5B9F\u6F14", {
      x: L.mx, y: 1.45, w: 8, h: 0.35,
      fontSize: F.size.body, fontFace: F.sans, color: C.textLight
    });

    const demos = [
      { num: "1", text: "\u300C\u3082\u3063\u3068\u4F59\u767D\u3092\u5E83\u3052\u3066\u300D", color: C.accent },
      { num: "2", text: "\u300C\u3053\u306E\u90E8\u5206\u3092\u30C6\u30FC\u30D6\u30EB\u3067\u6574\u7406\u3057\u3066\u300D", color: C.green },
      { num: "3", text: "\u300C\u30D5\u30ED\u30FC\u56F3\u3067\u8868\u73FE\u3057\u3066\u300D", color: C.amber },
    ];

    demos.forEach((d, i) => {
      const y = 2.0 + i * 0.7;
      addCard(s, pres, L.mx, y, L.W - L.mx * 2, 0.6, { fill: C.offWhite, borderTop: d.color });
      addNumberCircle(s, pres, L.mx + 0.15, y + 0.13, d.num, d.color);
      s.addText(d.text, {
        x: L.mx + 0.65, y: y + 0.05, w: 7.5, h: 0.5,
        fontSize: F.size.h3, fontFace: F.sans, color: C.textDark
      });
    });

    // Bottom
    addCard(s, pres, L.mx, 4.2, L.W - L.mx * 2, 0.5, { fill: C.greenBg });
    s.addText("1\u56DE\u3067\u5B8C\u6210\u3055\u305B\u305A\u3001\u5BFE\u8A71\u3067\u80B2\u3066\u308B\u306E\u304C\u6975\u610F", {
      x: L.mx, y: 4.2, w: L.W - L.mx * 2, h: 0.5,
      fontSize: F.size.body, fontFace: F.sans, bold: true, color: C.green, align: "center", valign: "middle"
    });
  }

  // ============================================================
  // SLIDE 9: CHART / DIAGRAM INSTRUCTIONS
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "\u56F3\u89E3\u30FB\u30C1\u30E3\u30FC\u30C8\u306E\u6307\u793A\u65B9\u6CD5", pres);
    addFooter(s, 9, T, pres);

    const diagrams = [
      { title: "\u6BD4\u8F03\u8868", desc: "\u300CA\u3068B\u3092\u6BD4\u8F03\u8868\u3067\u300D\n\u300C3\u6848\u3092\u4E26\u3079\u3066\u300D", color: C.accent },
      { title: "\u30D5\u30ED\u30FC\u56F3", desc: "\u300C\u624B\u9806\u3092\u30D5\u30ED\u30FC\u56F3\u3067\u300D\n\u300C\u30D7\u30ED\u30BB\u30B9\u3092\u77E2\u5370\u3067\u300D", color: C.green },
      { title: "2x2\u30DE\u30C8\u30EA\u30AF\u30B9", desc: "\u300C\u91CD\u8981\u5EA6\u00D7\u7DCA\u6025\u5EA6\u3067\u5206\u985E\u300D\n\u300C\u30B3\u30B9\u30C8\u00D7\u52B9\u679C\u3067\u6574\u7406\u300D", color: C.amber },
      { title: "Before/After", desc: "\u300C\u5C0E\u5165\u524D\u3068\u5C0E\u5165\u5F8C\u3092\u5BFE\u6BD4\u300D\n\u300C\u5909\u5316\u3092\u898B\u305B\u3066\u300D", color: C.navyLight },
    ];

    diagrams.forEach((d, i) => {
      const x = L.mx + i * 2.15;
      addCard(s, pres, x, 1.2, 1.95, 2.5, { fill: C.white, borderTop: d.color });

      s.addText(d.title, {
        x: x + 0.1, y: 1.4, w: 1.75, h: 0.45,
        fontSize: F.size.h3, fontFace: F.sans, bold: true, color: C.textDark, align: "center"
      });

      s.addText(d.desc, {
        x: x + 0.1, y: 1.95, w: 1.75, h: 1.2,
        fontSize: F.size.label, fontFace: F.sans, color: C.textBody, align: "center",
        lineSpacingMultiple: 1.3
      });
    });

    // Bottom
    addCard(s, pres, L.mx, 4.0, L.W - L.mx * 2, 0.6, { fill: C.accentLight });
    s.addText("\u56F3\u89E3\u30921\u679A\u5165\u308C\u308B\u3060\u3051\u3067\u3001\u805E\u304D\u624B\u306E\u7406\u89E3\u5EA6\u3068\u6E80\u8DB3\u5EA6\u304C\u5927\u304D\u304F\u4E0A\u304C\u308B", {
      x: L.mx, y: 4.0, w: L.W - L.mx * 2, h: 0.6,
      fontSize: F.size.h3, fontFace: F.sans, bold: true, color: C.accent, align: "center", valign: "middle"
    });
  }

  // ============================================================
  // SLIDE 10: COMMON MISTAKES
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "\u3088\u304F\u3042\u308B\u5931\u6557\u3068\u5BFE\u7B56", pres);
    addFooter(s, 10, T, pres);

    const mistakes = [
      { fail: "\u30C6\u30AD\u30B9\u30C8\u8A70\u3081\u8FBC\u307F\u3059\u304E", fix: "\u300C\u7B87\u6761\u66F8\u304D\u306F3\u884C\u4EE5\u5185\u3067\u300D\n\u300C1\u30B9\u30E9\u30A4\u30C91\u30E1\u30C3\u30BB\u30FC\u30B8\u300D", color: C.red },
      { fail: "\u8272\u3092\u4F7F\u3044\u3059\u304E", fix: "\u300C2\u8272\u3067\u7D71\u4E00\u3057\u3066\u300D\n\u300C\u30A2\u30AF\u30BB\u30F3\u30C8\u306F1\u8272\u3060\u3051\u300D", color: C.amber },
      { fail: "\u30D5\u30A9\u30F3\u30C8\u304C\u30D0\u30E9\u30D0\u30E9", fix: "\u300C\u30B4\u30B7\u30C3\u30AF\u4F53\u3067\u7D71\u4E00\u300D\n\u300C\u30B5\u30A4\u30BA\u306F3\u6BB5\u968E\u300D", color: C.accent },
      { fail: "\u4F59\u767D\u304C\u306A\u3044", fix: "\u300C\u30D1\u30C7\u30A3\u30F3\u30B040px\u4EE5\u4E0A\u300D\n\u300C\u8981\u7D20\u9593\u306B\u30B9\u30DA\u30FC\u30B9\u3092\u300D", color: C.navyLight },
    ];

    // Table header
    const tblY = 1.15;
    const totalW = L.W - L.mx * 2;
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: tblY, w: totalW, h: 0.45,
      fill: { color: C.navy }, rectRadius: 0.05
    });
    s.addText("\u5931\u6557\u30D1\u30BF\u30FC\u30F3", {
      x: L.mx + 0.15, y: tblY, w: 3.5, h: 0.45,
      fontSize: F.size.label, fontFace: F.sans, bold: true, color: C.white, valign: "middle"
    });
    s.addText("\u2192", {
      x: L.mx + 3.5, y: tblY, w: 0.6, h: 0.45,
      fontSize: F.size.label, fontFace: F.sans, bold: true, color: C.white, valign: "middle", align: "center"
    });
    s.addText("\u30D7\u30ED\u30F3\u30D7\u30C8\u3067\u306E\u5BFE\u7B56", {
      x: L.mx + 4.2, y: tblY, w: 4.3, h: 0.45,
      fontSize: F.size.label, fontFace: F.sans, bold: true, color: C.white, valign: "middle"
    });

    mistakes.forEach((m, i) => {
      const y = tblY + 0.5 + i * 0.7;
      const bg = i % 2 === 0 ? C.offWhite : C.white;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: totalW, h: 0.65, fill: { color: bg }
      });

      // Colored indicator
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: 0.06, h: 0.65, fill: { color: m.color }
      });

      s.addText(m.fail, {
        x: L.mx + 0.2, y, w: 3.3, h: 0.65,
        fontSize: F.size.body, fontFace: F.sans, bold: true, color: C.red, valign: "middle"
      });

      s.addText("\u2192", {
        x: L.mx + 3.5, y, w: 0.6, h: 0.65,
        fontSize: F.size.body, fontFace: F.sans, color: C.textMuted, valign: "middle", align: "center"
      });

      s.addText(m.fix, {
        x: L.mx + 4.2, y, w: 4.3, h: 0.65,
        fontSize: F.size.label, fontFace: F.sans, color: C.green, valign: "middle",
        lineSpacingMultiple: 1.3
      });
    });
  }

  // ============================================================
  // SLIDE 11: SUMMARY
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "\u307E\u3068\u3081", pres);
    addFooter(s, 11, T, pres);

    const summaryPoints = [
      { text: "\u30C7\u30B6\u30A4\u30F3\u306E4\u539F\u5247\uFF08\u4F59\u767D\u30FB1\u30E1\u30C3\u30BB\u30FC\u30B8\u30FB2-3\u8272\u30FB\u30D5\u30A9\u30F3\u30C8\u7D71\u4E00\uFF09\u3092\u5B88\u308B\u3060\u3051\u3067\u30D7\u30ED\u54C1\u8CEA", color: C.accent },
      { text: "\u30D7\u30ED\u30F3\u30D7\u30C8\u306B\u30C7\u30B6\u30A4\u30F3\u30EB\u30FC\u30EB\u3092\u542B\u3081\u308B\u3053\u3068\u3067\u51FA\u529B\u54C1\u8CEA\u304C\u6FC0\u5909\u3059\u308B", color: C.green },
      { text: "\u51FA\u529B\u5F62\u5F0F\u306FHTML\u30FBMarkdown\u30FB\u30C6\u30AD\u30B9\u30C8\u304B\u3089\u7528\u9014\u306B\u5FDC\u3058\u3066\u9078\u3076", color: C.amber },
      { text: "1\u56DE\u3067\u5B8C\u6210\u3055\u305B\u305A\u3001\u5BFE\u8A71\u3067\u80B2\u3066\u308B\u306E\u304CClaude\u30B9\u30E9\u30A4\u30C9\u4F5C\u6210\u306E\u6975\u610F", color: C.accent },
    ];

    summaryPoints.forEach((p, i) => {
      const y = 1.15 + i * 0.9;
      addCard(s, pres, L.mx, y, L.W - L.mx * 2, 0.75, { fill: C.offWhite, borderTop: p.color });
      addNumberCircle(s, pres, L.mx + 0.15, y + 0.2, i + 1, p.color);
      s.addText(p.text, {
        x: L.mx + 0.65, y: y + 0.1, w: 7.5, h: 0.55,
        fontSize: F.size.body, fontFace: F.sans, color: C.textDark
      });
    });
  }

  // ============================================================
  // SLIDE 12: END (navy)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };

    s.addText("\u2705", {
      x: (L.W - 1) / 2, y: 1.0, w: 1, h: 0.8,
      fontSize: 48, fontFace: F.sans, align: "center", valign: "middle"
    });

    s.addText("\u78BA\u8A8D\u30C6\u30B9\u30C8\u306B\u6311\u6226\u3057\u307E\u3057\u3087\u3046", {
      x: 0.5, y: 2.0, w: 9, h: 0.8,
      fontSize: F.size.h1, fontFace: F.sans, bold: true,
      color: C.white, align: "center"
    });

    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 3.0, w: 3, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });

    s.addText("5\u554F\u306E\u78BA\u8A8D\u30C6\u30B9\u30C8\uFF0880%\u4EE5\u4E0A\u3067\u5408\u683C\uFF09", {
      x: 0.5, y: 3.2, w: 9, h: 0.5,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textMuted, align: "center"
    });

    s.addText("P-03   |   Claude\u3067\u30B9\u30E9\u30A4\u30C9\u8CC7\u6599\u3092\u30D3\u30B8\u30E5\u30A2\u30EB\u5316\u3059\u308B   |   \u5B8C\u4E86", {
      x: 0.5, y: 4.2, w: 9, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textMuted, align: "center"
    });
  }

  // ============================================================
  // SAVE
  // ============================================================
  const path = require("path");
  const outPath = path.join(__dirname, "\u30B9\u30E9\u30A4\u30C9.pptx");
  await pres.writeFile({ fileName: outPath });
  console.log(`PPTX saved: ${outPath}`);
}

main().catch(err => { console.error(err); process.exit(1); });
