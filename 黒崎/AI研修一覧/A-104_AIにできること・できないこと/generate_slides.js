const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const {
  FaCheckCircle, FaTimesCircle, FaPen, FaClipboardList, FaGlobe,
  FaChartBar, FaCode, FaNewspaper, FaCalculator, FaHeart,
  FaBalanceScale, FaHandshake, FaBrain, FaLightbulb, FaRocket,
  FaBullseye, FaExclamationTriangle, FaArrowRight, FaShieldAlt, FaTrophy,
  FaGhost, FaClock, FaUsers, FaRobot, FaImage, FaMagic
} = require("react-icons/fa");

// =====================================================
// DESIGN SYSTEM
// =====================================================
const C = {
  white: "FFFFFF", offWhite: "FAFBFC", lightGray: "F3F4F6",
  navy: "1B2A4A", navyLight: "2D4A7A",
  accent: "2563EB", accentLight: "DBEAFE", accentMid: "93C5FD",
  textDark: "111827", textBody: "374151", textMuted: "9CA3AF", textLight: "6B7280",
  green: "059669", greenBg: "D1FAE5",
  amber: "D97706", amberBg: "FEF3C7",
  red: "DC2626", redBg: "FEE2E2",
  purple: "7C3AED", purpleBg: "EDE9FE",
  border: "E5E7EB",
};

const F = {
  sans: "Calibri",
  size: { hero: 40, h1: 28, h2: 20, h3: 16, body: 14, label: 12, caption: 10 }
};

const L = { W: 10, H: 5.625, mx: 0.75, my: 0.5, gap: 0.3 };

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
    fontSize: F.size.caption, fontFace: F.sans, color: C.textMuted, align: "right",
    shrinkText: true
  });
  slide.addText("A-104", {
    x: L.mx, y: L.H - 0.38, w: 2, h: 0.3,
    fontSize: F.size.caption, fontFace: F.sans, color: C.textMuted, align: "left",
    shrinkText: true
  });
}

function addSectionTitle(slide, title, pres, tag) {
  if (tag) {
    slide.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.15, w: tag.length * 0.11 + 0.4, h: 0.28,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    slide.addText(tag, {
      x: L.mx, y: 0.15, w: tag.length * 0.11 + 0.4, h: 0.28,
      fontSize: F.size.caption, fontFace: F.sans, bold: true,
      color: C.accent, align: "center", valign: "middle", shrinkText: true
    });
  }
  slide.addText(title, {
    x: L.mx, y: tag ? 0.5 : 0.15, w: 8.5, h: 0.5,
    fontSize: F.size.h1, fontFace: F.sans, bold: true,
    color: C.textDark, shrinkText: true
  });
}

async function main() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "Gorilla Knowledge";
  pres.title = "A-104: AIにできること・できないこと";

  const ic = {
    check: await icon(FaCheckCircle, C.green),
    times: await icon(FaTimesCircle, C.red),
    pen: await icon(FaPen, C.accent),
    clipboard: await icon(FaClipboardList, C.accent),
    globe: await icon(FaGlobe, C.accent),
    chart: await icon(FaChartBar, C.accent),
    code: await icon(FaCode, C.accent),
    news: await icon(FaNewspaper, C.red),
    calc: await icon(FaCalculator, C.amber),
    heart: await icon(FaHeart, C.purple),
    balance: await icon(FaBalanceScale, C.green),
    handshake: await icon(FaHandshake, C.accent),
    brain: await icon(FaBrain, C.accent),
    bulb: await icon(FaLightbulb, C.amber),
    rocket: await icon(FaRocket, C.accent),
    target: await icon(FaBullseye, C.accent),
    warn: await icon(FaExclamationTriangle, C.amber),
    arrow: await icon(FaArrowRight, C.accent),
    shield: await icon(FaShieldAlt, C.green),
    trophy: await icon(FaTrophy, C.amber),
    ghost: await icon(FaGhost, C.red),
    clock: await icon(FaClock, C.amber),
    users: await icon(FaUsers, C.purple),
    robot: await icon(FaRobot, C.accent),
    image: await icon(FaImage, C.accent),
    magic: await icon(FaMagic, C.accent),
  };

  const T = 16;

  // ============================================================
  // SLIDE 1: TITLE
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };
    s.addImage({ data: ic.brain, x: (L.W - 0.65) / 2, y: 0.9, w: 0.65, h: 0.65 });
    s.addText("AIにできること\n・できないこと", {
      x: 0.5, y: 1.7, w: 9, h: 1.0,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center", lineSpacingMultiple: 1.2, shrinkText: true
    });
    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 2.85, w: 3, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });
    s.addText("2026年最新版 — 得意と苦手を知って、正しく使いこなす", {
      x: 0.5, y: 3.05, w: 9, h: 0.45,
      fontSize: F.size.h3, fontFace: F.sans, color: C.accentMid, align: "center", shrinkText: true
    });
    s.addText("A-104   |   全社員向け入門   |   20分", {
      x: 0.5, y: 4.3, w: 9, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans, color: C.textMuted, align: "center", shrinkText: true
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
      "AIの得意領域（文章生成、要約、翻訳、分析、コード生成）を具体例で説明できる",
      "AIの苦手領域（ハルシネーション、最新情報、感情・倫理、計算）を理解する",
      "「AIに任せること」と「人が判断すること」の線引きができる",
    ];
    goals.forEach((g, i) => {
      const y = 1.1 + i * 1.1;
      s.addText(String(i + 1), {
        x: L.mx, y: y + 0.05, w: 0.5, h: 0.5,
        fontSize: F.size.h2, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: C.accent }, shape: pres.shapes.OVAL, shrinkText: true
      });
      s.addText(g, {
        x: L.mx + 0.7, y, w: 7.5, h: 0.6,
        fontSize: F.size.body, fontFace: F.sans, color: C.textDark, valign: "middle", shrinkText: true
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
  // SLIDE 3: AI得意 全体マップ
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "AIが得意な4つの領域", pres, "STRENGTHS");
    addFooter(s, 3, T, pres);

    const items = [
      { icon: ic.pen, label: "文章生成\n要約・翻訳", bg: C.accentLight },
      { icon: ic.chart, label: "データ分析\nパターン認識", bg: "D1FAE5" },
      { icon: ic.code, label: "コード生成\nプログラミング", bg: "EDE9FE" },
      { icon: ic.bulb, label: "アイデア出し\nブレスト", bg: "FEF3C7" },
    ];
    items.forEach((item, i) => {
      const x = L.mx + i * 2.2;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: 1.15, w: 2.0, h: 2.2, fill: { color: C.offWhite },
        line: { color: C.border, width: 0.5 }, rectRadius: 0.08
      });
      s.addImage({ data: item.icon, x: x + 0.7, y: 1.35, w: 0.5, h: 0.5 });
      s.addText(item.label, {
        x, y: 2.0, w: 2.0, h: 0.7,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.textDark, align: "center", lineSpacingMultiple: 1.3, shrinkText: true
      });
    });

    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.6, w: L.W - L.mx * 2, h: 0.5,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    s.addText("共通点: 大量のデータからパターンを見つけて再現する作業", {
      x: L.mx, y: 3.6, w: L.W - L.mx * 2, h: 0.5,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.accent, align: "center", valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 4: 得意1 文章生成・要約・翻訳
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "得意① 文章生成・要約・翻訳", pres, "DETAIL");
    addFooter(s, 4, T, pres);

    const examples = [
      "メール下書き → 数秒で完成",
      "議事録要約 → 1時間分を3行に",
      "ビジネス翻訳 → 文脈理解した自然な訳",
      "多言語化 → 日英中韓を一括生成",
    ];
    examples.forEach((ex, i) => {
      s.addText("  " + ex, {
        x: L.mx, y: 1.1 + i * 0.5, w: 4.5, h: 0.4,
        fontSize: F.size.body, fontFace: F.sans, color: C.textBody, shrinkText: true
      });
    });

    // Time comparison
    s.addShape(pres.shapes.RECTANGLE, {
      x: 5.8, y: 1.1, w: 3.5, h: 2.2, fill: { color: C.offWhite },
      line: { color: C.border, width: 0.5 }, rectRadius: 0.08
    });
    s.addText("時間比較", {
      x: 5.8, y: 1.15, w: 3.5, h: 0.3,
      fontSize: F.size.label, fontFace: F.sans, color: C.textMuted, align: "center", shrinkText: true
    });
    s.addText("30分", {
      x: 6.0, y: 1.55, w: 1.4, h: 0.5,
      fontSize: F.size.h1, fontFace: F.sans, bold: true, color: C.textMuted, align: "center", shrinkText: true
    });
    s.addText("人間だけ", {
      x: 6.0, y: 2.05, w: 1.4, h: 0.25,
      fontSize: F.size.caption, fontFace: F.sans, color: C.textMuted, align: "center", shrinkText: true
    });
    s.addText("→", {
      x: 7.2, y: 1.65, w: 0.5, h: 0.35,
      fontSize: F.size.h2, fontFace: F.sans, color: C.accent, align: "center", shrinkText: true
    });
    s.addText("5分", {
      x: 7.7, y: 1.55, w: 1.4, h: 0.5,
      fontSize: F.size.h1, fontFace: F.sans, bold: true, color: C.accent, align: "center", shrinkText: true
    });
    s.addText("AI + 確認", {
      x: 7.7, y: 2.05, w: 1.4, h: 0.25,
      fontSize: F.size.caption, fontFace: F.sans, color: C.textMuted, align: "center", shrinkText: true
    });

    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.6, w: L.W - L.mx * 2, h: 0.5,
      fill: { color: C.greenBg }, rectRadius: 0.05
    });
    s.addText("「ゼロから作る」時間を劇的に短縮", {
      x: L.mx, y: 3.6, w: L.W - L.mx * 2, h: 0.5,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.green, align: "center", valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 5: 得意2 データ分析・パターン認識
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "得意② データ分析・パターン認識", pres, "DETAIL");
    addFooter(s, 5, T, pres);

    const leftItems = [
      "売上データの季節トレンド発見",
      "アンケート自由記述を自動分類",
      "CSV/Excelの傾向を自然言語で解説",
    ];
    leftItems.forEach((item, i) => {
      s.addText("  " + item, {
        x: L.mx, y: 1.1 + i * 0.45, w: 4.5, h: 0.38,
        fontSize: F.size.body, fontFace: F.sans, color: C.textBody, shrinkText: true
      });
    });

    // 2026 multimodal box
    s.addShape(pres.shapes.RECTANGLE, {
      x: 5.8, y: 1.1, w: 3.5, h: 2.2, fill: { color: C.accentLight },
      line: { color: C.accent, width: 1 }, rectRadius: 0.08
    });
    s.addText("2026年の進化", {
      x: 5.8, y: 1.15, w: 3.5, h: 0.3,
      fontSize: F.size.label, fontFace: F.sans, bold: true, color: C.accent, align: "center", shrinkText: true
    });
    s.addText("マルチモーダル対応が標準\n\nテキスト + 画像 + 音声 + 動画\nを統合的に分析可能", {
      x: 6.0, y: 1.55, w: 3.1, h: 1.4,
      fontSize: F.size.label, fontFace: F.sans, color: C.textBody,
      align: "center", lineSpacingMultiple: 1.3, shrinkText: true
    });

    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.6, w: L.W - L.mx * 2, h: 0.5,
      fill: { color: C.greenBg }, rectRadius: 0.05
    });
    s.addText("データの形式を問わず、パターンを見つけ出すのがAIの真骨頂", {
      x: L.mx, y: 3.6, w: L.W - L.mx * 2, h: 0.5,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.green, align: "center", valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 6: 得意3 コード生成
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "得意③ コード生成・プログラミング支援", pres, "DETAIL");
    addFooter(s, 6, T, pres);

    const leftItems = [
      "Excelマクロの自動生成",
      "Webページ/アプリの作成",
      "データ整形スクリプト",
    ];
    leftItems.forEach((item, i) => {
      s.addText("  " + item, {
        x: L.mx, y: 1.1 + i * 0.45, w: 4.5, h: 0.38,
        fontSize: F.size.body, fontFace: F.sans, color: C.textBody, shrinkText: true
      });
    });

    // AI Agent box
    s.addShape(pres.shapes.RECTANGLE, {
      x: 5.8, y: 1.1, w: 3.5, h: 2.2, fill: { color: "EDE9FE" },
      line: { color: C.purple, width: 1 }, rectRadius: 0.08
    });
    s.addText("2026年: AIエージェント", {
      x: 5.8, y: 1.15, w: 3.5, h: 0.3,
      fontSize: F.size.label, fontFace: F.sans, bold: true, color: C.purple, align: "center", shrinkText: true
    });
    s.addText("Claude Code\nGitHub Copilot Agent\n\nコード生成だけでなく\nテスト・修正まで自律実行", {
      x: 6.0, y: 1.55, w: 3.1, h: 1.4,
      fontSize: F.size.label, fontFace: F.sans, color: C.textBody,
      align: "center", lineSpacingMultiple: 1.3, shrinkText: true
    });

    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.6, w: L.W - L.mx * 2, h: 0.5,
      fill: { color: "EDE9FE" }, rectRadius: 0.05
    });
    s.addText("プログラミングの民主化が本格的に進行中", {
      x: L.mx, y: 3.6, w: L.W - L.mx * 2, h: 0.5,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.purple, align: "center", valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 7: 得意4 アイデア出し
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "得意④ アイデア出し・ブレインストーミング", pres, "DETAIL");
    addFooter(s, 7, T, pres);

    const leftItems = [
      "企画アイデアを30個一気に生成",
      "異なる視点からの代替案を提示",
      "SWOT分析・ペルソナのたたき台",
      "24時間いつでも壁打ち相手に",
    ];
    leftItems.forEach((item, i) => {
      s.addText("  " + item, {
        x: L.mx, y: 1.1 + i * 0.45, w: 4.5, h: 0.38,
        fontSize: F.size.body, fontFace: F.sans, color: C.textBody, shrinkText: true
      });
    });

    // Role split
    s.addShape(pres.shapes.RECTANGLE, {
      x: 5.8, y: 1.1, w: 3.5, h: 2.2, fill: { color: C.amberBg },
      line: { color: C.amber, width: 1 }, rectRadius: 0.08
    });
    s.addText("役割分担", {
      x: 5.8, y: 1.15, w: 3.5, h: 0.3,
      fontSize: F.size.label, fontFace: F.sans, bold: true, color: C.amber, align: "center", shrinkText: true
    });
    s.addText("AI → 量（種まき）\n\n人間 → 質（選別・育成）\n\n30個から使えるものを\n人間が選ぶ", {
      x: 6.0, y: 1.5, w: 3.1, h: 1.5,
      fontSize: F.size.label, fontFace: F.sans, color: C.textBody,
      align: "center", lineSpacingMultiple: 1.2, shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 8: AI苦手 全体マップ
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "AIが苦手な4つの領域", pres, "WEAKNESSES");
    addFooter(s, 8, T, pres);

    const weaknesses = [
      { icon: ic.ghost, label: "ハルシネーション", desc: "もっともらしい嘘", color: C.red },
      { icon: ic.clock, label: "最新情報", desc: "リアルタイムに弱い", color: C.amber },
      { icon: ic.heart, label: "感情・倫理", desc: "善悪の判断は不可", color: C.purple },
      { icon: ic.calc, label: "正確な計算", desc: "厳密性に欠ける", color: C.amber },
    ];
    weaknesses.forEach((item, i) => {
      const x = L.mx + i * 2.2;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: 1.15, w: 2.0, h: 2.2, fill: { color: C.offWhite },
        line: { color: C.border, width: 0.5 }, rectRadius: 0.08
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: 1.15, w: 2.0, h: 0.04, fill: { color: item.color }
      });
      s.addImage({ data: item.icon, x: x + 0.7, y: 1.4, w: 0.5, h: 0.5 });
      s.addText(item.label, {
        x, y: 2.0, w: 2.0, h: 0.35,
        fontSize: F.size.body, fontFace: F.sans, bold: true, color: C.textDark, align: "center", shrinkText: true
      });
      s.addText(item.desc, {
        x: x + 0.1, y: 2.4, w: 1.8, h: 0.5,
        fontSize: F.size.caption, fontFace: F.sans, color: C.textLight, align: "center", shrinkText: true
      });
    });

    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.6, w: L.W - L.mx * 2, h: 0.5,
      fill: { color: C.redBg }, rectRadius: 0.05
    });
    s.addText("これらをAIに任せると重大なミスにつながる可能性", {
      x: L.mx, y: 3.6, w: L.W - L.mx * 2, h: 0.5,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.red, align: "center", valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 9: 苦手1 ハルシネーション
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "苦手① ハルシネーション", pres, "DETAIL");
    addFooter(s, 9, T, pres);

    const badExamples = [
      "実在しない論文・著者名を生成",
      "存在しない法律の条文を引用",
      "架空の統計データを提示",
    ];
    badExamples.forEach((ex, i) => {
      s.addText("  " + ex, {
        x: L.mx, y: 1.1 + i * 0.45, w: 4.5, h: 0.38,
        fontSize: F.size.body, fontFace: F.sans, color: C.red, shrinkText: true
      });
    });

    // Hallucination box
    s.addShape(pres.shapes.RECTANGLE, {
      x: 5.8, y: 1.1, w: 3.5, h: 2.2, fill: { color: C.redBg },
      rectRadius: 0.08
    });
    s.addText("もっともらしい嘘", {
      x: 5.8, y: 1.2, w: 3.5, h: 0.3,
      fontSize: F.size.h3, fontFace: F.sans, bold: true, color: C.red, align: "center", shrinkText: true
    });
    s.addText("「わかりません」と言えず\n自信たっぷりに間違いを生成\n\n9割正しくても\n残り1割が致命的に", {
      x: 6.0, y: 1.6, w: 3.1, h: 1.4,
      fontSize: F.size.label, fontFace: F.sans, color: C.textBody, align: "center",
      lineSpacingMultiple: 1.3, shrinkText: true
    });

    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.6, w: L.W - L.mx * 2, h: 0.5,
      fill: { color: C.greenBg }, rectRadius: 0.05
    });
    s.addText("対策: 固有名詞・数値・引用は必ず一次ソースで裏取り", {
      x: L.mx, y: 3.6, w: L.W - L.mx * 2, h: 0.5,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.green, align: "center", valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 10: 苦手2 最新情報
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "苦手② 最新情報・リアルタイムデータ", pres, "DETAIL");
    addFooter(s, 10, T, pres);

    const badExamples = [
      "「今日の株価は?」→ でっちあげる",
      "「最新の法改正は?」→ 古い情報",
      "「昨日のニュースは?」→ 事実と異なる",
    ];
    badExamples.forEach((ex, i) => {
      s.addText("  " + ex, {
        x: L.mx, y: 1.1 + i * 0.45, w: 4.5, h: 0.38,
        fontSize: F.size.body, fontFace: F.sans, color: C.amber, shrinkText: true
      });
    });

    s.addShape(pres.shapes.RECTANGLE, {
      x: 5.8, y: 1.1, w: 3.5, h: 2.2, fill: { color: C.amberBg },
      rectRadius: 0.08
    });
    s.addText("Web検索付きでも注意", {
      x: 5.8, y: 1.2, w: 3.5, h: 0.3,
      fontSize: F.size.h3, fontFace: F.sans, bold: true, color: C.amber, align: "center", shrinkText: true
    });
    s.addText("検索結果の要約にも\nハルシネーションが混ざる\n\n検索結果自体が\n古い場合もある", {
      x: 6.0, y: 1.6, w: 3.1, h: 1.4,
      fontSize: F.size.label, fontFace: F.sans, color: C.textBody, align: "center",
      lineSpacingMultiple: 1.3, shrinkText: true
    });

    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.6, w: L.W - L.mx * 2, h: 0.5,
      fill: { color: C.greenBg }, rectRadius: 0.05
    });
    s.addText("対策: 最新情報は必ず公式サイト・一次ソースで確認", {
      x: L.mx, y: 3.6, w: L.W - L.mx * 2, h: 0.5,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.green, align: "center", valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 11: 苦手3 感情・倫理
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "苦手③ 感情理解・倫理判断", pres, "DETAIL");
    addFooter(s, 11, T, pres);

    // Left: emotions
    s.addText("感情理解", {
      x: L.mx, y: 1.1, w: 4, h: 0.3,
      fontSize: F.size.h3, fontFace: F.sans, bold: true, color: C.purple, shrinkText: true
    });
    s.addText("文字パターンを認識するだけ\n本当の気持ちはわからない", {
      x: L.mx, y: 1.45, w: 4, h: 0.5,
      fontSize: F.size.body, fontFace: F.sans, color: C.textLight, lineSpacingMultiple: 1.3, shrinkText: true
    });
    s.addText("例: クレーム対応の謝罪文は書けるが\nお客様の怒りの本質は理解できない", {
      x: L.mx, y: 2.05, w: 4, h: 0.5,
      fontSize: F.size.caption, fontFace: F.sans, color: C.textBody, lineSpacingMultiple: 1.4, shrinkText: true
    });

    // Right: ethics
    s.addText("倫理判断", {
      x: 5.5, y: 1.1, w: 4, h: 0.3,
      fontSize: F.size.h3, fontFace: F.sans, bold: true, color: C.green, shrinkText: true
    });
    s.addText("善悪の基準がない\n組織の価値観を理解できない", {
      x: 5.5, y: 1.45, w: 4, h: 0.5,
      fontSize: F.size.body, fontFace: F.sans, color: C.textLight, lineSpacingMultiple: 1.3, shrinkText: true
    });
    s.addText("例: 人事評価、懲戒処分\n顧客トラブルの対応方針", {
      x: 5.5, y: 2.05, w: 4, h: 0.5,
      fontSize: F.size.caption, fontFace: F.sans, color: C.textBody, lineSpacingMultiple: 1.4, shrinkText: true
    });

    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.6, w: L.W - L.mx * 2, h: 0.5,
      fill: { color: C.purpleBg }, rectRadius: 0.05
    });
    s.addText("感情と倫理が絡む判断は、必ず人間が行う", {
      x: L.mx, y: 3.6, w: L.W - L.mx * 2, h: 0.5,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.purple, align: "center", valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 12: 苦手4 計算・論理
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "苦手④ 正確な計算・論理の厳密性", pres, "DETAIL");
    addFooter(s, 12, T, pres);

    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 1.1, w: 4.2, h: 0.8, fill: { color: C.amberBg }, rectRadius: 0.06
    });
    s.addText("なぜ苦手?", {
      x: L.mx + 0.15, y: 1.12, w: 3.9, h: 0.25,
      fontSize: F.size.label, fontFace: F.sans, bold: true, color: C.amber, shrinkText: true
    });
    s.addText("数式を計算しているのではなく\n「それっぽい答え」をパターンから予測", {
      x: L.mx + 0.15, y: 1.4, w: 3.9, h: 0.45,
      fontSize: F.size.caption, fontFace: F.sans, color: C.textBody, lineSpacingMultiple: 1.3, shrinkText: true
    });

    const calcExamples = [
      "桁数の多い計算 → 微妙に間違える",
      "見積書の合計 → 端数が合わない",
      "複雑な論理推論 → 条件が増えるとミス",
    ];
    calcExamples.forEach((ex, i) => {
      s.addText("  " + ex, {
        x: L.mx, y: 2.1 + i * 0.4, w: 4.5, h: 0.35,
        fontSize: F.size.body, fontFace: F.sans, color: C.amber, shrinkText: true
      });
    });

    // Right: correct usage
    s.addShape(pres.shapes.RECTANGLE, {
      x: 5.8, y: 1.1, w: 3.5, h: 2.2, fill: { color: C.greenBg }, rectRadius: 0.08
    });
    s.addText("正しい役割分担", {
      x: 5.8, y: 1.2, w: 3.5, h: 0.3,
      fontSize: F.size.h3, fontFace: F.sans, bold: true, color: C.green, align: "center", shrinkText: true
    });
    s.addText("AI\n何を計算すべきか整理\n数式の作成支援", {
      x: 6.0, y: 1.6, w: 1.5, h: 1.0,
      fontSize: F.size.caption, fontFace: F.sans, color: C.textBody, align: "center",
      lineSpacingMultiple: 1.4, shrinkText: true
    });
    s.addText("Excel/電卓\n実際の計算実行\n数値の検証", {
      x: 7.6, y: 1.6, w: 1.5, h: 1.0,
      fontSize: F.size.caption, fontFace: F.sans, color: C.textBody, align: "center",
      lineSpacingMultiple: 1.4, shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 13: 2026年の進化
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "2026年の進化 — 改善された領域と残る課題", pres, "UPDATE");
    addFooter(s, 13, T, pres);

    // Left: improved
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 1.1, w: 4.0, h: 2.5, fill: { color: C.greenBg },
      line: { color: C.green, width: 0.5 }, rectRadius: 0.08
    });
    s.addText("改善された領域", {
      x: L.mx, y: 1.15, w: 4.0, h: 0.35,
      fontSize: F.size.h3, fontFace: F.sans, bold: true, color: C.green, align: "center", shrinkText: true
    });
    const improved = [
      "推論特化(o3系) → 数学精度向上",
      "マルチモーダル → 画像+音声+動画",
      "AIエージェント → 自律タスク実行",
    ];
    improved.forEach((item, i) => {
      s.addText("  " + item, {
        x: L.mx + 0.2, y: 1.6 + i * 0.45, w: 3.6, h: 0.38,
        fontSize: F.size.body, fontFace: F.sans, color: C.textBody, shrinkText: true
      });
    });

    // Right: still weak
    s.addShape(pres.shapes.RECTANGLE, {
      x: 5.5, y: 1.1, w: 4.0, h: 2.5, fill: { color: C.redBg },
      line: { color: C.red, width: 0.5 }, rectRadius: 0.08
    });
    s.addText("依然として苦手", {
      x: 5.5, y: 1.15, w: 4.0, h: 0.35,
      fontSize: F.size.h3, fontFace: F.sans, bold: true, color: C.red, align: "center", shrinkText: true
    });
    const stillWeak = [
      "ハルシネーション → むしろ巧妙化",
      "最新情報 → 本質的限界",
      "倫理判断 → 善悪の基準は持てない",
    ];
    stillWeak.forEach((item, i) => {
      s.addText("  " + item, {
        x: 5.7, y: 1.6 + i * 0.45, w: 3.6, h: 0.38,
        fontSize: F.size.body, fontFace: F.sans, color: C.textBody, shrinkText: true
      });
    });

    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.85, w: L.W - L.mx * 2, h: 0.5,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    s.addText("進化を正しく評価しつつ、過信しないことが大切", {
      x: L.mx, y: 3.85, w: L.W - L.mx * 2, h: 0.5,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.accent, align: "center", valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 14: 役割分担フレームワーク
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "AIと人間の役割分担フレームワーク", pres, "FRAMEWORK");
    addFooter(s, 14, T, pres);

    // 3 columns
    const cols = [
      { title: "AI任せOK", items: "下書き・要約\n翻訳・データ整理\nアイデア出し", color: C.green, bg: C.greenBg },
      { title: "AI+人間チェック", items: "分析結果\nコード生成\nリサーチまとめ", color: C.amber, bg: C.amberBg },
      { title: "人間が判断", items: "最終意思決定\n倫理・法的判断\n感情対応・機密", color: C.red, bg: C.redBg },
    ];
    cols.forEach((col, i) => {
      const x = L.mx + i * 3.0;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: 1.1, w: 2.7, h: 2.3, fill: { color: col.bg },
        line: { color: col.color, width: 0.5 }, rectRadius: 0.08
      });
      s.addText(col.title, {
        x, y: 1.15, w: 2.7, h: 0.35,
        fontSize: F.size.h3, fontFace: F.sans, bold: true, color: col.color, align: "center", shrinkText: true
      });
      s.addText(col.items, {
        x: x + 0.15, y: 1.6, w: 2.4, h: 1.5,
        fontSize: F.size.body, fontFace: F.sans, color: C.textBody,
        align: "center", lineSpacingMultiple: 1.5, shrinkText: true
      });
    });

    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.65, w: L.W - L.mx * 2, h: 0.5,
      fill: { color: C.white }, line: { color: C.accent, width: 2 }, rectRadius: 0.06
    });
    s.addText("「AIは優秀なアシスタント。最終判断は人間の仕事。」", {
      x: L.mx, y: 3.65, w: L.W - L.mx * 2, h: 0.5,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.accent, align: "center", valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 15: SUMMARY
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };

    s.addText("今日のまとめ", {
      x: 0.5, y: 0.15, w: 9, h: 0.5,
      fontSize: F.size.h1, fontFace: F.sans, bold: true,
      color: C.white, align: "center", shrinkText: true
    });

    const cols = [
      { title: "AIの得意", items: "文章生成・要約・翻訳\nデータ分析\nコード生成\nアイデア出し", color: C.green },
      { title: "AIの苦手", items: "ハルシネーション\n最新情報\n感情・倫理判断\n正確な計算", color: C.red },
      { title: "線引き", items: "AI任せ / チェック付き\n/ 人間判断の3段階\nファクトチェック必須\n最終判断は人間", color: C.accent },
    ];
    cols.forEach((col, i) => {
      const x = L.mx + i * 3.0;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: 0.85, w: 2.7, h: 2.8, fill: { color: C.white }, rectRadius: 0.08
      });
      s.addText(col.title, {
        x, y: 0.95, w: 2.7, h: 0.35,
        fontSize: F.size.h3, fontFace: F.sans, bold: true, color: col.color, align: "center", shrinkText: true
      });
      s.addText(col.items, {
        x: x + 0.15, y: 1.4, w: 2.4, h: 1.8,
        fontSize: F.size.body, fontFace: F.sans, color: C.textBody,
        align: "center", lineSpacingMultiple: 1.5, shrinkText: true
      });
    });

    s.addShape(pres.shapes.RECTANGLE, {
      x: 2.5, y: 4.0, w: 5, h: 0.6,
      fill: { color: C.navyLight }, rectRadius: 0.06
    });
    s.addText("確認テスト（5問） → 80%以上で修了", {
      x: 2.5, y: 4.0, w: 5, h: 0.6,
      fontSize: F.size.h3, fontFace: F.sans,
      color: C.white, align: "center", valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 16: END
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };
    s.addImage({ data: ic.trophy, x: (L.W - 0.6) / 2, y: 1.0, w: 0.6, h: 0.6 });
    s.addText("ご視聴ありがとうございました", {
      x: 0.5, y: 1.8, w: 9, h: 0.7,
      fontSize: F.size.h1 + 4, fontFace: F.sans, bold: true,
      color: C.white, align: "center", shrinkText: true
    });
    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 2.65, w: 3, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });
    s.addText("A-104 AIにできること・できないこと", {
      x: 0.5, y: 2.85, w: 9, h: 0.4,
      fontSize: F.size.h3, fontFace: F.sans, color: C.accentMid, align: "center", shrinkText: true
    });
    s.addText("次のステップ: 確認テスト → A-105 プロンプトの基本", {
      x: 0.5, y: 3.7, w: 9, h: 0.4,
      fontSize: F.size.body, fontFace: F.sans, color: C.textMuted, align: "center", shrinkText: true
    });
  }

  // ============================================================
  // SAVE
  // ============================================================
  const outPath = __dirname + "/スライド.pptx";
  await pres.writeFile({ fileName: outPath });
  console.log("✅ PPTX generated:", outPath);
}

main().catch(err => { console.error(err); process.exit(1); });
