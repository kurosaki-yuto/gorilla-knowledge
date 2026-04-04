const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const {
  FaCalculator, FaBullseye, FaYenSign, FaRocket, FaStar,
  FaBuilding, FaGift, FaTable, FaArrowRight, FaCheckCircle,
  FaChartLine, FaClock, FaUsers, FaLightbulb, FaChevronRight,
  FaLayerGroup, FaComments, FaSearch, FaImage, FaVideo,
  FaMicrophone, FaBook, FaShieldAlt, FaBolt, FaClipboardList,
  FaExclamationTriangle, FaBrain, FaFileAlt, FaMoneyBillWave,
  FaCogs, FaPercent, FaHandshake, FaInfinity
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
  red: "DC2626", redBg: "FEE2E2", border: "E5E7EB"
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
  slide.addText("P-02", {
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
  pres.title = "P-02: コストシミュレーション";

  // Pre-render icons
  const ic = {
    calc: await icon(FaCalculator, C.accent),
    target: await icon(FaBullseye, C.accent),
    yen: await icon(FaYenSign, C.green),
    rocket: await icon(FaRocket, C.accent),
    star: await icon(FaStar, C.amber),
    building: await icon(FaBuilding, C.navyLight),
    gift: await icon(FaGift, C.green),
    table: await icon(FaTable, C.accent),
    arrow: await icon(FaArrowRight, C.accent),
    check: await icon(FaCheckCircle, C.green),
    checkBlue: await icon(FaCheckCircle, C.accent),
    chart: await icon(FaChartLine, C.green),
    clock: await icon(FaClock, C.amber),
    users: await icon(FaUsers, C.accent),
    bulb: await icon(FaLightbulb, C.amber),
    chevron: await icon(FaChevronRight, C.textMuted),
    layer: await icon(FaLayerGroup, C.accent),
    chat: await icon(FaComments, C.accent),
    search: await icon(FaSearch, C.accent),
    image: await icon(FaImage, C.amber),
    video: await icon(FaVideo, C.amber),
    mic: await icon(FaMicrophone, C.green),
    book: await icon(FaBook, C.accent),
    shield: await icon(FaShieldAlt, C.red),
    bolt: await icon(FaBolt, C.amber),
    clipboard: await icon(FaClipboardList, C.accent),
    brain: await icon(FaBrain, C.accent),
    file: await icon(FaFileAlt, C.accent),
    money: await icon(FaMoneyBillWave, C.green),
    cogs: await icon(FaCogs, C.accent),
    warn: await icon(FaExclamationTriangle, C.amber),
    handshake: await icon(FaHandshake, C.accent),
  };

  // ============================================================
  // SLIDE 1: TITLE (Navy background)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };
    s.addImage({ data: ic.calc, x: (L.W - 0.6) / 2, y: 1.0, w: 0.6, h: 0.6 });
    s.addText("コストシミュレーション", {
      x: 0.5, y: 1.8, w: 9, h: 0.8,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center", shrinkText: true
    });
    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 2.75, w: 3, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });
    s.addText("最新料金で比較する予算別AIスタック", {
      x: 0.5, y: 2.95, w: 9, h: 0.45,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", shrinkText: true
    });
    s.addText("P-02  |  ツール選定ロードマップ  |  12分", {
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
      "AI投資のROIを具体的な数式で計算できる",
      "0円・3,000円・9,000円・15,000円の4段階で最適スタックを選べる",
      "「40%がやり直し」問題を理解し、正しい対策を実行できる",
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
  // SLIDE 3: ROI FORMULA
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "AI投資のROIの考え方", "ROI");
    addFooter(s, 3, T);

    // ROI formula box
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.85, w: L.W - L.mx * 2, h: 0.6,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    s.addText("時給 × 週節約時間 × 4週 = 月間価値", {
      x: L.mx + 0.3, y: 0.85, w: L.W - L.mx * 2 - 0.6, h: 0.6,
      fontSize: F.size.h2, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", shrinkText: true
    });

    // Concrete example
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 1.6, w: L.W - L.mx * 2, h: 0.5,
      fill: { color: C.greenBg }, rectRadius: 0.05
    });
    s.addText("具体例: ¥3,000 × 7時間 × 4週 = 月84,000円", {
      x: L.mx + 0.3, y: 1.6, w: L.W - L.mx * 2 - 0.6, h: 0.5,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.green, valign: "middle", shrinkText: true
    });

    // Flow cards
    const flow = [
      { label: "月間価値", value: "¥84,000", color: C.accent, bg: C.accentLight },
      { label: "やり直しロス 40%", value: "-¥33,600", color: C.red, bg: C.redBg },
      { label: "実質月間価値", value: "¥50,400", color: C.green, bg: C.greenBg },
    ];

    const cardW = 2.4;
    const cardGap = 0.4;
    const totalW = cardW * 3 + cardGap * 2;
    const startX = (L.W - totalW) / 2;

    flow.forEach((item, i) => {
      const x = startX + i * (cardW + cardGap);
      const y = 2.35;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 1.1,
        fill: { color: item.bg }, line: { color: C.border, width: 0.5 }, rectRadius: 0.05
      });
      s.addText(item.label, {
        x, y: y + 0.1, w: cardW, h: 0.3,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textLight, align: "center", shrinkText: true
      });
      s.addText(item.value, {
        x, y: y + 0.4, w: cardW, h: 0.5,
        fontSize: F.size.h2, fontFace: F.sans, bold: true,
        color: item.color, align: "center", valign: "middle", shrinkText: true
      });
      // Arrows between cards
      if (i < 2) {
        s.addImage({ data: ic.arrow, x: x + cardW + (cardGap - 0.2) / 2, y: y + 0.4, w: 0.2, h: 0.2 });
      }
    });

    // Bottom ROI summary
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.7, w: L.W - L.mx * 2, h: 0.7,
      fill: { color: C.navy }, rectRadius: 0.05
    });
    s.addText("年間60万円の価値  vs  AIツール代 年間15万円  =  ROI 400%", {
      x: L.mx + 0.3, y: 3.7, w: L.W - L.mx * 2 - 0.6, h: 0.7,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.white, valign: "middle", shrinkText: true
    });

    // Insight
    s.addImage({ data: ic.bulb, x: L.mx, y: 4.6, w: 0.2, h: 0.2 });
    s.addText("週5-7時間節約/人、マネージャー層は7-10時間", {
      x: L.mx + 0.3, y: 4.55, w: L.W - L.mx * 2 - 0.35, h: 0.3,
      fontSize: F.size.label, fontFace: F.sans, italic: true,
      color: C.textLight, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 4: ZERO YEN START
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "ゼロ円スタート", "BUDGET LEVEL 0");
    addFooter(s, 4, T);

    // Budget badge
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.W - 2.5, y: 0.15, w: 1.7, h: 0.35,
      fill: { color: C.greenBg }, rectRadius: 0.05
    });
    s.addText("¥0/月", {
      x: L.W - 2.5, y: 0.15, w: 1.7, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.green, align: "center", valign: "middle", shrinkText: true
    });

    const tools = [
      { ic: ic.chat, name: "ChatGPT 無料版", detail: "GPT-4o制限付き", limit: "文章生成・翻訳・分析" },
      { ic: ic.brain, name: "Claude 無料版", detail: "1日の回数制限", limit: "長文分析・コーディング" },
      { ic: ic.search, name: "Perplexity 無料版", detail: "1日5回Pro検索", limit: "AI検索・リサーチ" },
      { ic: ic.video, name: "Veo 3 無料枠", detail: "AI Studio経由", limit: "動画生成" },
      { ic: ic.mic, name: "ElevenLabs 無料", detail: "月10,000文字", limit: "音声合成" },
    ];

    tools.forEach((t, i) => {
      const y = 0.8 + i * 0.62;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.5,
        fill: { color: i % 2 === 0 ? C.offWhite : C.white },
        line: { color: C.border, width: 0.5 }, rectRadius: 0.05
      });
      s.addImage({ data: t.ic, x: L.mx + 0.15, y: y + 0.1, w: 0.3, h: 0.3 });
      s.addText(t.name, {
        x: L.mx + 0.55, y, w: 2.5, h: 0.5,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.textDark, valign: "middle", shrinkText: true
      });
      s.addText(t.detail, {
        x: L.mx + 3.0, y, w: 2.2, h: 0.5,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textLight, valign: "middle", shrinkText: true
      });
      s.addText(t.limit, {
        x: L.W - L.mx - 2.8, y, w: 2.5, h: 0.5,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.green, valign: "middle", align: "right", shrinkText: true
      });
    });

    // Key insight
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.0, w: L.W - L.mx * 2, h: 0.45,
      fill: { color: C.greenBg }, rectRadius: 0.05
    });
    s.addImage({ data: ic.gift, x: L.mx + 0.15, y: 4.08, w: 0.25, h: 0.25 });
    s.addText("テキスト・検索・動画・音声の4カテゴリを1円も使わず体験できる", {
      x: L.mx + 0.5, y: 4.0, w: L.W - L.mx * 2 - 0.7, h: 0.45,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.green, valign: "middle", shrinkText: true
    });

    s.addImage({ data: ic.target, x: L.mx, y: 4.6, w: 0.2, h: 0.2 });
    s.addText("対象: AI活用をこれから始める方 | まず2週間この構成で試す", {
      x: L.mx + 0.3, y: 4.55, w: L.W - L.mx * 2 - 0.35, h: 0.3,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textMuted, shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 5: ¥3,000/mo — ChatGPT Plus only
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "月3,000円 これだけで60%カバー", "BUDGET LEVEL 1");
    addFooter(s, 5, T);

    // Budget badge
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.W - 2.5, y: 0.15, w: 1.7, h: 0.35,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    s.addText("¥3,000/月", {
      x: L.W - 2.5, y: 0.15, w: 1.7, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.accent, align: "center", valign: "middle", shrinkText: true
    });

    // Main tool card
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.85, w: L.W - L.mx * 2, h: 1.3,
      fill: { color: C.offWhite }, line: { color: C.accent, width: 1.5 }, rectRadius: 0.08
    });
    s.addImage({ data: ic.chat, x: L.mx + 0.25, y: 1.0, w: 0.4, h: 0.4 });
    s.addText("ChatGPT Plus", {
      x: L.mx + 0.8, y: 0.9, w: 4, h: 0.4,
      fontSize: F.size.h2, fontFace: F.sans, bold: true,
      color: C.textDark, shrinkText: true
    });
    s.addText("$20/月（≒¥3,000）", {
      x: L.W - L.mx - 2.5, y: 0.9, w: 2.2, h: 0.4,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.accent, align: "right", shrinkText: true
    });
    s.addText("GPT-4o無制限 | DALL-E画像生成 | Advanced Data Analysis | GPTs", {
      x: L.mx + 0.8, y: 1.35, w: L.W - L.mx * 2 - 1, h: 0.35,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textBody, shrinkText: true
    });
    s.addText("業務の60%以上をカバー", {
      x: L.mx + 0.8, y: 1.7, w: 4, h: 0.3,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.green, shrinkText: true
    });

    // Use cases
    s.addText("カバーする業務", {
      x: L.mx, y: 2.4, w: 3, h: 0.3,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.textDark, shrinkText: true
    });

    const useCases = [
      "メール作成・下書き", "企画書ドラフト", "翻訳・要約",
      "Excelデータ分析", "ブレインストーミング", "コーディング支援"
    ];

    useCases.forEach((uc, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const x = L.mx + col * 2.8;
      const y = 2.75 + row * 0.45;
      s.addImage({ data: ic.check, x, y: y + 0.05, w: 0.18, h: 0.18 });
      s.addText(uc, {
        x: x + 0.25, y, w: 2.3, h: 0.35,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textBody, valign: "middle", shrinkText: true
      });
    });

    // ROI note
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.85, w: L.W - L.mx * 2, h: 0.5,
      fill: { color: C.amberBg }, rectRadius: 0.05
    });
    s.addImage({ data: ic.chart, x: L.mx + 0.15, y: 3.93, w: 0.25, h: 0.25 });
    s.addText("週5h節約 × 時給¥3,000 = 月¥60,000の価値 → ROI 2,000%", {
      x: L.mx + 0.5, y: 3.85, w: L.W - L.mx * 2 - 0.7, h: 0.5,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.amber, valign: "middle", shrinkText: true
    });

    s.addImage({ data: ic.target, x: L.mx, y: 4.55, w: 0.2, h: 0.2 });
    s.addText("対象: 初めてAIに課金する方 | 最初の1本に最適", {
      x: L.mx + 0.3, y: 4.5, w: L.W - L.mx * 2 - 0.35, h: 0.3,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textMuted, shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 6: ¥9,000/mo — 3-TOOL STACK
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "月9,000円 業務の80%カバー", "BUDGET LEVEL 2");
    addFooter(s, 6, T);

    // Budget badge
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.W - 2.5, y: 0.15, w: 1.7, h: 0.35,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    s.addText("¥9,000/月", {
      x: L.W - 2.5, y: 0.15, w: 1.7, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.accent, align: "center", valign: "middle", shrinkText: true
    });

    const tools = [
      { ic: ic.chat, name: "ChatGPT Plus", price: "$20/月 ≒ ¥3,000", role: "汎用AI -- あらゆる業務の第一打席", color: C.accent },
      { ic: ic.brain, name: "Claude Pro", price: "$20/月 ≒ ¥3,000", role: "深い思考 -- 報告書・契約書・企画書", color: C.green, note: "年払い$17/月" },
      { ic: ic.search, name: "Perplexity Pro", price: "$20/月 ≒ ¥3,000", role: "AI検索 -- 出典付き高速リサーチ", color: C.amber },
    ];

    tools.forEach((t, i) => {
      const y = 0.85 + i * 1.05;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.85,
        fill: { color: C.offWhite }, line: { color: C.border, width: 0.5 }, rectRadius: 0.05
      });
      s.addImage({ data: t.ic, x: L.mx + 0.2, y: y + 0.12, w: 0.35, h: 0.35 });
      s.addText(t.name, {
        x: L.mx + 0.7, y: y + 0.05, w: 3.5, h: 0.35,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, shrinkText: true
      });
      s.addText(t.price, {
        x: L.W - L.mx - 2.8, y: y + 0.05, w: 2.5, h: 0.35,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: t.color, align: "right", shrinkText: true
      });
      s.addText(t.role, {
        x: L.mx + 0.7, y: y + 0.42, w: L.W - L.mx * 2 - 1, h: 0.3,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textBody, shrinkText: true
      });
      if (t.note) {
        s.addShape(pres.shapes.RECTANGLE, {
          x: L.mx + 4.3, y: y + 0.08, w: 1.3, h: 0.22,
          fill: { color: C.greenBg }, rectRadius: 0.05
        });
        s.addText(t.note, {
          x: L.mx + 4.3, y: y + 0.08, w: 1.3, h: 0.22,
          fontSize: F.size.caption, fontFace: F.sans, bold: true,
          color: C.green, align: "center", valign: "middle", shrinkText: true
        });
      }
    });

    // ROI summary
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.0, w: L.W - L.mx * 2, h: 0.5,
      fill: { color: C.greenBg }, rectRadius: 0.05
    });
    s.addImage({ data: ic.chart, x: L.mx + 0.15, y: 4.08, w: 0.25, h: 0.25 });
    s.addText("週7h節約 → 実質月¥50,400（やり直しロス込み）→ 年間60万円の価値", {
      x: L.mx + 0.5, y: 4.0, w: L.W - L.mx * 2 - 0.7, h: 0.5,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.green, valign: "middle", shrinkText: true
    });

    s.addImage({ data: ic.target, x: L.mx, y: 4.65, w: 0.2, h: 0.2 });
    s.addText("対象: 業務で本格活用したい方 | テキスト系業務をほぼ全カバー", {
      x: L.mx + 0.3, y: 4.6, w: L.W - L.mx * 2 - 0.35, h: 0.3,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textMuted, shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 7: ¥15,000/mo — FULL STACK
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "月15,000円 フルスタック", "BUDGET LEVEL 3");
    addFooter(s, 7, T);

    // Budget badge
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.W - 2.5, y: 0.15, w: 1.7, h: 0.35,
      fill: { color: C.amberBg }, rectRadius: 0.05
    });
    s.addText("¥15,000/月", {
      x: L.W - 2.5, y: 0.15, w: 1.7, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.amber, align: "center", valign: "middle", shrinkText: true
    });

    // Existing tools (compact)
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.8, w: L.W - L.mx * 2, h: 0.4,
      fill: { color: C.lightGray }, rectRadius: 0.05
    });
    s.addText("テキスト3本: ChatGPT Plus + Claude Pro + Perplexity Pro = ¥9,000", {
      x: L.mx + 0.15, y: 0.8, w: L.W - L.mx * 2 - 0.3, h: 0.4,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textLight, valign: "middle", shrinkText: true
    });

    // New creative tools
    const newTools = [
      {
        ic: ic.video, name: "Google AI Pro", price: "$19.99/月 ≒ ¥2,900",
        desc: "Veo 3動画生成 + Gemini高性能AI\n初月無料 -- リスクゼロで試せる",
        color: C.accent, tag: "NEW"
      },
      {
        ic: ic.image, name: "Midjourney Basic", price: "$10/月 ≒ ¥1,500",
        desc: "高品質画像生成\nプレゼン資料・SNS画像・企画書ビジュアル",
        color: C.amber, tag: "NEW"
      },
    ];

    newTools.forEach((t, i) => {
      const y = 1.45 + i * 1.1;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.9,
        fill: { color: C.offWhite }, line: { color: C.border, width: 0.5 }, rectRadius: 0.05
      });
      s.addImage({ data: t.ic, x: L.mx + 0.15, y: y + 0.15, w: 0.3, h: 0.3 });
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx + 0.55, y: y + 0.1, w: 0.55, h: 0.22,
        fill: { color: C.greenBg }, rectRadius: 0.05
      });
      s.addText(t.tag, {
        x: L.mx + 0.55, y: y + 0.1, w: 0.55, h: 0.22,
        fontSize: F.size.caption, fontFace: F.sans, bold: true,
        color: C.green, align: "center", valign: "middle", shrinkText: true
      });
      s.addText(t.name, {
        x: L.mx + 1.2, y: y + 0.02, w: 3.5, h: 0.35,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.textDark, shrinkText: true
      });
      s.addText(t.price, {
        x: L.W - L.mx - 2.5, y: y + 0.02, w: 2.2, h: 0.35,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: t.color, align: "right", shrinkText: true
      });
      s.addText(t.desc, {
        x: L.mx + 0.55, y: y + 0.42, w: L.W - L.mx * 2 - 0.7, h: 0.42,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textBody, lineSpacingMultiple: 1.2, shrinkText: true
      });
    });

    // Total
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.8, w: L.W - L.mx * 2, h: 0.45,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    s.addText("合計: 約¥15,400/月（初月はGoogle AI Pro無料で約¥12,500）", {
      x: L.mx + 0.2, y: 3.8, w: L.W - L.mx * 2 - 0.4, h: 0.45,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", shrinkText: true
    });

    // Target
    s.addImage({ data: ic.chart, x: L.mx, y: 4.45, w: 0.2, h: 0.2 });
    s.addText("テキスト+画像+動画+検索 全領域カバー | マネージャー層は週10h節約可能", {
      x: L.mx + 0.3, y: 4.4, w: L.W - L.mx * 2 - 0.35, h: 0.3,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textMuted, shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 8: ROI COMPARISON TABLE
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "各プランの年間ROI試算", "TABLE");
    addFooter(s, 8, T);

    // Subtitle
    s.addText("前提: 時給¥3,000 / やり直しロス40%控除後", {
      x: L.mx, y: 0.75, w: L.W - L.mx * 2, h: 0.3,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textLight, shrinkText: true
    });

    // Table
    const colX = [L.mx, L.mx + 1.9, L.mx + 3.2, L.mx + 4.5, L.mx + 5.9, L.mx + 7.3];
    const colW = [1.9, 1.3, 1.3, 1.4, 1.4, 1.2];
    const headers = ["プラン", "月額", "週節約", "実質月間価値", "年間価値", "ROI"];

    const headerY = 1.1;
    headers.forEach((h, i) => {
      s.addShape(pres.shapes.RECTANGLE, {
        x: colX[i], y: headerY, w: colW[i], h: 0.4,
        fill: { color: C.navy }
      });
      s.addText(h, {
        x: colX[i], y: headerY, w: colW[i], h: 0.4,
        fontSize: F.size.caption, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle", shrinkText: true
      });
    });

    const rows = [
      ["ゼロ円", "¥0", "2-3h", "¥21,600", "¥259,200", "∞"],
      ["月3,000円", "¥3,000", "5h", "¥36,000", "¥432,000", "1,200%"],
      ["月9,000円", "¥9,000", "7h", "¥50,400", "¥604,800", "560%"],
      ["月15,000円", "¥15,000", "10h", "¥72,000", "¥864,000", "480%"],
    ];

    const rowColors = [C.greenBg, C.offWhite, C.accentLight, C.amberBg];

    rows.forEach((row, ri) => {
      const y = headerY + 0.4 + ri * 0.55;
      row.forEach((cell, ci) => {
        s.addShape(pres.shapes.RECTANGLE, {
          x: colX[ci], y, w: colW[ci], h: 0.55,
          fill: { color: rowColors[ri] },
          line: { color: C.border, width: 0.3 }
        });
        const isROI = ci === 5;
        s.addText(cell, {
          x: colX[ci], y, w: colW[ci], h: 0.55,
          fontSize: isROI ? F.size.body : F.size.label, fontFace: F.sans,
          bold: isROI || ci === 0,
          color: isROI ? C.green : (ci === 0 ? C.textDark : C.textBody),
          align: "center", valign: "middle", shrinkText: true
        });
      });
    });

    // Key insight
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.7, w: L.W - L.mx * 2, h: 0.5,
      fill: { color: C.greenBg }, rectRadius: 0.05
    });
    s.addImage({ data: ic.chart, x: L.mx + 0.15, y: 3.78, w: 0.25, h: 0.25 });
    s.addText("どのプランでもROI 400%超え -- AIは確実にリターンが出る投資", {
      x: L.mx + 0.5, y: 3.7, w: L.W - L.mx * 2 - 0.7, h: 0.5,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.green, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 9: 40% REDO PROBLEM & SOLUTIONS
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "「40%がやり直し」問題の対策", "IMPORTANT");
    addFooter(s, 9, T);

    // Problem statement
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.85, w: L.W - L.mx * 2, h: 0.55,
      fill: { color: C.redBg }, rectRadius: 0.05
    });
    s.addImage({ data: ic.warn, x: L.mx + 0.15, y: 0.93, w: 0.25, h: 0.25 });
    s.addText("AIの出力の40%はそのまま使えない（精度不足・的外れ・ハルシネーション）", {
      x: L.mx + 0.5, y: 0.85, w: L.W - L.mx * 2 - 0.7, h: 0.55,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.red, valign: "middle", shrinkText: true
    });

    // 3 solutions
    const solutions = [
      {
        num: "1", ic: ic.file, label: "正しいプロンプト",
        desc: "役割・背景・条件・出力形式を明確に指定\n例: 「BtoB SaaSの営業MGRとして提案書をA4 2P箇条書きで」",
        color: C.accent, bg: C.accentLight
      },
      {
        num: "2", ic: ic.shield, label: "ファクトチェック",
        desc: "AIの出力を必ず検証。特に数値・固有名詞・法的事項\nPerplexityの出典付き回答を活用",
        color: C.green, bg: C.greenBg
      },
      {
        num: "3", ic: ic.layer, label: "段階的導入",
        desc: "いきなり100%任せない\nAIに下書き → 人間が仕上げるフローから始める",
        color: C.amber, bg: C.amberBg
      },
    ];

    solutions.forEach((sol, i) => {
      const y = 1.65 + i * 0.9;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.75,
        fill: { color: sol.bg }, rectRadius: 0.05
      });
      s.addText(sol.num, {
        x: L.mx + 0.1, y: y + 0.05, w: 0.4, h: 0.4,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: sol.color }, shape: pres.shapes.OVAL, shrinkText: true
      });
      s.addImage({ data: sol.ic, x: L.mx + 0.6, y: y + 0.1, w: 0.25, h: 0.25 });
      s.addText(sol.label, {
        x: L.mx + 0.95, y: y, w: 3, h: 0.35,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: sol.color, shrinkText: true
      });
      s.addText(sol.desc, {
        x: L.mx + 0.95, y: y + 0.32, w: L.W - L.mx * 2 - 1.15, h: 0.4,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textBody, lineSpacingMultiple: 1.2, shrinkText: true
      });
    });

    // Improvement result
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.4, w: L.W - L.mx * 2, h: 0.5,
      fill: { color: C.greenBg }, rectRadius: 0.05
    });
    s.addImage({ data: ic.rocket, x: L.mx + 0.15, y: 4.48, w: 0.25, h: 0.25 });
    s.addText("対策徹底でやり直し率 40% → 15%に改善 → ROI 700%超へ", {
      x: L.mx + 0.5, y: 4.4, w: L.W - L.mx * 2 - 0.7, h: 0.5,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.green, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 10: PROPOSAL TEMPLATE
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "会社への提案テンプレート", "TEMPLATE");
    addFooter(s, 10, T);

    // Subtitle
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.8, w: L.W - L.mx * 2, h: 0.4,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    s.addText("ポイント: 数字で語る -- 年間○時間削減、○万円節約、ROI○%", {
      x: L.mx + 0.2, y: 0.8, w: L.W - L.mx * 2 - 0.4, h: 0.4,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", shrinkText: true
    });

    // Template steps
    const steps = [
      { num: "1", label: "現状の課題", example: "「営業5人が提案書作成に月20h/人。年間1,200時間」", color: C.red },
      { num: "2", label: "提案", example: "「ChatGPT Plus + Claude Proで作成時間50%削減」", color: C.accent },
      { num: "3", label: "コスト", example: "「月¥9,000 × 5人 = 月¥45,000。年間¥540,000」", color: C.amber },
      { num: "4", label: "リターン", example: "「年間600h削減 × 時給¥3,000 = 年間¥1,800,000」", color: C.green },
      { num: "5", label: "ROI", example: "「投資¥54万 → リターン¥180万 = ROI 333%」", color: C.green },
    ];

    steps.forEach((st, i) => {
      const y = 1.35 + i * 0.58;
      s.addText(st.num, {
        x: L.mx + 0.05, y: y + 0.02, w: 0.35, h: 0.35,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: st.color }, shape: pres.shapes.OVAL, shrinkText: true
      });
      s.addText(st.label, {
        x: L.mx + 0.5, y, w: 1.5, h: 0.4,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: st.color, valign: "middle", shrinkText: true
      });
      s.addText(st.example, {
        x: L.mx + 2.0, y, w: L.W - L.mx * 2 - 2.2, h: 0.4,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textBody, valign: "middle", shrinkText: true
      });
      if (i < 4) {
        s.addShape(pres.shapes.LINE, {
          x: L.mx + 0.5, y: y + 0.5, w: L.W - L.mx * 2 - 0.5, h: 0,
          line: { color: C.border, width: 0.3 }
        });
      }
    });

    // Supplement
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.35, w: L.W - L.mx * 2, h: 0.5,
      fill: { color: C.greenBg }, rectRadius: 0.05
    });
    s.addImage({ data: ic.handshake, x: L.mx + 0.15, y: 4.43, w: 0.25, h: 0.25 });
    s.addText("補足: 「全ツールに無料版あり。まず1か月トライアルから」→ リスクの低さで後押し", {
      x: L.mx + 0.5, y: 4.35, w: L.W - L.mx * 2 - 0.7, h: 0.5,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.green, valign: "middle", shrinkText: true
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

    const points = [
      { ic: ic.calc, text: "ROI公式: 時給 × 週節約時間 × 4週 × 60%（やり直しロス控除）", color: C.accent },
      { ic: ic.layer, text: "予算4段階: ¥0 → ¥3,000 → ¥9,000 → ¥15,000", color: C.green },
      { ic: ic.chart, text: "どのプランでもROI 400%超え -- AIは確実にリターンが出る投資", color: C.amber },
      { ic: ic.shield, text: "やり直しロスは対策で40%→15%に改善可能", color: C.red },
      { ic: ic.handshake, text: "会社提案は「数字で語る」-- 年間○時間、○万円、ROI○%", color: C.accent },
    ];

    points.forEach((p, i) => {
      const y = 0.75 + i * 0.63;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.5,
        fill: { color: C.offWhite }, line: { color: C.border, width: 0.5 }, rectRadius: 0.05
      });
      s.addImage({ data: p.ic, x: L.mx + 0.15, y: y + 0.1, w: 0.28, h: 0.28 });
      s.addText(p.text, {
        x: L.mx + 0.55, y, w: L.W - L.mx * 2 - 0.75, h: 0.5,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: p.color, valign: "middle", shrinkText: true
      });
    });

    // Test info
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.1, w: L.W - L.mx * 2, h: 0.5,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    s.addImage({ data: ic.checkBlue, x: L.mx + 0.2, y: 4.2, w: 0.25, h: 0.25 });
    s.addText("確認テスト: 5問中4問正解(80%)で修了", {
      x: L.mx + 0.55, y: 4.1, w: L.W - L.mx * 2 - 0.75, h: 0.5,
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
    s.addText("P-02 修了", {
      x: 0.5, y: 2.0, w: 9, h: 0.7,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center", shrinkText: true
    });
    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 2.85, w: 3, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });
    s.addText("コストを制する者がAI活用を制す", {
      x: 0.5, y: 3.05, w: 9, h: 0.45,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", shrinkText: true
    });
    s.addText("次のステップ: P-03 90日ロードマップ設計", {
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
