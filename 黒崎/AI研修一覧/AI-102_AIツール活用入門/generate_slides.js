const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const {
  FaRobot, FaComments, FaCode, FaPaintBrush, FaBriefcase,
  FaSearch, FaLock, FaYenSign, FaBullseye, FaCheckCircle,
  FaLightbulb, FaExclamationTriangle, FaChevronRight,
  FaFileAlt, FaArrowRight, FaDesktop, FaVideo, FaBook,
  FaShieldAlt, FaClipboardList
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
  slide.addText("AI-102", {
    x: L.mx, y: L.H - 0.38, w: 2, h: 0.3,
    fontSize: F.size.caption, fontFace: F.sans,
    color: C.textMuted, align: "left", margin: 0
  });
}

function addSectionTitle(slide, title, tag) {
  const pres = slide._pres || global._pres;
  if (tag) {
    slide.addShape(global._pres.shapes.RECTANGLE, {
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
  global._pres = pres;
  pres.layout = "LAYOUT_16x9";
  pres.author = "Gorilla Knowledge";
  pres.title = "AI-102: AIツール活用入門 — 主要ツールを知り、使い分けを理解する";

  // Pre-render icons
  const ic = {
    robot: await icon(FaRobot, C.accent),
    comments: await icon(FaComments, C.accent),
    code: await icon(FaCode, C.green),
    paintBrush: await icon(FaPaintBrush, C.amber),
    briefcase: await icon(FaBriefcase, C.navyLight),
    search: await icon(FaSearch, C.accent),
    lock: await icon(FaLock, C.red),
    yen: await icon(FaYenSign, C.amber),
    target: await icon(FaBullseye, C.accent),
    check: await icon(FaCheckCircle, C.green),
    checkBlue: await icon(FaCheckCircle, C.accent),
    bulb: await icon(FaLightbulb, C.amber),
    warn: await icon(FaExclamationTriangle, C.amber),
    chevron: await icon(FaChevronRight, C.textMuted),
    arrow: await icon(FaArrowRight, C.accent),
    file: await icon(FaFileAlt, C.accent),
    desktop: await icon(FaDesktop, C.accent),
    video: await icon(FaVideo, C.amber),
    book: await icon(FaBook, C.accent),
    shield: await icon(FaShieldAlt, C.red),
    clipboard: await icon(FaClipboardList, C.accent),
  };

  const T = 12;

  // ============================================================
  // SLIDE 1: TITLE (Navy background)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };

    s.addImage({ data: ic.robot, x: (L.W - 0.7) / 2, y: 1.0, w: 0.7, h: 0.7 });

    s.addText("AIツール活用入門", {
      x: 0.5, y: 1.9, w: 9, h: 0.9,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center", margin: 0
    });

    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 2.95, w: 3, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });

    s.addText("主要ツールを知り、使い分けを理解する", {
      x: 0.5, y: 3.15, w: 9, h: 0.5,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", margin: 0
    });

    s.addText("AI-102   |   AI-101修了者向け   |   10分", {
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
    addSectionTitle(s, "今日のゴール");
    addFooter(s, 2, T, pres);

    const goals = [
      "主要なAIツール（ChatGPT / Claude / Gemini等）の特徴を説明できる",
      "目的に応じてどのツールが適しているか判断できる",
      "AIツールの基本的な使い方（プロンプトの書き方）を実践できる",
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
  // SLIDE 3: AI TOOL MAP (4 categories)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "AIツールの全体マップ");
    addFooter(s, 3, T, pres);

    const categories = [
      { ic: ic.comments, label: "チャット型AI", desc: "文章で対話して回答を得る", color: C.accent, bg: C.accentLight, ex: "ChatGPT / Claude / Gemini" },
      { ic: ic.code, label: "コード支援AI", desc: "プログラミングを助ける", color: C.green, bg: C.greenBg, ex: "Copilot / Cursor / Claude Code" },
      { ic: ic.paintBrush, label: "画像・動画生成AI", desc: "ビジュアルコンテンツを作る", color: C.amber, bg: C.amberBg, ex: "Midjourney / DALL-E / Sora" },
      { ic: ic.briefcase, label: "業務特化ツール", desc: "特定の業務に最適化", color: C.navyLight, bg: C.lightGray, ex: "NotebookLM / Perplexity / Copilot" },
    ];

    const cardW = 3.9;
    const cardH = 1.6;
    const gapX = 0.5;
    const gapY = 0.35;

    categories.forEach((c, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = L.mx + col * (cardW + gapX);
      const y = 1.15 + row * (cardH + gapY);

      // Card
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: cardH,
        fill: { color: C.white }, line: { color: C.border, width: 0.75 }
      });
      // Top color band
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 0.05, fill: { color: c.color }
      });
      // Icon
      s.addShape(pres.shapes.OVAL, {
        x: x + 0.25, y: y + 0.3, w: 0.55, h: 0.55,
        fill: { color: c.bg }
      });
      s.addImage({ data: c.ic, x: x + 0.33, y: y + 0.38, w: 0.4, h: 0.4 });
      // Label
      s.addText(c.label, {
        x: x + 1.0, y: y + 0.2, w: 2.7, h: 0.35,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, valign: "middle", margin: 0
      });
      // Description
      s.addText(c.desc, {
        x: x + 1.0, y: y + 0.55, w: 2.7, h: 0.3,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textLight, valign: "top", margin: 0
      });
      // Examples
      s.addText(c.ex, {
        x: x + 0.25, y: y + 1.05, w: cardW - 0.5, h: 0.35,
        fontSize: F.size.caption, fontFace: F.sans,
        color: C.textMuted, valign: "middle", margin: 0
      });
    });
  }

  // ============================================================
  // SLIDE 4: CHAT AI COMPARISON (3 columns)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "チャット型AIの比較", "CHAT AI");
    addFooter(s, 4, T, pres);

    const tools = [
      {
        name: "ChatGPT",
        maker: "OpenAI",
        color: C.accent,
        bg: C.accentLight,
        features: ["最も普及・知名度No.1", "マルチモーダル対応", "プラグイン/GPTs豊富"]
      },
      {
        name: "Claude",
        maker: "Anthropic",
        color: C.green,
        bg: C.greenBg,
        features: ["長文処理が得意", "安全性重視の設計", "丁寧で正確な回答"]
      },
      {
        name: "Gemini",
        maker: "Google",
        color: C.amber,
        bg: C.amberBg,
        features: ["Google連携が強み", "検索統合で最新情報", "マルチモーダル対応"]
      },
    ];

    const cardW = 2.6;
    const cardGap = 0.25;
    const totalW = cardW * 3 + cardGap * 2;
    const startX = (L.W - totalW) / 2;

    tools.forEach((t, i) => {
      const x = startX + i * (cardW + cardGap);
      const y = 1.25;
      const h = 3.6;

      // Card
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h,
        fill: { color: C.white }, line: { color: C.border, width: 0.75 }
      });
      // Top color band
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 0.06, fill: { color: t.color }
      });
      // Name
      s.addText(t.name, {
        x, y: y + 0.3, w: cardW, h: 0.5,
        fontSize: F.size.h2, fontFace: F.sans, bold: true,
        color: C.textDark, align: "center", margin: 0
      });
      // Maker
      s.addText(t.maker, {
        x, y: y + 0.8, w: cardW, h: 0.3,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textMuted, align: "center", margin: 0
      });
      // Divider
      s.addShape(pres.shapes.LINE, {
        x: x + 0.3, y: y + 1.25, w: cardW - 0.6, h: 0,
        line: { color: C.border, width: 0.5 }
      });
      // Features
      t.features.forEach((f, fi) => {
        const fy = y + 1.5 + fi * 0.6;
        s.addImage({ data: ic.checkBlue, x: x + 0.25, y: fy + 0.05, w: 0.22, h: 0.22 });
        s.addText(f, {
          x: x + 0.55, y: fy, w: cardW - 0.8, h: 0.4,
          fontSize: F.size.label, fontFace: F.sans,
          color: C.textBody, valign: "middle", margin: 0
        });
      });
    });
  }

  // ============================================================
  // SLIDE 5: CODE AI
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "コード支援AI", "CODE AI");
    addFooter(s, 5, T, pres);

    const codeTools = [
      { name: "GitHub Copilot", desc: "VS Codeに組み込むコード補完の定番。コードを書く途中で次のコードを予測・提案。", tag: "コード補完" },
      { name: "Cursor", desc: "AI機能を最初から組み込んだエディタ。チャットで対話しながらコーディングできる。", tag: "AIエディタ" },
      { name: "Claude Code", desc: "ターミナルから直接AIに指示。ファイルをまたいだ大規模な変更にも対応。", tag: "CLI" },
    ];

    codeTools.forEach((t, i) => {
      const y = 1.25 + i * 1.1;

      // Card bg
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.9,
        fill: { color: C.offWhite }, line: { color: C.border, width: 0.5 }
      });
      // Left accent
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: 0.05, h: 0.9, fill: { color: C.green }
      });
      // Tag
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx + 0.3, y: y + 0.1, w: t.tag.length * 0.12 + 0.3, h: 0.25,
        fill: { color: C.greenBg }, rectRadius: 0.05
      });
      s.addText(t.tag, {
        x: L.mx + 0.3, y: y + 0.1, w: t.tag.length * 0.12 + 0.3, h: 0.25,
        fontSize: F.size.tag, fontFace: F.sans, bold: true,
        color: C.green, align: "center", valign: "middle"
      });
      // Name
      s.addText(t.name, {
        x: L.mx + 0.3, y: y + 0.42, w: 2.5, h: 0.4,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, valign: "middle", margin: 0
      });
      // Description
      s.addText(t.desc, {
        x: L.mx + 3.0, y, w: 5.2, h: 0.9,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textBody, valign: "middle", margin: 0
      });
    });

    // Tip
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.55, w: L.W - L.mx * 2, h: 0.5,
      fill: { color: C.accentLight }
    });
    s.addImage({ data: ic.bulb, x: L.mx + 0.2, y: 4.63, w: 0.3, h: 0.3 });
    s.addText("エンジニアの方はまずGitHub Copilotから試すのがおすすめ", {
      x: L.mx + 0.7, y: 4.55, w: 7.5, h: 0.5,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", margin: 0
    });
  }

  // ============================================================
  // SLIDE 6: IMAGE/VIDEO AI
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "画像・動画生成AI", "VISUAL AI");
    addFooter(s, 6, T, pres);

    const visualTools = [
      { name: "Midjourney", desc: "テキストから高品質なアート画像を生成。Discordアプリ経由で利用。", use: "デザイン案、コンセプトアート" },
      { name: "DALL-E", desc: "OpenAIの画像生成AI。ChatGPTに統合されており手軽。", use: "プレゼン画像、イラスト素材" },
      { name: "Sora", desc: "OpenAIの動画生成AI。テキストの指示から短い動画を作成。", use: "プロモーション動画、イメージ映像" },
    ];

    visualTools.forEach((t, i) => {
      const y = 1.25 + i * 1.1;

      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.9,
        fill: { color: C.offWhite }, line: { color: C.border, width: 0.5 }
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: 0.05, h: 0.9, fill: { color: C.amber }
      });

      s.addText(t.name, {
        x: L.mx + 0.3, y: y + 0.05, w: 2.2, h: 0.4,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, valign: "middle", margin: 0
      });
      s.addText(t.desc, {
        x: L.mx + 0.3, y: y + 0.45, w: 4.5, h: 0.35,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textBody, valign: "top", margin: 0
      });
      // Use case tag
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx + 5.3, y: y + 0.25, w: 3.0, h: 0.4,
        fill: { color: C.amberBg }, rectRadius: 0.05
      });
      s.addText(t.use, {
        x: L.mx + 5.3, y: y + 0.25, w: 3.0, h: 0.4,
        fontSize: F.size.caption, fontFace: F.sans,
        color: C.amber, align: "center", valign: "middle"
      });
    });

    // Tip
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.55, w: L.W - L.mx * 2, h: 0.5,
      fill: { color: C.accentLight }
    });
    s.addImage({ data: ic.bulb, x: L.mx + 0.2, y: 4.63, w: 0.3, h: 0.3 });
    s.addText("デザイン業務の効率化やプレゼン素材作りに活用できる", {
      x: L.mx + 0.7, y: 4.55, w: 7.5, h: 0.5,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", margin: 0
    });
  }

  // ============================================================
  // SLIDE 7: BUSINESS TOOLS
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "業務特化ツール", "BUSINESS");
    addFooter(s, 7, T, pres);

    const bizTools = [
      { name: "NotebookLM", maker: "Google", desc: "PDFやドキュメントを読み込んで質問。大量の資料を素早く理解。", color: C.accent, bg: C.accentLight },
      { name: "Perplexity", maker: "AI検索", desc: "情報をまとめて出典付きで回答。リサーチ業務の効率を大幅アップ。", color: C.green, bg: C.greenBg },
      { name: "Microsoft Copilot", maker: "Microsoft", desc: "Word・Excel・Teamsに統合。いつもの環境でAI活用。", color: C.navyLight, bg: C.lightGray },
    ];

    bizTools.forEach((t, i) => {
      const y = 1.25 + i * 1.1;

      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.9,
        fill: { color: C.white }, line: { color: C.border, width: 0.75 }
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: 0.05, h: 0.9, fill: { color: t.color }
      });

      // Icon circle
      s.addShape(pres.shapes.OVAL, {
        x: L.mx + 0.2, y: y + 0.15, w: 0.55, h: 0.55,
        fill: { color: t.bg }
      });
      const icData = i === 0 ? ic.book : (i === 1 ? ic.search : ic.desktop);
      s.addImage({ data: icData, x: L.mx + 0.28, y: y + 0.23, w: 0.4, h: 0.4 });

      s.addText(t.name, {
        x: L.mx + 1.0, y: y + 0.05, w: 3.0, h: 0.4,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, valign: "middle", margin: 0
      });
      s.addText(t.maker, {
        x: L.mx + 1.0, y: y + 0.48, w: 1.5, h: 0.3,
        fontSize: F.size.caption, fontFace: F.sans,
        color: C.textMuted, valign: "top", margin: 0
      });
      s.addText(t.desc, {
        x: L.mx + 3.5, y, w: 4.8, h: 0.9,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textBody, valign: "middle", margin: 0
      });
    });

    // Tip
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.55, w: L.W - L.mx * 2, h: 0.5,
      fill: { color: C.accentLight }
    });
    s.addImage({ data: ic.bulb, x: L.mx + 0.2, y: 4.63, w: 0.3, h: 0.3 });
    s.addText("普段の業務フローにAIを組み込めるのが最大のメリット", {
      x: L.mx + 0.7, y: 4.55, w: 7.5, h: 0.5,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", margin: 0
    });
  }

  // ============================================================
  // SLIDE 8: RECOMMENDATION MAP (table)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "目的別おすすめマップ");
    addFooter(s, 8, T, pres);

    const colW = [2.5, 6.0];
    const tblW = colW[0] + colW[1];
    const tblX = (L.W - tblW) / 2;
    const tblY = 1.15;
    const rowH = 0.55;

    // Header
    s.addShape(pres.shapes.RECTANGLE, {
      x: tblX, y: tblY, w: colW[0], h: rowH, fill: { color: C.accent }
    });
    s.addText("目的", {
      x: tblX, y: tblY, w: colW[0], h: rowH,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.white, align: "center", valign: "middle"
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: tblX + colW[0], y: tblY, w: colW[1], h: rowH, fill: { color: C.accent }
    });
    s.addText("おすすめツール", {
      x: tblX + colW[0], y: tblY, w: colW[1], h: rowH,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.white, align: "center", valign: "middle"
    });

    const rows = [
      ["文章作成・要約", "ChatGPT / Claude"],
      ["リサーチ・調査", "Perplexity / Gemini"],
      ["資料分析", "NotebookLM / Claude"],
      ["プレゼン画像", "DALL-E / Midjourney"],
      ["コーディング", "GitHub Copilot / Cursor"],
      ["社内業務全般", "Microsoft Copilot"],
    ];

    rows.forEach((row, ri) => {
      const ry = tblY + (ri + 1) * rowH;
      const bg = ri % 2 === 0 ? C.offWhite : C.white;

      s.addShape(pres.shapes.RECTANGLE, {
        x: tblX, y: ry, w: colW[0], h: rowH, fill: { color: bg }
      });
      s.addText(row[0], {
        x: tblX + 0.2, y: ry, w: colW[0] - 0.2, h: rowH,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.textDark, valign: "middle", margin: 0
      });

      s.addShape(pres.shapes.RECTANGLE, {
        x: tblX + colW[0], y: ry, w: colW[1], h: rowH, fill: { color: bg }
      });
      s.addText(row[1], {
        x: tblX + colW[0] + 0.3, y: ry, w: colW[1] - 0.3, h: rowH,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.accent, valign: "middle", margin: 0
      });
    });

    // Bottom tip
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.7, w: L.W - L.mx * 2, h: 0.45,
      fill: { color: C.navy }
    });
    s.addText([
      { text: "迷ったら ", options: { color: C.accentMid } },
      { text: "ChatGPT か Claude", options: { color: C.white, bold: true } },
      { text: " から始めよう — 最も汎用的", options: { color: C.accentMid } },
    ], {
      x: L.mx + 0.3, y: 4.7, w: L.W - L.mx * 2 - 0.6, h: 0.45,
      fontSize: F.size.body, fontFace: F.sans,
      align: "center", valign: "middle"
    });
  }

  // ============================================================
  // SLIDE 9: PROMPT BASICS
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "プロンプトの基本");
    addFooter(s, 9, T, pres);

    // Bad example
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 1.1, w: 4.0, h: 1.5,
      fill: { color: C.redBg }, line: { color: C.red, width: 0.5 }
    });
    s.addText("悪い例", {
      x: L.mx + 0.2, y: 1.15, w: 1.5, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.red, margin: 0
    });
    s.addText("「メールを書いて」", {
      x: L.mx + 0.2, y: 1.6, w: 3.6, h: 0.35,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textDark, margin: 0
    });
    s.addText("→ 誰に？何の？トーンは？", {
      x: L.mx + 0.2, y: 2.0, w: 3.6, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textLight, margin: 0
    });

    // Good example
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx + 4.5, y: 1.1, w: 4.0, h: 1.5,
      fill: { color: C.greenBg }, line: { color: C.green, width: 0.5 }
    });
    s.addText("良い例", {
      x: L.mx + 4.7, y: 1.15, w: 1.5, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.green, margin: 0
    });
    s.addText("「取引先の田中様に、会議を30分後ろ倒しにしたいお詫びメールをビジネス敬語で200文字程度で」", {
      x: L.mx + 4.7, y: 1.55, w: 3.6, h: 0.9,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textDark, margin: 0
    });

    // Arrow
    s.addImage({ data: ic.arrow, x: L.mx + 4.05, y: 1.6, w: 0.35, h: 0.35 });

    // 3 points
    const points = [
      { num: "1", title: "役割を指定する", desc: "「あなたはビジネスメールの専門家です」" },
      { num: "2", title: "具体的に書く", desc: "誰に、何を、どんなトーンで" },
      { num: "3", title: "出力形式を指定する", desc: "文字数、箇条書き、テーブルなど" },
    ];

    points.forEach((p, i) => {
      const y = 2.95 + i * 0.7;
      s.addText(p.num, {
        x: L.mx, y: y + 0.05, w: 0.4, h: 0.4,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: C.accent }, shape: pres.shapes.OVAL
      });
      s.addText(p.title, {
        x: L.mx + 0.6, y, w: 2.5, h: 0.5,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.textDark, valign: "middle", margin: 0
      });
      s.addText(p.desc, {
        x: L.mx + 3.2, y, w: 5.3, h: 0.5,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textLight, valign: "middle", margin: 0
      });
      if (i < 2) {
        s.addShape(pres.shapes.LINE, {
          x: L.mx, y: y + 0.6, w: L.W - L.mx * 2, h: 0,
          line: { color: C.border, width: 0.5 }
        });
      }
    });
  }

  // ============================================================
  // SLIDE 10: CAUTIONS (3 cards)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "AIツールを使うときの注意点");
    addFooter(s, 10, T, pres);

    const cautions = [
      { icon: ic.yen, num: "1", title: "料金体系を把握する", desc: "無料版と有料版の違いを理解。使いすぎに注意。業務利用なら有料版の検討も。", color: C.amber, bg: C.amberBg },
      { icon: ic.shield, num: "2", title: "セキュリティ", desc: "入力情報がAIの学習に使われる可能性あり。顧客情報・社内機密は絶対に入力しない。", color: C.red, bg: C.redBg },
      { icon: ic.clipboard, num: "3", title: "社内ルールを確認", desc: "利用可能なツール・用途を確認。承認された範囲で使う。不明なら上長・IT部門へ。", color: C.accent, bg: C.accentLight },
    ];

    cautions.forEach((c, i) => {
      const y = 1.2 + i * 1.2;

      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: 0.05, h: 0.95, fill: { color: c.color }
      });

      s.addShape(pres.shapes.OVAL, {
        x: L.mx + 0.3, y: y + 0.15, w: 0.6, h: 0.6,
        fill: { color: c.bg }
      });
      s.addImage({ data: c.icon, x: L.mx + 0.4, y: y + 0.25, w: 0.4, h: 0.4 });

      s.addText(c.title, {
        x: L.mx + 1.2, y: y + 0.05, w: 7, h: 0.4,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, valign: "middle", margin: 0
      });
      s.addText(c.desc, {
        x: L.mx + 1.2, y: y + 0.5, w: 7, h: 0.4,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textLight, valign: "top", margin: 0
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
    addSectionTitle(s, "まとめ");
    addFooter(s, 11, T, pres);

    const items = [
      { label: "4カテゴリ", text: "チャット型 / コード支援 / 画像生成 / 業務特化", color: C.accent },
      { label: "ツール選び", text: "目的に合わせて使い分けることが大切", color: C.green },
      { label: "プロンプト", text: "役割・具体性・出力形式の3つを意識", color: C.amber },
      { label: "注意点", text: "料金・セキュリティ・社内ルールを必ず確認", color: C.red },
    ];

    items.forEach((item, i) => {
      const y = 1.2 + i * 0.95;

      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.75,
        fill: { color: C.white }, line: { color: C.border, width: 0.5 }
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: 0.05, h: 0.75, fill: { color: item.color }
      });

      s.addText(item.label, {
        x: L.mx + 0.35, y, w: 1.8, h: 0.75,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: item.color, valign: "middle", margin: 0
      });
      s.addText(item.text, {
        x: L.mx + 2.2, y, w: 6.0, h: 0.75,
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

    s.addText("次の動画: AI-103", {
      x: 2.5, y: 3.8, w: 5, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textMuted, align: "center", margin: 0
    });
  }

  // Write
  const out = "/Users/kurosakiyuto/Downloads/開発/gorilla-knowledge/黒崎/AI研修一覧/AI-102_AIツール活用入門/スライド.pptx";
  await pres.writeFile({ fileName: out });
  console.log("Generated:", out);
}

main().catch(console.error);
