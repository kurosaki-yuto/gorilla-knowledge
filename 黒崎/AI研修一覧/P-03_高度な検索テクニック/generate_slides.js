const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const {
  FaSearch, FaBullseye, FaGraduationCap, FaYoutube, FaReddit, FaWikipediaW,
  FaPen, FaRocket, FaFolder, FaFileUpload, FaFileAlt, FaCheckCircle,
  FaArrowRight, FaGlobe, FaLightbulb, FaChevronRight, FaShareAlt,
  FaClipboardList, FaChartBar, FaBookOpen, FaLayerGroup, FaLink
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
  slide.addText("P-03", {
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
  pres.title = "P-03: 高度な検索テクニック -- Perplexityを使いこなす";

  // Pre-render icons
  const ic = {
    search: await icon(FaSearch, C.accent),
    target: await icon(FaBullseye, C.accent),
    grad: await icon(FaGraduationCap, C.accent),
    youtube: await icon(FaYoutube, C.red),
    reddit: await icon(FaReddit, C.amber),
    wiki: await icon(FaWikipediaW, C.textBody),
    pen: await icon(FaPen, C.green),
    rocket: await icon(FaRocket, C.accent),
    folder: await icon(FaFolder, C.amber),
    upload: await icon(FaFileUpload, C.green),
    file: await icon(FaFileAlt, C.accent),
    check: await icon(FaCheckCircle, C.green),
    checkBlue: await icon(FaCheckCircle, C.accent),
    arrow: await icon(FaArrowRight, C.accent),
    globe: await icon(FaGlobe, C.accent),
    bulb: await icon(FaLightbulb, C.amber),
    chevron: await icon(FaChevronRight, C.textMuted),
    share: await icon(FaShareAlt, C.accent),
    clipboard: await icon(FaClipboardList, C.accent),
    chart: await icon(FaChartBar, C.green),
    book: await icon(FaBookOpen, C.accent),
    layer: await icon(FaLayerGroup, C.accent),
    link: await icon(FaLink, C.accent),
  };

  // ============================================================
  // SLIDE 1: TITLE (Navy background)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };
    s.addImage({ data: ic.search, x: (L.W - 0.6) / 2, y: 1.0, w: 0.6, h: 0.6 });
    s.addText("高度な検索テクニック", {
      x: 0.5, y: 1.8, w: 9, h: 0.8,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center", shrinkText: true
    });
    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 2.75, w: 3, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });
    s.addText("Perplexityを使いこなす", {
      x: 0.5, y: 2.95, w: 9, h: 0.45,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", shrinkText: true
    });
    s.addText("P-03  |  全社員向け実践  |  12分", {
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
      "フォーカス機能を目的に応じて使い分けられる",
      "Pro Searchで複雑な調査を効率的に行える",
      "コレクション機能で検索結果を整理・共有できる",
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
  // SLIDE 3: FOCUS OVERVIEW
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "フォーカス機能とは？", "FOCUS");
    addFooter(s, 3, T);

    // Definition box
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.85, w: L.W - L.mx * 2, h: 0.7,
      fill: { color: C.accentLight }
    });
    s.addText("検索対象を特定のソースに絞り込み、回答の精度を上げる機能", {
      x: L.mx + 0.3, y: 0.85, w: L.W - L.mx * 2 - 0.6, h: 0.7,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", shrinkText: true
    });

    // 3 benefit cards
    const benefits = [
      { ic: ic.target, label: "ノイズ削減", desc: "不要な情報源を排除" },
      { ic: ic.check, label: "精度向上", desc: "目的に合ったソースのみ" },
      { ic: ic.rocket, label: "時間短縮", desc: "最短で必要な情報へ" },
    ];

    const cardW = 2.5;
    const cardGap = 0.25;
    const totalW = cardW * 3 + cardGap * 2;
    const startX = (L.W - totalW) / 2;

    benefits.forEach((e, i) => {
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

    s.addImage({ data: ic.bulb, x: L.mx, y: 3.6, w: 0.22, h: 0.22 });
    s.addText("検索バーの下にあるドロップダウンから選択するだけ", {
      x: L.mx + 0.3, y: 3.55, w: L.W - L.mx * 2 - 0.35, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans, italic: true,
      color: C.textLight, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 4: FOCUS TYPES
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "フォーカスの種類と使い分け");
    addFooter(s, 4, T);

    const types = [
      { ic: ic.globe, label: "All", desc: "Web全体を横断\n（デフォルト）", color: C.accent },
      { ic: ic.grad, label: "Academic", desc: "学術論文\n研究データ", color: C.green },
      { ic: ic.pen, label: "Writing", desc: "文章生成\n（Web検索なし）", color: C.amber },
      { ic: ic.search, label: "YouTube", desc: "動画コンテンツ\nから情報取得", color: C.red },
      { ic: ic.folder, label: "Reddit", desc: "コミュニティ\n生の声・レビュー", color: C.amber },
      { ic: ic.book, label: "Wikipedia", desc: "百科事典的\n基礎知識", color: C.textBody },
    ];

    const cols = 3;
    const rows = 2;
    const cW = 2.5;
    const cH = 1.2;
    const gapX = 0.3;
    const gapY = 0.25;
    const totalW = cW * cols + gapX * (cols - 1);
    const sx = (L.W - totalW) / 2;

    types.forEach((t, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = sx + col * (cW + gapX);
      const y = 1.0 + row * (cH + gapY);

      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cW, h: cH,
        fill: { color: C.offWhite }, line: { color: C.border, width: 0.5 }
      });
      s.addImage({ data: t.ic, x: x + 0.15, y: y + (cH - 0.3) / 2, w: 0.3, h: 0.3 });
      s.addText(t.label, {
        x: x + 0.55, y: y + 0.1, w: cW - 0.7, h: 0.35,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, shrinkText: true
      });
      s.addText(t.desc, {
        x: x + 0.55, y: y + 0.45, w: cW - 0.7, h: 0.6,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textLight, shrinkText: true
      });
    });

    s.addImage({ data: ic.bulb, x: L.mx, y: 3.8, w: 0.22, h: 0.22 });
    s.addText("迷ったらAllで始めて、必要に応じて切り替え", {
      x: L.mx + 0.3, y: 3.75, w: L.W - L.mx * 2 - 0.35, h: 0.35,
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
    addTitle(s, "実演ポイント: Academic検索で論文を探す", "DEMO");
    addFooter(s, 5, T);

    const steps = [
      { num: "1", text: "フォーカスを「Academic」に切り替え" },
      { num: "2", text: "質問: 「リモートワークが生産性に与える影響」" },
      { num: "3", text: "結果: 論文タイトル・著者・出版年が表示" },
    ];

    steps.forEach((st, i) => {
      const y = 0.95 + i * 0.85;
      s.addText(st.num, {
        x: L.mx, y: y + 0.05, w: 0.45, h: 0.45,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: C.accent }, shape: pres.shapes.OVAL, shrinkText: true
      });
      s.addText(st.text, {
        x: L.mx + 0.6, y, w: 7.5, h: 0.55,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textDark, valign: "middle", shrinkText: true
      });
    });

    // Key point box
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.6, w: L.W - L.mx * 2, h: 0.7,
      fill: { color: C.greenBg }
    });
    s.addImage({ data: ic.check, x: L.mx + 0.2, y: 3.75, w: 0.25, h: 0.25 });
    s.addText("ソースが学術論文に限定 → 信頼性の高い回答が得られる", {
      x: L.mx + 0.55, y: 3.6, w: L.W - L.mx * 2 - 0.7, h: 0.7,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.green, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 6: PRO SEARCH
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "Pro Searchとは？", "PRO SEARCH");
    addFooter(s, 6, T);

    // Definition box
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.85, w: L.W - L.mx * 2, h: 0.6,
      fill: { color: C.accentLight }
    });
    s.addText("段階的に深掘りする高度な検索モード", {
      x: L.mx + 0.3, y: 0.85, w: L.W - L.mx * 2 - 0.6, h: 0.6,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", shrinkText: true
    });

    // Flow
    const flowSteps = ["質問を分解", "複数回検索", "結果を統合", "包括的な回答"];
    const fW = 1.8;
    const fGap = 0.15;
    const arrowW = 0.25;
    const fTotalW = fW * 4 + fGap * 3 + arrowW * 3;
    const fStartX = (L.W - fTotalW) / 2;

    flowSteps.forEach((step, i) => {
      const x = fStartX + i * (fW + fGap + arrowW);
      const y = 1.85;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: fW, h: 0.55,
        fill: { color: i === 3 ? C.accent : C.offWhite },
        line: { color: i === 3 ? C.accent : C.border, width: 0.5 },
        rectRadius: 0.05
      });
      s.addText(step, {
        x, y, w: fW, h: 0.55,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: i === 3 ? C.white : C.textDark,
        align: "center", valign: "middle", shrinkText: true
      });
      if (i < 3) {
        s.addText("\u2192", {
          x: x + fW, y, w: arrowW + fGap, h: 0.55,
          fontSize: F.size.h3, fontFace: F.sans,
          color: C.textMuted, align: "center", valign: "middle"
        });
      }
    });

    // Comparison
    s.addText("通常検索 vs Pro Search", {
      x: L.mx, y: 2.8, w: 4, h: 0.35,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.textDark, shrinkText: true
    });

    const compData = [
      ["", "通常検索", "Pro Search"],
      ["検索回数", "1回", "複数回（自動）"],
      ["回答の深さ", "概要レベル", "詳細レポート"],
      ["向いている用途", "簡単な質問", "複雑な調査"],
    ];

    compData.forEach((row, ri) => {
      row.forEach((cell, ci) => {
        const x = L.mx + ci * 2.8;
        const y = 3.2 + ri * 0.4;
        const isHeader = ri === 0;
        s.addText(cell, {
          x, y, w: 2.7, h: 0.38,
          fontSize: isHeader ? F.size.label : F.size.label,
          fontFace: F.sans,
          bold: isHeader || ci === 0,
          color: isHeader ? C.accent : (ci === 0 ? C.textDark : C.textBody),
          fill: { color: isHeader ? C.accentLight : (ri % 2 === 0 ? C.lightGray : C.white) },
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
    addTitle(s, "実演ポイント: Pro Searchで市場調査", "DEMO");
    addFooter(s, 7, T);

    const steps = [
      { num: "1", text: "Pro Searchをオンにする" },
      { num: "2", text: "質問: 「日本の法人向けSaaS市場の規模と成長予測」" },
      { num: "3", text: "経過: 段階的に進捗を表示" },
      { num: "4", text: "結果: 数値データ・出典付きの詳細レポート" },
    ];

    steps.forEach((st, i) => {
      const y = 0.95 + i * 0.75;
      s.addText(st.num, {
        x: L.mx, y: y + 0.05, w: 0.4, h: 0.4,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: C.accent }, shape: pres.shapes.OVAL, shrinkText: true
      });
      s.addText(st.text, {
        x: L.mx + 0.55, y, w: 7.5, h: 0.5,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textDark, valign: "middle", shrinkText: true
      });
    });

    // Progress display mockup
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.0, w: L.W - L.mx * 2, h: 0.6,
      fill: { color: C.accentLight }
    });
    s.addText("\u2714 市場規模  \u2714 主要プレイヤー  \u2714 成長率  \u2714 トレンド", {
      x: L.mx + 0.3, y: 4.0, w: L.W - L.mx * 2 - 0.6, h: 0.6,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 8: COLLECTIONS
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "コレクション機能", "ORGANIZE");
    addFooter(s, 8, T);

    // Definition
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.85, w: L.W - L.mx * 2, h: 0.6,
      fill: { color: C.amberBg }
    });
    s.addText("検索スレッドをフォルダ的に整理して保存・共有できる機能", {
      x: L.mx + 0.3, y: 0.85, w: L.W - L.mx * 2 - 0.6, h: 0.6,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.amber, valign: "middle", shrinkText: true
    });

    // 3 feature cards
    const features = [
      { ic: ic.layer, label: "テーマ別整理", desc: "スレッドをコレクションにまとめる" },
      { ic: ic.share, label: "共有", desc: "URLでチームメンバーと共有" },
      { ic: ic.clipboard, label: "ナレッジ蓄積", desc: "後から見返し・追加調査" },
    ];

    const cardW = 2.5;
    const cardGap = 0.25;
    const totalW = cardW * 3 + cardGap * 2;
    const startX = (L.W - totalW) / 2;

    features.forEach((e, i) => {
      const x = startX + i * (cardW + cardGap);
      const y = 1.75;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 1.3,
        fill: { color: C.offWhite }, line: { color: C.border, width: 0.5 }
      });
      s.addImage({ data: e.ic, x: x + (cardW - 0.3) / 2, y: y + 0.1, w: 0.3, h: 0.3 });
      s.addText(e.label, {
        x, y: y + 0.45, w: cardW, h: 0.3,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, align: "center", shrinkText: true
      });
      s.addText(e.desc, {
        x, y: y + 0.75, w: cardW, h: 0.4,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textLight, align: "center", shrinkText: true
      });
    });

    // Example collections
    s.addText("活用例: 「競合調査」「技術トレンド」「営業資料ネタ」など、プロジェクト別に作成", {
      x: L.mx, y: 3.5, w: L.W - L.mx * 2, h: 0.4,
      fontSize: F.size.label, fontFace: F.sans, italic: true,
      color: C.textLight, shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 9: FILE UPLOAD
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "ファイルアップロード", "UPLOAD");
    addFooter(s, 9, T);

    const useCases = [
      { ic: ic.file, label: "PDF", desc: "レポートの要約\n要点を抽出" },
      { ic: ic.search, label: "画像", desc: "グラフ・図表の\n分析" },
      { ic: ic.chart, label: "CSV", desc: "データの\n傾向分析" },
    ];

    const cardW = 2.5;
    const cardGap = 0.25;
    const totalW = cardW * 3 + cardGap * 2;
    const startX = (L.W - totalW) / 2;

    useCases.forEach((e, i) => {
      const x = startX + i * (cardW + cardGap);
      const y = 1.0;
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
        x, y: y + 0.85, w: cardW, h: 0.4,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textLight, align: "center", shrinkText: true
      });
    });

    // Warning box
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 2.8, w: L.W - L.mx * 2, h: 0.7,
      fill: { color: C.redBg }
    });
    s.addText("\u26A0 注意: 機密情報・個人情報のアップロードは社内ルールを確認してください", {
      x: L.mx + 0.3, y: 2.8, w: L.W - L.mx * 2 - 0.6, h: 0.7,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.red, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 10: PERPLEXITY PAGES
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "Perplexity Pages", "PAGES");
    addFooter(s, 10, T);

    // Definition
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.85, w: L.W - L.mx * 2, h: 0.6,
      fill: { color: C.accentLight }
    });
    s.addText("調査結果をレポート形式で公開・共有できる機能", {
      x: L.mx + 0.3, y: 0.85, w: L.W - L.mx * 2 - 0.6, h: 0.6,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", shrinkText: true
    });

    // Features
    const features = [
      { ic: ic.clipboard, label: "自動生成", desc: "目次付き構造化レポート" },
      { ic: ic.link, label: "公開URL", desc: "リンク共有で誰でも閲覧" },
      { ic: ic.pen, label: "編集可能", desc: "セクションごとにカスタマイズ" },
    ];

    const cardW = 2.5;
    const cardGap = 0.25;
    const totalW = cardW * 3 + cardGap * 2;
    const startX = (L.W - totalW) / 2;

    features.forEach((e, i) => {
      const x = startX + i * (cardW + cardGap);
      const y = 1.75;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 1.3,
        fill: { color: C.offWhite }, line: { color: C.border, width: 0.5 }
      });
      s.addImage({ data: e.ic, x: x + (cardW - 0.3) / 2, y: y + 0.1, w: 0.3, h: 0.3 });
      s.addText(e.label, {
        x, y: y + 0.45, w: cardW, h: 0.3,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, align: "center", shrinkText: true
      });
      s.addText(e.desc, {
        x, y: y + 0.75, w: cardW, h: 0.4,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textLight, align: "center", shrinkText: true
      });
    });

    s.addImage({ data: ic.bulb, x: L.mx, y: 3.5, w: 0.22, h: 0.22 });
    s.addText("活用例: 「AIツール比較レポート」を作成 → 社内共有", {
      x: L.mx + 0.3, y: 3.45, w: L.W - L.mx * 2 - 0.35, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans, italic: true,
      color: C.textLight, valign: "middle", shrinkText: true
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
      { ic: ic.target, text: "フォーカス機能 = 検索ソースを目的別に絞り込む" },
      { ic: ic.rocket, text: "Pro Search = 段階的に深掘り → 包括的な回答" },
      { ic: ic.folder, text: "コレクション = 検索結果をテーマ別に整理・共有" },
      { ic: ic.upload, text: "ファイルアップロード = PDF・画像をAIに分析させる" },
      { ic: ic.link, text: "Pages = 調査結果をレポートとして公開" },
    ];

    items.forEach((item, i) => {
      const y = 0.85 + i * 0.7;
      s.addImage({ data: item.ic, x: L.mx + 0.1, y: y + 0.08, w: 0.25, h: 0.25 });
      s.addText(item.text, {
        x: L.mx + 0.5, y, w: 7.5, h: 0.45,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textDark, valign: "middle", shrinkText: true
      });
      if (i < items.length - 1) {
        s.addShape(pres.shapes.LINE, {
          x: L.mx, y: y + 0.55, w: L.W - L.mx * 2, h: 0,
          line: { color: C.border, width: 0.3 }
        });
      }
    });

    // Test info
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.4, w: L.W - L.mx * 2, h: 0.5,
      fill: { color: C.accentLight }
    });
    s.addText("\u2192 確認テスト: 5問中4問正解（80%）で修了", {
      x: L.mx + 0.3, y: 4.4, w: L.W - L.mx * 2 - 0.6, h: 0.5,
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
      x: 0.5, y: 1.5, w: 9, h: 0.8,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center", shrinkText: true
    });
    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 2.5, w: 3, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });
    s.addText("Perplexityの上級機能をマスターしよう", {
      x: 0.5, y: 2.7, w: 9, h: 0.45,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", shrinkText: true
    });
    s.addText("Next: P-04 Google検索との使い分け", {
      x: 0.5, y: 3.6, w: 9, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textMuted, align: "center", shrinkText: true
    });
  }

  // ============================================================
  // SAVE
  // ============================================================
  const outDir = __dirname;
  const outPath = `${outDir}/スライド.pptx`;
  await pres.writeFile({ fileName: outPath });
  console.log(`Saved: ${outPath}`);
}

main().catch(e => { console.error(e); process.exit(1); });
