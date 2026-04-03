const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const {
  FaVideo, FaCheckCircle, FaArrowRight, FaLightbulb,
  FaRocket, FaGraduationCap, FaGoogle, FaImage,
  FaVolumeUp, FaDesktop, FaChevronRight, FaStar,
  FaThumbsUp, FaExclamationTriangle, FaClipboardCheck,
  FaMagic, FaCamera, FaPalette, FaClock, FaPlay,
  FaFileAlt, FaUpload, FaCog, FaExpand, FaMobileAlt,
  FaYoutube, FaMusic, FaCommentDots, FaWind, FaEdit,
  FaTimes, FaCheck
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
  slide.addText(`P-02`, {
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
  pres.title = "P-02: Veo3完全攻略 -- 基本操作からプロンプト術まで";

  // Pre-render icons
  const ic = {
    video:     await icon(FaVideo,              C.accent),
    check:     await icon(FaCheckCircle,         C.green),
    checkBlue: await icon(FaCheckCircle,         C.accent),
    arrow:     await icon(FaArrowRight,          C.accent),
    bulb:      await icon(FaLightbulb,           C.amber),
    rocket:    await icon(FaRocket,              C.accent),
    grad:      await icon(FaGraduationCap,       C.green),
    google:    await icon(FaGoogle,              C.accent),
    image:     await icon(FaImage,               C.accent),
    volume:    await icon(FaVolumeUp,            C.purple),
    desktop:   await icon(FaDesktop,             C.accent),
    chevron:   await icon(FaChevronRight,        C.accent),
    star:      await icon(FaStar,                C.amber),
    thumbsUp:  await icon(FaThumbsUp,            C.green),
    warning:   await icon(FaExclamationTriangle, C.amber),
    clipboard: await icon(FaClipboardCheck,      C.accent),
    magic:     await icon(FaMagic,               C.accent),
    camera:    await icon(FaCamera,              C.accent),
    palette:   await icon(FaPalette,             C.purple),
    clock:     await icon(FaClock,               C.amber),
    play:      await icon(FaPlay,                C.accent),
    fileAlt:   await icon(FaFileAlt,             C.accent),
    upload:    await icon(FaUpload,              C.accent),
    cog:       await icon(FaCog,                 C.accent),
    expand:    await icon(FaExpand,              C.accent),
    mobile:    await icon(FaMobileAlt,           C.purple),
    youtube:   await icon(FaYoutube,             C.red),
    music:     await icon(FaMusic,               C.purple),
    comment:   await icon(FaCommentDots,         C.accent),
    wind:      await icon(FaWind,                C.green),
    edit:      await icon(FaEdit,                C.accent),
    times:     await icon(FaTimes,               C.red),
    checkGreen: await icon(FaCheck,              C.green),
  };

  // ============================================================
  // SLIDE 1: TITLE (Navy background)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };
    s.addImage({ data: ic.video, x: (L.W - 0.65) / 2, y: 0.85, w: 0.65, h: 0.65 });
    s.addText("Veo3完全攻略", {
      x: 0.5, y: 1.65, w: 9, h: 0.85,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center", shrinkText: true
    });
    s.addShape(pres.shapes.LINE, {
      x: 3.2, y: 2.65, w: 3.6, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });
    s.addText("基本操作からプロンプト術まで", {
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
      { icon: ic.google,  text: "Veo3にアクセスして動画を生成できる" },
      { icon: ic.edit,    text: "効果的なプロンプトを書けるようになる" },
      { icon: ic.cog,     text: "用途に応じた設定（解像度・アスペクト比）を選べる" },
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
  // SLIDE 3: ACCESS METHOD
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "Veo3へのアクセス方法", "ACCESS");
    addFooter(s, 3, T);

    const steps = [
      { ic: ic.desktop, num: "1", label: "AI Studioにアクセス", desc: "aistudio.google.com をブラウザで開く" },
      { ic: ic.google,  num: "2", label: "Googleログイン",      desc: "Googleアカウントでサインイン" },
      { ic: ic.video,   num: "3", label: "Veoを選択",           desc: "左メニューから「Veo」をクリック" },
      { ic: ic.play,    num: "4", label: "プロンプト入力",      desc: "テキストを入力して「Generate」をクリック" },
    ];

    steps.forEach((st, i) => {
      const y = 1.05 + i * 0.85;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.72,
        fill: { color: i % 2 === 0 ? C.offWhite : C.white },
        line: { color: C.border, width: 0.5 }, rectRadius: 0.05
      });
      s.addText(st.num, {
        x: L.mx + 0.15, y: y + 0.13, w: 0.45, h: 0.45,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: C.accent }, shape: pres.shapes.OVAL, shrinkText: true
      });
      s.addImage({ data: st.ic, x: L.mx + 0.75, y: y + 0.18, w: 0.32, h: 0.32 });
      s.addText(st.label, {
        x: L.mx + 1.2, y: y + 0.05, w: 2.5, h: 0.35,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, valign: "middle", shrinkText: true
      });
      s.addText(st.desc, {
        x: L.mx + 1.2, y: y + 0.35, w: 6.5, h: 0.3,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textLight, valign: "middle", shrinkText: true
      });
      if (i < steps.length - 1) {
        s.addImage({ data: ic.chevron, x: L.mx + 0.27, y: y + 0.65, w: 0.2, h: 0.2 });
      }
    });

    // Hint
    s.addImage({ data: ic.bulb, x: L.mx, y: 4.55, w: 0.22, h: 0.22 });
    s.addText("無料で利用可能。Google One AI Premium ($19.99/月) で上限解放、14日間無料トライアルあり", {
      x: L.mx + 0.32, y: 4.5, w: L.W - L.mx * 2 - 0.4, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans, italic: true,
      color: C.textLight, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 4: TEXT-TO-VIDEO BASICS
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "Text-to-Video基本ルール", "BASIC");
    addFooter(s, 4, T);

    const rules = [
      { ic: ic.fileAlt, label: "英語で書く",           desc: "日本語より英語の方が精度が高い" },
      { ic: ic.magic,   label: "具体的に描写する",     desc: "被写体・場所・時間帯を明確に" },
      { ic: ic.camera,  label: "1動画1シーン",         desc: "複数シーンを詰め込まない" },
      { ic: ic.play,    label: "動きを明確に指定",     desc: "「いる」ではなく「走っている」" },
    ];

    rules.forEach((r, i) => {
      const y = 1.05 + i * 0.85;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.72,
        fill: { color: i % 2 === 0 ? C.accentLight : C.offWhite },
        line: { color: C.border, width: 0.5 }, rectRadius: 0.05
      });
      s.addText(String(i + 1), {
        x: L.mx + 0.15, y: y + 0.13, w: 0.45, h: 0.45,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: C.accent }, shape: pres.shapes.OVAL, shrinkText: true
      });
      s.addImage({ data: r.ic, x: L.mx + 0.75, y: y + 0.18, w: 0.32, h: 0.32 });
      s.addText(r.label, {
        x: L.mx + 1.2, y: y + 0.05, w: 3.0, h: 0.35,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, valign: "middle", shrinkText: true
      });
      s.addText(r.desc, {
        x: L.mx + 1.2, y: y + 0.35, w: 6.5, h: 0.3,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textLight, valign: "middle", shrinkText: true
      });
    });

    // Example
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.55, w: L.W - L.mx * 2, h: 0.45,
      fill: { color: C.greenBg }, rectRadius: 0.04
    });
    s.addImage({ data: ic.checkGreen, x: L.mx + 0.12, y: 4.62, w: 0.24, h: 0.24 });
    s.addText("例: \"A golden retriever running through a field of sunflowers at sunset\"", {
      x: L.mx + 0.45, y: 4.55, w: L.W - L.mx * 2 - 0.6, h: 0.45,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.green, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 5: PROMPT TEMPLATE
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "プロンプト設計テンプレート", "TEMPLATE");
    addFooter(s, 5, T);

    const elements = [
      { ic: ic.camera,  label: "被写体",     desc: "何を映すか",           example: "ビジネスマン / 東京の街並み", color: C.accent,  bgColor: C.accentLight },
      { ic: ic.play,    label: "動き",       desc: "どう動くか",           example: "ゆっくり歩く / 振り向く",   color: C.green,   bgColor: C.greenBg },
      { ic: ic.video,   label: "カメラワーク", desc: "どう撮るか",          example: "ドリーイン / パン / 俯瞰",   color: C.purple,  bgColor: C.purpleBg },
      { ic: ic.palette,  label: "雰囲気",     desc: "どんなトーンか",       example: "cinematic / warm / dramatic", color: C.amber,   bgColor: C.amberBg },
      { ic: ic.clock,   label: "時間帯",     desc: "いつか",              example: "golden hour / 深夜 / 朝焼け", color: C.red,     bgColor: C.redBg },
    ];

    const cardW = 1.55;
    const cardGap = 0.12;
    const totalW = cardW * 5 + cardGap * 4;
    const startX = (L.W - totalW) / 2;

    elements.forEach((e, i) => {
      const x = startX + i * (cardW + cardGap);
      const y = 1.05;

      // Card
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 3.2,
        fill: { color: C.offWhite }, line: { color: C.border, width: 0.5 }, rectRadius: 0.05
      });
      // Colored header
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 0.55,
        fill: { color: e.bgColor }, rectRadius: 0.05
      });
      // Icon
      s.addImage({ data: e.ic, x: x + (cardW - 0.32) / 2, y: y + 0.1, w: 0.32, h: 0.32 });
      // Label
      s.addText(e.label, {
        x, y: y + 0.6, w: cardW, h: 0.35,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: e.color, align: "center", shrinkText: true
      });
      // Description
      s.addText(e.desc, {
        x: x + 0.08, y: y + 1.0, w: cardW - 0.16, h: 0.3,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, align: "center", shrinkText: true
      });
      // Example
      s.addText(e.example, {
        x: x + 0.08, y: y + 1.4, w: cardW - 0.16, h: 0.7,
        fontSize: F.size.label, fontFace: F.sans, italic: true,
        color: C.textLight, align: "center", valign: "top", shrinkText: true
      });

      // Plus sign between cards
      if (i < elements.length - 1) {
        s.addText("+", {
          x: x + cardW, y: y + 0.1, w: cardGap, h: 0.45,
          fontSize: F.size.h3, fontFace: F.sans, bold: true,
          color: C.accent, align: "center", valign: "middle", shrinkText: true
        });
      }
    });

    // Hint
    s.addImage({ data: ic.bulb, x: L.mx, y: 4.55, w: 0.22, h: 0.22 });
    s.addText("5要素すべてを入れる必要はないが、多いほど意図通りの動画に近づく", {
      x: L.mx + 0.32, y: 4.5, w: L.W - L.mx * 2 - 0.4, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans, italic: true,
      color: C.textLight, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 6: GOOD vs BAD PROMPTS
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "良いプロンプト vs 悪いプロンプト", "COMPARE");
    addFooter(s, 6, T);

    // Table header
    const tableY = 1.0;
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: tableY, w: L.W - L.mx * 2, h: 0.45,
      fill: { color: C.navy }, rectRadius: 0.04
    });
    s.addImage({ data: ic.times, x: L.mx + 0.15, y: tableY + 0.1, w: 0.24, h: 0.24 });
    s.addText("Before（悪い例）", {
      x: L.mx + 0.45, y: tableY, w: 3.5, h: 0.45,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.white, valign: "middle", shrinkText: true
    });
    s.addImage({ data: ic.checkGreen, x: L.mx + 4.3, y: tableY + 0.1, w: 0.24, h: 0.24 });
    s.addText("After（良い例）", {
      x: L.mx + 4.6, y: tableY, w: 3.8, h: 0.45,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.white, valign: "middle", shrinkText: true
    });

    const rows = [
      {
        bad: "\"A cat\"",
        good: "\"A fluffy white cat stretching lazily on a sunlit windowsill, soft bokeh, warm afternoon light\""
      },
      {
        bad: "\"City at night\"",
        good: "\"Aerial dolly shot of Tokyo Shibuya crossing at night, neon lights reflecting on wet streets, cinematic color grading\""
      },
      {
        bad: "\"Person talking\"",
        good: "\"Close-up of a young woman speaking to camera with a warm smile, shallow depth of field, natural studio lighting, with clear voice narration\""
      },
    ];

    rows.forEach((r, i) => {
      const y = tableY + 0.45 + i * 1.0;
      // Row background
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.9,
        fill: { color: i % 2 === 0 ? C.offWhite : C.white },
        line: { color: C.border, width: 0.3 }
      });
      // Bad column
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx + 0.1, y: y + 0.15, w: 3.8, h: 0.6,
        fill: { color: C.redBg }, rectRadius: 0.04
      });
      s.addText(r.bad, {
        x: L.mx + 0.2, y: y + 0.15, w: 3.6, h: 0.6,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.red, valign: "middle", shrinkText: true
      });
      // Good column
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx + 4.15, y: y + 0.08, w: 4.2, h: 0.75,
        fill: { color: C.greenBg }, rectRadius: 0.04
      });
      s.addText(r.good, {
        x: L.mx + 4.25, y: y + 0.08, w: 4.0, h: 0.75,
        fontSize: F.size.caption, fontFace: F.sans,
        color: C.green, valign: "middle", shrinkText: true
      });
    });

    // Hint
    s.addImage({ data: ic.bulb, x: L.mx, y: 4.55, w: 0.22, h: 0.22 });
    s.addText("音声の指示を含めると、Veo3は効果音や会話まで同時に生成します", {
      x: L.mx + 0.32, y: 4.5, w: L.W - L.mx * 2 - 0.4, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans, italic: true,
      color: C.textLight, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 7: IMAGE-TO-VIDEO
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "Image-to-Video", "IMAGE");
    addFooter(s, 7, T);

    // Flow steps
    const steps = [
      { ic: ic.upload, label: "画像をアップロード" },
      { ic: ic.edit,   label: "動きの指示を入力" },
      { ic: ic.play,   label: "動画を生成" },
    ];

    const stepW = 2.3;
    const arrowW = 0.4;
    const totalW = stepW * 3 + arrowW * 2;
    const startX = (L.W - totalW) / 2;

    steps.forEach((st, i) => {
      const x = startX + i * (stepW + arrowW);
      const y = 1.05;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: stepW, h: 1.1,
        fill: { color: C.accentLight }, line: { color: C.border, width: 0.5 }, rectRadius: 0.05
      });
      s.addText(String(i + 1), {
        x: x + (stepW - 0.35) / 2, y: y + 0.08, w: 0.35, h: 0.35,
        fontSize: F.size.label, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: C.accent }, shape: pres.shapes.OVAL, shrinkText: true
      });
      s.addImage({ data: st.ic, x: x + (stepW - 0.28) / 2, y: y + 0.45, w: 0.28, h: 0.28 });
      s.addText(st.label, {
        x, y: y + 0.78, w: stepW, h: 0.28,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.accent, align: "center", shrinkText: true
      });
      if (i < steps.length - 1) {
        s.addImage({ data: ic.chevron, x: x + stepW + 0.08, y: y + 0.4, w: 0.22, h: 0.22 });
      }
    });

    // Use cases
    const cases = [
      { ic: ic.image,  label: "商品写真",     desc: "→ 360度回転アニメーション" },
      { ic: ic.desktop, label: "社屋写真",    desc: "→ 空撮風ドローン動画" },
      { ic: ic.magic,  label: "ロゴ画像",     desc: "→ モーションロゴ" },
    ];

    const caseY = 2.5;
    const caseW = 2.5;
    const caseGap = 0.26;
    const caseTotalW = caseW * 3 + caseGap * 2;
    const caseStartX = (L.W - caseTotalW) / 2;

    cases.forEach((c, i) => {
      const x = caseStartX + i * (caseW + caseGap);
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: caseY, w: caseW, h: 1.4,
        fill: { color: C.offWhite }, line: { color: C.border, width: 0.5 }, rectRadius: 0.05
      });
      s.addImage({ data: c.ic, x: x + (caseW - 0.3) / 2, y: caseY + 0.15, w: 0.3, h: 0.3 });
      s.addText(c.label, {
        x, y: caseY + 0.5, w: caseW, h: 0.35,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, align: "center", shrinkText: true
      });
      s.addText(c.desc, {
        x, y: caseY + 0.9, w: caseW, h: 0.35,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textLight, align: "center", shrinkText: true
      });
    });

    s.addImage({ data: ic.bulb, x: L.mx, y: 4.2, w: 0.22, h: 0.22 });
    s.addText("既存アセットを動画化できるので、ゼロから作る必要がありません", {
      x: L.mx + 0.32, y: 4.15, w: L.W - L.mx * 2 - 0.4, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans, italic: true,
      color: C.textLight, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 8: AUDIO GENERATION
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "音声同時生成 ── Veo3最大の強み", "AUDIO");
    addFooter(s, 8, T);

    const items = [
      { ic: ic.music,   label: "効果音",   desc: "ドアの開閉、足音、\nキーボード音など",     bgColor: C.accentLight, labelColor: C.accent },
      { ic: ic.wind,    label: "環境音",   desc: "雨音、カフェの雑音、\n鳥のさえずりなど",    bgColor: C.greenBg,     labelColor: C.green },
      { ic: ic.comment, label: "会話音声", desc: "キャラクターのセリフを\nプロンプトで指定",    bgColor: C.purpleBg,    labelColor: C.purple },
    ];

    const cardW = 2.5;
    const cardGap = 0.26;
    const totalW = cardW * 3 + cardGap * 2;
    const startX = (L.W - totalW) / 2;

    items.forEach((e, i) => {
      const x = startX + i * (cardW + cardGap);
      const y = 1.05;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 2.4,
        fill: { color: C.offWhite }, line: { color: C.border, width: 0.5 }, rectRadius: 0.05
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 0.55,
        fill: { color: e.bgColor }, rectRadius: 0.05
      });
      s.addImage({ data: e.ic, x: x + (cardW - 0.32) / 2, y: y + 0.1, w: 0.32, h: 0.32 });
      s.addText(e.label, {
        x, y: y + 0.65, w: cardW, h: 0.35,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: e.labelColor, align: "center", shrinkText: true
      });
      s.addText(e.desc, {
        x: x + 0.15, y: y + 1.1, w: cardW - 0.3, h: 1.0,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, align: "center", valign: "top", shrinkText: true
      });
    });

    // Comparison note
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.75, w: L.W - L.mx * 2, h: 0.55,
      fill: { color: C.amberBg }, rectRadius: 0.04
    });
    s.addImage({ data: ic.star, x: L.mx + 0.12, y: 3.88, w: 0.24, h: 0.24 });
    s.addText("Runway・Soraなど他ツールでは別途音声編集が必要 → Veo3なら一発で完成！", {
      x: L.mx + 0.45, y: 3.75, w: L.W - L.mx * 2 - 0.6, h: 0.55,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.amber, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 9: RESOLUTION & ASPECT RATIO
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "解像度・アスペクト比の使い分け", "SETTINGS");
    addFooter(s, 9, T);

    // Table header
    const tableY = 1.0;
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: tableY, w: L.W - L.mx * 2, h: 0.45,
      fill: { color: C.navy }, rectRadius: 0.04
    });
    ["設定", "選択肢", "用途"].forEach((h, i) => {
      const widths = [2.0, 2.5, 3.8];
      const offsets = [0, 2.0, 4.5];
      s.addText(h, {
        x: L.mx + offsets[i] + 0.15, y: tableY, w: widths[i], h: 0.45,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.white, valign: "middle", shrinkText: true
      });
    });

    const rows = [
      { setting: "解像度",       option: "720p",           use: "テスト生成・下書き",                 ic: ic.cog },
      { setting: "解像度",       option: "1080p",          use: "本番用・高品質",                     ic: ic.cog },
      { setting: "アスペクト比", option: "16:9（横型）",   use: "YouTube / プレゼン資料",             ic: ic.youtube },
      { setting: "アスペクト比", option: "9:16（縦型）",   use: "Instagram Reels / TikTok / Shorts",  ic: ic.mobile },
      { setting: "動画の長さ",   option: "4s / 6s / 8s",  use: "短いほど品質安定",                   ic: ic.clock },
    ];

    rows.forEach((r, i) => {
      const y = tableY + 0.45 + i * 0.56;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.50,
        fill: { color: i % 2 === 0 ? C.offWhite : C.white },
        line: { color: C.border, width: 0.3 }
      });
      s.addImage({ data: r.ic, x: L.mx + 0.12, y: y + 0.1, w: 0.26, h: 0.26 });
      s.addText(r.setting, {
        x: L.mx + 0.45, y, w: 1.55, h: 0.50,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.textDark, valign: "middle", shrinkText: true
      });
      s.addText(r.option, {
        x: L.mx + 2.15, y, w: 2.35, h: 0.50,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.accent, valign: "middle", shrinkText: true
      });
      s.addText(r.use, {
        x: L.mx + 4.65, y, w: 3.65, h: 0.50,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, valign: "middle", shrinkText: true
      });
    });

    // Workflow tip
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.15, w: L.W - L.mx * 2, h: 0.48,
      fill: { color: C.accentLight }, rectRadius: 0.04
    });
    s.addImage({ data: ic.rocket, x: L.mx + 0.12, y: 4.25, w: 0.24, h: 0.24 });
    s.addText("おすすめ: テスト時 720p・4s → 本番 1080p・8s の2段階ワークフロー", {
      x: L.mx + 0.45, y: 4.15, w: L.W - L.mx * 2 - 0.6, h: 0.48,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 10: 5 QUALITY TIPS
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "品質を上げるコツ5選", "TIPS");
    addFooter(s, 10, T);

    const tips = [
      { ic: ic.fileAlt, label: "英語プロンプト",       desc: "最も精度が高い。日本語から翻訳してもOK" },
      { ic: ic.camera,  label: "カメラワーク用語",     desc: "dolly in / pan / tracking shot / aerial" },
      { ic: ic.palette, label: "照明・色調を指定",     desc: "golden hour / cinematic color grading" },
      { ic: ic.volume,  label: "音声指示を追加",       desc: "\"with ambient rain sounds\" 等" },
      { ic: ic.rocket,  label: "4sでテスト→8sで本番", desc: "短い動画で方向性を確認してから本番へ" },
    ];

    tips.forEach((t, i) => {
      const y = 1.0 + i * 0.72;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.62,
        fill: { color: i % 2 === 0 ? C.accentLight : C.offWhite },
        line: { color: C.border, width: 0.5 }, rectRadius: 0.05
      });
      s.addText(String(i + 1), {
        x: L.mx + 0.15, y: y + 0.08, w: 0.42, h: 0.42,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: C.accent }, shape: pres.shapes.OVAL, shrinkText: true
      });
      s.addImage({ data: t.ic, x: L.mx + 0.7, y: y + 0.14, w: 0.3, h: 0.3 });
      s.addText(t.label, {
        x: L.mx + 1.15, y: y + 0.02, w: 2.8, h: 0.3,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, valign: "middle", shrinkText: true
      });
      s.addText(t.desc, {
        x: L.mx + 1.15, y: y + 0.3, w: 6.5, h: 0.28,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textLight, valign: "middle", shrinkText: true
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

    const points = [
      { ic: ic.google,   text: "Veo3はGoogle AI Studioから無料で利用可能" },
      { ic: ic.video,    text: "Text-to-Video と Image-to-Video の2つの方法" },
      { ic: ic.volume,   text: "音声同時生成が他ツールにない最大の強み" },
      { ic: ic.magic,    text: "プロンプトは 被写体＋動き＋カメラワーク＋雰囲気＋時間帯" },
      { ic: ic.rocket,   text: "720p/4sでテスト → 1080p/8sで本番の2段階ワークフロー" },
    ];

    points.forEach((p, i) => {
      const y = 1.0 + i * 0.72;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.62,
        fill: { color: i % 2 === 0 ? C.accentLight : C.offWhite },
        line: { color: C.border, width: 0.5 }, rectRadius: 0.05
      });
      s.addImage({ data: p.ic, x: L.mx + 0.2, y: y + 0.15, w: 0.3, h: 0.3 });
      s.addImage({ data: ic.check, x: L.mx + 0.6, y: y + 0.16, w: 0.28, h: 0.28 });
      s.addText(p.text, {
        x: L.mx + 1.05, y, w: 7.0, h: 0.62,
        fontSize: F.size.h3, fontFace: F.sans,
        color: C.textDark, valign: "middle", shrinkText: true
      });
    });

    // Next part
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.65, w: L.W - L.mx * 2, h: 0.45,
      fill: { color: C.lightGray }, rectRadius: 0.04
    });
    s.addImage({ data: ic.arrow, x: L.mx + 0.15, y: 4.73, w: 0.24, h: 0.24 });
    s.addText("次のパート: P-03 Runway・HeyGen実践（ツールの使い分けを学ぶ）", {
      x: L.mx + 0.5, y: 4.65, w: L.W - L.mx * 2 - 0.65, h: 0.45,
      fontSize: F.size.body, fontFace: F.sans, italic: true,
      color: C.textBody, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 12: END (Navy background)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };
    s.addImage({ data: ic.clipboard, x: (L.W - 0.65) / 2, y: 1.2, w: 0.65, h: 0.65 });
    s.addText("確認テストへ進む", {
      x: 0.5, y: 2.1, w: 9, h: 0.7,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center", shrinkText: true
    });
    s.addShape(pres.shapes.LINE, {
      x: 3.2, y: 2.95, w: 3.6, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });
    s.addText("P-02 修了", {
      x: 0.5, y: 3.1, w: 9, h: 0.45,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", shrinkText: true
    });
  }

  // ============================================================
  // SAVE
  // ============================================================
  const outPath = `${__dirname}/スライド.pptx`;
  await pres.writeFile({ fileName: outPath });
  console.log(`Saved: ${outPath}`);
}

main().catch(e => { console.error(e); process.exit(1); });
