const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const {
  FaFileAlt, FaCheckCircle, FaArrowRight, FaLightbulb,
  FaRocket, FaGraduationCap, FaChevronRight, FaPlay,
  FaMagic, FaSearch, FaComments, FaPencilAlt,
  FaClipboardCheck, FaSlidersH, FaImage, FaVideo,
  FaExclamationTriangle, FaTimes, FaCheck, FaClock,
  FaUsers, FaChartLine, FaBullseye, FaLayerGroup,
  FaTasks, FaStar, FaBrain, FaHandshake
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
  red: "DC2626", redBg: "FEE2E2", border: "E5E7EB", purple: "7C3AED", purpleBg: "EDE9FE"
};

const F = { sans: "Calibri", size: { hero: 40, h1: 32, h2: 20, h3: 16, body: 14, label: 12, caption: 10 } };
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
    x: 0, y: 0, w: L.W, h: 0.04, fill: { color: C.accent }
  });
}

function addFooter(slide, num, total) {
  slide.addShape(pres.shapes.LINE, {
    x: L.mx, y: L.H - 0.42, w: L.W - L.mx * 2, h: 0,
    line: { color: C.border, width: 0.5 }
  });
  slide.addText("P-05", {
    x: L.mx, y: L.H - 0.40, w: 2, h: 0.3,
    fontSize: F.size.caption, fontFace: F.sans,
    color: C.textMuted, align: "left", shrinkText: true
  });
  slide.addText(`${num} / ${total}`, {
    x: L.W - 1.5, y: L.H - 0.40, w: 1.2, h: 0.3,
    fontSize: F.size.caption, fontFace: F.sans,
    color: C.textMuted, align: "right", shrinkText: true
  });
}

function addTitle(slide, title, tag) {
  if (tag) {
    const tagW = Math.max(tag.length * 0.13 + 0.4, 0.9);
    slide.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.22, w: tagW, h: 0.28,
      fill: { color: C.accentLight }, rectRadius: 0.04
    });
    slide.addText(tag, {
      x: L.mx, y: 0.22, w: tagW, h: 0.28,
      fontSize: F.size.caption, fontFace: F.sans, bold: true,
      color: C.accent, align: "center", valign: "middle", shrinkText: true
    });
  }
  slide.addText(title, {
    x: L.mx, y: tag ? 0.58 : 0.22, w: 8.5, h: 0.48,
    fontSize: F.size.h1, fontFace: F.sans, bold: true,
    color: C.textDark, shrinkText: true
  });
}

const T = 12; // total slides

async function main() {
  pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "Gorilla Knowledge";
  pres.title = "P-05: 最強ワークフロー＋総まとめ";

  // Pre-render icons
  const ic = {
    file:      await icon(FaFileAlt,              C.accent),
    check:     await icon(FaCheckCircle,          C.green),
    checkBlue: await icon(FaCheckCircle,          C.accent),
    arrow:     await icon(FaArrowRight,           C.accent),
    bulb:      await icon(FaLightbulb,            C.amber),
    rocket:    await icon(FaRocket,               C.accent),
    grad:      await icon(FaGraduationCap,        C.green),
    chevron:   await icon(FaChevronRight,         C.accent),
    play:      await icon(FaPlay,                 C.white),
    magic:     await icon(FaMagic,                C.purple),
    search:    await icon(FaSearch,               C.accent),
    comments:  await icon(FaComments,             C.accent),
    pencil:    await icon(FaPencilAlt,            C.accent),
    clipboard: await icon(FaClipboardCheck,       C.accent),
    sliders:   await icon(FaSlidersH,             C.accent),
    image:     await icon(FaImage,                C.purple),
    video:     await icon(FaVideo,                C.green),
    warning:   await icon(FaExclamationTriangle,  C.amber),
    times:     await icon(FaTimes,                C.red),
    checkMark: await icon(FaCheck,                C.green),
    clock:     await icon(FaClock,                C.accent),
    users:     await icon(FaUsers,                C.accent),
    chart:     await icon(FaChartLine,            C.accent),
    target:    await icon(FaBullseye,             C.accent),
    layer:     await icon(FaLayerGroup,           C.accent),
    tasks:     await icon(FaTasks,                C.accent),
    star:      await icon(FaStar,                 C.amber),
    brain:     await icon(FaBrain,                C.purple),
    handshake: await icon(FaHandshake,            C.accent),
    fileWhite: await icon(FaFileAlt,              C.white),
  };

  // ============================================================
  // SLIDE 1: TITLE (Navy background)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };
    s.addImage({ data: ic.fileWhite, x: (L.W - 0.65) / 2, y: 0.85, w: 0.65, h: 0.65 });
    s.addText("最強ワークフロー＋総まとめ", {
      x: 0.5, y: 1.65, w: 9, h: 0.85,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center", shrinkText: true
    });
    s.addShape(pres.shapes.LINE, {
      x: 3.2, y: 2.65, w: 3.6, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });
    s.addText("Perplexity→Claude→スライド化の一気通貫フロー", {
      x: 0.5, y: 2.8, w: 9, h: 0.45,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", shrinkText: true
    });
    s.addText("P-05  |  全社員  |  12分", {
      x: 0.5, y: 3.9, w: 9, h: 0.35,
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
      { icon: ic.rocket,    text: "Perplexity→Claude→スライド化の一気通貫ワークフローを実践できる" },
      { icon: ic.clock,     text: "5分で提案資料を完成させるステップを理解する" },
      { icon: ic.layer,     text: "Zone C（画像・動画・資料）の全体像を整理して説明できる" },
    ];

    goals.forEach((g, i) => {
      const y = 1.05 + i * 1.2;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.95,
        fill: { color: i % 2 === 0 ? C.accentLight : C.offWhite },
        line: { color: C.border, width: 0.5 }, rectRadius: 0.06
      });
      s.addImage({ data: g.icon, x: L.mx + 0.2, y: y + 0.3, w: 0.35, h: 0.35 });
      s.addText(String(i + 1), {
        x: L.mx + 0.65, y: y + 0.12, w: 0.45, h: 0.45,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: C.accent }, shape: pres.shapes.OVAL, shrinkText: true
      });
      s.addText(g.text, {
        x: L.mx + 1.25, y: y + 0.18, w: 7.0, h: 0.6,
        fontSize: F.size.h3, fontFace: F.sans,
        color: C.textDark, valign: "middle", shrinkText: true
      });
    });
  }

  // ============================================================
  // SLIDE 3: WORKFLOW FLOW DIAGRAM
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "最強ワークフロー", "WORKFLOW");
    addFooter(s, 3, T);

    const steps = [
      { ic: ic.search,    label: "Perplexity\nリサーチ",    color: C.purple, bg: C.purpleBg, desc: "最新情報・データ収集" },
      { ic: ic.comments,  label: "Claude\nストーリー設計",  color: C.accent, bg: C.accentLight, desc: "構成・流れを作成" },
      { ic: ic.pencil,    label: "Claude\nスライド化",      color: C.accent, bg: C.accentLight, desc: "1スライド1メッセージ" },
      { ic: ic.checkMark, label: "プロ品質\n資料完成",      color: C.green,  bg: C.greenBg, desc: "微調整して納品" },
    ];

    const boxW = 1.8;
    const totalW = boxW * 4 + 0.6 * 3;
    const startX = (L.W - totalW) / 2;

    steps.forEach((st, i) => {
      const x = startX + i * (boxW + 0.6);
      const y = 1.3;

      // Card
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: boxW, h: 2.6,
        fill: { color: st.bg },
        line: { color: st.color, width: 1.5 }, rectRadius: 0.08
      });

      // Step number
      s.addText(String(i + 1), {
        x: x + (boxW - 0.35) / 2, y: y + 0.15, w: 0.35, h: 0.35,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: st.color }, shape: pres.shapes.OVAL, shrinkText: true
      });

      // Icon
      s.addImage({ data: st.ic, x: x + (boxW - 0.4) / 2, y: y + 0.65, w: 0.4, h: 0.4 });

      // Label
      s.addText(st.label, {
        x: x + 0.1, y: y + 1.15, w: boxW - 0.2, h: 0.65,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: st.color, align: "center", valign: "middle", shrinkText: true
      });

      // Desc
      s.addText(st.desc, {
        x: x + 0.1, y: y + 1.85, w: boxW - 0.2, h: 0.45,
        fontSize: F.size.caption, fontFace: F.sans,
        color: C.textLight, align: "center", valign: "middle", shrinkText: true
      });

      // Arrow between cards
      if (i < steps.length - 1) {
        s.addImage({ data: ic.chevron, x: x + boxW + 0.15, y: y + 1.05, w: 0.3, h: 0.3 });
      }
    });

    // Bottom message
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.2, w: L.W - L.mx * 2, h: 0.5,
      fill: { color: C.amberBg }, rectRadius: 0.05
    });
    s.addImage({ data: ic.bulb, x: L.mx + 0.15, y: 4.28, w: 0.3, h: 0.3 });
    s.addText("リサーチから完成まで、すべてAIが支援する一気通貫フロー", {
      x: L.mx + 0.55, y: 4.2, w: L.W - L.mx * 2 - 0.7, h: 0.5,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.amber, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 4: DEMO - Full Workflow (Navy background)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };

    s.addImage({ data: ic.magic, x: (L.W - 0.8) / 2, y: 1.0, w: 0.8, h: 0.8 });

    s.addText("実演: リサーチ→構成→スライド化を一気に", {
      x: 0.5, y: 2.0, w: 9, h: 0.8,
      fontSize: 28, fontFace: F.sans, bold: true,
      color: C.white, align: "center", valign: "middle", shrinkText: true
    });

    s.addShape(pres.shapes.LINE, {
      x: 2.5, y: 2.95, w: 5, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });

    s.addText("Perplexity + Claude で5分で提案資料完成", {
      x: 0.5, y: 3.15, w: 9, h: 0.45,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", shrinkText: true
    });

    s.addText("P-05  |  DEMO", {
      x: 0.5, y: 4.2, w: 9, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textMuted, align: "center", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 5: 5 STEPS TO COMPLETE IN 5 MINUTES
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "5分で完成する資料作成のステップ", "5 STEPS");
    addFooter(s, 5, T);

    const steps = [
      { ic: ic.target,    num: "1", label: "テーマを決める",       time: "30秒",    desc: "誰に・何を・なぜを明確に" },
      { ic: ic.comments,  num: "2", label: "Claudeにプロンプト",   time: "30秒",    desc: "構成を作ってと指示" },
      { ic: ic.clipboard, num: "3", label: "構成を確認",           time: "1分",     desc: "順番・内容を調整" },
      { ic: ic.pencil,    num: "4", label: "スライド化を指示",     time: "30秒",    desc: "1スライド1メッセージで" },
      { ic: ic.sliders,   num: "5", label: "微調整して完成",       time: "2分30秒", desc: "表現・データ・流れチェック" },
    ];

    steps.forEach((st, i) => {
      const y = 1.0 + i * 0.78;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.65,
        fill: { color: i % 2 === 0 ? C.offWhite : C.white },
        line: { color: C.border, width: 0.5 }, rectRadius: 0.04
      });
      s.addText(st.num, {
        x: L.mx + 0.1, y: y + 0.12, w: 0.38, h: 0.38,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: C.accent }, shape: pres.shapes.OVAL, shrinkText: true
      });
      s.addImage({ data: st.ic, x: L.mx + 0.6, y: y + 0.15, w: 0.28, h: 0.28 });
      s.addText(st.label, {
        x: L.mx + 1.0, y: y + 0.05, w: 3.0, h: 0.3,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.textDark, valign: "middle", shrinkText: true
      });
      s.addText(st.desc, {
        x: L.mx + 1.0, y: y + 0.33, w: 4.5, h: 0.24,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textLight, valign: "middle", shrinkText: true
      });
      // Time badge on right
      const badgeW = 1.2;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.W - L.mx - badgeW - 0.2, y: y + 0.15, w: badgeW, h: 0.35,
        fill: { color: C.accentLight }, rectRadius: 0.04
      });
      s.addText(st.time, {
        x: L.W - L.mx - badgeW - 0.2, y: y + 0.15, w: badgeW, h: 0.35,
        fontSize: F.size.label, fontFace: F.sans, bold: true,
        color: C.accent, align: "center", valign: "middle", shrinkText: true
      });
    });
  }

  // ============================================================
  // SLIDE 6: ZONE C TABLE
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "Zone C 総整理テーブル", "ZONE C");
    addFooter(s, 6, T);

    const headers = ["Zone C", "ツール", "用途", "講座"];
    const rows = [
      { cells: ["画像生成 L7", "Midjourney\nDALL-E",    "バナー・アイキャッチ\n素材作成",        "AI画像生成講座"],        ic: ic.image, color: C.purple, bg: C.purpleBg },
      { cells: ["動画生成 L8", "Veo 3",                  "プロモーション\nSNS・研修動画",         "AI動画生成講座"],        ic: ic.video, color: C.green,  bg: C.greenBg },
      { cells: ["資料作成 L9", "Claude",                  "提案書・報告書\n企画書",               "AIプレゼン資料作成講座"], ic: ic.file,  color: C.accent, bg: C.accentLight },
    ];

    const colW = [1.8, 1.8, 2.4, 2.3];
    const startX = (L.W - colW.reduce((a, b) => a + b, 0)) / 2;

    // Header row
    let cx = startX;
    headers.forEach((h, i) => {
      s.addShape(pres.shapes.RECTANGLE, {
        x: cx, y: 1.05, w: colW[i], h: 0.45,
        fill: { color: C.navy }
      });
      s.addText(h, {
        x: cx, y: 1.05, w: colW[i], h: 0.45,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle", shrinkText: true
      });
      cx += colW[i];
    });

    // Data rows
    rows.forEach((row, ri) => {
      const rowY = 1.5 + ri * 1.2;
      let cx2 = startX;
      row.cells.forEach((cell, ci) => {
        s.addShape(pres.shapes.RECTANGLE, {
          x: cx2, y: rowY, w: colW[ci], h: 1.2,
          fill: { color: ci === 0 ? row.bg : C.white },
          line: { color: C.border, width: 0.5 }
        });
        s.addText(cell, {
          x: cx2 + 0.1, y: rowY, w: colW[ci] - 0.2, h: 1.2,
          fontSize: ci === 0 ? F.size.body : F.size.label,
          fontFace: F.sans, bold: ci === 0,
          color: ci === 0 ? row.color : C.textBody,
          align: "center", valign: "middle", shrinkText: true
        });
        cx2 += colW[ci];
      });
    });
  }

  // ============================================================
  // SLIDE 7: ZONE C CORE MESSAGE
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "Zone Cの核心メッセージ", "CORE");
    addFooter(s, 7, T);

    // Big message card
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 1.15, w: L.W - L.mx * 2, h: 1.3,
      fill: { color: C.accentLight },
      line: { color: C.accent, width: 1.5 }, rectRadius: 0.08
    });
    s.addImage({ data: ic.brain, x: L.mx + 0.3, y: 1.45, w: 0.5, h: 0.5 });
    s.addText("デザイン・動画・資料をAIに任せて\n人間は「何を伝えるか」に集中する", {
      x: L.mx + 1.0, y: 1.15, w: L.W - L.mx * 2 - 1.3, h: 1.3,
      fontSize: F.size.h2, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", shrinkText: true
    });

    // 3 cards below
    const cards = [
      { ic: ic.image, label: "画像デザイン", tool: "Midjourney に任せる", color: C.purple, bg: C.purpleBg },
      { ic: ic.video, label: "動画制作",     tool: "Veo 3 に任せる",      color: C.green,  bg: C.greenBg },
      { ic: ic.file,  label: "資料作成",     tool: "Claude に任せる",     color: C.accent, bg: C.accentLight },
    ];

    const cardW = 2.5;
    const cardGap = 0.3;
    const totalCardW = cardW * 3 + cardGap * 2;
    const cardStartX = (L.W - totalCardW) / 2;

    cards.forEach((card, i) => {
      const x = cardStartX + i * (cardW + cardGap);
      const y = 2.8;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 1.6,
        fill: { color: card.bg },
        line: { color: card.color, width: 1 }, rectRadius: 0.06
      });
      s.addImage({ data: card.ic, x: x + (cardW - 0.35) / 2, y: y + 0.15, w: 0.35, h: 0.35 });
      s.addText(card.label, {
        x: x + 0.1, y: y + 0.55, w: cardW - 0.2, h: 0.35,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: card.color, align: "center", valign: "middle", shrinkText: true
      });
      s.addText(card.tool, {
        x: x + 0.1, y: y + 0.95, w: cardW - 0.2, h: 0.35,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textLight, align: "center", valign: "middle", shrinkText: true
      });
    });

    // Bottom arrow + human focus
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.6, w: L.W - L.mx * 2, h: 0.45,
      fill: { color: C.amberBg }, rectRadius: 0.04
    });
    s.addImage({ data: ic.bulb, x: L.mx + 0.15, y: 4.65, w: 0.28, h: 0.28 });
    s.addText("人間の役割 →「誰に、何を、なぜ伝えるか」を設計する", {
      x: L.mx + 0.55, y: 4.6, w: L.W - L.mx * 2 - 0.7, h: 0.45,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.amber, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 8: COST COMPARISON
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "コスト比較: AIで資料作成の威力", "IMPACT");
    addFooter(s, 8, T);

    const headers = ["作業", "従来", "AI活用後", "削減効果"];
    const rows = [
      ["提案資料作成",             "3〜5時間",     "5分",     "97%削減"],
      ["デザイン調整",             "1〜2時間",     "自動",    "100%削減"],
      ["年間（週1作成）",          "約200時間",    "約4時間", "約160時間削減"],
    ];

    const colW = [2.0, 1.8, 1.8, 2.2];
    const startX = (L.W - colW.reduce((a, b) => a + b, 0)) / 2;

    // Header
    let cx = startX;
    headers.forEach((h, i) => {
      s.addShape(pres.shapes.RECTANGLE, {
        x: cx, y: 1.05, w: colW[i], h: 0.45,
        fill: { color: C.navy }
      });
      s.addText(h, {
        x: cx, y: 1.05, w: colW[i], h: 0.45,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle", shrinkText: true
      });
      cx += colW[i];
    });

    // Data rows
    rows.forEach((row, ri) => {
      const rowY = 1.5 + ri * 0.85;
      let cx2 = startX;
      row.forEach((cell, ci) => {
        const bgColor = ri % 2 === 0 ? C.offWhite : C.white;
        const isEffect = ci === 3;
        s.addShape(pres.shapes.RECTANGLE, {
          x: cx2, y: rowY, w: colW[ci], h: 0.85,
          fill: { color: isEffect && ri === 2 ? C.greenBg : bgColor },
          line: { color: C.border, width: 0.5 }
        });
        s.addText(cell, {
          x: cx2 + 0.1, y: rowY, w: colW[ci] - 0.2, h: 0.85,
          fontSize: isEffect ? F.size.body : F.size.label,
          fontFace: F.sans, bold: isEffect,
          color: isEffect ? C.green : C.textBody,
          align: "center", valign: "middle", shrinkText: true
        });
        cx2 += colW[ci];
      });
    });

    // Highlight box
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.1, w: L.W - L.mx * 2, h: 0.55,
      fill: { color: C.greenBg }, rectRadius: 0.05
    });
    s.addImage({ data: ic.chart, x: L.mx + 0.15, y: 4.2, w: 0.3, h: 0.3 });
    s.addText("年間160時間 = 20営業日分 = 丸1ヶ月分の時間を創出", {
      x: L.mx + 0.55, y: 4.1, w: L.W - L.mx * 2 - 0.7, h: 0.55,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.green, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 9: COMMON FAILURES AND SOLUTIONS
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "よくある失敗と対策", "PITFALLS");
    addFooter(s, 9, T);

    const failures = [
      {
        fail: "AIに丸投げして\n微妙な資料に",
        cause: "目的が不明確",
        fix: "「誰に・何を・なぜ」\nを最初に決める",
        icFail: ic.times, icFix: ic.checkMark
      },
      {
        fail: "装飾が多すぎて\n読みにくい",
        cause: "指示が曖昧",
        fix: "「シンプルに。\n色は3色まで」と指示",
        icFail: ic.times, icFix: ic.checkMark
      },
      {
        fail: "数字やファクトが\n間違っている",
        cause: "確認不足",
        fix: "必ず人間が\nファクトチェック",
        icFail: ic.times, icFix: ic.checkMark
      },
    ];

    failures.forEach((f, i) => {
      const y = 1.1 + i * 1.25;
      const halfW = (L.W - L.mx * 2 - 0.3) / 2;

      // Fail card (left)
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: halfW, h: 1.05,
        fill: { color: C.redBg },
        line: { color: C.red, width: 0.5 }, rectRadius: 0.05
      });
      s.addImage({ data: f.icFail, x: L.mx + 0.1, y: y + 0.1, w: 0.22, h: 0.22 });
      s.addText(f.fail, {
        x: L.mx + 0.4, y: y + 0.05, w: halfW - 0.6, h: 0.55,
        fontSize: F.size.label, fontFace: F.sans, bold: true,
        color: C.red, valign: "middle", shrinkText: true
      });
      s.addText(`原因: ${f.cause}`, {
        x: L.mx + 0.4, y: y + 0.65, w: halfW - 0.6, h: 0.3,
        fontSize: F.size.caption, fontFace: F.sans, italic: true,
        color: C.textLight, valign: "middle", shrinkText: true
      });

      // Arrow
      s.addImage({ data: ic.arrow, x: L.mx + halfW + 0.02, y: y + 0.35, w: 0.25, h: 0.25 });

      // Fix card (right)
      const fixX = L.mx + halfW + 0.3;
      s.addShape(pres.shapes.RECTANGLE, {
        x: fixX, y, w: halfW, h: 1.05,
        fill: { color: C.greenBg },
        line: { color: C.green, width: 0.5 }, rectRadius: 0.05
      });
      s.addImage({ data: f.icFix, x: fixX + 0.1, y: y + 0.1, w: 0.22, h: 0.22 });
      s.addText(f.fix, {
        x: fixX + 0.4, y: y + 0.15, w: halfW - 0.6, h: 0.7,
        fontSize: F.size.label, fontFace: F.sans, bold: true,
        color: C.green, valign: "middle", shrinkText: true
      });
    });
  }

  // ============================================================
  // SLIDE 10: HOMEWORK
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "宿題3つ", "HOMEWORK");
    addFooter(s, 10, T);

    const items = [
      { ic: ic.file,   text: "Claudeで提案資料を1つ作る（テーマは自由）" },
      { ic: ic.rocket, text: "「リサーチ→構成→スライド化」フローを最初から最後まで試す" },
      { ic: ic.handshake, text: "次のクライアント提案をClaudeで作ってみる" },
    ];

    items.forEach((item, i) => {
      const y = 1.1 + i * 1.2;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.95,
        fill: { color: i % 2 === 0 ? C.accentLight : C.offWhite },
        line: { color: C.border, width: 0.5 }, rectRadius: 0.06
      });
      s.addText(String(i + 1), {
        x: L.mx + 0.15, y: y + 0.12, w: 0.5, h: 0.5,
        fontSize: F.size.h2, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: C.accent }, shape: pres.shapes.OVAL, shrinkText: true
      });
      s.addImage({ data: item.ic, x: L.mx + 0.8, y: y + 0.28, w: 0.35, h: 0.35 });
      s.addText(item.text, {
        x: L.mx + 1.3, y: y + 0.15, w: 6.8, h: 0.65,
        fontSize: F.size.h3, fontFace: F.sans,
        color: C.textDark, valign: "middle", shrinkText: true
      });
    });
  }

  // ============================================================
  // SLIDE 11: ALL 5 PARTS SUMMARY TABLE
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "全5パート総まとめ", "SUMMARY");
    addFooter(s, 11, T);

    const headers = ["パート", "テーマ", "核心スキル"];
    const rows = [
      ["P-01", "なぜAIで資料を作るべきなのか",    "マインドセット転換"],
      ["P-02", "Claudeで提案書を設計する",         "構成力（誰に・何を・なぜ）"],
      ["P-03", "Claudeでスライド化する",           "1スライド1メッセージ"],
      ["P-04", "業務別テンプレート実践",           "テンプレ活用で即戦力"],
      ["P-05", "最強ワークフロー＋総まとめ",       "一気通貫フロー"],
    ];

    const colW = [1.2, 3.8, 3.2];
    const startX = (L.W - colW.reduce((a, b) => a + b, 0)) / 2;

    // Header
    let cx = startX;
    headers.forEach((h, i) => {
      s.addShape(pres.shapes.RECTANGLE, {
        x: cx, y: 1.05, w: colW[i], h: 0.42,
        fill: { color: C.navy }
      });
      s.addText(h, {
        x: cx, y: 1.05, w: colW[i], h: 0.42,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle", shrinkText: true
      });
      cx += colW[i];
    });

    // Data rows
    rows.forEach((row, ri) => {
      const rowY = 1.47 + ri * 0.72;
      let cx2 = startX;
      const isCurrentPart = ri === 4;
      row.forEach((cell, ci) => {
        const bgColor = isCurrentPart ? C.accentLight : (ri % 2 === 0 ? C.offWhite : C.white);
        s.addShape(pres.shapes.RECTANGLE, {
          x: cx2, y: rowY, w: colW[ci], h: 0.72,
          fill: { color: bgColor },
          line: { color: C.border, width: 0.5 }
        });
        s.addText(cell, {
          x: cx2 + 0.1, y: rowY, w: colW[ci] - 0.2, h: 0.72,
          fontSize: ci === 0 ? F.size.body : F.size.label,
          fontFace: F.sans, bold: ci === 0 || ci === 2,
          color: ci === 0 ? C.accent : (ci === 2 ? (isCurrentPart ? C.accent : C.textDark) : C.textBody),
          align: "center", valign: "middle", shrinkText: true
        });
        cx2 += colW[ci];
      });
    });
  }

  // ============================================================
  // SLIDE 12: CLOSING (Navy background)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };
    s.addImage({ data: ic.grad, x: (L.W - 0.65) / 2, y: 0.9, w: 0.65, h: 0.65 });
    s.addText("お疲れさまでした", {
      x: 0.5, y: 1.7, w: 9, h: 0.7,
      fontSize: F.size.h1, fontFace: F.sans, bold: true,
      color: C.white, align: "center", shrinkText: true
    });
    s.addShape(pres.shapes.LINE, {
      x: 3.2, y: 2.55, w: 3.6, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });
    s.addText("AIプレゼン資料作成講座 全5パート修了", {
      x: 0.5, y: 2.7, w: 9, h: 0.45,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", shrinkText: true
    });
    s.addText("次回: Lecture 10 総合演習", {
      x: 0.5, y: 3.5, w: 9, h: 0.45,
      fontSize: F.size.h3, fontFace: F.sans,
      color: C.white, align: "center", shrinkText: true
    });
    s.addText("P-05  |  最強ワークフロー＋総まとめ", {
      x: 0.5, y: 4.3, w: 9, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textMuted, align: "center", shrinkText: true
    });
  }

  // Save
  await pres.writeFile({ fileName: "スライド.pptx" });
  console.log("Done: スライド.pptx generated (12 slides)");
}

main().catch(err => { console.error(err); process.exit(1); });
