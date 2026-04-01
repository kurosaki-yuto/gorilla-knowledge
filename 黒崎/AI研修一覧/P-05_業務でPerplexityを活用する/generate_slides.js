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
  FaFileAlt, FaGavel, FaStar
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
      "各部門でのPerplexity活用パターンを3つ以上挙げられる",
      "Perplexityを使った業務効率化の具体的な手順を実践できる",
      "チームでPerplexityを共有活用する方法を理解している",
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
  // SLIDE 3: AI SEARCH USAGE MAP
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "業務でのAI検索活用マップ", "OVERVIEW");
    addFooter(s, 3, T);

    const depts = [
      { ic: ic.briefcase, label: "営業", desc: "商談前リサーチ\n業界動向", color: C.accent, bg: C.accentLight },
      { ic: ic.purple, label: "企画", desc: "市場調査\n競合分析", color: C.purple, bg: C.purpleBg },
      { ic: ic.users, label: "人事", desc: "採用トレンド\n法改正", color: C.green, bg: C.greenBg },
      { ic: ic.money, label: "経理/法務", desc: "税制・法令\nAcademic検索", color: C.amber, bg: C.amberBg },
      { ic: ic.laptop, label: "開発", desc: "技術調査\nエラー解決", color: C.red, bg: C.redBg },
    ];

    const cardW = 1.55;
    const cardGap = 0.15;
    const totalW = cardW * 5 + cardGap * 4;
    const startX = (L.W - totalW) / 2;

    depts.forEach((d, i) => {
      const x = startX + i * (cardW + cardGap);
      const y = 1.0;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 2.6,
        fill: { color: d.bg }, line: { color: d.color, width: 1 }, rectRadius: 0.05
      });
      s.addImage({ data: d.ic, x: x + (cardW - 0.3) / 2, y: y + 0.2, w: 0.3, h: 0.3 });
      s.addText(d.label, {
        x, y: y + 0.6, w: cardW, h: 0.35,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: d.color, align: "center", shrinkText: true
      });
      s.addText(d.desc, {
        x: x + 0.1, y: y + 1.05, w: cardW - 0.2, h: 1.0,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, align: "center", lineSpacingMultiple: 1.3, shrinkText: true
      });
    });

    // Common need
    s.addImage({ data: ic.bulb, x: L.mx, y: 4.0, w: 0.22, h: 0.22 });
    s.addText("共通ニーズ：最新の正確な情報を、出典付きで素早く手に入れたい", {
      x: L.mx + 0.3, y: 3.95, w: L.W - L.mx * 2 - 0.35, h: 0.35,
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
      x: L.mx, y: 0.9, w: L.W - L.mx * 2, h: 0.5,
      fill: { color: C.navy }, rectRadius: 0.05
    });
    s.addText("「〇〇株式会社の最新ニュースと事業課題を教えて」", {
      x: L.mx + 0.2, y: 0.9, w: L.W - L.mx * 2 - 0.4, h: 0.5,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.accentMid, valign: "middle", shrinkText: true
    });

    // 3 result cards
    const results = [
      { ic: ic.news, label: "プレスリリース", desc: "直近のニュース・発表\n出典付きで取得" },
      { ic: ic.chart, label: "決算情報", desc: "売上・利益の推移\n業界ポジション" },
      { ic: ic.file, label: "出典リンク", desc: "原典に飛んで\n裏取り可能" },
    ];

    const cardW = 2.5;
    const cardGap = 0.3;
    const totalW = cardW * 3 + cardGap * 2;
    const startX = (L.W - totalW) / 2;

    results.forEach((r, i) => {
      const x = startX + i * (cardW + cardGap);
      const y = 1.7;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 1.8,
        fill: { color: C.offWhite }, line: { color: C.accent, width: 0.5, dashType: "solid" }, rectRadius: 0.05
      });
      s.addImage({ data: r.ic, x: x + (cardW - 0.25) / 2, y: y + 0.15, w: 0.25, h: 0.25 });
      s.addText(r.label, {
        x, y: y + 0.45, w: cardW, h: 0.3,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, align: "center", shrinkText: true
      });
      s.addText(r.desc, {
        x: x + 0.1, y: y + 0.85, w: cardW - 0.2, h: 0.7,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, align: "center", lineSpacingMultiple: 1.3, shrinkText: true
      });
    });

    // Badge
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.8, w: 3.2, h: 0.35,
      fill: { color: C.greenBg }, rectRadius: 0.05
    });
    s.addText("準備30分 → 5分に短縮", {
      x: L.mx, y: 3.8, w: 3.2, h: 0.35,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.green, align: "center", valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 5: HANDS-ON — Sales Research
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "【実演ポイント】商談前リサーチ", "HANDS-ON");
    addFooter(s, 5, T);

    const steps = [
      { num: "1", text: "Pro Searchをオンにする\n（複数情報源を横断深掘り）" },
      { num: "2", text: "「〇〇社の直近1年の事業戦略と課題を要約して」と入力\n（期間指定で古い情報を排除）" },
      { num: "3", text: "出典リンクを確認し、重要な数字は原典でファクトチェック" },
    ];

    steps.forEach((st, i) => {
      const y = 1.0 + i * 1.1;
      s.addText(st.num, {
        x: L.mx, y: y + 0.05, w: 0.5, h: 0.5,
        fontSize: F.size.h2, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: C.accent }, shape: pres.shapes.OVAL, shrinkText: true
      });
      s.addText(st.text, {
        x: L.mx + 0.7, y, w: 7.5, h: 0.7,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, valign: "middle", lineSpacingMultiple: 1.3, shrinkText: true
      });
    });

    // Tip
    s.addImage({ data: ic.bulb, x: L.mx, y: 4.3, w: 0.22, h: 0.22 });
    s.addText("コツ：条件を具体的にすると精度UP（「直近1年」「事業課題」など）", {
      x: L.mx + 0.3, y: 4.25, w: L.W - L.mx * 2 - 0.35, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans, italic: true,
      color: C.textLight, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 6: PLANNING — Market Research
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "企画 — 市場調査・競合分析", "CASE 2");
    addFooter(s, 6, T);

    // Prompt box
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.9, w: L.W - L.mx * 2, h: 0.5,
      fill: { color: C.navy }, rectRadius: 0.05
    });
    s.addText("「日本のサブスク市場の2025年規模と成長率、主要プレーヤーを教えて」", {
      x: L.mx + 0.2, y: 0.9, w: L.W - L.mx * 2 - 0.4, h: 0.5,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.accentMid, valign: "middle", shrinkText: true
    });

    // Key points
    const points = [
      { ic: ic.chart, text: "Pro Searchで一発取得：市場規模、CAGR、主要企業、トレンド" },
      { ic: ic.arrow, text: "フォローアップ：「成長率が最も高いセグメントは？」で深掘り" },
      { ic: ic.file, text: "出典付きなので企画書にそのまま引用可能" },
    ];

    points.forEach((p, i) => {
      const y = 1.6 + i * 0.7;
      s.addImage({ data: p.ic, x: L.mx, y: y + 0.05, w: 0.25, h: 0.25 });
      s.addText(p.text, {
        x: L.mx + 0.4, y, w: L.W - L.mx * 2 - 0.5, h: 0.45,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, valign: "middle", shrinkText: true
      });
    });

    // Badge
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.9, w: 4.5, h: 0.35,
      fill: { color: C.greenBg }, rectRadius: 0.05
    });
    s.addText("調査レポート1本分の概要が数分で手に入る", {
      x: L.mx, y: 3.9, w: 4.5, h: 0.35,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.green, align: "center", valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 7: HR — Recruitment & Legal Updates
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "人事 — 採用トレンド・法改正キャッチアップ", "CASE 3");
    addFooter(s, 7, T);

    // Two columns
    const colW = 3.9;
    const col1X = L.mx;
    const col2X = L.mx + colW + 0.4;

    // Recruitment
    s.addShape(pres.shapes.RECTANGLE, {
      x: col1X, y: 1.0, w: colW, h: 2.5,
      fill: { color: C.greenBg }, rectRadius: 0.05
    });
    s.addImage({ data: ic.users, x: col1X + 0.15, y: 1.1, w: 0.25, h: 0.25 });
    s.addText("採用トレンド", {
      x: col1X + 0.45, y: 1.1, w: 3, h: 0.3,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.green, shrinkText: true
    });
    s.addText("「2025年のエンジニア採用市場の\nトレンドと平均年収」\n\n→ 求人倍率・年収相場・人気技術", {
      x: col1X + 0.15, y: 1.5, w: colW - 0.3, h: 1.5,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textBody, lineSpacingMultiple: 1.3, shrinkText: true
    });

    // Legal updates
    s.addShape(pres.shapes.RECTANGLE, {
      x: col2X, y: 1.0, w: colW, h: 2.5,
      fill: { color: C.amberBg }, rectRadius: 0.05
    });
    s.addImage({ data: ic.gavel, x: col2X + 0.15, y: 1.1, w: 0.25, h: 0.25 });
    s.addText("法改正キャッチアップ", {
      x: col2X + 0.45, y: 1.1, w: 3, h: 0.3,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.amber, shrinkText: true
    });
    s.addText("「2025年4月施行の労働関連\n法改正の要点」\n\n→ 改正内容を箇条書きで整理", {
      x: col2X + 0.15, y: 1.5, w: colW - 0.3, h: 1.5,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textBody, lineSpacingMultiple: 1.3, shrinkText: true
    });

    // Warning
    s.addImage({ data: ic.warn, x: L.mx, y: 3.85, w: 0.22, h: 0.22 });
    s.addText("法改正の見落としは大きなリスク。出典が官公庁サイトであることを必ず確認", {
      x: L.mx + 0.3, y: 3.8, w: L.W - L.mx * 2 - 0.35, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans, italic: true,
      color: C.amber, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 8: FINANCE / LEGAL — Academic Search
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "経理/法務 — 税制改正・法令調査", "CASE 4");
    addFooter(s, 8, T);

    // Focus Academic box
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.9, w: L.W - L.mx * 2, h: 0.5,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    s.addImage({ data: ic.book, x: L.mx + 0.15, y: 1.03, w: 0.22, h: 0.22 });
    s.addText("Focus「Academic」= 学術論文・公的機関の資料を優先検索", {
      x: L.mx + 0.5, y: 0.9, w: L.W - L.mx * 2 - 0.6, h: 0.5,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", shrinkText: true
    });

    // Prompt box
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 1.6, w: L.W - L.mx * 2, h: 0.5,
      fill: { color: C.navy }, rectRadius: 0.05
    });
    s.addText("「インボイス制度の経過措置終了後の実務対応」", {
      x: L.mx + 0.2, y: 1.6, w: L.W - L.mx * 2 - 0.4, h: 0.5,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.accentMid, valign: "middle", shrinkText: true
    });

    // Result
    s.addImage({ data: ic.file, x: L.mx, y: 2.35, w: 0.25, h: 0.25 });
    s.addText("国税庁ガイドライン・税務専門解説を出典付きで取得", {
      x: L.mx + 0.4, y: 2.3, w: L.W - L.mx * 2 - 0.5, h: 0.4,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textBody, valign: "middle", shrinkText: true
    });

    // Warning box
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.0, w: L.W - L.mx * 2, h: 0.7,
      fill: { color: C.amberBg }, rectRadius: 0.05
    });
    s.addImage({ data: ic.warn, x: L.mx + 0.15, y: 3.15, w: 0.22, h: 0.22 });
    s.addText("重要：法令解釈・税務判断は最終的に顧問税理士・弁護士に確認\nPerplexityは「調査の起点」として使う", {
      x: L.mx + 0.5, y: 3.0, w: L.W - L.mx * 2 - 0.65, h: 0.7,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.amber, valign: "middle", lineSpacingMultiple: 1.3, shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 9: TEAM USAGE — Collections & Spaces
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "チーム活用：コレクション共有・Spaces", "TEAM");
    addFooter(s, 9, T);

    // Two columns
    const colW = 3.9;
    const col1X = L.mx;
    const col2X = L.mx + colW + 0.4;

    // Collections
    s.addShape(pres.shapes.RECTANGLE, {
      x: col1X, y: 1.0, w: colW, h: 2.2,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    s.addImage({ data: ic.folder, x: col1X + 0.15, y: 1.1, w: 0.25, h: 0.25 });
    s.addText("コレクション", {
      x: col1X + 0.45, y: 1.1, w: 3, h: 0.3,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.accent, shrinkText: true
    });
    s.addText("検索スレッドをフォルダのように\n整理・保存\n\n「競合調査」「法改正」\n「技術トレンド」をテーマ別に管理", {
      x: col1X + 0.15, y: 1.5, w: colW - 0.3, h: 1.4,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textBody, lineSpacingMultiple: 1.3, shrinkText: true
    });

    // Spaces
    s.addShape(pres.shapes.RECTANGLE, {
      x: col2X, y: 1.0, w: colW, h: 2.2,
      fill: { color: C.greenBg }, rectRadius: 0.05
    });
    s.addImage({ data: ic.friends, x: col2X + 0.15, y: 1.1, w: 0.25, h: 0.25 });
    s.addText("Spaces", {
      x: col2X + 0.45, y: 1.1, w: 3, h: 0.3,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.green, shrinkText: true
    });
    s.addText("チームメンバーとスレッド・\nコレクションを共有\n\nワークスペースで情報の\n属人化を防止", {
      x: col2X + 0.15, y: 1.5, w: colW - 0.3, h: 1.4,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textBody, lineSpacingMultiple: 1.3, shrinkText: true
    });

    // Example
    s.addImage({ data: ic.bulb, x: L.mx, y: 3.6, w: 0.22, h: 0.22 });
    s.addText("例：営業チームで「商談先企業リサーチ」Spaceを作成 → メンバーの調査結果がチームのナレッジに", {
      x: L.mx + 0.3, y: 3.55, w: L.W - L.mx * 2 - 0.35, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans, italic: true,
      color: C.textLight, valign: "middle", shrinkText: true
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
      { num: "1", text: "既存業務の置き換えから始める", desc: "Google検索の代わりにPerplexityを使う" },
      { num: "2", text: "1日3回、意識的に使う", desc: "朝：ニュース / 昼：調べもの / 夕：翌日準備" },
      { num: "3", text: "週次で振り返り", desc: "「Perplexityで解決できた業務」をメモする" },
    ];

    steps.forEach((st, i) => {
      const y = 1.0 + i * 1.1;
      s.addText(st.num, {
        x: L.mx, y: y + 0.05, w: 0.5, h: 0.5,
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
        x: L.mx + 0.7, y: y + 0.35, w: 7.5, h: 0.3,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textLight, valign: "middle", shrinkText: true
      });
    });

    // Motivation
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.2, w: L.W - L.mx * 2, h: 0.4,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    s.addText("2週間続ければ習慣化。小さな成功体験の積み重ねがカギ", {
      x: L.mx, y: 4.2, w: L.W - L.mx * 2, h: 0.4,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.accent, align: "center", valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 11: SUMMARY — All 5 Courses
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "まとめ — Perplexity研修 全5回の振り返り", "SUMMARY");
    addFooter(s, 11, T);

    const courses = [
      { id: "P-01", text: "なぜ今Perplexityなのか（AI検索の価値）" },
      { id: "P-02", text: "基本操作（検索・対話・出典確認）" },
      { id: "P-03", text: "高度な検索テクニック（Focus・Pro Search）" },
      { id: "P-04", text: "Google検索との使い分け" },
      { id: "P-05", text: "業務での実践活用（← 今日）" },
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

    // Test info
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.3, w: L.W - L.mx * 2, h: 0.4,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    s.addText("確認テスト：5問中4問正解で修了", {
      x: L.mx, y: 4.3, w: L.W - L.mx * 2, h: 0.4,
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
    s.addImage({ data: ic.grad, x: (L.W - 0.6) / 2, y: 1.2, w: 0.6, h: 0.6 });
    s.addText("Perplexity研修 完了！", {
      x: 0.5, y: 2.0, w: 9, h: 0.7,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center", shrinkText: true
    });
    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 2.85, w: 3, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });
    s.addText("AI検索を武器に、業務をもっと効率的に", {
      x: 0.5, y: 3.05, w: 9, h: 0.45,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", shrinkText: true
    });
    s.addText("全5回修了おめでとうございます", {
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
