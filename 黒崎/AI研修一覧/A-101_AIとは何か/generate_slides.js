const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const {
  FaBrain, FaBullseye, FaRobot, FaCogs, FaDatabase, FaMagic,
  FaLightbulb, FaExclamationTriangle, FaCheckCircle, FaArrowRight,
  FaFileAlt, FaSearch, FaComments, FaLock, FaEye, FaBalanceScale,
  FaChevronRight, FaPencilAlt, FaShoppingCart, FaEnvelope,
  FaChartLine, FaMicrochip, FaGlobe, FaImage, FaCode, FaVideo,
  FaShieldAlt, FaBolt, FaHistory, FaChess, FaFilter, FaMicrophone,
  FaUserCheck, FaRegLightbulb, FaClipboardList, FaCopyright
} = require("react-icons/fa");

// =====================================================
// DESIGN SYSTEM (per spec)
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
  slide.addText("A-101", {
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

const T = 16; // total slides

async function main() {
  pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "Gorilla Knowledge";
  pres.title = "A-101: AIとは何か？ -- 歴史から最新トレンドまで";

  // Pre-render icons
  const ic = {
    brain: await icon(FaBrain, C.accent),
    target: await icon(FaBullseye, C.accent),
    robot: await icon(FaRobot, C.navyLight),
    cogs: await icon(FaCogs, C.accent),
    db: await icon(FaDatabase, C.green),
    magic: await icon(FaMagic, C.amber),
    bulb: await icon(FaLightbulb, C.amber),
    warn: await icon(FaExclamationTriangle, C.amber),
    check: await icon(FaCheckCircle, C.green),
    checkBlue: await icon(FaCheckCircle, C.accent),
    arrow: await icon(FaArrowRight, C.accent),
    file: await icon(FaFileAlt, C.accent),
    search: await icon(FaSearch, C.accent),
    chat: await icon(FaComments, C.accent),
    lock: await icon(FaLock, C.red),
    eye: await icon(FaEye, C.amber),
    balance: await icon(FaBalanceScale, C.red),
    pencil: await icon(FaPencilAlt, C.accent),
    chevron: await icon(FaChevronRight, C.textMuted),
    chart: await icon(FaChartLine, C.green),
    chip: await icon(FaMicrochip, C.accent),
    globe: await icon(FaGlobe, C.green),
    image: await icon(FaImage, C.amber),
    code: await icon(FaCode, C.accent),
    video: await icon(FaVideo, C.amber),
    shield: await icon(FaShieldAlt, C.red),
    bolt: await icon(FaBolt, C.amber),
    history: await icon(FaHistory, C.accent),
    chess: await icon(FaChess, C.navyLight),
    filter: await icon(FaFilter, C.accent),
    mic: await icon(FaMicrophone, C.green),
    userCheck: await icon(FaUserCheck, C.accent),
    clipboard: await icon(FaClipboardList, C.accent),
    copyright: await icon(FaCopyright, C.red),
  };

  // ============================================================
  // SLIDE 1: TITLE (Navy background)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };
    s.addImage({ data: ic.brain, x: (L.W - 0.6) / 2, y: 1.0, w: 0.6, h: 0.6 });
    s.addText("AIとは何か？", {
      x: 0.5, y: 1.8, w: 9, h: 0.8,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center", shrinkText: true
    });
    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 2.75, w: 3, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });
    s.addText("歴史から最新トレンドまで", {
      x: 0.5, y: 2.95, w: 9, h: 0.45,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", shrinkText: true
    });
    s.addText("A-101  |  全社員向け入門  |  20分", {
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
      "AIの定義を一文で説明できる",
      "3つの波（ルールベース / 機械学習 / 生成AI）を区別できる",
      "生成AIブームの背景と意義を理解する",
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
  // SLIDE 3: AI DEFINITION
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "AIって結局なに？");
    addFooter(s, 3, T);

    // Definition box
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.85, w: L.W - L.mx * 2, h: 0.7,
      fill: { color: C.accentLight }
    });
    s.addText("人間の知的なふるまいを、コンピュータで再現する技術", {
      x: L.mx + 0.3, y: 0.85, w: L.W - L.mx * 2 - 0.6, h: 0.7,
      fontSize: F.size.h2, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", shrinkText: true
    });

    // 3 cards
    const examples = [
      { ic: ic.eye, label: "判断する", desc: "スパム判別" },
      { ic: ic.chart, label: "予測する", desc: "渋滞・売上予想" },
      { ic: ic.pencil, label: "作る", desc: "文章・画像生成" },
    ];

    const cardW = 2.5;
    const cardGap = 0.25;
    const totalW = cardW * 3 + cardGap * 2;
    const startX = (L.W - totalW) / 2;

    examples.forEach((e, i) => {
      const x = startX + i * (cardW + cardGap);
      const y = 1.85;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 1.4,
        fill: { color: C.offWhite }, line: { color: C.border, width: 0.5 }
      });
      s.addImage({ data: e.ic, x: x + (cardW - 0.3) / 2, y: y + 0.15, w: 0.3, h: 0.3 });
      s.addText(e.label, {
        x, y: y + 0.5, w: cardW, h: 0.35,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, align: "center", shrinkText: true
      });
      s.addText(e.desc, {
        x, y: y + 0.85, w: cardW, h: 0.35,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textLight, align: "center", shrinkText: true
      });
    });

    // Footnote
    s.addImage({ data: ic.bulb, x: L.mx, y: 3.6, w: 0.22, h: 0.22 });
    s.addText("AIは「考えている」のではなく、パターンを見つけて答えを出す技術", {
      x: L.mx + 0.3, y: 3.55, w: L.W - L.mx * 2 - 0.35, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans, italic: true,
      color: C.textLight, valign: "middle", shrinkText: true
    });

    //身近な例
    s.addText("身近な例: メールのスパムフィルタ / カーナビの渋滞予測 / スマホの音声アシスタント", {
      x: L.mx, y: 4.1, w: L.W - L.mx * 2, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textMuted, shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 4: THREE WAVES TIMELINE
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "AIの3つの波 -- 全体タイムライン", "HISTORY");
    addFooter(s, 4, T);

    const waves = [
      { era: "1950年代〜", label: "第1の波", desc: "ルールベースAI", sub: "人間がルールを書く", color: C.accent, bg: C.accentLight },
      { era: "2010年代〜", label: "第2の波", desc: "機械学習", sub: "データからパターンを学ぶ", color: C.green, bg: C.greenBg },
      { era: "2020年代〜", label: "第3の波", desc: "生成AI", sub: "新しいものを作る", color: C.amber, bg: C.amberBg },
    ];

    const cardW = 2.5;
    const cardGap = 0.3;
    const totalW = cardW * 3 + cardGap * 2;
    const startX = (L.W - totalW) / 2;

    // Timeline line
    s.addShape(pres.shapes.LINE, {
      x: startX + 0.2, y: 1.15, w: totalW - 0.4, h: 0,
      line: { color: C.textMuted, width: 1.5 }
    });

    waves.forEach((w, i) => {
      const x = startX + i * (cardW + cardGap);
      // Era label
      s.addText(w.era, {
        x, y: 0.85, w: cardW, h: 0.25,
        fontSize: F.size.label, fontFace: F.sans, bold: true,
        color: w.color, align: "center", shrinkText: true
      });
      // Dot on timeline
      s.addShape(pres.shapes.OVAL, {
        x: x + cardW / 2 - 0.08, y: 1.07, w: 0.16, h: 0.16,
        fill: { color: w.color }
      });
      // Card
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: 1.55, w: cardW, h: 2.2,
        fill: { color: w.bg }, line: { color: w.color, width: 1 }, rectRadius: 0.05
      });
      s.addText(w.label, {
        x, y: 1.65, w: cardW, h: 0.35,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: w.color, align: "center", shrinkText: true
      });
      s.addText(w.desc, {
        x, y: 2.05, w: cardW, h: 0.35,
        fontSize: F.size.h2, fontFace: F.sans, bold: true,
        color: C.textDark, align: "center", shrinkText: true
      });
      s.addText(w.sub, {
        x, y: 2.55, w: cardW, h: 0.35,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, align: "center", shrinkText: true
      });

      // Arrow between cards
      if (i < 2) {
        s.addImage({
          data: ic.chevron,
          x: x + cardW + (cardGap - 0.2) / 2,
          y: 2.3, w: 0.2, h: 0.2
        });
      }
    });
  }

  // ============================================================
  // SLIDE 5: WAVE 1 - RULE-BASED AI (mechanism)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "第1の波: ルールベースAI", "1950年代〜");
    addFooter(s, 5, T);

    // Mechanism box
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 1.1, w: L.W - L.mx * 2, h: 0.45,
      fill: { color: C.accentLight }
    });
    s.addText("仕組み: 「もしXならYする」を人間がプログラムで記述", {
      x: L.mx + 0.2, y: 1.1, w: L.W - L.mx * 2 - 0.4, h: 0.45,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", shrinkText: true
    });

    // Two columns: メリット / デメリット
    const colW = 3.9;
    const col1X = L.mx;
    const col2X = L.mx + colW + 0.4;

    // Merit
    s.addShape(pres.shapes.RECTANGLE, {
      x: col1X, y: 1.8, w: colW, h: 1.5,
      fill: { color: C.greenBg }, rectRadius: 0.05
    });
    s.addImage({ data: ic.check, x: col1X + 0.15, y: 1.9, w: 0.25, h: 0.25 });
    s.addText("メリット", {
      x: col1X + 0.45, y: 1.9, w: 2, h: 0.3,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.green, shrinkText: true
    });
    s.addText("- 動きが予測できる\n- 結果の根拠を説明しやすい\n- 医療・法律で今も活用", {
      x: col1X + 0.15, y: 2.25, w: colW - 0.3, h: 0.85,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textBody, lineSpacingMultiple: 1.2, shrinkText: true
    });

    // Demerit
    s.addShape(pres.shapes.RECTANGLE, {
      x: col2X, y: 1.8, w: colW, h: 1.5,
      fill: { color: C.redBg }, rectRadius: 0.05
    });
    s.addImage({ data: ic.warn, x: col2X + 0.15, y: 1.9, w: 0.25, h: 0.25 });
    s.addText("デメリット", {
      x: col2X + 0.45, y: 1.9, w: 2, h: 0.3,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.red, shrinkText: true
    });
    s.addText("- ルール外の事態に対応不可\n- ルール作成コストが膨大\n- ルール間の矛盾が発生", {
      x: col2X + 0.15, y: 2.25, w: colW - 0.3, h: 0.85,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textBody, lineSpacingMultiple: 1.2, shrinkText: true
    });

    // Example
    s.addText("例: MYCIN（1970年代の医療診断支援、約600個のルールを手動構築）", {
      x: L.mx, y: 3.6, w: L.W - L.mx * 2, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans, italic: true,
      color: C.textLight, shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 6: WAVE 1 - CASE STUDIES
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "第1の波の代表事例");
    addFooter(s, 6, T);

    const cases = [
      { ic: ic.chess, label: "Deep Blue", desc: "1997年チェス世界王者に勝利\n1秒間に2億手を評価", color: C.accent, bg: C.accentLight },
      { ic: ic.chat, label: "チャットボット", desc: "Q&A登録型の社内対応\n決まった質問に即座に回答", color: C.green, bg: C.greenBg },
      { ic: ic.filter, label: "メールフィルタ", desc: "キーワードでスパム判定\n初期の迷惑メール対策", color: C.amber, bg: C.amberBg },
    ];

    const cardW = 2.5;
    const cardGap = 0.3;
    const totalW = cardW * 3 + cardGap * 2;
    const startX = (L.W - totalW) / 2;

    cases.forEach((c, i) => {
      const x = startX + i * (cardW + cardGap);
      const y = 0.9;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 2.8,
        fill: { color: c.bg }, line: { color: c.color, width: 1 }, rectRadius: 0.05
      });
      s.addImage({ data: c.ic, x: x + (cardW - 0.35) / 2, y: y + 0.2, w: 0.35, h: 0.35 });
      s.addText(c.label, {
        x, y: y + 0.65, w: cardW, h: 0.35,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: c.color, align: "center", shrinkText: true
      });
      s.addText(c.desc, {
        x: x + 0.15, y: y + 1.1, w: cardW - 0.3, h: 1.2,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, align: "center", lineSpacingMultiple: 1.3, shrinkText: true
      });
    });

    s.addText("共通点: 人間が全てのルールを事前に定義する必要がある", {
      x: L.mx, y: 4.0, w: L.W - L.mx * 2, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans, italic: true,
      color: C.textLight, shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 7: WAVE 2 - MACHINE LEARNING (mechanism)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "第2の波: 機械学習", "2010年代〜");
    addFooter(s, 7, T);

    // Flow diagram
    const flowItems = ["データ", "学習", "パターン発見", "予測・分類"];
    const boxW = 1.8;
    const boxGap = 0.3;
    const totalFW = boxW * 4 + boxGap * 3;
    const startFX = (L.W - totalFW) / 2;

    flowItems.forEach((item, i) => {
      const x = startFX + i * (boxW + boxGap);
      const y = 1.1;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: boxW, h: 0.45,
        fill: { color: C.greenBg }, line: { color: C.green, width: 1 }, rectRadius: 0.05
      });
      s.addText(item, {
        x, y, w: boxW, h: 0.45,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.green, align: "center", valign: "middle", shrinkText: true
      });
      if (i < 3) {
        s.addImage({
          data: ic.chevron,
          x: x + boxW + (boxGap - 0.15) / 2,
          y: y + 0.13, w: 0.15, h: 0.15
        });
      }
    });

    // Key concept
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 1.8, w: L.W - L.mx * 2, h: 0.45,
      fill: { color: C.accentLight }
    });
    s.addText("ディープラーニング = 脳の神経回路を模倣した多層の学習手法", {
      x: L.mx + 0.2, y: 1.8, w: L.W - L.mx * 2 - 0.4, h: 0.45,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", shrinkText: true
    });

    // Turning point
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 2.55, w: L.W - L.mx * 2, h: 1.2,
      fill: { color: C.offWhite }, line: { color: C.border, width: 0.5 }
    });
    s.addImage({ data: ic.bolt, x: L.mx + 0.2, y: 2.65, w: 0.25, h: 0.25 });
    s.addText("2012年: 転機", {
      x: L.mx + 0.55, y: 2.65, w: 3, h: 0.3,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.amber, shrinkText: true
    });
    s.addText("画像認識コンペImageNetで深層学習が圧勝\nエラー率26% → 16%（約10ポイント改善）\nGoogle / Facebook / Amazonが巨額投資を開始", {
      x: L.mx + 0.2, y: 3.05, w: L.W - L.mx * 2 - 0.4, h: 0.6,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textBody, lineSpacingMultiple: 1.2, shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 8: WAVE 2 - CASE STUDIES
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "第2の波の代表事例");
    addFooter(s, 8, T);

    const cases = [
      { ic: ic.userCheck, label: "スマホの顔認証", desc: "3万以上の点で顔を識別\n誤認率100万分の1以下", color: C.accent, bg: C.accentLight },
      { ic: ic.chart, label: "レコメンド", desc: "Amazon売上の35%が\nレコメンド経由", color: C.green, bg: C.greenBg },
      { ic: ic.mic, label: "音声認識", desc: "Siri・Alexa\n認識精度95%以上", color: C.amber, bg: C.amberBg },
    ];

    const cardW = 2.5;
    const cardGap = 0.3;
    const totalW = cardW * 3 + cardGap * 2;
    const startX = (L.W - totalW) / 2;

    cases.forEach((c, i) => {
      const x = startX + i * (cardW + cardGap);
      const y = 0.9;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 2.8,
        fill: { color: c.bg }, line: { color: c.color, width: 1 }, rectRadius: 0.05
      });
      s.addImage({ data: c.ic, x: x + (cardW - 0.35) / 2, y: y + 0.2, w: 0.35, h: 0.35 });
      s.addText(c.label, {
        x, y: y + 0.65, w: cardW, h: 0.35,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: c.color, align: "center", shrinkText: true
      });
      s.addText(c.desc, {
        x: x + 0.15, y: y + 1.1, w: cardW - 0.3, h: 1.2,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, align: "center", lineSpacingMultiple: 1.3, shrinkText: true
      });
    });

    s.addText("人間がルールを書かなくても、AIが自らパターンを発見する", {
      x: L.mx, y: 4.0, w: L.W - L.mx * 2, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans, italic: true,
      color: C.textLight, shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 9: WAVE 3 - GENERATIVE AI (mechanism)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "第3の波: 生成AI", "2020年代〜");
    addFooter(s, 9, T);

    // Key shift
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 1.1, w: L.W - L.mx * 2, h: 0.45,
      fill: { color: C.amberBg }
    });
    s.addText("分類・予測から「創造」へ -- 新しいコンテンツを生成する", {
      x: L.mx + 0.2, y: 1.1, w: L.W - L.mx * 2 - 0.4, h: 0.45,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.amber, valign: "middle", shrinkText: true
    });

    // What it can create - 4 items in row
    const items = [
      { ic: ic.file, label: "文章" },
      { ic: ic.image, label: "画像" },
      { ic: ic.code, label: "コード" },
      { ic: ic.video, label: "動画" },
    ];
    const iW = 1.8;
    const iGap = 0.3;
    const iTotalW = iW * 4 + iGap * 3;
    const iStartX = (L.W - iTotalW) / 2;

    items.forEach((item, i) => {
      const x = iStartX + i * (iW + iGap);
      const y = 1.8;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: iW, h: 0.9,
        fill: { color: C.offWhite }, line: { color: C.border, width: 0.5 }, rectRadius: 0.05
      });
      s.addImage({ data: item.ic, x: x + (iW - 0.25) / 2, y: y + 0.1, w: 0.25, h: 0.25 });
      s.addText(item.label, {
        x, y: y + 0.45, w: iW, h: 0.3,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.textDark, align: "center", shrinkText: true
      });
    });

    // LLM explanation
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.0, w: L.W - L.mx * 2, h: 0.95,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    s.addImage({ data: ic.brain, x: L.mx + 0.2, y: 3.1, w: 0.25, h: 0.25 });
    s.addText("大規模言語モデル（LLM）", {
      x: L.mx + 0.55, y: 3.05, w: 4, h: 0.3,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.accent, shrinkText: true
    });
    s.addText("膨大なテキストを学習した巨大AIモデル。GPT-4は推定約1兆パラメータ。\n自然な言葉で指示するだけで応答 -- プログラミング知識不要。", {
      x: L.mx + 0.2, y: 3.45, w: L.W - L.mx * 2 - 0.4, h: 0.45,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textBody, lineSpacingMultiple: 1.2, shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 10: WAVE 3 - CASE STUDIES
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "第3の波の代表事例");
    addFooter(s, 10, T);

    const cases = [
      { ic: ic.chat, label: "ChatGPT", desc: "2か月で1億ユーザー突破\n文章生成・翻訳・分析", color: C.accent, bg: C.accentLight },
      { ic: ic.image, label: "Midjourney", desc: "テキストから画像を生成\n制作時間を1/5に短縮", color: C.green, bg: C.greenBg },
      { ic: ic.code, label: "GitHub Copilot", desc: "コード自動補完\n開発速度55%向上", color: C.amber, bg: C.amberBg },
    ];

    const cardW = 2.5;
    const cardGap = 0.3;
    const totalW = cardW * 3 + cardGap * 2;
    const startX = (L.W - totalW) / 2;

    cases.forEach((c, i) => {
      const x = startX + i * (cardW + cardGap);
      const y = 0.9;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 2.8,
        fill: { color: c.bg }, line: { color: c.color, width: 1 }, rectRadius: 0.05
      });
      s.addImage({ data: c.ic, x: x + (cardW - 0.35) / 2, y: y + 0.2, w: 0.35, h: 0.35 });
      s.addText(c.label, {
        x, y: y + 0.65, w: cardW, h: 0.35,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: c.color, align: "center", shrinkText: true
      });
      s.addText(c.desc, {
        x: x + 0.15, y: y + 1.1, w: cardW - 0.3, h: 1.2,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, align: "center", lineSpacingMultiple: 1.3, shrinkText: true
      });
    });

    s.addText("Instagram 2.5年 / TikTok 9か月 → ChatGPTは史上最速で1億ユーザー到達", {
      x: L.mx, y: 4.0, w: L.W - L.mx * 2, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans, italic: true,
      color: C.textLight, shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 11: WHY NOW - 3 FACTORS
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "なぜ今、AIが爆発的に広がったのか");
    addFooter(s, 11, T);

    const factors = [
      { ic: ic.chip, label: "計算能力", desc: "GPU性能が10年で\n約1,000倍に向上", color: C.accent, bg: C.accentLight },
      { ic: ic.db, label: "データ量", desc: "全世界のデータが\n2年ごとに倍増", color: C.green, bg: C.greenBg },
      { ic: ic.bolt, label: "アルゴリズム", desc: "2017年Transformer\n技術が画期的な転機", color: C.amber, bg: C.amberBg },
    ];

    const cardW = 2.5;
    const cardGap = 0.3;
    const totalW = cardW * 3 + cardGap * 2;
    const startX = (L.W - totalW) / 2;

    factors.forEach((f, i) => {
      const x = startX + i * (cardW + cardGap);
      const y = 0.9;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 2.4,
        fill: { color: f.bg }, line: { color: f.color, width: 1 }, rectRadius: 0.05
      });
      s.addImage({ data: f.ic, x: x + (cardW - 0.35) / 2, y: y + 0.2, w: 0.35, h: 0.35 });
      s.addText(f.label, {
        x, y: y + 0.65, w: cardW, h: 0.35,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: f.color, align: "center", shrinkText: true
      });
      s.addText(f.desc, {
        x: x + 0.15, y: y + 1.1, w: cardW - 0.3, h: 0.9,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, align: "center", lineSpacingMultiple: 1.3, shrinkText: true
      });

      // Plus signs between
      if (i < 2) {
        s.addText("+", {
          x: x + cardW + (cardGap - 0.3) / 2, y: 1.7, w: 0.3, h: 0.3,
          fontSize: F.size.h2, fontFace: F.sans, bold: true,
          color: C.textMuted, align: "center", valign: "middle", shrinkText: true
        });
      }
    });

    // Conclusion
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.6, w: L.W - L.mx * 2, h: 0.55,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    s.addText("3つが同時に揃ったことで、AIが一気に実用レベルに到達", {
      x: L.mx + 0.2, y: 3.6, w: L.W - L.mx * 2 - 0.4, h: 0.55,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", align: "center", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 12: COMPARISON TABLE
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "3つの波を比較する");
    addFooter(s, 12, T);

    // Table
    const tableX = L.mx;
    const tableY = 0.85;
    const colWidths = [1.5, 2.3, 2.7, 2.0];
    const rowH = 0.5;
    const headers = ["", "第1の波", "第2の波", "第3の波"];
    const headerColors = [C.textDark, C.accent, C.green, C.amber];

    const rows = [
      ["年代", "1950年代〜", "2010年代〜", "2020年代〜"],
      ["仕組み", "ルールを書く", "パターンを学ぶ", "コンテンツを作る"],
      ["得意", "決まった応答", "予測・分類", "文章・画像生成"],
      ["代表例", "Deep Blue", "顔認証", "ChatGPT"],
      ["人の役割", "ルール作成", "データ用意", "指示を出す"],
    ];

    // Header row
    let cx = tableX;
    headers.forEach((h, i) => {
      s.addShape(pres.shapes.RECTANGLE, {
        x: cx, y: tableY, w: colWidths[i], h: rowH,
        fill: { color: i === 0 ? C.lightGray : C.navy }
      });
      s.addText(h, {
        x: cx, y: tableY, w: colWidths[i], h: rowH,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: i === 0 ? C.textDark : C.white,
        align: "center", valign: "middle", shrinkText: true
      });
      cx += colWidths[i];
    });

    // Data rows
    rows.forEach((row, ri) => {
      cx = tableX;
      const ry = tableY + (ri + 1) * rowH;
      const bgColor = ri % 2 === 0 ? C.offWhite : C.white;
      row.forEach((cell, ci) => {
        s.addShape(pres.shapes.RECTANGLE, {
          x: cx, y: ry, w: colWidths[ci], h: rowH,
          fill: { color: ci === 0 ? C.lightGray : bgColor },
          line: { color: C.border, width: 0.5 }
        });
        s.addText(cell, {
          x: cx, y: ry, w: colWidths[ci], h: rowH,
          fontSize: ci === 0 ? F.size.label : F.size.body,
          fontFace: F.sans, bold: ci === 0,
          color: ci === 0 ? C.textDark : C.textBody,
          align: "center", valign: "middle", shrinkText: true
        });
        cx += colWidths[ci];
      });
    });
  }

  // ============================================================
  // SLIDE 13: AI CHANGES OUR WORK
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "生成AIが変える私たちの仕事");
    addFooter(s, 13, T);

    const scenes = [
      { ic: ic.file, label: "文書作成", desc: "メール・報告書・翻訳\n作成速度40%向上", color: C.accent, bg: C.accentLight },
      { ic: ic.clipboard, label: "情報整理", desc: "議事録要約・データ分類\n半日の作業が数分に", color: C.green, bg: C.greenBg },
      { ic: ic.bulb, label: "アイデア出し", desc: "企画ブレスト・コピー案\nたたき台を瞬時に生成", color: C.amber, bg: C.amberBg },
      { ic: ic.search, label: "調査・分析", desc: "市場調査・競合分析\n大量情報を即座に整理", color: C.accent, bg: C.accentLight },
    ];

    const cardW = 3.9;
    const cardH = 1.3;
    const gapX = 0.4;
    const gapY = 0.25;

    scenes.forEach((sc, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = L.mx + col * (cardW + gapX);
      const y = 0.85 + row * (cardH + gapY);

      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: cardH,
        fill: { color: sc.bg }, rectRadius: 0.05
      });
      s.addImage({ data: sc.ic, x: x + 0.2, y: y + 0.2, w: 0.3, h: 0.3 });
      s.addText(sc.label, {
        x: x + 0.6, y: y + 0.15, w: cardW - 0.8, h: 0.3,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: sc.color, shrinkText: true
      });
      s.addText(sc.desc, {
        x: x + 0.6, y: y + 0.5, w: cardW - 0.8, h: 0.6,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, lineSpacingMultiple: 1.2, shrinkText: true
      });
    });

    // Bottom note
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.75, w: L.W - L.mx * 2, h: 0.5,
      fill: { color: C.lightGray }, rectRadius: 0.05
    });
    s.addText("基本スタンス: AIに下書き → 人間が確認して仕上げる", {
      x: L.mx + 0.2, y: 3.75, w: L.W - L.mx * 2 - 0.4, h: 0.5,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.textDark, valign: "middle", align: "center", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 14: 3 CAUTIONS
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "AIを使うときの3つの注意点");
    addFooter(s, 14, T);

    const cautions = [
      {
        ic: ic.lock, num: "1", label: "機密情報を入力しない",
        desc: "社外AIに顧客情報・社内機密はNG\n自社のAI利用ガイドラインを確認",
        color: C.red, bg: C.redBg
      },
      {
        ic: ic.eye, num: "2", label: "出力を鵜呑みにしない",
        desc: "ハルシネーション（AIの思い込み）に注意\n必ず人間がファクトチェック",
        color: C.amber, bg: C.amberBg
      },
      {
        ic: ic.copyright, num: "3", label: "著作権・倫理に配慮する",
        desc: "AI生成物の権利は法整備が進行中\n外部公開時は上長に確認",
        color: C.accent, bg: C.accentLight
      },
    ];

    cautions.forEach((c, i) => {
      const y = 0.85 + i * 1.1;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.9,
        fill: { color: c.bg }, rectRadius: 0.05
      });
      s.addText(c.num, {
        x: L.mx + 0.15, y: y + 0.15, w: 0.45, h: 0.45,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: c.color }, shape: pres.shapes.OVAL, shrinkText: true
      });
      s.addImage({ data: c.ic, x: L.mx + 0.7, y: y + 0.2, w: 0.3, h: 0.3 });
      s.addText(c.label, {
        x: L.mx + 1.1, y: y + 0.1, w: 3.5, h: 0.35,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: c.color, shrinkText: true
      });
      s.addText(c.desc, {
        x: L.mx + 1.1, y: y + 0.45, w: L.W - L.mx * 2 - 1.3, h: 0.4,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, lineSpacingMultiple: 1.2, shrinkText: true
      });
    });
  }

  // ============================================================
  // SLIDE 15: SUMMARY
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "まとめ");
    addFooter(s, 15, T);

    const points = [
      { ic: ic.brain, text: "AI = 人間の知的なふるまいをコンピュータで再現する技術", color: C.accent },
      { ic: ic.history, text: "3つの波: ルールベース → 機械学習 → 生成AI", color: C.green },
      { ic: ic.bolt, text: "爆発の理由: 計算能力 x データ量 x アルゴリズム", color: C.amber },
      { ic: ic.shield, text: "注意: 機密情報NG / 鵜呑みNG / 著作権に配慮", color: C.red },
    ];

    points.forEach((p, i) => {
      const y = 0.85 + i * 0.75;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.6,
        fill: { color: C.offWhite }, line: { color: C.border, width: 0.5 }, rectRadius: 0.05
      });
      s.addImage({ data: p.ic, x: L.mx + 0.2, y: y + 0.15, w: 0.3, h: 0.3 });
      s.addText(p.text, {
        x: L.mx + 0.65, y, w: L.W - L.mx * 2 - 0.85, h: 0.6,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: p.color, valign: "middle", shrinkText: true
      });
    });

    // Test info
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.95, w: L.W - L.mx * 2, h: 0.5,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    s.addImage({ data: ic.checkBlue, x: L.mx + 0.2, y: 4.05, w: 0.25, h: 0.25 });
    s.addText("確認テスト: 5問中4問正解(80%)で修了", {
      x: L.mx + 0.55, y: 3.95, w: L.W - L.mx * 2 - 0.75, h: 0.5,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 16: END (Navy background)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };
    s.addImage({ data: ic.check, x: (L.W - 0.6) / 2, y: 1.2, w: 0.6, h: 0.6 });
    s.addText("A-101 修了", {
      x: 0.5, y: 2.0, w: 9, h: 0.7,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center", shrinkText: true
    });
    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 2.85, w: 3, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });
    s.addText("AIの世界への第一歩、ここから始めよう", {
      x: 0.5, y: 3.05, w: 9, h: 0.45,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", shrinkText: true
    });
    s.addText("次のステップ: A-102 AIツール活用入門", {
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
