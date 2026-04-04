const PptxGenJS = require("pptxgenjs");

// =====================================================
// DESIGN SYSTEM (navy:1B2A4A, accent:2563EB, Calibri, 10x5.625)
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
  purple: "7C3AED",
  purpleBg: "EDE9FE",
  border: "E5E7EB",
};

const F = {
  sans: "Calibri",
  size: {
    hero: 40, h1: 32, h2: 22, h3: 18, body: 16, label: 13, caption: 11, tag: 10,
  }
};

const L = { W: 10, H: 5.625, mx: 0.75, my: 0.5, gap: 0.3 };

// =====================================================
// LAYOUT PRIMITIVES
// =====================================================
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
    fontSize: F.size.caption, fontFace: F.sans, color: C.textMuted, align: "right"
  });
  slide.addText("P-01", {
    x: L.mx, y: L.H - 0.38, w: 2, h: 0.3,
    fontSize: F.size.caption, fontFace: F.sans, color: C.textMuted, align: "left"
  });
}

function addSectionTitle(slide, title, pres, tag) {
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
    color: C.textDark
  });
}

function addCard(slide, pres, x, y, w, h, opts = {}) {
  const fill = opts.fill || C.offWhite;
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h, fill: { color: fill },
    line: { color: C.border, width: 0.5 }, rectRadius: 0.08
  });
  if (opts.borderTop) {
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y, w, h: 0.04, fill: { color: opts.borderTop }, rectRadius: 0.02
    });
  }
}

function addNumberCircle(slide, pres, x, y, num, color) {
  color = color || C.accent;
  slide.addShape(pres.shapes.OVAL, {
    x, y, w: 0.35, h: 0.35, fill: { color }
  });
  slide.addText(`${num}`, {
    x, y, w: 0.35, h: 0.35,
    fontSize: F.size.label, fontFace: F.sans, bold: true,
    color: C.white, align: "center", valign: "middle"
  });
}

async function main() {
  const pres = new PptxGenJS();
  pres.layout = "LAYOUT_16x9";
  pres.author = "Gorilla Knowledge";
  pres.title = "P-01: 全ツール総整理＋選定フローチャート（2026年4月版）";

  const T = 12;

  // ============================================================
  // SLIDE 1: TITLE (navy)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };

    s.addText("ツール選定戦略＆\n自社AI活用ロードマップ策定", {
      x: 0.5, y: 1.0, w: 9, h: 1.4,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center", lineSpacingMultiple: 1.2
    });

    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 2.65, w: 3, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });

    s.addText("Pack 6 | 最終回", {
      x: 0.5, y: 2.9, w: 9, h: 0.5,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center"
    });

    s.addText("P-01  |  全ツール総整理＋選定フローチャート  |  約12分", {
      x: 0.5, y: 3.8, w: 9, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textMuted, align: "center"
    });

    s.addText("2026年4月版 — 最新データ反映", {
      x: 0.5, y: 4.3, w: 9, h: 0.3,
      fontSize: F.size.caption, fontFace: F.sans,
      color: C.textMuted, align: "center"
    });
  }

  // ============================================================
  // SLIDE 2: GOALS
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "この講義が終わったら、あなたは...", pres);
    addFooter(s, 2, T, pres);

    const goals = [
      "主要AIツールを3カテゴリで俯瞰できる",
      "チャットAI 4ツールの「得意技」を即答できる",
      "目的別ツール選定フローチャートを使える",
      "月$60で業務の80%をカバーする最強セットを組める",
      "ROIの現実（節約時間とやり直しリスク）を説明できる",
    ];

    goals.forEach((g, i) => {
      const y = 1.15 + i * 0.72;
      addCard(s, pres, L.mx, y, L.W - L.mx * 2, 0.6, { borderTop: C.accent });
      addNumberCircle(s, pres, L.mx + 0.15, y + 0.13, i + 1);
      s.addText(g, {
        x: L.mx + 0.65, y: y + 0.05, w: 7.5, h: 0.5,
        fontSize: F.size.body, fontFace: F.sans, color: C.textBody
      });
    });
  }

  // ============================================================
  // SLIDE 3: AGENDA
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "今日のアジェンダ", pres);
    addFooter(s, 3, T, pres);

    const parts = [
      { id: "P-01", title: "全ツール総整理＋選定フローチャート", time: "12分", current: true },
      { id: "P-02", title: "コストシミュレーション", time: "12分", current: false },
      { id: "P-03", title: "90日ロードマップ設計", time: "12分", current: false },
      { id: "P-04", title: "KPI設定と実践", time: "12分", current: false },
      { id: "P-05", title: "Pack 6総まとめ", time: "12分", current: false },
    ];

    const hdrY = 1.15;
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: hdrY, w: L.W - L.mx * 2, h: 0.45,
      fill: { color: C.navy }, rectRadius: 0.05
    });
    s.addText("パート", {
      x: L.mx + 0.15, y: hdrY, w: 1.2, h: 0.45,
      fontSize: F.size.label, fontFace: F.sans, bold: true, color: C.white, valign: "middle"
    });
    s.addText("テーマ", {
      x: L.mx + 1.5, y: hdrY, w: 5, h: 0.45,
      fontSize: F.size.label, fontFace: F.sans, bold: true, color: C.white, valign: "middle"
    });
    s.addText("時間", {
      x: L.W - L.mx - 1.2, y: hdrY, w: 1.2, h: 0.45,
      fontSize: F.size.label, fontFace: F.sans, bold: true, color: C.white, valign: "middle", align: "center"
    });

    parts.forEach((p, i) => {
      const y = hdrY + 0.5 + i * 0.65;
      const bg = p.current ? C.accentLight : (i % 2 === 0 ? C.offWhite : C.white);
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.55,
        fill: { color: bg }, rectRadius: 0.04
      });
      s.addText(p.id, {
        x: L.mx + 0.15, y, w: 1.2, h: 0.55,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: p.current ? C.accent : C.textDark, valign: "middle"
      });
      s.addText(p.title + (p.current ? "  \u25C0 NOW" : ""), {
        x: L.mx + 1.5, y, w: 5, h: 0.55,
        fontSize: F.size.body, fontFace: F.sans,
        color: p.current ? C.accent : C.textBody, valign: "middle",
        bold: p.current
      });
      s.addText(p.time, {
        x: L.W - L.mx - 1.2, y, w: 1.2, h: 0.55,
        fontSize: F.size.body, fontFace: F.sans, color: C.textLight, valign: "middle", align: "center"
      });
    });
  }

  // ============================================================
  // SLIDE 4: AI TOOL MAP — 3 CATEGORIES
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "AIツール全体マップ 2026年4月版", pres);
    addFooter(s, 4, T, pres);

    // Category 1: Chat AI
    const catY1 = 1.05;
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: catY1, w: 1.8, h: 0.3,
      fill: { color: C.accent }, rectRadius: 0.05
    });
    s.addText("チャットAI", {
      x: L.mx, y: catY1, w: 1.8, h: 0.3,
      fontSize: F.size.label, fontFace: F.sans, bold: true, color: C.white, align: "center", valign: "middle"
    });

    const chatTools = [
      { name: "ChatGPT Plus", price: "$20/月", note: "GPT-5.2, Agent Mode" },
      { name: "Claude Pro", price: "$20/月", note: "Opus 4.6, 100万トークン" },
      { name: "Google AI Pro", price: "$19.99/月", note: "Gemini 3 Pro, Veo3" },
      { name: "Perplexity Pro", price: "$20/月", note: "出典付き, モデル切替" },
    ];

    chatTools.forEach((t, i) => {
      const y = catY1 + 0.35 + i * 0.28;
      const bg = i % 2 === 0 ? C.offWhite : C.white;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.26,
        fill: { color: bg }
      });
      s.addText(t.name, {
        x: L.mx + 0.1, y, w: 2.2, h: 0.26,
        fontSize: F.size.caption, fontFace: F.sans, bold: true, color: C.textDark, valign: "middle"
      });
      s.addText(t.price, {
        x: L.mx + 2.4, y, w: 1.3, h: 0.26,
        fontSize: F.size.caption, fontFace: F.sans, color: C.accent, valign: "middle", bold: true
      });
      s.addText(t.note, {
        x: L.mx + 3.8, y, w: 4.5, h: 0.26,
        fontSize: F.size.caption, fontFace: F.sans, color: C.textBody, valign: "middle"
      });
    });

    // Category 2: Agent
    const catY2 = 2.55;
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: catY2, w: 1.8, h: 0.3,
      fill: { color: C.amber }, rectRadius: 0.05
    });
    s.addText("エージェント", {
      x: L.mx, y: catY2, w: 1.8, h: 0.3,
      fontSize: F.size.label, fontFace: F.sans, bold: true, color: C.white, align: "center", valign: "middle"
    });

    const agentY = catY2 + 0.35;
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: agentY, w: L.W - L.mx * 2, h: 0.26,
      fill: { color: C.offWhite }
    });
    s.addText("Genspark Plus", {
      x: L.mx + 0.1, y: agentY, w: 2.2, h: 0.26,
      fontSize: F.size.caption, fontFace: F.sans, bold: true, color: C.textDark, valign: "middle"
    });
    s.addText("$24.99/月", {
      x: L.mx + 2.4, y: agentY, w: 1.3, h: 0.26,
      fontSize: F.size.caption, fontFace: F.sans, color: C.amber, valign: "middle", bold: true
    });
    s.addText("50+モデル, AI Slides/Sites  (Trustpilot 1.7/5 注意)", {
      x: L.mx + 3.8, y: agentY, w: 4.5, h: 0.26,
      fontSize: F.size.caption, fontFace: F.sans, color: C.textBody, valign: "middle"
    });

    // Category 3: Creative
    const catY3 = 3.35;
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: catY3, w: 1.8, h: 0.3,
      fill: { color: C.purple }, rectRadius: 0.05
    });
    s.addText("クリエイティブ", {
      x: L.mx, y: catY3, w: 1.8, h: 0.3,
      fontSize: F.size.label, fontFace: F.sans, bold: true, color: C.white, align: "center", valign: "middle"
    });

    const creativeTools = [
      { name: "Midjourney", price: "$10〜60/月", note: "V7画像生成, 無料枠なし" },
      { name: "Veo3", price: "AI Pro内", note: "動画生成, 1日3本まで" },
      { name: "HeyGen Creator", price: "$29/月", note: "Avatar IV, 175言語" },
      { name: "ElevenLabs", price: "無料〜$11", note: "音声合成, 無料10k文字/月" },
    ];

    creativeTools.forEach((t, i) => {
      const y = catY3 + 0.35 + i * 0.28;
      const bg = i % 2 === 0 ? C.offWhite : C.white;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.26,
        fill: { color: bg }
      });
      s.addText(t.name, {
        x: L.mx + 0.1, y, w: 2.2, h: 0.26,
        fontSize: F.size.caption, fontFace: F.sans, bold: true, color: C.textDark, valign: "middle"
      });
      s.addText(t.price, {
        x: L.mx + 2.4, y, w: 1.3, h: 0.26,
        fontSize: F.size.caption, fontFace: F.sans, color: C.purple, valign: "middle", bold: true
      });
      s.addText(t.note, {
        x: L.mx + 3.8, y, w: 4.5, h: 0.26,
        fontSize: F.size.caption, fontFace: F.sans, color: C.textBody, valign: "middle"
      });
    });
  }

  // ============================================================
  // SLIDE 5: CHAT AI 4-TOOL COMPARISON TABLE
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "チャットAI 4ツール徹底比較", pres);
    addFooter(s, 5, T, pres);

    const colW = [1.4, 1.85, 1.85, 1.85, 1.55];
    const totalW = colW.reduce((a, b) => a + b, 0);
    const startX = (L.W - totalW) / 2;
    const colX = [];
    let cx = startX;
    colW.forEach(w => { colX.push(cx); cx += w; });

    // Header row
    const hdrY = 1.0;
    s.addShape(pres.shapes.RECTANGLE, {
      x: startX, y: hdrY, w: totalW, h: 0.35,
      fill: { color: C.navy }, rectRadius: 0.04
    });
    ["項目", "ChatGPT", "Claude", "Gemini", "Perplexity"].forEach((t, i) => {
      s.addText(t, {
        x: colX[i] + 0.05, y: hdrY, w: colW[i] - 0.1, h: 0.35,
        fontSize: F.size.caption, fontFace: F.sans, bold: true, color: C.white, valign: "middle", align: "center"
      });
    });

    const rows = [
      ["月額", "$20", "$20\n(年$17)", "$19.99", "$20"],
      ["モデル", "GPT-5.2\nThinking", "Opus 4.6\nSonnet 4.6", "Gemini 3\nPro", "GPT-4o\nClaude 3.5"],
      ["コンテキスト", "—", "100万\nトークン", "100万\nトークン", "—"],
      ["得意分野", "汎用\nGPTs", "文書・分析\nコード", "Google統合\nVeo3", "出典付き\nリサーチ"],
      ["独自機能", "Deep Research\nSora, Agent", "Claude Code\n年払い割引", "初月無料\nWorkspace", "無制限Search\nモデル切替"],
    ];

    rows.forEach((row, ri) => {
      const y = hdrY + 0.38 + ri * 0.6;
      const bg = ri % 2 === 0 ? C.offWhite : C.white;
      s.addShape(pres.shapes.RECTANGLE, {
        x: startX, y, w: totalW, h: 0.56,
        fill: { color: bg }
      });
      row.forEach((cell, ci) => {
        s.addText(cell, {
          x: colX[ci] + 0.05, y, w: colW[ci] - 0.1, h: 0.56,
          fontSize: 9, fontFace: F.sans,
          color: ci === 0 ? C.accent : C.textBody,
          bold: ci === 0,
          valign: "middle", align: "center"
        });
      });
    });
  }

  // ============================================================
  // SLIDE 6: KEY TAKEAWAY PER TOOL
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "各ツールの「これだけは覚えろ」", pres);
    addFooter(s, 6, T, pres);

    const items = [
      { name: "ChatGPT", keyword: "GPTs + Agent Mode", desc: "カスタムAIアプリ＆\n自律タスク実行", color: C.green },
      { name: "Claude", keyword: "100万トークン + 文書力", desc: "長文一括処理＆\n高品質ライティング", color: C.accent },
      { name: "Gemini", keyword: "Google統合 + Veo3", desc: "Workspace連携＆\n動画生成", color: C.amber },
      { name: "Perplexity", keyword: "出典付きリサーチ", desc: "信頼性の高い\n情報収集", color: C.purple },
    ];

    items.forEach((item, i) => {
      const x = L.mx + i * 2.15;
      addCard(s, pres, x, 1.1, 1.95, 3.2, { fill: C.white, borderTop: item.color });

      s.addText(item.name, {
        x: x + 0.1, y: 1.3, w: 1.75, h: 0.4,
        fontSize: F.size.h3, fontFace: F.sans, bold: true, color: C.textDark, align: "center"
      });

      // Keyword badge
      s.addShape(pres.shapes.RECTANGLE, {
        x: x + 0.15, y: 1.8, w: 1.65, h: 0.5,
        fill: { color: item.color }, rectRadius: 0.06
      });
      s.addText(item.keyword, {
        x: x + 0.15, y: 1.8, w: 1.65, h: 0.5,
        fontSize: 9, fontFace: F.sans, bold: true, color: C.white, align: "center", valign: "middle"
      });

      s.addText(item.desc, {
        x: x + 0.1, y: 2.5, w: 1.75, h: 1.0,
        fontSize: F.size.label, fontFace: F.sans, color: C.textBody, align: "center"
      });
    });

    addCard(s, pres, L.mx, 4.5, L.W - L.mx * 2, 0.45, { fill: C.accentLight });
    s.addText("キーワード1つで各ツールの強みを即答できる", {
      x: L.mx, y: 4.5, w: L.W - L.mx * 2, h: 0.45,
      fontSize: F.size.body, fontFace: F.sans, bold: true, color: C.accent, align: "center", valign: "middle"
    });
  }

  // ============================================================
  // SLIDE 7: CREATIVE TOOLS COMPARISON
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "クリエイティブツール比較", pres);
    addFooter(s, 7, T, pres);

    const colW = [1.6, 2.8, 2.0, 1.2];
    const totalW = colW.reduce((a, b) => a + b, 0);
    const startX = (L.W - totalW) / 2;
    const colX = [];
    let cx2 = startX;
    colW.forEach(w => { colX.push(cx2); cx2 += w; });

    // Header
    const hdrY = 1.05;
    s.addShape(pres.shapes.RECTANGLE, {
      x: startX, y: hdrY, w: totalW, h: 0.35,
      fill: { color: C.navy }, rectRadius: 0.04
    });
    ["ツール", "用途・特徴", "月額", "無料枠"].forEach((t, i) => {
      s.addText(t, {
        x: colX[i] + 0.08, y: hdrY, w: colW[i] - 0.16, h: 0.35,
        fontSize: F.size.caption, fontFace: F.sans, bold: true, color: C.white, valign: "middle"
      });
    });

    const tools = [
      { name: "Midjourney", desc: "V7画像生成\nパーソナライゼーション", price: "Basic $10\nStd $30\nPro $60", free: "なし" },
      { name: "Veo3", desc: "Google AI動画生成\n(AI Pro内で利用)", price: "$19.99\n(AI Pro)", free: "1日3本" },
      { name: "HeyGen", desc: "Avatar IV アバター動画\n175言語, Video Agent 2.0", price: "Creator\n$29/月", free: "なし" },
      { name: "ElevenLabs", desc: "音声合成・ボイスクローン\n高品質ナレーション", price: "Starter $5\nCreator $11", free: "10k文字\n/月" },
    ];

    tools.forEach((t, i) => {
      const y = hdrY + 0.4 + i * 0.8;
      const bg = i % 2 === 0 ? C.offWhite : C.white;
      s.addShape(pres.shapes.RECTANGLE, {
        x: startX, y, w: totalW, h: 0.75,
        fill: { color: bg }
      });
      s.addText(t.name, {
        x: colX[0] + 0.08, y, w: colW[0] - 0.16, h: 0.75,
        fontSize: F.size.label, fontFace: F.sans, bold: true, color: C.textDark, valign: "middle"
      });
      s.addText(t.desc, {
        x: colX[1] + 0.08, y, w: colW[1] - 0.16, h: 0.75,
        fontSize: 10, fontFace: F.sans, color: C.textBody, valign: "middle"
      });
      s.addText(t.price, {
        x: colX[2] + 0.08, y, w: colW[2] - 0.16, h: 0.75,
        fontSize: 10, fontFace: F.sans, color: C.accent, valign: "middle", align: "center", bold: true
      });
      s.addText(t.free, {
        x: colX[3] + 0.08, y, w: colW[3] - 0.16, h: 0.75,
        fontSize: 10, fontFace: F.sans,
        color: t.free === "なし" ? C.red : C.green,
        valign: "middle", align: "center", bold: true
      });
    });
  }

  // ============================================================
  // SLIDE 8: FLOWCHART
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "ツール選定フローチャート", pres);
    addFooter(s, 8, T, pres);

    // Central question
    s.addShape(pres.shapes.OVAL, {
      x: 3.5, y: 1.0, w: 3, h: 0.55,
      fill: { color: C.navy }
    });
    s.addText("何をしたい？", {
      x: 3.5, y: 1.0, w: 3, h: 0.55,
      fontSize: F.size.h3, fontFace: F.sans, bold: true, color: C.white, align: "center", valign: "middle"
    });

    const flows = [
      { need: "調べ物・リサーチ", tool: "Perplexity", color: C.purple },
      { need: "文書作成・分析", tool: "Claude", color: C.accent },
      { need: "画像生成", tool: "Midjourney", color: C.green },
      { need: "動画（短尺）", tool: "Veo3", color: C.amber },
      { need: "動画（アバター）", tool: "HeyGen", color: C.amber },
      { need: "Google連携", tool: "Gemini", color: C.navyLight },
      { need: "ナレーション", tool: "ElevenLabs", color: C.green },
      { need: "迷ったら", tool: "ChatGPT", color: C.red },
    ];

    flows.forEach((f, i) => {
      const y = 1.75 + i * 0.38;

      // Need box
      s.addShape(pres.shapes.RECTANGLE, {
        x: 1.2, y, w: 2.4, h: 0.32,
        fill: { color: C.lightGray }, rectRadius: 0.05
      });
      s.addText(f.need, {
        x: 1.2, y, w: 2.4, h: 0.32,
        fontSize: F.size.caption, fontFace: F.sans, color: C.textDark, align: "center", valign: "middle"
      });

      // Arrow
      s.addText("\u2192", {
        x: 3.7, y, w: 0.5, h: 0.32,
        fontSize: F.size.body, fontFace: F.sans, color: C.textMuted, align: "center", valign: "middle"
      });

      // Tool box
      s.addShape(pres.shapes.RECTANGLE, {
        x: 4.3, y, w: 2.3, h: 0.32,
        fill: { color: f.color }, rectRadius: 0.05
      });
      s.addText(f.tool, {
        x: 4.3, y, w: 2.3, h: 0.32,
        fontSize: F.size.caption, fontFace: F.sans, bold: true, color: C.white, align: "center", valign: "middle"
      });
    });

    // Right side tip
    addCard(s, pres, 7.2, 1.75, 2.3, 3.0, { fill: C.accentLight, borderTop: C.accent });
    s.addText("TIP", {
      x: 7.2, y: 1.95, w: 2.3, h: 0.3,
      fontSize: F.size.label, fontFace: F.sans, bold: true, color: C.accent, align: "center"
    });
    s.addText("このチャートを\nスマホに保存\nしておくと\n迷わない！", {
      x: 7.3, y: 2.4, w: 2.1, h: 2.0,
      fontSize: F.size.label, fontFace: F.sans, color: C.textBody, align: "center"
    });
  }

  // ============================================================
  // SLIDE 9: TOP 3 STARTER SET
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "迷ったらこの3つ", pres);
    addFooter(s, 9, T, pres);

    const trio = [
      { name: "ChatGPT Plus", price: "$20/月", desc: "万能オールラウンダー\nGPTs＋Agent Mode", color: C.green },
      { name: "Perplexity Pro", price: "$20/月", desc: "出典付きリサーチ\n無制限Pro Search", color: C.purple },
      { name: "Claude Pro", price: "$20/月", desc: "文書・分析の最高峰\n100万トークン", color: C.accent },
    ];

    trio.forEach((t, i) => {
      const x = L.mx + 0.15 + i * 2.85;
      addCard(s, pres, x, 1.1, 2.55, 2.5, { fill: C.white, borderTop: t.color });

      addNumberCircle(s, pres, x + 1.1, 1.25, i + 1, t.color);

      s.addText(t.name, {
        x: x + 0.1, y: 1.7, w: 2.35, h: 0.4,
        fontSize: F.size.h3, fontFace: F.sans, bold: true, color: C.textDark, align: "center"
      });

      s.addText(t.price, {
        x: x + 0.1, y: 2.1, w: 2.35, h: 0.3,
        fontSize: F.size.body, fontFace: F.sans, bold: true, color: t.color, align: "center"
      });

      s.addText(t.desc, {
        x: x + 0.1, y: 2.45, w: 2.35, h: 0.8,
        fontSize: F.size.label, fontFace: F.sans, color: C.textBody, align: "center"
      });
    });

    // Plus signs
    s.addText("+", {
      x: L.mx + 2.85, y: 1.9, w: 0.45, h: 0.5,
      fontSize: 28, fontFace: F.sans, bold: true, color: C.accent, align: "center", valign: "middle"
    });
    s.addText("+", {
      x: L.mx + 5.7, y: 1.9, w: 0.45, h: 0.5,
      fontSize: 28, fontFace: F.sans, bold: true, color: C.accent, align: "center", valign: "middle"
    });

    // Bottom banner
    addCard(s, pres, L.mx, 3.8, L.W - L.mx * 2, 0.85, { fill: C.greenBg, borderTop: C.green });
    s.addText("= 月$60（約9,000円）で業務の80%をカバー", {
      x: L.mx, y: 3.85, w: L.W - L.mx * 2, h: 0.35,
      fontSize: F.size.h3, fontFace: F.sans, bold: true, color: C.green, align: "center"
    });
    s.addText("日本の中小企業AI導入率はまだ10%未満 → 今始めれば先行者優位", {
      x: L.mx, y: 4.2, w: L.W - L.mx * 2, h: 0.3,
      fontSize: F.size.label, fontFace: F.sans, color: C.textBody, align: "center"
    });
  }

  // ============================================================
  // SLIDE 10: ROI REALITY
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "ROIの現実 — 数字で見るAI効果", pres);
    addFooter(s, 10, T, pres);

    // Left: Positive data
    addCard(s, pres, L.mx, 1.1, 4.0, 2.2, { fill: C.white, borderTop: C.green });
    s.addText("ポジティブデータ", {
      x: L.mx + 0.15, y: 1.2, w: 3.7, h: 0.3,
      fontSize: F.size.label, fontFace: F.sans, bold: true, color: C.green
    });

    const positives = [
      "週5〜7時間節約（マネージャー7〜10時間）",
      "78%の組織がAI導入済み（前年55%から急増）",
      "66%の組織が生産性向上を報告",
      "成功率: テクノロジー88% / 金融83% / 製造75%",
    ];
    positives.forEach((p, i) => {
      s.addShape(pres.shapes.OVAL, {
        x: L.mx + 0.2, y: 1.62 + i * 0.38, w: 0.12, h: 0.12, fill: { color: C.green }
      });
      s.addText(p, {
        x: L.mx + 0.45, y: 1.55 + i * 0.38, w: 3.4, h: 0.3,
        fontSize: 10, fontFace: F.sans, color: C.textBody, valign: "middle"
      });
    });

    // Right: Warning
    addCard(s, pres, L.mx + 4.25, 1.1, 4.25, 2.2, { fill: C.white, borderTop: C.red });
    s.addText("注意点", {
      x: L.mx + 4.4, y: 1.2, w: 4.0, h: 0.3,
      fontSize: F.size.label, fontFace: F.sans, bold: true, color: C.red
    });

    s.addText("40%の時間節約が\nやり直しで失われている", {
      x: L.mx + 4.4, y: 1.6, w: 3.9, h: 0.6,
      fontSize: F.size.body, fontFace: F.sans, bold: true, color: C.red, valign: "middle"
    });

    s.addText("→ 正しいプロンプト設計と\n   検証プロセスが不可欠", {
      x: L.mx + 4.4, y: 2.25, w: 3.9, h: 0.6,
      fontSize: F.size.label, fontFace: F.sans, color: C.textBody, valign: "middle"
    });

    // Bottom: Japan cases
    addCard(s, pres, L.mx, 3.55, L.W - L.mx * 2, 1.2, { fill: C.white, borderTop: C.accent });
    s.addText("日本の成功事例", {
      x: L.mx + 0.15, y: 3.65, w: 8.0, h: 0.3,
      fontSize: F.size.label, fontFace: F.sans, bold: true, color: C.accent
    });

    const cases = [
      { co: "カオナビ", result: "AIチャットボットで顧客115%増、対応時間20分短縮" },
      { co: "旭鉄工", result: "生成AIで生産効率1.5倍以上に向上" },
      { co: "ゑびや(飲食)", result: "AI需要予測で的中率95%超、食品廃棄を大幅削減" },
    ];
    cases.forEach((c, i) => {
      s.addText(c.co, {
        x: L.mx + 0.2, y: 4.0 + i * 0.25, w: 1.5, h: 0.22,
        fontSize: 10, fontFace: F.sans, bold: true, color: C.textDark, valign: "middle"
      });
      s.addText(c.result, {
        x: L.mx + 1.8, y: 4.0 + i * 0.25, w: 6.5, h: 0.22,
        fontSize: 10, fontFace: F.sans, color: C.textBody, valign: "middle"
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
    addSectionTitle(s, "まとめ", pres);
    addFooter(s, 11, T, pres);

    const points = [
      "AIツールは3カテゴリ（チャットAI・エージェント・クリエイティブ）で整理",
      "各ツールの「これだけは覚えろ」キーワードを押さえる",
      "迷ったらChatGPT＋Perplexity＋Claude（月$60で80%カバー）",
      "ROIは実在するが、40%やり直しリスクを防ぐ使い方が鍵",
    ];

    points.forEach((p, i) => {
      const y = 1.15 + i * 0.85;
      addCard(s, pres, L.mx, y, L.W - L.mx * 2, 0.7, { borderTop: C.accent });
      addNumberCircle(s, pres, L.mx + 0.15, y + 0.18, i + 1);
      s.addText(p, {
        x: L.mx + 0.65, y: y + 0.1, w: 7.5, h: 0.5,
        fontSize: F.size.body, fontFace: F.sans, color: C.textBody
      });
    });

    addCard(s, pres, L.mx, 4.6, L.W - L.mx * 2, 0.45, { fill: C.accentLight });
    s.addText("次のパート: P-02 コストシミュレーション \u2192", {
      x: L.mx, y: 4.6, w: L.W - L.mx * 2, h: 0.45,
      fontSize: F.size.label, fontFace: F.sans, bold: true, color: C.accent, align: "center", valign: "middle"
    });
  }

  // ============================================================
  // SLIDE 12: CTA (navy)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };

    s.addText("確認テストに進みましょう", {
      x: 0.5, y: 1.5, w: 9, h: 1.0,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center"
    });

    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 2.7, w: 3, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });

    s.addText("5問  |  80%（4問以上正解）で合格", {
      x: 0.5, y: 3.0, w: 9, h: 0.5,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center"
    });

    s.addText("P-01  |  全ツール総整理＋選定フローチャート  |  完了", {
      x: 0.5, y: 4.2, w: 9, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textMuted, align: "center"
    });
  }

  // ============================================================
  // SAVE
  // ============================================================
  await pres.writeFile({ fileName: "スライド.pptx" });
  console.log("OK: スライド.pptx generated (12 slides)");
}

main().catch(err => { console.error(err); process.exit(1); });
