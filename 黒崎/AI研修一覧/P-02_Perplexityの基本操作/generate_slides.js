const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const {
  FaSearch, FaBullseye, FaGlobe, FaDesktop, FaKeyboard,
  FaCheckCircle, FaExclamationTriangle, FaLink, FaComments,
  FaArrowRight, FaLightbulb, FaListUl, FaBalanceScale,
  FaTable, FaClipboardList, FaChevronRight, FaQuestionCircle,
  FaBolt, FaThumbsUp, FaMousePointer, FaExternalLinkAlt,
  FaBook, FaLayerGroup
} = require("react-icons/fa");

// =====================================================
// DESIGN SYSTEM — Calibri, white+navy, 16:9
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
  pres.title = "P-02: Perplexityの基本操作 -- はじめてのAI検索";

  // Pre-render icons
  const ic = {
    search: await icon(FaSearch, C.accent),
    target: await icon(FaBullseye, C.accent),
    globe: await icon(FaGlobe, C.green),
    desktop: await icon(FaDesktop, C.accent),
    keyboard: await icon(FaKeyboard, C.accent),
    check: await icon(FaCheckCircle, C.green),
    warn: await icon(FaExclamationTriangle, C.amber),
    link: await icon(FaLink, C.accent),
    chat: await icon(FaComments, C.accent),
    arrow: await icon(FaArrowRight, C.accent),
    bulb: await icon(FaLightbulb, C.amber),
    list: await icon(FaListUl, C.accent),
    balance: await icon(FaBalanceScale, C.accent),
    table: await icon(FaTable, C.accent),
    clipboard: await icon(FaClipboardList, C.accent),
    chevron: await icon(FaChevronRight, C.textMuted),
    question: await icon(FaQuestionCircle, C.accent),
    bolt: await icon(FaBolt, C.amber),
    thumbsUp: await icon(FaThumbsUp, C.green),
    mouse: await icon(FaMousePointer, C.accent),
    extLink: await icon(FaExternalLinkAlt, C.accent),
    book: await icon(FaBook, C.accent),
    layers: await icon(FaLayerGroup, C.accent),
  };

  // ============================================================
  // SLIDE 1: TITLE (Navy background)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };
    s.addImage({ data: ic.search, x: (L.W - 0.6) / 2, y: 1.0, w: 0.6, h: 0.6 });
    s.addText("Perplexityの基本操作", {
      x: 0.5, y: 1.8, w: 9, h: 0.8,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center", shrinkText: true
    });
    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 2.75, w: 3, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });
    s.addText("はじめてのAI検索", {
      x: 0.5, y: 2.95, w: 9, h: 0.45,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", shrinkText: true
    });
    s.addText("P-02  |  全社員向け  |  12分", {
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
      "Perplexityにアクセスして基本検索ができる",
      "回答の出典（Citation）を確認してファクトチェックできる",
      "フォローアップ質問で対話的に深掘りできる",
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
  // SLIDE 3: ACCESS METHOD
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "Perplexityへのアクセス", "STEP 1");
    addFooter(s, 3, T);

    // URL highlight box
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 1.0, w: L.W - L.mx * 2, h: 0.6,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    s.addText("perplexity.ai", {
      x: L.mx + 0.3, y: 1.0, w: L.W - L.mx * 2 - 0.6, h: 0.6,
      fontSize: F.size.h1, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", align: "center", shrinkText: true
    });

    // Key points
    const points = [
      { ic: ic.check, text: "アカウント不要 — Quick Search無制限" },
      { ic: ic.check, text: "無料版でPro Search・Deep Research各5回/日" },
    ];

    points.forEach((p, i) => {
      const y = 1.85 + i * 0.55;
      s.addImage({ data: p.ic, x: L.mx + 0.2, y: y + 0.05, w: 0.3, h: 0.3 });
      s.addText(p.text, {
        x: L.mx + 0.7, y, w: 7, h: 0.45,
        fontSize: F.size.h3, fontFace: F.sans,
        color: C.textBody, valign: "middle", shrinkText: true
      });
    });

    // Pricing cards
    const plans = [
      { name: "Free", price: "$0", desc: "Quick Search無制限" },
      { name: "Pro", price: "$20/月", desc: "Pro Search無制限" },
      { name: "Max", price: "$200/月", desc: "全機能+Computer" },
    ];
    const cardW = 2.5;
    const cardGap = 0.25;
    const totalW = cardW * 3 + cardGap * 2;
    const startX = (L.W - totalW) / 2;

    plans.forEach((p, i) => {
      const x = startX + i * (cardW + cardGap);
      const y = 3.2;
      const isHighlight = i === 0;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 1.0,
        fill: { color: isHighlight ? C.accentLight : C.offWhite },
        line: { color: isHighlight ? C.accent : C.border, width: isHighlight ? 1.5 : 0.5 },
        rectRadius: 0.05
      });
      s.addText(p.name, {
        x, y: y + 0.05, w: cardW, h: 0.3,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.textDark, align: "center", shrinkText: true
      });
      s.addText(p.price, {
        x, y: y + 0.3, w: cardW, h: 0.3,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.accent, align: "center", shrinkText: true
      });
      s.addText(p.desc, {
        x, y: y + 0.6, w: cardW, h: 0.3,
        fontSize: F.size.caption, fontFace: F.sans,
        color: C.textLight, align: "center", shrinkText: true
      });
    });
  }

  // ============================================================
  // SLIDE 4: UI OVERVIEW
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "画面の見方", "STEP 2");
    addFooter(s, 4, T);

    const cards = [
      { ic: ic.search, title: "検索バー", desc: "画面中央の入力欄\n自然な文章で質問" },
      { ic: ic.target, title: "Focus切替", desc: "All / Academic\nWriting / YouTube" },
      { ic: ic.desktop, title: "モデル選択", desc: "使用AIモデルを選択\nデフォルトでOK" },
      { ic: ic.book, title: "Spaces", desc: "自分専用の\nナレッジベース" },
    ];

    const cardW = 2.0;
    const cardGap = 0.2;
    const totalW = cardW * 4 + cardGap * 3;
    const startX = (L.W - totalW) / 2;

    cards.forEach((c, i) => {
      const x = startX + i * (cardW + cardGap);
      const y = 1.0;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 2.0,
        fill: { color: C.offWhite }, line: { color: C.border, width: 0.5 }, rectRadius: 0.05
      });
      s.addShape(pres.shapes.LINE, {
        x, y, w: cardW, h: 0,
        line: { color: C.accent, width: 2 }
      });
      s.addImage({ data: c.ic, x: x + (cardW - 0.35) / 2, y: y + 0.2, w: 0.35, h: 0.35 });
      s.addText(c.title, {
        x, y: y + 0.65, w: cardW, h: 0.35,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, align: "center", shrinkText: true
      });
      s.addText(c.desc, {
        x: x + 0.1, y: y + 1.05, w: cardW - 0.2, h: 0.7,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textLight, align: "center", valign: "top", shrinkText: true
      });
    });

    // Tip callout
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.4, w: L.W - L.mx * 2, h: 0.5,
      fill: { color: C.amberBg }, rectRadius: 0.05
    });
    s.addText("Tip: キーワードだけでもOKですが、文章で質問するとより的確な回答が返ります", {
      x: L.mx + 0.3, y: 3.4, w: L.W - L.mx * 2 - 0.6, h: 0.5,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.amber, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 5: DEMO - BASIC SEARCH
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addFooter(s, 5, T);

    // Demo badge
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.15, w: 1.6, h: 0.28,
      fill: { color: C.green }, rectRadius: 0.05
    });
    s.addText("HANDS-ON", {
      x: L.mx, y: 0.15, w: 1.6, h: 0.28,
      fontSize: F.size.caption, fontFace: F.sans, bold: true,
      color: C.white, align: "center", valign: "middle", shrinkText: true
    });
    s.addText("基本検索をやってみよう", {
      x: L.mx, y: 0.5, w: 8.5, h: 0.45,
      fontSize: F.size.h1, fontFace: F.sans, bold: true,
      color: C.textDark, shrinkText: true
    });

    // Flow: 3 steps
    const steps = ["検索バーに入力", "Enterで送信", "回答が生成される"];
    const stepW = 2.2;
    const arrowW = 0.4;
    const flowTotalW = stepW * 3 + arrowW * 2;
    const flowX = (L.W - flowTotalW) / 2;

    steps.forEach((st, i) => {
      const x = flowX + i * (stepW + arrowW);
      const clr = i === 2 ? C.green : C.accent;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: 1.2, w: stepW, h: 0.5,
        fill: { color: clr }, rectRadius: 0.05
      });
      s.addText(st, {
        x, y: 1.2, w: stepW, h: 0.5,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle", shrinkText: true
      });
      if (i < 2) {
        s.addText("\u2794", {
          x: x + stepW, y: 1.2, w: arrowW, h: 0.5,
          fontSize: F.size.h3, fontFace: F.sans,
          color: C.textMuted, align: "center", valign: "middle"
        });
      }
    });

    // Search bar mockup
    s.addShape(pres.shapes.RECTANGLE, {
      x: 1.5, y: 2.2, w: 7, h: 0.8,
      fill: { color: C.lightGray }, line: { color: C.accent, width: 2 }, rectRadius: 0.3
    });
    s.addText("2024年のAI業界の主要トレンドを5つ教えてください", {
      x: 1.5, y: 2.2, w: 7, h: 0.8,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textDark, align: "center", valign: "middle", shrinkText: true
    });

    // Callout
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.5, w: L.W - L.mx * 2, h: 0.5,
      fill: { color: C.amberBg }, rectRadius: 0.05
    });
    s.addText("実演動画（33秒）: AIがリアルタイムでWebを検索し、出典付きで回答を生成", {
      x: L.mx + 0.3, y: 3.5, w: L.W - L.mx * 2 - 0.6, h: 0.5,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.amber, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 6: READING RESULTS
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "回答画面の読み方", "STEP 3");
    addFooter(s, 6, T);

    const items = [
      { ic: ic.link, title: "出典番号 [1][2][3]", desc: "回答文中の番号。クリックで元サイトに飛べる" },
      { ic: ic.list, title: "ソースカード", desc: "回答上部に参照元サイトがカード形式で表示" },
      { ic: ic.chat, title: "関連質問の提案", desc: "回答下にAIがおすすめの追加質問を提案" },
    ];

    const cardW = 2.6;
    const cardGap = 0.25;
    const totalW = cardW * 3 + cardGap * 2;
    const startX = (L.W - totalW) / 2;

    items.forEach((item, i) => {
      const x = startX + i * (cardW + cardGap);
      const y = 1.0;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 1.8,
        fill: { color: C.offWhite }, line: { color: C.border, width: 0.5 }, rectRadius: 0.05
      });
      s.addImage({ data: item.ic, x: x + (cardW - 0.3) / 2, y: y + 0.15, w: 0.3, h: 0.3 });
      s.addText(item.title, {
        x, y: y + 0.55, w: cardW, h: 0.35,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, align: "center", shrinkText: true
      });
      s.addText(item.desc, {
        x: x + 0.15, y: y + 0.95, w: cardW - 0.3, h: 0.6,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textLight, align: "center", valign: "top", shrinkText: true
      });
    });

    // Highlight box
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.2, w: L.W - L.mx * 2, h: 0.55,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    s.addText("出典番号 = Perplexity最大の強み。情報の信頼性を自分で確認できる", {
      x: L.mx + 0.3, y: 3.2, w: L.W - L.mx * 2 - 0.6, h: 0.55,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 7: FACT CHECK
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "出典をクリックしてファクトチェック", "IMPORTANT");
    addFooter(s, 7, T);

    // Flow
    const steps = ["出典番号をクリック", "元サイトが開く", "情報を確認"];
    const stepW = 2.2;
    const arrowW = 0.4;
    const flowX = (L.W - (stepW * 3 + arrowW * 2)) / 2;

    steps.forEach((st, i) => {
      const x = flowX + i * (stepW + arrowW);
      const clr = i === 2 ? C.green : C.accent;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: 1.05, w: stepW, h: 0.45,
        fill: { color: clr }, rectRadius: 0.05
      });
      s.addText(st, {
        x, y: 1.05, w: stepW, h: 0.45,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle", shrinkText: true
      });
      if (i < 2) {
        s.addText("\u2794", {
          x: x + stepW, y: 1.05, w: arrowW, h: 0.45,
          fontSize: F.size.h3, fontFace: F.sans,
          color: C.textMuted, align: "center", valign: "middle"
        });
      }
    });

    // Warning points
    const warnings = [
      { ic: ic.warn, text: "AIにはハルシネーション（もっともらしい不正確情報）のリスクがある" },
      { ic: ic.warn, text: "数字・データ・法的情報は必ず元ソースで確認" },
      { ic: ic.check, text: "信頼性が高いソースを優先: 官公庁 > 大手メディア > 論文" },
    ];

    warnings.forEach((w, i) => {
      const y = 1.8 + i * 0.6;
      s.addImage({ data: w.ic, x: L.mx + 0.2, y: y + 0.05, w: 0.3, h: 0.3 });
      s.addText(w.text, {
        x: L.mx + 0.7, y, w: 7.5, h: 0.5,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, valign: "middle", shrinkText: true
      });
    });

    // Callout
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.7, w: L.W - L.mx * 2, h: 0.5,
      fill: { color: C.amberBg }, rectRadius: 0.05
    });
    s.addText("出典付き = 安心 ではない。重要情報は必ず元サイトで裏取りしよう", {
      x: L.mx + 0.3, y: 3.7, w: L.W - L.mx * 2 - 0.6, h: 0.5,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.amber, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 8: DEMO - FOLLOW-UP
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addFooter(s, 8, T);

    // Demo badge
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.15, w: 1.6, h: 0.28,
      fill: { color: C.green }, rectRadius: 0.05
    });
    s.addText("HANDS-ON", {
      x: L.mx, y: 0.15, w: 1.6, h: 0.28,
      fontSize: F.size.caption, fontFace: F.sans, bold: true,
      color: C.white, align: "center", valign: "middle", shrinkText: true
    });
    s.addText("フォローアップ質問で深掘り", {
      x: L.mx, y: 0.5, w: 8.5, h: 0.45,
      fontSize: F.size.h1, fontFace: F.sans, bold: true,
      color: C.textDark, shrinkText: true
    });

    // Conversation thread
    const thread = [
      { num: "1", text: "「中小企業がAIを業務に導入するための具体的なステップを教えてください」" },
      { num: "2", text: "「その中で日本企業に最も影響があるのはどれですか？」" },
    ];

    thread.forEach((t, i) => {
      const y = 1.2 + i * 0.8;
      s.addText(t.num, {
        x: L.mx + 0.2, y: y + 0.05, w: 0.4, h: 0.4,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: C.accent }, shape: pres.shapes.OVAL, shrinkText: true
      });
      s.addText(t.text, {
        x: L.mx + 0.8, y, w: 7.5, h: 0.5,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textDark, valign: "middle", shrinkText: true
      });
    });

    // Key insight
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.2, w: L.W - L.mx * 2, h: 0.55,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    s.addText("前の回答の文脈を引き継ぐから「その中で」が通じる = 対話型検索の力", {
      x: L.mx + 0.3, y: 3.2, w: L.W - L.mx * 2 - 0.6, h: 0.55,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", shrinkText: true
    });

    // Demo callout
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.0, w: L.W - L.mx * 2, h: 0.5,
      fill: { color: C.amberBg }, rectRadius: 0.05
    });
    s.addText("実演動画（52秒）: 同じスレッド内でフォローアップ質問する様子をご覧ください", {
      x: L.mx + 0.3, y: 4.0, w: L.W - L.mx * 2 - 0.6, h: 0.5,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.amber, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 9: TIP 1 - BE SPECIFIC
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "検索のコツ(1) 具体的に聞く", "TIP 1");
    addFooter(s, 9, T);

    // Bad example
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 1.0, w: 2.5, h: 0.55,
      fill: { color: C.redBg }, rectRadius: 0.05
    });
    s.addText("\u2717 「AI」", {
      x: L.mx, y: 1.0, w: 2.5, h: 0.55,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.red, align: "center", valign: "middle", shrinkText: true
    });

    // Arrow
    s.addText("\u2794", {
      x: L.mx + 2.7, y: 1.0, w: 0.5, h: 0.55,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.textMuted, align: "center", valign: "middle"
    });

    // Good example
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx + 3.4, y: 1.0, w: 5.0, h: 0.55,
      fill: { color: C.greenBg }, rectRadius: 0.05
    });
    s.addText("\u2713 「営業部門でメール対応を効率化するAI活用法」", {
      x: L.mx + 3.4, y: 1.0, w: 5.0, h: 0.55,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.green, align: "center", valign: "middle", shrinkText: true
    });

    // 3 keys
    const keys = [
      { label: "誰が", desc: "営業部門、新入社員、経営者..." },
      { label: "何を", desc: "メール効率化、研修設計、市場調査..." },
      { label: "どのように", desc: "ステップ形式で、具体例付きで..." },
    ];

    keys.forEach((k, i) => {
      const y = 2.0 + i * 0.65;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx + 0.2, y: y + 0.05, w: 1.2, h: 0.35,
        fill: { color: C.accent }, rectRadius: 0.05
      });
      s.addText(k.label, {
        x: L.mx + 0.2, y: y + 0.05, w: 1.2, h: 0.35,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle", shrinkText: true
      });
      s.addText(k.desc, {
        x: L.mx + 1.6, y, w: 6.5, h: 0.5,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, valign: "middle", shrinkText: true
      });
    });

    // Callout
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.0, w: L.W - L.mx * 2, h: 0.5,
      fill: { color: C.amberBg }, rectRadius: 0.05
    });
    s.addText("曖昧な質問には曖昧な回答、具体的な質問には具体的な回答。AI検索の鉄則。", {
      x: L.mx + 0.3, y: 4.0, w: L.W - L.mx * 2 - 0.6, h: 0.5,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.amber, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 10: TIP 2 - COMPARE & SUMMARIZE
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "検索のコツ(2) 比較・まとめを頼む", "TIP 2");
    addFooter(s, 10, T);

    // Example search
    s.addShape(pres.shapes.RECTANGLE, {
      x: 1.5, y: 1.0, w: 7, h: 0.6,
      fill: { color: C.lightGray }, line: { color: C.accent, width: 2 }, rectRadius: 0.3
    });
    s.addText("SlackとTeamsの違いを表形式で比較して", {
      x: 1.5, y: 1.0, w: 7, h: 0.6,
      fontSize: F.size.h3, fontFace: F.sans,
      color: C.textDark, align: "center", valign: "middle", shrinkText: true
    });

    // Output format cards
    const formats = [
      { ic: ic.table, title: "表形式で", desc: "比較表をそのまま資料に" },
      { ic: ic.list, title: "箇条書きで", desc: "ポイントを整理して把握" },
      { ic: ic.target, title: "3つに絞って", desc: "情報量をコントロール" },
    ];

    const cardW = 2.6;
    const cardGap = 0.25;
    const totalW = cardW * 3 + cardGap * 2;
    const startX = (L.W - totalW) / 2;

    formats.forEach((f, i) => {
      const x = startX + i * (cardW + cardGap);
      const y = 2.0;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 1.3,
        fill: { color: C.offWhite }, line: { color: C.border, width: 0.5 }, rectRadius: 0.05
      });
      s.addImage({ data: f.ic, x: x + (cardW - 0.3) / 2, y: y + 0.1, w: 0.3, h: 0.3 });
      s.addText(f.title, {
        x, y: y + 0.45, w: cardW, h: 0.3,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, align: "center", shrinkText: true
      });
      s.addText(f.desc, {
        x: x + 0.15, y: y + 0.8, w: cardW - 0.3, h: 0.35,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textLight, align: "center", shrinkText: true
      });
    });

    // Callout
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.7, w: L.W - L.mx * 2, h: 0.5,
      fill: { color: C.amberBg }, rectRadius: 0.05
    });
    s.addText("出力形式を指定すると、そのまま資料にコピーして使える回答が返ります", {
      x: L.mx + 0.3, y: 3.7, w: L.W - L.mx * 2 - 0.6, h: 0.5,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.amber, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 11: SUMMARY
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "まとめ -- 3つのキーポイント", "SUMMARY");
    addFooter(s, 11, T);

    const points = [
      "perplexity.ai にアクセスするだけで、出典付きのAI検索ができる（Quick Search無制限）",
      "出典番号をクリックして、重要な情報は必ずファクトチェック",
      "フォローアップ質問で、対話的に情報を深掘りできる",
    ];

    points.forEach((p, i) => {
      const y = 1.0 + i * 0.9;
      s.addText(String(i + 1), {
        x: L.mx, y: y + 0.05, w: 0.45, h: 0.45,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: C.accent }, shape: pres.shapes.OVAL, shrinkText: true
      });
      s.addText(p, {
        x: L.mx + 0.65, y, w: 7.8, h: 0.55,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textDark, valign: "middle", shrinkText: true
      });
      if (i < 2) {
        s.addShape(pres.shapes.LINE, {
          x: L.mx, y: y + 0.7, w: L.W - L.mx * 2, h: 0,
          line: { color: C.border, width: 0.5 }
        });
      }
    });

    // Bonus callout
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.8, w: L.W - L.mx * 2, h: 0.5,
      fill: { color: C.amberBg }, rectRadius: 0.05
    });
    s.addText("+\u03B1: 具体的に聞く & 比較・まとめを頼む で回答精度アップ！", {
      x: L.mx + 0.3, y: 3.8, w: L.W - L.mx * 2 - 0.6, h: 0.5,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.amber, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 12: END (Navy background)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };
    s.addText("P-02 修了", {
      x: 0.5, y: 1.5, w: 9, h: 0.8,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center", shrinkText: true
    });
    s.addText("お疲れさまでした", {
      x: 0.5, y: 2.4, w: 9, h: 0.5,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", shrinkText: true
    });
    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 3.1, w: 3, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });
    s.addText("次回: P-03 高度な検索テクニック", {
      x: 0.5, y: 3.3, w: 9, h: 0.4,
      fontSize: F.size.h3, fontFace: F.sans,
      color: C.accentMid, align: "center", shrinkText: true
    });
    s.addText("Pro Search / Deep Research / Spaces / プロンプトの工夫", {
      x: 0.5, y: 3.8, w: 9, h: 0.35,
      fontSize: F.size.caption, fontFace: F.sans,
      color: C.textMuted, align: "center", shrinkText: true
    });
  }

  // ============================================================
  // OUTPUT
  // ============================================================
  const outDir = __dirname;
  const outPath = `${outDir}/スライド.pptx`;
  await pres.writeFile({ fileName: outPath });
  console.log(`[OK] ${outPath}`);
}

main().catch(e => { console.error(e); process.exit(1); });
