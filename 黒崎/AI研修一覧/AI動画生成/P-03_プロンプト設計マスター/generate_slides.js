const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const {
  FaVideo, FaCheckCircle, FaArrowRight, FaLightbulb,
  FaRocket, FaGraduationCap, FaEdit, FaVolumeUp,
  FaCamera, FaPalette, FaPlay, FaChevronRight,
  FaStar, FaExclamationTriangle, FaMagic, FaMusic,
  FaCommentDots, FaWind, FaCheck, FaTimes, FaExpand,
  FaMapMarkerAlt, FaSun, FaRunning, FaGlobeAmericas,
  FaSearch, FaMicrophone, FaLayerGroup, FaFilm,
  FaQuoteRight, FaBullseye, FaThLarge
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
  slide.addText("P-03", {
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
  pres.title = "P-03: プロンプト設計マスター";

  // Pre-render icons
  const ic = {
    video:     await icon(FaVideo,              C.accent),
    check:     await icon(FaCheckCircle,         C.green),
    checkBlue: await icon(FaCheckCircle,         C.accent),
    arrow:     await icon(FaArrowRight,          C.accent),
    bulb:      await icon(FaLightbulb,           C.amber),
    rocket:    await icon(FaRocket,              C.accent),
    grad:      await icon(FaGraduationCap,       C.green),
    edit:      await icon(FaEdit,                C.accent),
    volume:    await icon(FaVolumeUp,            C.purple),
    camera:    await icon(FaCamera,              C.accent),
    palette:   await icon(FaPalette,             C.purple),
    play:      await icon(FaPlay,                C.accent),
    chevron:   await icon(FaChevronRight,        C.accent),
    star:      await icon(FaStar,                C.amber),
    warning:   await icon(FaExclamationTriangle, C.amber),
    magic:     await icon(FaMagic,               C.accent),
    music:     await icon(FaMusic,               C.purple),
    comment:   await icon(FaCommentDots,         C.accent),
    wind:      await icon(FaWind,                C.green),
    checkGreen: await icon(FaCheck,              C.green),
    times:     await icon(FaTimes,               C.red),
    expand:    await icon(FaExpand,              C.accent),
    marker:    await icon(FaMapMarkerAlt,        C.red),
    sun:       await icon(FaSun,                 C.amber),
    running:   await icon(FaRunning,             C.green),
    globe:     await icon(FaGlobeAmericas,       C.accent),
    search:    await icon(FaSearch,              C.accent),
    mic:       await icon(FaMicrophone,          C.purple),
    layer:     await icon(FaLayerGroup,          C.accent),
    film:      await icon(FaFilm,                C.accent),
    quote:     await icon(FaQuoteRight,          C.accent),
    target:    await icon(FaBullseye,            C.red),
    grid:      await icon(FaThLarge,             C.accent),
  };

  // ============================================================
  // SLIDE 1: TITLE (Navy background)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };
    s.addImage({ data: ic.edit, x: (L.W - 0.65) / 2, y: 0.85, w: 0.65, h: 0.65 });
    s.addText("プロンプト設計マスター", {
      x: 0.5, y: 1.65, w: 9, h: 0.85,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center", shrinkText: true
    });
    s.addShape(pres.shapes.LINE, {
      x: 3.2, y: 2.65, w: 3.6, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });
    s.addText("6要素フレームワークで差がつく動画生成", {
      x: 0.5, y: 2.8, w: 9, h: 0.45,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", shrinkText: true
    });
    s.addText("P-03  |  全社員  |  12分", {
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
      { icon: ic.layer,  text: "6要素フレームワークで構造化されたプロンプトを書ける" },
      { icon: ic.volume, text: "音声プロンプト（環境音・効果音・BGM・セリフ）を使いこなせる" },
      { icon: ic.camera, text: "カメラワーク指定で映像表現の幅を広げられる" },
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
  // SLIDE 3: 6-ELEMENT FRAMEWORK (Card layout)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "プロンプト6要素フレームワーク", "FRAMEWORK");
    addFooter(s, 3, T);

    const elements = [
      { num: "1", ic: ic.search,  label: "被写体",       ex: "A young woman in a navy blazer" },
      { num: "2", ic: ic.marker,  label: "場所・背景",    ex: "in a modern coworking space" },
      { num: "3", ic: ic.camera,  label: "カメラワーク",  ex: "slow dolly in" },
      { num: "4", ic: ic.sun,     label: "照明・雰囲気",  ex: "warm natural light, cinematic" },
      { num: "5", ic: ic.running, label: "動き・アクション", ex: "typing, then looks up and smiles" },
      { num: "6", ic: ic.volume,  label: "音声",         ex: "ambient cafe sounds, keyboard clicks" },
    ];

    // 3x2 card grid
    elements.forEach((el, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const cardW = 2.65;
      const cardH = 1.65;
      const startX = L.mx + col * (cardW + 0.18);
      const startY = 1.05 + row * (cardH + 0.18);

      // Card background
      s.addShape(pres.shapes.RECTANGLE, {
        x: startX, y: startY, w: cardW, h: cardH,
        fill: { color: row === 0 ? C.offWhite : C.accentLight },
        line: { color: C.border, width: 0.5 }, rectRadius: 0.06
      });

      // Number badge
      s.addText(el.num, {
        x: startX + 0.1, y: startY + 0.1, w: 0.32, h: 0.32,
        fontSize: F.size.label, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: C.accent }, shape: pres.shapes.OVAL, shrinkText: true
      });

      // Icon
      s.addImage({ data: el.ic, x: startX + 0.5, y: startY + 0.12, w: 0.26, h: 0.26 });

      // Label
      s.addText(el.label, {
        x: startX + 0.82, y: startY + 0.08, w: 1.7, h: 0.35,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, valign: "middle", shrinkText: true
      });

      // Example
      s.addText(el.ex, {
        x: startX + 0.15, y: startY + 0.55, w: cardW - 0.3, h: 0.95,
        fontSize: F.size.label, fontFace: F.sans, italic: true,
        color: C.textLight, valign: "top", shrinkText: true
      });
    });
  }

  // ============================================================
  // SLIDE 4: AUDIO PROMPT GUIDE (Table)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "音声プロンプトの書き方ガイド", "AUDIO");
    addFooter(s, 4, T);

    const rows = [
      ["種類",       "書き方",                                "具体例"],
      ["環境音",     "with ambient [場所] sounds",             "with ambient cafe sounds"],
      ["効果音",     "with [動作] sound effects",              "with keyboard clicks"],
      ["BGM",       "with [ジャンル] background music",       "with soft jazz background music"],
      ["セリフ",     '\"[セリフ]\" in [言語]',                  '\"Welcome to our store\"'],
      ["ナレーション", 'with [トーン] narration: \"[内容]\"',     'with calm narration: \"This is...\"'],
    ];

    const colW = [1.2, 3.2, 4.1];
    const startX = L.mx;
    const startY = 1.05;
    const rowH = 0.62;

    rows.forEach((row, ri) => {
      let x = startX;
      row.forEach((cell, ci) => {
        const isHeader = ri === 0;
        s.addShape(pres.shapes.RECTANGLE, {
          x, y: startY + ri * rowH, w: colW[ci], h: rowH,
          fill: { color: isHeader ? C.navy : (ri % 2 === 0 ? C.offWhite : C.white) },
          line: { color: C.border, width: 0.5 }
        });
        s.addText(cell, {
          x: x + 0.1, y: startY + ri * rowH, w: colW[ci] - 0.2, h: rowH,
          fontSize: isHeader ? F.size.label : F.size.body,
          fontFace: F.sans, bold: isHeader,
          color: isHeader ? C.white : C.textBody,
          valign: "middle", shrinkText: true
        });
        x += colW[ci];
      });
    });

    // Tip
    s.addImage({ data: ic.bulb, x: L.mx, y: 4.85, w: 0.22, h: 0.22 });
    s.addText("5種類を組み合わせることで、映像と音が一体になったリッチな動画が生成できます", {
      x: L.mx + 0.32, y: 4.8, w: L.W - L.mx * 2 - 0.4, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans, italic: true,
      color: C.textLight, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 5: IMPORTANT RULES
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "重要ルール", "RULES");
    addFooter(s, 5, T);

    const rules = [
      {
        ic: ic.globe, label: "ルール1: 英語で書く",
        desc: "英語の方が生成精度が高い。日本語で考えて → AIで英訳 → プロンプトに貼り付け",
        bg: C.accentLight
      },
      {
        ic: ic.quote, label: 'ルール2: セリフは引用符（""）で囲む',
        desc: "\"Hello!\" → セリフとして認識  /  Hello! → 指示文として解釈される可能性あり",
        bg: C.amberBg
      },
      {
        ic: ic.target, label: "ルール3: 1プロンプト = 1シーン",
        desc: "複数シーンを詰め込むとAIが混乱し、どれも中途半端になる",
        bg: C.redBg
      },
    ];

    rules.forEach((r, i) => {
      const y = 1.05 + i * 1.25;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 1.05,
        fill: { color: r.bg },
        line: { color: C.border, width: 0.5 }, rectRadius: 0.06
      });
      s.addImage({ data: r.ic, x: L.mx + 0.2, y: y + 0.15, w: 0.35, h: 0.35 });
      s.addText(r.label, {
        x: L.mx + 0.7, y: y + 0.08, w: 7.5, h: 0.38,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, valign: "middle", shrinkText: true
      });
      s.addText(r.desc, {
        x: L.mx + 0.7, y: y + 0.5, w: 7.5, h: 0.45,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, valign: "top", shrinkText: true
      });
    });
  }

  // ============================================================
  // SLIDE 6: DEMO - PROMPT COMPARISON (Navy background)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };

    // Film icon
    s.addImage({ data: ic.film, x: (L.W - 0.55) / 2, y: 1.0, w: 0.55, h: 0.55 });

    s.addText("実演: プロンプト比較", {
      x: 0.5, y: 1.75, w: 9, h: 0.7,
      fontSize: F.size.h1, fontFace: F.sans, bold: true,
      color: C.white, align: "center", shrinkText: true
    });
    s.addShape(pres.shapes.LINE, {
      x: 3.2, y: 2.6, w: 3.6, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });
    s.addText("悪いプロンプト vs 良いプロンプト", {
      x: 0.5, y: 2.75, w: 9, h: 0.45,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", shrinkText: true
    });
    s.addText("DEMO", {
      x: (L.W - 1.4) / 2, y: 3.6, w: 1.4, h: 0.4,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.white, align: "center", valign: "middle",
      fill: { color: C.accent }, shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.05, shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 7: GOOD PROMPT BREAKDOWN
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "カフェ動画 — 良いプロンプト全文", "BREAKDOWN");
    addFooter(s, 7, T);

    // Full prompt text
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 1.0, w: L.W - L.mx * 2, h: 1.1,
      fill: { color: C.lightGray },
      line: { color: C.border, width: 0.5 }, rectRadius: 0.06
    });
    s.addText(
      "A young woman in a cream sweater sitting at a wooden table in a cozy Tokyo cafe, slow dolly in, warm afternoon light streaming through the window, cinematic color grading, she picks up a latte and takes a sip with a gentle smile, with ambient cafe chatter, soft clinking of cups, and lo-fi background music",
      {
        x: L.mx + 0.2, y: 1.05, w: L.W - L.mx * 2 - 0.4, h: 1.0,
        fontSize: F.size.label, fontFace: F.sans, italic: true,
        color: C.textBody, valign: "middle", shrinkText: true
      }
    );

    // 6-element breakdown
    const items = [
      { num: "1", label: "被写体",   text: "A young woman in a cream sweater",        color: C.accent },
      { num: "2", label: "場所",     text: "sitting at a wooden table in a cozy Tokyo cafe", color: C.red },
      { num: "3", label: "カメラ",   text: "slow dolly in",                            color: C.green },
      { num: "4", label: "照明",     text: "warm afternoon light, cinematic color grading", color: C.amber },
      { num: "5", label: "動き",     text: "picks up a latte and takes a sip with a gentle smile", color: C.purple },
      { num: "6", label: "音声",     text: "ambient cafe chatter, clinking of cups, lo-fi music", color: C.accent },
    ];

    items.forEach((it, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const w = 4.05;
      const x = L.mx + col * (w + 0.2);
      const y = 2.3 + row * 0.72;

      s.addText(it.num, {
        x: x, y: y + 0.05, w: 0.3, h: 0.3,
        fontSize: F.size.caption, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: it.color }, shape: pres.shapes.OVAL, shrinkText: true
      });
      s.addText(it.label, {
        x: x + 0.38, y: y, w: 0.7, h: 0.2,
        fontSize: F.size.caption, fontFace: F.sans, bold: true,
        color: it.color, shrinkText: true
      });
      s.addText(it.text, {
        x: x + 0.38, y: y + 0.22, w: w - 0.5, h: 0.38,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textBody, valign: "top", shrinkText: true
      });
    });
  }

  // ============================================================
  // SLIDE 8: CAMERA WORK TABLE
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "カメラワーク一覧テーブル", "CAMERA");
    addFooter(s, 8, T);

    const rows = [
      ["カメラワーク", "英語キーワード",   "効果",           "使い分け"],
      ["パン",        "pan left/right",    "横に視野が広がる",  "風景全体を見せたい時"],
      ["ズーム",      "zoom in/out",       "注目・俯瞰",       "被写体に寄りたい時"],
      ["トラッキング", "tracking shot",     "被写体を追従",     "人物の動きを追う時"],
      ["空撮",        "aerial shot",       "壮大なスケール感",  "建物・自然の全景"],
      ["クローズアップ","close-up",          "表情・ディテール",  "感情を伝えたい時"],
      ["スローモーション","slow motion",      "ドラマチック",     "決定的瞬間を強調"],
      ["静止",        "static shot",       "安定感・落ち着き",  "インタビュー風"],
      ["オービット",   "orbiting shot",     "360度の立体感",    "商品・建物の紹介"],
    ];

    const colW = [1.5, 1.8, 2.1, 3.1];
    const startX = L.mx;
    const startY = 1.0;
    const rowH = 0.46;

    rows.forEach((row, ri) => {
      let x = startX;
      row.forEach((cell, ci) => {
        const isHeader = ri === 0;
        s.addShape(pres.shapes.RECTANGLE, {
          x, y: startY + ri * rowH, w: colW[ci], h: rowH,
          fill: { color: isHeader ? C.navy : (ri % 2 === 0 ? C.offWhite : C.white) },
          line: { color: C.border, width: 0.5 }
        });
        s.addText(cell, {
          x: x + 0.08, y: startY + ri * rowH, w: colW[ci] - 0.16, h: rowH,
          fontSize: isHeader ? F.size.caption : F.size.label,
          fontFace: F.sans, bold: isHeader,
          color: isHeader ? C.white : C.textBody,
          valign: "middle", shrinkText: true
        });
        x += colW[ci];
      });
    });
  }

  // ============================================================
  // SLIDE 9: DEMO - FLOW VERTICAL VIDEO (Navy background)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };

    // Film icon
    s.addImage({ data: ic.film, x: (L.W - 0.55) / 2, y: 1.0, w: 0.55, h: 0.55 });

    s.addText("実演: Flowで縦型動画生成", {
      x: 0.5, y: 1.75, w: 9, h: 0.7,
      fontSize: F.size.h1, fontFace: F.sans, bold: true,
      color: C.white, align: "center", shrinkText: true
    });
    s.addShape(pres.shapes.LINE, {
      x: 3.2, y: 2.6, w: 3.6, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });
    s.addText("アスペクト比 9:16 で実践", {
      x: 0.5, y: 2.75, w: 9, h: 0.45,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", shrinkText: true
    });
    s.addText("DEMO", {
      x: (L.W - 1.4) / 2, y: 3.6, w: 1.4, h: 0.4,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.white, align: "center", valign: "middle",
      fill: { color: C.accent }, shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.05, shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 10: CAMERA WORK TIPS
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "カメラワークのコツ", "TIPS");
    addFooter(s, 10, T);

    // Tip 1: OK
    const tip1Y = 1.05;
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: tip1Y, w: L.W - L.mx * 2, h: 1.1,
      fill: { color: C.greenBg },
      line: { color: C.border, width: 0.5 }, rectRadius: 0.06
    });
    s.addImage({ data: ic.checkGreen, x: L.mx + 0.15, y: tip1Y + 0.12, w: 0.3, h: 0.3 });
    s.addText("コツ1: 1動画にカメラワークは1〜2種類まで", {
      x: L.mx + 0.55, y: tip1Y + 0.05, w: 7.5, h: 0.35,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.green, valign: "middle", shrinkText: true
    });
    s.addText('OK: \"slow dolly in with slight zoom\"', {
      x: L.mx + 0.55, y: tip1Y + 0.45, w: 7.5, h: 0.25,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textBody, valign: "middle", shrinkText: true
    });
    s.addText('NG: \"pan left, then zoom in, then tracking, then orbit\"', {
      x: L.mx + 0.55, y: tip1Y + 0.72, w: 7.5, h: 0.25,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.red, valign: "middle", shrinkText: true
    });

    // Tip 2: Warning
    const tip2Y = 2.35;
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: tip2Y, w: L.W - L.mx * 2, h: 0.85,
      fill: { color: C.amberBg },
      line: { color: C.border, width: 0.5 }, rectRadius: 0.06
    });
    s.addImage({ data: ic.warning, x: L.mx + 0.15, y: tip2Y + 0.12, w: 0.3, h: 0.3 });
    s.addText("コツ2: 3つ以上入れるとAIが混乱する", {
      x: L.mx + 0.55, y: tip2Y + 0.05, w: 7.5, h: 0.35,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.amber, valign: "middle", shrinkText: true
    });
    s.addText("動きが不自然になり、どのカメラワークも中途半端になる", {
      x: L.mx + 0.55, y: tip2Y + 0.42, w: 7.5, h: 0.3,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textBody, valign: "middle", shrinkText: true
    });

    // Tip 3: Star
    const tip3Y = 3.4;
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: tip3Y, w: L.W - L.mx * 2, h: 0.85,
      fill: { color: C.accentLight },
      line: { color: C.border, width: 0.5 }, rectRadius: 0.06
    });
    s.addImage({ data: ic.star, x: L.mx + 0.15, y: tip3Y + 0.12, w: 0.3, h: 0.3 });
    s.addText('コツ3: 迷ったら「dolly in」が万能', {
      x: L.mx + 0.55, y: tip3Y + 0.05, w: 7.5, h: 0.35,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", shrinkText: true
    });
    s.addText("自然で映画的な映像になりやすい。初心者はまずdolly inから", {
      x: L.mx + 0.55, y: tip3Y + 0.42, w: 7.5, h: 0.3,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textBody, valign: "middle", shrinkText: true
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

    const items = [
      { ic: ic.layer,      text: "6要素フレームワーク: 被写体 / 場所 / カメラ / 照明 / 動き / 音声" },
      { ic: ic.volume,     text: "音声は5種類: 環境音 / 効果音 / BGM / セリフ / ナレーション" },
      { ic: ic.globe,      text: "英語で書く + セリフは引用符で囲む" },
      { ic: ic.camera,     text: "カメラワークは1〜2種類まで（迷ったらdolly in）" },
      { ic: ic.star,       text: "6要素 + 英語 + 音声 = 他の人と差がつくプロンプト" },
    ];

    items.forEach((it, i) => {
      const y = 1.0 + i * 0.78;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.65,
        fill: { color: i % 2 === 0 ? C.offWhite : C.accentLight },
        line: { color: C.border, width: 0.5 }, rectRadius: 0.05
      });
      s.addImage({ data: it.ic, x: L.mx + 0.15, y: y + 0.16, w: 0.3, h: 0.3 });
      s.addText(it.text, {
        x: L.mx + 0.6, y, w: 7.5, h: 0.65,
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
    s.addImage({ data: ic.grad, x: (L.W - 0.65) / 2, y: 1.3, w: 0.65, h: 0.65 });
    s.addText("確認テストへ進む", {
      x: 0.5, y: 2.2, w: 9, h: 0.7,
      fontSize: F.size.h1, fontFace: F.sans, bold: true,
      color: C.white, align: "center", shrinkText: true
    });
    s.addShape(pres.shapes.LINE, {
      x: 3.2, y: 3.05, w: 3.6, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });
    s.addText("P-03 修了", {
      x: 0.5, y: 3.2, w: 9, h: 0.45,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", shrinkText: true
    });
  }

  // Write file
  await pres.writeFile({ fileName: "スライド.pptx" });
  console.log("Generated: スライド.pptx (12 slides)");
}

main().catch(console.error);
