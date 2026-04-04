const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const {
  FaVideo, FaBullseye, FaChevronRight, FaRocket,
  FaCogs, FaImage, FaPencilAlt, FaExchangeAlt,
  FaUserTie, FaGlobe, FaLanguage, FaPlay,
  FaCheckCircle, FaBriefcase, FaUsers, FaBullhorn,
  FaArrowRight, FaCamera, FaWind, FaSun,
  FaMagic, FaMicrophone, FaFilm, FaChartBar
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
  red: "DC2626", redBg: "FEE2E2", border: "E5E7EB",
  purple: "7C3AED", purpleBg: "EDE9FE",
};

const F = { sans: "Calibri", size: { hero: 40, h1: 28, h2: 20, h3: 16, body: 14, label: 12, caption: 10 } };
const L = { W: 10, H: 5.625, mx: 0.75, my: 0.5, gap: 0.3 };

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
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: L.W, h: 0.035, fill: { color: C.accent } });
}

function addFooter(slide, pres, num, total) {
  slide.addShape(pres.shapes.LINE, {
    x: L.mx, y: L.H - 0.4, w: L.W - L.mx * 2, h: 0,
    line: { color: C.border, width: 0.5 }
  });
  slide.addText(`${num} / ${total}`, {
    x: L.W - 1.5, y: L.H - 0.38, w: 1.2, h: 0.3,
    fontSize: F.size.caption, fontFace: F.sans, color: C.textMuted, align: "right", shrinkText: true
  });
  slide.addText("P-03", {
    x: L.mx, y: L.H - 0.38, w: 2, h: 0.3,
    fontSize: F.size.caption, fontFace: F.sans, color: C.textMuted, align: "left", shrinkText: true
  });
}

function addSectionTitle(slide, pres, title, tag) {
  if (tag) {
    slide.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.15, w: tag.length * 0.1 + 0.4, h: 0.28,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    slide.addText(tag, {
      x: L.mx, y: 0.15, w: tag.length * 0.1 + 0.4, h: 0.28,
      fontSize: F.size.caption, fontFace: F.sans, bold: true,
      color: C.accent, align: "center", valign: "middle", shrinkText: true
    });
  }
  slide.addText(title, {
    x: L.mx, y: tag ? 0.5 : 0.15, w: 8.5, h: 0.5,
    fontSize: F.size.h1, fontFace: F.sans, bold: true,
    color: C.textDark, shrinkText: true
  });
}

async function main() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "Gorilla Knowledge";
  pres.title = "P-03: Runway Gen-4.5＋HeyGen実践";

  const ic = {
    video: await icon(FaVideo, C.accent),
    target: await icon(FaBullseye, C.accent),
    rocket: await icon(FaRocket, C.accent),
    cogs: await icon(FaCogs, C.accent),
    image: await icon(FaImage, C.accent),
    pencil: await icon(FaPencilAlt, C.accent),
    exchange: await icon(FaExchangeAlt, C.accent),
    userTie: await icon(FaUserTie, C.accent),
    globe: await icon(FaGlobe, C.accent),
    lang: await icon(FaLanguage, C.accent),
    play: await icon(FaPlay, C.accent),
    check: await icon(FaCheckCircle, C.green),
    briefcase: await icon(FaBriefcase, C.accent),
    users: await icon(FaUsers, C.accent),
    bullhorn: await icon(FaBullhorn, C.accent),
    arrow: await icon(FaArrowRight, C.accent),
    camera: await icon(FaCamera, C.accent),
    wind: await icon(FaWind, C.amber),
    sun: await icon(FaSun, C.amber),
    magic: await icon(FaMagic, C.purple),
    mic: await icon(FaMicrophone, C.accent),
    film: await icon(FaFilm, C.accent),
    chart: await icon(FaChartBar, C.accent),
    chevron: await icon(FaChevronRight, C.textMuted),
  };

  const T = 12;

  // ============================================================
  // SLIDE 1: TITLE (Navy background)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };

    s.addImage({ data: ic.video, x: (L.W - 0.6) / 2, y: 0.9, w: 0.6, h: 0.6 });

    s.addText("Runway＋HeyGenで\n動画の幅を広げる", {
      x: 0.5, y: 1.6, w: 9, h: 1.0,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center", shrinkText: true
    });

    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 2.75, w: 3, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });

    s.addText("プロ品質のAI動画＆AIアバターを使いこなす", {
      x: 0.5, y: 2.95, w: 9, h: 0.45,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", shrinkText: true
    });

    s.addText("P-03   |   AI動画生成講座   |   12分", {
      x: 0.5, y: 4.2, w: 9, h: 0.3,
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
    addTopBar(s, pres);
    addSectionTitle(s, pres, "今日のゴール");
    addFooter(s, pres, 2, T);

    const goals = [
      "Runway Gen-4.5でImage-to-Video変換ができる",
      "HeyGenでAIアバター動画を作成できる",
      "Veo3との使い分けを判断できる",
    ];

    goals.forEach((g, i) => {
      const y = 1.1 + i * 1.1;
      s.addText(String(i + 1), {
        x: L.mx, y: y + 0.05, w: 0.5, h: 0.5,
        fontSize: F.size.h2, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: C.accent }, shape: pres.shapes.OVAL
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
  // SLIDE 3: RUNWAY OVERVIEW
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, pres, "Runwayとは — Gen-4.5の特徴", "RUNWAY");
    addFooter(s, pres, 3, T);

    // Elo badge
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 1.05, w: 3.5, h: 0.35,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    s.addText("Elo 1247 — ベンチマークトップ  |  月$12〜", {
      x: L.mx, y: 1.05, w: 3.5, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.accent, align: "center", valign: "middle", shrinkText: true
    });

    const cards = [
      { title: "キャラクター一貫性", desc: "同一人物が動画全体で\n一貫した見た目を維持", ic: ic.userTie, bg: C.accentLight },
      { title: "物理シミュレーション", desc: "水・布・重力など\n物理法則に忠実な動き", ic: ic.cogs, bg: C.greenBg },
      { title: "映画品質", desc: "ライティング・被写界深度\nプロの撮影に近い仕上がり", ic: ic.film, bg: C.amberBg },
    ];

    cards.forEach((c, i) => {
      const x = L.mx + i * 2.85;
      const y = 1.7;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x, y, w: 2.65, h: 2.5,
        fill: { color: c.bg }, rectRadius: 0.1
      });
      s.addImage({ data: c.ic, x: x + 1.0, y: y + 0.2, w: 0.5, h: 0.5 });
      s.addText(c.title, {
        x, y: y + 0.8, w: 2.65, h: 0.35,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.textDark, align: "center", shrinkText: true
      });
      s.addText(c.desc, {
        x: x + 0.15, y: y + 1.2, w: 2.35, h: 1.0,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textBody, align: "center", valign: "top", shrinkText: true
      });
    });

    // Bottom keywords
    s.addText("Alephエディタ  ·  音声生成  ·  Act-Two モーションキャプチャ", {
      x: L.mx, y: 4.4, w: 8.5, h: 0.3,
      fontSize: F.size.label, fontFace: F.sans, color: C.textLight, align: "center", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 4: RUNWAY IMAGE-TO-VIDEO
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, pres, "Runway実践：Image-to-Video", "HANDS-ON");
    addFooter(s, pres, 4, T);

    // Flow diagram
    const flowItems = [
      { label: "Midjourney\n画像生成", ic: ic.image, x: 0.5 },
      { label: "→", ic: null, x: 2.7 },
      { label: "Runway\nアップロード", ic: ic.rocket, x: 3.3 },
      { label: "→", ic: null, x: 5.5 },
      { label: "プロンプト\n動き指定", ic: ic.pencil, x: 6.1 },
      { label: "→", ic: null, x: 8.3 },
      { label: "高品質\n動画完成", ic: ic.play, x: 8.7 },
    ];

    flowItems.forEach((item) => {
      if (item.ic) {
        s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
          x: item.x, y: 1.1, w: 1.8, h: 1.6,
          fill: { color: C.offWhite }, rectRadius: 0.08,
          line: { color: C.border, width: 0.5 }
        });
        s.addImage({ data: item.ic, x: item.x + 0.6, y: 1.2, w: 0.5, h: 0.5 });
        s.addText(item.label, {
          x: item.x, y: 1.8, w: 1.8, h: 0.8,
          fontSize: F.size.label, fontFace: F.sans, bold: true,
          color: C.textDark, align: "center", valign: "top", shrinkText: true
        });
      } else {
        s.addText("→", {
          x: item.x, y: 1.5, w: 0.5, h: 0.5,
          fontSize: F.size.h2, fontFace: F.sans, bold: true,
          color: C.accent, align: "center", valign: "middle"
        });
      }
    });

    // Key point box
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: L.mx, y: 3.0, w: 8.5, h: 1.2,
      fill: { color: C.accentLight }, rectRadius: 0.08
    });
    s.addText("パワーワークフロー", {
      x: L.mx + 0.2, y: 3.05, w: 3, h: 0.35,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.accent, shrinkText: true
    });
    s.addText("Midjourneyの美しいアート性 ＋ Runwayの滑らかな動き\n＝ 静止画の世界観をそのまま動かせる。テキストから直接生成するより制御しやすい。", {
      x: L.mx + 0.2, y: 3.4, w: 8.1, h: 0.7,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textBody, shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 5: PROMPT TECHNIQUES
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, pres, "Runwayプロンプト術", "TIPS");
    addFooter(s, pres, 5, T);

    const cols = [
      {
        title: "カメラワーク指示", ic: ic.camera, bg: C.accentLight,
        items: "slow zoom in\ndolly shot\norbit around\ncrane up"
      },
      {
        title: "動きの指定", ic: ic.wind, bg: C.amberBg,
        items: "walking slowly\nhair blowing\nwater flowing\nleaves falling"
      },
      {
        title: "雰囲気の制御", ic: ic.sun, bg: C.greenBg,
        items: "cinematic lighting\ngolden hour\nmoody atmosphere\nsoft focus"
      },
    ];

    cols.forEach((col, i) => {
      const x = L.mx + i * 2.85;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x, y: 1.05, w: 2.65, h: 2.8,
        fill: { color: col.bg }, rectRadius: 0.1
      });
      s.addImage({ data: col.ic, x: x + 1.0, y: 1.15, w: 0.5, h: 0.5 });
      s.addText(col.title, {
        x, y: 1.7, w: 2.65, h: 0.35,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.textDark, align: "center", shrinkText: true
      });
      s.addText(col.items, {
        x: x + 0.2, y: 2.15, w: 2.25, h: 1.5,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textBody, align: "center", valign: "top", shrinkText: true
      });
    });

    // Example prompt
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: L.mx, y: 4.0, w: 8.5, h: 0.7,
      fill: { color: C.lightGray }, rectRadius: 0.05
    });
    s.addText("例: \"Slow zoom in on a woman, hair blowing in the wind, cinematic golden hour lighting\"", {
      x: L.mx + 0.15, y: 4.0, w: 8.2, h: 0.7,
      fontSize: F.size.label, fontFace: F.sans, italic: true,
      color: C.textBody, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 6: VEO3 VS RUNWAY
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, pres, "Veo3 vs Runway 使い分けガイド", "COMPARE");
    addFooter(s, pres, 6, T);

    // Table header
    const tableX = L.mx;
    const colW = [2.5, 3.5, 3.5];
    const headerY = 1.1;

    ["", "Veo3", "Runway Gen-4.5"].forEach((h, i) => {
      const x = tableX + colW.slice(0, i).reduce((a, b) => a + b, 0);
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: headerY, w: colW[i] - 0.05, h: 0.4,
        fill: { color: i === 0 ? C.lightGray : (i === 1 ? C.greenBg : C.accentLight) }
      });
      s.addText(h, {
        x, y: headerY, w: colW[i] - 0.05, h: 0.4,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.textDark, align: "center", valign: "middle", shrinkText: true
      });
    });

    const rows = [
      ["料金", "無料（Googleアカウント）", "月$12〜"],
      ["入力", "テキスト → 動画", "画像 → 動画（テキストも可）"],
      ["音声", "音声付き生成", "別途音声追加"],
      ["制御力", "シンプル", "カメラ・動き細かく制御"],
      ["品質", "良い", "プロ品質（映画レベル）"],
      ["最適用途", "試作・アイデア出し", "本番映像・高品質作品"],
    ];

    rows.forEach((row, ri) => {
      const y = headerY + 0.45 + ri * 0.45;
      row.forEach((cell, ci) => {
        const x = tableX + colW.slice(0, ci).reduce((a, b) => a + b, 0);
        s.addShape(pres.shapes.RECTANGLE, {
          x, y, w: colW[ci] - 0.05, h: 0.42,
          fill: { color: ri % 2 === 0 ? C.white : C.offWhite },
          line: { color: C.border, width: 0.3 }
        });
        s.addText(cell, {
          x: x + 0.1, y, w: colW[ci] - 0.25, h: 0.42,
          fontSize: F.size.label, fontFace: F.sans,
          bold: ci === 0,
          color: ci === 0 ? C.textDark : C.textBody,
          align: ci === 0 ? "left" : "center", valign: "middle", shrinkText: true
        });
      });
    });

    // Bottom tip
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: L.mx, y: 4.2, w: 8.5, h: 0.5,
      fill: { color: C.amberBg }, rectRadius: 0.05
    });
    s.addText("💡 Veo3で試作 → Runwayで仕上げ。組み合わせが最強のワークフロー", {
      x: L.mx + 0.15, y: 4.2, w: 8.2, h: 0.5,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.amber, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 7: HEYGEN OVERVIEW
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, pres, "HeyGenとは — AIアバター動画の革命", "HEYGEN");
    addFooter(s, pres, 7, T);

    // Badge
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 1.05, w: 4.0, h: 0.35,
      fill: { color: C.purpleBg }, rectRadius: 0.05
    });
    s.addText("テキスト→完成動画を4分で  |  月$29〜 (Creator)", {
      x: L.mx, y: 1.05, w: 4.0, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.purple, align: "center", valign: "middle", shrinkText: true
    });

    const cards = [
      { title: "Avatar IV", desc: "フルボディモーション\n手のジェスチャー・微表情", ic: ic.userTie, bg: C.purpleBg },
      { title: "175言語対応", desc: "多言語自動翻訳\nリップシンク同期", ic: ic.globe, bg: C.accentLight },
      { title: "Video Agent 2.0", desc: "台本入力だけで\n4分で完成動画", ic: ic.magic, bg: C.amberBg },
    ];

    cards.forEach((c, i) => {
      const x = L.mx + i * 2.85;
      const y = 1.7;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x, y, w: 2.65, h: 2.5,
        fill: { color: c.bg }, rectRadius: 0.1
      });
      s.addImage({ data: c.ic, x: x + 1.0, y: y + 0.2, w: 0.5, h: 0.5 });
      s.addText(c.title, {
        x, y: y + 0.8, w: 2.65, h: 0.35,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.textDark, align: "center", shrinkText: true
      });
      s.addText(c.desc, {
        x: x + 0.15, y: y + 1.2, w: 2.35, h: 1.0,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textBody, align: "center", valign: "top", shrinkText: true
      });
    });

    s.addText("音声クローン対応 — 自分の声でアバターを話させることも可能", {
      x: L.mx, y: 4.4, w: 8.5, h: 0.3,
      fontSize: F.size.label, fontFace: F.sans, color: C.textLight, align: "center", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 8: HEYGEN HANDS-ON
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, pres, "HeyGen実践：アバター動画を作る手順", "HANDS-ON");
    addFooter(s, pres, 8, T);

    const steps = [
      { num: "1", title: "アバター選択", desc: "100種類以上のプリセット\nまたはカスタム作成", ic: ic.userTie },
      { num: "2", title: "台本入力", desc: "話させたいテキストを入力\n1シーン300文字が最適", ic: ic.pencil },
      { num: "3", title: "声・言語設定", desc: "175言語対応\n音声クローンも可能", ic: ic.mic },
      { num: "4", title: "動画生成", desc: "数分で完成\nリアルな表情・ジェスチャー", ic: ic.play },
    ];

    steps.forEach((step, i) => {
      const x = L.mx + i * 2.15;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x, y: 1.1, w: 2.0, h: 2.8,
        fill: { color: C.offWhite }, rectRadius: 0.1,
        line: { color: C.border, width: 0.5 }
      });
      s.addText(step.num, {
        x: x + 0.7, y: 1.2, w: 0.5, h: 0.5,
        fontSize: F.size.h2, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: C.accent }, shape: pres.shapes.OVAL
      });
      s.addImage({ data: step.ic, x: x + 0.7, y: 1.85, w: 0.5, h: 0.5 });
      s.addText(step.title, {
        x, y: 2.45, w: 2.0, h: 0.35,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.textDark, align: "center", shrinkText: true
      });
      s.addText(step.desc, {
        x: x + 0.1, y: 2.85, w: 1.8, h: 0.9,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textBody, align: "center", valign: "top", shrinkText: true
      });

      if (i < 3) {
        s.addText("→", {
          x: x + 2.0, y: 2.1, w: 0.2, h: 0.4,
          fontSize: F.size.h3, fontFace: F.sans, bold: true,
          color: C.accent, align: "center", valign: "middle"
        });
      }
    });

    // Bottom message
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: L.mx, y: 4.1, w: 8.5, h: 0.5,
      fill: { color: C.greenBg }, rectRadius: 0.05
    });
    s.addText("撮影スタジオ不要 · 出演者不要 · PCひとつでプロ動画が完成", {
      x: L.mx + 0.15, y: 4.1, w: 8.2, h: 0.5,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.green, valign: "middle", align: "center", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 9: MULTILINGUAL
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, pres, "HeyGen多言語展開", "GLOBAL");
    addFooter(s, pres, 9, T);

    // Flow: Japanese → Translation → Multi-language
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.5, y: 1.2, w: 2.2, h: 1.8,
      fill: { color: C.accentLight }, rectRadius: 0.1
    });
    s.addImage({ data: ic.play, x: 1.3, y: 1.35, w: 0.5, h: 0.5 });
    s.addText("日本語動画", {
      x: 0.5, y: 1.95, w: 2.2, h: 0.3,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.textDark, align: "center", shrinkText: true
    });
    s.addText("元の動画を1本作成", {
      x: 0.5, y: 2.25, w: 2.2, h: 0.5,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textBody, align: "center", shrinkText: true
    });

    s.addText("→", {
      x: 2.8, y: 1.7, w: 0.5, h: 0.5,
      fontSize: F.size.h1, fontFace: F.sans, bold: true,
      color: C.accent, align: "center", valign: "middle"
    });

    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 3.5, y: 1.2, w: 2.2, h: 1.8,
      fill: { color: C.purpleBg }, rectRadius: 0.1
    });
    s.addImage({ data: ic.lang, x: 4.3, y: 1.35, w: 0.5, h: 0.5 });
    s.addText("HeyGen翻訳", {
      x: 3.5, y: 1.95, w: 2.2, h: 0.3,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.textDark, align: "center", shrinkText: true
    });
    s.addText("ワンクリックで変換", {
      x: 3.5, y: 2.25, w: 2.2, h: 0.5,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textBody, align: "center", shrinkText: true
    });

    s.addText("→", {
      x: 5.8, y: 1.7, w: 0.5, h: 0.5,
      fontSize: F.size.h1, fontFace: F.sans, bold: true,
      color: C.accent, align: "center", valign: "middle"
    });

    // Output languages
    const langs = [
      { label: "English", y: 1.2 },
      { label: "中文", y: 1.75 },
      { label: "한국어", y: 2.3 },
    ];

    langs.forEach((lang) => {
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: 6.5, y: lang.y, w: 2.5, h: 0.45,
        fill: { color: C.greenBg }, rectRadius: 0.05
      });
      s.addText(lang.label, {
        x: 6.5, y: lang.y, w: 2.5, h: 0.45,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.green, align: "center", valign: "middle", shrinkText: true
      });
    });

    // Key feature
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: L.mx, y: 3.3, w: 8.5, h: 0.5,
      fill: { color: C.amberBg }, rectRadius: 0.05
    });
    s.addText("口の動き（リップシンク）も翻訳先の言語に自動で同期", {
      x: L.mx + 0.15, y: 3.3, w: 8.2, h: 0.5,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.amber, valign: "middle", align: "center", shrinkText: true
    });

    // Cost comparison
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: L.mx, y: 4.0, w: 8.5, h: 0.7,
      fill: { color: C.offWhite }, rectRadius: 0.05
    });
    s.addText("従来: 1言語追加で数十万円（翻訳+撮影+編集）\nHeyGen: ワンクリックで追加言語の動画が完成", {
      x: L.mx + 0.15, y: 4.0, w: 8.2, h: 0.7,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textBody, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 10: BUSINESS USE CASES
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, pres, "業務活用パターン", "USE CASES");
    addFooter(s, pres, 10, T);

    const cases = [
      { title: "社内研修", desc: "HeyGenアバターで\n講師動画を量産\n台本更新も簡単", ic: ic.users, bg: C.accentLight },
      { title: "営業提案", desc: "Runwayで\nイメージ動画を作成\nMidjourney連携が効果的", ic: ic.briefcase, bg: C.greenBg },
      { title: "CEOメッセージ", desc: "HeyGenで\n多言語配信\n海外拠点にも直接届く", ic: ic.bullhorn, bg: C.amberBg },
      { title: "グローバル展開", desc: "1動画→多言語\n自動変換\n展開コスト大幅削減", ic: ic.globe, bg: C.purpleBg },
    ];

    cases.forEach((c, i) => {
      const x = L.mx + i * 2.15;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x, y: 1.1, w: 2.0, h: 3.0,
        fill: { color: c.bg }, rectRadius: 0.1
      });
      s.addImage({ data: c.ic, x: x + 0.7, y: 1.25, w: 0.5, h: 0.5 });
      s.addText(c.title, {
        x, y: 1.85, w: 2.0, h: 0.35,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.textDark, align: "center", shrinkText: true
      });
      s.addText(c.desc, {
        x: x + 0.1, y: 2.3, w: 1.8, h: 1.5,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textBody, align: "center", valign: "top", shrinkText: true
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
    addSectionTitle(s, pres, "まとめ");
    addFooter(s, pres, 11, T);

    const points = [
      "Runway Gen-4.5はプロ品質の動画生成（画像→動画が強み）",
      "HeyGenはAIアバター＋多言語展開の決定版",
      "Veo3→試作、Runway→品質追求、HeyGen→人物プレゼンの使い分け",
    ];

    points.forEach((p, i) => {
      const y = 1.1 + i * 1.1;
      s.addText(String(i + 1), {
        x: L.mx, y: y + 0.05, w: 0.5, h: 0.5,
        fontSize: F.size.h2, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: C.accent }, shape: pres.shapes.OVAL
      });
      s.addText(p, {
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

    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: L.mx, y: 4.1, w: 8.5, h: 0.5,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    s.addText("次のステップ: 確認テスト（5問中4問正解で修了）", {
      x: L.mx + 0.15, y: 4.1, w: 8.2, h: 0.5,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", align: "center", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 12: END (Navy background)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };

    s.addImage({ data: ic.check, x: (L.W - 0.6) / 2, y: 1.0, w: 0.6, h: 0.6 });

    s.addText("お疲れさまでした", {
      x: 0.5, y: 1.8, w: 9, h: 0.7,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center", shrinkText: true
    });

    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 2.65, w: 3, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });

    s.addText("確認テストに進みましょう", {
      x: 0.5, y: 2.85, w: 9, h: 0.45,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", shrinkText: true
    });

    s.addText("P-03   Runway Gen-4.5＋HeyGen実践", {
      x: 0.5, y: 4.2, w: 9, h: 0.3,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textMuted, align: "center", shrinkText: true
    });
  }

  // ============================================================
  // SAVE
  // ============================================================
  await pres.writeFile({ fileName: "スライド.pptx" });
  console.log("✅ スライド.pptx を生成しました（全12枚）");
}

main().catch(console.error);
