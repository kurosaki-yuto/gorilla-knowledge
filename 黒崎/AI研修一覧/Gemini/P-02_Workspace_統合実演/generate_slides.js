const pptxgen = require("pptxgenjs");

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

let pres; const T = 12;

function addTopBar(slide) { slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: L.W, h: 0.035, fill: { color: C.accent } }); }

function addFooter(slide, num) {
  slide.addShape(pres.shapes.LINE, { x: L.mx, y: L.H - 0.4, w: L.W - L.mx * 2, h: 0, line: { color: C.border, width: 0.5 } });
  slide.addText(`${num} / ${T}`, { x: L.W - 1.5, y: L.H - 0.38, w: 1.2, h: 0.3, fontSize: F.size.caption, fontFace: F.sans, color: C.textMuted, align: "right", shrinkText: true });
  slide.addText("P-02", { x: L.mx, y: L.H - 0.38, w: 2, h: 0.3, fontSize: F.size.caption, fontFace: F.sans, color: C.textMuted, align: "left", shrinkText: true });
}

function addTitle(slide, title, tag) {
  if (tag) {
    const tagW = tag.length * 0.12 + 0.4;
    slide.addShape(pres.shapes.RECTANGLE, { x: L.mx, y: 0.15, w: tagW, h: 0.28, fill: { color: C.accentLight }, rectRadius: 0.05 });
    slide.addText(tag, { x: L.mx, y: 0.15, w: tagW, h: 0.28, fontSize: F.size.caption, fontFace: F.sans, bold: true, color: C.accent, align: "center", valign: "middle", shrinkText: true });
  }
  slide.addText(title, { x: L.mx, y: tag ? 0.5 : 0.15, w: 8.5, h: 0.45, fontSize: F.size.h1, fontFace: F.sans, bold: true, color: C.textDark, shrinkText: true });
}

function addCards(slide, cards, y, cardW, cardH) {
  const cardGap = 0.3, totalW = cardW * cards.length + cardGap * (cards.length - 1), startX = (L.W - totalW) / 2;
  cards.forEach((c, i) => {
    const x = startX + i * (cardW + cardGap);
    slide.addShape(pres.shapes.RECTANGLE, { x, y, w: cardW, h: cardH, fill: { color: c.bg || C.offWhite }, line: { color: c.borderColor || C.border, width: c.borderColor ? 1 : 0.5 }, rectRadius: 0.05 });
    slide.addText(c.label, { x, y: y + 0.25, w: cardW, h: 0.35, fontSize: F.size.h3, fontFace: F.sans, bold: true, color: c.color || C.textDark, align: "center", shrinkText: true });
    slide.addText(c.desc, { x: x + 0.15, y: y + 0.65, w: cardW - 0.3, h: cardH - 0.85, fontSize: F.size.body, fontFace: F.sans, color: C.textBody, align: "center", lineSpacingMultiple: 1.3, shrinkText: true });
  });
}

function addInsight(slide, text, y) {
  slide.addShape(pres.shapes.RECTANGLE, { x: L.mx, y, w: L.W - L.mx * 2, h: 0.4, fill: { color: C.accentLight }, rectRadius: 0.04 });
  slide.addText(text, { x: L.mx + 0.15, y, w: L.W - L.mx * 2 - 0.3, h: 0.4, fontSize: F.size.label, fontFace: F.sans, italic: true, color: C.textLight, valign: "middle", shrinkText: true });
}

async function main() {
  pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "Gorilla Knowledge";
  pres.title = "P-02: Google Workspace 統合実演";

  // ========== SLIDE 1: TITLE ==========
  { const s = pres.addSlide(); s.background = { color: C.navy };
    s.addText("Google Workspace 統合実演", { x: 0.5, y: 1.5, w: 9, h: 0.8, fontSize: F.size.hero, fontFace: F.sans, bold: true, color: C.white, align: "center", shrinkText: true });
    s.addShape(pres.shapes.LINE, { x: 3.5, y: 2.45, w: 3, h: 0, line: { color: C.accentMid, width: 1.5 } });
    s.addText("実際に動く Gemini を見てみる", { x: 0.5, y: 2.65, w: 9, h: 0.45, fontSize: F.size.h2, fontFace: F.sans, color: C.accentMid, align: "center", shrinkText: true });
    s.addText("P-02  |  全社員向け  |  12分", { x: 0.5, y: 3.8, w: 9, h: 0.35, fontSize: F.size.label, fontFace: F.sans, color: C.textMuted, align: "center", shrinkText: true });
  }

  // ========== SLIDE 2: GOALS ==========
  { const s = pres.addSlide(); s.background = { color: C.white }; addTopBar(s); addTitle(s, "今日のゴール"); addFooter(s, 2);
    const goals = ["Gmail での自動メール生成機能を実際に見て理解する", "Google ドライブからの情報活用・カスタマイズの流れを把握する", "実演を通じて Gemini との『対話』の実際を習得する"];
    goals.forEach((g, i) => {
      const y = 1.0 + i * 1.15;
      s.addText(String(i + 1), { x: L.mx, y: y + 0.05, w: 0.5, h: 0.5, fontSize: F.size.h2, fontFace: F.sans, bold: true, color: C.white, align: "center", valign: "middle", fill: { color: C.accent }, shape: pres.shapes.OVAL, shrinkText: true });
      s.addText(g, { x: L.mx + 0.7, y, w: 7.5, h: 0.6, fontSize: F.size.h3, fontFace: F.sans, color: C.textDark, valign: "middle", shrinkText: true });
      if (i < 2) s.addShape(pres.shapes.LINE, { x: L.mx, y: y + 0.8, w: L.W - L.mx * 2, h: 0, line: { color: C.border, width: 0.5 } });
    });
  }

  // ========== SLIDE 3: GMAIL BASICS ==========
  { const s = pres.addSlide(); s.background = { color: C.white }; addTopBar(s); addTitle(s, "Gmail × Gemini の3つの活用法", "GMAIL BASICS"); addFooter(s, 3);
    const items = [{ label: "① 返信ドラフト自動生成", desc: "受信メールに対して、Gemini が返信案を自動作成" }, { label: "② メール分類・優先度付け", desc: "受信トレイを自動分類。重要メールが一目で分かる" }, { label: "③ 要約・重要ポイント抽出", desc: "長いメールスレッドを AI が自動要約" }];
    items.forEach((item, i) => {
      const y = 1.0 + i * 1.1;
      s.addShape(pres.shapes.RECTANGLE, { x: L.mx, y, w: L.W - L.mx * 2, h: 0.9, fill: { color: C.offWhite }, line: { color: C.border, width: 0.5 }, rectRadius: 0.05 });
      s.addText(item.label, { x: L.mx + 0.3, y: y + 0.05, w: 3, h: 0.35, fontSize: F.size.h3, fontFace: F.sans, bold: true, color: C.accent, shrinkText: true });
      s.addText(item.desc, { x: L.mx + 0.3, y: y + 0.4, w: 7.5, h: 0.35, fontSize: F.size.body, fontFace: F.sans, color: C.textBody, shrinkText: true });
    });
  }

  // ========== SLIDE 4: DEMO PREP ==========
  { const s = pres.addSlide(); s.background = { color: C.white }; addTopBar(s); addTitle(s, "実演のシナリオ", "DEMO PREP"); addFooter(s, 4);
    s.addShape(pres.shapes.RECTANGLE, { x: L.mx, y: 0.9, w: L.W - L.mx * 2, h: 0.8, fill: { color: C.accentLight }, rectRadius: 0.05 });
    s.addText("これから、営業メールへの返信を Gemini で作成する様子をお見せします。", { x: L.mx + 0.3, y: 0.95, w: 8.4, h: 0.7, fontSize: F.size.h3, fontFace: F.sans, color: C.textDark, valign: "middle", shrinkText: true });
    addCards(s, [{ label: "受信メール", desc: "顧客からの\n提案依頼", color: C.accent, bg: C.accentLight, borderColor: C.accent }, { label: "Gemini処理", desc: "背景情報から\n回答を生成", color: C.green, bg: C.greenBg, borderColor: C.green }, { label: "カスタマイズ", desc: "生成案を\n微調整して送信", color: C.amber, bg: C.amberBg, borderColor: C.amber }], 2.0, 2.5, 1.8);
  }

  // ========== SLIDE 5: DEMO LIVE ==========
  { const s = pres.addSlide(); s.background = { color: C.white }; addTopBar(s); addTitle(s, "実演: Gmail メール作成 + Drive 活用", "DEMO LIVE"); addFooter(s, 5);
    s.addShape(pres.shapes.RECTANGLE, { x: L.mx, y: 0.95, w: L.W - L.mx * 2, h: 1.8, fill: { color: C.lightGray }, rectRadius: 0.05 });
    s.addText("【実演動画: 57.6秒】\n\n1. Gmail で顧客メールを受け取る\n2. 「Gemini で返信案を作成」をクリック\n3. Drive から既存提案書を参照させ、カスタマイズ\n4. 数秒で完成した返信メールを確認", { x: L.mx + 0.3, y: 1.0, w: 8.4, h: 1.7, fontSize: F.size.body, fontFace: F.sans, color: C.textBody, lineSpacingMultiple: 1.3, shrinkText: true });
  }

  // ========== SLIDE 6: GMAIL DRAFT GENERATION ==========
  { const s = pres.addSlide(); s.background = { color: C.white }; addTopBar(s); addTitle(s, "Gmail: 返信ドラフト自動生成の仕組み", "DRAFT GENERATION"); addFooter(s, 6);
    const steps = [{ num: "1", label: "受信メール読み込み", desc: "顧客からのメール内容を AI が理解" }, { num: "2", label: "背景情報の検索", desc: "関連する過去メール・資料から文脈取得" }, { num: "3", label: "返信案の生成", desc: "トーン・内容・署名まで完全な返信を生成" }, { num: "4", label: "ユーザーレビュー", desc: "生成案を確認・修正してから送信" }];
    steps.forEach((step, i) => {
      const y = 0.9 + i * 0.95;
      s.addText(step.num, { x: L.mx, y: y + 0.1, w: 0.5, h: 0.5, fontSize: F.size.h2, fontFace: F.sans, bold: true, color: C.white, align: "center", valign: "middle", fill: { color: C.accent }, shape: pres.shapes.OVAL, shrinkText: true });
      s.addText(step.label, { x: L.mx + 0.75, y: y + 0.12, w: 2.5, h: 0.35, fontSize: F.size.h3, fontFace: F.sans, bold: true, color: C.textDark, shrinkText: true });
      s.addText(step.desc, { x: L.mx + 0.75, y: y + 0.48, w: 2.5, h: 0.35, fontSize: F.size.label, fontFace: F.sans, color: C.textBody, shrinkText: true });
    });
  }

  // ========== SLIDE 7: DRIVE INTEGRATION ==========
  { const s = pres.addSlide(); s.background = { color: C.white }; addTopBar(s); addTitle(s, "Google ドライブ統合: 情報の再利用", "DRIVE INTEGRATION"); addFooter(s, 7);
    addCards(s, [{ label: "自動検索", desc: "「去年のプロジェクト資料」と言うだけで\n関連ファイルを自動抽出", color: C.accent, bg: C.accentLight, borderColor: C.accent }, { label: "要約・抽出", desc: "PDF・スプレッドシートから\n必要なデータだけを抽出", color: C.green, bg: C.greenBg, borderColor: C.green }, { label: "カスタマイズ", desc: "抽出した情報をベースに\n新規メール・資料を作成", color: C.amber, bg: C.amberBg, borderColor: C.amber }], 1.0, 2.5, 2.0);
    addInsight(s, "過去資料を『再利用』するだけで、メール作成時間が大幅短縮", 3.5);
  }

  // ========== SLIDE 8: WORKSPACE SYNERGY ==========
  { const s = pres.addSlide(); s.background = { color: C.white }; addTopBar(s); addTitle(s, "Workspace統合の相乗効果", "SYNERGY"); addFooter(s, 8);
    s.addShape(pres.shapes.RECTANGLE, { x: L.mx, y: 0.95, w: L.W - L.mx * 2, h: 1.2, fill: { color: C.offWhite }, line: { color: C.border, width: 0.5 }, rectRadius: 0.05 });
    s.addText("Gmail (メール返信) × ドライブ (背景情報) → 完全な返答", { x: L.mx + 0.3, y: 1.0, w: 8.4, h: 0.35, fontSize: F.size.h3, fontFace: F.sans, bold: true, color: C.accent, shrinkText: true });
    s.addText("単体の機能ではなく、複数の Workspace ツールが連動することで、初めて業務効率化が実現する。これが Gemini の最大の強み。", { x: L.mx + 0.3, y: 1.4, w: 8.4, h: 0.7, fontSize: F.size.body, fontFace: F.sans, color: C.textBody, lineSpacingMultiple: 1.3, shrinkText: true });
  }

  // ========== SLIDE 9: BEST PRACTICES ==========
  { const s = pres.addSlide(); s.background = { color: C.white }; addTopBar(s); addTitle(s, "使う時のポイント", "BEST PRACTICES"); addFooter(s, 9);
    const tips = [{ label: "✓ 生成案は確認してから送信", desc: "AI が作ったものを『確認』『微調整』するステップが重要" }, { label: "✓ 機密情報を入力する時は注意", desc: "顧客情報・社外秘の内容は事前に確認・同意を得てから" }, { label: "✓ ドライブに『テンプレート』を用意", desc: "AI が参照する基本フォーマットがあると、生成精度が大幅アップ" }, { label: "✓ 定期的に手動修正の例を学習させる", desc: "Workspace 管理者が『標準的な表現』を定義していく" }];
    tips.forEach((tip, i) => {
      const y = 0.9 + i * 0.95;
      s.addText(tip.label, { x: L.mx + 0.3, y, w: 2, h: 0.3, fontSize: F.size.h3, fontFace: F.sans, bold: true, color: C.green, shrinkText: true });
      s.addText(tip.desc, { x: L.mx + 2.5, y, w: 6.2, h: 0.35, fontSize: F.size.label, fontFace: F.sans, color: C.textBody, shrinkText: true });
    });
  }

  // ========== SLIDE 10: NEXT STEPS ==========
  { const s = pres.addSlide(); s.background = { color: C.white }; addTopBar(s); addTitle(s, "今からできることは？", "NEXT STEPS"); addFooter(s, 10);
    addCards(s, [{ label: "Step 1", desc: "Gmail での返信機能から\n試してみる", color: C.accent, bg: C.accentLight, borderColor: C.accent }, { label: "Step 2", desc: "よく使う資料を Drive に\nまとめておく", color: C.green, bg: C.greenBg, borderColor: C.green }, { label: "Step 3", desc: "生成されたメール・資料を\nレビューして改善する", color: C.amber, bg: C.amberBg, borderColor: C.amber }], 1.0, 2.5, 2.0);
  }

  // ========== SLIDE 11: SUMMARY ==========
  { const s = pres.addSlide(); s.background = { color: C.navy };
    s.addText("まとめ", { x: 0.5, y: 0.5, w: 9, h: 0.6, fontSize: F.size.h1, fontFace: F.sans, bold: true, color: C.white, align: "center", shrinkText: true });
    const summaries = ["Gmail × Drive の統合により、メール作成が劇的に効率化される", "AI が生成した案を『確認・微調整』する『人間の目』が重要", "小さく始めて、成功事例を社内で共有することが導入成功の鍵"];
    summaries.forEach((text, i) => {
      const y = 1.5 + i * 1.0;
      s.addText(String(i + 1), { x: 2.5, y, w: 0.5, h: 0.5, fontSize: F.size.h2, fontFace: F.sans, bold: true, color: C.navy, align: "center", valign: "middle", fill: { color: C.accentMid }, shape: pres.shapes.OVAL, shrinkText: true });
      s.addText(text, { x: 3.2, y, w: 5, h: 0.5, fontSize: F.size.h3, fontFace: F.sans, color: C.white, valign: "middle", shrinkText: true });
    });
    addFooter(s, 11); s.addText("P-02", { x: L.mx, y: L.H - 0.38, w: 2, h: 0.3, fontSize: F.size.caption, fontFace: F.sans, color: C.textMuted, align: "left", shrinkText: true });
  }

  // ========== SLIDE 12: END ==========
  { const s = pres.addSlide(); s.background = { color: C.navy };
    s.addText("P-02 修了", { x: 0.5, y: 1.8, w: 9, h: 0.7, fontSize: F.size.hero, fontFace: F.sans, bold: true, color: C.white, align: "center", shrinkText: true });
    s.addShape(pres.shapes.LINE, { x: 3.5, y: 2.65, w: 3, h: 0, line: { color: C.accentMid, width: 1.5 } });
    s.addText("実演で見えた、Workspace 統合の力", { x: 0.5, y: 2.8, w: 9, h: 0.45, fontSize: F.size.h2, fontFace: F.sans, color: C.accentMid, align: "center", shrinkText: true });
    s.addText("NEXT → P-03 営業企画効率化実演", { x: 0.5, y: 3.8, w: 9, h: 0.35, fontSize: F.size.label, fontFace: F.sans, color: C.textMuted, align: "center", shrinkText: true });
  }

  const outPath = __dirname + "/スライド.pptx";
  await pres.writeFile({ fileName: outPath });
  console.log("Created: " + outPath);
}

main().catch(err => { console.error(err); process.exit(1); });
