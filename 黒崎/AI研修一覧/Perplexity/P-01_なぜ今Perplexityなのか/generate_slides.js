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
  pres.title = "P-01: なぜ今Perplexityなのか？ -- AI検索の新時代";

  // ========== SLIDE 1: TITLE (Navy) ==========
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };
    s.addText("なぜ今Perplexityなのか？", {
      x: 0.5, y: 1.5, w: 9, h: 0.8,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center", shrinkText: true
    });
    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 2.45, w: 3, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });
    s.addText("AI検索の新時代", {
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
      "Perplexityが従来の検索と根本的に異なる点を説明できる",
      "AI検索が爆発的に普及している背景を理解する",
      "Perplexityの主要機能（出典付き回答・Spaces・Computer）を挙げられる",
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

  // ========== SLIDE 3: GOOGLING NOT ENOUGH ==========
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "「ググる」だけでは足りない時代", "BACKGROUND");
    addFooter(s, 3);

    addCards(s, [
      { label: "毎日85億件+", desc: "Google検索回数\n情報は増え続けている", color: C.accent, bg: C.accentLight, borderColor: C.accent },
      { label: "SEO汚染", desc: "広告とSEO記事だらけ\n中身の薄いコピー記事", color: C.red, bg: C.redBg, borderColor: C.red },
      { label: "答えが見つからない", desc: "何ページも読み比べ\nやっと結論がわかる", color: C.amber, bg: C.amberBg, borderColor: C.amber },
    ], 1.0, 2.5, 2.0);

    addInsight(s, "情報が増えるほど「本当に欲しい答え」にたどり着くのが難しくなっている", 3.5);
  }

  // ========== SLIDE 4: AI SEARCH ==========
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "AI検索という新しい答え", "NEW APPROACH");
    addFooter(s, 4);

    // 左: Google
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 1.0, w: 4.0, h: 2.5,
      fill: { color: C.redBg }, line: { color: C.red, width: 1 }, rectRadius: 0.05
    });
    s.addText("従来の検索（Google）", {
      x: L.mx, y: 1.15, w: 4.0, h: 0.35,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.red, align: "center", shrinkText: true
    });
    s.addText("「リンクの一覧」を返す\n\n自分で何本も記事を\n読み比べて情報を統合", {
      x: L.mx + 0.2, y: 1.6, w: 3.6, h: 1.6,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textBody, align: "center", lineSpacingMultiple: 1.4, shrinkText: true
    });

    // 右: Perplexity
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.W - L.mx - 4.0, y: 1.0, w: 4.0, h: 2.5,
      fill: { color: C.accentLight }, line: { color: C.accent, width: 1 }, rectRadius: 0.05
    });
    s.addText("AI検索（Perplexity）", {
      x: L.W - L.mx - 4.0, y: 1.15, w: 4.0, h: 0.35,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.accent, align: "center", shrinkText: true
    });
    s.addText("「出典付きの回答」を直接返す\n\nAIが複数のWebページを読み\n統合してまとめてくれる", {
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

    addInsight(s, "質問するだけでAIが代わりに調べてまとめてくれる。しかも情報源のリンク付き", 3.8);
  }

  // ========== SLIDE 5: WHAT IS PERPLEXITY ==========
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "Perplexityとは", "PERPLEXITY");
    addFooter(s, 5);

    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.85, w: L.W - L.mx * 2, h: 0.6,
      fill: { color: C.accentLight }
    });
    s.addText("質問に対して「出典付きの直接回答」を生成するAI検索エンジン", {
      x: L.mx + 0.2, y: 0.85, w: L.W - L.mx * 2 - 0.4, h: 0.6,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", shrinkText: true
    });

    addCards(s, [
      { label: "2022年8月創業", desc: "CEO: Aravind Srinivas\n元Google・OpenAI研究者" },
      { label: "評価額226億ドル", desc: "2026年1月時点\n総調達額17.2億ドル" },
      { label: "月間4,500万ユーザー", desc: "訪問者1.7億人/月\n1日3,000万クエリ処理" },
    ], 1.7, 2.5, 2.0);

    // ARR badge
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.0, w: L.W - L.mx * 2, h: 0.35,
      fill: { color: C.greenBg }, rectRadius: 0.04
    });
    s.addText("ARR 2億ドル（2024年末の8,000万ドルから2.5倍成長）", {
      x: L.mx + 0.15, y: 4.0, w: L.W - L.mx * 2 - 0.3, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.green, valign: "middle", shrinkText: true
    });
  }

  // ========== SLIDE 6: FEATURE 1 — CITATIONS ==========
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "特徴① 出典付き回答（Citation）", "FEATURE 1");
    addFooter(s, 6);

    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.9, w: L.W - L.mx * 2, h: 1.3,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    s.addText("すべての回答に [1][2] の番号 — クリックで元ソースへ", {
      x: L.mx + 0.3, y: 1.0, w: 7, h: 0.35,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.textDark, shrinkText: true
    });
    s.addText("例: 「Perplexityの評価額は226億ドルです[1]」\nどの情報がどのWebページから来たか一目瞭然", {
      x: L.mx + 0.3, y: 1.4, w: 7, h: 0.7,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textBody, lineSpacingMultiple: 1.3, shrinkText: true
    });

    addCards(s, [
      { label: "情報源を確認", desc: "元ページに飛んで\n自分で検証可能", color: C.green, bg: C.greenBg, borderColor: C.green },
      { label: "ハルシネーション対策", desc: "出典があるから\n嘘を見抜ける", color: C.green, bg: C.greenBg, borderColor: C.green },
      { label: "ビジネス利用に安心", desc: "ChatGPTにはない\n根拠の可視化", color: C.green, bg: C.greenBg, borderColor: C.green },
    ], 2.5, 2.5, 1.6);
  }

  // ========== SLIDE 7: FEATURE 2 — PRO SEARCH / DEEP RESEARCH ==========
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "特徴② 対話型検索 + Pro Search / Deep Research", "FEATURE 2");
    addFooter(s, 7);

    const items = [
      { label: "フォローアップ質問", desc: "「もう少し詳しく」「初心者向けに」と続けて深掘りできる" },
      { label: "Pro Search", desc: "質問を段階的に分解して徹底調査。無料版は1日5回" },
      { label: "Deep Research", desc: "レポート級の本格分析を自動生成。無料版は1日5回" },
    ];
    items.forEach((item, i) => {
      const y = 1.0 + i * 1.1;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.9,
        fill: { color: C.offWhite }, line: { color: C.border, width: 0.5 }, rectRadius: 0.05
      });
      s.addText(item.label, {
        x: L.mx + 0.3, y: y + 0.05, w: 3, h: 0.35,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, shrinkText: true
      });
      s.addText(item.desc, {
        x: L.mx + 0.3, y: y + 0.4, w: 7.5, h: 0.35,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, shrinkText: true
      });
    });

    addInsight(s, "Pro版（$20/月）なら Pro Search / Deep Research が無制限に", 4.4);
  }

  // ========== SLIDE 8: FEATURE 3 — SPACES / PAGES ==========
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "特徴③ Spaces・Pages・ファイル対応", "FEATURE 3");
    addFooter(s, 8);

    addCards(s, [
      { label: "Spaces", desc: "自分専用ナレッジベース\nPDF・URLアップロード\nチーム共有可能", color: C.accent, bg: C.accentLight, borderColor: C.accent },
      { label: "Pages", desc: "調査結果をレポート化\nプレゼン資料の\n自動生成にも対応", color: C.green, bg: C.greenBg, borderColor: C.green },
      { label: "ファイル対応", desc: "PDF・画像アップロード\n文書要約・画像質問\n無料版は1日3回", color: C.amber, bg: C.amberBg, borderColor: C.amber },
    ], 1.0, 2.5, 2.4);

    addInsight(s, "社内資料をSpacesにアップロードすれば、自社ナレッジに基づいた回答が得られる", 3.8);
  }

  // ========== SLIDE 9: LATEST — COMPUTER & COMET ==========
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "最新の進化: Perplexity Computer & Comet", "LATEST 2026");
    addFooter(s, 9);

    addCards(s, [
      { label: "Perplexity Computer", desc: "19モデル統合AIエージェント\n(2026年2月発表)\nリサーチ→コード→画像→動画", color: C.accent, bg: C.accentLight, borderColor: C.accent },
      { label: "Comet（AIブラウザ）", desc: "2025年10月 全ユーザー無料\nページ要約・フォーム自動入力\n音声モード対応", color: C.green, bg: C.greenBg, borderColor: C.green },
      { label: "Snapchat連携", desc: "2026年初に開始\n10億ユーザーに\nAI検索をリーチ", color: C.amber, bg: C.amberBg, borderColor: C.amber },
    ], 1.0, 2.5, 2.2);

    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.6, w: L.W - L.mx * 2, h: 0.35,
      fill: { color: C.accentLight }, rectRadius: 0.04
    });
    s.addText("料金: Free（制限あり） / Pro $20/月 / Max $200/月（Computer + 全機能）", {
      x: L.mx + 0.15, y: 3.6, w: L.W - L.mx * 2 - 0.3, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", shrinkText: true
    });
  }

  // ========== SLIDE 10: COMPARISON TABLE ==========
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "従来検索 vs Perplexity 比較表", "COMPARISON");
    addFooter(s, 10);

    const headers = ["", "Google検索", "Perplexity"];
    const rows = [
      ["入力方法", "キーワードの組み合わせ", "自然な文章で質問"],
      ["結果の形式", "リンク一覧", "出典付きの要約回答"],
      ["出典", "リンク先を自分で読む", "回答内に番号付き埋め込み"],
      ["深掘り", "キーワード変更で再検索", "同じスレッドで追加質問"],
      ["得意", "ローカル情報・EC・速報", "複雑な質問・比較・調査・要約"],
    ];

    const colW = [1.8, 3.2, 3.5];
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

    addInsight(s, "どちらが優れているかではなく、場面に応じて使い分けることが大切", 3.9);
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
      "情報爆発とSEO汚染により従来の検索だけでは限界がある時代",
      "Perplexityの3大機能: 出典付き回答・Spaces・Computer",
      "AI検索は従来検索の代替ではなく、使い分けで情報収集の質が飛躍的に向上",
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
    s.addText("AI検索の新時代、ここから始めよう", {
      x: 0.5, y: 2.8, w: 9, h: 0.45,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", shrinkText: true
    });
    s.addText("NEXT → P-02 Perplexityの基本操作", {
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
