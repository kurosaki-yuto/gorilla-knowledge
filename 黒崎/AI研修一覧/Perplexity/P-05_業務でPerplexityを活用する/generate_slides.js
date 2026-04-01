const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const {
  FaSearch, FaBullseye, FaBriefcase, FaLightbulb, FaUsers,
  FaChartLine, FaLaptopCode, FaNewspaper, FaMoneyBillWave,
  FaBalanceScale, FaCheckCircle, FaArrowRight, FaBookOpen,
  FaShareAlt, FaFolder, FaUserFriends, FaClock, FaRocket,
  FaGraduationCap, FaChevronRight, FaExclamationTriangle,
  FaFileAlt, FaGavel, FaStar, FaGlobe, FaPlay, FaBuilding
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
  red: "DC2626", redBg: "FEE2E2", purple: "7C3AED", purpleBg: "EDE9FE",
  border: "E5E7EB"
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
  slide.addText("P-05", {
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

const T = 12; // total slides

async function main() {
  pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "Gorilla Knowledge";
  pres.title = "P-05: 業務でPerplexityを活用する -- 実践ケーススタディ";

  // Pre-render icons
  const ic = {
    search: await icon(FaSearch, C.accent),
    target: await icon(FaBullseye, C.accent),
    briefcase: await icon(FaBriefcase, C.accent),
    bulb: await icon(FaLightbulb, C.amber),
    users: await icon(FaUsers, C.green),
    chart: await icon(FaChartLine, C.amber),
    laptop: await icon(FaLaptopCode, C.red),
    news: await icon(FaNewspaper, C.accent),
    money: await icon(FaMoneyBillWave, C.amber),
    balance: await icon(FaBalanceScale, C.amber),
    check: await icon(FaCheckCircle, C.green),
    arrow: await icon(FaArrowRight, C.accent),
    book: await icon(FaBookOpen, C.accent),
    share: await icon(FaShareAlt, C.green),
    folder: await icon(FaFolder, C.accent),
    friends: await icon(FaUserFriends, C.green),
    clock: await icon(FaClock, C.amber),
    rocket: await icon(FaRocket, C.accent),
    grad: await icon(FaGraduationCap, C.accent),
    chevron: await icon(FaChevronRight, C.textMuted),
    warn: await icon(FaExclamationTriangle, C.amber),
    file: await icon(FaFileAlt, C.accent),
    gavel: await icon(FaGavel, C.amber),
    star: await icon(FaStar, C.amber),
    purple: await icon(FaLightbulb, C.purple),
    globe: await icon(FaGlobe, C.accent),
    play: await icon(FaPlay, C.white),
    building: await icon(FaBuilding, C.accent),
  };

  // ============================================================
  // SLIDE 1: TITLE (Navy background)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };
    s.addImage({ data: ic.search, x: (L.W - 0.6) / 2, y: 1.0, w: 0.6, h: 0.6 });
    s.addText("業務でPerplexityを活用する", {
      x: 0.5, y: 1.8, w: 9, h: 0.8,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center", shrinkText: true
    });
    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 2.75, w: 3, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });
    s.addText("実践ケーススタディ", {
      x: 0.5, y: 2.95, w: 9, h: 0.45,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", shrinkText: true
    });
    s.addText("P-05  |  全社員向け実践  |  12分", {
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
      "部門別のPerplexity活用パターンを3つ以上挙げられる（営業/企画/人事/経理/法務）",
      "商談前リサーチをPerplexityで実際に実行できる（実演で確認）",
      "Spaces・Cometを使ったチーム活用方法を理解している",
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
  // SLIDE 3: USAGE MAP — 5 departments
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "業務活用マップ", "OVERVIEW");
    addFooter(s, 3, T);

    const depts = [
      { ic: ic.briefcase, label: "営業", desc: "商談前リサーチ\n企業の最新動向", color: C.accent, bg: C.accentLight },
      { ic: ic.purple,    label: "企画", desc: "市場調査\nDeep Research", color: C.purple, bg: C.purpleBg },
      { ic: ic.users,     label: "人事", desc: "採用トレンド\nAcademic法改正", color: C.green, bg: C.greenBg },
      { ic: ic.money,     label: "経理/法務", desc: "税制・法令\n出典付き調査", color: C.amber, bg: C.amberBg },
      { ic: ic.globe,     label: "全社", desc: "Spaces共有\nCometで効率化", color: C.red, bg: C.redBg },
    ];

    const cardW = 1.55;
    const cardGap = 0.15;
    const totalW = cardW * 5 + cardGap * 4;
    const startX = (L.W - totalW) / 2;

    depts.forEach((d, i) => {
      const x = startX + i * (cardW + cardGap);
      const y = 1.0;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 2.8,
        fill: { color: d.bg }, line: { color: d.color, width: 1 }, rectRadius: 0.05
      });
      s.addImage({ data: d.ic, x: x + (cardW - 0.3) / 2, y: y + 0.2, w: 0.3, h: 0.3 });
      s.addText(d.label, {
        x, y: y + 0.6, w: cardW, h: 0.35,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: d.color, align: "center", shrinkText: true
      });
      s.addText(d.desc, {
        x: x + 0.1, y: y + 1.05, w: cardW - 0.2, h: 1.2,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, align: "center", lineSpacingMultiple: 1.3, shrinkText: true
      });
    });

    s.addImage({ data: ic.bulb, x: L.mx, y: 4.15, w: 0.22, h: 0.22 });
    s.addText("共通ニーズ：最新の正確な情報を、出典付きで素早く手に入れたい", {
      x: L.mx + 0.3, y: 4.1, w: L.W - L.mx * 2 - 0.35, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans, italic: true,
      color: C.textLight, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 4: SALES — Company Research
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "営業 — 商談前の企業リサーチ", "CASE 1");
    addFooter(s, 4, T);

    // Prompt box
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.9, w: L.W - L.mx * 2, h: 0.55,
      fill: { color: C.navy }, rectRadius: 0.05
    });
    s.addText("「ソフトバンクグループの最新ニュースと現在の事業課題、今後の戦略について教えてください」", {
      x: L.mx + 0.2, y: 0.9, w: L.W - L.mx * 2 - 0.4, h: 0.55,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.accentMid, valign: "middle", shrinkText: true
    });

    // 3 result cards
    const results = [
      { ic: ic.news,     label: "最新ニュース",   desc: "直近のプレスリリース\n出典付きで取得" },
      { ic: ic.chart,    label: "事業課題・戦略", desc: "AIへの投資状況\n戦略方針が整理" },
      { ic: ic.building, label: "フォローアップ", desc: "「提案に使えるポイント\n3つにまとめて」→即整理" },
    ];

    const cardW = 2.5;
    const cardGap = 0.3;
    const totalW = cardW * 3 + cardGap * 2;
    const startX = (L.W - totalW) / 2;

    results.forEach((r, i) => {
      const x = startX + i * (cardW + cardGap);
      const y = 1.65;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 1.9,
        fill: { color: C.offWhite }, line: { color: C.accent, width: 0.5 }, rectRadius: 0.05
      });
      s.addImage({ data: r.ic, x: x + (cardW - 0.25) / 2, y: y + 0.15, w: 0.25, h: 0.25 });
      s.addText(r.label, {
        x, y: y + 0.48, w: cardW, h: 0.3,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, align: "center", shrinkText: true
      });
      s.addText(r.desc, {
        x: x + 0.1, y: y + 0.85, w: cardW - 0.2, h: 0.8,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, align: "center", lineSpacingMultiple: 1.3, shrinkText: true
      });
    });

    // Badge
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.85, w: 3.5, h: 0.35,
      fill: { color: C.greenBg }, rectRadius: 0.05
    });
    s.addText("商談準備 30分 → 5分に短縮", {
      x: L.mx, y: 3.85, w: 3.5, h: 0.35,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.green, align: "center", valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 5: DEMO — company-research.webm (44 sec)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };

    // Title area
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0, y: 0, w: L.W, h: 0.035, fill: { color: C.accent }
    });

    // Tag
    const tagW = 1.2;
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.18, w: tagW, h: 0.28,
      fill: { color: C.accent }, rectRadius: 0.04
    });
    s.addText("HANDS-ON", {
      x: L.mx, y: 0.18, w: tagW, h: 0.28,
      fontSize: F.size.caption, fontFace: F.sans, bold: true,
      color: C.white, align: "center", valign: "middle", shrinkText: true
    });

    s.addText("【実演】商談前リサーチをやってみる", {
      x: L.mx, y: 0.52, w: 9, h: 0.45,
      fontSize: F.size.h1, fontFace: F.sans, bold: true,
      color: C.white, shrinkText: true
    });

    // Play button visual
    s.addShape(pres.shapes.OVAL, {
      x: (L.W - 1.0) / 2, y: 1.4, w: 1.0, h: 1.0,
      fill: { color: C.accent }, line: { color: C.accentMid, width: 2 }
    });
    s.addImage({ data: ic.play, x: (L.W - 0.4) / 2 + 0.05, y: 1.7, w: 0.3, h: 0.3 });

    s.addText("実演録画 44秒", {
      x: 0, y: 2.55, w: L.W, h: 0.4,
      fontSize: F.size.h2, fontFace: F.sans, bold: true,
      color: C.white, align: "center", shrinkText: true
    });

    // Timeline
    const events = [
      { t: "0〜4秒",   text: "Perplexityトップページを開く" },
      { t: "4〜18秒",  text: "「ソフトバンクグループの最新ニュース・事業課題・戦略」を入力" },
      { t: "20〜30秒", text: "AI回答生成 → AI投資・事業課題・戦略方針が整理" },
      { t: "30〜37秒", text: "スクロールして詳細を確認" },
      { t: "37〜44秒", text: "フォローアップ「商談に使えるポイントを3つに」→ 即整理" },
    ];

    events.forEach((e, i) => {
      const y = 3.1 + i * 0.42;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: 1.1, h: 0.3,
        fill: { color: C.navyLight }, rectRadius: 0.03
      });
      s.addText(e.t, {
        x: L.mx, y, w: 1.1, h: 0.3,
        fontSize: 9, fontFace: F.sans, bold: true,
        color: C.accentMid, align: "center", valign: "middle", shrinkText: true
      });
      s.addText(e.text, {
        x: L.mx + 1.2, y, w: L.W - L.mx * 2 - 1.3, h: 0.3,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.white, valign: "middle", shrinkText: true
      });
    });
  }

  // ============================================================
  // SLIDE 6: PLANNING — Market Research & Deep Research
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "企画・マーケ — 市場調査・競合分析", "CASE 2");
    addFooter(s, 6, T);

    // Pro Search badge + prompt
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.9, w: 1.5, h: 0.35,
      fill: { color: C.accentLight }, rectRadius: 0.04
    });
    s.addText("Pro Search", {
      x: L.mx, y: 0.9, w: 1.5, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.accent, align: "center", valign: "middle", shrinkText: true
    });

    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 1.3, w: L.W - L.mx * 2, h: 0.5,
      fill: { color: C.navy }, rectRadius: 0.05
    });
    s.addText("「日本のサブスクリプション市場の2026年規模と成長率、主要プレーヤーを教えて」", {
      x: L.mx + 0.2, y: 1.3, w: L.W - L.mx * 2 - 0.4, h: 0.5,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.accentMid, valign: "middle", shrinkText: true
    });

    // Points
    const points = [
      { ic: ic.chart, text: "Pro Search：市場規模・CAGR・主要企業・トレンドを一括取得" },
      { ic: ic.arrow, text: "フォローアップ：「成長率が最も高いセグメントは？」で深掘り" },
      { ic: ic.rocket, text: "Deep Research：学術論文・市場レポートレベルの調査レポートを自動生成" },
      { ic: ic.file,  text: "出典付きなので企画書・提案書にそのまま引用可能" },
    ];

    points.forEach((p, i) => {
      const y = 2.0 + i * 0.65;
      s.addImage({ data: p.ic, x: L.mx, y: y + 0.06, w: 0.24, h: 0.24 });
      s.addText(p.text, {
        x: L.mx + 0.38, y, w: L.W - L.mx * 2 - 0.48, h: 0.45,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, valign: "middle", shrinkText: true
      });
    });

    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.75, w: 5.2, h: 0.35,
      fill: { color: C.greenBg }, rectRadius: 0.05
    });
    s.addText("調査レポート1本分の概要が数分で手に入る", {
      x: L.mx, y: 4.75, w: 5.2, h: 0.35,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.green, align: "center", valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 7: HR / FINANCE / LEGAL
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "人事・経理・法務での活用", "CASE 3 & 4");
    addFooter(s, 7, T);

    const colW = 3.9;
    const col1X = L.mx;
    const col2X = L.mx + colW + 0.4;

    // HR
    s.addShape(pres.shapes.RECTANGLE, {
      x: col1X, y: 1.0, w: colW, h: 2.8,
      fill: { color: C.greenBg }, rectRadius: 0.05
    });
    s.addImage({ data: ic.users, x: col1X + 0.15, y: 1.1, w: 0.25, h: 0.25 });
    s.addText("人事", {
      x: col1X + 0.45, y: 1.1, w: 3, h: 0.3,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.green, shrinkText: true
    });
    s.addText("採用トレンド\n「2026年のエンジニア採用市場の\nトレンドと平均年収」\n→ 求人倍率・年収相場・人気技術\n\n法改正キャッチアップ\nAcademic フォーカスで\n官公庁サイトを優先参照", {
      x: col1X + 0.15, y: 1.45, w: colW - 0.3, h: 2.2,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textBody, lineSpacingMultiple: 1.3, shrinkText: true
    });

    // Finance / Legal
    s.addShape(pres.shapes.RECTANGLE, {
      x: col2X, y: 1.0, w: colW, h: 2.8,
      fill: { color: C.amberBg }, rectRadius: 0.05
    });
    s.addImage({ data: ic.gavel, x: col2X + 0.15, y: 1.1, w: 0.25, h: 0.25 });
    s.addText("経理・法務", {
      x: col2X + 0.45, y: 1.1, w: 3, h: 0.3,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.amber, shrinkText: true
    });
    s.addText("税制・法令調査\n「インボイス制度の最新実務対応」\n→ 国税庁ガイドライン\n   税務専門解説を出典付き取得\n\nCB Insights・PitchBook・\nStatista等プレミアムデータも活用", {
      x: col2X + 0.15, y: 1.45, w: colW - 0.3, h: 2.2,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textBody, lineSpacingMultiple: 1.3, shrinkText: true
    });

    // Warning
    s.addImage({ data: ic.warn, x: L.mx, y: 4.1, w: 0.22, h: 0.22 });
    s.addText("法令の最終判断は必ず顧問税理士・弁護士に確認。Perplexityは「調査の起点」として使う", {
      x: L.mx + 0.3, y: 4.05, w: L.W - L.mx * 2 - 0.35, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans, italic: true,
      color: C.amber, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 8: SPACES — Team Knowledge Base
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "Spacesでチーム活用", "TEAM");
    addFooter(s, 8, T);

    // What is Spaces
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.95, w: L.W - L.mx * 2, h: 0.55,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    s.addImage({ data: ic.folder, x: L.mx + 0.15, y: 1.1, w: 0.22, h: 0.22 });
    s.addText("Spaces = 社内ドキュメント（PDF・URL）をアップロード → チームで共有するナレッジベース", {
      x: L.mx + 0.5, y: 0.95, w: L.W - L.mx * 2 - 0.65, h: 0.55,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", shrinkText: true
    });

    // Use case flow
    const steps = [
      { ic: ic.file,    text: "製品カタログ・提案資料・社内規定などをアップロード" },
      { ic: ic.search,  text: "「うちの製品のXXX機能は競合Yとどう違う？」→ 社内資料に基づいた回答" },
      { ic: ic.friends, text: "チームメンバーと共有 → 情報の属人化を防ぎ、全員が同じ知識にアクセス" },
    ];

    steps.forEach((st, i) => {
      const y = 1.7 + i * 0.7;
      s.addImage({ data: st.ic, x: L.mx, y: y + 0.08, w: 0.24, h: 0.24 });
      s.addText(st.text, {
        x: L.mx + 0.4, y, w: L.W - L.mx * 2 - 0.5, h: 0.5,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, valign: "middle", shrinkText: true
      });
    });

    // Perplexity Computer info
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.95, w: L.W - L.mx * 2, h: 0.7,
      fill: { color: C.purpleBg }, rectRadius: 0.05
    });
    s.addImage({ data: ic.rocket, x: L.mx + 0.15, y: 4.08, w: 0.24, h: 0.24 });
    s.addText("Perplexity Computer（2026年2月）: バックグラウンドで複数タスクを自律処理\nリサーチ→コーディング→画像生成を一つの指示で実行（Maxプラン）", {
      x: L.mx + 0.5, y: 3.95, w: L.W - L.mx * 2 - 0.65, h: 0.7,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.purple, valign: "middle", lineSpacingMultiple: 1.3, shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 9: COMET — AI Browser
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "Cometで作業効率化", "NEW 2025");
    addFooter(s, 9, T);

    // What is Comet
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.95, w: L.W - L.mx * 2, h: 0.5,
      fill: { color: C.navy }, rectRadius: 0.05
    });
    s.addText("Comet = Perplexity製 AIブラウザ（2025年10月〜全ユーザー無料）", {
      x: L.mx + 0.2, y: 0.95, w: L.W - L.mx * 2 - 0.4, h: 0.5,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.white, valign: "middle", shrinkText: true
    });

    // Feature cards
    const features = [
      { ic: ic.search, label: "即時要約", desc: "閲覧中のページを\nAlt+S でワンタッチ要約", color: C.accent, bg: C.accentLight },
      { ic: ic.rocket, label: "Comet Agent", desc: "フォーム自動入力・\n予約タスクをAIが代行", color: C.purple, bg: C.purpleBg },
      { ic: ic.folder, label: "スマートタブ管理", desc: "開いているタブを\nAIが自動整理", color: C.green, bg: C.greenBg },
      { ic: ic.bulb,   label: "音声モード", desc: "Shift+Alt+V で起動\n音声で操作・質問", color: C.amber, bg: C.amberBg },
    ];

    const cW = 1.9;
    const cGap = 0.2;
    const cTotal = cW * 4 + cGap * 3;
    const cStart = (L.W - cTotal) / 2;

    features.forEach((f, i) => {
      const x = cStart + i * (cW + cGap);
      const y = 1.65;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cW, h: 2.2,
        fill: { color: f.bg }, line: { color: f.color, width: 0.5 }, rectRadius: 0.05
      });
      s.addImage({ data: f.ic, x: x + (cW - 0.3) / 2, y: y + 0.15, w: 0.3, h: 0.3 });
      s.addText(f.label, {
        x, y: y + 0.55, w: cW, h: 0.3,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: f.color, align: "center", shrinkText: true
      });
      s.addText(f.desc, {
        x: x + 0.1, y: y + 0.95, w: cW - 0.2, h: 1.0,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textBody, align: "center", lineSpacingMultiple: 1.3, shrinkText: true
      });
    });

    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.15, w: L.W - L.mx * 2, h: 0.35,
      fill: { color: C.greenBg }, rectRadius: 0.05
    });
    s.addText("普段使いのブラウザをCometに切り替えるだけで、日常業務の効率が大きく変わる", {
      x: L.mx, y: 4.15, w: L.W - L.mx * 2, h: 0.35,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.green, align: "center", valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 10: ADOPTION TIPS
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "導入のコツ：まず1日3回使ってみる", "TIPS");
    addFooter(s, 10, T);

    const steps = [
      { num: "1", text: "既存業務の置き換えから始める", desc: "Google検索の代わりにPerplexityを使う（ちょっと調べたいことからでOK）" },
      { num: "2", text: "1日3回、意識的に使う", desc: "朝：業界ニュースチェック / 昼：業務調べもの / 夕：翌日の準備" },
      { num: "3", text: "チームで活用事例を共有する", desc: "便利だったプロンプトをSpacesに記録 → チームに展開" },
    ];

    steps.forEach((st, i) => {
      const y = 1.0 + i * 1.1;
      s.addText(st.num, {
        x: L.mx, y: y + 0.1, w: 0.5, h: 0.5,
        fontSize: F.size.h2, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: C.accent }, shape: pres.shapes.OVAL, shrinkText: true
      });
      s.addText(st.text, {
        x: L.mx + 0.7, y, w: 7.5, h: 0.35,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, valign: "middle", shrinkText: true
      });
      s.addText(st.desc, {
        x: L.mx + 0.7, y: y + 0.38, w: 7.5, h: 0.32,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textLight, valign: "middle", shrinkText: true
      });
    });

    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.3, w: L.W - L.mx * 2, h: 0.4,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    s.addText("2週間続ければ習慣化。Perplexityなしの仕事には戻れなくなるはず", {
      x: L.mx, y: 4.3, w: L.W - L.mx * 2, h: 0.4,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.accent, align: "center", valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 11: SUMMARY — All 5 Courses + Next Actions
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "まとめ — Perplexity研修 全5回の振り返り", "SUMMARY");
    addFooter(s, 11, T);

    const courses = [
      { id: "P-01", text: "なぜ今Perplexityなのか（AI検索の価値・評価額226億ドル）" },
      { id: "P-02", text: "基本操作（検索・対話・出典確認）" },
      { id: "P-03", text: "高度な検索テクニック（Focus・Pro Search・Deep Research）" },
      { id: "P-04", text: "Google検索との使い分け（得意・不得意の判断基準）" },
      { id: "P-05", text: "業務実践活用 + Spaces・Comet（← 今日）" },
    ];

    courses.forEach((c, i) => {
      const y = 0.95 + i * 0.65;
      const isToday = i === 4;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: 0.7, h: 0.4,
        fill: { color: isToday ? C.accent : C.lightGray }, rectRadius: 0.03
      });
      s.addText(c.id, {
        x: L.mx, y, w: 0.7, h: 0.4,
        fontSize: F.size.caption, fontFace: F.sans, bold: true,
        color: isToday ? C.white : C.textLight, align: "center", valign: "middle", shrinkText: true
      });
      s.addText(c.text, {
        x: L.mx + 0.85, y, w: 7.5, h: 0.4,
        fontSize: F.size.body, fontFace: F.sans,
        color: isToday ? C.accent : C.textBody, bold: isToday, valign: "middle", shrinkText: true
      });
      if (i < 4) {
        s.addShape(pres.shapes.LINE, {
          x: L.mx, y: y + 0.5, w: L.W - L.mx * 2, h: 0,
          line: { color: C.border, width: 0.3 }
        });
      }
    });

    // Next actions
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.3, w: L.W - L.mx * 2, h: 0.5,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    s.addText("次のアクション：①1日3回Perplexityを使う  ②Spacesでチーム共有  ③Cometをダウンロード", {
      x: L.mx, y: 4.3, w: L.W - L.mx * 2, h: 0.5,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.accent, align: "center", valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 12: END (Navy background)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };
    s.addImage({ data: ic.grad, x: (L.W - 0.6) / 2, y: 1.1, w: 0.6, h: 0.6 });
    s.addText("Perplexity研修コース 修了！", {
      x: 0.5, y: 1.9, w: 9, h: 0.7,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center", shrinkText: true
    });
    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 2.75, w: 3, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });
    s.addText("AI検索を武器に、業務をもっと効率的に・もっとスマートに", {
      x: 0.5, y: 2.95, w: 9, h: 0.45,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", shrinkText: true
    });
    s.addText("全5回修了おめでとうございます  |  確認テスト：5問中4問正解で修了", {
      x: 0.5, y: 3.8, w: 9, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textMuted, align: "center", shrinkText: true
    });
  }

  // ============================================================
  // SAVE
  // ============================================================
  const outPath = __dirname + "/スライド.pptx";
  await pres.writeFile({ fileName: outPath });
  console.log("Saved:", outPath);
}

main().catch(err => { console.error(err); process.exit(1); });
