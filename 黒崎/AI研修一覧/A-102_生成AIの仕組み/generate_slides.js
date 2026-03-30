const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const {
  FaBrain, FaBullseye, FaChevronRight, FaBookOpen,
  FaCogs, FaGraduationCap, FaLightbulb, FaSearch,
  FaExclamationTriangle, FaCheckCircle, FaTimesCircle,
  FaDatabase, FaNetworkWired, FaRobot, FaPencilAlt,
  FaLanguage, FaCode, FaShieldAlt, FaClipboardCheck,
  FaUserFriends, FaChartBar, FaExchangeAlt, FaGlobe,
  FaLock, FaBalanceScale, FaCalculator, FaArrowRight
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
};

const F = { sans: "Calibri", size: { hero: 40, h1: 28, h2: 20, h3: 16, body: 14, label: 12, caption: 10 } };
const L = { W: 10, H: 5.625, mx: 0.75, my: 0.5, gap: 0.3 };

// Icon helper
async function icon(IconComponent, color, size = 256) {
  const svg = ReactDOMServer.renderToStaticMarkup(
    React.createElement(IconComponent, { color: `#${color}`, size: String(size) })
  );
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

// Layout primitives
function addTopBar(slide, pres) {
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: L.W, h: 0.035, fill: { color: C.accent } });
}

function addFooter(slide, pres, num, total) {
  slide.addShape(pres.shapes.LINE, {
    x: L.mx, y: L.H - 0.4, w: L.W - L.mx * 2, h: 0,
    line: { color: C.border, width: 0.5 }
  });
  slide.addText(`${num} / ${total}`, {
    x: L.W - 1.5, y: L.H - 0.38, w: 1.2, h: 0.3,
    fontSize: F.size.caption, fontFace: F.sans, color: C.textMuted, align: "right", shrinkText: true
  });
  slide.addText("A-102", {
    x: L.mx, y: L.H - 0.38, w: 2, h: 0.3,
    fontSize: F.size.caption, fontFace: F.sans, color: C.textMuted, align: "left", shrinkText: true
  });
}

function addSectionTitle(slide, pres, title, tag) {
  if (tag) {
    slide.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.15, w: tag.length * 0.1 + 0.4, h: 0.28,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    slide.addText(tag, {
      x: L.mx, y: 0.15, w: tag.length * 0.1 + 0.4, h: 0.28,
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
  pres.title = "A-102: 生成AIの仕組み〜なぜ文章が書けるのか";

  const ic = {
    brain: await icon(FaBrain, C.accent),
    target: await icon(FaBullseye, C.accent),
    cogs: await icon(FaCogs, C.accent),
    grad: await icon(FaGraduationCap, C.accent),
    bulb: await icon(FaLightbulb, C.amber),
    search: await icon(FaSearch, C.accent),
    warn: await icon(FaExclamationTriangle, C.amber),
    check: await icon(FaCheckCircle, C.green),
    times: await icon(FaTimesCircle, C.red),
    db: await icon(FaDatabase, C.accent),
    network: await icon(FaNetworkWired, C.accent),
    robot: await icon(FaRobot, C.accent),
    pencil: await icon(FaPencilAlt, C.accent),
    lang: await icon(FaLanguage, C.accent),
    code: await icon(FaCode, C.accent),
    shield: await icon(FaShieldAlt, C.green),
    clipboard: await icon(FaClipboardCheck, C.accent),
    book: await icon(FaBookOpen, C.accent),
    warnRed: await icon(FaExclamationTriangle, C.red),
    chevron: await icon(FaChevronRight, C.textMuted),
    users: await icon(FaUserFriends, C.accent),
    chart: await icon(FaChartBar, C.accent),
    exchange: await icon(FaExchangeAlt, C.accent),
    globe: await icon(FaGlobe, C.accent),
    lock: await icon(FaLock, C.red),
    balance: await icon(FaBalanceScale, C.amber),
    calc: await icon(FaCalculator, C.amber),
    arrow: await icon(FaArrowRight, C.accent),
  };

  const T = 16;

  // ============================================================
  // SLIDE 1: TITLE (Navy background)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };

    s.addImage({ data: ic.brain, x: (L.W - 0.6) / 2, y: 0.9, w: 0.6, h: 0.6 });

    s.addText("生成AIの仕組み", {
      x: 0.5, y: 1.7, w: 9, h: 0.8,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center", shrinkText: true
    });

    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 2.65, w: 3, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });

    s.addText("なぜ文章が書けるのか", {
      x: 0.5, y: 2.85, w: 9, h: 0.45,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", shrinkText: true
    });

    s.addText("A-102   |   全社員向け入門   |   20分", {
      x: 0.5, y: 4.2, w: 9, h: 0.3,
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
    addTopBar(s, pres);
    addSectionTitle(s, pres, "今日のゴール");
    addFooter(s, pres, 2, T);

    const goals = [
      "LLMの基本原理を平易に説明できる",
      "AIが学習データからパターンを学ぶ仕組みを理解する",
      "生成AIの「できること」と「仕組み上の限界」を区別できる",
    ];

    goals.forEach((g, i) => {
      const y = 1.1 + i * 1.1;
      s.addText(String(i + 1), {
        x: L.mx, y: y + 0.05, w: 0.5, h: 0.5,
        fontSize: F.size.h2, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: C.accent }, shape: pres.shapes.OVAL
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
  // SLIDE 3: WHAT IS GEN AI DOING?
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, pres, "生成AIは何をしている?", "CORE CONCEPT");
    addFooter(s, pres, 3, T);

    // Key message box
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 1.1, w: L.W - L.mx * 2, h: 0.5,
      fill: { color: C.accentLight }
    });
    s.addText("「次に来る言葉を予測する」を繰り返しているだけ", {
      x: L.mx + 0.2, y: 1.1, w: L.W - L.mx * 2 - 0.4, h: 0.5,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", shrinkText: true
    });

    // Prediction flow
    const words = [
      { text: "今日の天気は", bg: C.offWhite, color: C.textDark },
      { text: "->", bg: C.white, color: C.accent },
      { text: "晴れ", bg: C.accent, color: C.white },
      { text: "->", bg: C.white, color: C.accent },
      { text: "です", bg: C.accent, color: C.white },
      { text: "->", bg: C.white, color: C.accent },
      { text: "。", bg: C.accent, color: C.white },
    ];

    let xPos = L.mx + 0.2;
    words.forEach(w => {
      const ww = w.text === "->" ? 0.4 : w.text.length * 0.18 + 0.35;
      if (w.text !== "->") {
        s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
          x: xPos, y: 1.9, w: ww, h: 0.45,
          fill: { color: w.bg }, rectRadius: 0.05,
          line: w.bg === C.white ? undefined : { color: C.border, width: 0.5 }
        });
      }
      s.addText(w.text, {
        x: xPos, y: 1.9, w: ww, h: 0.45,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: w.color, align: "center", valign: "middle", shrinkText: true
      });
      xPos += ww + 0.1;
    });

    // Bottom insight
    s.addImage({ data: ic.bulb, x: L.mx, y: 2.7, w: 0.3, h: 0.3 });
    s.addText("スマホの予測変換の超高性能版", {
      x: L.mx + 0.4, y: 2.7, w: 5, h: 0.3,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.amber, valign: "middle", shrinkText: true
    });

    s.addText("「考えている」のではなく、統計的に最もありそうな言葉を選んでいる", {
      x: L.mx, y: 3.2, w: L.W - L.mx * 2, h: 0.35,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textBody, shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 4: WHAT IS LLM
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, pres, "LLM -- 大規模言語モデルの全体像", "KEY TERM");
    addFooter(s, pres, 4, T);

    const items = [
      { letter: "L = Large（大規模）", desc: "数兆語のテキストを学習", icon: ic.db },
      { letter: "L = Language（言語）", desc: "言葉のパターンを扱う", icon: ic.lang },
      { letter: "M = Model（モデル）", desc: "パターンを数式で表現", icon: ic.cogs },
    ];

    const cardW = 2.5;
    const cardGap = 0.25;
    const totalW = cardW * 3 + cardGap * 2;
    const startX = (L.W - totalW) / 2;

    items.forEach((item, i) => {
      const x = startX + i * (cardW + cardGap);
      const y = 1.1;
      const h = 2.0;

      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h,
        fill: { color: C.white }, line: { color: C.border, width: 0.75 }
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 0.05, fill: { color: C.accent }
      });
      s.addImage({ data: item.icon, x: x + (cardW - 0.3) / 2, y: y + 0.25, w: 0.3, h: 0.3 });
      s.addText(item.letter, {
        x: x + 0.1, y: y + 0.7, w: cardW - 0.2, h: 0.4,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.accent, align: "center", valign: "middle", shrinkText: true
      });
      s.addText(item.desc, {
        x: x + 0.1, y: y + 1.2, w: cardW - 0.2, h: 0.5,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textLight, align: "center", valign: "top", shrinkText: true
      });
    });

    // Bottom insight
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.4, w: L.W - L.mx * 2, h: 0.45,
      fill: { color: C.amberBg }
    });
    s.addText("「世界中の図書館の本を読んだ人」のようなもの。ただし「理解」ではなくパターン記憶。", {
      x: L.mx + 0.2, y: 3.4, w: L.W - L.mx * 2 - 0.4, h: 0.45,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.amber, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 5: LEARNING STEP 1 - DATA INGESTION
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, pres, "学習ステップ1: 大量のテキストを読み込む", "STEP 1");
    addFooter(s, pres, 5, T);

    // Stats row
    const stats = [
      { num: "数十兆+", label: "トークン（最新モデル推定）" },
      { num: "数百万冊", label: "書籍相当のテキスト量" },
      { num: "約90%", label: "英語データの比率" },
    ];

    stats.forEach((st, i) => {
      const x = L.mx + i * 2.9;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: 1.1, w: 2.6, h: 0.9,
        fill: { color: C.accentLight }, rectRadius: 0.05
      });
      s.addText(st.num, {
        x, y: 1.1, w: 2.6, h: 0.5,
        fontSize: F.size.h2, fontFace: F.sans, bold: true,
        color: C.accent, align: "center", valign: "bottom", shrinkText: true
      });
      s.addText(st.label, {
        x, y: 1.6, w: 2.6, h: 0.35,
        fontSize: F.size.caption, fontFace: F.sans,
        color: C.textLight, align: "center", valign: "top", shrinkText: true
      });
    });

    // Data sources
    const sources = ["Web / ニュース", "書籍 / 論文", "GitHub コード", "SNS / フォーラム"];
    sources.forEach((src, i) => {
      const x = L.mx + i * 2.15;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x, y: 2.3, w: 2.0, h: 0.4,
        fill: { color: C.offWhite }, line: { color: C.border, width: 0.5 }, rectRadius: 0.05
      });
      s.addText(src, {
        x, y: 2.3, w: 2.0, h: 0.4,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textDark, align: "center", valign: "middle", shrinkText: true
      });
    });

    // Warning
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.0, w: L.W - L.mx * 2, h: 0.45,
      fill: { color: C.amberBg }
    });
    s.addText("データの質がAIの質を決める。偏り・誤情報も一緒に学習してしまう。", {
      x: L.mx + 0.2, y: 3.0, w: L.W - L.mx * 2 - 0.4, h: 0.45,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.amber, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 6: LEARNING STEP 2 - MASKED PREDICTION
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, pres, "学習ステップ2: 穴埋め問題を解いて学ぶ", "STEP 2");
    addFooter(s, pres, 6, T);

    // Example
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 1.1, w: L.W - L.mx * 2, h: 0.5,
      fill: { color: C.offWhite }, line: { color: C.border, width: 0.5 }
    });
    s.addText("「今日は天気が ＿＿ ので公園に行った」 -> 「よい」を予測", {
      x: L.mx + 0.2, y: 1.1, w: L.W - L.mx * 2 - 0.4, h: 0.5,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.textDark, valign: "middle", shrinkText: true
    });

    // Process steps
    const steps = [
      { title: "最初はデタラメな回答", desc: "ランダムに近い予測からスタート" },
      { title: "正解と比較して修正", desc: "誤差を計算し、パラメータを微調整" },
      { title: "何兆回も繰り返す", desc: "だんだん正確な予測ができるように" },
    ];

    steps.forEach((step, i) => {
      const y = 1.85 + i * 0.55;
      s.addText(String(i + 1), {
        x: L.mx, y, w: 0.35, h: 0.35,
        fontSize: F.size.label, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: C.accent }, shape: pres.shapes.OVAL
      });
      s.addText(step.title, {
        x: L.mx + 0.5, y, w: 3.0, h: 0.35,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.textDark, valign: "middle", shrinkText: true
      });
      s.addText(step.desc, {
        x: 4.5, y, w: 5.0, h: 0.35,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textLight, valign: "middle", shrinkText: true
      });
    });

    // Parameter info
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.55, w: L.W - L.mx * 2, h: 0.45,
      fill: { color: C.accentLight }
    });
    s.addText("パラメータ（調整つまみ）: 最新モデルは数兆個規模。最適値を見つける作業が「学習」", {
      x: L.mx + 0.2, y: 3.55, w: L.W - L.mx * 2 - 0.4, h: 0.45,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.accent, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 7: LEARNING STEP 3 - RLHF
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, pres, "学習ステップ3: 人間のフィードバックで磨く", "STEP 3 / RLHF");
    addFooter(s, pres, 7, T);

    // RLHF flow: 3 cards
    const flow = [
      { title: "AIが複数回答を生成", desc: "同じ質問に対して\n複数パターンを出力", bg: C.accentLight, color: C.accent },
      { title: "人間が比較・評価", desc: "「こちらが正確で丁寧」\nと順位をつける", bg: C.greenBg, color: C.green },
      { title: "報酬で調整", desc: "良い回答パターンを\n強化する", bg: C.amberBg, color: C.amber },
    ];

    flow.forEach((f, i) => {
      const x = L.mx + i * 3.0;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: 1.1, w: 2.7, h: 1.5,
        fill: { color: f.bg }, rectRadius: 0.05
      });
      s.addText(f.title, {
        x: x + 0.1, y: 1.15, w: 2.5, h: 0.4,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: f.color, align: "center", valign: "middle", shrinkText: true
      });
      s.addText(f.desc, {
        x: x + 0.1, y: 1.65, w: 2.5, h: 0.8,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textBody, align: "center", valign: "top", shrinkText: true
      });
      if (i < 2) {
        s.addText("->", {
          x: x + 2.65, y: 1.55, w: 0.4, h: 0.4,
          fontSize: F.size.h2, fontFace: F.sans,
          color: C.textMuted, align: "center", valign: "middle"
        });
      }
    });

    // Result
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 2.9, w: L.W - L.mx * 2, h: 0.5,
      fill: { color: C.greenBg }
    });
    s.addText("結果: 「次の言葉を予測」だけでなく「人間に役立つ回答」を生成する方向に進化", {
      x: L.mx + 0.2, y: 2.9, w: L.W - L.mx * 2 - 0.4, h: 0.5,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.green, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 8: INFERENCE - PROBABILISTIC GENERATION
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, pres, "推論の仕組み -- 確率的に次の単語を選ぶ", "INFERENCE");
    addFooter(s, pres, 8, T);

    // Probability example
    s.addText("入力: 「日本の首都は」", {
      x: L.mx, y: 1.1, w: 4, h: 0.35,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.textDark, shrinkText: true
    });

    const probs = [
      { word: "東京", prob: "92%", w: 5.5, color: C.accent },
      { word: "京都", prob: "3%", w: 0.9, color: C.accentMid },
      { word: "大阪", prob: "2%", w: 0.6, color: C.lightGray },
    ];

    probs.forEach((p, i) => {
      const y = 1.65 + i * 0.45;
      s.addText(p.word, {
        x: L.mx, y, w: 1.2, h: 0.35,
        fontSize: F.size.label, fontFace: F.sans, bold: true,
        color: C.textDark, valign: "middle", shrinkText: true
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx + 1.3, y: y + 0.05, w: p.w, h: 0.25,
        fill: { color: p.color }, rectRadius: 0.03
      });
      s.addText(p.prob, {
        x: L.mx + 1.3 + p.w + 0.1, y, w: 0.8, h: 0.35,
        fontSize: F.size.label, fontFace: F.sans, bold: true,
        color: C.textBody, valign: "middle", shrinkText: true
      });
    });

    // Temperature explanation
    const temps = [
      { title: "Temperature 低い", desc: "確実な回答（事実確認向き）", color: C.accent, bg: C.accentLight },
      { title: "Temperature 高い", desc: "創造的な回答（ブレスト向き）", color: C.amber, bg: C.amberBg },
    ];

    temps.forEach((t, i) => {
      const x = L.mx + i * 4.3;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: 3.2, w: 4.0, h: 0.55,
        fill: { color: t.bg }, rectRadius: 0.05
      });
      s.addText(`${t.title}: ${t.desc}`, {
        x: x + 0.15, y: 3.2, w: 3.7, h: 0.55,
        fontSize: F.size.label, fontFace: F.sans, bold: true,
        color: t.color, valign: "middle", shrinkText: true
      });
    });
  }

  // ============================================================
  // SLIDE 9: TRANSFORMER ARCHITECTURE
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, pres, "Transformer -- なぜ高性能なのか", "ARCHITECTURE");
    addFooter(s, pres, 9, T);

    // Key concept
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 1.1, w: L.W - L.mx * 2, h: 0.45,
      fill: { color: C.accentLight }
    });
    s.addText("核心: アテンション（注意機構） -- 文中の単語間の関連度を計算", {
      x: L.mx + 0.2, y: 1.1, w: L.W - L.mx * 2 - 0.4, h: 0.45,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", shrinkText: true
    });

    // Two example cards
    const examples = [
      {
        title: "「銀行に行った。お金を下ろす。」",
        result: "銀行 + お金 -> 金融機関",
        color: C.accent, bg: C.accentLight
      },
      {
        title: "「銀行に行った。魚を釣る。」",
        result: "銀行 + 釣り -> 川の土手",
        color: C.amber, bg: C.amberBg
      },
    ];

    examples.forEach((ex, i) => {
      const x = L.mx + i * 4.3;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: 1.8, w: 4.0, h: 1.1,
        fill: { color: C.white }, line: { color: C.border, width: 0.75 }
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: 1.8, w: 4.0, h: 0.05, fill: { color: ex.color }
      });
      s.addText(ex.title, {
        x: x + 0.15, y: 1.9, w: 3.7, h: 0.4,
        fontSize: F.size.label, fontFace: F.sans, bold: true,
        color: C.textDark, valign: "middle", shrinkText: true
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x: x + 0.15, y: 2.4, w: 3.7, h: 0.35,
        fill: { color: ex.bg }
      });
      s.addText(ex.result, {
        x: x + 0.25, y: 2.4, w: 3.5, h: 0.35,
        fontSize: F.size.label, fontFace: F.sans, bold: true,
        color: ex.color, valign: "middle", shrinkText: true
      });
    });

    // Bottom info
    s.addText("2017年 Google「Attention Is All You Need」以降、全主要モデルが採用", {
      x: L.mx, y: 3.2, w: L.W - L.mx * 2, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans, italic: true,
      color: C.textLight, shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 10: WHAT AI CAN DO
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, pres, "生成AIが得意なこと", "STRENGTHS");
    addFooter(s, pres, 10, T);

    const strengths = [
      { title: "文章作成・要約・翻訳", desc: "メール下書き、報告書、多言語翻訳", icon: ic.pencil, color: "98D4BB" },
      { title: "アイデアの壁打ち", desc: "企画ブレスト、多角的な提案", icon: ic.bulb, color: "C7B8EA" },
      { title: "情報の整理・構造化", desc: "議事録整理、分類、表形式変換", icon: ic.clipboard, color: "A8D8EA" },
      { title: "コード生成・説明", desc: "プログラム作成、既存コード解説", icon: ic.code, color: "FFE6A7" },
    ];

    strengths.forEach((item, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = L.mx + col * 4.3;
      const y = 1.1 + row * 1.3;
      const cardW = 4.0;
      const cardH = 1.1;

      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: cardH,
        fill: { color: C.white }, line: { color: C.border, width: 0.75 }
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 0.05, fill: { color: item.color }
      });
      s.addImage({ data: item.icon, x: x + 0.15, y: y + 0.2, w: 0.25, h: 0.25 });
      s.addText(item.title, {
        x: x + 0.5, y: y + 0.15, w: cardW - 0.7, h: 0.35,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.textDark, valign: "middle", shrinkText: true
      });
      s.addText(item.desc, {
        x: x + 0.5, y: y + 0.55, w: cardW - 0.7, h: 0.35,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textLight, valign: "top", shrinkText: true
      });
    });

    // Bottom insight
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.7, w: L.W - L.mx * 2, h: 0.4,
      fill: { color: C.accentLight }
    });
    s.addText("共通点: 「既存パターンの組み合わせ」で対応できるタスク", {
      x: L.mx + 0.2, y: 3.7, w: L.W - L.mx * 2 - 0.4, h: 0.4,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 11: HALLUCINATION
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, pres, "生成AIの限界1: ハルシネーション", "LIMITATION");
    addFooter(s, pres, 11, T);

    // Definition
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 1.1, w: L.W - L.mx * 2, h: 0.45,
      fill: { color: C.redBg }
    });
    s.addText("事実でない情報をもっともらしく生成してしまう現象", {
      x: L.mx + 0.2, y: 1.1, w: L.W - L.mx * 2 - 0.4, h: 0.45,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.red, valign: "middle", shrinkText: true
    });

    // Why it happens
    s.addText("なぜ起きるのか?", {
      x: L.mx, y: 1.75, w: 4, h: 0.35,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.textDark, shrinkText: true
    });

    const reasons = [
      "AIは「事実かどうか」を確認する機能を持たない",
      "「次に来そうな言葉」を選んでいるだけ",
      "パターンに従って自然な文を作るが、事実性は無関係",
    ];

    reasons.forEach((r, i) => {
      s.addText("- " + r, {
        x: L.mx + 0.2, y: 2.15 + i * 0.35, w: L.W - L.mx * 2 - 0.4, h: 0.3,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textBody, valign: "middle", shrinkText: true
      });
    });

    // Real case
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.3, w: L.W - L.mx * 2, h: 0.5,
      fill: { color: C.amberBg }
    });
    s.addText("実例: 米国の弁護士がChatGPTで判例調査 -> 架空の判例を6件引用し裁判所で問題に", {
      x: L.mx + 0.2, y: 3.3, w: L.W - L.mx * 2 - 0.4, h: 0.5,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.amber, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 12: OTHER LIMITATIONS
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, pres, "生成AIの限界2: 最新情報・計算・倫理判断", "LIMITATIONS");
    addFooter(s, pres, 12, T);

    const limits = [
      {
        title: "最新情報を知らない",
        desc: "学習データの締め切り以降の出来事は未知",
        icon: ic.globe, color: C.amber, bg: C.amberBg
      },
      {
        title: "計算が苦手",
        desc: "電卓ではなく言葉の予測エンジン。桁数増で誤り増",
        icon: ic.calc, color: C.amber, bg: C.amberBg
      },
      {
        title: "倫理判断ができない",
        desc: "善悪の価値判断は本質的に不可能。パターンに過ぎない",
        icon: ic.balance, color: C.red, bg: C.redBg
      },
    ];

    limits.forEach((item, i) => {
      const y = 1.1 + i * 0.85;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.7,
        fill: { color: item.bg }
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: 0.05, h: 0.7, fill: { color: item.color }
      });
      s.addImage({ data: item.icon, x: L.mx + 0.2, y: y + 0.15, w: 0.3, h: 0.3 });
      s.addText(item.title, {
        x: L.mx + 0.65, y, w: 3.5, h: 0.35,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: item.color, valign: "bottom", shrinkText: true
      });
      s.addText(item.desc, {
        x: L.mx + 0.65, y: y + 0.35, w: 7.0, h: 0.3,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textBody, valign: "top", shrinkText: true
      });
    });

    s.addText("全て「次の言葉を予測する」仕組みから来る構造的な限界", {
      x: L.mx, y: 3.7, w: L.W - L.mx * 2, h: 0.3,
      fontSize: F.size.label, fontFace: F.sans, italic: true,
      color: C.textLight, shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 13: PRACTICAL APPLICATION
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, pres, "仕組みを知ると使い方が変わる", "PRACTICE");
    addFooter(s, pres, 13, T);

    // Before / After
    const comparisons = [
      { label: "Before", title: "AIを万能ツールとして使う", result: "ハルシネーションに振り回される", color: C.red, bg: C.redBg },
      { label: "After", title: "得意分野に絞って使う", result: "高い成果を安定的に出せる", color: C.green, bg: C.greenBg },
    ];

    comparisons.forEach((c, i) => {
      const x = L.mx + i * 4.3;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: 1.1, w: 4.0, h: 1.0,
        fill: { color: c.bg }, rectRadius: 0.05
      });
      s.addText(c.label, {
        x: x + 0.15, y: 1.15, w: 1.0, h: 0.3,
        fontSize: F.size.label, fontFace: F.sans, bold: true,
        color: c.color, shrinkText: true
      });
      s.addText(c.title, {
        x: x + 0.15, y: 1.4, w: 3.7, h: 0.3,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.textDark, valign: "middle", shrinkText: true
      });
      s.addText(c.result, {
        x: x + 0.15, y: 1.7, w: 3.7, h: 0.3,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textBody, valign: "middle", shrinkText: true
      });
    });

    // Tips
    const tips = [
      { title: "下書き利用", desc: "AIの出力は必ず人間が編集・確認", icon: ic.check },
      { title: "ファクトチェック", desc: "数字・日付・人名は一次情報で裏取り", icon: ic.search },
      { title: "壁打ち活用", desc: "アイデア発散・論点整理に最適", icon: ic.bulb },
    ];

    tips.forEach((tip, i) => {
      const x = L.mx + i * 2.9;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: 2.4, w: 2.6, h: 1.0,
        fill: { color: C.offWhite }, line: { color: C.border, width: 0.5 }, rectRadius: 0.05
      });
      s.addImage({ data: tip.icon, x: x + 1.05, y: 2.48, w: 0.25, h: 0.25 });
      s.addText(tip.title, {
        x: x + 0.1, y: 2.78, w: 2.4, h: 0.25,
        fontSize: F.size.label, fontFace: F.sans, bold: true,
        color: C.textDark, align: "center", valign: "middle", shrinkText: true
      });
      s.addText(tip.desc, {
        x: x + 0.1, y: 3.05, w: 2.4, h: 0.3,
        fontSize: F.size.caption, fontFace: F.sans,
        color: C.textLight, align: "center", valign: "top", shrinkText: true
      });
    });
  }

  // ============================================================
  // SLIDE 14: MODEL COMPARISON
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, pres, "主要モデルの比較", "COMPARISON");
    addFooter(s, pres, 14, T);

    // Table header
    const colX = [L.mx, L.mx + 1.8, L.mx + 4.2, L.mx + 7.0];
    const colW = [1.7, 2.3, 2.7, 1.8];
    const headers = ["モデル", "開発元", "特徴", "公開形態"];

    headers.forEach((h, i) => {
      s.addShape(pres.shapes.RECTANGLE, {
        x: colX[i], y: 1.1, w: colW[i], h: 0.4,
        fill: { color: C.navy }
      });
      s.addText(h, {
        x: colX[i] + 0.1, y: 1.1, w: colW[i] - 0.2, h: 0.4,
        fontSize: F.size.label, fontFace: F.sans, bold: true,
        color: C.white, valign: "middle", shrinkText: true
      });
    });

    // Table rows
    const models = [
      ["GPT-5.3 / o3-pro", "OpenAI", "汎用+推論特化の二本柱", "API / 有料"],
      ["Claude Opus 4.6", "Anthropic", "安全性重視、100万トークン対応", "API / 有料"],
      ["Gemini 3.1 Pro", "Google", "検索統合、最新情報対応", "API / 無料有"],
      ["Llama 4", "Meta", "オープンソース、自社運用可能", "無料公開"],
      ["DeepSeek V3/R1", "DeepSeek", "低コスト高推論、OSS", "無料公開"],
    ];

    models.forEach((row, ri) => {
      const y = 1.55 + ri * 0.5;
      const bgColor = ri % 2 === 0 ? C.offWhite : C.white;
      row.forEach((cell, ci) => {
        s.addShape(pres.shapes.RECTANGLE, {
          x: colX[ci], y, w: colW[ci], h: 0.45,
          fill: { color: bgColor }, line: { color: C.border, width: 0.5 }
        });
        s.addText(cell, {
          x: colX[ci] + 0.1, y, w: colW[ci] - 0.2, h: 0.45,
          fontSize: ci === 0 ? F.size.body : F.size.label, fontFace: F.sans,
          bold: ci === 0, color: ci === 0 ? C.accent : C.textBody,
          valign: "middle", shrinkText: true
        });
      });
    });

    // Bottom message
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.8, w: L.W - L.mx * 2, h: 0.4,
      fill: { color: C.accentLight }
    });
    s.addText("根本は同じTransformerベース。学習データとRLHFの方針で「味付け」が異なる", {
      x: L.mx + 0.2, y: 3.8, w: L.W - L.mx * 2 - 0.4, h: 0.4,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 15: SUMMARY
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, pres, "まとめ");
    addFooter(s, pres, 15, T);

    const summaryItems = [
      { text: "生成AIの正体は「次の単語を予測する」仕組み", icon: ic.brain },
      { text: "大量データからパターンを学習し、RLHFで磨かれる", icon: ic.db },
      { text: "得意分野で活用し、限界を理解して使いこなす", icon: ic.check },
    ];

    summaryItems.forEach((item, i) => {
      const y = 1.1 + i * 0.85;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.65,
        fill: { color: i === 2 ? C.greenBg : C.accentLight }, rectRadius: 0.05
      });
      s.addImage({ data: item.icon, x: L.mx + 0.15, y: y + 0.15, w: 0.3, h: 0.3 });
      s.addText(String(i + 1), {
        x: L.mx + 0.55, y: y + 0.1, w: 0.35, h: 0.35,
        fontSize: F.size.label, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: i === 2 ? C.green : C.accent }, shape: pres.shapes.OVAL
      });
      s.addText(item.text, {
        x: L.mx + 1.1, y, w: L.W - L.mx * 2 - 1.3, h: 0.65,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.textDark, valign: "middle", shrinkText: true
      });
    });

    // CTA
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 2.5, y: 3.8, w: 5.0, h: 0.5,
      fill: { color: C.accent }, rectRadius: 0.1
    });
    s.addText("確認テストに挑戦 -> 5問中4問正解で修了", {
      x: 2.5, y: 3.8, w: 5.0, h: 0.5,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.white, align: "center", valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 16: END (Navy background)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };

    s.addText("お疲れさまでした", {
      x: 0.5, y: 1.5, w: 9, h: 0.8,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center", shrinkText: true
    });

    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 2.5, w: 3, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });

    s.addText("確認テストに進みましょう", {
      x: 0.5, y: 2.8, w: 9, h: 0.5,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", shrinkText: true
    });

    s.addText("A-102   生成AIの仕組み", {
      x: 0.5, y: 4.2, w: 9, h: 0.3,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textMuted, align: "center", shrinkText: true
    });
  }

  // Save
  const outPath = __dirname + "/スライド.pptx";
  await pres.writeFile({ fileName: outPath });
  console.log("Done: PPTX saved to", outPath);
}

main().catch(err => { console.error(err); process.exit(1); });
