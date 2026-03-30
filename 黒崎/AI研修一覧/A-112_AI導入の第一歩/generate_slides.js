const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const {
  FaRocket, FaEnvelope, FaClipboardList, FaSearch, FaUsers,
  FaStar, FaShareAlt, FaExclamationTriangle, FaBookOpen, FaMap,
  FaBullseye, FaCheckCircle, FaArrowRight, FaLightbulb, FaTrophy,
  FaChartLine, FaCopy, FaComments, FaGraduationCap, FaHandshake
} = require("react-icons/fa");

// =====================================================
// DESIGN SYSTEM (navy:1B2A4A, accent:2563EB, Calibri, 10x5.625)
// =====================================================
const C = {
  white: "FFFFFF",
  offWhite: "FAFBFC",
  lightGray: "F3F4F6",
  navy: "1B2A4A",
  navyLight: "2D4A7A",
  accent: "2563EB",
  accentLight: "DBEAFE",
  accentMid: "93C5FD",
  textDark: "111827",
  textBody: "374151",
  textMuted: "9CA3AF",
  textLight: "6B7280",
  green: "059669",
  greenBg: "D1FAE5",
  amber: "D97706",
  amberBg: "FEF3C7",
  red: "DC2626",
  redBg: "FEE2E2",
  border: "E5E7EB",
};

const F = {
  sans: "Calibri",
  size: {
    hero: 44, h1: 32, h2: 22, h3: 18, body: 16, label: 13, caption: 11, tag: 10,
  }
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
    fontSize: F.size.caption, fontFace: F.sans, color: C.textMuted, align: "right"
  });
  slide.addText("A-112", {
    x: L.mx, y: L.H - 0.38, w: 2, h: 0.3,
    fontSize: F.size.caption, fontFace: F.sans, color: C.textMuted, align: "left"
  });
}

function addSectionTitle(slide, title, pres, tag) {
  if (tag) {
    slide.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.45, w: tag.length * 0.12 + 0.4, h: 0.3,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    slide.addText(tag, {
      x: L.mx, y: 0.45, w: tag.length * 0.12 + 0.4, h: 0.3,
      fontSize: F.size.tag, fontFace: F.sans, bold: true,
      color: C.accent, align: "center", valign: "middle"
    });
  }
  slide.addText(title, {
    x: L.mx, y: tag ? 0.85 : 0.35, w: 8.5, h: 0.55,
    fontSize: F.size.h1, fontFace: F.sans, bold: true,
    color: C.textDark
  });
}

function addCard(slide, pres, x, y, w, h, opts = {}) {
  const fill = opts.fill || C.offWhite;
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h, fill: { color: fill },
    line: { color: C.border, width: 0.5 }, rectRadius: 0.08
  });
  if (opts.borderTop) {
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y, w, h: 0.04, fill: { color: opts.borderTop }, rectRadius: 0.02
    });
  }
}

async function main() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "Gorilla Knowledge";
  pres.title = "A-112: AI導入の第一歩〜明日からできること";

  // Pre-render icons
  const ic = {
    rocket: await icon(FaRocket, C.accent),
    envelope: await icon(FaEnvelope, C.accent),
    clipboard: await icon(FaClipboardList, C.accent),
    search: await icon(FaSearch, C.accent),
    users: await icon(FaUsers, C.accent),
    star: await icon(FaStar, C.amber),
    share: await icon(FaShareAlt, C.accent),
    warning: await icon(FaExclamationTriangle, C.red),
    book: await icon(FaBookOpen, C.accent),
    map: await icon(FaMap, C.accent),
    target: await icon(FaBullseye, C.accent),
    check: await icon(FaCheckCircle, C.green),
    arrow: await icon(FaArrowRight, C.accent),
    bulb: await icon(FaLightbulb, C.amber),
    trophy: await icon(FaTrophy, C.amber),
    chart: await icon(FaChartLine, C.green),
    copy: await icon(FaCopy, C.accent),
    comments: await icon(FaComments, C.accent),
    grad: await icon(FaGraduationCap, C.accent),
    handshake: await icon(FaHandshake, C.navyLight),
  };

  const T = 12;

  // ============================================================
  // SLIDE 1: TITLE
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };

    s.addImage({ data: ic.rocket, x: (L.W - 0.7) / 2, y: 1.0, w: 0.7, h: 0.7 });

    s.addText("AI導入の第一歩", {
      x: 0.5, y: 1.9, w: 9, h: 0.9,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center"
    });

    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 2.95, w: 3, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });

    s.addText("明日からできること", {
      x: 0.5, y: 3.15, w: 9, h: 0.5,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center"
    });

    s.addText("A-112   |   入門〜実践   |   20分", {
      x: 0.5, y: 4.2, w: 9, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textMuted, align: "center"
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
      "個人レベルで今日から始められるAI活用を3つ実行できる",
      "チームにAIを広める具体的なステップを理解する",
      "パッケージA全体の学びを振り返り、AI活用ロードマップを作成できる",
    ];

    goals.forEach((g, i) => {
      const y = 1.2 + i * 0.85;
      addCard(s, pres, L.mx, y, L.W - L.mx * 2, 0.7, { borderTop: C.accent });
      s.addImage({ data: ic.target, x: L.mx + 0.15, y: y + 0.15, w: 0.4, h: 0.4 });
      s.addText(`${i + 1}. ${g}`, {
        x: L.mx + 0.7, y: y + 0.1, w: 7.5, h: 0.5,
        fontSize: F.size.body, fontFace: F.sans, color: C.textBody
      });
    });
  }

  // ============================================================
  // SLIDE 3: ACTION 01 — メール下書き
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "メール・チャットの下書きをAIに任せる", pres, "ACTION 01");
    addFooter(s, 3, T, pres);

    // Before/After
    addCard(s, pres, L.mx, 1.5, 3.5, 0.5, { fill: C.redBg });
    s.addText("Before: 1通15分", {
      x: L.mx + 0.15, y: 1.5, w: 3.2, h: 0.5,
      fontSize: F.size.body, fontFace: F.sans, bold: true, color: C.red, valign: "middle"
    });
    s.addImage({ data: ic.arrow, x: 4.55, y: 1.55, w: 0.4, h: 0.4 });
    addCard(s, pres, 5.25, 1.5, 3.5, 0.5, { fill: C.greenBg });
    s.addText("After: 1通3分", {
      x: 5.4, y: 1.5, w: 3.2, h: 0.5,
      fontSize: F.size.body, fontFace: F.sans, bold: true, color: C.green, valign: "middle"
    });

    // Steps
    const steps = [
      "用件と相手を伝える",
      "トーンを指定する（丁寧 / カジュアル）",
      "生成された文面を確認・修正して送信",
    ];
    steps.forEach((step, i) => {
      const y = 2.35 + i * 0.7;
      s.addShape(pres.shapes.OVAL, {
        x: L.mx + 0.1, y: y + 0.08, w: 0.35, h: 0.35,
        fill: { color: C.accent }
      });
      s.addText(`${i + 1}`, {
        x: L.mx + 0.1, y: y + 0.08, w: 0.35, h: 0.35,
        fontSize: F.size.label, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle"
      });
      s.addText(step, {
        x: L.mx + 0.6, y: y, w: 7.5, h: 0.5,
        fontSize: F.size.body, fontFace: F.sans, color: C.textBody
      });
    });
  }

  // ============================================================
  // SLIDE 4: ACTION 02 — 議事録自動化
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "議事録・要約をAIで自動化する", pres, "ACTION 02");
    addFooter(s, 4, T, pres);

    addCard(s, pres, L.mx, 1.5, 3.5, 0.5, { fill: C.redBg });
    s.addText("Before: 会議後30分", {
      x: L.mx + 0.15, y: 1.5, w: 3.2, h: 0.5,
      fontSize: F.size.body, fontFace: F.sans, bold: true, color: C.red, valign: "middle"
    });
    s.addImage({ data: ic.arrow, x: 4.55, y: 1.55, w: 0.4, h: 0.4 });
    addCard(s, pres, 5.25, 1.5, 3.5, 0.5, { fill: C.greenBg });
    s.addText("After: リアルタイム完成", {
      x: 5.4, y: 1.5, w: 3.2, h: 0.5,
      fontSize: F.size.body, fontFace: F.sans, bold: true, color: C.green, valign: "middle"
    });

    const steps = [
      "会議の録音テキストをAIに渡す",
      "「決定事項・To-Do・次のアクション」の形式を指定",
      "生成された議事録を確認し、共有する",
    ];
    steps.forEach((step, i) => {
      const y = 2.35 + i * 0.7;
      s.addShape(pres.shapes.OVAL, {
        x: L.mx + 0.1, y: y + 0.08, w: 0.35, h: 0.35,
        fill: { color: C.accent }
      });
      s.addText(`${i + 1}`, {
        x: L.mx + 0.1, y: y + 0.08, w: 0.35, h: 0.35,
        fontSize: F.size.label, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle"
      });
      s.addText(step, {
        x: L.mx + 0.6, y: y, w: 7.5, h: 0.5,
        fontSize: F.size.body, fontFace: F.sans, color: C.textBody
      });
    });
  }

  // ============================================================
  // SLIDE 5: ACTION 03 — リサーチ効率化
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "情報収集・リサーチをAIで加速する", pres, "ACTION 03");
    addFooter(s, 5, T, pres);

    addCard(s, pres, L.mx, 1.5, 3.5, 0.5, { fill: C.redBg });
    s.addText("Before: 半日かけて検索", {
      x: L.mx + 0.15, y: 1.5, w: 3.2, h: 0.5,
      fontSize: F.size.body, fontFace: F.sans, bold: true, color: C.red, valign: "middle"
    });
    s.addImage({ data: ic.arrow, x: 4.55, y: 1.55, w: 0.4, h: 0.4 });
    addCard(s, pres, 5.25, 1.5, 3.5, 0.5, { fill: C.greenBg });
    s.addText("After: 30分で概要把握", {
      x: 5.4, y: 1.5, w: 3.2, h: 0.5,
      fontSize: F.size.body, fontFace: F.sans, bold: true, color: C.green, valign: "middle"
    });

    const steps = [
      "調べたいテーマをAIに伝える",
      "「概要→詳細→比較」の段階的な質問をする",
      "AIの回答を出発点に、一次情報を確認する",
    ];
    steps.forEach((step, i) => {
      const y = 2.35 + i * 0.7;
      s.addShape(pres.shapes.OVAL, {
        x: L.mx + 0.1, y: y + 0.08, w: 0.35, h: 0.35,
        fill: { color: C.accent }
      });
      s.addText(`${i + 1}`, {
        x: L.mx + 0.1, y: y + 0.08, w: 0.35, h: 0.35,
        fontSize: F.size.label, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle"
      });
      s.addText(step, {
        x: L.mx + 0.6, y: y, w: 7.5, h: 0.5,
        fontSize: F.size.body, fontFace: F.sans, color: C.textBody
      });
    });
  }

  // ============================================================
  // SLIDE 6: STEP 1 — 小さく始める
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "小さく始める", pres, "STEP 1");
    addFooter(s, 6, T, pres);

    // Flow
    const flowItems = ["1人で試す", "効果を記録", "テンプレート化"];
    flowItems.forEach((item, i) => {
      const x = L.mx + i * 3;
      addCard(s, pres, x, 1.5, 2.3, 0.45, { fill: C.accentLight });
      s.addText(item, {
        x, y: 1.5, w: 2.3, h: 0.45,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.accent, align: "center", valign: "middle"
      });
      if (i < 2) {
        s.addImage({ data: ic.arrow, x: x + 2.35, y: 1.55, w: 0.35, h: 0.35 });
      }
    });

    // Cards
    const cards = [
      { title: "ヘビーユーザーになる", desc: "1業務x1ツールに絞る", ic: ic.bulb, color: C.amberBg },
      { title: "数字で記録", desc: "時間短縮・品質を数値化", ic: ic.chart, color: C.greenBg },
      { title: "プロンプトを蓄積", desc: "コピペで使い回す", ic: ic.copy, color: C.accentLight },
    ];
    cards.forEach((c, i) => {
      const x = L.mx + i * 2.9;
      addCard(s, pres, x, 2.4, 2.6, 1.8, { fill: C.white, borderTop: C.accent });
      s.addImage({ data: c.ic, x: x + 0.15, y: 2.6, w: 0.4, h: 0.4 });
      s.addText(c.title, {
        x: x + 0.1, y: 3.1, w: 2.4, h: 0.4,
        fontSize: F.size.label, fontFace: F.sans, bold: true, color: C.textDark
      });
      s.addText(c.desc, {
        x: x + 0.1, y: 3.5, w: 2.4, h: 0.5,
        fontSize: F.size.label, fontFace: F.sans, color: C.textBody
      });
    });
  }

  // ============================================================
  // SLIDE 7: STEP 2 — 成功体験を作る
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "成功体験を作る", pres, "STEP 2");
    addFooter(s, 7, T, pres);

    const flowItems = ["デモを見せる", "一緒にやる", "「できた！」を体験"];
    flowItems.forEach((item, i) => {
      const x = L.mx + i * 3;
      addCard(s, pres, x, 1.5, 2.3, 0.45, { fill: C.accentLight });
      s.addText(item, {
        x, y: 1.5, w: 2.3, h: 0.45,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.accent, align: "center", valign: "middle"
      });
      if (i < 2) {
        s.addImage({ data: ic.arrow, x: x + 2.35, y: 1.55, w: 0.35, h: 0.35 });
      }
    });

    const cards = [
      { title: "15分ミニ勉強会", desc: "短時間で気軽に開催", ic: ic.grad },
      { title: "ライブデモ", desc: "目の前で実演して驚きを共有", ic: ic.star },
      { title: "ハンズオン", desc: "参加者自身に操作してもらう", ic: ic.handshake },
    ];
    cards.forEach((c, i) => {
      const x = L.mx + i * 2.9;
      addCard(s, pres, x, 2.4, 2.6, 1.8, { fill: C.white, borderTop: C.accent });
      s.addImage({ data: c.ic, x: x + 0.15, y: 2.6, w: 0.4, h: 0.4 });
      s.addText(c.title, {
        x: x + 0.1, y: 3.1, w: 2.4, h: 0.4,
        fontSize: F.size.h3, fontFace: F.sans, bold: true, color: C.textDark
      });
      s.addText(c.desc, {
        x: x + 0.1, y: 3.5, w: 2.4, h: 0.5,
        fontSize: F.size.body, fontFace: F.sans, color: C.textBody
      });
    });
  }

  // ============================================================
  // SLIDE 8: STEP 3 — 横展開する
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "横展開する", pres, "STEP 3");
    addFooter(s, 8, T, pres);

    const flowItems = ["成功事例を共有", "他チームに紹介", "ナレッジ蓄積"];
    flowItems.forEach((item, i) => {
      const x = L.mx + i * 3;
      addCard(s, pres, x, 1.5, 2.3, 0.45, { fill: C.accentLight });
      s.addText(item, {
        x, y: 1.5, w: 2.3, h: 0.45,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.accent, align: "center", valign: "middle"
      });
      if (i < 2) {
        s.addImage({ data: ic.arrow, x: x + 2.35, y: 1.55, w: 0.35, h: 0.35 });
      }
    });

    const cards = [
      { title: "AI活用チャンネル", desc: "Slack/Teamsで気軽に情報共有", ic: ic.comments },
      { title: "月1事例共有会", desc: "各チームの成功事例を5分発表", ic: ic.users },
      { title: "プロンプト集", desc: "社内Wikiで誰でも使える状態に", ic: ic.book },
    ];
    cards.forEach((c, i) => {
      const x = L.mx + i * 2.9;
      addCard(s, pres, x, 2.4, 2.6, 1.8, { fill: C.white, borderTop: C.accent });
      s.addImage({ data: c.ic, x: x + 0.15, y: 2.6, w: 0.4, h: 0.4 });
      s.addText(c.title, {
        x: x + 0.1, y: 3.1, w: 2.4, h: 0.4,
        fontSize: F.size.h3, fontFace: F.sans, bold: true, color: C.textDark
      });
      s.addText(c.desc, {
        x: x + 0.1, y: 3.5, w: 2.4, h: 0.5,
        fontSize: F.size.body, fontFace: F.sans, color: C.textBody
      });
    });
  }

  // ============================================================
  // SLIDE 9: よくある失敗パターン
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "AI導入 よくある失敗と対策", pres);
    addFooter(s, 9, T, pres);

    const failures = [
      { fail: "いきなり全社展開", desc: "ツールだけ導入して放置", fix: "まず1チーム、1業務から" },
      { fail: "完璧を求めすぎる", desc: "AIの出力が100点でないから使わない", fix: "70点でOK、人間が仕上げる" },
      { fail: "一部の人だけが使う", desc: "詳しい人だけで止まり、広がらない", fix: "勉強会+ナレッジ共有の仕組み化" },
    ];
    failures.forEach((f, i) => {
      const y = 1.2 + i * 1.25;
      addCard(s, pres, L.mx, y, L.W - L.mx * 2, 1.1, { fill: C.white });
      s.addImage({ data: ic.warning, x: L.mx + 0.15, y: y + 0.15, w: 0.35, h: 0.35 });
      s.addText(f.fail, {
        x: L.mx + 0.65, y: y + 0.05, w: 4, h: 0.35,
        fontSize: F.size.h3, fontFace: F.sans, bold: true, color: C.red
      });
      s.addText(f.desc, {
        x: L.mx + 0.65, y: y + 0.4, w: 4, h: 0.3,
        fontSize: F.size.body, fontFace: F.sans, color: C.textLight
      });
      // Fix
      addCard(s, pres, 5.5, y + 0.15, 3.5, 0.7, { fill: C.greenBg });
      s.addImage({ data: ic.check, x: 5.65, y: y + 0.3, w: 0.3, h: 0.3 });
      s.addText(f.fix, {
        x: 6.05, y: y + 0.15, w: 2.8, h: 0.7,
        fontSize: F.size.body, fontFace: F.sans, bold: true, color: C.green, valign: "middle"
      });
    });
  }

  // ============================================================
  // SLIDE 10: パッケージA 振り返り
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "パッケージA 学びの全体像", pres);
    addFooter(s, 10, T, pres);

    const courses = [
      { id: "A-101", title: "AIとは何か", desc: "基本概念の理解" },
      { id: "A-102", title: "生成AIの仕組み", desc: "技術の理解" },
      { id: "A-103", title: "主要AIツール比較", desc: "ツール選定力" },
      { id: "A-104", title: "AIにできること", desc: "判断力の基礎" },
      { id: "関連", title: "プロンプト・リテラシー", desc: "応用スキル" },
      { id: "A-112", title: "AI導入の第一歩", desc: "実践力" },
    ];
    courses.forEach((c, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const x = L.mx + col * 2.9;
      const y = 1.2 + row * 1.7;
      const isActive = c.id === "A-112";
      addCard(s, pres, x, y, 2.6, 1.4, {
        fill: isActive ? C.accentLight : C.white,
        borderTop: isActive ? C.accent : C.border
      });
      s.addText(c.id, {
        x: x + 0.1, y: y + 0.15, w: 2.4, h: 0.3,
        fontSize: F.size.label, fontFace: F.sans, bold: true,
        color: isActive ? C.accent : C.textMuted
      });
      s.addText(c.title, {
        x: x + 0.1, y: y + 0.45, w: 2.4, h: 0.35,
        fontSize: F.size.h3, fontFace: F.sans, bold: true, color: C.textDark
      });
      s.addText(c.desc, {
        x: x + 0.1, y: y + 0.85, w: 2.4, h: 0.3,
        fontSize: F.size.body, fontFace: F.sans, color: C.textBody
      });
    });
  }

  // ============================================================
  // SLIDE 11: ロードマップ
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "あなたのAI活用ロードマップ", pres);
    addFooter(s, 11, T, pres);

    const milestones = [
      { label: "今日", desc: "3つのアクションから1つ実行", color: C.accent },
      { label: "1週間後", desc: "毎日AIを使う習慣をつける", color: C.green },
      { label: "1ヶ月後", desc: "チーム内ミニ勉強会を開催", color: C.amber },
      { label: "3ヶ月後", desc: "成果を数字で振り返り、横展開開始", color: C.accent },
      { label: "半年後", desc: "組織のAI活用リーダーへ", color: C.green },
    ];

    // Timeline line
    s.addShape(pres.shapes.LINE, {
      x: 1.5, y: 1.3, w: 0, h: 3.5,
      line: { color: C.accentMid, width: 2 }
    });

    milestones.forEach((m, i) => {
      const y = 1.2 + i * 0.7;
      s.addShape(pres.shapes.OVAL, {
        x: 1.35, y: y + 0.05, w: 0.3, h: 0.3,
        fill: { color: m.color }
      });
      s.addText(m.label, {
        x: 2.0, y: y, w: 1.8, h: 0.35,
        fontSize: F.size.body, fontFace: F.sans, bold: true, color: C.textDark
      });
      s.addText(m.desc, {
        x: 3.8, y: y, w: 5, h: 0.35,
        fontSize: F.size.body, fontFace: F.sans, color: C.textBody
      });
    });
  }

  // ============================================================
  // SLIDE 12: END
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };

    s.addImage({ data: ic.trophy, x: (L.W - 0.7) / 2, y: 0.8, w: 0.7, h: 0.7 });

    s.addText("パッケージA 全コース修了\nおめでとうございます！", {
      x: 0.5, y: 1.7, w: 9, h: 1.0,
      fontSize: F.size.h1, fontFace: F.sans, bold: true,
      color: C.white, align: "center"
    });

    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 2.85, w: 3, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });

    s.addText("確認テスト（5問）に挑戦しましょう\n80%以上の正答で修了", {
      x: 0.5, y: 3.1, w: 9, h: 0.8,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textMuted, align: "center"
    });

    s.addText("学んだことを、今日から実践しましょう", {
      x: 0.5, y: 4.2, w: 9, h: 0.5,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.accentMid, align: "center"
    });
  }

  // ============================================================
  // SAVE
  // ============================================================
  const path = require("path");
  const outDir = __dirname;
  const outPath = path.join(outDir, "スライド.pptx");
  await pres.writeFile({ fileName: outPath });
  console.log(`PPTX saved: ${outPath}`);
}

main().catch(err => { console.error(err); process.exit(1); });
