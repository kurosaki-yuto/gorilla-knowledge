const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const {
  FaBullseye, FaChevronRight, FaBookOpen,
  FaGraduationCap, FaLightbulb,
  FaCheckCircle, FaTimesCircle,
  FaDollarSign, FaRobot,
  FaChartBar, FaPlay, FaClock,
  FaArrowRight, FaSyncAlt, FaVideo,
  FaMobileAlt, FaPuzzlePiece, FaLayerGroup,
  FaClipboardList, FaExchangeAlt, FaSearchPlus,
  FaColumns, FaFlask, FaCogs, FaHandshake,
  FaBalanceScale
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
  slide.addText("P-04", {
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
  pres.title = "P-04: SNS × PDCA戦略";

  const ic = {
    target: await icon(FaBullseye, C.accent),
    chart: await icon(FaChartBar, C.accent),
    grad: await icon(FaGraduationCap, C.accent),
    bulb: await icon(FaLightbulb, C.amber),
    check: await icon(FaCheckCircle, C.green),
    times: await icon(FaTimesCircle, C.red),
    dollar: await icon(FaDollarSign, C.accent),
    robot: await icon(FaRobot, C.accent),
    play: await icon(FaPlay, C.accent),
    clock: await icon(FaClock, C.amber),
    arrow: await icon(FaArrowRight, C.accent),
    sync: await icon(FaSyncAlt, C.accent),
    video: await icon(FaVideo, C.accent),
    mobile: await icon(FaMobileAlt, C.accent),
    puzzle: await icon(FaPuzzlePiece, C.accent),
    layers: await icon(FaLayerGroup, C.accent),
    clipboard: await icon(FaClipboardList, C.accent),
    exchange: await icon(FaExchangeAlt, C.accent),
    search: await icon(FaSearchPlus, C.accent),
    columns: await icon(FaColumns, C.accent),
    flask: await icon(FaFlask, C.accent),
    cogs: await icon(FaCogs, C.accent),
    handshake: await icon(FaHandshake, C.accent),
    balance: await icon(FaBalanceScale, C.amber),
    chevron: await icon(FaChevronRight, C.textMuted),
    book: await icon(FaBookOpen, C.accent),
    playWhite: await icon(FaPlay, C.white),
    videoWhite: await icon(FaVideo, C.white),
  };

  const T = 12;

  // ============================================================
  // SLIDE 1: TITLE (Navy background)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };

    s.addImage({ data: ic.chart, x: (L.W - 0.6) / 2, y: 0.9, w: 0.6, h: 0.6 });

    s.addText("SNS × PDCA戦略", {
      x: 0.5, y: 1.7, w: 9, h: 0.8,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center", shrinkText: true
    });

    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 2.65, w: 3, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });

    s.addText("AI動画で回す高速マーケティング", {
      x: 0.5, y: 2.85, w: 9, h: 0.45,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", shrinkText: true
    });

    s.addText("P-04   |   AI動画生成シリーズ   |   12分", {
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
      "SNS動画におけるPDCAの回し方を理解する",
      "AI動画の量産テクニック（テンプレ・ABテスト・縦型）を実践できる",
      "外注 vs Veo 3のコスト比較を説明できる",
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
  // SLIDE 3: WHY AI VIDEO x SNS IS THE BEST
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, pres, "なぜAI動画×SNSが最強なのか", "COMPARISON");
    addFooter(s, pres, 3, T);

    // Table header
    const headers = ["", "従来の動画マーケ", "AI動画マーケ"];
    const rows = [
      ["制作本数/月", "2〜3本が限界", "20〜30本も可能"],
      ["リスク", "1本に大きな予算を賭ける", "小さく多く試せる"],
      ["PDCA速度", "月1回がやっと", "週単位で回せる"],
      ["勝ちパターン発見", "半年以上かかる", "1〜2ヶ月で見える"],
    ];

    const colW = [2.2, 2.8, 2.8];
    const startX = L.mx + 0.35;

    // Header row
    headers.forEach((h, i) => {
      const x = startX + colW.slice(0, i).reduce((a, b) => a + b, 0);
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: 1.1, w: colW[i], h: 0.45,
        fill: { color: i === 0 ? C.lightGray : i === 1 ? C.amberBg : C.greenBg },
        rectRadius: i === 0 ? 0 : 0.04
      });
      s.addText(h, {
        x, y: 1.1, w: colW[i], h: 0.45,
        fontSize: F.size.label, fontFace: F.sans, bold: true,
        color: i === 0 ? C.textLight : i === 1 ? C.amber : C.green,
        align: "center", valign: "middle", shrinkText: true
      });
    });

    // Data rows
    rows.forEach((row, ri) => {
      const y = 1.65 + ri * 0.65;
      row.forEach((cell, ci) => {
        const x = startX + colW.slice(0, ci).reduce((a, b) => a + b, 0);
        s.addShape(pres.shapes.RECTANGLE, {
          x, y, w: colW[ci], h: 0.55,
          fill: { color: ri % 2 === 0 ? C.offWhite : C.white },
          line: { color: C.border, width: 0.3 }
        });
        s.addText(cell, {
          x, y, w: colW[ci], h: 0.55,
          fontSize: ci === 0 ? F.size.label : F.size.body, fontFace: F.sans,
          bold: ci === 0, color: ci === 0 ? C.textDark : C.textBody,
          align: "center", valign: "middle", shrinkText: true
        });
      });
    });

    // Bottom message
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.4, w: L.W - L.mx * 2, h: 0.45,
      fill: { color: C.accentLight }, rectRadius: 0.08
    });
    s.addText("数で勝負して、データで勝つ", {
      x: L.mx, y: 4.4, w: L.W - L.mx * 2, h: 0.45,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.accent, align: "center", valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 4: PDCA CYCLE
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, pres, "SNS動画PDCAの回し方", "WORKFLOW");
    addFooter(s, pres, 4, T);

    const steps = [
      { label: "量産", desc: "Veo 3で\nバリエーション作成", color: C.accent },
      { label: "投稿", desc: "TikTok/Reels/\nShortsに投稿", color: C.green },
      { label: "数字を見る", desc: "再生数・完視聴率\n・保存数", color: C.amber },
      { label: "分析", desc: "伸びた動画の\n共通点を発見", color: C.red },
      { label: "横展開", desc: "当たりパターンを\n変数差し替え", color: C.accent },
    ];

    steps.forEach((st, i) => {
      const x = L.mx + 0.1 + i * 1.72;
      const y = 1.2;

      // Circle
      s.addText(st.label, {
        x: x + 0.15, y, w: 1.3, h: 1.3,
        fontSize: F.size.label, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: st.color }, shape: pres.shapes.OVAL, shrinkText: true
      });

      // Description below
      s.addText(st.desc, {
        x: x, y: y + 1.5, w: 1.6, h: 0.7,
        fontSize: F.size.caption, fontFace: F.sans,
        color: C.textBody, align: "center", valign: "top", shrinkText: true
      });

      // Arrow between circles
      if (i < steps.length - 1) {
        s.addImage({ data: ic.chevron, x: x + 1.45, y: y + 0.42, w: 0.25, h: 0.25 });
      }
    });

    // Return arrow label
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.8, w: L.W - L.mx * 2, h: 0.45,
      fill: { color: C.accentLight }, rectRadius: 0.08
    });
    s.addText("横展開 → 量産に戻る（毎週サイクルを回す）", {
      x: L.mx, y: 3.8, w: L.W - L.mx * 2, h: 0.45,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.accent, align: "center", valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 5: TECHNIQUE 1 - TEMPLATE PROMPTS
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, pres, "テクニック① テンプレプロンプトを作る", "TECHNIQUE");
    addFooter(s, pres, 5, T);

    // Template box
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 1.1, w: L.W - L.mx * 2, h: 1.5,
      fill: { color: C.lightGray }, rectRadius: 0.08,
      line: { color: C.border, width: 0.5 }
    });
    s.addText("テンプレート例", {
      x: L.mx + 0.2, y: 1.15, w: 2, h: 0.3,
      fontSize: F.size.caption, fontFace: F.sans, bold: true,
      color: C.accent
    });
    s.addText("{商品名} を {シーン} で使っている\n{ターゲット層} 向けの15秒動画。\nカメラは {カメラワーク}。BGMは {雰囲気}。", {
      x: L.mx + 0.3, y: 1.45, w: 7.8, h: 1.0,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textDark, valign: "middle", shrinkText: true
    });

    // Swap examples
    const swaps = [
      { variable: "商品名", from: "スキンケアクリーム", to: "プロテインバー" },
      { variable: "シーン", from: "朝の洗面台", to: "ジムのロッカールーム" },
    ];

    swaps.forEach((sw, i) => {
      const y = 2.85 + i * 0.7;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: 1.5, h: 0.5,
        fill: { color: C.accentLight }, rectRadius: 0.05
      });
      s.addText(sw.variable, {
        x: L.mx, y, w: 1.5, h: 0.5,
        fontSize: F.size.label, fontFace: F.sans, bold: true,
        color: C.accent, align: "center", valign: "middle", shrinkText: true
      });
      s.addText(sw.from, {
        x: L.mx + 1.7, y, w: 2.5, h: 0.5,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, valign: "middle", shrinkText: true
      });
      s.addImage({ data: ic.arrow, x: L.mx + 4.3, y: y + 0.1, w: 0.3, h: 0.3 });
      s.addText(sw.to, {
        x: L.mx + 4.8, y, w: 2.5, h: 0.5,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.green, valign: "middle", shrinkText: true
      });
    });

    // Bottom tip
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.4, w: L.W - L.mx * 2, h: 0.45,
      fill: { color: C.amberBg }, rectRadius: 0.08
    });
    s.addText("当たりプロンプトの構造を壊さない。変数だけ入れ替える", {
      x: L.mx, y: 4.4, w: L.W - L.mx * 2, h: 0.45,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.amber, align: "center", valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 6: TECHNIQUE 2 - ABC PATTERN TEST
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, pres, "テクニック② ABC3パターンテスト", "TECHNIQUE");
    addFooter(s, pres, 6, T);

    const patterns = [
      { label: "A", name: "クローズアップ", desc: "商品アップ\n質感重視", color: C.accent, bg: C.accentLight },
      { label: "B", name: "使用シーン", desc: "実際に使って\nいる場面", color: C.green, bg: C.greenBg },
      { label: "C", name: "Before/After", desc: "使用前後の\n変化", color: C.amber, bg: C.amberBg },
    ];

    patterns.forEach((p, i) => {
      const x = L.mx + 0.15 + i * 2.85;
      const y = 1.15;

      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: 2.6, h: 2.2,
        fill: { color: C.offWhite }, rectRadius: 0.1,
        line: { color: C.border, width: 0.5 }
      });

      // Label circle
      s.addText(p.label, {
        x: x + 0.9, y: y + 0.15, w: 0.6, h: 0.6,
        fontSize: F.size.h2, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: p.color }, shape: pres.shapes.OVAL
      });

      s.addText(p.name, {
        x, y: y + 0.9, w: 2.6, h: 0.4,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: p.color, align: "center", valign: "middle", shrinkText: true
      });

      s.addText(p.desc, {
        x: x + 0.2, y: y + 1.35, w: 2.2, h: 0.7,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textBody, align: "center", valign: "top", shrinkText: true
      });
    });

    // Flow description
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.6, w: L.W - L.mx * 2, h: 0.4,
      fill: { color: C.accentLight }, rectRadius: 0.06
    });
    s.addText("3本投稿 → 3日後に数字比較 → 伸びたパターンを横展開", {
      x: L.mx, y: 3.6, w: L.W - L.mx * 2, h: 0.4,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.accent, align: "center", valign: "middle", shrinkText: true
    });

    // Example
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.2, w: L.W - L.mx * 2, h: 0.45,
      fill: { color: C.greenBg }, rectRadius: 0.06
    });
    s.addText("例: Bが伸びた → 使用シーンのバリエーションをさらに5本作る", {
      x: L.mx, y: 4.2, w: L.W - L.mx * 2, h: 0.45,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.green, align: "center", valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 7: TECHNIQUE 3 - VERTICAL 9:16
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, pres, "テクニック③ 縦型9:16を前提にする", "TECHNIQUE");
    addFooter(s, pres, 7, T);

    const platforms = [
      { name: "TikTok", format: "縦型 9:16" },
      { name: "Instagram Reels", format: "縦型 9:16" },
      { name: "YouTube Shorts", format: "縦型 9:16" },
    ];

    platforms.forEach((p, i) => {
      const x = L.mx + 0.15 + i * 2.85;
      const y = 1.15;

      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: 2.6, h: 1.2,
        fill: { color: C.offWhite }, rectRadius: 0.1,
        line: { color: C.border, width: 0.5 }
      });
      s.addText(p.name, {
        x, y: y + 0.1, w: 2.6, h: 0.45,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.textDark, align: "center", valign: "middle", shrinkText: true
      });
      s.addText(p.format, {
        x, y: y + 0.6, w: 2.6, h: 0.4,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.accent, align: "center", valign: "middle", shrinkText: true
      });
    });

    // Veo 3 point
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 2.65, w: L.W - L.mx * 2, h: 0.8,
      fill: { color: C.greenBg }, rectRadius: 0.08
    });
    s.addImage({ data: ic.check, x: L.mx + 0.3, y: 2.8, w: 0.4, h: 0.4 });
    s.addText("Veo 3は最初からアスペクト比 9:16 を指定して縦型生成が可能", {
      x: L.mx + 0.9, y: 2.65, w: 7.0, h: 0.8,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.green, valign: "middle", shrinkText: true
    });

    // Warning
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.7, w: L.W - L.mx * 2, h: 0.7,
      fill: { color: C.redBg }, rectRadius: 0.08
    });
    s.addImage({ data: ic.times, x: L.mx + 0.3, y: 3.85, w: 0.35, h: 0.35 });
    s.addText("横型で撮って後からクロップすると画質・構図が崩れる", {
      x: L.mx + 0.85, y: 3.7, w: 7.0, h: 0.7,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.red, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 8: DEMO - NAVY BACKGROUND
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };

    s.addImage({ data: ic.videoWhite, x: (L.W - 0.7) / 2, y: 1.2, w: 0.7, h: 0.7 });

    s.addText("実演: ショート動画量産", {
      x: 0.5, y: 2.2, w: 9, h: 0.7,
      fontSize: F.size.h1, fontFace: F.sans, bold: true,
      color: C.white, align: "center", shrinkText: true
    });

    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 3.05, w: 3, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });

    s.addText("SNS向け縦型ショート動画の量産実演", {
      x: 0.5, y: 3.25, w: 9, h: 0.45,
      fontSize: F.size.h3, fontFace: F.sans,
      color: C.accentMid, align: "center", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 9: COST COMPARISON
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, pres, "コスト試算: 外注 vs Veo 3", "COST");
    addFooter(s, pres, 9, T);

    const headers = ["項目", "外注", "Veo 3"];
    const rows = [
      ["月間制作本数", "10本", "10本"],
      ["1本あたりコスト", "約3万円", "約290円"],
      ["月額コスト", "約30万円", "約2,900円"],
      ["年間コスト", "約360万円", "約34,800円"],
    ];
    const colW = [2.2, 2.8, 2.8];
    const startX = L.mx + 0.35;

    // Header
    headers.forEach((h, i) => {
      const x = startX + colW.slice(0, i).reduce((a, b) => a + b, 0);
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: 1.05, w: colW[i], h: 0.45,
        fill: { color: i === 0 ? C.lightGray : i === 1 ? C.amberBg : C.greenBg },
        rectRadius: 0.04
      });
      s.addText(h, {
        x, y: 1.05, w: colW[i], h: 0.45,
        fontSize: F.size.label, fontFace: F.sans, bold: true,
        color: i === 0 ? C.textLight : i === 1 ? C.amber : C.green,
        align: "center", valign: "middle", shrinkText: true
      });
    });

    // Data
    rows.forEach((row, ri) => {
      const y = 1.55 + ri * 0.55;
      row.forEach((cell, ci) => {
        const x = startX + colW.slice(0, ci).reduce((a, b) => a + b, 0);
        s.addShape(pres.shapes.RECTANGLE, {
          x, y, w: colW[ci], h: 0.48,
          fill: { color: ri % 2 === 0 ? C.offWhite : C.white },
          line: { color: C.border, width: 0.3 }
        });
        s.addText(cell, {
          x, y, w: colW[ci], h: 0.48,
          fontSize: F.size.body, fontFace: F.sans,
          bold: ci === 0, color: ci === 0 ? C.textDark : C.textBody,
          align: "center", valign: "middle", shrinkText: true
        });
      });
    });

    // Savings highlight
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.9, w: L.W - L.mx * 2, h: 0.65,
      fill: { color: C.greenBg }, rectRadius: 0.08
    });
    s.addImage({ data: ic.dollar, x: L.mx + 0.3, y: 4.02, w: 0.4, h: 0.4 });
    s.addText("年間削減額: 約325万円", {
      x: L.mx + 0.9, y: 3.9, w: 5, h: 0.65,
      fontSize: F.size.h2, fontFace: F.sans, bold: true,
      color: C.green, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 10: OUTSOURCE VS VEO 3
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, pres, "外注との使い分け", "STRATEGY");
    addFooter(s, pres, 10, T);

    // Two columns
    const cols = [
      {
        title: "ブランド動画 = 外注",
        items: ["会社紹介", "CM・広告", "採用動画"],
        color: C.amber, bg: C.amberBg, ratio: "20%"
      },
      {
        title: "日常SNS = Veo 3",
        items: ["日々の投稿", "テスト動画", "短尺コンテンツ"],
        color: C.green, bg: C.greenBg, ratio: "80%"
      },
    ];

    cols.forEach((col, i) => {
      const x = L.mx + i * 4.4;
      const y = 1.15;

      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: 4.1, h: 2.5,
        fill: { color: C.offWhite }, rectRadius: 0.1,
        line: { color: C.border, width: 0.5 }
      });

      // Title bar
      s.addShape(pres.shapes.RECTANGLE, {
        x: x + 0.2, y: y + 0.15, w: 3.7, h: 0.4,
        fill: { color: col.bg }, rectRadius: 0.05
      });
      s.addText(col.title, {
        x: x + 0.2, y: y + 0.15, w: 3.7, h: 0.4,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: col.color, align: "center", valign: "middle", shrinkText: true
      });

      // Items
      col.items.forEach((item, j) => {
        s.addText("•  " + item, {
          x: x + 0.4, y: y + 0.7 + j * 0.45, w: 3.3, h: 0.4,
          fontSize: F.size.body, fontFace: F.sans,
          color: C.textBody, valign: "middle", shrinkText: true
        });
      });

      // Ratio badge
      s.addText(col.ratio, {
        x: x + 1.4, y: y + 2.0, w: 1.2, h: 0.4,
        fontSize: F.size.h2, fontFace: F.sans, bold: true,
        color: col.color, align: "center", valign: "middle", shrinkText: true
      });
    });

    // 80:20 label
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.0, w: L.W - L.mx * 2, h: 0.55,
      fill: { color: C.accentLight }, rectRadius: 0.08
    });
    s.addText("80:20の法則 — コストとクオリティのバランスが最も取れた配分", {
      x: L.mx, y: 4.0, w: L.W - L.mx * 2, h: 0.55,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.accent, align: "center", valign: "middle", shrinkText: true
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
      "AI動画×SNSは「量産→投稿→分析→横展開」のPDCAを高速で回せる",
      "テンプレプロンプト・ABCテスト・縦型9:16の3テクニックで効率的に量産",
      "外注 vs Veo 3は80:20で使い分け、年間325万円のコスト削減が可能",
    ];

    points.forEach((p, i) => {
      const y = 1.1 + i * 1.1;
      s.addImage({ data: ic.check, x: L.mx, y: y + 0.05, w: 0.4, h: 0.4 });
      s.addText(p, {
        x: L.mx + 0.6, y, w: 7.8, h: 0.6,
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

    // Next step
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.2, w: L.W - L.mx * 2, h: 0.5,
      fill: { color: C.accentLight }, rectRadius: 0.08
    });
    s.addText("確認テスト: 5問中4問正解で修了", {
      x: L.mx, y: 4.2, w: L.W - L.mx * 2, h: 0.5,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.accent, align: "center", valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 12: END (Navy background)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };

    s.addText("お疲れさまでした", {
      x: 0.5, y: 1.5, w: 9, h: 0.8,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center", shrinkText: true
    });

    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 2.45, w: 3, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });

    s.addText("確認テストに進みましょう", {
      x: 0.5, y: 2.7, w: 9, h: 0.45,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", shrinkText: true
    });

    s.addText("P-04  SNS × PDCA戦略", {
      x: 0.5, y: 4.2, w: 9, h: 0.3,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textMuted, align: "center", shrinkText: true
    });
  }

  // ============================================================
  // SAVE
  // ============================================================
  await pres.writeFile({ fileName: "スライド.pptx" });
  console.log("スライド.pptx を生成しました（全" + T + "枚）");
}

main().catch(console.error);
