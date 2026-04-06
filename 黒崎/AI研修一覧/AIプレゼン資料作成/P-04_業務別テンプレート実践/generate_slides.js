const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const {
  FaFileAlt, FaBullseye, FaCopy, FaBuilding, FaChartBar, FaGraduationCap,
  FaSlidersH, FaPlay, FaDollarSign, FaTable, FaCheckCircle, FaArrowRight,
  FaLightbulb, FaExchangeAlt, FaClipboardList, FaCalendarAlt, FaUsers,
  FaBriefcase, FaChartLine, FaEdit, FaCogs, FaRocket, FaBookOpen
} = require("react-icons/fa");

// =====================================================
// DESIGN SYSTEM
// =====================================================
const C = {
  white: "FFFFFF", offWhite: "FAFBFC", lightGray: "F3F4F6",
  navy: "1B2A4A", navyLight: "2D4A7A",
  accent: "2563EB", accentLight: "DBEAFE", accentMid: "93C5FD",
  textDark: "111827", textBody: "374151", textLight: "6B7280", textMuted: "9CA3AF",
  green: "059669", greenBg: "D1FAE5", amber: "D97706", amberBg: "FEF3C7",
  red: "DC2626", redBg: "FEE2E2", border: "E5E7EB",
  purple: "7C3AED", purpleBg: "EDE9FE"
};

const F = { sans: "Calibri", size: { hero: 40, h1: 24, h2: 20, h3: 16, body: 14, label: 12, caption: 10 } };
const L = { W: 10, H: 5.625, mx: 0.75, my: 0.5, gap: 0.3 };

// Icon helper
async function icon(Comp, color, size = 256) {
  const svg = ReactDOMServer.renderToStaticMarkup(
    React.createElement(Comp, { color: `#${color}`, size: String(size) })
  );
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

let pres;

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
    color: C.textMuted, align: "right", shrinkText: true
  });
  slide.addText("P-04", {
    x: L.mx, y: L.H - 0.38, w: 2, h: 0.3,
    fontSize: F.size.caption, fontFace: F.sans,
    color: C.textMuted, align: "left", shrinkText: true
  });
}

function addTitle(slide, title, tag) {
  if (tag) {
    const tagW = tag.length * 0.12 + 0.4;
    slide.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.15, w: tagW, h: 0.28,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    slide.addText(tag, {
      x: L.mx, y: 0.15, w: tagW, h: 0.28,
      fontSize: F.size.caption, fontFace: F.sans, bold: true,
      color: C.accent, align: "center", valign: "middle", shrinkText: true
    });
  }
  slide.addText(title, {
    x: L.mx, y: tag ? 0.5 : 0.15, w: 8.5, h: 0.45,
    fontSize: F.size.h1, fontFace: F.sans, bold: true,
    color: C.textDark, shrinkText: true
  });
}

function addPromptBox(slide, lines, y, h) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x: L.mx, y, w: L.W - L.mx * 2, h,
    fill: { color: "F9FAFB" }, line: { color: C.border, width: 0.75 }, rectRadius: 0.08
  });
  slide.addText(lines, {
    x: L.mx + 0.25, y: y + 0.1, w: L.W - L.mx * 2 - 0.5, h: h - 0.2,
    fontSize: F.size.body - 1, fontFace: "Consolas",
    color: C.textBody, valign: "top", shrinkText: true, lineSpacing: 18
  });
}

const T = 12; // total slides

async function main() {
  pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "Gorilla Knowledge";
  pres.title = "P-04: 業務別テンプレート実践";

  // Pre-render icons
  const ic = {
    file: await icon(FaFileAlt, C.accent),
    target: await icon(FaBullseye, C.accent),
    copy: await icon(FaCopy, C.green),
    building: await icon(FaBuilding, C.purple),
    chart: await icon(FaChartBar, C.amber),
    grad: await icon(FaGraduationCap, C.accent),
    sliders: await icon(FaSlidersH, C.accent),
    play: await icon(FaPlay, C.white),
    dollar: await icon(FaDollarSign, C.green),
    table: await icon(FaTable, C.accent),
    check: await icon(FaCheckCircle, C.green),
    arrow: await icon(FaArrowRight, C.accent),
    bulb: await icon(FaLightbulb, C.amber),
    exchange: await icon(FaExchangeAlt, C.accent),
    clipboard: await icon(FaClipboardList, C.accent),
    calendar: await icon(FaCalendarAlt, C.amber),
    users: await icon(FaUsers, C.accent),
    briefcase: await icon(FaBriefcase, C.navyLight),
    chartLine: await icon(FaChartLine, C.green),
    edit: await icon(FaEdit, C.accent),
    cogs: await icon(FaCogs, C.accent),
    rocket: await icon(FaRocket, C.accent),
    book: await icon(FaBookOpen, C.accent),
  };

  // ============================================================
  // SLIDE 1: TITLE (Navy background)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };
    s.addImage({ data: ic.file, x: (L.W - 0.6) / 2, y: 1.0, w: 0.6, h: 0.6 });
    s.addText("業務別テンプレート実践", {
      x: 0.5, y: 1.8, w: 9, h: 0.8,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center", shrinkText: true
    });
    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 2.75, w: 3, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });
    s.addText("コピペで使えるClaudeプロンプト集", {
      x: 0.5, y: 2.95, w: 9, h: 0.45,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", shrinkText: true
    });
    s.addText("P-04  |  AIプレゼン資料作成  |  12分", {
      x: 0.5, y: 4.0, w: 9, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textMuted, align: "center", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 2: GOALS
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "今日のゴール");
    addFooter(s, 2, T);

    const goals = [
      "4つの業務別テンプレートをコピペで使える",
      "テンプレートを自分の業務にカスタマイズできる",
      "営業資料・報告書それぞれのコツを理解する",
    ];

    goals.forEach((g, i) => {
      const y = 1.0 + i * 1.15;
      s.addText(String(i + 1), {
        x: L.mx, y: y + 0.05, w: 0.5, h: 0.5,
        fontSize: F.size.h2, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: C.accent }, shape: pres.shapes.OVAL, shrinkText: true
      });
      s.addText(g, {
        x: L.mx + 0.7, y, w: 7.5, h: 0.6,
        fontSize: F.size.h3, fontFace: F.sans,
        color: C.textDark, valign: "middle", shrinkText: true
      });
      if (i < 2) {
        s.addShape(pres.shapes.LINE, {
          x: L.mx, y: y + 0.8, w: L.W - L.mx * 2, h: 0,
          line: { color: C.border, width: 0.5 }
        });
      }
    });
  }

  // ============================================================
  // SLIDE 3: TEMPLATE 1 - Client Proposal
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "テンプレート①: クライアント提案書", "コピペ可");
    addFooter(s, 3, T);

    s.addImage({ data: ic.copy, x: L.W - 1.3, y: 0.15, w: 0.28, h: 0.28 });

    const prompt = [
      "あなたはコンサルタントです。以下の情報をもとに、",
      "クライアント向け提案書を作成してください。",
      "",
      "構成: 課題の整理 → 提案3つ → ROI試算",
      "      → スケジュール → 次のステップ",
      "",
      "【業界】: [業界名]",
      "【課題】: [解決したい課題]",
      "【予算規模】: [予算]",
      "【期間】: [プロジェクト期間]",
    ].join("\n");

    addPromptBox(s, prompt, 0.85, 2.8);

    // Flow at bottom
    const steps = ["課題整理", "提案3つ", "ROI", "スケジュール", "次のステップ"];
    const stepW = 1.4;
    const stepGap = 0.15;
    const totalStepW = steps.length * stepW + (steps.length - 1) * stepGap;
    const startX = (L.W - totalStepW) / 2;

    steps.forEach((st, i) => {
      const x = startX + i * (stepW + stepGap);
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: 3.95, w: stepW, h: 0.4,
        fill: { color: i === 0 ? C.accent : C.accentLight }, rectRadius: 0.05
      });
      s.addText(st, {
        x, y: 3.95, w: stepW, h: 0.4,
        fontSize: F.size.label, fontFace: F.sans, bold: true,
        color: i === 0 ? C.white : C.accent, align: "center", valign: "middle", shrinkText: true
      });
      if (i < steps.length - 1) {
        s.addText("→", {
          x: x + stepW, y: 3.95, w: stepGap, h: 0.4,
          fontSize: F.size.label, fontFace: F.sans,
          color: C.textMuted, align: "center", valign: "middle"
        });
      }
    });
  }

  // ============================================================
  // SLIDE 4: TEMPLATE 2 - Internal Proposal
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "テンプレート②: 社内企画書", "コピペ可");
    addFooter(s, 4, T);

    s.addImage({ data: ic.copy, x: L.W - 1.3, y: 0.15, w: 0.28, h: 0.28 });

    const prompt = [
      "社内向けの企画書を作成してください。",
      "",
      "構成: 背景 → 目的 → 施策内容 → 予算",
      "      → KPI → スケジュール",
      "",
      "【企画名】: [企画名]",
      "【背景・課題】: [なぜこの企画が必要か]",
      "【ターゲット】: [対象部署・対象者]",
      "【期待効果】: [定量的な目標]",
    ].join("\n");

    addPromptBox(s, prompt, 0.85, 2.6);

    // Key point
    s.addImage({ data: ic.bulb, x: L.mx, y: 3.75, w: 0.22, h: 0.22 });
    s.addText("ポイント: 「背景」と「KPI」が企画書を通すカギ。期待効果は定量的に記載する", {
      x: L.mx + 0.3, y: 3.7, w: L.W - L.mx * 2 - 0.35, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans, italic: true,
      color: C.textLight, valign: "middle", shrinkText: true
    });

    // 6 section flow
    const sections = ["背景", "目的", "施策", "予算", "KPI", "日程"];
    const secW = 1.1;
    const secGap = 0.18;
    const totalSecW = sections.length * secW + (sections.length - 1) * secGap;
    const startSecX = (L.W - totalSecW) / 2;

    sections.forEach((sec, i) => {
      const x = startSecX + i * (secW + secGap);
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: 4.2, w: secW, h: 0.35,
        fill: { color: C.purpleBg }, rectRadius: 0.05
      });
      s.addText(sec, {
        x, y: 4.2, w: secW, h: 0.35,
        fontSize: F.size.caption, fontFace: F.sans, bold: true,
        color: C.purple, align: "center", valign: "middle", shrinkText: true
      });
    });
  }

  // ============================================================
  // SLIDE 5: TEMPLATE 3 - Monthly Report
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "テンプレート③: 月次報告書", "コピペ可");
    addFooter(s, 5, T);

    s.addImage({ data: ic.copy, x: L.W - 1.3, y: 0.15, w: 0.28, h: 0.28 });

    const prompt = [
      "月次報告のスライド構成を作成してください。",
      "",
      "構成: 実績サマリー → 目標比較",
      "      → 要因分析 → 来月のアクション",
      "",
      "【報告月】: [対象月]",
      "【主要KPI】: [売上/利益/件数など]",
      "【実績値】: [今月の実績数値]",
      "【目標値】: [今月の目標数値]",
    ].join("\n");

    addPromptBox(s, prompt, 0.85, 2.6);

    // 4 section cards
    const cards = [
      { label: "実績サマリー", ic: ic.chartLine, color: C.green },
      { label: "目標比較", ic: ic.exchange, color: C.accent },
      { label: "要因分析", ic: ic.bulb, color: C.amber },
      { label: "来月アクション", ic: ic.rocket, color: C.accent },
    ];

    const cardW = 1.85;
    const cardGap = 0.2;
    const totalCardW = cards.length * cardW + (cards.length - 1) * cardGap;
    const startCardX = (L.W - totalCardW) / 2;

    cards.forEach((c, i) => {
      const x = startCardX + i * (cardW + cardGap);
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: 3.75, w: cardW, h: 0.7,
        fill: { color: C.offWhite }, line: { color: C.border, width: 0.5 }, rectRadius: 0.05
      });
      s.addImage({ data: c.ic, x: x + 0.15, y: 3.9, w: 0.22, h: 0.22 });
      s.addText(c.label, {
        x: x + 0.4, y: 3.85, w: cardW - 0.55, h: 0.55,
        fontSize: F.size.label, fontFace: F.sans, bold: true,
        color: C.textDark, valign: "middle", shrinkText: true
      });
    });
  }

  // ============================================================
  // SLIDE 6: TEMPLATE 4 - Training Material
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "テンプレート④: 研修資料", "コピペ可");
    addFooter(s, 6, T);

    s.addImage({ data: ic.copy, x: L.W - 1.3, y: 0.15, w: 0.28, h: 0.28 });

    const prompt = [
      "研修資料を作成してください。",
      "12スライド構成。1スライド1メッセージ。",
      "専門用語は平易な言葉に言い換えてください。",
      "",
      "【研修テーマ】: [テーマ]",
      "【対象者】: [受講者のレベル]",
      "【研修時間】: [所要時間]",
      "【到達目標】: [研修後にできるようになること]",
    ].join("\n");

    addPromptBox(s, prompt, 0.85, 2.4);

    // 3 rules
    const rules = [
      { ic: ic.clipboard, label: "12スライド構成", desc: "15〜20分に最適" },
      { ic: ic.target, label: "1スライド1メッセージ", desc: "情報過多を防止" },
      { ic: ic.book, label: "専門用語は平易に", desc: "理解しやすさ優先" },
    ];

    const ruleW = 2.5;
    const ruleGap = 0.25;
    const totalRuleW = rules.length * ruleW + (rules.length - 1) * ruleGap;
    const startRuleX = (L.W - totalRuleW) / 2;

    rules.forEach((r, i) => {
      const x = startRuleX + i * (ruleW + ruleGap);
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: 3.55, w: ruleW, h: 1.0,
        fill: { color: C.offWhite }, line: { color: C.border, width: 0.5 }, rectRadius: 0.05
      });
      s.addImage({ data: r.ic, x: x + (ruleW - 0.28) / 2, y: 3.65, w: 0.28, h: 0.28 });
      s.addText(r.label, {
        x, y: 3.98, w: ruleW, h: 0.25,
        fontSize: F.size.label, fontFace: F.sans, bold: true,
        color: C.textDark, align: "center", shrinkText: true
      });
      s.addText(r.desc, {
        x, y: 4.22, w: ruleW, h: 0.2,
        fontSize: F.size.caption, fontFace: F.sans,
        color: C.textLight, align: "center", shrinkText: true
      });
    });
  }

  // ============================================================
  // SLIDE 7: CUSTOMIZATION
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "テンプレートのカスタマイズ方法");
    addFooter(s, 7, T);

    // 3 points
    const points = [
      { num: "1", ic: ic.edit, label: "[ ] を自分の内容に差し替え", desc: "具体的な情報ほど出力品質UP" },
      { num: "2", ic: ic.cogs, label: "構成セクションの追加・削除", desc: "型は自由にアレンジ可能" },
      { num: "3", ic: ic.briefcase, label: "業界用語・社内ルールを追記", desc: "そのまま使える出力に" },
    ];

    points.forEach((p, i) => {
      const y = 0.85 + i * 0.85;
      s.addText(p.num, {
        x: L.mx, y: y + 0.05, w: 0.4, h: 0.4,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: C.accent }, shape: pres.shapes.OVAL, shrinkText: true
      });
      s.addImage({ data: p.ic, x: L.mx + 0.55, y: y + 0.08, w: 0.25, h: 0.25 });
      s.addText(p.label, {
        x: L.mx + 0.9, y, w: 4, h: 0.3,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, shrinkText: true
      });
      s.addText(p.desc, {
        x: L.mx + 0.9, y: y + 0.3, w: 4, h: 0.25,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textLight, shrinkText: true
      });
    });

    // Before/After example
    const exY = 3.5;
    s.addText("Before / After 例", {
      x: L.mx, y: exY - 0.4, w: 3, h: 0.3,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.textMuted, shrinkText: true
    });

    // Before box
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: exY, w: 3.8, h: 0.6,
      fill: { color: C.redBg }, line: { color: "FECACA", width: 0.5 }, rectRadius: 0.05
    });
    s.addText("Before: 【業界】: [業界名]", {
      x: L.mx + 0.15, y: exY, w: 3.5, h: 0.6,
      fontSize: F.size.body, fontFace: "Consolas",
      color: C.red, valign: "middle", shrinkText: true
    });

    // Arrow
    s.addImage({ data: ic.arrow, x: L.mx + 4.0, y: exY + 0.15, w: 0.25, h: 0.25 });

    // After box
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx + 4.5, y: exY, w: 4.0, h: 0.6,
      fill: { color: C.greenBg }, line: { color: "A7F3D0", width: 0.5 }, rectRadius: 0.05
    });
    s.addText("After: 【業界】: 自動車部品製造業（従業員300名）", {
      x: L.mx + 4.65, y: exY, w: 3.7, h: 0.6,
      fontSize: F.size.body, fontFace: "Consolas",
      color: C.green, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 8: DEMO (placeholder)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };

    // Play icon circle
    s.addShape(pres.shapes.OVAL, {
      x: (L.W - 1) / 2, y: 1.2, w: 1, h: 1,
      fill: { color: C.accent }
    });
    s.addImage({ data: ic.play, x: (L.W - 0.35) / 2 + 0.03, y: 1.52, w: 0.35, h: 0.35 });

    s.addText("【実演】", {
      x: 0.5, y: 2.5, w: 9, h: 0.5,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", shrinkText: true
    });
    s.addText("テンプレートで提案書を生成", {
      x: 0.5, y: 3.0, w: 9, h: 0.7,
      fontSize: F.size.hero - 4, fontFace: F.sans, bold: true,
      color: C.white, align: "center", shrinkText: true
    });
    s.addText("クライアント提案書テンプレートをClaudeで実行", {
      x: 0.5, y: 3.8, w: 9, h: 0.35,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textMuted, align: "center", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 9: SALES MATERIAL TIPS
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "営業資料のコツ");
    addFooter(s, 9, T);

    const tips = [
      {
        ic: ic.dollar, label: "数字で語る",
        desc: "「大幅に改善」→「30%改善」\n曖昧な表現を数値に変換",
        color: C.green, bgColor: C.greenBg
      },
      {
        ic: ic.table, label: "比較表で説得",
        desc: "自社 vs 競合の機能比較\nプランA vs プランBの比較",
        color: C.accent, bgColor: C.accentLight
      },
      {
        ic: ic.exchange, label: "Before / After",
        desc: "導入前: 手作業3時間\n導入後: 自動化15分",
        color: C.amber, bgColor: C.amberBg
      },
    ];

    const tipW = 2.5;
    const tipGap = 0.3;
    const totalTipW = tips.length * tipW + (tips.length - 1) * tipGap;
    const startTipX = (L.W - totalTipW) / 2;

    tips.forEach((t, i) => {
      const x = startTipX + i * (tipW + tipGap);
      const y = 0.95;

      // Card
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: tipW, h: 2.8,
        fill: { color: C.offWhite }, line: { color: C.border, width: 0.5 }, rectRadius: 0.08
      });

      // Color header
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: tipW, h: 0.7,
        fill: { color: t.bgColor }, rectRadius: 0.08
      });
      // Fix bottom corners of header
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: y + 0.4, w: tipW, h: 0.3,
        fill: { color: t.bgColor }
      });

      s.addImage({ data: t.ic, x: x + (tipW - 0.3) / 2, y: y + 0.1, w: 0.3, h: 0.3 });

      s.addText(t.label, {
        x, y: y + 0.85, w: tipW, h: 0.35,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, align: "center", shrinkText: true
      });

      s.addText(t.desc, {
        x: x + 0.2, y: y + 1.3, w: tipW - 0.4, h: 1.2,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, valign: "top", shrinkText: true, lineSpacing: 18
      });
    });

    s.addImage({ data: ic.bulb, x: L.mx, y: 4.2, w: 0.22, h: 0.22 });
    s.addText("テンプレート出力後に「比較表を追加して」と追加指示するのも効果的", {
      x: L.mx + 0.3, y: 4.15, w: L.W - L.mx * 2 - 0.35, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans, italic: true,
      color: C.textLight, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 10: REPORT TIPS
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "報告書のコツ");
    addFooter(s, 10, T);

    const tips = [
      { num: "1", ic: ic.rocket, label: "結論ファースト", desc: "最初の1行で結論を述べる\n「売上目標比105%で達成」" },
      { num: "2", ic: ic.table, label: "グラフの代わりにテーブル", desc: "AI生成ではテーブルが確実\n数値比較はテーブルで十分" },
      { num: "3", ic: ic.target, label: "1ページ1メッセージ", desc: "情報を詰め込まない\n「伝えたいこと」を1つに絞る" },
    ];

    tips.forEach((t, i) => {
      const y = 0.9 + i * 1.25;

      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 1.05,
        fill: { color: C.offWhite }, line: { color: C.border, width: 0.5 }, rectRadius: 0.05
      });

      s.addText(t.num, {
        x: L.mx + 0.2, y: y + 0.15, w: 0.5, h: 0.5,
        fontSize: F.size.h1, fontFace: F.sans, bold: true,
        color: C.accent, align: "center", valign: "middle", shrinkText: true
      });

      s.addImage({ data: t.ic, x: L.mx + 0.85, y: y + 0.25, w: 0.28, h: 0.28 });

      s.addText(t.label, {
        x: L.mx + 1.3, y: y + 0.08, w: 3.5, h: 0.35,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, shrinkText: true
      });

      s.addText(t.desc, {
        x: L.mx + 1.3, y: y + 0.4, w: 6.5, h: 0.55,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, valign: "top", shrinkText: true, lineSpacing: 16
      });
    });
  }

  // ============================================================
  // SLIDE 11: SUMMARY
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "まとめ");
    addFooter(s, 11, T);

    const items = [
      { ic: ic.file, label: "4つのテンプレート", desc: "提案書 / 企画書 / 報告書 / 研修資料" },
      { ic: ic.sliders, label: "カスタマイズ", desc: "[ ]差し替え + 構成追加削除 + 社内ルール追記" },
      { ic: ic.dollar, label: "営業資料", desc: "数字で語る / 比較表 / Before/After" },
      { ic: ic.clipboard, label: "報告書", desc: "結論ファースト / テーブル / 1ページ1メッセージ" },
    ];

    items.forEach((item, i) => {
      const y = 0.85 + i * 0.85;

      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.7,
        fill: { color: i % 2 === 0 ? C.offWhite : C.white },
        line: { color: C.border, width: 0.5 }, rectRadius: 0.05
      });

      s.addImage({ data: item.ic, x: L.mx + 0.2, y: y + 0.18, w: 0.28, h: 0.28 });

      s.addText(item.label, {
        x: L.mx + 0.65, y, w: 2.5, h: 0.7,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, valign: "middle", shrinkText: true
      });

      s.addText(item.desc, {
        x: L.mx + 3.2, y, w: 5, h: 0.7,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, valign: "middle", shrinkText: true
      });
    });

    // Test info
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.35, w: L.W - L.mx * 2, h: 0.45,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    s.addImage({ data: ic.check, x: L.mx + 0.15, y: 4.42, w: 0.25, h: 0.25 });
    s.addText("確認テスト: 5問 / 80%合格", {
      x: L.mx + 0.5, y: 4.35, w: 4, h: 0.45,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 12: END (Navy background)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };

    s.addImage({ data: ic.check, x: (L.W - 0.6) / 2, y: 1.2, w: 0.6, h: 0.6 });
    s.addText("P-04 修了", {
      x: 0.5, y: 2.0, w: 9, h: 0.7,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center", shrinkText: true
    });
    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 2.85, w: 3, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });
    s.addText("テンプレートを使って、資料作成を加速しよう", {
      x: 0.5, y: 3.05, w: 9, h: 0.45,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", shrinkText: true
    });
    s.addText("次のステップ → P-05 最強ワークフローと総まとめ", {
      x: 0.5, y: 4.0, w: 9, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textMuted, align: "center", shrinkText: true
    });
  }

  // ============================================================
  // EXPORT
  // ============================================================
  const outPath = "スライド.pptx";
  await pres.writeFile({ fileName: outPath });
  console.log(`[完成] ${outPath} (${T}スライド)`);
}

main().catch(err => { console.error(err); process.exit(1); });
