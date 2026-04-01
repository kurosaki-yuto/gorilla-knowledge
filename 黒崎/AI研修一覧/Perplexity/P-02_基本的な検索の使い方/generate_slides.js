const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const {
  FaSearch, FaCheckCircle, FaArrowRight, FaComments, FaLightbulb,
  FaShieldAlt, FaKeyboard, FaQuestionCircle, FaMousePointer, FaEye,
  FaListOl, FaLink, FaGlobe, FaBullseye, FaRocket, FaBookOpen,
  FaGraduationCap, FaReddit, FaExchangeAlt, FaChevronRight,
  FaThumbsUp, FaExclamationTriangle, FaClipboardCheck
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
  slide.addText(`P-02`, {
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
  pres.title = "P-02: 基本的な検索の使い方 -- Perplexityで検索を始める";

  // Pre-render icons
  const ic = {
    search:    await icon(FaSearch,              C.accent),
    check:     await icon(FaCheckCircle,         C.green),
    checkBlue: await icon(FaCheckCircle,         C.accent),
    arrow:     await icon(FaArrowRight,          C.accent),
    comments:  await icon(FaComments,            C.accent),
    bulb:      await icon(FaLightbulb,           C.amber),
    shield:    await icon(FaShieldAlt,           C.green),
    keyboard:  await icon(FaKeyboard,            C.accent),
    question:  await icon(FaQuestionCircle,      C.purple),
    mouse:     await icon(FaMousePointer,        C.accent),
    eye:       await icon(FaEye,                 C.accent),
    listOl:    await icon(FaListOl,              C.accent),
    link:      await icon(FaLink,                C.green),
    globe:     await icon(FaGlobe,               C.accent),
    target:    await icon(FaBullseye,            C.accent),
    rocket:    await icon(FaRocket,              C.accent),
    book:      await icon(FaBookOpen,            C.accent),
    grad:      await icon(FaGraduationCap,       C.green),
    reddit:    await icon(FaReddit,              C.amber),
    exchange:  await icon(FaExchangeAlt,         C.accent),
    chevron:   await icon(FaChevronRight,        C.accent),
    thumbsUp:  await icon(FaThumbsUp,            C.green),
    warning:   await icon(FaExclamationTriangle, C.amber),
    clipboard: await icon(FaClipboardCheck,      C.accent),
  };

  // ============================================================
  // SLIDE 1: TITLE (Navy background)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };
    s.addImage({ data: ic.search, x: (L.W - 0.65) / 2, y: 0.85, w: 0.65, h: 0.65 });
    s.addText("基本的な検索の使い方", {
      x: 0.5, y: 1.65, w: 9, h: 0.85,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center", shrinkText: true
    });
    s.addShape(pres.shapes.LINE, {
      x: 3.2, y: 2.65, w: 3.6, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });
    s.addText("Perplexityで検索を始める", {
      x: 0.5, y: 2.8, w: 9, h: 0.45,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", shrinkText: true
    });
    s.addText("P-02  |  全社員  |  10分", {
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
      { icon: ic.keyboard, text: "Perplexityの基本操作をマスターする" },
      { icon: ic.eye,      text: "検索結果の読み方を理解する" },
      { icon: ic.comments, text: "フォローアップ質問で深掘りできるようになる" },
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
  // SLIDE 3: BASIC OPERATIONS
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "Perplexityの基本操作", "BASIC");
    addFooter(s, 3, T);

    const steps = [
      { ic: ic.globe,    num: "1", label: "サイトにアクセス",   desc: "perplexity.ai を開く" },
      { ic: ic.keyboard, num: "2", label: "質問を入力",         desc: "検索ボックスにキーワードや質問を入力" },
      { ic: ic.mouse,    num: "3", label: "検索を実行",         desc: "Enterキーまたは送信ボタンをクリック" },
      { ic: ic.eye,      num: "4", label: "結果を確認",         desc: "AIが生成した回答と情報源を確認" },
    ];

    steps.forEach((st, i) => {
      const y = 1.05 + i * 0.85;
      // Card background
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.72,
        fill: { color: i % 2 === 0 ? C.offWhite : C.white },
        line: { color: C.border, width: 0.5 }, rectRadius: 0.05
      });
      // Step number badge
      s.addText(st.num, {
        x: L.mx + 0.15, y: y + 0.13, w: 0.45, h: 0.45,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: C.accent }, shape: pres.shapes.OVAL, shrinkText: true
      });
      // Icon
      s.addImage({ data: st.ic, x: L.mx + 0.75, y: y + 0.18, w: 0.32, h: 0.32 });
      // Label
      s.addText(st.label, {
        x: L.mx + 1.2, y: y + 0.05, w: 2.5, h: 0.35,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, valign: "middle", shrinkText: true
      });
      // Description
      s.addText(st.desc, {
        x: L.mx + 1.2, y: y + 0.35, w: 6.5, h: 0.3,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textLight, valign: "middle", shrinkText: true
      });
      // Arrow between steps
      if (i < steps.length - 1) {
        s.addImage({ data: ic.chevron, x: L.mx + 0.27, y: y + 0.65, w: 0.2, h: 0.2 });
      }
    });
  }

  // ============================================================
  // SLIDE 4: READING RESULTS
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "検索結果の見方", "RESULTS");
    addFooter(s, 4, T);

    const items = [
      { ic: ic.checkBlue, label: "回答",     desc: "AIが複数の情報源を統合して\n生成した総合的な回答", bgColor: C.accentLight, labelColor: C.accent },
      { ic: ic.link,      label: "情報源",   desc: "回答の根拠となった\nウェブサイトや文献の一覧",    bgColor: C.greenBg,     labelColor: C.green },
      { ic: ic.question,  label: "関連質問", desc: "さらに深掘りするための\n提案された質問リスト",      bgColor: C.purpleBg,    labelColor: C.purple },
    ];

    const cardW = 2.5;
    const cardGap = 0.26;
    const totalW = cardW * 3 + cardGap * 2;
    const startX = (L.W - totalW) / 2;

    items.forEach((e, i) => {
      const x = startX + i * (cardW + cardGap);
      const y = 1.05;
      // Card
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 2.4,
        fill: { color: C.offWhite }, line: { color: C.border, width: 0.5 }, rectRadius: 0.05
      });
      // Colored header strip
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 0.55,
        fill: { color: e.bgColor }, rectRadius: 0.05
      });
      // Icon
      s.addImage({ data: e.ic, x: x + (cardW - 0.32) / 2, y: y + 0.1, w: 0.32, h: 0.32 });
      // Label
      s.addText(e.label, {
        x, y: y + 0.65, w: cardW, h: 0.35,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: e.labelColor, align: "center", shrinkText: true
      });
      // Description
      s.addText(e.desc, {
        x: x + 0.15, y: y + 1.1, w: cardW - 0.3, h: 1.0,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, align: "center", valign: "top", shrinkText: true
      });
    });

    // Hint
    s.addImage({ data: ic.bulb, x: L.mx, y: 3.75, w: 0.22, h: 0.22 });
    s.addText("情報源の番号をクリックすると、元のサイトに直接アクセスできます", {
      x: L.mx + 0.32, y: 3.7, w: L.W - L.mx * 2 - 0.4, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans, italic: true,
      color: C.textLight, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 5: DEMO - BASIC SEARCH
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "実演: 基本的な検索", "DEMO");
    addFooter(s, 5, T);

    // Demo badge
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 1.0, w: L.W - L.mx * 2, h: 0.55,
      fill: { color: C.greenBg }, rectRadius: 0.05
    });
    s.addImage({ data: ic.search, x: L.mx + 0.15, y: 1.1, w: 0.3, h: 0.3 });
    s.addText('検索例: 「2024年のAIトレンドについて教えてください」', {
      x: L.mx + 0.55, y: 1.0, w: L.W - L.mx * 2 - 0.7, h: 0.55,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.green, valign: "middle", shrinkText: true
    });

    // Gray demo area
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 1.75, w: L.W - L.mx * 2, h: 2.5,
      fill: { color: C.lightGray }, rectRadius: 0.06
    });

    // Steps inside demo area
    const steps = [
      { sec: "Step 1", text: "Perplexity.ai にアクセスし、検索ボックスをクリック" },
      { sec: "Step 2", text: "質問文を入力して Enter キーで送信" },
      { sec: "Step 3", text: "AIが情報を収集・分析し、回答を生成（数秒）" },
      { sec: "Step 4", text: "回答本文・情報源リスト・関連質問を確認" },
    ];

    steps.forEach((st, i) => {
      const y = 1.9 + i * 0.55;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx + 0.2, y, w: 0.85, h: 0.38,
        fill: { color: C.accentLight }, rectRadius: 0.04
      });
      s.addText(st.sec, {
        x: L.mx + 0.2, y, w: 0.85, h: 0.38,
        fontSize: F.size.caption, fontFace: F.sans, bold: true,
        color: C.accent, align: "center", valign: "middle", shrinkText: true
      });
      s.addText(st.text, {
        x: L.mx + 1.2, y, w: 7.0, h: 0.38,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textDark, valign: "middle", shrinkText: true
      });
    });
  }

  // ============================================================
  // SLIDE 6: DEMO POINTS
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "実演のポイント");
    addFooter(s, 6, T);

    const points = [
      { ic: ic.keyboard, text: "自然な日本語で質問を入力する（キーワードだけでもOK）" },
      { ic: ic.mouse,    text: "Enter キーまたは送信ボタンで検索を実行" },
      { ic: ic.eye,      text: "数秒以内にAI回答が自動生成される" },
      { ic: ic.link,     text: "引用番号をクリックして情報源を確認できる" },
    ];

    points.forEach((pt, i) => {
      const y = 1.05 + i * 0.85;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.72,
        fill: { color: i % 2 === 0 ? C.accentLight : C.offWhite },
        line: { color: C.border, width: 0.5 }, rectRadius: 0.05
      });
      // Number badge
      s.addText(String(i + 1), {
        x: L.mx + 0.15, y: y + 0.13, w: 0.45, h: 0.45,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: C.accent }, shape: pres.shapes.OVAL, shrinkText: true
      });
      // Icon
      s.addImage({ data: pt.ic, x: L.mx + 0.75, y: y + 0.18, w: 0.32, h: 0.32 });
      // Text
      s.addText(pt.text, {
        x: L.mx + 1.2, y, w: 7.0, h: 0.72,
        fontSize: F.size.h3, fontFace: F.sans,
        color: C.textDark, valign: "middle", shrinkText: true
      });
    });
  }

  // ============================================================
  // SLIDE 7: FOLLOW-UP QUESTIONS
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "フォローアップ質問とは？", "FOLLOW-UP");
    addFooter(s, 7, T);

    // Definition box
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 1.0, w: L.W - L.mx * 2, h: 0.65,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    s.addImage({ data: ic.comments, x: L.mx + 0.15, y: 1.15, w: 0.3, h: 0.3 });
    s.addText("最初の回答に対してさらに詳しく聞く機能。会話を続けることで、より深い情報を得られる", {
      x: L.mx + 0.55, y: 1.0, w: L.W - L.mx * 2 - 0.7, h: 0.65,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", shrinkText: true
    });

    // Example cards
    const examples = [
      { text: "「もっと詳しく教えて」",     desc: "回答を深掘りする" },
      { text: "「具体例を挙げて」",         desc: "事例で理解を深める" },
      { text: "「日本での状況は？」",       desc: "地域・条件を絞り込む" },
    ];

    const cardW = 2.5;
    const cardGap = 0.26;
    const totalW = cardW * 3 + cardGap * 2;
    const startX = (L.W - totalW) / 2;

    examples.forEach((e, i) => {
      const x = startX + i * (cardW + cardGap);
      const y = 1.95;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 1.3,
        fill: { color: C.offWhite }, line: { color: C.border, width: 0.5 }, rectRadius: 0.05
      });
      s.addText(e.text, {
        x, y: y + 0.15, w: cardW, h: 0.45,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, align: "center", shrinkText: true
      });
      s.addImage({ data: ic.arrow, x: x + (cardW - 0.2) / 2, y: y + 0.6, w: 0.2, h: 0.2 });
      s.addText(e.desc, {
        x, y: y + 0.85, w: cardW, h: 0.3,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textLight, align: "center", shrinkText: true
      });
    });

    // Hint
    s.addImage({ data: ic.bulb, x: L.mx, y: 3.55, w: 0.22, h: 0.22 });
    s.addText("同じスレッド内で質問すると、前の回答を踏まえて回答してくれます", {
      x: L.mx + 0.32, y: 3.5, w: L.W - L.mx * 2 - 0.4, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans, italic: true,
      color: C.textLight, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 8: DEMO - FOLLOW-UP
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "実演: フォローアップ質問", "DEMO");
    addFooter(s, 8, T);

    // Demo badge
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 1.0, w: L.W - L.mx * 2, h: 0.55,
      fill: { color: C.greenBg }, rectRadius: 0.05
    });
    s.addImage({ data: ic.comments, x: L.mx + 0.15, y: 1.1, w: 0.3, h: 0.3 });
    s.addText('フォローアップ: 「その中で、日本企業の活用事例は？」', {
      x: L.mx + 0.55, y: 1.0, w: L.W - L.mx * 2 - 0.7, h: 0.55,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.green, valign: "middle", shrinkText: true
    });

    // Gray demo area
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 1.75, w: L.W - L.mx * 2, h: 2.5,
      fill: { color: C.lightGray }, rectRadius: 0.06
    });

    // Steps inside demo area
    const steps = [
      { sec: "Step 1", text: "前の検索結果の下にある入力欄をクリック" },
      { sec: "Step 2", text: "フォローアップの質問を入力して送信" },
      { sec: "Step 3", text: "AIが前の文脈を踏まえて追加情報を収集" },
      { sec: "Step 4", text: "より具体的な回答（日本企業の事例）が表示される" },
    ];

    steps.forEach((st, i) => {
      const y = 1.9 + i * 0.55;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx + 0.2, y, w: 0.85, h: 0.38,
        fill: { color: C.accentLight }, rectRadius: 0.04
      });
      s.addText(st.sec, {
        x: L.mx + 0.2, y, w: 0.85, h: 0.38,
        fontSize: F.size.caption, fontFace: F.sans, bold: true,
        color: C.accent, align: "center", valign: "middle", shrinkText: true
      });
      s.addText(st.text, {
        x: L.mx + 1.2, y, w: 7.0, h: 0.38,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textDark, valign: "middle", shrinkText: true
      });
    });
  }

  // ============================================================
  // SLIDE 9: IMPORTANCE OF CHECKING SOURCES
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "情報源を確認する重要性", "TRUST");
    addFooter(s, 9, T);

    const items = [
      { ic: ic.shield,   label: "信頼性の確認",   desc: "情報源が信頼できる\nサイトか判断する",       bgColor: C.greenBg,   labelColor: C.green },
      { ic: ic.eye,      label: "正確性の検証",   desc: "AIの回答が正しいか\n元情報と照合する",        bgColor: C.accentLight, labelColor: C.accent },
      { ic: ic.book,     label: "詳細の探索",     desc: "より詳しい情報を\n元サイトで確認する",        bgColor: C.purpleBg,  labelColor: C.purple },
      { ic: ic.exchange, label: "多角的な視点",   desc: "複数の情報源で\n異なる意見を比較する",        bgColor: C.amberBg,   labelColor: C.amber },
    ];

    const cardW = (L.W - L.mx * 2 - 0.26) / 2;
    const cardH = 1.45;

    items.forEach((e, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = L.mx + col * (cardW + 0.26);
      const y = 1.05 + row * (cardH + 0.2);

      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: cardH,
        fill: { color: C.offWhite }, line: { color: C.border, width: 0.5 }, rectRadius: 0.05
      });
      // Colored header strip
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 0.45,
        fill: { color: e.bgColor }, rectRadius: 0.05
      });
      s.addImage({ data: e.ic, x: x + 0.15, y: y + 0.08, w: 0.28, h: 0.28 });
      s.addText(e.label, {
        x: x + 0.5, y, w: cardW - 0.65, h: 0.45,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: e.labelColor, valign: "middle", shrinkText: true
      });
      s.addText(e.desc, {
        x: x + 0.15, y: y + 0.55, w: cardW - 0.3, h: 0.75,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, valign: "middle", shrinkText: true
      });
    });

    // Warning
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.0, w: L.W - L.mx * 2, h: 0.48,
      fill: { color: C.amberBg }, rectRadius: 0.04
    });
    s.addImage({ data: ic.warning, x: L.mx + 0.12, y: 4.1, w: 0.24, h: 0.24 });
    s.addText("AI生成の回答は必ずしも正確ではありません。重要な情報は情報源で裏取りしましょう", {
      x: L.mx + 0.45, y: 4.0, w: L.W - L.mx * 2 - 0.6, h: 0.48,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.amber, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 10: SEARCH TIPS 1 - KEYWORD SELECTION
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "検索のコツ1: キーワード選択", "TIPS");
    addFooter(s, 10, T);

    // Two column comparison
    const cols = [
      {
        label: "悪い例",
        color: C.red,
        bgColor: C.redBg,
        ic: ic.warning,
        points: [
          "「AI」（広すぎる）",
          "「最近のニュース」（曖昧）",
          "「おすすめ」（主観的すぎる）",
        ]
      },
      {
        label: "良い例",
        color: C.green,
        bgColor: C.greenBg,
        ic: ic.thumbsUp,
        points: [
          "「生成AIの企業活用事例 2024年」",
          "「リモートワーク 生産性 最新研究」",
          "「Python vs JavaScript 初心者 比較」",
        ]
      }
    ];

    const colW = 4.0;
    const colGap = 0.5;
    const totalW = colW * 2 + colGap;
    const startX = (L.W - totalW) / 2;

    cols.forEach((col, ci) => {
      const x = startX + ci * (colW + colGap);
      const y = 1.0;

      // Header
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: colW, h: 0.55,
        fill: { color: col.bgColor }, rectRadius: 0.04
      });
      s.addImage({ data: col.ic, x: x + 0.15, y: y + 0.12, w: 0.3, h: 0.3 });
      s.addText(col.label, {
        x: x + 0.55, y, w: colW - 0.7, h: 0.55,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: col.color, valign: "middle", shrinkText: true
      });

      // Points
      col.points.forEach((pt, pi) => {
        const py = y + 0.65 + pi * 0.52;
        s.addShape(pres.shapes.RECTANGLE, {
          x, y: py, w: colW, h: 0.44,
          fill: { color: pi % 2 === 0 ? C.offWhite : C.white },
          line: { color: C.border, width: 0.3 }
        });
        s.addText("•  " + pt, {
          x: x + 0.15, y: py, w: colW - 0.3, h: 0.44,
          fontSize: F.size.label, fontFace: F.sans,
          color: C.textBody,
          valign: "middle", shrinkText: true
        });
      });
    });

    // Hint
    s.addImage({ data: ic.bulb, x: L.mx, y: 3.6, w: 0.22, h: 0.22 });
    s.addText("具体的なキーワード + 質問形式で書くと、Perplexityの回答精度が上がります", {
      x: L.mx + 0.32, y: 3.55, w: L.W - L.mx * 2 - 0.4, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans, italic: true,
      color: C.textLight, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 11: SEARCH TIPS 2 - FOCUS
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "検索のコツ2: フォーカス活用", "TIPS");
    addFooter(s, 11, T);

    // Definition box
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 1.0, w: L.W - L.mx * 2, h: 0.55,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    s.addText("目的に合わせてフォーカスを選ぶと、検索精度が大幅にアップ！", {
      x: L.mx + 0.3, y: 1.0, w: L.W - L.mx * 2 - 0.6, h: 0.55,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", shrinkText: true
    });

    // Focus mapping table
    const rows = [
      { ic: ic.globe,  purpose: "一般的な情報を調べたい",   focus: "Web（デフォルト）",   color: C.accent },
      { ic: ic.grad,   purpose: "学術論文・研究データが必要", focus: "Academic",           color: C.green },
      { ic: ic.reddit, purpose: "ユーザーの声・口コミを知りたい", focus: "Reddit",         color: C.amber },
    ];

    // Table header
    const tableY = 1.75;
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: tableY, w: L.W - L.mx * 2, h: 0.45,
      fill: { color: C.navy }, rectRadius: 0.04
    });
    s.addText("目的", {
      x: L.mx + 0.5, y: tableY, w: 4.0, h: 0.45,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.white, valign: "middle", shrinkText: true
    });
    s.addText("おすすめフォーカス", {
      x: L.mx + 4.8, y: tableY, w: 3.5, h: 0.45,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.white, valign: "middle", shrinkText: true
    });

    rows.forEach((r, i) => {
      const y = tableY + 0.45 + i * 0.62;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.55,
        fill: { color: i % 2 === 0 ? C.offWhite : C.white },
        line: { color: C.border, width: 0.3 }
      });
      s.addImage({ data: r.ic, x: L.mx + 0.12, y: y + 0.12, w: 0.28, h: 0.28 });
      s.addText(r.purpose, {
        x: L.mx + 0.5, y, w: 4.0, h: 0.55,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textDark, valign: "middle", shrinkText: true
      });
      s.addText(r.focus, {
        x: L.mx + 4.8, y, w: 3.5, h: 0.55,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: r.color, valign: "middle", shrinkText: true
      });
    });

    // Hint
    s.addImage({ data: ic.bulb, x: L.mx, y: 3.85, w: 0.22, h: 0.22 });
    s.addText("迷ったらWeb（デフォルト）のまま検索すればOK。慣れてきたら切り替えましょう", {
      x: L.mx + 0.32, y: 3.8, w: L.W - L.mx * 2 - 0.4, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans, italic: true,
      color: C.textLight, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 12: SUMMARY
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "まとめ: 基本的な検索の流れ", "SUMMARY");
    addFooter(s, 12, T);

    // 5-step flow
    const steps = [
      { ic: ic.keyboard, label: "キーワード入力",   color: C.accent },
      { ic: ic.mouse,    label: "検索実行",         color: C.accent },
      { ic: ic.eye,      label: "結果確認",         color: C.accent },
      { ic: ic.link,     label: "情報源確認",       color: C.green },
      { ic: ic.comments, label: "フォローアップ",   color: C.purple },
    ];

    const stepW = 1.45;
    const arrowW = 0.25;
    const totalW = stepW * 5 + arrowW * 4;
    const startX = (L.W - totalW) / 2;

    steps.forEach((st, i) => {
      const x = startX + i * (stepW + arrowW);
      const y = 1.1;

      // Step card
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: stepW, h: 1.25,
        fill: { color: C.offWhite }, line: { color: C.border, width: 0.5 }, rectRadius: 0.05
      });
      // Step number
      s.addText(String(i + 1), {
        x: x + (stepW - 0.35) / 2, y: y + 0.1, w: 0.35, h: 0.35,
        fontSize: F.size.label, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: st.color }, shape: pres.shapes.OVAL, shrinkText: true
      });
      // Icon
      s.addImage({ data: st.ic, x: x + (stepW - 0.28) / 2, y: y + 0.5, w: 0.28, h: 0.28 });
      // Label
      s.addText(st.label, {
        x, y: y + 0.85, w: stepW, h: 0.3,
        fontSize: F.size.label, fontFace: F.sans, bold: true,
        color: C.textDark, align: "center", shrinkText: true
      });

      // Arrow between steps
      if (i < steps.length - 1) {
        s.addImage({ data: ic.chevron, x: x + stepW + 0.02, y: y + 0.48, w: 0.2, h: 0.2 });
      }
    });

    // Key takeaway box
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 2.65, w: L.W - L.mx * 2, h: 0.55,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    s.addImage({ data: ic.check, x: L.mx + 0.15, y: 2.77, w: 0.28, h: 0.28 });
    s.addText("検索 → 確認 → 深掘り のサイクルを回すことで、質の高い情報収集ができます", {
      x: L.mx + 0.55, y: 2.65, w: L.W - L.mx * 2 - 0.7, h: 0.55,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", shrinkText: true
    });

    // Next part
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.45, w: L.W - L.mx * 2, h: 0.48,
      fill: { color: C.lightGray }, rectRadius: 0.04
    });
    s.addImage({ data: ic.arrow, x: L.mx + 0.15, y: 3.55, w: 0.24, h: 0.24 });
    s.addText("次のパート: P-03 高度な検索テクニック（Focus機能・Pro Search など）", {
      x: L.mx + 0.5, y: 3.45, w: L.W - L.mx * 2 - 0.65, h: 0.48,
      fontSize: F.size.body, fontFace: F.sans, italic: true,
      color: C.textBody, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SAVE
  // ============================================================
  const outPath = `${__dirname}/スライド.pptx`;
  await pres.writeFile({ fileName: outPath });
  console.log(`Saved: ${outPath}`);
}

main().catch(e => { console.error(e); process.exit(1); });
