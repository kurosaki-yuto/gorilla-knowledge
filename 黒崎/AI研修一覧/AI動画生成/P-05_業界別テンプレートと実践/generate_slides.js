const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const {
  FaVideo, FaCheckCircle, FaArrowRight, FaLightbulb,
  FaRocket, FaGraduationCap, FaUtensils, FaBuilding,
  FaShoppingCart, FaUserTie, FaHospital, FaBook,
  FaEdit, FaPlay, FaExclamationTriangle, FaClipboardCheck,
  FaMagic, FaShieldAlt, FaGavel, FaTimesCircle,
  FaCog, FaChevronRight, FaStar, FaCheck,
  FaTimes, FaCommentDots, FaUsers, FaChartLine,
  FaInstagram, FaTiktok, FaYoutube, FaCalendarCheck,
  FaFileAlt, FaCamera, FaPalette, FaClock,
  FaVolumeUp, FaMicrophone, FaBan, FaEye,
  FaThumbsUp, FaWrench, FaGlobe
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
  slide.addText(`P-05`, {
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
  pres.title = "P-05: 業界別テンプレートと実践";

  // Pre-render icons
  const ic = {
    video:     await icon(FaVideo,              C.accent),
    check:     await icon(FaCheckCircle,         C.green),
    checkBlue: await icon(FaCheckCircle,         C.accent),
    arrow:     await icon(FaArrowRight,          C.accent),
    bulb:      await icon(FaLightbulb,           C.amber),
    rocket:    await icon(FaRocket,              C.accent),
    grad:      await icon(FaGraduationCap,       C.green),
    utensils:  await icon(FaUtensils,            C.red),
    building:  await icon(FaBuilding,            C.accent),
    cart:      await icon(FaShoppingCart,         C.green),
    userTie:   await icon(FaUserTie,             C.purple),
    hospital:  await icon(FaHospital,            C.red),
    book:      await icon(FaBook,                C.accent),
    edit:      await icon(FaEdit,                C.accent),
    play:      await icon(FaPlay,                C.accent),
    warning:   await icon(FaExclamationTriangle, C.amber),
    clipboard: await icon(FaClipboardCheck,      C.accent),
    magic:     await icon(FaMagic,               C.accent),
    shield:    await icon(FaShieldAlt,           C.red),
    gavel:     await icon(FaGavel,               C.red),
    timesCircle: await icon(FaTimesCircle,       C.red),
    cog:       await icon(FaCog,                 C.accent),
    chevron:   await icon(FaChevronRight,        C.accent),
    star:      await icon(FaStar,                C.amber),
    checkGreen: await icon(FaCheck,              C.green),
    times:     await icon(FaTimes,               C.red),
    comment:   await icon(FaCommentDots,         C.accent),
    users:     await icon(FaUsers,               C.accent),
    chart:     await icon(FaChartLine,           C.green),
    fileAlt:   await icon(FaFileAlt,             C.accent),
    camera:    await icon(FaCamera,              C.accent),
    palette:   await icon(FaPalette,             C.purple),
    clock:     await icon(FaClock,               C.amber),
    volume:    await icon(FaVolumeUp,            C.purple),
    mic:       await icon(FaMicrophone,          C.purple),
    ban:       await icon(FaBan,                 C.red),
    eye:       await icon(FaEye,                 C.accent),
    thumbsUp:  await icon(FaThumbsUp,            C.green),
    wrench:    await icon(FaWrench,              C.accent),
    globe:     await icon(FaGlobe,               C.accent),
  };

  // ============================================================
  // SLIDE 1: TITLE (Navy background)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };
    s.addImage({ data: ic.utensils, x: (L.W - 0.65) / 2, y: 0.85, w: 0.65, h: 0.65 });
    s.addText("業界別テンプレートと実践", {
      x: 0.5, y: 1.65, w: 9, h: 0.85,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center", shrinkText: true
    });
    s.addShape(pres.shapes.LINE, {
      x: 3.2, y: 2.65, w: 3.6, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });
    s.addText("著作権・倫理＋総まとめ", {
      x: 0.5, y: 2.8, w: 9, h: 0.45,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", shrinkText: true
    });
    s.addText("P-05  |  全社員  |  12分", {
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
      { icon: ic.clipboard, text: "自分の業界テンプレートを持ち帰る" },
      { icon: ic.shield,    text: "著作権・倫理ルールを理解する" },
      { icon: ic.rocket,    text: "宿題に取り組み、実践を始める" },
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
  // SLIDE 3: RESTAURANT TEMPLATE
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "飲食店テンプレート", "RESTAURANT");
    addFooter(s, 3, T);

    // Template box
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 1.05, w: L.W - L.mx * 2, h: 1.2,
      fill: { color: C.offWhite }, line: { color: C.border, width: 0.5 }, rectRadius: 0.05
    });
    s.addImage({ data: ic.utensils, x: L.mx + 0.15, y: 1.12, w: 0.3, h: 0.3 });
    s.addText("プロンプトテンプレート", {
      x: L.mx + 0.55, y: 1.08, w: 3, h: 0.3,
      fontSize: F.size.body, fontFace: F.sans, bold: true, color: C.textDark, shrinkText: true
    });
    s.addText("\"Close-up of [料理名], [調理アクション], [盛り付け],\nwith [音声指示], cinematic food photography, warm lighting\"", {
      x: L.mx + 0.3, y: 1.4, w: L.W - L.mx * 2 - 0.6, h: 0.75,
      fontSize: F.size.label, fontFace: F.sans, italic: true, color: C.accent, shrinkText: true
    });

    // Example
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 2.4, w: L.W - L.mx * 2, h: 0.85,
      fill: { color: C.greenBg }, line: { color: C.border, width: 0.5 }, rectRadius: 0.05
    });
    s.addImage({ data: ic.checkGreen, x: L.mx + 0.15, y: 2.52, w: 0.25, h: 0.25 });
    s.addText("例: \"Close-up of a wagyu steak being seared on a hot iron plate, juicy fat sizzling, chef garnishing with fresh herbs, with sizzle and crunch sound effects, cinematic food photography, warm golden lighting\"", {
      x: L.mx + 0.5, y: 2.4, w: L.W - L.mx * 2 - 0.7, h: 0.85,
      fontSize: F.size.caption + 1, fontFace: F.sans, color: C.green, shrinkText: true
    });

    // Sound tips
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.45, w: L.W - L.mx * 2, h: 1.3,
      fill: { color: C.purpleBg }, line: { color: C.border, width: 0.5 }, rectRadius: 0.05
    });
    s.addImage({ data: ic.volume, x: L.mx + 0.15, y: 3.55, w: 0.3, h: 0.3 });
    s.addText("音声のコツ", {
      x: L.mx + 0.55, y: 3.5, w: 2, h: 0.35,
      fontSize: F.size.body, fontFace: F.sans, bold: true, color: C.purple, shrinkText: true
    });

    const sounds = [
      { keyword: "sizzle", desc: "ジュージュー（焼き音）" },
      { keyword: "pouring", desc: "トクトク（注ぐ音）" },
      { keyword: "crunch", desc: "サクサク（食感の音）" },
    ];
    sounds.forEach((snd, i) => {
      const y = 3.9 + i * 0.25;
      s.addText(`${snd.keyword}`, {
        x: L.mx + 0.55, y, w: 1.2, h: 0.25,
        fontSize: F.size.label, fontFace: F.sans, bold: true, color: C.purple, shrinkText: true
      });
      s.addText(`→ ${snd.desc}`, {
        x: L.mx + 1.75, y, w: 5, h: 0.25,
        fontSize: F.size.label, fontFace: F.sans, color: C.textBody, shrinkText: true
      });
    });
  }

  // ============================================================
  // SLIDE 4: REAL ESTATE / EC / RECRUITMENT
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "不動産・EC・採用テンプレート", "3 INDUSTRIES");
    addFooter(s, 4, T);

    const industries = [
      {
        ic: ic.building, label: "不動産", color: C.accent, bgColor: C.accentLight,
        prompt: "\"Smooth dolly shot through [物件], natural daylight, real estate cinematic style, with ambient room tone\"",
        tip: "音声: 環境音（ambient room tone）"
      },
      {
        ic: ic.cart, label: "EC", color: C.green, bgColor: C.greenBg,
        prompt: "\"Product showcase: [商品名] slowly rotating on [背景], soft studio lighting, with subtle click sound\"",
        tip: "音声: ASMR的質感音"
      },
      {
        ic: ic.userTie, label: "採用", color: C.purple, bgColor: C.purpleBg,
        prompt: "\"[人物] working at [職場], smiling, corporate documentary style, with office ambient sounds\"",
        tip: "音声: オフィス環境音"
      },
    ];

    industries.forEach((ind, i) => {
      const y = 1.05 + i * 1.25;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 1.1,
        fill: { color: ind.bgColor }, line: { color: C.border, width: 0.5 }, rectRadius: 0.05
      });
      s.addImage({ data: ind.ic, x: L.mx + 0.15, y: y + 0.1, w: 0.3, h: 0.3 });
      s.addText(ind.label, {
        x: L.mx + 0.55, y: y + 0.05, w: 1.5, h: 0.35,
        fontSize: F.size.h3, fontFace: F.sans, bold: true, color: ind.color, shrinkText: true
      });
      s.addText(ind.prompt, {
        x: L.mx + 0.55, y: y + 0.38, w: L.W - L.mx * 2 - 0.8, h: 0.35,
        fontSize: F.size.caption + 1, fontFace: F.sans, italic: true, color: C.textBody, shrinkText: true
      });
      s.addText(ind.tip, {
        x: L.mx + 0.55, y: y + 0.75, w: 4, h: 0.25,
        fontSize: F.size.label, fontFace: F.sans, bold: true, color: ind.color, shrinkText: true
      });
    });
  }

  // ============================================================
  // SLIDE 5: MEDICAL / EDUCATION
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "医療・教育テンプレート", "2 INDUSTRIES");
    addFooter(s, 5, T);

    // Medical
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 1.05, w: L.W - L.mx * 2, h: 1.3,
      fill: { color: C.redBg }, line: { color: C.border, width: 0.5 }, rectRadius: 0.05
    });
    s.addImage({ data: ic.hospital, x: L.mx + 0.15, y: 1.15, w: 0.3, h: 0.3 });
    s.addText("医療", {
      x: L.mx + 0.55, y: 1.1, w: 1.5, h: 0.35,
      fontSize: F.size.h3, fontFace: F.sans, bold: true, color: C.red, shrinkText: true
    });
    s.addText("\"A [医療従事者] in a clean, modern clinic [アクション],\ngentle and reassuring atmosphere, soft white lighting, with calm background music\"", {
      x: L.mx + 0.55, y: 1.45, w: L.W - L.mx * 2 - 0.8, h: 0.5,
      fontSize: F.size.caption + 1, fontFace: F.sans, italic: true, color: C.textBody, shrinkText: true
    });
    s.addText("音声: 落ち着いたBGM（calm background music）", {
      x: L.mx + 0.55, y: 2.0, w: 5, h: 0.25,
      fontSize: F.size.label, fontFace: F.sans, bold: true, color: C.red, shrinkText: true
    });

    // Education
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 2.55, w: L.W - L.mx * 2, h: 1.3,
      fill: { color: C.accentLight }, line: { color: C.border, width: 0.5 }, rectRadius: 0.05
    });
    s.addImage({ data: ic.book, x: L.mx + 0.15, y: 2.65, w: 0.3, h: 0.3 });
    s.addText("教育", {
      x: L.mx + 0.55, y: 2.6, w: 1.5, h: 0.35,
      fontSize: F.size.h3, fontFace: F.sans, bold: true, color: C.accent, shrinkText: true
    });
    s.addText("\"[講師/生徒] in a bright classroom [学習シーン],\nwarm educational tone, with a clear voice narration saying: '[セリフ]'\"", {
      x: L.mx + 0.55, y: 2.95, w: L.W - L.mx * 2 - 0.8, h: 0.5,
      fontSize: F.size.caption + 1, fontFace: F.sans, italic: true, color: C.textBody, shrinkText: true
    });
    s.addText("音声: セリフ生成でナレーション付き解説動画", {
      x: L.mx + 0.55, y: 3.5, w: 5, h: 0.25,
      fontSize: F.size.label, fontFace: F.sans, bold: true, color: C.accent, shrinkText: true
    });

    // Tip
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.1, w: L.W - L.mx * 2, h: 0.65,
      fill: { color: C.amberBg }, rectRadius: 0.04
    });
    s.addImage({ data: ic.bulb, x: L.mx + 0.15, y: 4.2, w: 0.25, h: 0.25 });
    s.addText("セリフ活用のコツ: 英語で短く「1文15語以内」が安定。日本語セリフは不自然になりやすい", {
      x: L.mx + 0.5, y: 4.1, w: L.W - L.mx * 2 - 0.7, h: 0.65,
      fontSize: F.size.label, fontFace: F.sans, bold: true, color: C.amber, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 6: CUSTOMIZATION METHOD
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "テンプレートのカスタマイズ方法", "CUSTOMIZE");
    addFooter(s, 6, T);

    const steps = [
      { ic: ic.edit,  num: "1", label: "[ ] を差し替える", desc: "カッコ部分を自分の内容に書き換えるだけ" },
      { ic: ic.magic, num: "2", label: "業界キーワードは残す", desc: "雰囲気・音声の指示はテンプレートのまま" },
      { ic: ic.play,  num: "3", label: "4秒テスト → 8秒本番", desc: "短い動画で方向性を確認してから本番生成" },
    ];

    steps.forEach((st, i) => {
      const y = 1.05 + i * 0.85;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.72,
        fill: { color: i % 2 === 0 ? C.accentLight : C.offWhite },
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
        x: L.mx + 1.2, y: y + 0.05, w: 3.0, h: 0.35,
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

    // Examples
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.7, w: L.W - L.mx * 2, h: 1.2,
      fill: { color: C.greenBg }, rectRadius: 0.05
    });
    s.addImage({ data: ic.checkGreen, x: L.mx + 0.15, y: 3.78, w: 0.25, h: 0.25 });
    s.addText("差し替え例", {
      x: L.mx + 0.5, y: 3.72, w: 2, h: 0.35,
      fontSize: F.size.body, fontFace: F.sans, bold: true, color: C.green, shrinkText: true
    });
    const examples = [
      "[料理名] → \"thick-cut salmon sashimi\"",
      "[物件タイプ] → \"modern 2LDK apartment in Shibuya\"",
      "[商品名] → \"wireless noise-canceling earbuds\"",
    ];
    examples.forEach((ex, i) => {
      s.addText(ex, {
        x: L.mx + 0.5, y: 4.08 + i * 0.25, w: L.W - L.mx * 2 - 0.7, h: 0.25,
        fontSize: F.size.label, fontFace: F.sans, color: C.green, shrinkText: true
      });
    });
  }

  // ============================================================
  // SLIDE 7: DEMO (Navy background)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };
    s.addText("\uD83C\uDFAC", {
      x: (L.W - 1) / 2, y: 1.2, w: 1, h: 1,
      fontSize: 60, align: "center", valign: "middle"
    });
    s.addText("実演: テンプレート実践", {
      x: 0.5, y: 2.3, w: 9, h: 0.85,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center", shrinkText: true
    });
    s.addShape(pres.shapes.LINE, {
      x: 3.2, y: 3.3, w: 3.6, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });
    s.addText("業界テンプレートで動画を生成", {
      x: 0.5, y: 3.5, w: 9, h: 0.45,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 8: COPYRIGHT & ETHICS
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "著作権・倫理のルール", "COPYRIGHT");
    addFooter(s, 8, T);

    const ngItems = [
      { ic: ic.ban, label: "実在人物の模倣", desc: "有名人の顔・声を再現 → 肖像権侵害" },
      { ic: ic.mic, label: "声の無断クローン", desc: "本人の許可なく声を複製 → 権利侵害" },
      { ic: ic.eye, label: "AI生成の偽装", desc: "実写と偽る → 信用失墜" },
      { ic: ic.timesCircle, label: "暴力・差別コンテンツ", desc: "利用規約違反 → アカウント停止" },
    ];

    ngItems.forEach((ng, i) => {
      const y = 1.05 + i * 0.7;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.58,
        fill: { color: C.redBg }, line: { color: C.border, width: 0.5 }, rectRadius: 0.04
      });
      s.addText("NG", {
        x: L.mx + 0.1, y: y + 0.08, w: 0.4, h: 0.4,
        fontSize: F.size.caption, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: C.red }, shape: pres.shapes.OVAL, shrinkText: true
      });
      s.addImage({ data: ng.ic, x: L.mx + 0.6, y: y + 0.14, w: 0.28, h: 0.28 });
      s.addText(ng.label, {
        x: L.mx + 1.0, y: y + 0.02, w: 2.5, h: 0.3,
        fontSize: F.size.body, fontFace: F.sans, bold: true, color: C.red, shrinkText: true
      });
      s.addText(ng.desc, {
        x: L.mx + 1.0, y: y + 0.3, w: 6, h: 0.25,
        fontSize: F.size.label, fontFace: F.sans, color: C.textLight, shrinkText: true
      });
    });

    // Rules
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.95, w: L.W - L.mx * 2, h: 1.0,
      fill: { color: C.greenBg }, rectRadius: 0.05
    });
    s.addImage({ data: ic.shield, x: L.mx + 0.15, y: 4.05, w: 0.28, h: 0.28 });
    s.addText("守るべきルール", {
      x: L.mx + 0.55, y: 3.98, w: 3, h: 0.35,
      fontSize: F.size.body, fontFace: F.sans, bold: true, color: C.green, shrinkText: true
    });
    const rules = [
      "AI生成であることを明記する",
      "商用利用はツールの利用規約を確認",
      "人物が映る場合は架空の人物のみ使用"
    ];
    rules.forEach((r, i) => {
      s.addImage({ data: ic.checkGreen, x: L.mx + 0.55, y: 4.37 + i * 0.2, w: 0.15, h: 0.15 });
      s.addText(r, {
        x: L.mx + 0.8, y: 4.32 + i * 0.2, w: 6, h: 0.25,
        fontSize: F.size.label, fontFace: F.sans, color: C.green, shrinkText: true
      });
    });
  }

  // ============================================================
  // SLIDE 9: QUALITY TIPS
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "生成動画のクオリティ注意点", "QUALITY");
    addFooter(s, 9, T);

    const issues = [
      {
        ic: ic.clock, label: "最大8秒", desc: "長尺は分割して編集で繋ぐ",
        fix: "対処: 複数の短い動画を編集ソフトで結合", color: C.amber, bg: C.amberBg
      },
      {
        ic: ic.users, label: "複数人の顔崩れ", desc: "3人以上で不自然になりやすい",
        fix: "対処: 被写体1人に限定 or 遠景で撮る", color: C.red, bg: C.redBg
      },
      {
        ic: ic.comment, label: "日本語セリフ不自然", desc: "発音やイントネーションが不安定",
        fix: "対処: 英語セリフ＋字幕 or 別途ナレーション", color: C.purple, bg: C.purpleBg
      },
    ];

    issues.forEach((iss, i) => {
      const y = 1.05 + i * 1.25;
      // Issue box
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: (L.W - L.mx * 2) * 0.48, h: 1.1,
        fill: { color: iss.bg }, line: { color: C.border, width: 0.5 }, rectRadius: 0.05
      });
      s.addImage({ data: iss.ic, x: L.mx + 0.15, y: y + 0.15, w: 0.28, h: 0.28 });
      s.addText(iss.label, {
        x: L.mx + 0.5, y: y + 0.1, w: 3, h: 0.3,
        fontSize: F.size.body, fontFace: F.sans, bold: true, color: iss.color, shrinkText: true
      });
      s.addText(iss.desc, {
        x: L.mx + 0.5, y: y + 0.4, w: 3.3, h: 0.25,
        fontSize: F.size.label, fontFace: F.sans, color: C.textLight, shrinkText: true
      });

      // Fix box
      const fixX = L.mx + (L.W - L.mx * 2) * 0.52;
      s.addShape(pres.shapes.RECTANGLE, {
        x: fixX, y, w: (L.W - L.mx * 2) * 0.48, h: 1.1,
        fill: { color: C.greenBg }, line: { color: C.border, width: 0.5 }, rectRadius: 0.05
      });
      s.addImage({ data: ic.wrench, x: fixX + 0.15, y: y + 0.15, w: 0.28, h: 0.28 });
      s.addText(iss.fix, {
        x: fixX + 0.5, y: y + 0.1, w: 3.3, h: 0.9,
        fontSize: F.size.label, fontFace: F.sans, color: C.green, valign: "middle", shrinkText: true
      });
    });
  }

  // ============================================================
  // SLIDE 10: HOMEWORK
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "宿題: 今週やる3つのこと", "HOMEWORK");
    addFooter(s, 10, T);

    const hw = [
      { ic: ic.rocket, num: "1", label: "Proプラン登録 + 3本作る", desc: "テンプレートを使って3本の動画を生成", color: C.accent, bg: C.accentLight },
      { ic: ic.globe,  num: "2", label: "SNSに投稿する",           desc: "Instagram Reels / TikTok / YouTube Shortsに投稿", color: C.green, bg: C.greenBg },
      { ic: ic.chart,  num: "3", label: "3日後に数字を確認",       desc: "再生数・いいね・保存数を記録してPDCA開始", color: C.amber, bg: C.amberBg },
    ];

    hw.forEach((h, i) => {
      const y = 1.05 + i * 1.2;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 1.0,
        fill: { color: h.bg }, line: { color: C.border, width: 0.5 }, rectRadius: 0.06
      });
      s.addText(h.num, {
        x: L.mx + 0.15, y: y + 0.2, w: 0.55, h: 0.55,
        fontSize: F.size.h2, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: h.color }, shape: pres.shapes.OVAL, shrinkText: true
      });
      s.addImage({ data: h.ic, x: L.mx + 0.85, y: y + 0.25, w: 0.4, h: 0.4 });
      s.addText(h.label, {
        x: L.mx + 1.4, y: y + 0.1, w: 6, h: 0.4,
        fontSize: F.size.h3, fontFace: F.sans, bold: true, color: h.color, valign: "middle", shrinkText: true
      });
      s.addText(h.desc, {
        x: L.mx + 1.4, y: y + 0.5, w: 6, h: 0.35,
        fontSize: F.size.body, fontFace: F.sans, color: C.textLight, valign: "middle", shrinkText: true
      });
    });
  }

  // ============================================================
  // SLIDE 11: FULL SUMMARY
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "全5パートの総まとめ", "SUMMARY");
    addFooter(s, 11, T);

    const parts = [
      { num: "P-01", label: "なぜVeo3一本でいいのか", desc: "AI動画の全体像と最適ツール", color: C.accent, bg: C.accentLight },
      { num: "P-02", label: "Veo3基本操作",           desc: "アクセスからプロンプト設計", color: C.green, bg: C.greenBg },
      { num: "P-03", label: "プロンプト設計マスター",   desc: "業務用プロンプト7パターン", color: C.purple, bg: C.purpleBg },
      { num: "P-04", label: "SNS×PDCA戦略",           desc: "投稿・分析・改善サイクル", color: C.amber, bg: C.amberBg },
      { num: "P-05", label: "業界別テンプレートと実践", desc: "テンプレート＋著作権＋宿題", color: C.red, bg: C.redBg },
    ];

    parts.forEach((p, i) => {
      const y = 1.05 + i * 0.72;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.6,
        fill: { color: p.bg }, line: { color: C.border, width: 0.5 }, rectRadius: 0.04
      });
      s.addText(p.num, {
        x: L.mx + 0.1, y: y + 0.1, w: 0.65, h: 0.4,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: p.color }, rectRadius: 0.03, shrinkText: true
      });
      s.addText(p.label, {
        x: L.mx + 0.9, y: y + 0.02, w: 3.5, h: 0.3,
        fontSize: F.size.body, fontFace: F.sans, bold: true, color: p.color, shrinkText: true
      });
      s.addText(p.desc, {
        x: L.mx + 0.9, y: y + 0.3, w: 6, h: 0.25,
        fontSize: F.size.label, fontFace: F.sans, color: C.textLight, shrinkText: true
      });
    });

    // Bottom message
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.7, w: L.W - L.mx * 2, h: 0.45,
      fill: { color: C.accentLight }, rectRadius: 0.04
    });
    s.addText("「AI動画を作れる → 活用できる → 成果を出せる」人材へ", {
      x: L.mx + 0.2, y: 4.7, w: L.W - L.mx * 2 - 0.4, h: 0.45,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.accent, align: "center", valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 12: ENDING (Navy background)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };
    s.addImage({ data: ic.grad, x: (L.W - 0.65) / 2, y: 0.85, w: 0.65, h: 0.65 });
    s.addText("確認テストへ進む", {
      x: 0.5, y: 1.7, w: 9, h: 0.65,
      fontSize: F.size.hero - 4, fontFace: F.sans, bold: true,
      color: C.white, align: "center", shrinkText: true
    });
    s.addShape(pres.shapes.LINE, {
      x: 3.2, y: 2.5, w: 3.6, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });
    s.addText("P-05 修了 | AI動画生成コース 全5パート完了", {
      x: 0.5, y: 2.65, w: 9, h: 0.4,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", shrinkText: true
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 2.0, y: 3.5, w: 6.0, h: 0.65,
      fill: { color: C.navyLight }, rectRadius: 0.06
    });
    s.addText("次回予告: Lecture 9「AIプレゼン＆資料作成」", {
      x: 2.0, y: 3.5, w: 6.0, h: 0.65,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.accentMid, align: "center", valign: "middle", shrinkText: true
    });
  }

  // Save
  await pres.writeFile({ fileName: "スライド.pptx" });
  console.log("Generated: スライド.pptx (12 slides)");
}

main().catch(err => { console.error(err); process.exit(1); });
