const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const {
  FaFileAlt, FaCheckCircle, FaArrowRight, FaComments, FaLightbulb,
  FaKeyboard, FaPencilAlt, FaGraduationCap, FaChevronRight,
  FaPlay, FaMagic, FaClipboardCheck, FaUsers, FaListOl,
  FaBalanceScale, FaSearch, FaTable, FaThumbsUp, FaThumbsDown,
  FaCode, FaBullseye, FaStar, FaCogs, FaExclamationTriangle,
  FaChartBar, FaCalendarAlt, FaHandshake, FaRocket, FaQuoteLeft,
  FaEdit, FaCheck, FaTimes, FaColumns
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
  slide.addText("P-02", {
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
  pres.title = "P-02: Claudeで提案書のストーリーを設計する";

  // Pre-render icons
  const ic = {
    file:      await icon(FaFileAlt,            C.accent),
    check:     await icon(FaCheckCircle,         C.green),
    checkBlue: await icon(FaCheckCircle,         C.accent),
    arrow:     await icon(FaArrowRight,          C.accent),
    comments:  await icon(FaComments,            C.accent),
    bulb:      await icon(FaLightbulb,           C.amber),
    keyboard:  await icon(FaKeyboard,            C.accent),
    pencil:    await icon(FaPencilAlt,           C.accent),
    grad:      await icon(FaGraduationCap,       C.green),
    chevron:   await icon(FaChevronRight,        C.accent),
    play:      await icon(FaPlay,                C.white),
    magic:     await icon(FaMagic,               C.purple),
    clipboard: await icon(FaClipboardCheck,      C.accent),
    users:     await icon(FaUsers,               C.accent),
    listOl:    await icon(FaListOl,              C.accent),
    balance:   await icon(FaBalanceScale,        C.accent),
    search:    await icon(FaSearch,              C.accent),
    table:     await icon(FaTable,               C.accent),
    thumbsUp:  await icon(FaThumbsUp,            C.green),
    thumbsDown: await icon(FaThumbsDown,         C.red),
    bullseye:  await icon(FaBullseye,            C.accent),
    star:      await icon(FaStar,                C.amber),
    cogs:      await icon(FaCogs,                C.accent),
    warning:   await icon(FaExclamationTriangle, C.amber),
    chart:     await icon(FaChartBar,            C.accent),
    calendar:  await icon(FaCalendarAlt,         C.accent),
    handshake: await icon(FaHandshake,           C.accent),
    rocket:    await icon(FaRocket,              C.accent),
    quote:     await icon(FaQuoteLeft,           C.accent),
    edit:      await icon(FaEdit,                C.accent),
    checkMark: await icon(FaCheck,               C.green),
    times:     await icon(FaTimes,               C.red),
    columns:   await icon(FaColumns,             C.accent),
    code:      await icon(FaCode,                C.accent),
  };

  // ============================================================
  // SLIDE 1: TITLE (Navy background)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };
    s.addImage({ data: ic.file, x: (L.W - 0.65) / 2, y: 0.85, w: 0.65, h: 0.65 });
    s.addText("Claudeで提案書を設計する", {
      x: 0.5, y: 1.65, w: 9, h: 0.85,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center", shrinkText: true
    });
    s.addShape(pres.shapes.LINE, {
      x: 3.2, y: 2.65, w: 3.6, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });
    s.addText("プロンプトの書き方ひとつで提案書の質が変わる", {
      x: 0.5, y: 2.8, w: 9, h: 0.45,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", shrinkText: true
    });
    s.addText("P-02  |  全社員  |  12分", {
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
      { icon: ic.keyboard, text: "Claudeに提案書の構成を作らせるプロンプトが書けるようになる" },
      { icon: ic.balance,  text: "良いプロンプトと悪いプロンプトの違いを説明できる" },
      { icon: ic.comments, text: "Claudeとの対話で構成を磨き上げる方法を身につける" },
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
  // SLIDE 3: GOLDEN STRUCTURE (6 Steps)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "提案書の黄金構成", "6 STEPS");
    addFooter(s, 3, T);

    const steps = [
      { ic: ic.search,    num: "1", label: "課題提示",     desc: "クライアントの痛みを言語化する" },
      { ic: ic.bulb,      num: "2", label: "解決策",       desc: "自社サービスで何ができるかを示す" },
      { ic: ic.chart,     num: "3", label: "根拠",         desc: "実績・データ・事例で裏付ける" },
      { ic: ic.bullseye,  num: "4", label: "投資対効果",   desc: "コストと見返りを数字で見せる" },
      { ic: ic.calendar,  num: "5", label: "スケジュール", desc: "いつまでに何をやるか明確にする" },
      { ic: ic.handshake, num: "6", label: "次のアクション", desc: "相手に取ってほしい行動を示す" },
    ];

    steps.forEach((st, i) => {
      const y = 1.0 + i * 0.68;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.58,
        fill: { color: i % 2 === 0 ? C.offWhite : C.white },
        line: { color: C.border, width: 0.5 }, rectRadius: 0.04
      });
      s.addText(st.num, {
        x: L.mx + 0.1, y: y + 0.08, w: 0.4, h: 0.4,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: C.accent }, shape: pres.shapes.OVAL, shrinkText: true
      });
      s.addImage({ data: st.ic, x: L.mx + 0.6, y: y + 0.12, w: 0.28, h: 0.28 });
      s.addText(st.label, {
        x: L.mx + 1.0, y: y + 0.02, w: 2.2, h: 0.3,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.textDark, valign: "middle", shrinkText: true
      });
      s.addText(st.desc, {
        x: L.mx + 1.0, y: y + 0.30, w: 6.5, h: 0.24,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textLight, valign: "middle", shrinkText: true
      });
    });
  }

  // ============================================================
  // SLIDE 4: PROMPT DESIGN (5 Elements)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "Claudeへのプロンプト設計", "5 ELEMENTS");
    addFooter(s, 4, T);

    const headers = ["要素", "内容", "例"];
    const rows = [
      ["役割設定",   "専門家像を指定",          "「IT企業の提案書作成の専門家です」"],
      ["背景情報",   "クライアント・課題の文脈", "「製造業A社向け、DX推進の提案」"],
      ["構成指示",   "含めたいセクション",       "「課題→解決策→根拠→ROI→…」"],
      ["トーン指定", "文体やスタイル",          "「経営層向けフォーマル」"],
      ["制約条件",   "分量・形式・禁止事項",     "「A4で5枚以内、箇条書き中心」"],
    ];

    const colW = [1.5, 2.8, 3.9];
    const startX = (L.W - colW.reduce((a, b) => a + b, 0)) / 2;

    // Header row
    let cx = startX;
    headers.forEach((h, i) => {
      s.addShape(pres.shapes.RECTANGLE, {
        x: cx, y: 1.05, w: colW[i], h: 0.40,
        fill: { color: C.navy }
      });
      s.addText(h, {
        x: cx, y: 1.05, w: colW[i], h: 0.40,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle", shrinkText: true
      });
      cx += colW[i];
    });

    // Data rows
    rows.forEach((row, ri) => {
      const rowY = 1.45 + ri * 0.72;
      let cx2 = startX;
      row.forEach((cell, ci) => {
        const bgColor = ri % 2 === 0 ? C.offWhite : C.white;
        s.addShape(pres.shapes.RECTANGLE, {
          x: cx2, y: rowY, w: colW[ci], h: 0.72,
          fill: { color: bgColor },
          line: { color: C.border, width: 0.5 }
        });
        s.addText(cell, {
          x: cx2 + 0.1, y: rowY, w: colW[ci] - 0.2, h: 0.72,
          fontSize: ci === 2 ? F.size.label : F.size.body, fontFace: F.sans,
          bold: ci === 0, color: ci === 0 ? C.textDark : C.textBody,
          align: "center", valign: "middle", shrinkText: true
        });
        cx2 += colW[ci];
      });
    });
  }

  // ============================================================
  // SLIDE 5: DEMO 1 - Claude Prompt → Structure (Navy background)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };

    s.addImage({ data: ic.magic, x: (L.W - 0.8) / 2, y: 1.0, w: 0.8, h: 0.8 });

    s.addText("実演", {
      x: 0.5, y: 1.95, w: 9, h: 0.85,
      fontSize: 36, fontFace: F.sans, bold: true,
      color: C.white, align: "center", valign: "middle", shrinkText: true
    });

    s.addShape(pres.shapes.LINE, {
      x: 2.5, y: 2.95, w: 5, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });

    s.addText("Claudeでプロンプト → 構成生成", {
      x: 0.5, y: 3.15, w: 9, h: 0.45,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", shrinkText: true
    });

    s.addText("P-02  |  DEMO 1", {
      x: 0.5, y: 4.2, w: 9, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textMuted, align: "center", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 6: GOOD vs BAD PROMPT
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "良いプロンプト vs 悪いプロンプト", "COMPARE");
    addFooter(s, 6, T);

    // Bad prompt card (left)
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 1.1, w: 4.0, h: 3.5,
      fill: { color: C.redBg },
      line: { color: C.red, width: 1 }, rectRadius: 0.08
    });
    s.addImage({ data: ic.times, x: L.mx + 0.15, y: 1.2, w: 0.3, h: 0.3 });
    s.addText("悪いプロンプト", {
      x: L.mx + 0.5, y: 1.2, w: 3.3, h: 0.35,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.red, shrinkText: true
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx + 0.2, y: 1.65, w: 3.6, h: 0.55,
      fill: { color: C.white }, rectRadius: 0.04,
      line: { color: C.border, width: 0.5 }
    });
    s.addText("「提案書作って」", {
      x: L.mx + 0.3, y: 1.65, w: 3.4, h: 0.55,
      fontSize: F.size.body, fontFace: F.sans, italic: true,
      color: C.textBody, align: "center", valign: "middle", shrinkText: true
    });

    const badItems = ["役割設定なし", "背景情報なし", "構成指示なし", "トーン不明", "制約なし"];
    badItems.forEach((item, i) => {
      s.addImage({ data: ic.times, x: L.mx + 0.3, y: 2.35 + i * 0.42, w: 0.18, h: 0.18 });
      s.addText(item, {
        x: L.mx + 0.55, y: 2.30 + i * 0.42, w: 3.0, h: 0.28,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.red, valign: "middle", shrinkText: true
      });
    });

    // Good prompt card (right)
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx + 4.3, y: 1.1, w: 4.2, h: 3.5,
      fill: { color: C.greenBg },
      line: { color: C.green, width: 1 }, rectRadius: 0.08
    });
    s.addImage({ data: ic.checkMark, x: L.mx + 4.45, y: 1.2, w: 0.3, h: 0.3 });
    s.addText("良いプロンプト", {
      x: L.mx + 4.8, y: 1.2, w: 3.5, h: 0.35,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.green, shrinkText: true
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx + 4.5, y: 1.65, w: 3.8, h: 0.55,
      fill: { color: C.white }, rectRadius: 0.04,
      line: { color: C.border, width: 0.5 }
    });
    s.addText("「IT企業の提案書専門家として\n製造業A社向けDX提案を作成」", {
      x: L.mx + 4.6, y: 1.65, w: 3.6, h: 0.55,
      fontSize: F.size.label, fontFace: F.sans, italic: true,
      color: C.textBody, align: "center", valign: "middle", shrinkText: true
    });

    const goodItems = ["役割設定あり", "背景情報あり", "構成指示あり", "トーン指定あり", "制約条件あり"];
    goodItems.forEach((item, i) => {
      s.addImage({ data: ic.checkMark, x: L.mx + 4.6, y: 2.35 + i * 0.42, w: 0.18, h: 0.18 });
      s.addText(item, {
        x: L.mx + 4.85, y: 2.30 + i * 0.42, w: 3.0, h: 0.28,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.green, valign: "middle", shrinkText: true
      });
    });
  }

  // ============================================================
  // SLIDE 7: DEEPENING TECHNIQUES
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "構成の深掘りテクニック", "TECHNIQUES");
    addFooter(s, 7, T);

    const techniques = [
      { ic: ic.search,   phrase: "「もっと具体的に」",               desc: "抽象的な表現を数字や事例に落とし込む" },
      { ic: ic.chart,    phrase: "「数字を入れて」",                 desc: "定量的な根拠を追加させる" },
      { ic: ic.comments, phrase: "「反論への回答も追加して」",       desc: "想定質問への対策を盛り込む" },
      { ic: ic.star,     phrase: "「競合との差別化を強調して」",     desc: "自社の強みを際立たせる" },
      { ic: ic.warning,  phrase: "「経営層が気にするリスクも書いて」", desc: "意思決定者の視点を取り込む" },
    ];

    techniques.forEach((t, i) => {
      const y = 1.0 + i * 0.78;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.65,
        fill: { color: i % 2 === 0 ? C.accentLight : C.offWhite },
        line: { color: C.border, width: 0.5 }, rectRadius: 0.05
      });
      s.addImage({ data: t.ic, x: L.mx + 0.15, y: y + 0.15, w: 0.3, h: 0.3 });
      s.addText(t.phrase, {
        x: L.mx + 0.55, y: y + 0.03, w: 4.0, h: 0.3,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.accent, valign: "middle", shrinkText: true
      });
      s.addText(t.desc, {
        x: L.mx + 0.55, y: y + 0.33, w: 7.0, h: 0.25,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textLight, valign: "middle", shrinkText: true
      });
    });
  }

  // ============================================================
  // SLIDE 8: CLAUDE'S STRENGTH PATTERNS
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "Claudeの得意パターン", "PATTERNS");
    addFooter(s, 8, T);

    const patterns = [
      {
        ic: ic.cogs, label: "MECE分析",
        desc: "課題を漏れなく整理する",
        prompt: "「この課題をMECEに分解して」",
        bgColor: C.accentLight
      },
      {
        ic: ic.columns, label: "フレームワーク活用",
        desc: "論理構造を強化する",
        prompt: "「3C分析で競合環境を整理して」",
        bgColor: C.purpleBg
      },
      {
        ic: ic.table, label: "データの構造化",
        desc: "情報をテーブル・箇条書きに",
        prompt: "「この情報を比較表にまとめて」",
        bgColor: C.greenBg
      },
    ];

    patterns.forEach((p, i) => {
      const cardW = 2.6;
      const gap = 0.25;
      const totalW = cardW * 3 + gap * 2;
      const startX = (L.W - totalW) / 2;
      const x = startX + i * (cardW + gap);

      s.addShape(pres.shapes.RECTANGLE, {
        x, y: 1.1, w: cardW, h: 3.4,
        fill: { color: p.bgColor },
        line: { color: C.border, width: 0.5 }, rectRadius: 0.08
      });
      s.addImage({ data: p.ic, x: x + (cardW - 0.45) / 2, y: 1.3, w: 0.45, h: 0.45 });
      s.addText(p.label, {
        x: x + 0.1, y: 1.85, w: cardW - 0.2, h: 0.4,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, align: "center", valign: "middle", shrinkText: true
      });
      s.addText(p.desc, {
        x: x + 0.1, y: 2.3, w: cardW - 0.2, h: 0.35,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textLight, align: "center", valign: "middle", shrinkText: true
      });
      // Prompt example box
      s.addShape(pres.shapes.RECTANGLE, {
        x: x + 0.15, y: 2.85, w: cardW - 0.3, h: 1.3,
        fill: { color: C.white }, rectRadius: 0.04,
        line: { color: C.border, width: 0.5 }
      });
      s.addText("プロンプト例", {
        x: x + 0.2, y: 2.9, w: cardW - 0.4, h: 0.25,
        fontSize: F.size.caption, fontFace: F.sans, bold: true,
        color: C.textMuted, align: "center", shrinkText: true
      });
      s.addText(p.prompt, {
        x: x + 0.2, y: 3.2, w: cardW - 0.4, h: 0.8,
        fontSize: F.size.label, fontFace: F.sans, italic: true,
        color: C.accent, align: "center", valign: "middle", shrinkText: true
      });
    });
  }

  // ============================================================
  // SLIDE 9: DEMO 2 - Dialogue Refinement (Navy background)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };

    s.addImage({ data: ic.edit, x: (L.W - 0.8) / 2, y: 1.0, w: 0.8, h: 0.8 });

    s.addText("実演", {
      x: 0.5, y: 1.95, w: 9, h: 0.85,
      fontSize: 36, fontFace: F.sans, bold: true,
      color: C.white, align: "center", valign: "middle", shrinkText: true
    });

    s.addShape(pres.shapes.LINE, {
      x: 2.5, y: 2.95, w: 5, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });

    s.addText("修正の対話実演", {
      x: 0.5, y: 3.15, w: 9, h: 0.45,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", shrinkText: true
    });

    s.addText("P-02  |  DEMO 2", {
      x: 0.5, y: 4.2, w: 9, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textMuted, align: "center", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 10: OUTPUT FORMAT
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "出力形式の指定", "FORMAT");
    addFooter(s, 10, T);

    const formats = [
      {
        ic: ic.code, label: "Markdown",
        instruction: "「Markdown形式で出力してください」",
        usage: "そのままドキュメント化したいとき",
        bgColor: C.accentLight
      },
      {
        ic: ic.listOl, label: "箇条書き",
        instruction: "「箇条書きで簡潔にまとめてください」",
        usage: "プレゼン用スライドの原稿に",
        bgColor: C.offWhite
      },
      {
        ic: ic.table, label: "テーブル形式",
        instruction: "「比較表で整理してください」",
        usage: "複数案の比較や選定資料に",
        bgColor: C.greenBg
      },
    ];

    formats.forEach((f, i) => {
      const cardW = 2.6;
      const gap = 0.25;
      const totalW = cardW * 3 + gap * 2;
      const startX = (L.W - totalW) / 2;
      const x = startX + i * (cardW + gap);

      s.addShape(pres.shapes.RECTANGLE, {
        x, y: 1.1, w: cardW, h: 3.4,
        fill: { color: f.bgColor },
        line: { color: C.border, width: 0.5 }, rectRadius: 0.08
      });
      s.addImage({ data: f.ic, x: x + (cardW - 0.45) / 2, y: 1.3, w: 0.45, h: 0.45 });
      s.addText(f.label, {
        x: x + 0.1, y: 1.85, w: cardW - 0.2, h: 0.4,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, align: "center", valign: "middle", shrinkText: true
      });
      // Instruction box
      s.addShape(pres.shapes.RECTANGLE, {
        x: x + 0.15, y: 2.4, w: cardW - 0.3, h: 0.9,
        fill: { color: C.white }, rectRadius: 0.04,
        line: { color: C.border, width: 0.5 }
      });
      s.addText(f.instruction, {
        x: x + 0.2, y: 2.45, w: cardW - 0.4, h: 0.8,
        fontSize: F.size.label, fontFace: F.sans, italic: true,
        color: C.accent, align: "center", valign: "middle", shrinkText: true
      });
      // Usage description
      s.addText("向いている場面", {
        x: x + 0.1, y: 3.5, w: cardW - 0.2, h: 0.25,
        fontSize: F.size.caption, fontFace: F.sans, bold: true,
        color: C.textMuted, align: "center", shrinkText: true
      });
      s.addText(f.usage, {
        x: x + 0.1, y: 3.75, w: cardW - 0.2, h: 0.5,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textBody, align: "center", valign: "middle", shrinkText: true
      });
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

    const summaryItems = [
      { ic: ic.listOl,   text: "黄金構成は6ステップ（課題→解決策→根拠→ROI→スケジュール→アクション）" },
      { ic: ic.keyboard, text: "プロンプト5要素（役割・背景・構成・トーン・制約）で品質が劇的に変わる" },
      { ic: ic.search,   text: "最初の出力はたたき台。「もっと具体的に」「数字を入れて」で深掘り" },
      { ic: ic.cogs,     text: "MECE分析・フレームワーク活用はClaudeの得意技" },
      { ic: ic.comments, text: "対話で育てる意識が大事。一発完璧を目指さない" },
    ];

    summaryItems.forEach((item, i) => {
      const y = 1.0 + i * 0.78;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.65,
        fill: { color: i % 2 === 0 ? C.accentLight : C.offWhite },
        line: { color: C.border, width: 0.5 }, rectRadius: 0.05
      });
      s.addText(String(i + 1), {
        x: L.mx + 0.1, y: y + 0.12, w: 0.4, h: 0.4,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: C.accent }, shape: pres.shapes.OVAL, shrinkText: true
      });
      s.addImage({ data: item.ic, x: L.mx + 0.6, y: y + 0.15, w: 0.3, h: 0.3 });
      s.addText(item.text, {
        x: L.mx + 1.05, y: y + 0.05, w: 7.0, h: 0.55,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textDark, valign: "middle", shrinkText: true
      });
    });
  }

  // ============================================================
  // SLIDE 12: END (Navy background)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };
    s.addImage({ data: ic.grad, x: (L.W - 0.65) / 2, y: 0.95, w: 0.65, h: 0.65 });
    s.addText("確認テストに進みましょう", {
      x: 0.5, y: 1.8, w: 9, h: 0.8,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center", shrinkText: true
    });
    s.addShape(pres.shapes.LINE, {
      x: 3.2, y: 2.75, w: 3.6, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });
    s.addText("5問 × 4択  |  合格ライン80点", {
      x: 0.5, y: 2.9, w: 9, h: 0.45,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", shrinkText: true
    });
    s.addText("P-02  |  Claudeで提案書を設計する", {
      x: 0.5, y: 3.9, w: 9, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textMuted, align: "center", shrinkText: true
    });
  }

  // ============================================================
  // EXPORT
  // ============================================================
  const outDir = __dirname;
  const outPath = `${outDir}/スライド.pptx`;
  await pres.writeFile({ fileName: outPath });
  console.log(`Generated: ${outPath}`);
}

main().catch(err => { console.error(err); process.exit(1); });
