const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const {
  FaShieldAlt, FaExclamationTriangle, FaLock, FaBalanceScale,
  FaEye, FaCheckCircle, FaTimesCircle, FaUserSecret,
  FaBrain, FaBullseye, FaChevronRight, FaSearch,
  FaFileAlt, FaClipboardCheck, FaGavel, FaDatabase,
  FaBan, FaLightbulb, FaUsers, FaBookOpen
} = require("react-icons/fa");

// =====================================================
// CONSULTING-GRADE DESIGN SYSTEM
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

const L = {
  W: 10, H: 5.625, mx: 0.75, my: 0.5, gap: 0.3,
};

// Icon helper
async function icon(IconComponent, color, size = 256) {
  const svg = ReactDOMServer.renderToStaticMarkup(
    React.createElement(IconComponent, { color: `#${color}`, size: String(size) })
  );
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

// Layout primitives
function addTopBar(slide, pres) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: L.W, h: 0.035, fill: { color: C.accent }
  });
}

function addFooter(slide, pres, num, total) {
  slide.addShape(pres.shapes.LINE, {
    x: L.mx, y: L.H - 0.4, w: L.W - L.mx * 2, h: 0,
    line: { color: C.border, width: 0.5 }
  });
  slide.addText(`${num} / ${total}`, {
    x: L.W - 1.5, y: L.H - 0.38, w: 1.2, h: 0.3,
    fontSize: F.size.caption, fontFace: F.sans,
    color: C.textMuted, align: "right", margin: 0
  });
  slide.addText("AI-105", {
    x: L.mx, y: L.H - 0.38, w: 2, h: 0.3,
    fontSize: F.size.caption, fontFace: F.sans,
    color: C.textMuted, align: "left", margin: 0
  });
}

function addSectionTitle(slide, pres, title, tag) {
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
    color: C.textDark, margin: 0
  });
}

async function main() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "Gorilla Knowledge";
  pres.title = "AI-105: AI時代の情報リテラシー — AIの限界とリスクを正しく理解する";

  // Pre-render icons
  const ic = {
    shield: await icon(FaShieldAlt, C.accent),
    warn: await icon(FaExclamationTriangle, C.amber),
    lock: await icon(FaLock, C.red),
    balance: await icon(FaBalanceScale, C.red),
    eye: await icon(FaEye, C.amber),
    check: await icon(FaCheckCircle, C.green),
    times: await icon(FaTimesCircle, C.red),
    userSecret: await icon(FaUserSecret, C.red),
    brain: await icon(FaBrain, C.accent),
    target: await icon(FaBullseye, C.accent),
    chevron: await icon(FaChevronRight, C.textMuted),
    search: await icon(FaSearch, C.accent),
    file: await icon(FaFileAlt, C.accent),
    clipboard: await icon(FaClipboardCheck, C.accent),
    gavel: await icon(FaGavel, C.amber),
    db: await icon(FaDatabase, C.accent),
    ban: await icon(FaBan, C.red),
    bulb: await icon(FaLightbulb, C.amber),
    users: await icon(FaUsers, C.accent),
    book: await icon(FaBookOpen, C.accent),
    warnRed: await icon(FaExclamationTriangle, C.red),
    checkBlue: await icon(FaCheckCircle, C.accent),
    shieldNavy: await icon(FaShieldAlt, C.navyLight),
  };

  const T = 12;

  // ============================================================
  // SLIDE 1: TITLE (Navy background)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };

    s.addImage({ data: ic.shield, x: (L.W - 0.7) / 2, y: 1.0, w: 0.7, h: 0.7 });

    s.addText("AI時代の情報リテラシー", {
      x: 0.5, y: 1.9, w: 9, h: 0.9,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center", margin: 0
    });

    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 2.95, w: 3, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });

    s.addText("AIの限界とリスクを正しく理解する", {
      x: 0.5, y: 3.15, w: 9, h: 0.5,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", margin: 0
    });

    s.addText("AI-105   |   全社員向け（AI-101修了者）   |   10分", {
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
    addSectionTitle(s, pres, "今日のゴール");
    addFooter(s, pres, 2, T);

    const goals = [
      "ハルシネーションの仕組みと具体的な対策方法を実践できる",
      "AI利用時の著作権・個人情報保護のリスクを判断できる",
      "社内AI利用ガイドラインの基本方針を理解し、適切に行動できる",
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
  // SLIDE 3: AI LIMITATIONS
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, pres, "AIは万能ではない");
    addFooter(s, pres, 3, T);

    // Key message box
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 1.15, w: L.W - L.mx * 2, h: 0.65,
      fill: { color: C.redBg }
    });
    s.addText("AIにできないことを正しく理解することが、正しく使う第一歩", {
      x: L.mx + 0.3, y: 1.15, w: L.W - L.mx * 2 - 0.6, h: 0.65,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.red, valign: "middle", margin: 0
    });

    const limits = [
      { icon: ic.warnRed, title: "事実の正確性を保証できない", desc: "最新情報を知らない。専門知識で間違えることも。", color: C.red, bg: C.redBg },
      { icon: ic.users, title: "倫理的な判断ができない", desc: "善悪の判断・価値判断は人間の仕事。", color: C.amber, bg: C.amberBg },
      { icon: ic.brain, title: "文脈や感情を完全に理解できない", desc: "空気を読む、相手の気持ちを汲み取ることは苦手。", color: C.accent, bg: C.accentLight },
    ];

    const cardW = 2.6;
    const cardGap = 0.25;
    const totalW = cardW * 3 + cardGap * 2;
    const startX = (L.W - totalW) / 2;

    limits.forEach((item, i) => {
      const x = startX + i * (cardW + cardGap);
      const y = 2.1;
      const h = 2.5;

      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h,
        fill: { color: C.white },
        line: { color: C.border, width: 0.75 }
      });
      // Top color band
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 0.06, fill: { color: item.color }
      });
      // Icon circle
      s.addShape(pres.shapes.OVAL, {
        x: x + (cardW - 0.65) / 2, y: y + 0.3, w: 0.65, h: 0.65,
        fill: { color: item.bg }
      });
      s.addImage({ data: item.icon, x: x + (cardW - 0.35) / 2, y: y + 0.45, w: 0.35, h: 0.35 });
      // Title
      s.addText(item.title, {
        x: x + 0.15, y: y + 1.1, w: cardW - 0.3, h: 0.6,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.textDark, align: "center", valign: "middle", margin: 0
      });
      // Description
      s.addText(item.desc, {
        x: x + 0.15, y: y + 1.75, w: cardW - 0.3, h: 0.55,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textLight, align: "center", valign: "top", margin: 0
      });
    });
  }

  // ============================================================
  // SLIDE 4: HALLUCINATION
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, pres, "ハルシネーション — AIが自信満々にウソをつく", "RISK");
    addFooter(s, pres, 4, T);

    // Definition box
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 1.5, w: L.W - L.mx * 2, h: 0.6,
      fill: { color: C.amberBg }
    });
    s.addImage({ data: ic.warn, x: L.mx + 0.2, y: 1.58, w: 0.35, h: 0.35 });
    s.addText("AIがもっともらしいが事実ではない情報を生成する現象", {
      x: L.mx + 0.7, y: 1.5, w: L.W - L.mx * 2 - 1.0, h: 0.6,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.amber, valign: "middle", margin: 0
    });

    // Examples
    const examples = [
      { text: "「○○法は2019年に改正されました」", sub: "→ 実際には改正されていない" },
      { text: "架空の論文を引用（著者名・タイトルまで捏造）", sub: "→ 存在しない論文を自信満々に提示" },
      { text: "弁護士がAI生成の準備書面を提出", sub: "→ 存在しない判例を引用し大問題に（米国実例）" },
    ];

    examples.forEach((e, i) => {
      const y = 2.35 + i * 0.75;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: 0.05, h: 0.6, fill: { color: C.amber }
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.6, fill: { color: C.offWhite }
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: 0.05, h: 0.6, fill: { color: C.amber }
      });
      s.addText(e.text, {
        x: L.mx + 0.3, y, w: 5.0, h: 0.6,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.textDark, valign: "middle", margin: 0
      });
      s.addText(e.sub, {
        x: L.mx + 5.3, y, w: 3.5, h: 0.6,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.red, valign: "middle", margin: 0
      });
    });

    // Bottom insight
    s.addText("原因: AIは「正しいかどうか」ではなく「次に来そうな言葉」を予測して生成している", {
      x: L.mx, y: 4.7, w: L.W - L.mx * 2, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans, italic: true,
      color: C.textLight, margin: 0
    });
  }

  // ============================================================
  // SLIDE 5: FACT-CHECKING
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, pres, "ハルシネーション対策 — 3ステップ・ファクトチェック");
    addFooter(s, pres, 5, T);

    const steps = [
      { num: "1", icon: ic.search, title: "複数ソースで確認", desc: "AIの回答を別の情報源でクロスチェック。\n1つのソースだけで判断しない。", color: C.accent, bg: C.accentLight },
      { num: "2", icon: ic.file, title: "一次情報にあたる", desc: "公式サイト、法令データベース、原典を確認。\n「誰が言っているか」が重要。", color: C.green, bg: C.greenBg },
      { num: "3", icon: ic.users, title: "専門家に聞く", desc: "判断に迷ったら詳しい人に相談。\nこれが最も確実な方法。", color: C.amber, bg: C.amberBg },
    ];

    const cardW = 2.6;
    const cardGap = 0.25;
    const totalW = cardW * 3 + cardGap * 2;
    const startX = (L.W - totalW) / 2;

    steps.forEach((step, i) => {
      const x = startX + i * (cardW + cardGap);
      const y = 1.2;
      const h = 3.1;

      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h,
        fill: { color: C.white },
        line: { color: C.border, width: 0.75 }
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 0.06, fill: { color: step.color }
      });

      // Step number
      s.addText(step.num, {
        x: x + (cardW - 0.55) / 2, y: y + 0.25, w: 0.55, h: 0.55,
        fontSize: F.size.h2, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: step.color }, shape: pres.shapes.OVAL
      });

      s.addText(step.title, {
        x: x + 0.15, y: y + 1.0, w: cardW - 0.3, h: 0.5,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, align: "center", valign: "middle", margin: 0
      });

      s.addShape(pres.shapes.LINE, {
        x: x + 0.4, y: y + 1.6, w: cardW - 0.8, h: 0,
        line: { color: C.border, width: 0.5 }
      });

      s.addText(step.desc, {
        x: x + 0.2, y: y + 1.75, w: cardW - 0.4, h: 1.0,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textBody, align: "center", valign: "top", margin: 0
      });

      // Arrow between cards
      if (i < 2) {
        s.addImage({ data: ic.chevron, x: x + cardW + 0.04, y: y + h / 2 - 0.12, w: 0.2, h: 0.2 });
      }
    });

    // Bottom warning
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.5, w: L.W - L.mx * 2, h: 0.5,
      fill: { color: C.navy }
    });
    s.addText("「AIが言ったから正しい」は絶対NG — 最終判断は必ず人間がする", {
      x: L.mx + 0.3, y: 4.5, w: L.W - L.mx * 2 - 0.6, h: 0.5,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.white, align: "center", valign: "middle"
    });
  }

  // ============================================================
  // SLIDE 6: AI BIAS
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, pres, "AIのバイアスと公平性", "RISK");
    addFooter(s, pres, 6, T);

    // Flow diagram
    const flowItems = ["偏ったデータ", "AIが学習", "偏った出力"];
    const fW = 2.2;
    const fGap = 0.6;
    const fTotalW = fW * 3 + fGap * 2;
    const fStartX = (L.W - fTotalW) / 2;
    const fY = 1.5;

    flowItems.forEach((item, i) => {
      const x = fStartX + i * (fW + fGap);
      const bgColor = i === 2 ? C.red : C.accent;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: fY, w: fW, h: 0.55,
        fill: { color: bgColor }, rectRadius: 0.05
      });
      s.addText(item, {
        x, y: fY, w: fW, h: 0.55,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle"
      });
      if (i < 2) {
        s.addImage({ data: ic.chevron, x: x + fW + 0.18, y: fY + 0.15, w: 0.2, h: 0.2 });
      }
    });

    // Bias examples
    const biasEx = [
      { label: "採用AI", desc: "過去データの偏りにより、特定の性別・学歴を不当に優遇" },
      { label: "翻訳AI", desc: "「医者=男性、看護師=女性」と性別を勝手に決めつける" },
      { label: "画像生成AI", desc: "特定の人種ばかりを生成し、多様性が欠如" },
    ];

    biasEx.forEach((e, i) => {
      const y = 2.4 + i * 0.65;
      if (i > 0) {
        s.addShape(pres.shapes.LINE, {
          x: L.mx, y, w: L.W - L.mx * 2, h: 0,
          line: { color: C.border, width: 0.5 }
        });
      }
      s.addText(e.label, {
        x: L.mx + 0.2, y, w: 1.8, h: 0.55,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.amber, valign: "middle", margin: 0
      });
      s.addText(e.desc, {
        x: L.mx + 2.2, y, w: 6.3, h: 0.55,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, valign: "middle", margin: 0
      });
    });

    // Insight
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.45, w: L.W - L.mx * 2, h: 0.55,
      fill: { color: C.accentLight }
    });
    s.addImage({ data: ic.bulb, x: L.mx + 0.2, y: 4.53, w: 0.3, h: 0.3 });
    s.addText("AIの出力を使うときは「この内容に偏りがないか？」と常に意識する", {
      x: L.mx + 0.7, y: 4.45, w: 7.5, h: 0.55,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", margin: 0
    });
  }

  // ============================================================
  // SLIDE 7: COPYRIGHT
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, pres, "AI生成物の著作権 — 知っておくべきリスク", "LAW");
    addFooter(s, pres, 7, T);

    // Key points
    const points = [
      { icon: ic.gavel, text: "AI生成物の著作権は法的にグレーゾーン", sub: "国・地域によって判断が分かれている" },
      { icon: ic.warn, text: "学習データに類似したコンテンツを出力するリスク", sub: "知らず知らずのうちに他者の著作物を模倣する可能性" },
      { icon: ic.ban, text: "商用利用には特に注意が必要", sub: "訴訟リスクを避けるため、権利関係を確認" },
    ];

    points.forEach((p, i) => {
      const y = 1.5 + i * 0.8;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.65,
        fill: { color: C.offWhite },
        line: { color: C.border, width: 0.5 }
      });
      s.addImage({ data: p.icon, x: L.mx + 0.2, y: y + 0.12, w: 0.35, h: 0.35 });
      s.addText(p.text, {
        x: L.mx + 0.75, y, w: 4.5, h: 0.65,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.textDark, valign: "middle", margin: 0
      });
      s.addText(p.sub, {
        x: L.mx + 5.3, y, w: 3.5, h: 0.65,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textLight, valign: "middle", margin: 0
      });
    });

    // Rules
    s.addText("業務で守るべき3つのルール", {
      x: L.mx, y: 3.85, w: 4, h: 0.35,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.textDark, margin: 0
    });

    const rules = [
      "他者の著作物をそのままAIに入力して改変させない",
      "AI生成物を外部公開する際は上長確認",
      "AIサービスの利用規約を確認する",
    ];

    rules.forEach((r, i) => {
      s.addImage({ data: ic.checkBlue, x: L.mx + 0.1, y: 4.3 + i * 0.35, w: 0.2, h: 0.2 });
      s.addText(r, {
        x: L.mx + 0.45, y: 4.2 + i * 0.35, w: 7.5, h: 0.35,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textBody, valign: "middle", margin: 0
      });
    });
  }

  // ============================================================
  // SLIDE 8: PERSONAL DATA / SECURITY
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, pres, "AIに入力してはいけない情報", "SECURITY");
    addFooter(s, pres, 8, T);

    // NG list
    const ngItems = [
      { icon: ic.userSecret, text: "顧客の氏名・住所・電話番号・メールアドレス" },
      { icon: ic.lock, text: "社内の機密情報（売上データ、戦略資料、未公開情報）" },
      { icon: ic.ban, text: "パスワード・認証情報" },
      { icon: ic.users, text: "社員の個人情報（評価情報、給与情報）" },
    ];

    ngItems.forEach((item, i) => {
      const y = 1.3 + i * 0.7;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.55,
        fill: { color: C.redBg }
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: 0.05, h: 0.55, fill: { color: C.red }
      });
      s.addImage({ data: item.icon, x: L.mx + 0.25, y: y + 0.1, w: 0.3, h: 0.3 });
      s.addText(item.text, {
        x: L.mx + 0.75, y, w: 7.5, h: 0.55,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textDark, valign: "middle", margin: 0
      });
    });

    // Why dangerous
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.2, w: L.W - L.mx * 2, h: 0.45,
      fill: { color: C.amberBg }
    });
    s.addImage({ data: ic.warn, x: L.mx + 0.15, y: 4.27, w: 0.25, h: 0.25 });
    s.addText("外部AIに入力したデータは学習に使われる可能性がある → 情報漏洩リスク", {
      x: L.mx + 0.55, y: 4.2, w: 7.5, h: 0.45,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.amber, valign: "middle", margin: 0
    });

    // Solution
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.75, w: L.W - L.mx * 2, h: 0.45,
      fill: { color: C.greenBg }
    });
    s.addImage({ data: ic.check, x: L.mx + 0.15, y: 4.82, w: 0.25, h: 0.25 });
    s.addText("対策: 社内承認済みのAIツールを使う。「ちょっとだけなら」は絶対NG。", {
      x: L.mx + 0.55, y: 4.75, w: 7.5, h: 0.45,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.green, valign: "middle", margin: 0
    });
  }

  // ============================================================
  // SLIDE 9: GUIDELINES
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, pres, "社内AI利用ガイドライン — 5つの基本方針", "POLICY");
    addFooter(s, pres, 9, T);

    const policies = [
      { num: "1", title: "機密情報・個人情報の入力禁止", desc: "社内承認ツール以外に入力しない", color: C.red, bg: C.redBg },
      { num: "2", title: "ファクトチェック必須", desc: "AI出力は必ず人間が正確性を確認", color: C.amber, bg: C.amberBg },
      { num: "3", title: "著作権の確認", desc: "外部公開前に権利関係を確認", color: C.amber, bg: C.amberBg },
      { num: "4", title: "利用記録の保持", desc: "いつ・何の目的で・どのAIを使ったか記録", color: C.accent, bg: C.accentLight },
      { num: "5", title: "問題発生時の即報告", desc: "上長・情報システム部門にすぐ報告", color: C.accent, bg: C.accentLight },
    ];

    policies.forEach((p, i) => {
      const y = 1.35 + i * 0.7;

      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.55,
        fill: { color: C.white },
        line: { color: C.border, width: 0.5 }
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: 0.05, h: 0.55, fill: { color: p.color }
      });

      // Number badge
      s.addText(p.num, {
        x: L.mx + 0.2, y: y + 0.07, w: 0.4, h: 0.4,
        fontSize: F.size.label, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: p.color }, shape: pres.shapes.OVAL
      });

      s.addText(p.title, {
        x: L.mx + 0.8, y, w: 3.5, h: 0.55,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.textDark, valign: "middle", margin: 0
      });

      s.addText(p.desc, {
        x: L.mx + 4.5, y, w: 4.0, h: 0.55,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textLight, valign: "middle", margin: 0
      });
    });
  }

  // ============================================================
  // SLIDE 10: CASE STUDY
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, pres, "ケーススタディ — この行動は適切？");
    addFooter(s, pres, 10, T);

    const cases = [
      {
        ok: false,
        title: "ChatGPTにお客様の名前と住所を入力してお礼メールを作成",
        reason: "個人情報を社外AIに入力 → ガイドライン違反",
        color: C.red, bg: C.redBg, icon: ic.times
      },
      {
        ok: true,
        title: "AIの市場レポート数値を政府統計サイトで確認してから社内資料に使用",
        reason: "ファクトチェック済み → 適切な利用方法",
        color: C.green, bg: C.greenBg, icon: ic.check
      },
      {
        ok: false,
        title: "AI生成画像をそのまま自社の広告素材として外部公開",
        reason: "著作権未確認で外部公開 → ガイドライン違反",
        color: C.red, bg: C.redBg, icon: ic.times
      },
    ];

    cases.forEach((c, i) => {
      const y = 1.2 + i * 1.15;

      // Card
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.95,
        fill: { color: C.white },
        line: { color: C.border, width: 0.5 }
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: 0.05, h: 0.95, fill: { color: c.color }
      });

      // OK/NG badge
      const badge = c.ok ? "○" : "×";
      s.addText(badge, {
        x: L.mx + 0.2, y: y + 0.15, w: 0.55, h: 0.55,
        fontSize: F.size.h2, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: c.color }, shape: pres.shapes.OVAL
      });

      // Title
      s.addText(c.title, {
        x: L.mx + 1.0, y: y + 0.05, w: 7.2, h: 0.45,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.textDark, valign: "middle", margin: 0
      });

      // Reason
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx + 1.0, y: y + 0.55, w: 7.2, h: 0.3,
        fill: { color: c.bg }
      });
      s.addText(c.reason, {
        x: L.mx + 1.15, y: y + 0.55, w: 7.0, h: 0.3,
        fontSize: F.size.label, fontFace: F.sans,
        color: c.color, valign: "middle", margin: 0
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
    addSectionTitle(s, pres, "まとめ");
    addFooter(s, pres, 11, T);

    const items = [
      { label: "AIの限界", text: "万能ではない。ハルシネーションに要注意", color: C.red },
      { label: "ファクトチェック", text: "複数ソース確認 → 一次情報 → 専門家に聞く", color: C.amber },
      { label: "情報保護", text: "機密情報・個人情報は社外AIに入力しない", color: C.accent },
      { label: "ガイドライン", text: "5つの基本方針を守って、安全にAIを活用", color: C.green },
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
        x: L.mx + 0.35, y, w: 2.0, h: 0.75,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: item.color, valign: "middle", margin: 0
      });
      s.addText(item.text, {
        x: L.mx + 2.5, y, w: 5.8, h: 0.75,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textDark, valign: "middle", margin: 0
      });
    });
  }

  // ============================================================
  // SLIDE 12: END (Navy background)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };

    s.addText("お疲れさまでした！", {
      x: 0.5, y: 1.2, w: 9, h: 0.8,
      fontSize: 36, fontFace: F.sans, bold: true,
      color: C.white, align: "center", margin: 0
    });

    s.addShape(pres.shapes.RECTANGLE, {
      x: 2.5, y: 2.3, w: 5, h: 2.2,
      fill: { color: C.white }
    });

    s.addText("確認テスト（5問）", {
      x: 2.5, y: 2.5, w: 5, h: 0.55,
      fontSize: F.size.h2, fontFace: F.sans, bold: true,
      color: C.textDark, align: "center", margin: 0
    });

    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 3.1, w: 3, h: 0,
      line: { color: C.border, width: 0.5 }
    });

    s.addText("80%以上の正答で修了", {
      x: 2.5, y: 3.25, w: 5, h: 0.45,
      fontSize: F.size.h3, fontFace: F.sans,
      color: C.accent, align: "center", margin: 0
    });

    s.addText("次の動画: AI-106", {
      x: 2.5, y: 3.8, w: 5, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textMuted, align: "center", margin: 0
    });
  }

  // Write
  const out = "/Users/kurosakiyuto/Downloads/開発/gorilla-knowledge/黒崎/AI研修一覧/AI-105_AI時代の情報リテラシー/スライド.pptx";
  await pres.writeFile({ fileName: out });
  console.log("Generated:", out);
}

main().catch(console.error);
