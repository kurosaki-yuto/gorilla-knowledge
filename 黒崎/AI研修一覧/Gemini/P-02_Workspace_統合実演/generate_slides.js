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
  slide.addText("P-02", {
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
  pres.title = "P-02: Google Workspace 統合実演〜Gemini で効率化する日常業務";

  // ========== SLIDE 1: TITLE ==========
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };
    s.addText("Google Workspace 統合実演", {
      x: 0.5, y: 1.5, w: 9, h: 0.8,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center", shrinkText: true
    });
    s.addShape(pres.shapes.LINE, {
      x: 3.0, y: 2.45, w: 4, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });
    s.addText("Gemini で効率化する日常業務", {
      x: 0.5, y: 2.65, w: 9, h: 0.45,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", shrinkText: true
    });
    s.addText("P-02  |  全社員向け  |  12分", {
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
      "Gmail・ドライブ・Meet 内での Gemini 統合機能の概要を説明できる",
      "Gemini が Google Workspace でどのような実務支援ができるか具体的に理解できる",
      "メール自動生成やドライブ情報の活用など、実演を通じて基本操作を習得できる",
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

  // ========== SLIDE 3: DAILY PAIN ==========
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "毎日の業務課題", "BACKGROUND");
    addFooter(s, 3);

    addCards(s, [
      { label: "メール返信\n数時間", desc: "1日のメール処理に\nあふれている時間", color: C.accent, bg: C.accentLight, borderColor: C.accent },
      { label: "ファイル探索\n迷路", desc: "必要なファイルを見つけるのに\nフォルダを掘り下げる", color: C.red, bg: C.redBg, borderColor: C.red },
      { label: "議事録作成\n手動作業", desc: "会議記録を手で整理\n重要ポイント抽出が必須", color: C.amber, bg: C.amberBg, borderColor: C.amber },
    ], 1.0, 2.5, 2.0);

    addInsight(s, "Google Workspace に統合された Gemini がこれらの課題を解決する", 3.5);
  }

  // ========== SLIDE 4: GMAIL AUTO-DRAFT ==========
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "Gmail 統合① メール自動生成", "GMAIL");
    addFooter(s, 4);

    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.9, w: L.W - L.mx * 2, h: 1.2,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    s.addText("「プロジェクト進捗について」と書き始めると……", {
      x: L.mx + 0.3, y: 1.0, w: 7, h: 0.35,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.textDark, shrinkText: true
    });
    s.addText("プロジェクト内容、進捗状況、次のアクション、署名まで\n自動で補完されます。もちろん修正可能です。", {
      x: L.mx + 0.3, y: 1.4, w: 7, h: 0.6,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textBody, lineSpacingMultiple: 1.3, shrinkText: true
    });

    addCards(s, [
      { label: "時間削減\n50～70%", desc: "企業導入事例\nメール作成が高速化", color: C.green, bg: C.greenBg, borderColor: C.green },
      { label: "ドラフト品質", desc: "文脈を理解した\n完全な文章生成", color: C.green, bg: C.greenBg, borderColor: C.green },
      { label: "完全カスタマイズ", desc: "自動生成後も\n自由に編集可能", color: C.green, bg: C.greenBg, borderColor: C.green },
    ], 2.5, 2.5, 1.6);
  }

  // ========== SLIDE 5: GMAIL AUTO-CLASSIFY (DEMO SLIDE) ==========
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "Gmail 統合② メール自動分類と優先度付け", "GMAIL - DEMO");
    addFooter(s, 5);

    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.9, w: L.W - L.mx * 2, h: 0.5,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    s.addText("👁️ 次のスライドで実演: メール受信トレイの自動分類を見てみましょう", {
      x: L.mx + 0.3, y: 0.9, w: L.W - L.mx * 2 - 0.6, h: 0.5,
      fontSize: F.size.h3, fontFace: F.sans, italic: true,
      color: C.accent, valign: "middle", shrinkText: true
    });

    const items = [
      { label: "高優先度", desc: "重要なクライアント連絡・緊急対応メール" },
      { label: "中優先度", desc: "社内通知・アクション必要な定期報告" },
      { label: "参考情報", desc: "業界ニュース・配信メール・参考情報のみ" },
    ];
    items.forEach((item, i) => {
      const y = 1.7 + i * 1.0;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.85,
        fill: { color: C.offWhite }, line: { color: C.border, width: 0.5 }, rectRadius: 0.05
      });
      s.addText(item.label, {
        x: L.mx + 0.3, y: y + 0.05, w: 2.5, h: 0.3,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, shrinkText: true
      });
      s.addText(item.desc, {
        x: L.mx + 0.3, y: y + 0.35, w: 7.5, h: 0.35,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, shrinkText: true
      });
    });
  }

  // ========== SLIDE 6: DRIVE SEARCH ==========
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "Google ドライブ統合① ファイル検索と要約", "DRIVE");
    addFooter(s, 6);

    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.9, w: L.W - L.mx * 2, h: 0.75,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    s.addText("「先月のマーケティング予算はいくら？」と聞くだけで……", {
      x: L.mx + 0.3, y: 0.95, w: 7, h: 0.65,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.textDark, valign: "middle", shrinkText: true
    });

    addCards(s, [
      { label: "自動検索", desc: "複数のスプレッドシート\nドキュメント・PDF から\n関連情報を自動抽出", color: C.accent, bg: C.accentLight, borderColor: C.accent },
      { label: "自動要約", desc: "バラバラの情報を\n統合して要約提示\n数秒で完成", color: C.green, bg: C.greenBg, borderColor: C.green },
      { label: "フォルダ不要", desc: "従来の複数フォルダ\n掘り下げが不要\n時間削減が実現", color: C.green, bg: C.greenBg, borderColor: C.green },
    ], 2.0, 2.5, 2.0);
  }

  // ========== SLIDE 7: DRIVE TEMPLATE ==========
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "Google ドライブ統合② ドキュメント作成支援", "DRIVE");
    addFooter(s, 7);

    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.9, w: L.W - L.mx * 2, h: 1.0,
      fill: { color: C.offWhite }, line: { color: C.border, width: 0.5 }, rectRadius: 0.05
    });
    s.addText("テンプレートに基づいた自動生成", {
      x: L.mx + 0.3, y: 0.95, w: 7, h: 0.3,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.textDark, shrinkText: true
    });
    s.addText("去年の営業報告書をドライブから選択\n「今年の営業報告書を、去年と同じ形式で作成」\n→ 骨組みが自動生成。数字と事例を差し替えるだけで完成", {
      x: L.mx + 0.3, y: 1.25, w: 7, h: 0.55,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textBody, lineSpacingMultiple: 1.2, shrinkText: true
    });

    addCards(s, [
      { label: "形式統一", desc: "毎年・毎月ドキュメントの\n形式が自動で統一される", color: C.green, bg: C.greenBg, borderColor: C.green },
      { label: "入力時間\n削減", desc: "テンプレ作成が無くなり\n差し替えだけで完成", color: C.green, bg: C.greenBg, borderColor: C.green },
      { label: "クオリティ\n維持", desc: "形式が一定なので\nドキュメント品質が安定", color: C.green, bg: C.greenBg, borderColor: C.green },
    ], 2.3, 2.5, 1.8);
  }

  // ========== SLIDE 8: MEET TRANSCRIPT ==========
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "Google Meet 統合① 自動文字起こしと議事録", "MEET");
    addFooter(s, 8);

    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.9, w: L.W - L.mx * 2, h: 0.6,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    s.addText("会議中の発言をリアルタイム文字起こし → 会議終了後に自動議事録生成", {
      x: L.mx + 0.3, y: 0.95, w: L.W - L.mx * 2 - 0.6, h: 0.5,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.textDark, valign: "middle", shrinkText: true
    });

    const items = [
      "「何を決めたのか」を自動抽出",
      "「誰が何を担当するのか」を明確化",
      "「次回までのアクション」をリスト化",
      "見やすい形式で自動まとめ",
    ];
    items.forEach((item, i) => {
      const y = 1.7 + i * 0.7;
      s.addText("•", {
        x: L.mx + 0.5, y, w: 0.5, h: 0.5,
        fontSize: F.size.h2, fontFace: F.sans, bold: true,
        color: C.accent, valign: "middle", shrinkText: true
      });
      s.addText(item, {
        x: L.mx + 1.1, y, w: 7, h: 0.5,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, valign: "middle", shrinkText: true
      });
    });

    addInsight(s, "手動議事録作成の時間がゼロになり、会議に集中できる", 4.3);
  }

  // ========== SLIDE 9: MEET PRIORITIES ==========
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "Google Meet 統合② 重要ポイント優先度抽出", "MEET");
    addFooter(s, 9);

    addCards(s, [
      { label: "今すぐ対応\n決定事項", desc: "即座に実行が必要な\n意思決定・承認事項", color: C.red, bg: C.redBg, borderColor: C.red },
      { label: "情報共有\n事項", desc: "FYI（参考情報）\n提供・報告事項", color: C.amber, bg: C.amberBg, borderColor: C.amber },
      { label: "今後の\n検討項目", desc: "次の会議までに\n検討する項目", color: C.green, bg: C.greenBg, borderColor: C.green },
    ], 1.0, 2.5, 1.8);

    s.addText("1時間の会議から 3つのカテゴリに自動分類\n→ 会議後のアクションプランがすぐに明確に", {
      x: L.mx, y: 3.1, w: L.W - L.mx * 2, h: 0.6,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.textDark, align: "center", lineSpacingMultiple: 1.2, shrinkText: true
    });
  }

  // ========== SLIDE 10: CASE STUDY ==========
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "実装事例: 日本特殊陶業", "CASE STUDY");
    addFooter(s, 10);

    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.9, w: L.W - L.mx * 2, h: 1.4,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    s.addText("15部署 40名のパイロット導入", {
      x: L.mx + 0.3, y: 0.95, w: L.W - L.mx * 2 - 0.6, h: 0.3,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.accent, shrinkText: true
    });
    s.addText("メール作成・ファイル検索・議事録作成という3つの業務だけで:\n\n週あたり 3.1時間 の業務時間削減を実現\n\n全社展開時にはさらに大きな効果が期待される", {
      x: L.mx + 0.3, y: 1.3, w: L.W - L.mx * 2 - 0.6, h: 0.9,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textBody, lineSpacingMultiple: 1.3, shrinkText: true
    });

    addInsight(s, "全社平均では従業員1人あたり年間 200時間 の業務時間削減が見込める", 3.5);
  }

  // ========== SLIDE 11: SUMMARY (Navy) ==========
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };

    s.addText("AI と人間の協働が鍵", {
      x: 0.5, y: 0.5, w: 9, h: 0.6,
      fontSize: F.size.h1, fontFace: F.sans, bold: true,
      color: C.white, align: "center", shrinkText: true
    });

    const summaries = [
      "Gemini は最初のドラフトや案出しを高速化するもの",
      "生成されたメール・ドキュメント・議事録は自分で確認・修正が必須",
      "AI と人間が協働することで、効率性と品質を両立させる",
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
  }

  // ========== SLIDE 12: END (Navy) ==========
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };
    s.addText("P-02 修了", {
      x: 0.5, y: 1.8, w: 9, h: 0.7,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center", shrinkText: true
    });
    s.addShape(pres.shapes.LINE, {
      x: 3.0, y: 2.65, w: 4, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });
    s.addText("Google Workspace で仕事の質を上げよう", {
      x: 0.5, y: 2.8, w: 9, h: 0.45,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", shrinkText: true
    });
    s.addText("NEXT → P-03 Gmail・Meet 実装ガイド", {
      x: 0.5, y: 3.8, w: 9, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textMuted, align: "center", shrinkText: true
    });
  }

  // ========== WRITE FILE ==========
  const outPath = __dirname + "/スライド.pptx";
  await pres.writeFile({ fileName: outPath });
  console.log(`✓ Generated: ${outPath}`);
}

main().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
