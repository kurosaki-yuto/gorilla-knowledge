const pptxgen = require("pptxgenjs");

// =====================================================
// DESIGN SYSTEM
// =====================================================
const C = {
  white: "FFFFFF", offWhite: "FAFBFC", lightGray: "F3F4F6",
  navy: "1B2A4A", navyLight: "2D4A7A",
  accent: "2563EB", accentLight: "DBEAFE", accentMid: "93C5FD",
  textDark: "111827", textBody: "374151", textLight: "6B7280", textMuted: "9CA3AF",
  green: "059669", greenBg: "D1FAE5", amber: "D97706", amberBg: "FEF3C7",
  red: "DC2626", redBg: "FEE2E2", border: "E5E7EB"
};

const F = { sans: "Calibri", size: { hero: 40, h1: 24, h2: 20, h3: 16, body: 14, label: 12, caption: 10 } };
const L = { W: 10, H: 5.625, mx: 0.75, my: 0.5, gap: 0.3 };

let pres;
const T = 12;

function addTopBar(slide) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: L.W, h: 0.035, fill: { color: C.accent }
  });
}

function addFooter(slide, num) {
  slide.addShape(pres.shapes.LINE, {
    x: L.mx, y: L.H - 0.4, w: L.W - L.mx * 2, h: 0,
    line: { color: C.border, width: 0.5 }
  });
  slide.addText(`${num} / ${T}`, {
    x: L.W - 1.5, y: L.H - 0.38, w: 1.2, h: 0.3,
    fontSize: F.size.caption, fontFace: F.sans,
    color: C.textMuted, align: "right", shrinkText: true
  });
  slide.addText("P-01", {
    x: L.mx, y: L.H - 0.38, w: 2, h: 0.3,
    fontSize: F.size.caption, fontFace: F.sans,
    color: C.textMuted, align: "left", shrinkText: true
  });
}

function addTitle(slide, title, tag) {
  if (tag) {
    const tagW = tag.length * 0.12 + 0.4;
    slide.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.15, w: tagW, h: 0.28,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    slide.addText(tag, {
      x: L.mx, y: 0.15, w: tagW, h: 0.28,
      fontSize: F.size.caption, fontFace: F.sans, bold: true,
      color: C.accent, align: "center", valign: "middle", shrinkText: true
    });
  }
  slide.addText(title, {
    x: L.mx, y: tag ? 0.5 : 0.15, w: 8.5, h: 0.45,
    fontSize: F.size.h1, fontFace: F.sans, bold: true,
    color: C.textDark, shrinkText: true
  });
}

function addCards(slide, cards, y, cardW, cardH) {
  const cardGap = 0.3;
  const totalW = cardW * cards.length + cardGap * (cards.length - 1);
  const startX = (L.W - totalW) / 2;
  cards.forEach((c, i) => {
    const x = startX + i * (cardW + cardGap);
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y, w: cardW, h: cardH,
      fill: { color: c.bg || C.offWhite }, line: { color: c.borderColor || C.border, width: c.borderColor ? 1 : 0.5 }, rectRadius: 0.05
    });
    slide.addText(c.label, {
      x, y: y + 0.25, w: cardW, h: 0.35,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: c.color || C.textDark, align: "center", shrinkText: true
    });
    slide.addText(c.desc, {
      x: x + 0.15, y: y + 0.65, w: cardW - 0.3, h: cardH - 0.85,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textBody, align: "center", lineSpacingMultiple: 1.3, shrinkText: true
    });
  });
}

function addInsight(slide, text, y) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x: L.mx, y, w: L.W - L.mx * 2, h: 0.4,
    fill: { color: C.accentLight }, rectRadius: 0.04
  });
  slide.addText(text, {
    x: L.mx + 0.15, y, w: L.W - L.mx * 2 - 0.3, h: 0.4,
    fontSize: F.size.label, fontFace: F.sans, italic: true,
    color: C.textLight, valign: "middle", shrinkText: true
  });
}

async function main() {
  pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "Gorilla Knowledge";
  pres.title = "P-01: Gemini Enterprise とは？ -- 企業向けAIの最新トレンド";

  // ========== SLIDE 1: TITLE (Navy) ==========
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };
    s.addText("Gemini Enterprise とは？", {
      x: 0.5, y: 1.5, w: 9, h: 0.8,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center", shrinkText: true
    });
    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 2.45, w: 3, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });
    s.addText("企業向けAIの最新トレンド", {
      x: 0.5, y: 2.65, w: 9, h: 0.45,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", shrinkText: true
    });
    s.addText("P-01  |  全社員向け  |  12分", {
      x: 0.5, y: 3.8, w: 9, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textMuted, align: "center", shrinkText: true
    });
  }

  // ========== SLIDE 2: GOALS ==========
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "今日のゴール");
    addFooter(s, 2);

    const goals = [
      "Gemini Enterprise が従来のAIツールと何が違うかを説明できる",
      "Google Workspace 統合によるビジネス価値を理解する",
      "実企業での導入効果（年200時間削減など）を具体的に説明できる",
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

  // ========== SLIDE 3: AI COMPETITION ==========
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "生成AI競争の激化（2022-2026）", "BACKGROUND");
    addFooter(s, 3);

    addCards(s, [
      { label: "ChatGPT", desc: "OpenAI\n最も普及している\n汎用AI", color: C.textDark, bg: C.lightGray, borderColor: null },
      { label: "Claude", desc: "Anthropic\nセキュリティ重視\n長文処理に強い", color: C.textDark, bg: C.lightGray, borderColor: null },
      { label: "Gemini", desc: "Google\nWorkspace統合\nセキュリティ完備", color: C.accent, bg: C.accentLight, borderColor: C.accent },
    ], 1.0, 2.5, 2.0);

    addInsight(s, "企業が求めるのはもはや『高性能』だけではなく『統合』『セキュリティ』『カスタマイズ性』", 3.5);
  }

  // ========== SLIDE 4: WORKSPACE INTEGRATION ==========
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "Google Workspace との統合が強み", "KEY POINT");
    addFooter(s, 4);

    // 左: 従来のツール
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 1.0, w: 4.0, h: 2.5,
      fill: { color: C.redBg }, line: { color: C.red, width: 1 }, rectRadius: 0.05
    });
    s.addText("従来のAI（ChatGPT等）", {
      x: L.mx, y: 1.15, w: 4.0, h: 0.35,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.red, align: "center", shrinkText: true
    });
    s.addText("独立したツール\n\nデータをコピペで\n移動させる必要あり\n業務が煩雑", {
      x: L.mx + 0.2, y: 1.6, w: 3.6, h: 1.6,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textBody, align: "center", lineSpacingMultiple: 1.4, shrinkText: true
    });

    // 右: Gemini Enterprise
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.W - L.mx - 4.0, y: 1.0, w: 4.0, h: 2.5,
      fill: { color: C.accentLight }, line: { color: C.accent, width: 1 }, rectRadius: 0.05
    });
    s.addText("Gemini Enterprise", {
      x: L.W - L.mx - 4.0, y: 1.15, w: 4.0, h: 0.35,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.accent, align: "center", shrinkText: true
    });
    s.addText("Gmail・Drive・Docsに直接統合\n\nAIがそのまま\nメール・ドキュメント内で\n動作する", {
      x: L.W - L.mx - 3.8, y: 1.6, w: 3.6, h: 1.6,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textBody, align: "center", lineSpacingMultiple: 1.4, shrinkText: true
    });

    // Arrow
    s.addText("→", {
      x: 4.5, y: 1.8, w: 1.0, h: 0.6,
      fontSize: F.size.h1, fontFace: F.sans, bold: true,
      color: C.accent, align: "center", valign: "middle", shrinkText: true
    });

    addInsight(s, "統合度が高いほど業務効率化の効果も大きい", 3.8);
  }

  // ========== SLIDE 5: WORKSPACE FEATURES ==========
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "Google Workspace 統合機能", "FEATURES");
    addFooter(s, 5);

    const features = [
      { label: "Gmail", desc: "メール返信案の自動生成・分類・優先度付け" },
      { label: "ドキュメント", desc: "文書作成支援・文法チェック・スタイル提案" },
      { label: "スプレッドシート", desc: "データ分析・グラフ生成・計算式作成" },
      { label: "Meet・カレンダー", desc: "文字起こし・議事録生成・スケジュール最適化" },
    ];
    features.forEach((f, i) => {
      const y = 0.95 + i * 1.0;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.8,
        fill: { color: C.offWhite }, line: { color: C.border, width: 0.5 }, rectRadius: 0.05
      });
      s.addText(f.label, {
        x: L.mx + 0.3, y: y + 0.08, w: 2, h: 0.3,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.accent, shrinkText: true
      });
      s.addText(f.desc, {
        x: L.mx + 2.5, y: y + 0.12, w: 6.2, h: 0.5,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, valign: "middle", shrinkText: true
      });
    });
  }

  // ========== SLIDE 6: 2026 LATEST FEATURES ==========
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "2026年最新機能", "LATEST");
    addFooter(s, 6);

    addCards(s, [
      { label: "画像生成", desc: "プレゼン資料の図表・マーケティング素材\n自動生成", color: C.accent, bg: C.accentLight, borderColor: C.accent },
      { label: "動画生成", desc: "テキストから短編動画\n自動作成機能", color: C.green, bg: C.greenBg, borderColor: C.green },
      { label: "Deep Research", desc: "テーマについて\n深掘り調査・レポート化", color: C.amber, bg: C.amberBg, borderColor: C.amber },
    ], 1.0, 2.5, 2.2);

    addInsight(s, "これらが Workspace に統合され、資料作成からプレゼンまで AI が一気通貫サポート", 3.8);
  }

  // ========== SLIDE 7: ENTERPRISE BENEFITS ==========
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "企業導入のメリット", "BENEFITS");
    addFooter(s, 7);

    const benefits = [
      { label: "年200時間削減", desc: "1名あたり平均値\n月16時間、日当たり30分の効率化" },
      { label: "資料作成70-80%削減", desc: "提案書・分析レポート\nの作成時間が大幅短縮" },
      { label: "メール対応60-70%削減", desc: "返信ドラフト自動生成\n優先度付けで処理効率化" },
    ];
    benefits.forEach((b, i) => {
      const y = 0.95 + i * 1.3;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 1.05,
        fill: { color: C.greenBg }, line: { color: C.green, width: 1 }, rectRadius: 0.05
      });
      s.addText(b.label, {
        x: L.mx + 0.3, y: y + 0.08, w: 3, h: 0.3,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.green, shrinkText: true
      });
      s.addText(b.desc, {
        x: L.mx + 0.3, y: y + 0.42, w: 8.4, h: 0.5,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, lineSpacingMultiple: 1.2, shrinkText: true
      });
    });
  }

  // ========== SLIDE 8: CASE STUDIES ==========
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "実企業の導入事例", "CASE STUDIES");
    addFooter(s, 8);

    const cases = [
      { label: "J:COM", metrics: "月1,500時間削減" },
      { label: "note", metrics: "月3～4時間削減（1名）" },
      { label: "日本特殊陶業", metrics: "週3.1時間削減" },
    ];
    cases.forEach((c, i) => {
      const y = 1.0 + i * 1.25;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 1.0,
        fill: { color: C.offWhite }, line: { color: C.border, width: 0.5 }, rectRadius: 0.05
      });
      s.addText(c.label, {
        x: L.mx + 0.3, y: y + 0.15, w: 2, h: 0.3,
        fontSize: F.size.h2, fontFace: F.sans, bold: true,
        color: C.textDark, shrinkText: true
      });
      s.addText(c.metrics, {
        x: L.mx + 2.5, y: y + 0.2, w: 6, h: 0.5,
        fontSize: F.size.h3, fontFace: F.sans,
        color: C.accent, bold: true, valign: "middle", shrinkText: true
      });
    });

    addInsight(s, "業種・規模を問わず、全社で確実な業務削減を実現", 3.9);
  }

  // ========== SLIDE 9: SECURITY & COMPLIANCE ==========
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "セキュリティ・コンプライアンス対応", "SECURITY");
    addFooter(s, 9);

    addCards(s, [
      { label: "HIPAA・FedRAMP", desc: "医療・政府機関\nレベルのセキュリティ", color: C.green, bg: C.greenBg, borderColor: C.green },
      { label: "ISO 27001", desc: "情報セキュリティ\n国際標準に完全対応", color: C.green, bg: C.greenBg, borderColor: C.green },
      { label: "CMEK・DLP", desc: "暗号化キー管理\nデータ損失防止機能", color: C.green, bg: C.greenBg, borderColor: C.green },
    ], 1.0, 2.5, 2.0);

    addInsight(s, "金融・医療・公共セクターでも安心して導入できるセキュリティレベル", 3.5);
  }

  // ========== SLIDE 10: COMPARISON TABLE ==========
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "ChatGPT vs Gemini vs Claude 比較", "COMPARISON");
    addFooter(s, 10);

    const headers = ["", "ChatGPT", "Gemini", "Claude"];
    const rows = [
      ["Workspace統合", "✗", "✓", "✗"],
      ["セキュリティ機能", "基本的", "フル", "充実"],
      ["企業導入向け", "△", "✓", "△"],
      ["既存ツール連携", "△", "✓", "✗"],
      ["データ地域対応", "△", "✓", "△"],
    ];

    const colW = [2.0, 2.0, 2.0, 2.0];
    const startX = (L.W - colW.reduce((a, b) => a + b, 0)) / 2;
    const rowH = 0.45;
    const startY = 1.0;

    let cx = startX;
    headers.forEach((h, i) => {
      s.addShape(pres.shapes.RECTANGLE, {
        x: cx, y: startY, w: colW[i], h: rowH,
        fill: { color: C.lightGray }, line: { color: C.border, width: 0.5 }
      });
      s.addText(h, {
        x: cx, y: startY, w: colW[i], h: rowH,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: i === 2 ? C.accent : C.textDark, align: "center", valign: "middle", shrinkText: true
      });
      cx += colW[i];
    });

    rows.forEach((row, ri) => {
      cx = startX;
      const y = startY + rowH + ri * rowH;
      row.forEach((cell, ci) => {
        s.addShape(pres.shapes.RECTANGLE, {
          x: cx, y, w: colW[ci], h: rowH,
          fill: { color: C.white }, line: { color: C.border, width: 0.5 }
        });
        s.addText(cell, {
          x: cx + 0.1, y, w: colW[ci] - 0.2, h: rowH,
          fontSize: F.size.body, fontFace: F.sans,
          bold: ci === 0,
          color: ci === 0 ? C.textDark : C.textBody,
          align: ci === 0 ? "left" : "center", valign: "middle", shrinkText: true
        });
        cx += colW[ci];
      });
    });

    addInsight(s, "Workspace ユーザーなら、Gemini の統合度は圧倒的に有利", 3.9);
  }

  // ========== SLIDE 11: SUMMARY (Navy) ==========
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };

    s.addText("まとめ", {
      x: 0.5, y: 0.5, w: 9, h: 0.6,
      fontSize: F.size.h1, fontFace: F.sans, bold: true,
      color: C.white, align: "center", shrinkText: true
    });

    const summaries = [
      "Gemini は Workspace 統合により、AI の価値を最大限引き出せる",
      "実企業で年200時間の削減を実現。ROI は圧倒的",
      "HIPAA・FedRAMP 対応で、金融・医療でも安全に使える",
    ];
    summaries.forEach((text, i) => {
      const y = 1.5 + i * 1.0;
      s.addText(String(i + 1), {
        x: 2.5, y, w: 0.5, h: 0.5,
        fontSize: F.size.h2, fontFace: F.sans, bold: true,
        color: C.navy, align: "center", valign: "middle",
        fill: { color: C.accentMid }, shape: pres.shapes.OVAL, shrinkText: true
      });
      s.addText(text, {
        x: 3.2, y, w: 5, h: 0.5,
        fontSize: F.size.h3, fontFace: F.sans,
        color: C.white, valign: "middle", shrinkText: true
      });
    });

    addFooter(s, 11);
    // Override footer for navy
    s.addText("P-01", {
      x: L.mx, y: L.H - 0.38, w: 2, h: 0.3,
      fontSize: F.size.caption, fontFace: F.sans,
      color: C.textMuted, align: "left", shrinkText: true
    });
  }

  // ========== SLIDE 12: END (Navy) ==========
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };
    s.addText("P-01 修了", {
      x: 0.5, y: 1.8, w: 9, h: 0.7,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center", shrinkText: true
    });
    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 2.65, w: 3, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });
    s.addText("企業向けAIの新時代、ここから始めよう", {
      x: 0.5, y: 2.8, w: 9, h: 0.45,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", shrinkText: true
    });
    s.addText("NEXT → P-02 Google Workspace 統合実演", {
      x: 0.5, y: 3.8, w: 9, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textMuted, align: "center", shrinkText: true
    });
  }

  // ========== WRITE FILE ==========
  const outPath = __dirname + "/スライド.pptx";
  await pres.writeFile({ fileName: outPath });
  console.log("Created: " + outPath);
}

main().catch(err => { console.error(err); process.exit(1); });
