const pptxgen = require("pptxgenjs");

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
    hero: 40, h1: 32, h2: 22, h3: 18, body: 16, label: 13, caption: 11, tag: 10,
  }
};

const L = { W: 10, H: 5.625, mx: 0.75, my: 0.5, gap: 0.3 };

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
  slide.addText("P-01", {
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

function addNumberCircle(slide, pres, x, y, num, color) {
  color = color || C.accent;
  slide.addShape(pres.shapes.OVAL, {
    x, y, w: 0.35, h: 0.35, fill: { color }
  });
  slide.addText(`${num}`, {
    x, y, w: 0.35, h: 0.35,
    fontSize: F.size.label, fontFace: F.sans, bold: true,
    color: C.white, align: "center", valign: "middle"
  });
}

async function main() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "Gorilla Knowledge";
  pres.title = "P-01: なぜAIで資料を作るべきなのか";

  const T = 12;

  // ============================================================
  // SLIDE 1: TITLE (navy)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };

    s.addText("AIプレゼン＆資料作成で\nクライアント提案を加速する", {
      x: 0.5, y: 1.2, w: 9, h: 1.4,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center", lineSpacingMultiple: 1.2
    });

    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 2.85, w: 3, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });

    s.addText("Pack 6  |  Lecture 9", {
      x: 0.5, y: 3.1, w: 9, h: 0.5,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center"
    });

    s.addText("P-01   |   なぜAIで資料を作るべきなのか   |   約12分", {
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
    addSectionTitle(s, "この講義が終わったら、あなたは...", pres);
    addFooter(s, 2, T, pres);

    const goals = [
      "Claudeで提案書の構成を設計できる",
      "プロ品質のスライドを自動生成できる",
      "「リサーチ→構成→ビジュアル化」のワークフローが確立できる",
      "PowerPointに依存しない資料作成ができる",
      "5分で資料が完成する体験をしている",
    ];

    goals.forEach((g, i) => {
      const y = 1.15 + i * 0.72;
      addCard(s, pres, L.mx, y, L.W - L.mx * 2, 0.6, { borderTop: C.accent });
      addNumberCircle(s, pres, L.mx + 0.15, y + 0.13, i + 1);
      s.addText(g, {
        x: L.mx + 0.65, y: y + 0.05, w: 7.5, h: 0.5,
        fontSize: F.size.body, fontFace: F.sans, color: C.textBody
      });
    });
  }

  // ============================================================
  // SLIDE 3: AGENDA
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "今日のアジェンダ", pres);
    addFooter(s, 3, T, pres);

    const parts = [
      { id: "P-01", title: "なぜAIで資料を作るべきなのか", time: "12分", current: true },
      { id: "P-02", title: "Claudeで提案書を設計する", time: "12分", current: false },
      { id: "P-03", title: "Claudeでスライド化する", time: "15分", current: false },
      { id: "P-04", title: "業務別テンプレート実践", time: "15分", current: false },
      { id: "P-05", title: "最強ワークフローと総まとめ", time: "12分", current: false },
    ];

    const hdrY = 1.15;
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: hdrY, w: L.W - L.mx * 2, h: 0.45,
      fill: { color: C.navy }, rectRadius: 0.05
    });
    s.addText("パート", {
      x: L.mx + 0.15, y: hdrY, w: 1.2, h: 0.45,
      fontSize: F.size.label, fontFace: F.sans, bold: true, color: C.white, valign: "middle"
    });
    s.addText("テーマ", {
      x: L.mx + 1.5, y: hdrY, w: 5, h: 0.45,
      fontSize: F.size.label, fontFace: F.sans, bold: true, color: C.white, valign: "middle"
    });
    s.addText("時間", {
      x: L.W - L.mx - 1.2, y: hdrY, w: 1.2, h: 0.45,
      fontSize: F.size.label, fontFace: F.sans, bold: true, color: C.white, valign: "middle", align: "center"
    });

    parts.forEach((p, i) => {
      const y = hdrY + 0.5 + i * 0.65;
      const bg = p.current ? C.accentLight : (i % 2 === 0 ? C.offWhite : C.white);
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.55,
        fill: { color: bg }, rectRadius: 0.04
      });
      s.addText(p.id, {
        x: L.mx + 0.15, y, w: 1.2, h: 0.55,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: p.current ? C.accent : C.textDark, valign: "middle"
      });
      s.addText(p.title + (p.current ? "  \u25C0 NOW" : ""), {
        x: L.mx + 1.5, y, w: 5, h: 0.55,
        fontSize: F.size.body, fontFace: F.sans,
        color: p.current ? C.accent : C.textBody, valign: "middle",
        bold: p.current
      });
      s.addText(p.time, {
        x: L.W - L.mx - 1.2, y, w: 1.2, h: 0.55,
        fontSize: F.size.body, fontFace: F.sans, color: C.textLight, valign: "middle", align: "center"
      });
    });
  }

  // ============================================================
  // SLIDE 4: 4 WALLS
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "資料作成の4つの壁", pres);
    addFooter(s, 4, T, pres);

    const walls = [
      { title: "デザイン", desc: "デザインに\n時間がかかる", emoji: "\uD83C\uDFA8", color: C.red },
      { title: "見た目偏重", desc: "内容より見た目に\n集中してしまう", emoji: "\uD83D\uDC41\uFE0F", color: C.amber },
      { title: "テンプレ依存", desc: "テンプレートから\n抜け出せない", emoji: "\uD83D\uDD04", color: C.accent },
      { title: "修正で崩壊", desc: "修正のたびに\nレイアウトが崩れる", emoji: "\uD83D\uDCA5", color: C.navyLight },
    ];

    walls.forEach((w, i) => {
      const x = L.mx + i * 2.15;
      addCard(s, pres, x, 1.3, 1.95, 2.8, { fill: C.white, borderTop: w.color });

      s.addText(w.emoji, {
        x, y: 1.5, w: 1.95, h: 0.7,
        fontSize: 36, fontFace: F.sans, align: "center", valign: "middle"
      });

      s.addText(w.title, {
        x: x + 0.1, y: 2.3, w: 1.75, h: 0.4,
        fontSize: F.size.h3, fontFace: F.sans, bold: true, color: C.textDark, align: "center"
      });

      s.addText(w.desc, {
        x: x + 0.1, y: 2.75, w: 1.75, h: 0.8,
        fontSize: F.size.label, fontFace: F.sans, color: C.textBody, align: "center"
      });
    });

    addCard(s, pres, L.mx, 4.3, L.W - L.mx * 2, 0.5, { fill: C.redBg });
    s.addText("これらの壁が、資料作成を苦痛な作業にしている", {
      x: L.mx, y: 4.3, w: L.W - L.mx * 2, h: 0.5,
      fontSize: F.size.body, fontFace: F.sans, bold: true, color: C.red, align: "center", valign: "middle"
    });
  }

  // ============================================================
  // SLIDE 5: PowerPoint vs Claude
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "PowerPoint vs Claude", pres);
    addFooter(s, 5, T, pres);

    const tblY = 1.2;
    const colW = [2.4, 2.8, 3.3];
    const colX = [L.mx, L.mx + colW[0], L.mx + colW[0] + colW[1]];
    const totalW = colW[0] + colW[1] + colW[2];

    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: tblY, w: totalW, h: 0.5,
      fill: { color: C.navy }, rectRadius: 0.05
    });
    ["項目", "PowerPoint", "Claude"].forEach((t, i) => {
      s.addText(t, {
        x: colX[i] + 0.1, y: tblY, w: colW[i] - 0.2, h: 0.5,
        fontSize: F.size.label, fontFace: F.sans, bold: true, color: C.white, valign: "middle",
        align: i === 0 ? "left" : "center"
      });
    });

    const rows = [
      { item: "時間", ppt: "3〜5時間", claude: "5〜10分" },
      { item: "デザイン", ppt: "テンプレ依存", claude: "AI自動生成" },
      { item: "修正", ppt: "レイアウト崩れる", claude: "プロンプトで一発" },
      { item: "構成力", ppt: "自分で考える", claude: "AIが提案" },
      { item: "コスト", ppt: "Office 365契約", claude: "無料プランあり" },
    ];

    rows.forEach((r, i) => {
      const y = tblY + 0.55 + i * 0.55;
      const bg = i % 2 === 0 ? C.offWhite : C.white;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: totalW, h: 0.5, fill: { color: bg }
      });
      s.addText(r.item, {
        x: colX[0] + 0.1, y, w: colW[0] - 0.2, h: 0.5,
        fontSize: F.size.body, fontFace: F.sans, bold: true, color: C.textDark, valign: "middle"
      });
      s.addText(r.ppt, {
        x: colX[1] + 0.1, y, w: colW[1] - 0.2, h: 0.5,
        fontSize: F.size.body, fontFace: F.sans, color: C.textLight, valign: "middle", align: "center"
      });
      s.addText(r.claude, {
        x: colX[2] + 0.1, y, w: colW[2] - 0.2, h: 0.5,
        fontSize: F.size.body, fontFace: F.sans, color: C.green, valign: "middle", align: "center",
        bold: true
      });
    });

    addCard(s, pres, L.mx, 4.1, totalW, 0.6, { fill: C.accentLight });
    s.addText("Claudeなら5分で完成 — 10倍以上の時間短縮", {
      x: L.mx, y: 4.1, w: totalW, h: 0.6,
      fontSize: F.size.h3, fontFace: F.sans, bold: true, color: C.accent, align: "center", valign: "middle"
    });
  }

  // ============================================================
  // SLIDE 6: WHY CLAUDE
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "Claudeが資料作成に最適な理由", pres);
    addFooter(s, 6, T, pres);

    const reasons = [
      { num: "1", title: "構成力が圧倒的", desc: "伝えたい内容を論理的に整理", color: C.accent },
      { num: "2", title: "Markdown→スライド変換が綺麗", desc: "構造化された出力でそのまま使える", color: C.green },
      { num: "3", title: "修正が対話で完結", desc: "「ここを直して」で即反映", color: C.amber },
      { num: "4", title: "無料で使える", desc: "追加コストゼロで始められる", color: C.accent },
    ];

    reasons.forEach((r, i) => {
      const y = 1.15 + i * 0.9;
      addCard(s, pres, L.mx, y, L.W - L.mx * 2, 0.75, { fill: C.offWhite, borderTop: r.color });
      addNumberCircle(s, pres, L.mx + 0.15, y + 0.2, r.num, r.color);
      s.addText(r.title, {
        x: L.mx + 0.65, y: y + 0.05, w: 4, h: 0.35,
        fontSize: F.size.h3, fontFace: F.sans, bold: true, color: C.textDark
      });
      s.addText(r.desc, {
        x: L.mx + 0.65, y: y + 0.38, w: 7, h: 0.3,
        fontSize: F.size.body, fontFace: F.sans, color: C.textBody
      });
    });
  }

  // ============================================================
  // SLIDE 7: SIMPLE = PRO
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "「シンプルで見やすい」がプロ品質", pres);
    addFooter(s, 7, T, pres);

    const principles = [
      { title: "余白たっぷり", desc: "情報に呼吸の\n余地を与える", emoji: "\u2B1C", color: C.accent },
      { title: "1スライド\n1メッセージ", desc: "聞き手の\n集中力を保つ", emoji: "\uD83C\uDFAF", color: C.green },
      { title: "色は2〜3色", desc: "統一感を生む", emoji: "\uD83C\uDFA8", color: C.amber },
      { title: "フォント統一", desc: "視認性と\n信頼感", emoji: "\uD83D\uDDA4", color: C.navyLight },
    ];

    principles.forEach((p, i) => {
      const x = L.mx + i * 2.15;
      addCard(s, pres, x, 1.3, 1.95, 2.8, { fill: C.white, borderTop: p.color });

      s.addText(p.emoji, {
        x, y: 1.5, w: 1.95, h: 0.7,
        fontSize: 36, fontFace: F.sans, align: "center", valign: "middle"
      });

      s.addText(p.title, {
        x: x + 0.1, y: 2.3, w: 1.75, h: 0.55,
        fontSize: F.size.h3, fontFace: F.sans, bold: true, color: C.textDark, align: "center"
      });

      s.addText(p.desc, {
        x: x + 0.1, y: 2.85, w: 1.75, h: 0.7,
        fontSize: F.size.label, fontFace: F.sans, color: C.textBody, align: "center"
      });
    });

    addCard(s, pres, L.mx, 4.3, L.W - L.mx * 2, 0.5, { fill: C.accentLight });
    s.addText("この4原則を守れば、デザイン知識なしでもプロ品質", {
      x: L.mx, y: 4.3, w: L.W - L.mx * 2, h: 0.5,
      fontSize: F.size.body, fontFace: F.sans, bold: true, color: C.accent, align: "center", valign: "middle"
    });
  }

  // ============================================================
  // SLIDE 8: BAD vs GOOD
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "悪い資料 vs 良い資料", pres);
    addFooter(s, 8, T, pres);

    // Left: Bad
    const badX = L.mx;
    const cardW = 4.0;
    addCard(s, pres, badX, 1.2, cardW, 3.0, { fill: C.white, borderTop: C.red });
    s.addText("\u274C 悪い資料", {
      x: badX + 0.15, y: 1.35, w: 3.7, h: 0.4,
      fontSize: F.size.h3, fontFace: F.sans, bold: true, color: C.red
    });

    const badItems = [
      "テキストびっしり詰め込み",
      "色を5色以上使っている",
      "アニメーション過多",
    ];
    badItems.forEach((item, i) => {
      s.addText("\u2022 " + item, {
        x: badX + 0.3, y: 1.9 + i * 0.6, w: 3.5, h: 0.45,
        fontSize: F.size.body, fontFace: F.sans, color: C.textBody
      });
    });

    // Right: Good
    const goodX = L.mx + cardW + 0.5;
    addCard(s, pres, goodX, 1.2, cardW, 3.0, { fill: C.white, borderTop: C.green });
    s.addText("\u2705 良い資料", {
      x: goodX + 0.15, y: 1.35, w: 3.7, h: 0.4,
      fontSize: F.size.h3, fontFace: F.sans, bold: true, color: C.green
    });

    const goodItems = [
      "余白＋キーメッセージ",
      "2色で統一",
      "アニメーションなし",
    ];
    goodItems.forEach((item, i) => {
      s.addText("\u2022 " + item, {
        x: goodX + 0.3, y: 1.9 + i * 0.6, w: 3.5, h: 0.45,
        fontSize: F.size.body, fontFace: F.sans, color: C.textBody
      });
    });

    addCard(s, pres, L.mx, 4.4, L.W - L.mx * 2, 0.5, { fill: C.greenBg });
    s.addText("Claudeに作らせると、自然に「良い資料」になる", {
      x: L.mx, y: 4.4, w: L.W - L.mx * 2, h: 0.5,
      fontSize: F.size.body, fontFace: F.sans, bold: true, color: C.green, align: "center", valign: "middle"
    });
  }

  // ============================================================
  // SLIDE 9: WHAT YOU CAN CREATE
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "この講座で作れるようになるもの", pres);
    addFooter(s, 9, T, pres);

    const docs = [
      { title: "提案書", desc: "クライアントへの\n提案資料", emoji: "\uD83D\uDCC4", color: C.accent },
      { title: "企画書", desc: "新規プロジェクトの\n企画書", emoji: "\uD83D\uDCA1", color: C.green },
      { title: "報告書", desc: "月次・週次\nレポート", emoji: "\uD83D\uDCCA", color: C.amber },
      { title: "研修資料", desc: "社内研修の\nスライド", emoji: "\uD83C\uDF93", color: C.navyLight },
      { title: "営業資料", desc: "商品・サービス\n紹介", emoji: "\uD83D\uDCBC", color: C.red },
    ];

    docs.forEach((d, i) => {
      const x = L.mx + i * 1.75;
      addCard(s, pres, x, 1.3, 1.55, 2.8, { fill: C.white, borderTop: d.color });

      s.addText(d.emoji, {
        x, y: 1.5, w: 1.55, h: 0.6,
        fontSize: 32, fontFace: F.sans, align: "center", valign: "middle"
      });

      s.addText(d.title, {
        x: x + 0.05, y: 2.2, w: 1.45, h: 0.35,
        fontSize: F.size.h3, fontFace: F.sans, bold: true, color: C.textDark, align: "center"
      });

      s.addText(d.desc, {
        x: x + 0.05, y: 2.6, w: 1.45, h: 0.8,
        fontSize: F.size.label, fontFace: F.sans, color: C.textBody, align: "center"
      });
    });

    addCard(s, pres, L.mx, 4.3, L.W - L.mx * 2, 0.5, { fill: C.accentLight });
    s.addText("すべてClaudeに内容を伝えるだけで、構成からデザインまで一気に完成", {
      x: L.mx, y: 4.3, w: L.W - L.mx * 2, h: 0.5,
      fontSize: F.size.label, fontFace: F.sans, bold: true, color: C.accent, align: "center", valign: "middle"
    });
  }

  // ============================================================
  // SLIDE 10: COST COMPARISON
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "コスト比較: 外注デザイナー vs Claude", pres);
    addFooter(s, 10, T, pres);

    s.addText("提案書を月4本制作した場合", {
      x: L.mx, y: 1.1, w: 8, h: 0.35,
      fontSize: F.size.body, fontFace: F.sans, color: C.textLight
    });

    // Left: Designer
    addCard(s, pres, L.mx, 1.6, 3.8, 2.5, { fill: C.white, borderTop: C.red });
    s.addText("外注デザイナー", {
      x: L.mx + 0.15, y: 1.75, w: 3.5, h: 0.4,
      fontSize: F.size.h3, fontFace: F.sans, bold: true, color: C.red
    });
    s.addText("1本 5〜10万円 × 4本", {
      x: L.mx + 0.15, y: 2.2, w: 3.5, h: 0.3,
      fontSize: F.size.body, fontFace: F.sans, color: C.textBody
    });
    s.addText("月額 20〜40万円", {
      x: L.mx + 0.15, y: 2.55, w: 3.5, h: 0.4,
      fontSize: F.size.h2, fontFace: F.sans, bold: true, color: C.red
    });
    s.addText("年間 240〜480万円", {
      x: L.mx + 0.15, y: 3.0, w: 3.5, h: 0.35,
      fontSize: F.size.h3, fontFace: F.sans, color: C.red
    });

    // VS
    s.addText("VS", {
      x: 4.55, y: 2.4, w: 0.9, h: 0.5,
      fontSize: F.size.h2, fontFace: F.sans, bold: true, color: C.textMuted, align: "center", valign: "middle"
    });

    // Right: Claude
    addCard(s, pres, 5.45, 1.6, 3.8, 2.5, { fill: C.white, borderTop: C.green });
    s.addText("Claude（無料プラン）", {
      x: 5.6, y: 1.75, w: 3.5, h: 0.4,
      fontSize: F.size.h3, fontFace: F.sans, bold: true, color: C.green
    });
    s.addText("1本あたり 0円", {
      x: 5.6, y: 2.2, w: 3.5, h: 0.3,
      fontSize: F.size.body, fontFace: F.sans, color: C.textBody
    });
    s.addText("月額 0円", {
      x: 5.6, y: 2.55, w: 3.5, h: 0.4,
      fontSize: F.size.h2, fontFace: F.sans, bold: true, color: C.green
    });
    s.addText("年間 0円", {
      x: 5.6, y: 3.0, w: 3.5, h: 0.35,
      fontSize: F.size.h3, fontFace: F.sans, color: C.green
    });

    // Saving highlight
    addCard(s, pres, L.mx, 4.3, L.W - L.mx * 2, 0.6, { fill: C.greenBg });
    s.addText("年間削減額: 最大480万円 — 人件費1人分以上に相当", {
      x: L.mx, y: 4.3, w: L.W - L.mx * 2, h: 0.6,
      fontSize: F.size.h3, fontFace: F.sans, bold: true, color: C.green, align: "center", valign: "middle"
    });
  }

  // ============================================================
  // SLIDE 11: SUMMARY
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "まとめ", pres);
    addFooter(s, 11, T, pres);

    const summaryPoints = [
      { text: "資料作成の壁（デザイン・見た目偏重・テンプレ依存・修正崩れ）をAIが解消", color: C.accent },
      { text: "Claudeなら構成力＋デザイン＋修正が対話で完結", color: C.green },
      { text: "「シンプルで見やすい」= プロ品質。余白・1メッセージ・2色・統一フォント", color: C.amber },
      { text: "外注コスト年間最大480万円をゼロにできる", color: C.accent },
    ];

    summaryPoints.forEach((p, i) => {
      const y = 1.15 + i * 0.9;
      addCard(s, pres, L.mx, y, L.W - L.mx * 2, 0.75, { fill: C.offWhite, borderTop: p.color });
      addNumberCircle(s, pres, L.mx + 0.15, y + 0.2, i + 1, p.color);
      s.addText(p.text, {
        x: L.mx + 0.65, y: y + 0.1, w: 7.5, h: 0.55,
        fontSize: F.size.body, fontFace: F.sans, color: C.textDark
      });
    });
  }

  // ============================================================
  // SLIDE 12: END (navy)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };

    s.addText("\u2705", {
      x: (L.W - 1) / 2, y: 1.0, w: 1, h: 0.8,
      fontSize: 48, fontFace: F.sans, align: "center", valign: "middle"
    });

    s.addText("確認テストに挑戦しましょう", {
      x: 0.5, y: 2.0, w: 9, h: 0.8,
      fontSize: F.size.h1, fontFace: F.sans, bold: true,
      color: C.white, align: "center"
    });

    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 3.0, w: 3, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });

    s.addText("5問の確認テスト（80%以上で合格）", {
      x: 0.5, y: 3.2, w: 9, h: 0.5,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textMuted, align: "center"
    });

    s.addText("P-01   |   なぜAIで資料を作るべきなのか   |   完了", {
      x: 0.5, y: 4.2, w: 9, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textMuted, align: "center"
    });
  }

  // ============================================================
  // SAVE
  // ============================================================
  const path = require("path");
  const outPath = path.join(__dirname, "スライド.pptx");
  await pres.writeFile({ fileName: outPath });
  console.log(`PPTX saved: ${outPath}`);
}

main().catch(err => { console.error(err); process.exit(1); });
