const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const {
  FaSearch, FaBullseye, FaGraduationCap, FaYoutube, FaReddit, FaWikipediaW,
  FaPen, FaRocket, FaFolder, FaFileUpload, FaFileAlt, FaCheckCircle,
  FaArrowRight, FaGlobe, FaLightbulb, FaShareAlt, FaDatabase,
  FaClipboardList, FaChartBar, FaBookOpen, FaLayerGroup, FaLink,
  FaMicroscope, FaFileWord, FaChevronRight, FaUsers, FaHashtag
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
  slide.addText(`P-03`, {
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
  pres.title = "P-03: 高度な検索テクニック -- Perplexityを使いこなす";

  // Pre-render icons
  const ic = {
    search:   await icon(FaSearch,       C.accent),
    target:   await icon(FaBullseye,     C.accent),
    grad:     await icon(FaGraduationCap, C.green),
    youtube:  await icon(FaYoutube,      C.red),
    reddit:   await icon(FaReddit,       C.amber),
    wiki:     await icon(FaWikipediaW,   C.textBody),
    pen:      await icon(FaPen,          C.amber),
    rocket:   await icon(FaRocket,       C.accent),
    folder:   await icon(FaFolder,       C.amber),
    upload:   await icon(FaFileUpload,   C.green),
    file:     await icon(FaFileAlt,      C.accent),
    check:    await icon(FaCheckCircle,  C.green),
    checkBlue: await icon(FaCheckCircle, C.accent),
    arrow:    await icon(FaArrowRight,   C.accent),
    globe:    await icon(FaGlobe,        C.accent),
    bulb:     await icon(FaLightbulb,    C.amber),
    share:    await icon(FaShareAlt,     C.accent),
    db:       await icon(FaDatabase,     C.purple),
    clipboard: await icon(FaClipboardList, C.accent),
    chart:    await icon(FaChartBar,     C.green),
    book:     await icon(FaBookOpen,     C.accent),
    layer:    await icon(FaLayerGroup,   C.accent),
    link:     await icon(FaLink,         C.accent),
    scope:    await icon(FaMicroscope,   C.green),
    word:     await icon(FaFileWord,     C.amber),
    users:    await icon(FaUsers,        C.accent),
    hash:     await icon(FaHashtag,      C.purple),
  };

  // ============================================================
  // SLIDE 1: TITLE (Navy background)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };
    s.addImage({ data: ic.search, x: (L.W - 0.65) / 2, y: 0.85, w: 0.65, h: 0.65 });
    s.addText("高度な検索テクニック", {
      x: 0.5, y: 1.65, w: 9, h: 0.85,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center", shrinkText: true
    });
    s.addShape(pres.shapes.LINE, {
      x: 3.2, y: 2.65, w: 3.6, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });
    s.addText("Perplexityを使いこなす", {
      x: 0.5, y: 2.8, w: 9, h: 0.45,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", shrinkText: true
    });
    s.addText("P-03  |  全社員  |  12分", {
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
      { icon: ic.target, text: "Focus機能（7種）を目的に応じて使い分けられる" },
      { icon: ic.rocket, text: "Pro Search・Deep Researchで複雑な調査を効率化できる" },
      { icon: ic.users,  text: "Spaces・Pagesでチーム活用できる" },
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
  // SLIDE 3: FOCUS OVERVIEW
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "Focus機能とは？", "FOCUS");
    addFooter(s, 3, T);

    // Definition box
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 1.0, w: L.W - L.mx * 2, h: 0.65,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    s.addText("検索対象を7種類から選んで絞り込み、回答の精度を上げる機能", {
      x: L.mx + 0.3, y: 1.0, w: L.W - L.mx * 2 - 0.6, h: 0.65,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", shrinkText: true
    });

    // 3 benefit cards
    const benefits = [
      { ic: ic.target, label: "ノイズ削減", desc: "不要なソースを排除" },
      { ic: ic.check,  label: "精度向上",   desc: "目的に合った情報だけ" },
      { ic: ic.rocket, label: "時間短縮",   desc: "最短で欲しい情報へ" },
    ];

    const cardW = 2.5;
    const cardGap = 0.26;
    const totalW = cardW * 3 + cardGap * 2;
    const startX = (L.W - totalW) / 2;

    benefits.forEach((e, i) => {
      const x = startX + i * (cardW + cardGap);
      const y = 1.95;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 1.35,
        fill: { color: C.offWhite }, line: { color: C.border, width: 0.5 }, rectRadius: 0.05
      });
      s.addImage({ data: e.ic, x: x + (cardW - 0.32) / 2, y: y + 0.18, w: 0.32, h: 0.32 });
      s.addText(e.label, {
        x, y: y + 0.55, w: cardW, h: 0.35,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, align: "center", shrinkText: true
      });
      s.addText(e.desc, {
        x, y: y + 0.9, w: cardW, h: 0.3,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textLight, align: "center", shrinkText: true
      });
    });

    s.addImage({ data: ic.bulb, x: L.mx, y: 3.6, w: 0.22, h: 0.22 });
    s.addText("検索バー横のアイコンからFocusの種類を選ぶだけ", {
      x: L.mx + 0.32, y: 3.55, w: L.W - L.mx * 2 - 0.4, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans, italic: true,
      color: C.textLight, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 4: FOCUS GUIDE
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "Focus使い分けガイド");
    addFooter(s, 4, T);

    const types = [
      { ic: ic.globe,   label: "All",       desc: "一般的な質問\nWeb全体を横断",       color: C.accent  },
      { ic: ic.grad,    label: "Academic",  desc: "論文・研究データ\nエビデンス重視",   color: C.green   },
      { ic: ic.word,    label: "Writing",   desc: "文章作成\nWeb検索なし",             color: C.amber   },
      { ic: ic.youtube, label: "YouTube",   desc: "動画・操作手順\n解説を探す",        color: C.red     },
      { ic: ic.reddit,  label: "Reddit",    desc: "ネット世論\n製品評判調査",           color: C.amber   },
      { ic: ic.wiki,    label: "Wikipedia", desc: "基礎知識\n用語確認",                color: C.textBody},
      { ic: ic.hash,    label: "Social",    desc: "SNSトレンド\n最新の話題",           color: C.purple  },
    ];

    // 4 + 3 layout
    const topTypes = types.slice(0, 4);
    const botTypes = types.slice(4);
    const cW = 2.05;
    const cH = 1.1;
    const gapX = 0.18;
    const gapY = 0.22;

    topTypes.forEach((t, i) => {
      const totalW4 = cW * 4 + gapX * 3;
      const sx = (L.W - totalW4) / 2;
      const x = sx + i * (cW + gapX);
      const y = 1.0;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cW, h: cH,
        fill: { color: C.offWhite }, line: { color: C.border, width: 0.5 }, rectRadius: 0.04
      });
      s.addImage({ data: t.ic, x: x + 0.12, y: y + (cH - 0.28) / 2, w: 0.28, h: 0.28 });
      s.addText(t.label, {
        x: x + 0.48, y: y + 0.08, w: cW - 0.6, h: 0.32,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.textDark, shrinkText: true
      });
      s.addText(t.desc, {
        x: x + 0.48, y: y + 0.4, w: cW - 0.6, h: 0.6,
        fontSize: F.size.caption, fontFace: F.sans,
        color: C.textLight, shrinkText: true
      });
    });

    botTypes.forEach((t, i) => {
      const totalW3 = cW * 3 + gapX * 2;
      const sx = (L.W - totalW3) / 2;
      const x = sx + i * (cW + gapX);
      const y = 1.0 + cH + gapY;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cW, h: cH,
        fill: { color: C.offWhite }, line: { color: C.border, width: 0.5 }, rectRadius: 0.04
      });
      s.addImage({ data: t.ic, x: x + 0.12, y: y + (cH - 0.28) / 2, w: 0.28, h: 0.28 });
      s.addText(t.label, {
        x: x + 0.48, y: y + 0.08, w: cW - 0.6, h: 0.32,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.textDark, shrinkText: true
      });
      s.addText(t.desc, {
        x: x + 0.48, y: y + 0.4, w: cW - 0.6, h: 0.6,
        fontSize: F.size.caption, fontFace: F.sans,
        color: C.textLight, shrinkText: true
      });
    });

    s.addImage({ data: ic.bulb, x: L.mx, y: 3.65, w: 0.22, h: 0.22 });
    s.addText("迷ったらAllで始めて、必要に応じて切り替えましょう", {
      x: L.mx + 0.32, y: 3.6, w: L.W - L.mx * 2 - 0.4, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans, italic: true,
      color: C.textLight, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 5: ACADEMIC DEMO
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "実演: Academic検索で論文を探す", "DEMO");
    addFooter(s, 5, T);

    // Demo badge
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 1.0, w: L.W - L.mx * 2, h: 0.55,
      fill: { color: C.greenBg }, rectRadius: 0.05
    });
    s.addImage({ data: ic.grad, x: L.mx + 0.15, y: 1.1, w: 0.3, h: 0.3 });
    s.addText('Focus: Academic  |  質問: 「大規模言語モデルの最新研究動向と企業での活用事例について学術論文ベースで教えてください」', {
      x: L.mx + 0.55, y: 1.0, w: L.W - L.mx * 2 - 0.7, h: 0.55,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.green, valign: "middle", shrinkText: true
    });

    // Timeline
    const steps = [
      { sec: "0〜4秒",   text: "Perplexityトップページを開く" },
      { sec: "4〜15秒",  text: "検索バーに質問をタイピング" },
      { sec: "15〜27秒", text: "送信 → 複数論文を参照しながら回答生成" },
      { sec: "27〜34秒", text: "回答完成。出典付きで研究動向・活用事例が整理される" },
    ];

    steps.forEach((st, i) => {
      const y = 1.75 + i * 0.66;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y: y - 0.03, w: 1.1, h: 0.38,
        fill: { color: C.accentLight }, rectRadius: 0.04
      });
      s.addText(st.sec, {
        x: L.mx, y: y - 0.03, w: 1.1, h: 0.38,
        fontSize: F.size.caption, fontFace: F.sans, bold: true,
        color: C.accent, align: "center", valign: "middle", shrinkText: true
      });
      s.addText(st.text, {
        x: L.mx + 1.2, y, w: 7.3, h: 0.35,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textDark, valign: "middle", shrinkText: true
      });
    });

    s.addText("★ 実演動画: 34秒", {
      x: L.W - 2.2, y: L.H - 0.75, w: 2.0, h: 0.28,
      fontSize: F.size.caption, fontFace: F.sans, bold: true,
      color: C.accent, align: "right", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 6: PRO SEARCH vs DEEP RESEARCH
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "Pro Search vs Deep Research", "PRO SEARCH");
    addFooter(s, 6, T);

    // Two column comparison
    const cols = [
      {
        label: "Pro Search",
        color: C.accent,
        bgColor: C.accentLight,
        ic: ic.rocket,
        points: [
          "複数ステップで深掘り検索",
          "質問を分解→段階的に実行→統合",
          "数分で詳細レポートレベルの回答",
          "無料: 1日5回 / Pro: 無制限",
          "用途: 複雑な調査・比較分析",
        ]
      },
      {
        label: "Deep Research",
        color: C.green,
        bgColor: C.greenBg,
        ic: ic.scope,
        points: [
          "長時間の本格調査レポートを自動生成",
          "学術論文・市場レポートレベルの深さ",
          "複数情報源を横断的に分析",
          "無料: 1日5回 / Pro: 無制限",
          "用途: 徹底調査・レポート作成",
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
          color: pi === 3 ? col.color : C.textBody,
          bold: pi === 3,
          valign: "middle", shrinkText: true
        });
      });
    });
  }

  // ============================================================
  // SLIDE 7: PRO SEARCH DEMO
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "実演: Pro Searchで市場調査", "DEMO");
    addFooter(s, 7, T);

    // Demo badge
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 1.0, w: L.W - L.mx * 2, h: 0.55,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    s.addImage({ data: ic.rocket, x: L.mx + 0.15, y: 1.1, w: 0.3, h: 0.3 });
    s.addText('Pro Search ON  |  質問: 「日本の生成AI市場の規模と成長予測を、主要プレイヤーの比較と合わせて詳しく調査してください」', {
      x: L.mx + 0.55, y: 1.0, w: L.W - L.mx * 2 - 0.7, h: 0.55,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", shrinkText: true
    });

    // Timeline
    const steps = [
      { sec: "0〜14秒",  text: "Perplexityトップ画面から質問をタイピング・送信" },
      { sec: "14〜30秒", text: "Pro Searchが複数ステップで収集・分析。市場規模・成長率が表示される" },
      { sec: "30〜43秒", text: "スクロールで主要プレイヤー比較（OpenAI/Google/Anthropic/Microsoft等）を確認" },
    ];

    steps.forEach((st, i) => {
      const y = 1.75 + i * 0.72;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y: y - 0.03, w: 1.1, h: 0.45,
        fill: { color: C.accentLight }, rectRadius: 0.04
      });
      s.addText(st.sec, {
        x: L.mx, y: y - 0.03, w: 1.1, h: 0.45,
        fontSize: F.size.caption, fontFace: F.sans, bold: true,
        color: C.accent, align: "center", valign: "middle", shrinkText: true
      });
      s.addText(st.text, {
        x: L.mx + 1.2, y, w: 7.3, h: 0.45,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textDark, valign: "middle", shrinkText: true
      });
    });

    // Result highlights
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.05, w: L.W - L.mx * 2, h: 0.55,
      fill: { color: C.accentLight }, rectRadius: 0.04
    });
    s.addText("✔ 市場規模・成長率  ✔ 主要プレイヤー比較  ✔ 調査レポートレベルの内容が数分で完成", {
      x: L.mx + 0.2, y: 4.05, w: L.W - L.mx * 2 - 0.4, h: 0.55,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", shrinkText: true
    });

    s.addText("★ 実演動画: 43秒", {
      x: L.W - 2.2, y: L.H - 0.75, w: 2.0, h: 0.28,
      fontSize: F.size.caption, fontFace: F.sans, bold: true,
      color: C.accent, align: "right", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 8: SPACES
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "Spaces: 自分専用ナレッジベース", "SPACES");
    addFooter(s, 8, T);

    // Definition box
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 1.0, w: L.W - L.mx * 2, h: 0.6,
      fill: { color: C.purpleBg }, rectRadius: 0.05
    });
    s.addText("ファイルやURLを登録 → 検索時に優先参照。チームでも共有可能。", {
      x: L.mx + 0.3, y: 1.0, w: L.W - L.mx * 2 - 0.6, h: 0.6,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.purple, valign: "middle", shrinkText: true
    });

    // 3 feature cards
    const features = [
      { ic: ic.upload,  label: "ファイル登録",   desc: "PDF・テキスト\nをアップロード" },
      { ic: ic.link,    label: "URL登録",        desc: "ウェブサイト・\nレポートを参照" },
      { ic: ic.users,   label: "チーム共有",      desc: "Spaceを共有し\n知識を蓄積" },
    ];

    const cardW = 2.5;
    const cardGap = 0.26;
    const totalW = cardW * 3 + cardGap * 2;
    const startX = (L.W - totalW) / 2;

    features.forEach((e, i) => {
      const x = startX + i * (cardW + cardGap);
      const y = 1.85;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 1.35,
        fill: { color: C.offWhite }, line: { color: C.border, width: 0.5 }, rectRadius: 0.05
      });
      s.addImage({ data: e.ic, x: x + (cardW - 0.32) / 2, y: y + 0.15, w: 0.32, h: 0.32 });
      s.addText(e.label, {
        x, y: y + 0.52, w: cardW, h: 0.3,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, align: "center", shrinkText: true
      });
      s.addText(e.desc, {
        x, y: y + 0.82, w: cardW, h: 0.4,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textLight, align: "center", shrinkText: true
      });
    });

    // Use case
    s.addImage({ data: ic.bulb, x: L.mx, y: 3.55, w: 0.22, h: 0.22 });
    s.addText("活用例: 社内マニュアルを登録 → 「このルールはどこ？」と聞けばすぐ回答", {
      x: L.mx + 0.32, y: 3.5, w: L.W - L.mx * 2 - 0.4, h: 0.38,
      fontSize: F.size.label, fontFace: F.sans, italic: true,
      color: C.textLight, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 9: PAGES
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "Pages: 調査結果をレポートで共有", "PAGES");
    addFooter(s, 9, T);

    // Definition box
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 1.0, w: L.W - L.mx * 2, h: 0.6,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    s.addText("調査結果を目次付きのレポート形式で自動生成し、公開URLで共有できる機能", {
      x: L.mx + 0.3, y: 1.0, w: L.W - L.mx * 2 - 0.6, h: 0.6,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", shrinkText: true
    });

    // Features
    const features = [
      { ic: ic.clipboard, label: "自動生成",   desc: "目次付き構造化\nレポートを即生成" },
      { ic: ic.pen,       label: "編集可能",   desc: "セクションごとに\nカスタマイズ" },
      { ic: ic.link,      label: "公開URL",    desc: "リンク共有で\n誰でも閲覧可能" },
    ];

    const cardW = 2.5;
    const cardGap = 0.26;
    const totalW = cardW * 3 + cardGap * 2;
    const startX = (L.W - totalW) / 2;

    features.forEach((e, i) => {
      const x = startX + i * (cardW + cardGap);
      const y = 1.85;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 1.35,
        fill: { color: C.offWhite }, line: { color: C.border, width: 0.5 }, rectRadius: 0.05
      });
      s.addImage({ data: e.ic, x: x + (cardW - 0.32) / 2, y: y + 0.15, w: 0.32, h: 0.32 });
      s.addText(e.label, {
        x, y: y + 0.52, w: cardW, h: 0.3,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, align: "center", shrinkText: true
      });
      s.addText(e.desc, {
        x, y: y + 0.82, w: cardW, h: 0.4,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textLight, align: "center", shrinkText: true
      });
    });

    // Use cases row
    const usecases = [
      "社内ナレッジ共有",
      "クライアントへの簡易レポート",
      "プレゼン資料の自動生成",
    ];
    usecases.forEach((uc, i) => {
      const x = L.mx + i * 3.0;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: 3.5, w: 2.8, h: 0.38,
        fill: { color: C.lightGray }, rectRadius: 0.04
      });
      s.addText("✔  " + uc, {
        x: x + 0.1, y: 3.5, w: 2.6, h: 0.38,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textBody, valign: "middle", shrinkText: true
      });
    });
  }

  // ============================================================
  // SLIDE 10: FILE UPLOAD
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "ファイルアップロード", "UPLOAD");
    addFooter(s, 10, T);

    const useCases = [
      { ic: ic.file,    label: "PDF",    desc: "業界レポート・\n社内文書の要約" },
      { ic: ic.chart,   label: "画像",   desc: "グラフ・図表の\nトレンド分析" },
    ];

    const cardW = 3.5;
    const cardGap = 1.0;
    const totalW = cardW * 2 + cardGap;
    const startX = (L.W - totalW) / 2;

    useCases.forEach((e, i) => {
      const x = startX + i * (cardW + cardGap);
      const y = 1.05;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 1.45,
        fill: { color: C.offWhite }, line: { color: C.border, width: 0.5 }, rectRadius: 0.05
      });
      s.addImage({ data: e.ic, x: x + (cardW - 0.35) / 2, y: y + 0.15, w: 0.35, h: 0.35 });
      s.addText(e.label, {
        x, y: y + 0.55, w: cardW, h: 0.35,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, align: "center", shrinkText: true
      });
      s.addText(e.desc, {
        x, y: y + 0.9, w: cardW, h: 0.42,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textLight, align: "center", shrinkText: true
      });
    });

    // Plan info
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 2.78, w: L.W - L.mx * 2, h: 0.65,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    s.addText("無料版: 1日3回まで  |  Pro版: 無制限", {
      x: L.mx + 0.3, y: 2.78, w: L.W - L.mx * 2 - 0.6, h: 0.65,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", shrinkText: true
    });

    // Warning box
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.62, w: L.W - L.mx * 2, h: 0.65,
      fill: { color: C.redBg }, rectRadius: 0.05
    });
    s.addText("⚠ 注意: 機密情報・個人情報のアップロードは社内のAI利用ルールを必ず確認してください", {
      x: L.mx + 0.2, y: 3.62, w: L.W - L.mx * 2 - 0.4, h: 0.65,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.red, valign: "middle", shrinkText: true
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
      { ic: ic.target,  text: "Focus機能（7種）で検索対象を絞り込み精度アップ" },
      { ic: ic.rocket,  text: "Pro Searchで段階的に深掘り（無料1日5回）" },
      { ic: ic.scope,   text: "Deep Researchで本格調査レポートを自動生成" },
      { ic: ic.db,      text: "Spacesで自分専用ナレッジベースを構築・チーム共有" },
      { ic: ic.link,    text: "Pagesで調査結果をレポートとして公開" },
    ];

    items.forEach((item, i) => {
      const y = 0.9 + i * 0.65;
      s.addImage({ data: item.ic, x: L.mx + 0.08, y: y + 0.09, w: 0.26, h: 0.26 });
      s.addText(item.text, {
        x: L.mx + 0.5, y, w: 7.5, h: 0.45,
        fontSize: F.size.h3, fontFace: F.sans,
        color: C.textDark, valign: "middle", shrinkText: true
      });
      if (i < items.length - 1) {
        s.addShape(pres.shapes.LINE, {
          x: L.mx, y: y + 0.52, w: L.W - L.mx * 2, h: 0,
          line: { color: C.border, width: 0.3 }
        });
      }
    });

    // Test info
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.42, w: L.W - L.mx * 2, h: 0.48,
      fill: { color: C.accentLight }, rectRadius: 0.04
    });
    s.addText("→ 確認テスト: 5問中4問正解（80%）で修了", {
      x: L.mx + 0.3, y: 4.42, w: L.W - L.mx * 2 - 0.6, h: 0.48,
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

    s.addText("P-03 修了", {
      x: 0.5, y: 1.4, w: 9, h: 0.85,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center", shrinkText: true
    });
    s.addShape(pres.shapes.LINE, {
      x: 3.2, y: 2.42, w: 3.6, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });
    s.addText("Perplexityの上級機能をマスターしました", {
      x: 0.5, y: 2.6, w: 9, h: 0.45,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", shrinkText: true
    });
    s.addText("Next: P-04 Google検索との使い分け", {
      x: 0.5, y: 3.55, w: 9, h: 0.38,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textMuted, align: "center", shrinkText: true
    });

    s.addText("P-03", {
      x: L.mx, y: L.H - 0.42, w: 2, h: 0.3,
      fontSize: F.size.caption, fontFace: F.sans,
      color: C.textMuted, align: "left", shrinkText: true
    });
    s.addText(`12 / ${T}`, {
      x: L.W - 1.5, y: L.H - 0.42, w: 1.2, h: 0.3,
      fontSize: F.size.caption, fontFace: F.sans,
      color: C.textMuted, align: "right", shrinkText: true
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
