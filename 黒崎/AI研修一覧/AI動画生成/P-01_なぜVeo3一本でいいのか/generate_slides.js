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
  pres.title = "P-01: なぜVeo 3一本でいいのか";

  const T = 12;

  // ============================================================
  // SLIDE 1: TITLE (navy)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };

    s.addText("AI動画生成で\nSNS・プロモーション動画を制作する", {
      x: 0.5, y: 1.2, w: 9, h: 1.4,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center", lineSpacingMultiple: 1.2
    });

    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 2.85, w: 3, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });

    s.addText("Pack 6  |  Lecture 8", {
      x: 0.5, y: 3.1, w: 9, h: 0.5,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center"
    });

    s.addText("P-01   |   なぜVeo 3一本でいいのか   |   約12分", {
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
      "AI動画生成の全体像を理解し、自分の業務での活用イメージが持てる",
      "従来の動画制作の課題（コスト・時間・スキル）を整理できる",
      "Veo 3が他のツールと何が違うのかを説明できる",
      "自分に合った料金プランを選べる",
      "Veo 3の得意・不得意を理解し、適切な用途で活用できる",
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
      { id: "P-01", title: "なぜVeo 3一本でいいのか", time: "12分", current: true },
      { id: "P-02", title: "Veo 3の基本操作", time: "15分", current: false },
      { id: "P-03", title: "プロンプト設計マスター", time: "15分", current: false },
      { id: "P-04", title: "SNS × PDCA戦略", time: "12分", current: false },
      { id: "P-05", title: "業界別テンプレートと実践", time: "15分", current: false },
    ];

    // Table header
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
    addSectionTitle(s, "動画制作の4つの壁", pres);
    addFooter(s, 4, T, pres);

    const walls = [
      { title: "コスト", desc: "外注1本30万円〜", emoji: "\uD83D\uDCB0", color: C.red },
      { title: "時間", desc: "企画〜納品まで数週間", emoji: "\u23F0", color: C.amber },
      { title: "スキル", desc: "Premiere Pro等の\n専門ソフトが必要", emoji: "\uD83C\uDFAC", color: C.accent },
      { title: "ツール", desc: "3つ以上のツールを\n使い分け", emoji: "\uD83D\uDD27", color: C.navyLight },
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

    // Bottom message
    addCard(s, pres, L.mx, 4.3, L.W - L.mx * 2, 0.5, { fill: C.redBg });
    s.addText("これらの壁が、多くの人にとって動画制作を遠ざけていた", {
      x: L.mx, y: 4.3, w: L.W - L.mx * 2, h: 0.5,
      fontSize: F.size.body, fontFace: F.sans, bold: true, color: C.red, align: "center", valign: "middle"
    });
  }

  // ============================================================
  // SLIDE 5: COMPARISON TABLE
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, 'Veo 3が「一本で済む」理由', pres);
    addFooter(s, 5, T, pres);

    // Table header
    const tblY = 1.2;
    const colW = [3.0, 2.8, 2.7];
    const colX = [L.mx, L.mx + colW[0], L.mx + colW[0] + colW[1]];
    const totalW = colW[0] + colW[1] + colW[2];

    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: tblY, w: totalW, h: 0.5,
      fill: { color: C.navy }, rectRadius: 0.05
    });
    ["機能", "従来（複数ツール）", "Veo 3"].forEach((t, i) => {
      s.addText(t, {
        x: colX[i] + 0.1, y: tblY, w: colW[i] - 0.2, h: 0.5,
        fontSize: F.size.label, fontFace: F.sans, bold: true, color: C.white, valign: "middle",
        align: i === 0 ? "left" : "center"
      });
    });

    const rows = [
      { func: "映像生成", old: "Runway", veo: "\u2705" },
      { func: "アバター・口パク", old: "HeyGen", veo: "\u2705" },
      { func: "ナレーション・音声", old: "ElevenLabs", veo: "\u2705" },
      { func: "BGM・効果音", old: "素材サイト", veo: "\u2705" },
    ];

    rows.forEach((r, i) => {
      const y = tblY + 0.55 + i * 0.6;
      const bg = i % 2 === 0 ? C.offWhite : C.white;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: totalW, h: 0.55, fill: { color: bg }
      });
      s.addText(r.func, {
        x: colX[0] + 0.1, y, w: colW[0] - 0.2, h: 0.55,
        fontSize: F.size.body, fontFace: F.sans, bold: true, color: C.textDark, valign: "middle"
      });
      s.addText(r.old, {
        x: colX[1] + 0.1, y, w: colW[1] - 0.2, h: 0.55,
        fontSize: F.size.body, fontFace: F.sans, color: C.textLight, valign: "middle", align: "center"
      });
      s.addText(r.veo, {
        x: colX[2] + 0.1, y, w: colW[2] - 0.2, h: 0.55,
        fontSize: F.size.body, fontFace: F.sans, color: C.green, valign: "middle", align: "center"
      });
    });

    // Bottom CTA
    addCard(s, pres, L.mx, 4.0, totalW, 0.65, { fill: C.accentLight });
    s.addText("Veo 3 = オールインワン\u2014\u20144つのツールが1つに", {
      x: L.mx, y: 4.0, w: totalW, h: 0.65,
      fontSize: F.size.h3, fontFace: F.sans, bold: true, color: C.accent, align: "center", valign: "middle"
    });
  }

  // ============================================================
  // SLIDE 6: SIMULTANEOUS GENERATION
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "Veo 3の最大の武器：映像＋音声の同時生成", pres);
    addFooter(s, 6, T, pres);

    const features = [
      { title: "BGM", desc: "シーンに合った音楽を\n自動生成", emoji: "\uD83C\uDFB5", color: C.accent },
      { title: "効果音", desc: "ドアの音、足音、\n環境音まで", emoji: "\uD83D\uDD0A", color: C.green },
      { title: "セリフ", desc: "キャラクターの声＋\nリップシンク自動対応", emoji: "\uD83D\uDDE3\uFE0F", color: C.amber },
    ];

    features.forEach((f, i) => {
      const x = L.mx + i * 2.9;
      addCard(s, pres, x, 1.2, 2.6, 2.3, { fill: C.white, borderTop: f.color });

      s.addText(f.emoji, {
        x, y: 1.4, w: 2.6, h: 0.7,
        fontSize: 40, fontFace: F.sans, align: "center", valign: "middle"
      });

      s.addText(f.title, {
        x: x + 0.1, y: 2.15, w: 2.4, h: 0.4,
        fontSize: F.size.h3, fontFace: F.sans, bold: true, color: C.textDark, align: "center"
      });

      s.addText(f.desc, {
        x: x + 0.1, y: 2.6, w: 2.4, h: 0.7,
        fontSize: F.size.body, fontFace: F.sans, color: C.textBody, align: "center"
      });
    });

    // Bottom highlight
    addCard(s, pres, L.mx, 3.8, L.W - L.mx * 2, 0.7, { fill: C.navy });
    s.addText("すべてプロンプトで指示するだけ \u2014 制作時間を劇的に短縮", {
      x: L.mx, y: 3.8, w: L.W - L.mx * 2, h: 0.7,
      fontSize: F.size.h3, fontFace: F.sans, bold: true, color: C.white, align: "center", valign: "middle"
    });
  }

  // ============================================================
  // SLIDE 7: PRICING
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "料金プラン比較", pres);
    addFooter(s, 7, T, pres);

    const plans = [
      {
        name: "無料プラン", price: "\uFFE50", sub: "Veo 3利用不可",
        features: ["基本AI機能", "お試し向け"], recommended: false, color: C.textLight
      },
      {
        name: "AI Pro", price: "\uFFE52,900/月", sub: "初月無料",
        features: ["Veo 3利用可", "1日3本目安", "SNS運用に最適"], recommended: true, color: C.accent
      },
      {
        name: "AI Ultra", price: "\uFFE536,400/月", sub: "最高画質",
        features: ["大量生成対応", "ヘビーユース向け"], recommended: false, color: C.navyLight
      },
    ];

    plans.forEach((p, i) => {
      const x = L.mx + i * 2.9;
      const cardH = 3.1;
      addCard(s, pres, x, 1.2, 2.6, cardH, {
        fill: p.recommended ? C.accentLight : C.white,
        borderTop: p.color
      });

      if (p.recommended) {
        s.addShape(pres.shapes.RECTANGLE, {
          x: x + 0.6, y: 1.2, w: 1.4, h: 0.3,
          fill: { color: C.accent }, rectRadius: 0.15
        });
        s.addText("\u2B50 \u63A8\u5968", {
          x: x + 0.6, y: 1.2, w: 1.4, h: 0.3,
          fontSize: F.size.tag, fontFace: F.sans, bold: true,
          color: C.white, align: "center", valign: "middle"
        });
      }

      s.addText(p.name, {
        x: x + 0.1, y: p.recommended ? 1.55 : 1.4, w: 2.4, h: 0.35,
        fontSize: F.size.h3, fontFace: F.sans, bold: true, color: C.textDark, align: "center"
      });

      s.addText(p.price, {
        x: x + 0.1, y: p.recommended ? 1.95 : 1.8, w: 2.4, h: 0.45,
        fontSize: F.size.h2, fontFace: F.sans, bold: true, color: p.color, align: "center"
      });

      s.addText(p.sub, {
        x: x + 0.1, y: p.recommended ? 2.4 : 2.25, w: 2.4, h: 0.3,
        fontSize: F.size.label, fontFace: F.sans, color: p.recommended ? C.accent : C.textMuted, align: "center"
      });

      p.features.forEach((feat, fi) => {
        s.addText("\u2022 " + feat, {
          x: x + 0.3, y: (p.recommended ? 2.75 : 2.6) + fi * 0.35, w: 2.0, h: 0.3,
          fontSize: F.size.label, fontFace: F.sans, color: C.textBody
        });
      });
    });
  }

  // ============================================================
  // SLIDE 8: COST COMPARISON
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "コスト比較: 外注 vs Veo 3", pres);
    addFooter(s, 8, T, pres);

    // Scenario label
    s.addText("SNSショート動画 10本/月を制作した場合", {
      x: L.mx, y: 1.1, w: 8, h: 0.35,
      fontSize: F.size.body, fontFace: F.sans, color: C.textLight
    });

    // Two columns
    // Left: 外注
    addCard(s, pres, L.mx, 1.6, 3.8, 2.5, { fill: C.white, borderTop: C.red });
    s.addText("外注", {
      x: L.mx + 0.15, y: 1.75, w: 3.5, h: 0.4,
      fontSize: F.size.h3, fontFace: F.sans, bold: true, color: C.red
    });
    s.addText("1本3万円 \u00D7 10本", {
      x: L.mx + 0.15, y: 2.2, w: 3.5, h: 0.3,
      fontSize: F.size.body, fontFace: F.sans, color: C.textBody
    });
    s.addText("\u6708\u984D 30\u4E07\u5186", {
      x: L.mx + 0.15, y: 2.55, w: 3.5, h: 0.4,
      fontSize: F.size.h2, fontFace: F.sans, bold: true, color: C.red
    });
    s.addText("\u5E74\u9593 360\u4E07\u5186", {
      x: L.mx + 0.15, y: 3.0, w: 3.5, h: 0.35,
      fontSize: F.size.h3, fontFace: F.sans, color: C.red
    });

    // VS
    s.addText("VS", {
      x: 4.55, y: 2.4, w: 0.9, h: 0.5,
      fontSize: F.size.h2, fontFace: F.sans, bold: true, color: C.textMuted, align: "center", valign: "middle"
    });

    // Right: Veo 3
    addCard(s, pres, 5.45, 1.6, 3.8, 2.5, { fill: C.white, borderTop: C.green });
    s.addText("Veo 3 (AI Pro)", {
      x: 5.6, y: 1.75, w: 3.5, h: 0.4,
      fontSize: F.size.h3, fontFace: F.sans, bold: true, color: C.green
    });
    s.addText("AI Pro\u30D7\u30E9\u30F3\u3067\u751F\u6210\u3057\u653E\u984C", {
      x: 5.6, y: 2.2, w: 3.5, h: 0.3,
      fontSize: F.size.body, fontFace: F.sans, color: C.textBody
    });
    s.addText("\u6708\u984D 2,900\u5186", {
      x: 5.6, y: 2.55, w: 3.5, h: 0.4,
      fontSize: F.size.h2, fontFace: F.sans, bold: true, color: C.green
    });
    s.addText("\u5E74\u9593 34,800\u5186", {
      x: 5.6, y: 3.0, w: 3.5, h: 0.35,
      fontSize: F.size.h3, fontFace: F.sans, color: C.green
    });

    // Saving highlight
    addCard(s, pres, L.mx, 4.3, L.W - L.mx * 2, 0.6, { fill: C.greenBg });
    s.addText("\u5E74\u9593\u524A\u6E1B\u984D: \u7D04325\u4E07\u5186 \u2014 \u4EBA\u4EF6\u8CBB1\u4EBA\u5206\u306B\u76F8\u5F53", {
      x: L.mx, y: 4.3, w: L.W - L.mx * 2, h: 0.6,
      fontSize: F.size.h3, fontFace: F.sans, bold: true, color: C.green, align: "center", valign: "middle"
    });
  }

  // ============================================================
  // SLIDE 9: START WITH PRO
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "まずはProプランで始める", pres);
    addFooter(s, 9, T, pres);

    // Calculation flow
    const items = ["1\u65E53\u672C", "\u00D7 30\u65E5", "= \u6708\u306990\u672C"];
    items.forEach((item, i) => {
      const x = L.mx + i * 2.9;
      addCard(s, pres, x, 1.3, 2.3, 0.7, { fill: C.accentLight });
      s.addText(item, {
        x, y: 1.3, w: 2.3, h: 0.7,
        fontSize: F.size.h2, fontFace: F.sans, bold: true,
        color: C.accent, align: "center", valign: "middle"
      });
      if (i < 2) {
        s.addText("\u25B6", {
          x: x + 2.35, y: 1.45, w: 0.4, h: 0.4,
          fontSize: F.size.body, fontFace: F.sans, color: C.accent, align: "center", valign: "middle"
        });
      }
    });

    // Key points
    const points = [
      { text: "\u521D\u6708\u7121\u6599\u3067\u4ECA\u65E5\u304B\u3089\u8A66\u305B\u308B", color: C.green },
      { text: "\u30D7\u30ED\u30F3\u30D7\u30C8\u3092\u5165\u529B\u3057\u3066\u751F\u6210\u30DC\u30BF\u30F3\u3092\u62BC\u3059\u3060\u3051", color: C.accent },
      { text: "\u6570\u5206\u3067\u52D5\u753B\u304C\u5B8C\u6210", color: C.accent },
    ];
    points.forEach((p, i) => {
      const y = 2.4 + i * 0.65;
      addCard(s, pres, L.mx, y, L.W - L.mx * 2, 0.55, { fill: C.offWhite, borderTop: p.color });
      s.addText("\u2713  " + p.text, {
        x: L.mx + 0.2, y, w: 8, h: 0.55,
        fontSize: F.size.h3, fontFace: F.sans, color: C.textDark, valign: "middle"
      });
    });

    // Bottom CTA
    addCard(s, pres, L.mx + 1.5, 4.3, L.W - L.mx * 2 - 3, 0.6, { fill: C.accent });
    s.addText("\u4ECA\u65E5\u3053\u306E\u8B1B\u5EA7\u3092\u898B\u7D42\u308F\u3063\u305F\u3089\u3001\u3059\u3050\u306B\u59CB\u3081\u3089\u308C\u307E\u3059", {
      x: L.mx + 1.5, y: 4.3, w: L.W - L.mx * 2 - 3, h: 0.6,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.white, align: "center", valign: "middle"
    });
  }

  // ============================================================
  // SLIDE 10: CAN / CANNOT
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "Veo 3でできること / できないこと", pres);
    addFooter(s, 10, T, pres);

    // Left column: できること
    const canX = L.mx;
    const canW = 4.0;
    addCard(s, pres, canX, 1.2, canW, 3.3, { fill: C.white, borderTop: C.green });
    s.addText("\u2705 できること", {
      x: canX + 0.15, y: 1.35, w: 3.7, h: 0.4,
      fontSize: F.size.h3, fontFace: F.sans, bold: true, color: C.green
    });

    const canItems = [
      "SNSショート動画（15〜60秒）",
      "プロモーション・広告動画",
      "ナレーション付き解説動画",
      "BGM・効果音付き映像",
    ];
    canItems.forEach((item, i) => {
      s.addText("\u2022 " + item, {
        x: canX + 0.3, y: 1.85 + i * 0.55, w: 3.5, h: 0.4,
        fontSize: F.size.body, fontFace: F.sans, color: C.textBody
      });
    });

    // Right column: できないこと
    const cantX = L.mx + canW + 0.5;
    const cantW = 4.0;
    addCard(s, pres, cantX, 1.2, cantW, 3.3, { fill: C.white, borderTop: C.red });
    s.addText("\u26A0\uFE0F できないこと", {
      x: cantX + 0.15, y: 1.35, w: 3.7, h: 0.4,
      fontSize: F.size.h3, fontFace: F.sans, bold: true, color: C.red
    });

    const cantItems = [
      "長尺動画（2分以上の一括生成）",
      "複数人の顔の一貫性維持",
      "日本語セリフの発音精度",
      "実写レベルの細密描写",
    ];
    cantItems.forEach((item, i) => {
      s.addText("\u2022 " + item, {
        x: cantX + 0.3, y: 1.85 + i * 0.55, w: 3.5, h: 0.4,
        fontSize: F.size.body, fontFace: F.sans, color: C.textBody
      });
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
      { text: "動画制作の壁（コスト・時間・スキル・ツール）をVeo 3が解消する", color: C.accent },
      { text: "映像＋音声の同時生成がVeo 3の最大の武器", color: C.green },
      { text: "AI Proプラン月2,900円（初月無料）で月90本、年間325万円削減", color: C.amber },
      { text: "得意・不得意を理解し、SNSショート動画から始める", color: C.accent },
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

    s.addText("P-01   |   なぜVeo 3一本でいいのか   |   完了", {
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
