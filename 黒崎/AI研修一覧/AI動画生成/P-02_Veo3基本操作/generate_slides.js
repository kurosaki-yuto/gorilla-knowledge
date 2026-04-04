const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const {
  FaVideo, FaCheckCircle, FaArrowRight, FaComments, FaLightbulb,
  FaKeyboard, FaMousePointer, FaGlobe, FaRocket, FaGraduationCap,
  FaExchangeAlt, FaChevronRight, FaImage, FaPlay, FaCog,
  FaFilm, FaPencilAlt, FaThumbsUp, FaExclamationTriangle,
  FaClipboardCheck, FaSignInAlt, FaSlidersH, FaExpandArrowsAlt,
  FaCamera, FaTimes, FaCheck, FaMagic
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
  pres.title = "P-02: Veo 3 基本操作";

  // Pre-render icons
  const ic = {
    video:     await icon(FaVideo,              C.accent),
    check:     await icon(FaCheckCircle,         C.green),
    checkBlue: await icon(FaCheckCircle,         C.accent),
    arrow:     await icon(FaArrowRight,          C.accent),
    comments:  await icon(FaComments,            C.accent),
    bulb:      await icon(FaLightbulb,           C.amber),
    keyboard:  await icon(FaKeyboard,            C.accent),
    mouse:     await icon(FaMousePointer,        C.accent),
    globe:     await icon(FaGlobe,               C.accent),
    rocket:    await icon(FaRocket,              C.accent),
    grad:      await icon(FaGraduationCap,       C.green),
    exchange:  await icon(FaExchangeAlt,         C.accent),
    chevron:   await icon(FaChevronRight,        C.accent),
    image:     await icon(FaImage,               C.accent),
    play:      await icon(FaPlay,                C.white),
    cog:       await icon(FaCog,                 C.accent),
    film:      await icon(FaFilm,                C.accent),
    pencil:    await icon(FaPencilAlt,           C.accent),
    thumbsUp:  await icon(FaThumbsUp,            C.green),
    warning:   await icon(FaExclamationTriangle, C.amber),
    clipboard: await icon(FaClipboardCheck,      C.accent),
    signIn:    await icon(FaSignInAlt,           C.accent),
    sliders:   await icon(FaSlidersH,            C.accent),
    expand:    await icon(FaExpandArrowsAlt,     C.accent),
    camera:    await icon(FaCamera,              C.accent),
    times:     await icon(FaTimes,               C.red),
    checkMark: await icon(FaCheck,               C.green),
    magic:     await icon(FaMagic,               C.purple),
  };

  // ============================================================
  // SLIDE 1: TITLE (Navy background)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };
    s.addImage({ data: ic.video, x: (L.W - 0.65) / 2, y: 0.85, w: 0.65, h: 0.65 });
    s.addText("Veo 3 基本操作", {
      x: 0.5, y: 1.65, w: 9, h: 0.85,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center", shrinkText: true
    });
    s.addShape(pres.shapes.LINE, {
      x: 3.2, y: 2.65, w: 3.6, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });
    s.addText("テキスト→動画、画像→動画の基本を学ぶ", {
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
      { icon: ic.keyboard, text: "Geminiでテキストから動画を生成できるようになる" },
      { icon: ic.image,    text: "Image-to-Videoの操作方法を理解する" },
      { icon: ic.exchange, text: "Text-to-VideoとImage-to-Videoの使い分けを判断できる" },
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
  // SLIDE 3: TWO ENTRY POINTS - Gemini vs Flow
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "2つの入り口: Gemini vs Flow", "COMPARE");
    addFooter(s, 3, T);

    const headers = ["項目", "Gemini", "Flow"];
    const rows = [
      ["URL",         "gemini.google.com",        "flow.google.com"],
      ["操作感",      "チャット型\n話しかけるだけ",  "スタジオ型\n細かく調整できる"],
      ["向いている用途", "ラフ案・アイデア出し",    "清書・本番用映像"],
      ["生成上限",    "1日あたり制限あり",          "プロジェクト単位で管理"],
    ];

    const colW = [1.8, 3.2, 3.2];
    const startX = (L.W - colW.reduce((a, b) => a + b, 0)) / 2;

    // Header row
    let cx = startX;
    headers.forEach((h, i) => {
      s.addShape(pres.shapes.RECTANGLE, {
        x: cx, y: 1.05, w: colW[i], h: 0.45,
        fill: { color: C.navy }
      });
      s.addText(h, {
        x: cx, y: 1.05, w: colW[i], h: 0.45,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle", shrinkText: true
      });
      cx += colW[i];
    });

    // Data rows
    rows.forEach((row, ri) => {
      const rowY = 1.5 + ri * 0.85;
      let cx2 = startX;
      row.forEach((cell, ci) => {
        const bgColor = ri % 2 === 0 ? C.offWhite : C.white;
        s.addShape(pres.shapes.RECTANGLE, {
          x: cx2, y: rowY, w: colW[ci], h: 0.85,
          fill: { color: bgColor },
          line: { color: C.border, width: 0.5 }
        });
        s.addText(cell, {
          x: cx2 + 0.1, y: rowY, w: colW[ci] - 0.2, h: 0.85,
          fontSize: ci === 0 ? F.size.body : F.size.label, fontFace: F.sans,
          bold: ci === 0, color: ci === 0 ? C.textDark : C.textBody,
          align: "center", valign: "middle", shrinkText: true
        });
        cx2 += colW[ci];
      });
    });
  }

  // ============================================================
  // SLIDE 4: GEMINI OPERATION STEPS
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "Geminiでの操作手順", "GEMINI");
    addFooter(s, 4, T);

    const steps = [
      { ic: ic.globe,    num: "1", label: "アクセス",       desc: "gemini.google.com を開く" },
      { ic: ic.signIn,   num: "2", label: "ログイン",       desc: "Googleアカウントでログイン" },
      { ic: ic.keyboard, num: "3", label: "プロンプト入力", desc: "「〜の動画を作って」と自然な日本語で入力" },
      { ic: ic.rocket,   num: "4", label: "生成",           desc: "送信して30秒〜2分待つ" },
    ];

    steps.forEach((st, i) => {
      const y = 1.05 + i * 0.95;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.78,
        fill: { color: i % 2 === 0 ? C.offWhite : C.white },
        line: { color: C.border, width: 0.5 }, rectRadius: 0.05
      });
      s.addText(st.num, {
        x: L.mx + 0.15, y: y + 0.15, w: 0.45, h: 0.45,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: C.accent }, shape: pres.shapes.OVAL, shrinkText: true
      });
      s.addImage({ data: st.ic, x: L.mx + 0.75, y: y + 0.2, w: 0.32, h: 0.32 });
      s.addText(st.label, {
        x: L.mx + 1.2, y: y + 0.05, w: 2.5, h: 0.38,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, valign: "middle", shrinkText: true
      });
      s.addText(st.desc, {
        x: L.mx + 1.2, y: y + 0.40, w: 6.5, h: 0.3,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textLight, valign: "middle", shrinkText: true
      });
      if (i < steps.length - 1) {
        s.addImage({ data: ic.chevron, x: L.mx + 0.27, y: y + 0.72, w: 0.2, h: 0.2 });
      }
    });
  }

  // ============================================================
  // SLIDE 5: DEMO 1 - Gemini Text-to-Video (Navy background)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };

    // Film icon
    s.addImage({ data: ic.film, x: (L.W - 0.8) / 2, y: 1.0, w: 0.8, h: 0.8 });

    s.addText("実演: Geminiでテキスト→動画生成", {
      x: 0.5, y: 2.0, w: 9, h: 0.8,
      fontSize: 30, fontFace: F.sans, bold: true,
      color: C.white, align: "center", valign: "middle", shrinkText: true
    });

    s.addShape(pres.shapes.LINE, {
      x: 2.5, y: 2.95, w: 5, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });

    s.addText("Geminiに話しかけるだけで動画が生まれる", {
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
  // SLIDE 6: FLOW OPERATION STEPS
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "Flowでの操作手順", "FLOW");
    addFooter(s, 6, T);

    const steps = [
      { ic: ic.globe,   num: "1", label: "アクセス",         desc: "flow.google.com を開く" },
      { ic: ic.pencil,  num: "2", label: "新規プロジェクト", desc: "プロジェクトを作成" },
      { ic: ic.cog,     num: "3", label: "モデル選択",       desc: "「Veo 3」を指定" },
      { ic: ic.keyboard, num: "4", label: "プロンプト入力",  desc: "カメラアングル・照明・動きを詳細に記述" },
      { ic: ic.sliders, num: "5", label: "調整",             desc: "Extend（尺延長）・カメラワーク設定" },
      { ic: ic.rocket,  num: "6", label: "生成",             desc: "設定完了後、生成を実行" },
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
  // SLIDE 7: USAGE TIPS - Gemini = Draft, Flow = Final
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "使い分けのコツ", "TIPS");
    addFooter(s, 7, T);

    // Gemini card
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 1.1, w: 4.0, h: 3.2,
      fill: { color: C.accentLight },
      line: { color: C.accent, width: 1 }, rectRadius: 0.08
    });
    s.addText("Gemini = ラフ案", {
      x: L.mx + 0.2, y: 1.2, w: 3.6, h: 0.45,
      fontSize: F.size.h2, fontFace: F.sans, bold: true,
      color: C.accent, align: "center", shrinkText: true
    });
    const geminiItems = [
      "アイデアを素早く形にしたい",
      "方向性を確認したい",
      "複数パターンを試したい",
    ];
    geminiItems.forEach((item, i) => {
      s.addImage({ data: ic.checkBlue, x: L.mx + 0.3, y: 1.85 + i * 0.55, w: 0.22, h: 0.22 });
      s.addText(item, {
        x: L.mx + 0.6, y: 1.78 + i * 0.55, w: 3.2, h: 0.35,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, valign: "middle", shrinkText: true
      });
    });

    // Flow card
    const flowX = L.W - L.mx - 4.0;
    s.addShape(pres.shapes.RECTANGLE, {
      x: flowX, y: 1.1, w: 4.0, h: 3.2,
      fill: { color: C.purpleBg },
      line: { color: C.purple, width: 1 }, rectRadius: 0.08
    });
    s.addText("Flow = 清書", {
      x: flowX + 0.2, y: 1.2, w: 3.6, h: 0.45,
      fontSize: F.size.h2, fontFace: F.sans, bold: true,
      color: C.purple, align: "center", shrinkText: true
    });
    const flowItems = [
      "カメラワークを指定したい",
      "尺を延長したい",
      "本番映像を仕上げたい",
    ];
    flowItems.forEach((item, i) => {
      s.addImage({ data: ic.check, x: flowX + 0.3, y: 1.85 + i * 0.55, w: 0.22, h: 0.22 });
      s.addText(item, {
        x: flowX + 0.6, y: 1.78 + i * 0.55, w: 3.2, h: 0.35,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, valign: "middle", shrinkText: true
      });
    });

    // Arrow between cards
    s.addImage({ data: ic.arrow, x: (L.W - 0.3) / 2, y: 2.4, w: 0.3, h: 0.3 });
  }

  // ============================================================
  // SLIDE 8: DEMO 2 - Image-to-Video (Navy background)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };

    // Image icon
    s.addImage({ data: ic.image, x: (L.W - 0.8) / 2, y: 1.0, w: 0.8, h: 0.8 });

    s.addText("実演: 画像→動画変換", {
      x: 0.5, y: 2.0, w: 9, h: 0.8,
      fontSize: 30, fontFace: F.sans, bold: true,
      color: C.white, align: "center", valign: "middle", shrinkText: true
    });

    s.addShape(pres.shapes.LINE, {
      x: 2.5, y: 2.95, w: 5, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });

    s.addText("静止画が映像に変わるImage-to-Videoの実力", {
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
  // SLIDE 9: IMAGE-TO-VIDEO NOTES
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "Image-to-Videoの注意点", "IMPORTANT");
    addFooter(s, 9, T);

    // Main rule
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 1.1, w: L.W - L.mx * 2, h: 0.65,
      fill: { color: C.amberBg }, rectRadius: 0.05
    });
    s.addImage({ data: ic.warning, x: L.mx + 0.15, y: 1.22, w: 0.35, h: 0.35 });
    s.addText("プロンプトには「どう動かすか」だけ書く。被写体の説明は書かない。", {
      x: L.mx + 0.6, y: 1.1, w: L.W - L.mx * 2 - 0.8, h: 0.65,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.amber, valign: "middle", shrinkText: true
    });

    // NG example
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 2.0, w: (L.W - L.mx * 2 - 0.3) / 2, h: 1.8,
      fill: { color: C.redBg },
      line: { color: C.red, width: 1 }, rectRadius: 0.06
    });
    const ngW = (L.W - L.mx * 2 - 0.3) / 2;
    s.addImage({ data: ic.times, x: L.mx + 0.15, y: 2.1, w: 0.25, h: 0.25 });
    s.addText("NG例", {
      x: L.mx + 0.45, y: 2.08, w: 1.0, h: 0.3,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.red, valign: "middle", shrinkText: true
    });
    s.addText("「高層ビルの外観。\nカメラが上にパンする」", {
      x: L.mx + 0.15, y: 2.5, w: ngW - 0.3, h: 1.0,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textBody, valign: "top", shrinkText: true
    });
    s.addText("← 被写体の説明が余計", {
      x: L.mx + 0.15, y: 3.3, w: ngW - 0.3, h: 0.35,
      fontSize: F.size.caption, fontFace: F.sans, italic: true,
      color: C.red, valign: "middle", shrinkText: true
    });

    // OK example
    const okX = L.mx + ngW + 0.3;
    s.addShape(pres.shapes.RECTANGLE, {
      x: okX, y: 2.0, w: ngW, h: 1.8,
      fill: { color: C.greenBg },
      line: { color: C.green, width: 1 }, rectRadius: 0.06
    });
    s.addImage({ data: ic.checkMark, x: okX + 0.15, y: 2.1, w: 0.25, h: 0.25 });
    s.addText("OK例", {
      x: okX + 0.45, y: 2.08, w: 1.0, h: 0.3,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.green, valign: "middle", shrinkText: true
    });
    s.addText("「カメラがゆっくり上にティルト\nする。空に雲が流れている」", {
      x: okX + 0.15, y: 2.5, w: ngW - 0.3, h: 1.0,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textBody, valign: "top", shrinkText: true
    });
    s.addText("← 動きだけを指示", {
      x: okX + 0.15, y: 3.3, w: ngW - 0.3, h: 0.35,
      fontSize: F.size.caption, fontFace: F.sans, italic: true,
      color: C.green, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 10: TEXT VS IMAGE-TO-VIDEO COMPARISON
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "Text-to-Video vs Image-to-Video", "USE CASE");
    addFooter(s, 10, T);

    const headers = ["シーン", "おすすめ", "理由"];
    const rows = [
      ["ゼロからイメージを\n作りたい",    "Text-to-Video",  "自由度が高い"],
      ["既存の写真を\n動かしたい",         "Image-to-Video", "元画像の品質を活かせる"],
      ["ブランドカラーを\n維持したい",     "Image-to-Video", "デザイン済み素材を使える"],
      ["複数パターンを\n素早く試したい",   "Text-to-Video",  "テキスト変更だけで済む"],
    ];

    const colW = [3.0, 2.2, 3.0];
    const startX = (L.W - colW.reduce((a, b) => a + b, 0)) / 2;

    // Header
    let cx = startX;
    headers.forEach((h, i) => {
      s.addShape(pres.shapes.RECTANGLE, {
        x: cx, y: 1.05, w: colW[i], h: 0.45,
        fill: { color: C.navy }
      });
      s.addText(h, {
        x: cx, y: 1.05, w: colW[i], h: 0.45,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle", shrinkText: true
      });
      cx += colW[i];
    });

    // Data rows
    rows.forEach((row, ri) => {
      const rowY = 1.5 + ri * 0.85;
      let cx2 = startX;
      row.forEach((cell, ci) => {
        const bgColor = ri % 2 === 0 ? C.offWhite : C.white;
        const isRecommend = ci === 1;
        s.addShape(pres.shapes.RECTANGLE, {
          x: cx2, y: rowY, w: colW[ci], h: 0.85,
          fill: { color: bgColor },
          line: { color: C.border, width: 0.5 }
        });
        s.addText(cell, {
          x: cx2 + 0.1, y: rowY, w: colW[ci] - 0.2, h: 0.85,
          fontSize: isRecommend ? F.size.body : F.size.label,
          fontFace: F.sans, bold: isRecommend,
          color: isRecommend ? C.accent : C.textBody,
          align: "center", valign: "middle", shrinkText: true
        });
        cx2 += colW[ci];
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
    addTitle(s, "まとめ", "SUMMARY");
    addFooter(s, 11, T);

    const items = [
      { ic: ic.exchange,  text: "Veo 3の入り口は2つ: Gemini（ラフ案）とFlow（清書）" },
      { ic: ic.keyboard,  text: "Geminiは4ステップで動画生成: アクセス→ログイン→プロンプト→生成" },
      { ic: ic.sliders,   text: "Flowはカメラワークや尺の延長など細かい調整が可能" },
      { ic: ic.camera,    text: "Image-to-Videoのプロンプトは「動きだけ」書く" },
      { ic: ic.bulb,      text: "Text-to-VideoとImage-to-Videoは目的に応じて使い分ける" },
    ];

    items.forEach((item, i) => {
      const y = 1.0 + i * 0.78;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.65,
        fill: { color: i % 2 === 0 ? C.accentLight : C.offWhite },
        line: { color: C.border, width: 0.5 }, rectRadius: 0.05
      });
      s.addImage({ data: item.ic, x: L.mx + 0.15, y: y + 0.15, w: 0.3, h: 0.3 });
      s.addText(String(i + 1), {
        x: L.mx + 0.55, y: y + 0.1, w: 0.38, h: 0.38,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: C.accent }, shape: pres.shapes.OVAL, shrinkText: true
      });
      s.addText(item.text, {
        x: L.mx + 1.05, y: y + 0.05, w: 7.0, h: 0.55,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textDark, valign: "middle", shrinkText: true
      });
    });
  }

  // ============================================================
  // SLIDE 12: CLOSING (Navy background)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };
    s.addImage({ data: ic.grad, x: (L.W - 0.65) / 2, y: 1.2, w: 0.65, h: 0.65 });
    s.addText("確認テストへ進みましょう", {
      x: 0.5, y: 2.1, w: 9, h: 0.7,
      fontSize: F.size.h1, fontFace: F.sans, bold: true,
      color: C.white, align: "center", shrinkText: true
    });
    s.addShape(pres.shapes.LINE, {
      x: 3.2, y: 2.95, w: 3.6, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });
    s.addText("5問・4択・合格ライン80点", {
      x: 0.5, y: 3.15, w: 9, h: 0.45,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", shrinkText: true
    });
    s.addText("P-02  |  Veo 3 基本操作", {
      x: 0.5, y: 4.0, w: 9, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textMuted, align: "center", shrinkText: true
    });
  }

  // Save
  await pres.writeFile({ fileName: "スライド.pptx" });
  console.log("Done: スライド.pptx generated (12 slides)");
}

main().catch(err => { console.error(err); process.exit(1); });
