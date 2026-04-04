const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const {
  FaTrophy, FaMap, FaComments, FaRobot, FaPaintBrush, FaCogs,
  FaCheckCircle, FaExchangeAlt, FaRocket, FaQuoteLeft, FaGraduationCap,
  FaHeart, FaBrain, FaSearch, FaImage, FaVideo, FaFileAlt, FaChartLine,
  FaUsers, FaCalendarCheck, FaBullseye, FaArrowRight, FaLightbulb,
  FaClock, FaMoneyBillWave, FaStar, FaFlag, FaHandshake, FaIndustry,
  FaUtensils, FaUserTie
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
  purple: "7C3AED", purpleBg: "EDE9FE", teal: "0D9488", tealBg: "CCFBF1"
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
  slide.addText("P-05", {
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

const T = 12; // total slides

async function main() {
  pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "Gorilla Knowledge";
  pres.title = "P-05: Pack 6 総まとめ＋ネクストアクション";

  // Pre-render icons
  const ic = {
    trophy: await icon(FaTrophy, C.amber),
    map: await icon(FaMap, C.accent),
    comments: await icon(FaComments, C.accent),
    robot: await icon(FaRobot, C.green),
    paint: await icon(FaPaintBrush, C.amber),
    cogs: await icon(FaCogs, C.purple),
    check: await icon(FaCheckCircle, C.green),
    checkBlue: await icon(FaCheckCircle, C.accent),
    exchange: await icon(FaExchangeAlt, C.accent),
    rocket: await icon(FaRocket, C.accent),
    quote: await icon(FaQuoteLeft, C.navy),
    grad: await icon(FaGraduationCap, C.accent),
    heart: await icon(FaHeart, C.red),
    brain: await icon(FaBrain, C.accent),
    search: await icon(FaSearch, C.accent),
    image: await icon(FaImage, C.amber),
    video: await icon(FaVideo, C.amber),
    file: await icon(FaFileAlt, C.accent),
    chart: await icon(FaChartLine, C.green),
    users: await icon(FaUsers, C.purple),
    calendar: await icon(FaCalendarCheck, C.green),
    target: await icon(FaBullseye, C.red),
    arrow: await icon(FaArrowRight, C.accent),
    bulb: await icon(FaLightbulb, C.amber),
    clock: await icon(FaClock, C.accent),
    money: await icon(FaMoneyBillWave, C.green),
    star: await icon(FaStar, C.amber),
    flag: await icon(FaFlag, C.accent),
    handshake: await icon(FaHandshake, C.green),
    industry: await icon(FaIndustry, C.accent),
    utensils: await icon(FaUtensils, C.amber),
    userTie: await icon(FaUserTie, C.green),
  };

  // ============================================================
  // SLIDE 1: TITLE (Navy background)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };
    s.addImage({ data: ic.trophy, x: (L.W - 0.6) / 2, y: 1.0, w: 0.6, h: 0.6 });
    s.addText("Pack 6 完了おめでとうございます！", {
      x: 0.5, y: 1.8, w: 9, h: 0.8,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center", shrinkText: true
    });
    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 2.75, w: 3, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });
    s.addText("総まとめ＋ネクストアクション", {
      x: 0.5, y: 2.95, w: 9, h: 0.45,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", shrinkText: true
    });
    s.addText("P-05  |  ツール選定ロードマップ  |  12分", {
      x: 0.5, y: 4.0, w: 9, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textMuted, align: "center", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 2: OVERVIEW TABLE (Zone A-E)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "Pack 6で学んだ全体像", "OVERVIEW");
    addFooter(s, 2, T);

    const tableX = L.mx;
    const tableY = 0.85;
    const colWidths = [1.0, 2.0, 2.0, 3.5];
    const rowH = 0.55;
    const headers = ["Zone", "目的", "講座", "学んだツール"];

    // Header row
    let cx = tableX;
    headers.forEach((h, i) => {
      s.addShape(pres.shapes.RECTANGLE, {
        x: cx, y: tableY, w: colWidths[i], h: rowH,
        fill: { color: C.navy }
      });
      s.addText(h, {
        x: cx, y: tableY, w: colWidths[i], h: rowH,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle", shrinkText: true
      });
      cx += colWidths[i];
    });

    const rows = [
      { zone: "A", purpose: "考える", lectures: "L1-L4", tools: "ChatGPT / Claude / Gemini / Perplexity", color: C.accent, bg: C.accentLight },
      { zone: "B", purpose: "実行する", lectures: "L5-L6", tools: "Genspark / Manus", color: C.green, bg: C.greenBg },
      { zone: "C", purpose: "作る", lectures: "L7-L9", tools: "Midjourney / Veo3 / Claude資料生成", color: C.amber, bg: C.amberBg },
      { zone: "D", purpose: "掛け合わせる", lectures: "L10-L11", tools: "クロスツールワークフロー", color: C.purple, bg: C.purpleBg },
      { zone: "E", purpose: "広げる", lectures: "L12-L14", tools: "組織展開 / ロードマップ策定", color: C.teal, bg: C.tealBg },
    ];

    rows.forEach((row, ri) => {
      cx = tableX;
      const ry = tableY + (ri + 1) * rowH;
      const cells = [row.zone, row.purpose, row.lectures, row.tools];
      cells.forEach((cell, ci) => {
        const bgColor = ci === 0 ? row.bg : (ri % 2 === 0 ? C.offWhite : C.white);
        s.addShape(pres.shapes.RECTANGLE, {
          x: cx, y: ry, w: colWidths[ci], h: rowH,
          fill: { color: bgColor }, line: { color: C.border, width: 0.5 }
        });
        s.addText(cell, {
          x: cx, y: ry, w: colWidths[ci], h: rowH,
          fontSize: ci === 0 ? F.size.h3 : (ci === 3 ? F.size.label : F.size.body),
          fontFace: F.sans, bold: ci === 0 || ci === 1,
          color: ci === 0 ? row.color : (ci === 1 ? row.color : C.textBody),
          align: "center", valign: "middle", shrinkText: true
        });
        cx += colWidths[ci];
      });
    });
  }

  // ============================================================
  // SLIDE 3: ZONE A - 「考える」を加速する
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "Zone A:「考える」を加速する", "L1-L4");
    addFooter(s, 3, T);

    // Subtitle
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.85, w: L.W - L.mx * 2, h: 0.5,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    s.addText("1つの質問を4ツールで比較した時の違い", {
      x: L.mx + 0.2, y: 0.85, w: L.W - L.mx * 2 - 0.4, h: 0.5,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", shrinkText: true
    });

    const tools = [
      { name: "ChatGPT", desc: "万能選手\nメール・企画・翻訳", ic: ic.comments },
      { name: "Claude", desc: "長文読解・論理分析\n契約書・議事録", ic: ic.brain },
      { name: "Gemini", desc: "Google連携\nスプレッドシート統合", ic: ic.search },
      { name: "Perplexity", desc: "リアルタイム検索\n調査特化型", ic: ic.search },
    ];

    const cardW = 1.95;
    const cardGap = 0.15;
    const totalW = cardW * 4 + cardGap * 3;
    const startX = (L.W - totalW) / 2;

    tools.forEach((t, i) => {
      const x = startX + i * (cardW + cardGap);
      const y = 1.6;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 2.0,
        fill: { color: C.offWhite }, line: { color: C.border, width: 0.5 }, rectRadius: 0.05
      });
      s.addImage({ data: t.ic, x: x + (cardW - 0.3) / 2, y: y + 0.15, w: 0.3, h: 0.3 });
      s.addText(t.name, {
        x, y: y + 0.5, w: cardW, h: 0.35,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.accent, align: "center", shrinkText: true
      });
      s.addText(t.desc, {
        x: x + 0.1, y: y + 0.9, w: cardW - 0.2, h: 0.8,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textBody, align: "center", lineSpacingMultiple: 1.3, shrinkText: true
      });
    });

    // Bottom note
    s.addImage({ data: ic.bulb, x: L.mx, y: 3.9, w: 0.22, h: 0.22 });
    s.addText("ポイント: 「どれが一番か」ではなく「何をしたいかで使い分ける」", {
      x: L.mx + 0.3, y: 3.85, w: L.W - L.mx * 2 - 0.35, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans, italic: true,
      color: C.textLight, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 4: ZONE B - 「実行する」を自動化する
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "Zone B:「実行する」を自動化する", "L5-L6");
    addFooter(s, 4, T);

    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.85, w: L.W - L.mx * 2, h: 0.5,
      fill: { color: C.greenBg }, rectRadius: 0.05
    });
    s.addText("エージェントが変える未来", {
      x: L.mx + 0.2, y: 0.85, w: L.W - L.mx * 2 - 0.4, h: 0.5,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.green, valign: "middle", shrinkText: true
    });

    const agents = [
      { name: "Genspark", desc: "横断リサーチ\nレポート自動生成\n競合分析・市場調査", ic: ic.search },
      { name: "Manus", desc: "自律的タスク実行\nウェブ操作・ファイル生成\n一気通貫処理", ic: ic.robot },
    ];

    const cardW = 3.5;
    const cardGap = 0.5;
    const totalW = cardW * 2 + cardGap;
    const startX = (L.W - totalW) / 2;

    agents.forEach((a, i) => {
      const x = startX + i * (cardW + cardGap);
      const y = 1.6;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 2.0,
        fill: { color: C.offWhite }, line: { color: C.green, width: 1 }, rectRadius: 0.05
      });
      s.addImage({ data: a.ic, x: x + (cardW - 0.35) / 2, y: y + 0.15, w: 0.35, h: 0.35 });
      s.addText(a.name, {
        x, y: y + 0.55, w: cardW, h: 0.35,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.green, align: "center", shrinkText: true
      });
      s.addText(a.desc, {
        x: x + 0.15, y: y + 0.95, w: cardW - 0.3, h: 0.8,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, align: "center", lineSpacingMultiple: 1.3, shrinkText: true
      });
    });

    // Bottom note
    s.addImage({ data: ic.bulb, x: L.mx, y: 3.9, w: 0.22, h: 0.22 });
    s.addText("チャットAI = 質問に答える / エージェント = タスクを丸ごとこなす", {
      x: L.mx + 0.3, y: 3.85, w: L.W - L.mx * 2 - 0.35, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans, italic: true,
      color: C.textLight, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 5: ZONE C - 「作る」をAIに任せる
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "Zone C:「作る」をAIに任せる", "L7-L9");
    addFooter(s, 5, T);

    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.85, w: L.W - L.mx * 2, h: 0.5,
      fill: { color: C.amberBg }, rectRadius: 0.05
    });
    s.addText("年間160時間削減の実績", {
      x: L.mx + 0.2, y: 0.85, w: L.W - L.mx * 2 - 0.4, h: 0.5,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.amber, valign: "middle", shrinkText: true
    });

    const creative = [
      { name: "Midjourney", type: "画像", desc: "テキスト → 高品質画像\n広告・プレゼン素材", ic: ic.image },
      { name: "Veo3", type: "動画", desc: "テキスト → 動画生成\n外注30万円 → 月2,900円", ic: ic.video },
      { name: "Claude", type: "資料", desc: "プロンプト → 資料\nドラフト一瞬作成", ic: ic.file },
    ];

    const cardW = 2.5;
    const cardGap = 0.25;
    const totalW = cardW * 3 + cardGap * 2;
    const startX = (L.W - totalW) / 2;

    creative.forEach((c, i) => {
      const x = startX + i * (cardW + cardGap);
      const y = 1.6;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 2.0,
        fill: { color: C.offWhite }, line: { color: C.amber, width: 1 }, rectRadius: 0.05
      });
      // Type tag
      const tagW = 0.8;
      s.addShape(pres.shapes.RECTANGLE, {
        x: x + (cardW - tagW) / 2, y: y + 0.1, w: tagW, h: 0.22,
        fill: { color: C.amberBg }, rectRadius: 0.03
      });
      s.addText(c.type, {
        x: x + (cardW - tagW) / 2, y: y + 0.1, w: tagW, h: 0.22,
        fontSize: F.size.caption, fontFace: F.sans, bold: true,
        color: C.amber, align: "center", valign: "middle", shrinkText: true
      });
      s.addImage({ data: c.ic, x: x + (cardW - 0.3) / 2, y: y + 0.4, w: 0.3, h: 0.3 });
      s.addText(c.name, {
        x, y: y + 0.75, w: cardW, h: 0.35,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.amber, align: "center", shrinkText: true
      });
      s.addText(c.desc, {
        x: x + 0.1, y: y + 1.1, w: cardW - 0.2, h: 0.7,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, align: "center", lineSpacingMultiple: 1.3, shrinkText: true
      });
    });

    s.addImage({ data: ic.bulb, x: L.mx, y: 3.9, w: 0.22, h: 0.22 });
    s.addText("クリエイティブ作業は専門家だけのものではない", {
      x: L.mx + 0.3, y: 3.85, w: L.W - L.mx * 2 - 0.35, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans, italic: true,
      color: C.textLight, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 6: ZONE D-E - 「掛け合わせる」＋「広げる」
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "Zone D-E:「掛け合わせる」＋「広げる」", "L10-L14");
    addFooter(s, 6, T);

    // Two columns
    const colW = 3.8;
    const gap = 0.6;
    const leftX = (L.W - colW * 2 - gap) / 2;
    const rightX = leftX + colW + gap;

    // Zone D
    s.addShape(pres.shapes.RECTANGLE, {
      x: leftX, y: 0.85, w: colW, h: 0.45,
      fill: { color: C.purpleBg }, rectRadius: 0.05
    });
    s.addText("Zone D: 「掛け合わせる」", {
      x: leftX + 0.1, y: 0.85, w: colW - 0.2, h: 0.45,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.purple, valign: "middle", shrinkText: true
    });

    const dItems = [
      "Perplexity → リサーチ",
      "Claude → 分析",
      "ChatGPT → 文書化",
      "Midjourney → ビジュアル"
    ];
    dItems.forEach((item, i) => {
      const y = 1.5 + i * 0.45;
      s.addImage({ data: ic.arrow, x: leftX + 0.15, y: y + 0.08, w: 0.2, h: 0.2 });
      s.addText(item, {
        x: leftX + 0.45, y, w: colW - 0.6, h: 0.38,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, valign: "middle", shrinkText: true
      });
    });

    // Zone E
    s.addShape(pres.shapes.RECTANGLE, {
      x: rightX, y: 0.85, w: colW, h: 0.45,
      fill: { color: C.tealBg }, rectRadius: 0.05
    });
    s.addText("Zone E: 「広げる」", {
      x: rightX + 0.1, y: 0.85, w: colW - 0.2, h: 0.45,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.teal, valign: "middle", shrinkText: true
    });

    const eItems = [
      "ツール選定の基準づくり",
      "コスト対効果の見える化",
      "90日ロードマップ設計",
      "KPIによる効果測定"
    ];
    eItems.forEach((item, i) => {
      const y = 1.5 + i * 0.45;
      s.addImage({ data: ic.arrow, x: rightX + 0.15, y: y + 0.08, w: 0.2, h: 0.2 });
      s.addText(item, {
        x: rightX + 0.45, y, w: colW - 0.6, h: 0.38,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, valign: "middle", shrinkText: true
      });
    });

    // Bottom message
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.7, w: L.W - L.mx * 2, h: 0.5,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    s.addText("一人のスキルを組織の力に変える", {
      x: L.mx + 0.2, y: 3.7, w: L.W - L.mx * 2 - 0.4, h: 0.5,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", align: "center", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 7: BEFORE / AFTER
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "受講前 vs 受講後  Before / After");
    addFooter(s, 7, T);

    const tableX = L.mx;
    const tableY = 0.85;
    const colWidths = [2.2, 2.6, 2.6, 1.1];
    const rowH = 0.6;
    const headers = ["業務", "Before", "After", "削減率"];

    // Header row
    let cx = tableX;
    headers.forEach((h, i) => {
      s.addShape(pres.shapes.RECTANGLE, {
        x: cx, y: tableY, w: colWidths[i], h: rowH,
        fill: { color: C.navy }
      });
      s.addText(h, {
        x: cx, y: tableY, w: colWidths[i], h: rowH,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle", shrinkText: true
      });
      cx += colWidths[i];
    });

    const rows = [
      ["メール作成", "3時間", "30分", "83%"],
      ["リサーチ", "1日（8時間）", "30分", "94%"],
      ["提案書（たたき台）", "5時間", "5分", "98%"],
      ["動画制作", "外注30万円", "月2,900円", "99%"],
    ];

    rows.forEach((row, ri) => {
      cx = tableX;
      const ry = tableY + (ri + 1) * rowH;
      const bgColor = ri % 2 === 0 ? C.offWhite : C.white;
      row.forEach((cell, ci) => {
        const cellBg = ci === 1 ? C.redBg : (ci === 2 ? C.greenBg : bgColor);
        s.addShape(pres.shapes.RECTANGLE, {
          x: cx, y: ry, w: colWidths[ci], h: rowH,
          fill: { color: cellBg }, line: { color: C.border, width: 0.5 }
        });
        s.addText(cell, {
          x: cx, y: ry, w: colWidths[ci], h: rowH,
          fontSize: F.size.body, fontFace: F.sans,
          bold: ci === 3,
          color: ci === 1 ? C.red : (ci === 2 ? C.green : (ci === 3 ? C.green : C.textBody)),
          align: "center", valign: "middle", shrinkText: true
        });
        cx += colWidths[ci];
      });
    });

    // Note
    s.addText("※ 人間の判断と最終チェックは必ず必要です", {
      x: L.mx, y: 3.95, w: L.W - L.mx * 2, h: 0.3,
      fontSize: F.size.label, fontFace: F.sans, italic: true,
      color: C.textMuted, shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 8: 4 SKILLS ACQUIRED
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "あなたが手に入れた4つのスキル");
    addFooter(s, 8, T);

    const skills = [
      { num: "1", label: "12種類のツール操作", desc: "ChatGPT / Claude / Gemini / Perplexity / Genspark / Manus / Midjourney / Veo3 等", ic: ic.cogs, color: C.accent },
      { num: "2", label: "使い分け判断力", desc: "業務に応じて最適なツールを瞬時に選択できる力", ic: ic.brain, color: C.green },
      { num: "3", label: "ワークフロー設計力", desc: "複数ツールを組み合わせた業務プロセス全体の効率化", ic: ic.exchange, color: C.amber },
      { num: "4", label: "ロードマップ策定力", desc: "コスト計算 / 導入計画 / KPI設定まで含めた実行計画", ic: ic.map, color: C.purple },
    ];

    skills.forEach((sk, i) => {
      const y = 0.85 + i * 0.85;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.72,
        fill: { color: C.offWhite }, line: { color: C.border, width: 0.5 }, rectRadius: 0.05
      });
      s.addText(sk.num, {
        x: L.mx + 0.15, y: y + 0.13, w: 0.4, h: 0.4,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: sk.color }, shape: pres.shapes.OVAL, shrinkText: true
      });
      s.addImage({ data: sk.ic, x: L.mx + 0.65, y: y + 0.18, w: 0.3, h: 0.3 });
      s.addText(sk.label, {
        x: L.mx + 1.1, y: y + 0.05, w: 5.5, h: 0.35,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: sk.color, shrinkText: true
      });
      s.addText(sk.desc, {
        x: L.mx + 1.1, y: y + 0.38, w: L.W - L.mx * 2 - 1.3, h: 0.3,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textLight, shrinkText: true
      });
    });
  }

  // ============================================================
  // SLIDE 9: 「AIは道具。使いこなす人が勝つ」
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addFooter(s, 9, T);

    s.addImage({ data: ic.quote, x: (L.W - 0.5) / 2, y: 0.6, w: 0.5, h: 0.5 });

    s.addText("AIは道具。", {
      x: 0.5, y: 1.2, w: 9, h: 0.7,
      fontSize: 36, fontFace: F.sans, bold: true,
      color: C.navy, align: "center", shrinkText: true
    });
    s.addText("使いこなす人が勝つ。", {
      x: 0.5, y: 1.9, w: 9, h: 0.7,
      fontSize: 36, fontFace: F.sans, bold: true,
      color: C.accent, align: "center", shrinkText: true
    });

    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 2.8, w: 3, h: 0,
      line: { color: C.border, width: 1 }
    });

    // Stats
    s.addShape(pres.shapes.RECTANGLE, {
      x: 1.5, y: 3.0, w: 3.2, h: 0.7,
      fill: { color: C.redBg }, rectRadius: 0.05
    });
    s.addText("中小企業AI導入率\nまだ10%未満", {
      x: 1.5, y: 3.0, w: 3.2, h: 0.7,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.red, align: "center", valign: "middle", lineSpacingMultiple: 1.3, shrinkText: true
    });

    s.addImage({ data: ic.arrow, x: 4.85, y: 3.18, w: 0.3, h: 0.3 });

    s.addShape(pres.shapes.RECTANGLE, {
      x: 5.3, y: 3.0, w: 3.2, h: 0.7,
      fill: { color: C.greenBg }, rectRadius: 0.05
    });
    s.addText("今始めれば先行者\n1年後に差がつく", {
      x: 5.3, y: 3.0, w: 3.2, h: 0.7,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.green, align: "center", valign: "middle", lineSpacingMultiple: 1.3, shrinkText: true
    });

    s.addText("判断力さえあれば、AIは最強のパートナーになる", {
      x: 1, y: 4.0, w: 8, h: 0.4,
      fontSize: F.size.body, fontFace: F.sans, italic: true,
      color: C.textLight, align: "center", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 10: NEXT ACTIONS (3 Steps)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "ネクストアクション");
    addFooter(s, 10, T);

    const actions = [
      { num: "1", timing: "今日", label: "Google AI Proに登録", desc: "GeminiとVeo3をフル活用。投資対効果の実感が一気に高まる", ic: ic.rocket, color: C.accent },
      { num: "2", timing: "今週", label: "ロードマップのWeek1を実行", desc: "完璧を目指さない。一番簡単なタスクからAIを使ってみる", ic: ic.calendar, color: C.green },
      { num: "3", timing: "2週間後", label: "振り返り＋調整", desc: "KPIを確認し、計画を現実に合わせてアップデート", ic: ic.exchange, color: C.amber },
    ];

    actions.forEach((a, i) => {
      const y = 0.85 + i * 1.15;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.9,
        fill: { color: C.offWhite }, line: { color: a.color, width: 1 }, rectRadius: 0.05
      });
      // Timing tag
      const tagW = a.timing.length * 0.18 + 0.3;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx + 0.15, y: y + 0.1, w: tagW, h: 0.25,
        fill: { color: a.color }, rectRadius: 0.03
      });
      s.addText(a.timing, {
        x: L.mx + 0.15, y: y + 0.1, w: tagW, h: 0.25,
        fontSize: F.size.caption, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle", shrinkText: true
      });
      s.addText(a.num, {
        x: L.mx + 0.2 + tagW, y: y + 0.2, w: 0.5, h: 0.5,
        fontSize: F.size.h2, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: a.color }, shape: pres.shapes.OVAL, shrinkText: true
      });
      s.addImage({ data: a.ic, x: L.mx + 0.85 + tagW, y: y + 0.25, w: 0.35, h: 0.35 });
      s.addText(a.label, {
        x: L.mx + 1.35 + tagW, y: y + 0.1, w: 5.5 - tagW, h: 0.4,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: a.color, shrinkText: true
      });
      s.addText(a.desc, {
        x: L.mx + 1.35 + tagW, y: y + 0.5, w: 5.5 - tagW, h: 0.3,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textLight, shrinkText: true
      });
    });
  }

  // ============================================================
  // SLIDE 11: 日本のAI導入成功事例
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "日本のAI導入成功事例", "SUCCESS STORIES");
    addFooter(s, 11, T);

    const cases = [
      { name: "カオナビ", stat: "顧客115%増", desc: "AIを活用したマーケティングと顧客分析で成長を加速", ic: ic.userTie, color: C.accent, bg: C.accentLight },
      { name: "旭鉄工", stat: "生産効率1.5倍", desc: "IoT×AIによる生産ライン最適化。中小製造業の成功例", ic: ic.industry, color: C.green, bg: C.greenBg },
      { name: "ゑびや", stat: "予測的中率95%", desc: "AIによる来客数予測で食品ロスを大幅削減", ic: ic.utensils, color: C.amber, bg: C.amberBg },
    ];

    const cardW = 2.5;
    const cardGap = 0.35;
    const totalW = cardW * 3 + cardGap * 2;
    const startX = (L.W - totalW) / 2;

    cases.forEach((c, i) => {
      const x = startX + i * (cardW + cardGap);
      const y = 0.85;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 2.6,
        fill: { color: C.offWhite }, line: { color: c.color, width: 1 }, rectRadius: 0.05
      });
      s.addImage({ data: c.ic, x: x + (cardW - 0.35) / 2, y: y + 0.15, w: 0.35, h: 0.35 });
      s.addText(c.name, {
        x, y: y + 0.55, w: cardW, h: 0.35,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: c.color, align: "center", shrinkText: true
      });
      // Stat badge
      s.addShape(pres.shapes.RECTANGLE, {
        x: x + 0.2, y: y + 1.0, w: cardW - 0.4, h: 0.45,
        fill: { color: c.bg }, rectRadius: 0.05
      });
      s.addText(c.stat, {
        x: x + 0.2, y: y + 1.0, w: cardW - 0.4, h: 0.45,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: c.color, align: "center", valign: "middle", shrinkText: true
      });
      s.addText(c.desc, {
        x: x + 0.15, y: y + 1.55, w: cardW - 0.3, h: 0.8,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textBody, align: "center", lineSpacingMultiple: 1.3, shrinkText: true
      });
    });

    // Bottom message
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.7, w: L.W - L.mx * 2, h: 0.5,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    s.addText("大企業だけの話ではない。あなたも同じことができる。", {
      x: L.mx + 0.2, y: 3.7, w: L.W - L.mx * 2 - 0.4, h: 0.5,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", align: "center", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 12: END (Navy background)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };
    s.addImage({ data: ic.trophy, x: (L.W - 0.6) / 2, y: 1.2, w: 0.6, h: 0.6 });
    s.addText("お疲れさまでした！", {
      x: 0.5, y: 2.0, w: 9, h: 0.7,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center", shrinkText: true
    });
    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 2.85, w: 3, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });
    s.addText("AIを味方に、明日からの業務を変えていこう", {
      x: 0.5, y: 3.05, w: 9, h: 0.45,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", shrinkText: true
    });
    s.addText("P-05  |  Pack 6 完了", {
      x: 0.5, y: 3.85, w: 9, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textMuted, align: "center", shrinkText: true
    });
  }

  // Write file
  const outPath = __dirname + "/スライド.pptx";
  await pres.writeFile({ fileName: outPath });
  console.log("Generated:", outPath);
}

main().catch(e => { console.error(e); process.exit(1); });
