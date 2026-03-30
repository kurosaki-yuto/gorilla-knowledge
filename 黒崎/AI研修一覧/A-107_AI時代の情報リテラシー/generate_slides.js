const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const {
  FaSearch, FaShieldAlt, FaCheckCircle, FaExclamationTriangle,
  FaArrowRight, FaBullseye, FaLightbulb, FaGraduationCap,
  FaBook, FaChartBar, FaUserMd, FaBalanceScale, FaFileAlt,
  FaUsers, FaGlobe, FaCogs, FaTrophy, FaBrain, FaDatabase,
  FaNewspaper
} = require("react-icons/fa");

// =====================================================
// DESIGN SYSTEM
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
  sansBold: "Calibri",
  size: {
    hero: 44,
    h1: 32,
    h2: 22,
    h3: 18,
    body: 16,
    label: 13,
    caption: 11,
    tag: 10,
  }
};

const L = {
  W: 10,
  H: 5.625,
  mx: 0.75,
  my: 0.5,
  gap: 0.3,
};

// Icon helper
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
    fontSize: F.size.caption, fontFace: F.sans,
    color: C.textMuted, align: "right", margin: 0
  });
  slide.addText("A-107", {
    x: L.mx, y: L.H - 0.38, w: 2, h: 0.3,
    fontSize: F.size.caption, fontFace: F.sans,
    color: C.textMuted, align: "left", margin: 0
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
    fontSize: F.size.h2, fontFace: F.sans, bold: true,
    color: C.textDark, margin: 0, shrinkText: true
  });
}

async function main() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "Gorilla Knowledge";
  pres.title = "A-107: AI時代の情報リテラシー";

  // Pre-render icons
  const ic = {
    search: await icon(FaSearch, C.accent),
    shield: await icon(FaShieldAlt, C.green),
    check: await icon(FaCheckCircle, C.green),
    checkBlue: await icon(FaCheckCircle, C.accent),
    warn: await icon(FaExclamationTriangle, C.amber),
    warnRed: await icon(FaExclamationTriangle, C.red),
    arrow: await icon(FaArrowRight, C.accent),
    target: await icon(FaBullseye, C.accent),
    bulb: await icon(FaLightbulb, C.amber),
    grad: await icon(FaGraduationCap, C.accent),
    book: await icon(FaBook, C.red),
    chart: await icon(FaChartBar, C.amber),
    doctor: await icon(FaUserMd, C.red),
    balance: await icon(FaBalanceScale, C.green),
    file: await icon(FaFileAlt, C.accent),
    users: await icon(FaUsers, C.accent),
    globe: await icon(FaGlobe, C.accent),
    cogs: await icon(FaCogs, C.amber),
    trophy: await icon(FaTrophy, C.amber),
    brain: await icon(FaBrain, C.accent),
    db: await icon(FaDatabase, C.green),
    news: await icon(FaNewspaper, C.amber),
  };

  const T = 12;

  // ============================================================
  // SLIDE 1: TITLE
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };

    s.addImage({ data: ic.search, x: (L.W - 0.7) / 2, y: 1.0, w: 0.7, h: 0.7 });

    s.addText("AI時代の情報リテラシー", {
      x: 0.5, y: 1.9, w: 9, h: 0.9,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center", margin: 0
    });

    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 2.95, w: 3, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });

    s.addText("AIの嘘を見抜く力を身につける", {
      x: 0.5, y: 3.15, w: 9, h: 0.5,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", margin: 0
    });

    s.addText("A-107   |   全社員向け   |   20分", {
      x: 0.5, y: 4.2, w: 9, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textMuted, align: "center", margin: 0
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
      "ハルシネーション（AIの嘘）の仕組みと対策を実践できる",
      "AIの回答をファクトチェックする3ステップの手順を使える",
      "情報の信頼性を評価する基準（ソース確認・クロスチェック・専門家検証）を理解する",
    ];

    goals.forEach((g, i) => {
      const y = 1.25 + i * 1.15;
      s.addText(String(i + 1), {
        x: L.mx, y: y + 0.05, w: 0.55, h: 0.55,
        fontSize: F.size.h2, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: C.accent }, shape: pres.shapes.OVAL
      });
      s.addText(g, {
        x: L.mx + 0.8, y, w: 7.5, h: 0.65,
        fontSize: F.size.h3, fontFace: F.sans,
        color: C.textDark, valign: "middle", margin: 0
      });
      if (i < 2) {
        s.addShape(pres.shapes.LINE, {
          x: L.mx, y: y + 0.85, w: L.W - L.mx * 2, h: 0,
          line: { color: C.border, width: 0.5 }
        });
      }
    });
  }

  // ============================================================
  // SLIDE 3: HALLUCINATION (3-card)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "ハルシネーション — AIの「もっともらしいウソ」", pres, "CONCEPT");
    addFooter(s, 3, T, pres);

    const examples = [
      { ic: ic.book, label: "架空の論文引用", sub: "存在しない研究を\n著者名・雑誌名付きで生成", color: C.red, bgColor: C.redBg },
      { ic: ic.chart, label: "架空の統計データ", sub: "もっともらしい数字を\n出すが出典が存在しない", color: C.amber, bgColor: C.amberBg },
      { ic: ic.users, label: "架空の人物情報", sub: "実在しない人物の\nプロフィールを詳細に語る", color: C.red, bgColor: C.redBg },
    ];

    const cardW = 2.55;
    const cardGap = 0.3;
    const totalW = cardW * 3 + cardGap * 2;
    const startX = (L.W - totalW) / 2;

    examples.forEach((t, i) => {
      const x = startX + i * (cardW + cardGap);
      const y = 1.5;
      const h = 2.4;

      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h,
        fill: { color: C.white },
        line: { color: C.border, width: 0.75 }
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 0.06, fill: { color: t.color }
      });
      s.addShape(pres.shapes.OVAL, {
        x: x + (cardW - 0.6) / 2, y: y + 0.3, w: 0.6, h: 0.6,
        fill: { color: t.bgColor }
      });
      s.addImage({ data: t.ic, x: x + (cardW - 0.35) / 2, y: y + 0.43, w: 0.35, h: 0.35 });
      s.addText(t.label, {
        x, y: y + 1.1, w: cardW, h: 0.4,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, align: "center", margin: 0
      });
      s.addText(t.sub, {
        x: x + 0.15, y: y + 1.55, w: cardW - 0.3, h: 0.8,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textLight, align: "center", valign: "top", margin: 0
      });
    });

    // Bottom insight
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.25, w: L.W - L.mx * 2, h: 0.55, fill: { color: C.navy }
    });
    s.addText([
      { text: "原因: AIは ", options: { color: C.accentMid } },
      { text: "「次に来そうな言葉を予測している」", options: { color: C.white, bold: true } },
      { text: " だけ", options: { color: C.accentMid } },
    ], {
      x: L.mx + 0.3, y: 4.25, w: L.W - L.mx * 2 - 0.6, h: 0.55,
      fontSize: F.size.body, fontFace: F.sans,
      align: "center", valign: "middle"
    });
  }

  // ============================================================
  // SLIDE 4: DANGER ZONES (4-card)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "ハルシネーションが起きやすい場面", pres, "WARNING");
    addFooter(s, 4, T, pres);

    const zones = [
      { ic: ic.doctor, label: "専門知識", sub: "医療・法律・技術の詳細", color: C.red },
      { ic: ic.chart, label: "数値・統計", sub: "出典のない数字", color: C.amber },
      { ic: ic.news, label: "最新情報", sub: "学習データ以降の出来事", color: C.amber },
      { ic: ic.search, label: "マイナー情報", sub: "知名度の低い人物・組織", color: C.red },
    ];

    const cardW = 1.95;
    const cardGap = 0.25;
    const totalW2 = cardW * 4 + cardGap * 3;
    const startX2 = (L.W - totalW2) / 2;

    zones.forEach((z, i) => {
      const x = startX2 + i * (cardW + cardGap);
      const y = 1.3;
      const h = 3.2;

      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h,
        fill: { color: C.offWhite },
        line: { color: C.border, width: 0.5 }
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 0.06, fill: { color: z.color }
      });
      s.addImage({ data: z.ic, x: x + (cardW - 0.4) / 2, y: y + 0.35, w: 0.4, h: 0.4 });
      s.addText(z.label, {
        x, y: y + 0.9, w: cardW, h: 0.4,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, align: "center", margin: 0
      });
      s.addShape(pres.shapes.LINE, {
        x: x + 0.2, y: y + 1.4, w: cardW - 0.4, h: 0,
        line: { color: C.border, width: 0.5 }
      });
      s.addText(z.sub, {
        x: x + 0.1, y: y + 1.55, w: cardW - 0.2, h: 0.5,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textLight, align: "center", valign: "top", margin: 0
      });
    });
  }

  // ============================================================
  // SLIDE 5: FACT-CHECK 3 STEPS (flow diagram)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "ファクトチェック 3ステップ", pres, "METHOD");
    addFooter(s, 5, T, pres);

    const steps = [
      { num: "1", label: "ソース確認", desc: "「出典はどこ？」\nとAIに聞く", ic: ic.search, color: C.accent, bgColor: C.accentLight },
      { num: "2", label: "クロスチェック", desc: "別の情報源で\n裏を取る", ic: ic.globe, color: C.amber, bgColor: C.amberBg },
      { num: "3", label: "専門家検証", desc: "重要な判断は\n専門家に確認", ic: ic.shield, color: C.green, bgColor: C.greenBg },
    ];

    const stepW = 2.4;
    const stepGap = 0.5;
    const totalStepW = stepW * 3 + stepGap * 2;
    const startStepX = (L.W - totalStepW) / 2;

    steps.forEach((st, i) => {
      const x = startStepX + i * (stepW + stepGap);
      const y = 1.3;

      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: stepW, h: 3.0,
        fill: { color: C.white },
        line: { color: C.border, width: 0.75 }
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: stepW, h: 0.06, fill: { color: st.color }
      });

      // Number circle
      s.addText(st.num, {
        x: x + (stepW - 0.5) / 2, y: y + 0.25, w: 0.5, h: 0.5,
        fontSize: F.size.h2, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: st.color }, shape: pres.shapes.OVAL
      });

      s.addText(st.label, {
        x, y: y + 0.9, w: stepW, h: 0.45,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, align: "center", margin: 0
      });

      s.addShape(pres.shapes.LINE, {
        x: x + 0.3, y: y + 1.45, w: stepW - 0.6, h: 0,
        line: { color: C.border, width: 0.5 }
      });

      s.addText(st.desc, {
        x: x + 0.15, y: y + 1.6, w: stepW - 0.3, h: 0.7,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textLight, align: "center", valign: "top", margin: 0
      });

      // Arrow between steps
      if (i < 2) {
        s.addImage({ data: ic.arrow, x: x + stepW + 0.08, y: y + 1.2, w: 0.35, h: 0.35 });
      }
    });

    // Bottom insight
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.55, w: L.W - L.mx * 2, h: 0.5, fill: { color: C.accentLight }
    });
    s.addText("この3つを習慣にするだけで、AIの嘘に騙されるリスクは大きく下がる", {
      x: L.mx + 0.3, y: 4.55, w: L.W - L.mx * 2 - 0.6, h: 0.5,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.accent, align: "center", valign: "middle"
    });
  }

  // ============================================================
  // SLIDE 6: STEP 1 — SOURCE CHECK
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);

    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.35, w: 1.2, h: 0.28,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    s.addText("STEP 1", {
      x: L.mx, y: 0.35, w: 1.2, h: 0.28,
      fontSize: F.size.tag, fontFace: F.sans, bold: true,
      color: C.accent, align: "center", valign: "middle"
    });
    s.addText("ソース確認の具体的なやり方", {
      x: L.mx, y: 0.7, w: 8, h: 0.5,
      fontSize: F.size.h1, fontFace: F.sans, bold: true,
      color: C.textDark, margin: 0
    });
    addFooter(s, 6, T, pres);

    const items = [
      "AIに「その情報の出典やURLを教えて」と聞く",
      "URLが返ってきたら実際にアクセスして内容を確認",
      "論文・書籍は著者名・発行年をGoogle Scholarで検索",
      "引用元が実在しても原文と比較して正確性を確認",
    ];

    items.forEach((item, i) => {
      const y = 1.4 + i * 0.75;
      s.addImage({ data: ic.checkBlue, x: L.mx + 0.2, y: y + 0.05, w: 0.25, h: 0.25 });
      s.addText(item, {
        x: L.mx + 0.6, y, w: 7.5, h: 0.45,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, valign: "middle", margin: 0
      });
    });

    // Bottom tip
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.55, w: L.W - L.mx * 2, h: 0.5, fill: { color: C.greenBg }
    });
    s.addText("ソース確認の習慣だけで、ハルシネーション被害は大幅に減少", {
      x: L.mx + 0.3, y: 4.55, w: L.W - L.mx * 2 - 0.6, h: 0.5,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.green, align: "center", valign: "middle"
    });
  }

  // ============================================================
  // SLIDE 7: STEP 2 — CROSS-CHECK (3-card)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);

    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.35, w: 1.2, h: 0.28,
      fill: { color: C.amberBg }, rectRadius: 0.05
    });
    s.addText("STEP 2", {
      x: L.mx, y: 0.35, w: 1.2, h: 0.28,
      fontSize: F.size.tag, fontFace: F.sans, bold: true,
      color: C.amber, align: "center", valign: "middle"
    });
    s.addText("クロスチェックのコツ", {
      x: L.mx, y: 0.7, w: 8, h: 0.5,
      fontSize: F.size.h1, fontFace: F.sans, bold: true,
      color: C.textDark, margin: 0
    });
    addFooter(s, 7, T, pres);

    const methods = [
      { ic: ic.globe, label: "Google検索", sub: "公式サイト・政府機関\n大手メディアで確認", color: C.accent, bg: C.accentLight },
      { ic: ic.brain, label: "別のAIに聞く", sub: "Gemini, Copilot等に\n同じ質問をぶつける", color: C.amber, bg: C.amberBg },
      { ic: ic.db, label: "公式DB検索", sub: "官公庁統計・学術DB\n業界団体の一次情報", color: C.green, bg: C.greenBg },
    ];

    const mCardW = 2.55;
    const mCardGap = 0.3;
    const mTotalW = mCardW * 3 + mCardGap * 2;
    const mStartX = (L.W - mTotalW) / 2;

    methods.forEach((m, i) => {
      const x = mStartX + i * (mCardW + mCardGap);
      const y = 1.3;
      const h = 2.8;

      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: mCardW, h,
        fill: { color: C.white },
        line: { color: C.border, width: 0.75 }
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: mCardW, h: 0.06, fill: { color: m.color }
      });
      s.addShape(pres.shapes.OVAL, {
        x: x + (mCardW - 0.6) / 2, y: y + 0.3, w: 0.6, h: 0.6,
        fill: { color: m.bg }
      });
      s.addImage({ data: m.ic, x: x + (mCardW - 0.35) / 2, y: y + 0.43, w: 0.35, h: 0.35 });
      s.addText(m.label, {
        x, y: y + 1.1, w: mCardW, h: 0.4,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, align: "center", margin: 0
      });
      s.addText(m.sub, {
        x: x + 0.1, y: y + 1.6, w: mCardW - 0.2, h: 0.7,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textLight, align: "center", valign: "top", margin: 0
      });
    });

    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.35, w: L.W - L.mx * 2, h: 0.5, fill: { color: C.accentLight }
    });
    s.addText("目安: 3つ以上の独立した情報源が一致すれば信頼度 HIGH", {
      x: L.mx + 0.3, y: 4.35, w: L.W - L.mx * 2 - 0.6, h: 0.5,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.accent, align: "center", valign: "middle"
    });
  }

  // ============================================================
  // SLIDE 8: STEP 3 — EXPERT VERIFICATION (2x2 grid)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);

    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.35, w: 1.2, h: 0.28,
      fill: { color: C.greenBg }, rectRadius: 0.05
    });
    s.addText("STEP 3", {
      x: L.mx, y: 0.35, w: 1.2, h: 0.28,
      fontSize: F.size.tag, fontFace: F.sans, bold: true,
      color: C.green, align: "center", valign: "middle"
    });
    s.addText("専門家検証 — 人間のチェックが最後の砦", {
      x: L.mx, y: 0.7, w: 8.5, h: 0.5,
      fontSize: F.size.h1, fontFace: F.sans, bold: true,
      color: C.textDark, margin: 0
    });
    addFooter(s, 8, T, pres);

    const cases = [
      { ic: ic.balance, label: "法務・コンプライアンス", sub: "契約書の解釈、法的助言は\n必ず法務部門・弁護士に確認" },
      { ic: ic.file, label: "顧客提出資料", sub: "提案書・報告書は\n社内担当者がダブルチェック" },
      { ic: ic.cogs, label: "技術仕様・数値", sub: "スペック、設定値、予算は\n間違い許容ゼロ" },
      { ic: ic.users, label: "意思決定の根拠", sub: "経営判断・方針決定の根拠は\n複数人で検証" },
    ];

    const gw = 3.9;
    const gh = 1.4;
    const gapX = 0.3;
    const gapY = 0.25;
    const gStartX = L.mx;

    cases.forEach((c, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = gStartX + col * (gw + gapX);
      const y = 1.35 + row * (gh + gapY);

      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: gw, h: gh,
        fill: { color: C.offWhite },
        line: { color: C.border, width: 0.5 }
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: 0.05, h: gh, fill: { color: C.green }
      });
      s.addImage({ data: c.ic, x: x + 0.3, y: y + 0.25, w: 0.4, h: 0.4 });
      s.addText(c.label, {
        x: x + 0.85, y: y + 0.15, w: gw - 1.1, h: 0.35,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, valign: "middle", margin: 0
      });
      s.addText(c.sub, {
        x: x + 0.85, y: y + 0.55, w: gw - 1.1, h: 0.7,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textLight, valign: "top", margin: 0
      });
    });
  }

  // ============================================================
  // SLIDE 9: TRUST MATRIX (table)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "情報の信頼性を評価する", pres, "FRAMEWORK");
    addFooter(s, 9, T, pres);

    const tableX = L.mx;
    const tableW = L.W - L.mx * 2;
    const rowH = 0.65;
    const headerY = 1.5;

    // Header
    s.addShape(pres.shapes.RECTANGLE, {
      x: tableX, y: headerY, w: tableW, h: rowH,
      fill: { color: C.lightGray }
    });
    s.addText("信頼度", { x: tableX, y: headerY, w: 1.5, h: rowH, fontSize: F.size.label, fontFace: F.sans, bold: true, color: C.textDark, align: "center", valign: "middle" });
    s.addText("情報源の例", { x: tableX + 1.5, y: headerY, w: 4.5, h: rowH, fontSize: F.size.label, fontFace: F.sans, bold: true, color: C.textDark, valign: "middle", margin: [0, 0, 0, 10] });
    s.addText("業務での扱い", { x: tableX + 6.0, y: headerY, w: 2.5, h: rowH, fontSize: F.size.label, fontFace: F.sans, bold: true, color: C.textDark, valign: "middle", margin: [0, 0, 0, 10] });

    // Rows
    const rows = [
      { badge: "HIGH", badgeColor: C.white, badgeBg: C.green, sources: "官公庁データ / 査読済み論文 / 公式プレスリリース", usage: "そのまま引用可" },
      { badge: "MID", badgeColor: C.white, badgeBg: C.amber, sources: "大手メディア記事 / 業界レポート / 企業ブログ", usage: "複数確認で引用可" },
      { badge: "CHECK", badgeColor: C.white, badgeBg: C.red, sources: "AIの回答 / SNS投稿 / 個人ブログ / Wikipedia", usage: "必ず裏取りが必要" },
    ];

    rows.forEach((r, i) => {
      const y = headerY + rowH + i * rowH;
      s.addShape(pres.shapes.LINE, {
        x: tableX, y: y + rowH, w: tableW, h: 0,
        line: { color: C.border, width: 0.5 }
      });

      // Badge
      s.addShape(pres.shapes.RECTANGLE, {
        x: tableX + 0.25, y: y + 0.15, w: 1.0, h: 0.35,
        fill: { color: r.badgeBg }, rectRadius: 0.05
      });
      s.addText(r.badge, {
        x: tableX + 0.25, y: y + 0.15, w: 1.0, h: 0.35,
        fontSize: F.size.tag, fontFace: F.sans, bold: true,
        color: r.badgeColor, align: "center", valign: "middle"
      });

      s.addText(r.sources, {
        x: tableX + 1.5, y, w: 4.5, h: rowH,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textBody, valign: "middle", margin: [0, 0, 0, 10]
      });
      s.addText(r.usage, {
        x: tableX + 6.0, y, w: 2.5, h: rowH,
        fontSize: F.size.label, fontFace: F.sans, bold: true,
        color: C.textDark, valign: "middle", margin: [0, 0, 0, 10]
      });
    });

    // Bottom warning
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.0, w: L.W - L.mx * 2, h: 0.55, fill: { color: C.redBg }
    });
    s.addText("AIの回答は常に「CHECK」に分類されることを忘れない", {
      x: L.mx + 0.3, y: 4.0, w: L.W - L.mx * 2 - 0.6, h: 0.55,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.red, align: "center", valign: "middle"
    });
  }

  // ============================================================
  // SLIDE 10: PRACTICAL TIPS (numbered list)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "日常業務で使える5つのテクニック", pres, "TIPS");
    addFooter(s, 10, T, pres);

    const tips = [
      { num: "1", text: "「正確な情報が必要です。不確かなら教えて」と前置きする", icon: ic.bulb },
      { num: "2", text: "「確信度を%で教えて」とAIに聞いて危険度を把握", icon: ic.target },
      { num: "3", text: "AIで作った資料には「要検証」タグを付けて共有", icon: ic.warn },
      { num: "4", text: "チーム内でファクトチェック担当を明確にする", icon: ic.users },
      { num: "5", text: "「AIが言っていた」を根拠にしない文化をつくる", icon: ic.shield },
    ];

    tips.forEach((tip, i) => {
      const y = 1.5 + i * 0.65;
      const colors = [C.accent, C.amber, C.red, C.green, C.accent];

      s.addText(tip.num, {
        x: L.mx + 0.1, y: y + 0.05, w: 0.45, h: 0.45,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: colors[i] }, shape: pres.shapes.OVAL
      });
      s.addText(tip.text, {
        x: L.mx + 0.75, y, w: 7.5, h: 0.55,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textDark, valign: "middle", margin: 0
      });
    });
  }

  // ============================================================
  // SLIDE 11: SUMMARY
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.offWhite };
    addTopBar(s, pres);
    addSectionTitle(s, "まとめ", pres);
    addFooter(s, 11, T, pres);

    const items = [
      { label: "ハルシネーション", text: "AIは次の言葉を予測しているだけ。もっともらしいウソをつくことがある", color: C.red },
      { label: "3ステップ", text: "ソース確認 → クロスチェック → 専門家検証", color: C.accent },
      { label: "信頼性評価", text: "HIGH / MID / CHECK の3段階で情報源を分類", color: C.amber },
      { label: "実践の原則", text: "AIの回答は「下書き」。最終確認は必ず人間が行う", color: C.green },
    ];

    items.forEach((item, i) => {
      const y = 1.2 + i * 0.95;

      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.75,
        fill: { color: C.white },
        line: { color: C.border, width: 0.5 }
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: 0.05, h: 0.75, fill: { color: item.color }
      });

      s.addText(item.label, {
        x: L.mx + 0.35, y, w: 2.2, h: 0.75,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: item.color, valign: "middle", margin: 0
      });
      s.addText(item.text, {
        x: L.mx + 2.6, y, w: 5.6, h: 0.75,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textDark, valign: "middle", margin: 0
      });
    });
  }

  // ============================================================
  // SLIDE 12: END
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };

    s.addImage({ data: ic.shield, x: (L.W - 0.6) / 2, y: 0.7, w: 0.6, h: 0.6 });

    s.addText("A-107 修了", {
      x: 0.5, y: 1.4, w: 9, h: 0.5,
      fontSize: F.size.h3, fontFace: F.sans,
      color: C.accentMid, align: "center", margin: 0
    });

    s.addText("お疲れさまでした", {
      x: 0.5, y: 1.9, w: 9, h: 0.7,
      fontSize: 30, fontFace: F.sans, bold: true,
      color: C.white, align: "center", margin: 0
    });

    // CTA box
    s.addShape(pres.shapes.RECTANGLE, {
      x: 2.0, y: 2.8, w: 6, h: 2.0,
      fill: { color: C.white }, rectRadius: 0.1
    });

    s.addText("確認テスト（5問）", {
      x: 2.0, y: 2.95, w: 6, h: 0.45,
      fontSize: F.size.h2, fontFace: F.sans, bold: true,
      color: C.textDark, align: "center", margin: 0
    });

    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 3.45, w: 3, h: 0,
      line: { color: C.border, width: 0.5 }
    });

    s.addText("80%以上の正答で修了", {
      x: 2.0, y: 3.55, w: 6, h: 0.4,
      fontSize: F.size.h3, fontFace: F.sans,
      color: C.accent, align: "center", margin: 0
    });

    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 4.0, w: 3, h: 0,
      line: { color: C.border, width: 0.5 }
    });

    s.addText("「それ、出典ある？」を口癖にしましょう", {
      x: 2.0, y: 4.1, w: 6, h: 0.4,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.green, align: "center", margin: 0
    });

    s.addText("皆さんの情報リテラシー向上を応援しています！", {
      x: 0.5, y: 4.9, w: 9, h: 0.4,
      fontSize: F.size.h3, fontFace: F.sans,
      color: C.accentMid, align: "center", margin: 0
    });
  }

  // Write
  const out = "/Users/kurosakiyuto/Downloads/開発/gorilla-knowledge/黒崎/AI研修一覧/A-107_AI時代の情報リテラシー/スライド.pptx";
  await pres.writeFile({ fileName: out });
  console.log("Generated:", out);
}

main().catch(console.error);
