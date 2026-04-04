const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const {
  FaRocket, FaBullseye, FaProjectDiagram, FaImage, FaGlobe,
  FaMobileAlt, FaCopy, FaBriefcase, FaMoneyBillWave,
  FaExclamationTriangle, FaCheckCircle, FaArrowRight,
  FaPlay, FaVideo, FaMicrophone, FaRobot, FaUsers,
  FaChartLine, FaGraduationCap, FaHeadset, FaClock,
  FaStar, FaLightbulb, FaTrophy, FaLayerGroup
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
  pres.title = "P-05: ツール連携ワークフロー＋業務で使い倒す";

  // Pre-render icons
  const ic = {
    rocket: await icon(FaRocket, C.accent),
    target: await icon(FaBullseye, C.accent),
    flow: await icon(FaProjectDiagram, C.accent),
    image: await icon(FaImage, C.purple),
    globe: await icon(FaGlobe, C.green),
    mobile: await icon(FaMobileAlt, C.accent),
    copy: await icon(FaCopy, C.accent),
    briefcase: await icon(FaBriefcase, C.accent),
    money: await icon(FaMoneyBillWave, C.amber),
    warn: await icon(FaExclamationTriangle, C.amber),
    check: await icon(FaCheckCircle, C.green),
    arrow: await icon(FaArrowRight, C.accent),
    arrowWhite: await icon(FaArrowRight, C.white),
    play: await icon(FaPlay, C.white),
    video: await icon(FaVideo, C.accent),
    mic: await icon(FaMicrophone, C.purple),
    robot: await icon(FaRobot, C.accent),
    users: await icon(FaUsers, C.green),
    chart: await icon(FaChartLine, C.amber),
    grad: await icon(FaGraduationCap, C.accent),
    headset: await icon(FaHeadset, C.red),
    clock: await icon(FaClock, C.amber),
    star: await icon(FaStar, C.amber),
    bulb: await icon(FaLightbulb, C.amber),
    trophy: await icon(FaTrophy, C.accent),
    layer: await icon(FaLayerGroup, C.accent),
  };

  // ============================================================
  // SLIDE 1: TITLE (Navy background)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };
    s.addImage({ data: ic.layer, x: (L.W - 0.6) / 2, y: 1.0, w: 0.6, h: 0.6 });
    s.addText("ツール連携で動画を量産する", {
      x: 0.5, y: 1.8, w: 9, h: 0.8,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center", shrinkText: true
    });
    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 2.75, w: 3, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });
    s.addText("AI動画生成 最終回 — ワークフロー＋業務活用", {
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
      "複数のAIツールを連携させた動画制作ワークフローを3つ以上設計できる",
      "SNSプラットフォーム別の動画スペックを理解し、最適な形式で出力できる",
      "業務別の活用パターンを把握し、明日から実践できる",
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
  // SLIDE 3: WORKFLOW 1 — ChatGPT → ElevenLabs → Veo3
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "最強ワークフロー① 台本→音声→動画", "WORKFLOW 1");
    addFooter(s, 3, T);

    const steps = [
      { ic: ic.robot,  label: "ChatGPT",     desc: "台本を自動生成\n「30秒の商品紹介\n動画の台本を書いて」", color: C.accent, bg: C.accentLight },
      { ic: ic.mic,    label: "ElevenLabs",   desc: "プロ品質の\nナレーション音声を\n生成", color: C.purple, bg: C.purpleBg },
      { ic: ic.video,  label: "Veo3",         desc: "映像プロンプトで\n動画を生成\n（無料枠あり）", color: C.green, bg: C.greenBg },
      { ic: ic.check,  label: "完成！",       desc: "CapCut等で\n音声+映像を合成\n→ 15分で完了", color: C.amber, bg: C.amberBg },
    ];

    const cardW = 1.85;
    const cardGap = 0.2;
    const arrowW = 0.3;
    const totalW = cardW * 4 + cardGap * 3;
    const startX = (L.W - totalW) / 2;

    steps.forEach((st, i) => {
      const x = startX + i * (cardW + cardGap);
      const y = 1.1;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 3.0,
        fill: { color: st.bg }, line: { color: st.color, width: 1 }, rectRadius: 0.05
      });
      s.addImage({ data: st.ic, x: x + (cardW - 0.3) / 2, y: y + 0.2, w: 0.3, h: 0.3 });
      s.addText(st.label, {
        x, y: y + 0.6, w: cardW, h: 0.35,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: st.color, align: "center", shrinkText: true
      });
      s.addText(st.desc, {
        x: x + 0.1, y: y + 1.05, w: cardW - 0.2, h: 1.5,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, align: "center", lineSpacingMultiple: 1.3, shrinkText: true
      });
      // Arrow between cards
      if (i < 3) {
        s.addImage({ data: ic.arrow, x: x + cardW + (cardGap - arrowW) / 2, y: y + 1.2, w: arrowW, h: arrowW });
      }
    });
  }

  // ============================================================
  // SLIDE 4: WORKFLOW 2 — Midjourney → Veo3 → SNS
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "最強ワークフロー② 画像→動画→SNS投稿", "WORKFLOW 2");
    addFooter(s, 4, T);

    const steps = [
      { ic: ic.image,  label: "Midjourney\n/ DALL-E", desc: "ハイクオリティ画像\nを生成", color: C.purple, bg: C.purpleBg },
      { ic: ic.video,  label: "Veo3",                 desc: "「画像から動画」で\n静止画を動画化", color: C.accent, bg: C.accentLight },
      { ic: ic.mic,    label: "ElevenLabs",            desc: "ナレーションを\n重ねる", color: C.green, bg: C.greenBg },
      { ic: ic.mobile, label: "SNS投稿",              desc: "Reels / TikTok\nに投稿", color: C.amber, bg: C.amberBg },
    ];

    const cardW = 1.85;
    const cardGap = 0.2;
    const arrowW = 0.3;
    const totalW = cardW * 4 + cardGap * 3;
    const startX = (L.W - totalW) / 2;

    steps.forEach((st, i) => {
      const x = startX + i * (cardW + cardGap);
      const y = 1.1;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 2.8,
        fill: { color: st.bg }, line: { color: st.color, width: 1 }, rectRadius: 0.05
      });
      s.addImage({ data: st.ic, x: x + (cardW - 0.3) / 2, y: y + 0.2, w: 0.3, h: 0.3 });
      s.addText(st.label, {
        x, y: y + 0.6, w: cardW, h: 0.45,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: st.color, align: "center", shrinkText: true
      });
      s.addText(st.desc, {
        x: x + 0.1, y: y + 1.15, w: cardW - 0.2, h: 1.2,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, align: "center", lineSpacingMultiple: 1.3, shrinkText: true
      });
      if (i < 3) {
        s.addImage({ data: ic.arrow, x: x + cardW + (cardGap - arrowW) / 2, y: y + 1.1, w: arrowW, h: arrowW });
      }
    });

    s.addImage({ data: ic.bulb, x: L.mx, y: 4.2, w: 0.22, h: 0.22 });
    s.addText("ポイント：画像生成AIの高品質さ × Veo3の動画化能力 = 最強の組み合わせ", {
      x: L.mx + 0.3, y: 4.15, w: L.W - L.mx * 2 - 0.35, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans, italic: true,
      color: C.textLight, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 5: WORKFLOW 3 — HeyGen multilingual
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "最強ワークフロー③ 多言語展開", "WORKFLOW 3");
    addFooter(s, 5, T);

    const steps = [
      { ic: ic.robot,  label: "ChatGPT",   desc: "日本語の台本\nを作成", color: C.accent, bg: C.accentLight },
      { ic: ic.users,  label: "HeyGen",    desc: "アバター動画\n撮影なしで作成", color: C.purple, bg: C.purpleBg },
      { ic: ic.globe,  label: "翻訳・展開", desc: "英/中/西など\n多言語に自動変換\nリップシンク対応", color: C.green, bg: C.greenBg },
      { ic: ic.rocket, label: "配信",      desc: "グローバル\n社内研修・海外\nプロモーション", color: C.amber, bg: C.amberBg },
    ];

    const cardW = 1.85;
    const cardGap = 0.2;
    const arrowW = 0.3;
    const totalW = cardW * 4 + cardGap * 3;
    const startX = (L.W - totalW) / 2;

    steps.forEach((st, i) => {
      const x = startX + i * (cardW + cardGap);
      const y = 1.1;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 2.8,
        fill: { color: st.bg }, line: { color: st.color, width: 1 }, rectRadius: 0.05
      });
      s.addImage({ data: st.ic, x: x + (cardW - 0.3) / 2, y: y + 0.2, w: 0.3, h: 0.3 });
      s.addText(st.label, {
        x, y: y + 0.6, w: cardW, h: 0.35,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: st.color, align: "center", shrinkText: true
      });
      s.addText(st.desc, {
        x: x + 0.1, y: y + 1.05, w: cardW - 0.2, h: 1.3,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, align: "center", lineSpacingMultiple: 1.3, shrinkText: true
      });
      if (i < 3) {
        s.addImage({ data: ic.arrow, x: x + cardW + (cardGap - arrowW) / 2, y: y + 1.1, w: arrowW, h: arrowW });
      }
    });

    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.15, w: 4.5, h: 0.35,
      fill: { color: C.greenBg }, rectRadius: 0.05
    });
    s.addText("1本の動画 → 5か国語・10か国語に展開可能", {
      x: L.mx, y: 4.15, w: 4.5, h: 0.35,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.green, align: "center", valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 6: SNS PLATFORM SPECS
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "SNSプラットフォーム別 動画スペック", "SPECS");
    addFooter(s, 6, T);

    const platforms = [
      { label: "Instagram\nReels",   ratio: "9:16", dur: "15〜90秒",  tip: "冒頭3秒で\nインパクト", color: C.purple, bg: C.purpleBg },
      { label: "TikTok",             ratio: "9:16", dur: "15秒〜3分", tip: "テンポ重視\nトレンド音楽", color: C.accent, bg: C.accentLight },
      { label: "YouTube\nShorts",    ratio: "9:16", dur: "最大60秒",  tip: "タイトルに\nキーワード", color: C.red, bg: C.redBg },
      { label: "YouTube\n（横型）",  ratio: "16:9", dur: "8〜15分",   tip: "広告収益に\n有利な尺", color: C.amber, bg: C.amberBg },
    ];

    const cardW = 1.95;
    const cardGap = 0.15;
    const totalW = cardW * 4 + cardGap * 3;
    const startX = (L.W - totalW) / 2;

    platforms.forEach((p, i) => {
      const x = startX + i * (cardW + cardGap);
      const y = 1.0;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 3.4,
        fill: { color: p.bg }, line: { color: p.color, width: 1 }, rectRadius: 0.05
      });
      s.addText(p.label, {
        x, y: y + 0.15, w: cardW, h: 0.5,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: p.color, align: "center", valign: "middle", shrinkText: true
      });
      // Ratio badge
      s.addShape(pres.shapes.RECTANGLE, {
        x: x + (cardW - 1.2) / 2, y: y + 0.75, w: 1.2, h: 0.35,
        fill: { color: p.color }, rectRadius: 0.04
      });
      s.addText(p.ratio, {
        x: x + (cardW - 1.2) / 2, y: y + 0.75, w: 1.2, h: 0.35,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle", shrinkText: true
      });
      s.addText(p.dur, {
        x, y: y + 1.25, w: cardW, h: 0.35,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.textDark, align: "center", shrinkText: true
      });
      s.addShape(pres.shapes.LINE, {
        x: x + 0.3, y: y + 1.7, w: cardW - 0.6, h: 0,
        line: { color: p.color, width: 0.5 }
      });
      s.addText(p.tip, {
        x: x + 0.1, y: y + 1.85, w: cardW - 0.2, h: 1.0,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, align: "center", lineSpacingMultiple: 1.3, shrinkText: true
      });
    });

    s.addImage({ data: ic.bulb, x: L.mx, y: 4.55, w: 0.2, h: 0.2 });
    s.addText("Veo3で生成時にアスペクト比を指定しておくと後の編集が楽", {
      x: L.mx + 0.28, y: 4.5, w: L.W - L.mx * 2 - 0.3, h: 0.3,
      fontSize: F.size.label, fontFace: F.sans, italic: true,
      color: C.textLight, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 7: MASS PRODUCTION TEMPLATE
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "週5本のSNS動画を30分で作る", "TEMPLATE");
    addFooter(s, 7, T);

    const days = [
      { day: "月", task: "ChatGPTで\n台本5本生成", time: "10分", color: C.accent, bg: C.accentLight },
      { day: "火", task: "ElevenLabsで\nナレーション5本", time: "5分", color: C.purple, bg: C.purpleBg },
      { day: "水", task: "Veo3で\n動画5本生成", time: "10分", color: C.green, bg: C.greenBg },
      { day: "木", task: "最終チェック\n微調整", time: "5分", color: C.amber, bg: C.amberBg },
      { day: "金", task: "順次\n投稿開始", time: "—", color: C.red, bg: C.redBg },
    ];

    const cardW = 1.5;
    const cardGap = 0.15;
    const arrowW = 0.25;
    const totalW = cardW * 5 + cardGap * 4;
    const startX = (L.W - totalW) / 2;

    days.forEach((d, i) => {
      const x = startX + i * (cardW + cardGap);
      const y = 1.0;

      // Day circle
      s.addText(d.day, {
        x: x + (cardW - 0.45) / 2, y, w: 0.45, h: 0.45,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: d.color }, shape: pres.shapes.OVAL, shrinkText: true
      });

      s.addShape(pres.shapes.RECTANGLE, {
        x, y: y + 0.6, w: cardW, h: 2.0,
        fill: { color: d.bg }, line: { color: d.color, width: 0.5 }, rectRadius: 0.05
      });
      s.addText(d.task, {
        x: x + 0.05, y: y + 0.7, w: cardW - 0.1, h: 1.0,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, align: "center", lineSpacingMultiple: 1.3, shrinkText: true
      });
      if (d.time !== "—") {
        s.addShape(pres.shapes.RECTANGLE, {
          x: x + (cardW - 0.9) / 2, y: y + 1.85, w: 0.9, h: 0.3,
          fill: { color: d.color }, rectRadius: 0.04
        });
        s.addText(d.time, {
          x: x + (cardW - 0.9) / 2, y: y + 1.85, w: 0.9, h: 0.3,
          fontSize: F.size.label, fontFace: F.sans, bold: true,
          color: C.white, align: "center", valign: "middle", shrinkText: true
        });
      }

      if (i < 4) {
        s.addImage({ data: ic.arrow, x: x + cardW + (cardGap - arrowW) / 2, y: y + 1.2, w: arrowW, h: arrowW });
      }
    });

    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.9, w: L.W - L.mx * 2, h: 0.55,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    s.addImage({ data: ic.bulb, x: L.mx + 0.15, y: 3.97, w: 0.22, h: 0.22 });
    s.addText("ポイント：「バッチ処理」— 1本ずつではなく、工程ごとにまとめて処理する", {
      x: L.mx + 0.5, y: 3.9, w: L.W - L.mx * 2 - 0.7, h: 0.55,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 8: BUSINESS USE CASES
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "業務別 活用パターン", "USE CASES");
    addFooter(s, 8, T);

    const depts = [
      { ic: ic.chart,   label: "マーケティング", items: "商品紹介動画\nSNS広告\nキャンペーン動画", color: C.accent, bg: C.accentLight },
      { ic: ic.briefcase, label: "営業",         items: "提案資料の動画化\n商品デモ動画\nパーソナライズドメッセージ", color: C.purple, bg: C.purpleBg },
      { ic: ic.grad,    label: "人事・研修",     items: "オンボーディング\nコンプライアンス研修\n業務マニュアル動画", color: C.green, bg: C.greenBg },
      { ic: ic.headset, label: "カスタマー\nサポート", items: "FAQ動画\nトラブルシューティング\n使い方チュートリアル", color: C.amber, bg: C.amberBg },
    ];

    const cardW = 1.95;
    const cardGap = 0.15;
    const totalW = cardW * 4 + cardGap * 3;
    const startX = (L.W - totalW) / 2;

    depts.forEach((d, i) => {
      const x = startX + i * (cardW + cardGap);
      const y = 1.0;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 3.2,
        fill: { color: d.bg }, line: { color: d.color, width: 1 }, rectRadius: 0.05
      });
      s.addImage({ data: d.ic, x: x + (cardW - 0.3) / 2, y: y + 0.2, w: 0.3, h: 0.3 });
      s.addText(d.label, {
        x, y: y + 0.6, w: cardW, h: 0.45,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: d.color, align: "center", valign: "middle", shrinkText: true
      });
      s.addShape(pres.shapes.LINE, {
        x: x + 0.2, y: y + 1.1, w: cardW - 0.4, h: 0,
        line: { color: d.color, width: 0.5 }
      });
      s.addText(d.items, {
        x: x + 0.1, y: y + 1.2, w: cardW - 0.2, h: 1.6,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, align: "center", lineSpacingMultiple: 1.4, shrinkText: true
      });
    });

    s.addText("共通：これまで外注していた動画を社内で素早く作れるようになる", {
      x: L.mx, y: 4.4, w: L.W - L.mx * 2, h: 0.3,
      fontSize: F.size.label, fontFace: F.sans, italic: true,
      color: C.textLight, align: "center", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 9: COST COMPARISON
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "コスト比較 — 従来 vs AI動画制作", "COST");
    addFooter(s, 9, T);

    // Traditional column
    const colW = 3.8;
    const gap = 0.5;
    const leftX = (L.W - colW * 2 - gap) / 2;
    const rightX = leftX + colW + gap;

    // Left: Traditional
    s.addShape(pres.shapes.RECTANGLE, {
      x: leftX, y: 1.0, w: colW, h: 0.45,
      fill: { color: C.redBg }, rectRadius: 0.05
    });
    s.addText("従来の動画制作", {
      x: leftX, y: 1.0, w: colW, h: 0.45,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.red, align: "center", valign: "middle", shrinkText: true
    });

    const tradItems = [
      "外注費：10〜50万円 / 本",
      "納期：2週間〜1か月",
      "月4本 → 年間 480〜2,400万円",
    ];
    tradItems.forEach((t, i) => {
      s.addText("  " + t, {
        x: leftX + 0.1, y: 1.6 + i * 0.45, w: colW - 0.2, h: 0.4,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, valign: "middle", shrinkText: true
      });
    });

    // Right: AI
    s.addShape(pres.shapes.RECTANGLE, {
      x: rightX, y: 1.0, w: colW, h: 0.45,
      fill: { color: C.greenBg }, rectRadius: 0.05
    });
    s.addText("AI動画制作", {
      x: rightX, y: 1.0, w: colW, h: 0.45,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.green, align: "center", valign: "middle", shrinkText: true
    });

    const aiItems = [
      "ツール月額：約1万円",
      "制作時間：15〜30分 / 本",
      "月20本以上 → 年間 約12万円",
    ];
    aiItems.forEach((t, i) => {
      s.addText("  " + t, {
        x: rightX + 0.1, y: 1.6 + i * 0.45, w: colW - 0.2, h: 0.4,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, valign: "middle", shrinkText: true
      });
    });

    // Big comparison badge
    s.addShape(pres.shapes.RECTANGLE, {
      x: (L.W - 5) / 2, y: 3.3, w: 5, h: 0.65,
      fill: { color: C.accent }, rectRadius: 0.08
    });
    s.addText("最大 99% コスト削減", {
      x: (L.W - 5) / 2, y: 3.3, w: 5, h: 0.65,
      fontSize: F.size.h1, fontFace: F.sans, bold: true,
      color: C.white, align: "center", valign: "middle", shrinkText: true
    });

    s.addText("※ SNS動画や社内用途なら十分な品質。プロ向け映像は外注併用を推奨", {
      x: L.mx, y: 4.15, w: L.W - L.mx * 2, h: 0.3,
      fontSize: F.size.label, fontFace: F.sans, italic: true,
      color: C.textLight, align: "center", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 10: COMMON FAILURES & SOLUTIONS
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "よくある失敗と対策", "TIPS");
    addFooter(s, 10, T);

    const issues = [
      {
        problem: "品質が低い",
        solution: "プロンプトを具体的に\n「シネマティック、スローモーション、4K」",
        color: C.red, bg: C.redBg
      },
      {
        problem: "著作権問題",
        solution: "各ツールの利用規約を確認\n商用利用時は特に注意",
        color: C.amber, bg: C.amberBg
      },
      {
        problem: "ブランド一貫性",
        solution: "テンプレート+スタイルガイドを\nチームで共有",
        color: C.purple, bg: C.purpleBg
      },
    ];

    issues.forEach((iss, i) => {
      const y = 1.0 + i * 1.25;
      const cardW = L.W - L.mx * 2;

      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: cardW, h: 1.05,
        fill: { color: iss.bg }, rectRadius: 0.05
      });

      // Problem label
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx + 0.15, y: y + 0.15, w: 2.2, h: 0.35,
        fill: { color: iss.color }, rectRadius: 0.04
      });
      s.addText(iss.problem, {
        x: L.mx + 0.15, y: y + 0.15, w: 2.2, h: 0.35,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle", shrinkText: true
      });

      // Arrow
      s.addImage({ data: ic.arrow, x: L.mx + 2.6, y: y + 0.25, w: 0.25, h: 0.25 });

      // Solution
      s.addText(iss.solution, {
        x: L.mx + 3.1, y: y + 0.05, w: cardW - 3.4, h: 0.95,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, valign: "middle", lineSpacingMultiple: 1.3, shrinkText: true
      });
    });
  }

  // ============================================================
  // SLIDE 11: SUMMARY + 3 STEPS
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "まとめ — 今日から始める3ステップ", "SUMMARY");
    addFooter(s, 11, T);

    // Course recap (compact)
    const recaps = [
      { id: "P-01", text: "AI動画の可能性" },
      { id: "P-02", text: "Veo3 実践" },
      { id: "P-03", text: "Runway & HeyGen" },
      { id: "P-04", text: "ElevenLabs" },
      { id: "P-05", text: "ワークフロー＋業務活用" },
    ];

    const recapW = 1.55;
    const recapGap = 0.1;
    const recapTotalW = recapW * 5 + recapGap * 4;
    const recapStartX = (L.W - recapTotalW) / 2;

    recaps.forEach((r, i) => {
      const x = recapStartX + i * (recapW + recapGap);
      const isLast = i === 4;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: 0.95, w: recapW, h: 0.7,
        fill: { color: isLast ? C.accent : C.lightGray }, rectRadius: 0.04
      });
      s.addText(r.id, {
        x, y: 0.95, w: recapW, h: 0.3,
        fontSize: F.size.caption, fontFace: F.sans, bold: true,
        color: isLast ? C.white : C.accent, align: "center", shrinkText: true
      });
      s.addText(r.text, {
        x, y: 1.22, w: recapW, h: 0.35,
        fontSize: F.size.caption, fontFace: F.sans,
        color: isLast ? C.white : C.textBody, align: "center", shrinkText: true
      });
    });

    // 3 Steps
    const steps = [
      "ChatGPT + Veo3 で1本動画を作ってみる",
      "テンプレートを作って週3本の量産体制を整える",
      "チームに共有して組織全体のAI動画活用を推進する",
    ];

    steps.forEach((st, i) => {
      const y = 2.0 + i * 0.9;
      s.addText(String(i + 1), {
        x: L.mx + 0.3, y: y + 0.05, w: 0.5, h: 0.5,
        fontSize: F.size.h2, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: C.accent }, shape: pres.shapes.OVAL, shrinkText: true
      });
      s.addText(st, {
        x: L.mx + 1.0, y, w: 7.0, h: 0.6,
        fontSize: F.size.h3, fontFace: F.sans,
        color: C.textDark, valign: "middle", shrinkText: true
      });
      if (i < 2) {
        s.addShape(pres.shapes.LINE, {
          x: L.mx + 0.3, y: y + 0.7, w: L.W - L.mx * 2 - 0.6, h: 0,
          line: { color: C.border, width: 0.5 }
        });
      }
    });

    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.55, w: 3.5, h: 0.35,
      fill: { color: C.greenBg }, rectRadius: 0.05
    });
    s.addText("まずは1本、今日中に作ってみよう！", {
      x: L.mx, y: 4.55, w: 3.5, h: 0.35,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.green, align: "center", valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 12: END (Navy background)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };
    s.addImage({ data: ic.trophy, x: (L.W - 0.6) / 2, y: 1.0, w: 0.6, h: 0.6 });
    s.addText("確認テストへ進む", {
      x: 0.5, y: 1.8, w: 9, h: 0.8,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center", shrinkText: true
    });
    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 2.75, w: 3, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });
    s.addText("AI動画生成講座 全5回 修了", {
      x: 0.5, y: 2.95, w: 9, h: 0.45,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", shrinkText: true
    });
    s.addText("P-05  |  ツール連携ワークフロー  |  12分", {
      x: 0.5, y: 4.0, w: 9, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textMuted, align: "center", shrinkText: true
    });
  }

  // ============================================================
  // SAVE
  // ============================================================
  await pres.writeFile({ fileName: "スライド.pptx" });
  console.log("スライド.pptx を生成しました（全12枚）");
}

main().catch(err => { console.error(err); process.exit(1); });
