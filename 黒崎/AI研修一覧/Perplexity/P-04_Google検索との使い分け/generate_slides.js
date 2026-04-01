const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const {
  FaSearch, FaMapMarkerAlt, FaShoppingCart, FaMap, FaImage,
  FaBullhorn, FaExclamationTriangle, FaUserCheck, FaBrain,
  FaLink, FaComments, FaPuzzlePiece, FaClock, FaStore,
  FaCheckCircle, FaArrowRight, FaChartBar, FaLightbulb,
  FaBolt, FaBalanceScale, FaClipboardList, FaRocket,
  FaRobot, FaUsers, FaLayerGroup, FaNewspaper
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
  google: "EA4335", googleBg: "FEE2E2",
  purple: "7C3AED", purpleBg: "EDE9FE"
};

const F = { sans: "Calibri", size: { hero: 40, h1: 24, h2: 20, h3: 16, body: 16, label: 13, caption: 11 } };
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
  slide.addText("P-04", {
    x: L.mx, y: L.H - 0.38, w: 2, h: 0.3,
    fontSize: F.size.caption, fontFace: F.sans,
    color: C.textMuted, align: "left", shrinkText: true
  });
}

function addTitle(slide, title, tag) {
  if (tag) {
    const tagW = tag.length * 0.12 + 0.4;
    slide.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.25, w: tagW, h: 0.28,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    slide.addText(tag, {
      x: L.mx, y: 0.25, w: tagW, h: 0.28,
      fontSize: F.size.caption, fontFace: F.sans, bold: true,
      color: C.accent, align: "center", valign: "middle", shrinkText: true
    });
  }
  slide.addText(title, {
    x: L.mx, y: tag ? 0.6 : 0.25, w: 8.5, h: 0.45,
    fontSize: F.size.h1, fontFace: F.sans, bold: true,
    color: C.textDark, shrinkText: true
  });
}

function addCard(slide, x, y, w, h, opts = {}) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h,
    fill: { color: opts.fill || C.white },
    line: { color: opts.borderColor || C.border, width: 0.5 },
    rectRadius: 0.08,
    shadow: { type: "outer", blur: 3, opacity: 0.08, offset: 1, color: "000000" }
  });
  if (opts.leftBorder) {
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 0.04, h,
      fill: { color: opts.leftBorder }, rectRadius: 0.02
    });
  }
}

const T = 12; // total slides

async function main() {
  pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "Gorilla Knowledge";
  pres.title = "P-04: Google検索との使い分け〜目的別検索ガイド";

  // Pre-render icons
  const ic = {
    search:    await icon(FaSearch, C.accent),
    map:       await icon(FaMapMarkerAlt, C.google),
    cart:      await icon(FaShoppingCart, C.green),
    mapIcon:   await icon(FaMap, C.accent),
    image:     await icon(FaImage, C.amber),
    ad:        await icon(FaBullhorn, C.amber),
    warn:      await icon(FaExclamationTriangle, C.amber),
    user:      await icon(FaUserCheck, C.red),
    brain:     await icon(FaBrain, C.accent),
    link:      await icon(FaLink, C.accent),
    chat:      await icon(FaComments, C.accent),
    puzzle:    await icon(FaPuzzlePiece, C.accent),
    clock:     await icon(FaClock, C.amber),
    store:     await icon(FaStore, C.amber),
    check:     await icon(FaCheckCircle, C.green),
    checkBlue: await icon(FaCheckCircle, C.accent),
    arrow:     await icon(FaArrowRight, C.accent),
    chart:     await icon(FaChartBar, C.accent),
    bulb:      await icon(FaLightbulb, C.amber),
    bolt:      await icon(FaBolt, C.amber),
    balance:   await icon(FaBalanceScale, C.accent),
    clipboard: await icon(FaClipboardList, C.accent),
    rocket:    await icon(FaRocket, C.green),
    robot:     await icon(FaRobot, C.purple),
    users:     await icon(FaUsers, C.accent),
    layer:     await icon(FaLayerGroup, C.accent),
    news:      await icon(FaNewspaper, C.amber),
  };

  // ============================================================
  // SLIDE 1: TITLE (Navy background)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };
    s.addImage({ data: ic.balance, x: (L.W - 0.6) / 2, y: 0.85, w: 0.6, h: 0.6 });
    s.addText("Google検索との使い分け", {
      x: 0.5, y: 1.6, w: 9, h: 0.75,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center", shrinkText: true
    });
    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 2.5, w: 3, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });
    s.addText("目的別検索ガイド", {
      x: 0.5, y: 2.65, w: 9, h: 0.45,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", shrinkText: true
    });
    s.addText("P-04 | 全社員向け | 12分 | 2026年4月版", {
      x: 0.5, y: 3.5, w: 9, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textMuted, align: "center", shrinkText: true
    });
    // Stats bar
    s.addShape(pres.shapes.RECTANGLE, {
      x: 1.5, y: 4.2, w: 7, h: 0.9,
      fill: { color: C.navyLight }, rectRadius: 0.08
    });
    s.addText("Perplexity 2026: 月間アクティブユーザー 4,500万人超 ／ 評価額 226億ドル ／ ARR 2億ドル", {
      x: 1.5, y: 4.2, w: 7, h: 0.9,
      fontSize: F.size.caption, fontFace: F.sans,
      color: C.accentMid, align: "center", valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 2: TODAY'S GOALS
  // ============================================================
  {
    const s = pres.addSlide();
    addTopBar(s);
    addTitle(s, "今日のゴール", "GOALS");
    addFooter(s, 2, T);

    const goals = [
      { t: "Google検索とPerplexityの得意・不得意を正しく理解している", ic: ic.check },
      { t: "業務目的に応じて適切な検索ツールを選択できる", ic: ic.chart },
      { t: "両者を組み合わせたハイブリッド検索ワークフローを実践できる", ic: ic.rocket },
    ];

    goals.forEach((g, i) => {
      const y = 1.2 + i * 1.1;
      s.addShape(pres.shapes.OVAL, {
        x: L.mx, y: y, w: 0.5, h: 0.5,
        fill: { color: C.accent }
      });
      s.addText(String(i + 1), {
        x: L.mx, y: y, w: 0.5, h: 0.5,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle"
      });
      s.addImage({ data: g.ic, x: L.mx + 0.65, y: y + 0.08, w: 0.32, h: 0.32 });
      s.addText(g.t, {
        x: L.mx + 1.1, y: y, w: 7.5, h: 0.5,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, valign: "middle", shrinkText: true
      });
    });
  }

  // ============================================================
  // SLIDE 3: GOOGLE STRENGTHS
  // ============================================================
  {
    const s = pres.addSlide();
    addTopBar(s);
    addTitle(s, "Google検索の強み", "GOOGLE");
    addFooter(s, 3, T);

    const items = [
      { ic: ic.bolt,    t: "即時性（秒単位）", d: "速報ニュース・災害情報・株価速報" },
      { ic: ic.map,     t: "ローカル検索",     d: "近くのお店、営業時間、口コミ、地図" },
      { ic: ic.cart,    t: "ショッピング",     d: "価格比較、在庫確認、購入リンク" },
      { ic: ic.mapIcon, t: "地図連携",         d: "Google Maps統合、ルート・所要時間" },
      { ic: ic.image,   t: "画像・動画検索",   d: "ビジュアル情報の網羅的検索" },
    ];

    items.forEach((item, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const x = L.mx + col * 2.9;
      const y = 1.1 + row * 1.8;
      const w = 2.7;
      const h = 1.55;
      addCard(s, x, y, w, h);
      s.addImage({ data: item.ic, x: x + 0.2, y: y + 0.2, w: 0.35, h: 0.35 });
      s.addText(item.t, {
        x: x + 0.65, y: y + 0.15, w: w - 0.85, h: 0.35,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, valign: "middle", shrinkText: true
      });
      s.addText(item.d, {
        x: x + 0.2, y: y + 0.65, w: w - 0.4, h: 0.75,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, shrinkText: true
      });
    });
  }

  // ============================================================
  // SLIDE 4: GOOGLE WEAKNESSES
  // ============================================================
  {
    const s = pres.addSlide();
    addTopBar(s);
    addTitle(s, "Google検索の弱み", "WEAKNESS");
    addFooter(s, 4, T);

    const items = [
      { ic: ic.ad,   t: "広告の多さ",         d: "商業キーワードで検索すると画面上部が広告で埋まり、本当の情報にたどり着きにくい" },
      { ic: ic.warn, t: "SEO汚染",             d: "検索上位=最高品質とは限らない。SEO対策に長けたサイトが上位を独占することがある" },
      { ic: ic.user, t: "取捨選択が自分頼み",  d: "リンク一覧が返るだけ。信頼性・最新性の判断はすべて自分任せ" },
      { ic: ic.robot,t: "AI Overview発展途上", d: "Geminiによる回答機能が展開中だが精度にばらつき。過信は禁物" },
    ];

    items.forEach((item, i) => {
      const y = 1.05 + i * 1.05;
      addCard(s, L.mx, y, L.W - L.mx * 2, 0.9, { leftBorder: C.amber });
      s.addImage({ data: item.ic, x: L.mx + 0.2, y: y + 0.2, w: 0.35, h: 0.35 });
      s.addText(item.t, {
        x: L.mx + 0.7, y: y + 0.08, w: 2.8, h: 0.32,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, valign: "middle", shrinkText: true
      });
      s.addText(item.d, {
        x: L.mx + 0.7, y: y + 0.45, w: L.W - L.mx * 2 - 0.9, h: 0.38,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textBody, shrinkText: true
      });
    });
  }

  // ============================================================
  // SLIDE 5: PERPLEXITY STRENGTHS
  // ============================================================
  {
    const s = pres.addSlide();
    addTopBar(s);
    addTitle(s, "Perplexityの強み（2026年最新）", "PERPLEXITY");
    addFooter(s, 5, T);

    const items = [
      { ic: ic.brain,  t: "出典付き要約",   d: "複数ソースを統合、情報源を明示" },
      { ic: ic.chat,   t: "対話型深掘り",   d: "フォローアップで文脈を引き継ぎ" },
      { ic: ic.search, t: "Pro Search",     d: "質問を分解して段階的に深掘り調査" },
      { ic: ic.chart,  t: "Deep Research",  d: "学術・市場レポートレベルの自動調査" },
      { ic: ic.layer,  t: "Spaces",         d: "自分専用ナレッジベース・チーム共有" },
      { ic: ic.users,  t: "4,500万ユーザー", d: "評価額226億ドル、ARR2億ドル（2026年）" },
    ];

    items.forEach((item, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const w = 2.7;
      const x = L.mx + col * (w + 0.2);
      const y = 1.05 + row * 1.65;
      addCard(s, x, y, w, 1.45, { leftBorder: C.accent });
      s.addImage({ data: item.ic, x: x + 0.2, y: y + 0.18, w: 0.3, h: 0.3 });
      s.addText(item.t, {
        x: x + 0.6, y: y + 0.12, w: w - 0.8, h: 0.32,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, valign: "middle", shrinkText: true
      });
      s.addText(item.d, {
        x: x + 0.2, y: y + 0.6, w: w - 0.4, h: 0.7,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textBody, shrinkText: true
      });
    });
  }

  // ============================================================
  // SLIDE 6: PERPLEXITY WEAKNESSES
  // ============================================================
  {
    const s = pres.addSlide();
    addTopBar(s);
    addTitle(s, "Perplexityの弱み（2026年現在もGoogle優位）", "WEAKNESS");
    addFooter(s, 6, T);

    const items = [
      { ic: ic.clock, t: "リアルタイム速報（秒単位）", d: "災害情報・株価速報など秒単位の鮮度ではGoogleに及ばない" },
      { ic: ic.store, t: "ローカル情報",               d: "「今いる場所の近くの店」はGoogleマップ統合のGoogleが圧倒的に使いやすい" },
      { ic: ic.cart,  t: "EC・ショッピング検索",       d: "価格比較・在庫確認・購入導線はなく、ショッピングには不向き" },
    ];

    items.forEach((item, i) => {
      const y = 1.1 + i * 1.35;
      addCard(s, L.mx, y, L.W - L.mx * 2, 1.15, { leftBorder: C.amber });
      s.addImage({ data: item.ic, x: L.mx + 0.25, y: y + 0.25, w: 0.4, h: 0.4 });
      s.addText(item.t, {
        x: L.mx + 0.85, y: y + 0.1, w: 3.5, h: 0.35,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, valign: "middle", shrinkText: true
      });
      s.addText(item.d, {
        x: L.mx + 0.85, y: y + 0.55, w: L.W - L.mx * 2 - 1.1, h: 0.5,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, shrinkText: true
      });
    });
  }

  // ============================================================
  // SLIDE 7: COMPARISON TABLE
  // ============================================================
  {
    const s = pres.addSlide();
    addTopBar(s);
    addTitle(s, "目的別ツール選択ガイド（一覧）", "COMPARE");
    addFooter(s, 7, T);

    const tableData = [
      ["目的", "Google", "Perplexity", "判断基準"],
      ["ニュース速報（秒単位）", "◎", "○", "1分1秒を争う情報はGoogle"],
      ["近くのお店・地図",      "◎", "△", "位置情報+地図+写真"],
      ["価格比較・購入",        "◎", "△", "ECサイト連携が必要"],
      ["画像検索",              "◎", "△", "ビジュアル情報"],
      ["概念の理解・調査",      "△", "◎", "要約+対話で深掘り"],
      ["競合・市場調査",        "○", "◎", "複数ソース統合（Pro Search）"],
      ["技術比較・メリデメ",    "△", "◎", "分析・構造化が得意"],
      ["要約・分析レポート",    "△", "◎", "Deep Researchで自動生成"],
    ];

    const colW = [2.2, 1.25, 1.25, 3.5];
    const tableX = L.mx;

    tableData.forEach((row, ri) => {
      const y = 1.0 + ri * 0.48;
      const isHeader = ri === 0;
      let xOffset = tableX;

      row.forEach((cell, ci) => {
        s.addShape(pres.shapes.RECTANGLE, {
          x: xOffset, y, w: colW[ci], h: 0.45,
          fill: { color: isHeader ? C.lightGray : (ri % 2 === 0 ? C.offWhite : C.white) },
          line: { color: C.border, width: 0.3 }
        });
        const isGoodGoogle = !isHeader && ci === 1 && cell === "◎";
        const isGoodPerp   = !isHeader && ci === 2 && cell === "◎";
        s.addText(cell, {
          x: xOffset, y, w: colW[ci], h: 0.45,
          fontSize: isHeader ? F.size.caption : F.size.label,
          fontFace: F.sans,
          bold: isHeader || ci === 0 || isGoodGoogle || isGoodPerp,
          color: isGoodPerp ? C.accent : (isGoodGoogle ? C.google : (isHeader ? C.textDark : C.textBody)),
          align: ci <= 2 ? "center" : "left",
          valign: "middle", shrinkText: true
        });
        xOffset += colW[ci];
      });
    });
  }

  // ============================================================
  // SLIDE 8: CASE STUDY 1 - COMPETITIVE RESEARCH
  // ============================================================
  {
    const s = pres.addSlide();
    addTopBar(s);
    addTitle(s, "ケース① 競合調査・市場調査 — Perplexity向き", "CASE STUDY");
    addFooter(s, 8, T);

    s.addText("「競合A社の最新AI戦略を30分でまとめて」と依頼された", {
      x: L.mx, y: 1.05, w: L.W - L.mx * 2, h: 0.38,
      fontSize: F.size.body, fontFace: F.sans, italic: true,
      color: C.textLight, shrinkText: true
    });

    // Google card
    const gx = L.mx, gy = 1.6, gw = 4.0, gh = 2.65;
    addCard(s, gx, gy, gw, gh, { leftBorder: C.google });
    s.addImage({ data: ic.search, x: gx + 0.2, y: gy + 0.18, w: 0.3, h: 0.3 });
    s.addText("Google検索の場合", {
      x: gx + 0.6, y: gy + 0.14, w: gw - 0.8, h: 0.32,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.textDark, shrinkText: true
    });
    s.addText("検索 → 記事10件を開く → 読む → メモ → 自分で要約", {
      x: gx + 0.2, y: gy + 0.6, w: gw - 0.4, h: 0.8,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textBody, shrinkText: true
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: gx + 0.2, y: gy + 1.85, w: 1.5, h: 0.38,
      fill: { color: C.redBg }, rectRadius: 0.05
    });
    s.addText("約40分", {
      x: gx + 0.2, y: gy + 1.85, w: 1.5, h: 0.38,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.red, align: "center", valign: "middle"
    });

    // Perplexity card
    const px = L.mx + gw + 0.4, py = 1.6, pw = 4.0, ph = 2.65;
    addCard(s, px, py, pw, ph, { leftBorder: C.accent });
    s.addImage({ data: ic.brain, x: px + 0.2, y: py + 0.18, w: 0.3, h: 0.3 });
    s.addText("Perplexity Pro Searchの場合", {
      x: px + 0.6, y: py + 0.14, w: pw - 0.8, h: 0.32,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.textDark, shrinkText: true
    });
    s.addText("Pro Searchで質問 → 出典付き要約 → 深掘り質問 → 完成", {
      x: px + 0.2, y: py + 0.6, w: pw - 0.4, h: 0.8,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textBody, shrinkText: true
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: px + 0.2, y: py + 1.85, w: 1.5, h: 0.38,
      fill: { color: C.greenBg }, rectRadius: 0.05
    });
    s.addText("約10分", {
      x: px + 0.2, y: py + 1.85, w: 1.5, h: 0.38,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.green, align: "center", valign: "middle"
    });
  }

  // ============================================================
  // SLIDE 9: CASE STUDY 2 - LOCAL / REALTIME
  // ============================================================
  {
    const s = pres.addSlide();
    addTopBar(s);
    addTitle(s, "ケース② 近くのランチ・今日の速報 — Google向き", "CASE STUDY");
    addFooter(s, 9, T);

    s.addText("「会社から徒歩5分・個室ありの和食店」や「今日の為替速報」を探す", {
      x: L.mx, y: 1.05, w: L.W - L.mx * 2, h: 0.38,
      fontSize: F.size.body, fontFace: F.sans, italic: true,
      color: C.textLight, shrinkText: true
    });

    // Google card (winner)
    const gx = L.mx, gy = 1.6, gw = 4.0, gh = 2.65;
    addCard(s, gx, gy, gw, gh, { leftBorder: C.green });
    s.addImage({ data: ic.search, x: gx + 0.2, y: gy + 0.18, w: 0.3, h: 0.3 });
    s.addText("Google検索の場合", {
      x: gx + 0.6, y: gy + 0.14, w: gw - 0.8, h: 0.32,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.textDark, shrinkText: true
    });
    s.addText("検索 → 地図+写真+口コミ+予約リンク → 候補3件が2分で揃う", {
      x: gx + 0.2, y: gy + 0.6, w: gw - 0.4, h: 0.85,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textBody, shrinkText: true
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: gx + 0.2, y: gy + 1.85, w: 1.5, h: 0.38,
      fill: { color: C.greenBg }, rectRadius: 0.05
    });
    s.addText("約2分", {
      x: gx + 0.2, y: gy + 1.85, w: 1.5, h: 0.38,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.green, align: "center", valign: "middle"
    });

    // Perplexity card (weak)
    const px = L.mx + gw + 0.4, py = 1.6, pw = 4.0, ph = 2.65;
    addCard(s, px, py, pw, ph, { leftBorder: C.amber });
    s.addImage({ data: ic.brain, x: px + 0.2, y: py + 0.18, w: 0.3, h: 0.3 });
    s.addText("Perplexityの場合", {
      x: px + 0.6, y: py + 0.14, w: pw - 0.8, h: 0.32,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.textDark, shrinkText: true
    });
    s.addText("テキスト回答のみ。地図なし、写真なし、位置関係も不明", {
      x: px + 0.2, y: py + 0.6, w: pw - 0.4, h: 0.85,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textBody, shrinkText: true
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: px + 0.2, y: py + 1.85, w: 1.5, h: 0.38,
      fill: { color: C.amberBg }, rectRadius: 0.05
    });
    s.addText("不便", {
      x: px + 0.2, y: py + 1.85, w: 1.5, h: 0.38,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.amber, align: "center", valign: "middle"
    });
  }

  // ============================================================
  // SLIDE 10: HYBRID WORKFLOW
  // ============================================================
  {
    const s = pres.addSlide();
    addTopBar(s);
    addTitle(s, "ハイブリッド検索ワークフロー", "WORKFLOW");
    addFooter(s, 10, T);

    const steps = [
      { n: "Step 1", t: "Perplexityで\n概要把握",   c: C.accent },
      { n: "Step 2", t: "出典リンクで\n信頼性確認", c: C.green },
      { n: "Step 3", t: "Googleで\n詳細深掘り",     c: C.amber },
      { n: "Step 4", t: "Perplexityで\n再整理",     c: C.purple },
    ];

    steps.forEach((step, i) => {
      const x = L.mx + i * 2.25;
      const y = 1.15;
      const w = 2.0;
      const h = 1.7;

      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w, h,
        fill: { color: C.white },
        line: { color: step.c, width: 1.5 },
        rectRadius: 0.08
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x: x + 0.15, y: y + 0.15, w: 0.9, h: 0.28,
        fill: { color: step.c }, rectRadius: 0.05
      });
      s.addText(step.n, {
        x: x + 0.15, y: y + 0.15, w: 0.9, h: 0.28,
        fontSize: F.size.caption, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle"
      });
      s.addText(step.t, {
        x: x + 0.1, y: y + 0.55, w: w - 0.2, h: 0.95,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.textDark, align: "center", valign: "middle", shrinkText: true
      });

      if (i < 3) {
        s.addText("→", {
          x: x + w, y: y + 0.5, w: 0.25, h: 0.5,
          fontSize: F.size.h2, fontFace: F.sans,
          color: C.textMuted, align: "center", valign: "middle"
        });
      }
    });

    // Bottom cards
    const cy = 3.2;
    addCard(s, L.mx, cy, 4.05, 1.2);
    s.addImage({ data: ic.bulb, x: L.mx + 0.2, y: cy + 0.15, w: 0.3, h: 0.3 });
    s.addText("なぜこの順番？", {
      x: L.mx + 0.6, y: cy + 0.1, w: 3.2, h: 0.3,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.textDark, shrinkText: true
    });
    s.addText("全体像を先につかむことで、詳細の位置づけを理解しやすく、無駄な検索が減る", {
      x: L.mx + 0.2, y: cy + 0.5, w: 3.65, h: 0.6,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textBody, shrinkText: true
    });

    addCard(s, L.mx + 4.45, cy, 4.05, 1.2);
    s.addImage({ data: ic.rocket, x: L.mx + 4.65, y: cy + 0.15, w: 0.3, h: 0.3 });
    s.addText("効果", {
      x: L.mx + 5.05, y: cy + 0.1, w: 3.2, h: 0.3,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.textDark, shrinkText: true
    });
    s.addText("情報収集の速度と精度が飛躍的に向上。複雑な調査でも迷子にならない", {
      x: L.mx + 4.65, y: cy + 0.5, w: 3.65, h: 0.6,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textBody, shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 11: SUMMARY
  // ============================================================
  {
    const s = pres.addSlide();
    addTopBar(s);
    addTitle(s, "まとめ", "SUMMARY");
    addFooter(s, 11, T);

    const points = [
      "Googleの強み: 速報・ローカル・ショッピング\nPerplexityの強み: 出典付き要約・Pro Search・Deep Research・Spaces",
      "「答えが1つに決まるもの」→ Google\n「複数の情報を統合して理解を深めたいもの」→ Perplexity",
      "ハイブリッド検索が最強\nPerplexityで概要 → Googleで深掘り → Perplexityで再整理"
    ];

    points.forEach((p, i) => {
      const y = 1.1 + i * 1.2;
      s.addShape(pres.shapes.OVAL, {
        x: L.mx, y: y + 0.15, w: 0.45, h: 0.45,
        fill: { color: C.accent }
      });
      s.addText(String(i + 1), {
        x: L.mx, y: y + 0.15, w: 0.45, h: 0.45,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle"
      });
      s.addText(p, {
        x: L.mx + 0.65, y: y, w: L.W - L.mx * 2 - 0.85, h: 0.95,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, valign: "middle", shrinkText: true
      });
    });

    // Test info
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.6, w: L.W - L.mx * 2, h: 0.5,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    s.addImage({ data: ic.checkBlue, x: L.mx + 0.2, y: 4.7, w: 0.25, h: 0.25 });
    s.addText("確認テスト: 5問中4問正解（80%）で修了", {
      x: L.mx + 0.55, y: 4.6, w: L.W - L.mx * 2 - 0.75, h: 0.5,
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
    s.addImage({ data: ic.check, x: (L.W - 0.6) / 2, y: 1.1, w: 0.6, h: 0.6 });
    s.addText("P-04 修了", {
      x: 0.5, y: 1.85, w: 9, h: 0.7,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center", shrinkText: true
    });
    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 2.7, w: 3, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });
    s.addText("お疲れさまでした！", {
      x: 0.5, y: 2.9, w: 9, h: 0.45,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", shrinkText: true
    });
    s.addText("次回: P-05 業務でPerplexityを活用する", {
      x: 0.5, y: 3.7, w: 9, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textMuted, align: "center", shrinkText: true
    });
    // Next lesson tease
    s.addShape(pres.shapes.RECTANGLE, {
      x: 2.5, y: 4.3, w: 5, h: 0.75,
      fill: { color: C.navyLight }, rectRadius: 0.08
    });
    s.addText("議事録要約 ／ 競合分析レポート ／ 社内FAQ対応", {
      x: 2.5, y: 4.3, w: 5, h: 0.75,
      fontSize: F.size.caption, fontFace: F.sans,
      color: C.accentMid, align: "center", valign: "middle", shrinkText: true
    });
  }

  // Write file
  const outPath = __dirname + "/スライド.pptx";
  await pres.writeFile({ fileName: outPath });
  console.log("Generated:", outPath);
}

main().catch(err => { console.error(err); process.exit(1); });
