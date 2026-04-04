const pptxgen = require("pptxgenjs");

const C = { white: "FFFFFF", offWhite: "FAFBFC", lightGray: "F3F4F6", navy: "1B2A4A", navyLight: "2D4A7A", accent: "2563EB", accentLight: "DBEAFE", accentMid: "93C5FD", textDark: "111827", textBody: "374151", textLight: "6B7280", textMuted: "9CA3AF", green: "059669", greenBg: "D1FAE5", amber: "D97706", amberBg: "FEF3C7", red: "DC2626", redBg: "FEE2E2", border: "E5E7EB" };
const F = { sans: "Calibri", size: { hero: 40, h1: 24, h2: 20, h3: 16, body: 14, label: 12, caption: 10 } };
const L = { W: 10, H: 5.625, mx: 0.75, my: 0.5, gap: 0.3 };

let pres; const T = 12;

function addTopBar(slide) { slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: L.W, h: 0.035, fill: { color: C.accent } }); }

function addFooter(slide, num) {
  slide.addShape(pres.shapes.LINE, { x: L.mx, y: L.H - 0.4, w: L.W - L.mx * 2, h: 0, line: { color: C.border, width: 0.5 } });
  slide.addText(`${num} / ${T}`, { x: L.W - 1.5, y: L.H - 0.38, w: 1.2, h: 0.3, fontSize: F.size.caption, fontFace: F.sans, color: C.textMuted, align: "right", shrinkText: true });
  slide.addText("P-03", { x: L.mx, y: L.H - 0.38, w: 2, h: 0.3, fontSize: F.size.caption, fontFace: F.sans, color: C.textMuted, align: "left", shrinkText: true });
}

function addTitle(slide, title, tag) {
  if (tag) { const tagW = tag.length * 0.12 + 0.4; slide.addShape(pres.shapes.RECTANGLE, { x: L.mx, y: 0.15, w: tagW, h: 0.28, fill: { color: C.accentLight }, rectRadius: 0.05 }); slide.addText(tag, { x: L.mx, y: 0.15, w: tagW, h: 0.28, fontSize: F.size.caption, fontFace: F.sans, bold: true, color: C.accent, align: "center", valign: "middle", shrinkText: true }); }
  slide.addText(title, { x: L.mx, y: tag ? 0.5 : 0.15, w: 8.5, h: 0.45, fontSize: F.size.h1, fontFace: F.sans, bold: true, color: C.textDark, shrinkText: true });
}

function addCards(slide, cards, y, cardW, cardH) {
  const cardGap = 0.3, totalW = cardW * cards.length + cardGap * (cards.length - 1), startX = (L.W - totalW) / 2;
  cards.forEach((c, i) => { const x = startX + i * (cardW + cardGap); slide.addShape(pres.shapes.RECTANGLE, { x, y, w: cardW, h: cardH, fill: { color: c.bg || C.offWhite }, line: { color: c.borderColor || C.border, width: c.borderColor ? 1 : 0.5 }, rectRadius: 0.05 }); slide.addText(c.label, { x, y: y + 0.25, w: cardW, h: 0.35, fontSize: F.size.h3, fontFace: F.sans, bold: true, color: c.color || C.textDark, align: "center", shrinkText: true }); slide.addText(c.desc, { x: x + 0.15, y: y + 0.65, w: cardW - 0.3, h: cardH - 0.85, fontSize: F.size.body, fontFace: F.sans, color: C.textBody, align: "center", lineSpacingMultiple: 1.3, shrinkText: true }); });
}

function addInsight(slide, text, y) {
  slide.addShape(pres.shapes.RECTANGLE, { x: L.mx, y, w: L.W - L.mx * 2, h: 0.4, fill: { color: C.accentLight }, rectRadius: 0.04 });
  slide.addText(text, { x: L.mx + 0.15, y, w: L.W - L.mx * 2 - 0.3, h: 0.4, fontSize: F.size.label, fontFace: F.sans, italic: true, color: C.textLight, valign: "middle", shrinkText: true });
}

async function main() {
  pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "Gorilla Knowledge";
  pres.title = "P-03: 営業企画効率化実演";

  // ========== SLIDE 1: TITLE ==========
  { const s = pres.addSlide(); s.background = { color: C.navy }; s.addText("営業企画効率化実演", { x: 0.5, y: 1.5, w: 9, h: 0.8, fontSize: F.size.hero, fontFace: F.sans, bold: true, color: C.white, align: "center", shrinkText: true }); s.addShape(pres.shapes.LINE, { x: 3.5, y: 2.45, w: 3, h: 0, line: { color: C.accentMid, width: 1.5 } }); s.addText("提案書作成が数分で完成", { x: 0.5, y: 2.65, w: 9, h: 0.45, fontSize: F.size.h2, fontFace: F.sans, color: C.accentMid, align: "center", shrinkText: true }); s.addText("P-03  |  営業部向け  |  12分", { x: 0.5, y: 3.8, w: 9, h: 0.35, fontSize: F.size.label, fontFace: F.sans, color: C.textMuted, align: "center", shrinkText: true }); }

  // ========== SLIDE 2: GOALS ==========
  { const s = pres.addSlide(); s.background = { color: C.white }; addTopBar(s); addTitle(s, "今日のゴール"); addFooter(s, 2);
    const goals = ["提案書作成が 70-80% 削減される仕組みを理解する", "既存テンプレートから新規提案書を自動生成する流れを習得する", "営業効率化による売上向上の実例を学ぶ"];
    goals.forEach((g, i) => { const y = 1.0 + i * 1.15; s.addText(String(i + 1), { x: L.mx, y: y + 0.05, w: 0.5, h: 0.5, fontSize: F.size.h2, fontFace: F.sans, bold: true, color: C.white, align: "center", valign: "middle", fill: { color: C.accent }, shape: pres.shapes.OVAL, shrinkText: true }); s.addText(g, { x: L.mx + 0.7, y, w: 7.5, h: 0.6, fontSize: F.size.h3, fontFace: F.sans, color: C.textDark, valign: "middle", shrinkText: true }); if (i < 2) s.addShape(pres.shapes.LINE, { x: L.mx, y: y + 0.8, w: L.W - L.mx * 2, h: 0, line: { color: C.border, width: 0.5 } }); });
  }

  // ========== SLIDE 3: SALES CHALLENGES ==========
  { const s = pres.addSlide(); s.background = { color: C.white }; addTopBar(s); addTitle(s, "営業の現場課題", "CHALLENGES"); addFooter(s, 3);
    const challenges = [{ title: "提案書作成に膨大な時間", desc: "従来なら 3 日かかっていた。顧客対応に時間が割けない" }, { title: "過去資料の管理が大変", desc: "成功案件の提案書が無数にある。どれを基にしたら？" }, { title: "個人差が大きい", desc: "経験者の提案は成約率高い。新人は0から書く羽目に" }];
    challenges.forEach((c, i) => { const y = 0.95 + i * 1.4; s.addShape(pres.shapes.RECTANGLE, { x: L.mx, y, w: L.W - L.mx * 2, h: 1.2, fill: { color: C.redBg }, line: { color: C.red, width: 1 }, rectRadius: 0.05 }); s.addText(c.title, { x: L.mx + 0.3, y: y + 0.1, w: 8.4, h: 0.3, fontSize: F.size.h3, fontFace: F.sans, bold: true, color: C.red, shrinkText: true }); s.addText(c.desc, { x: L.mx + 0.3, y: y + 0.42, w: 8.4, h: 0.65, fontSize: F.size.body, fontFace: F.sans, color: C.textBody, lineSpacingMultiple: 1.2, shrinkText: true }); });
  }

  // ========== SLIDE 4: SOLUTION ==========
  { const s = pres.addSlide(); s.background = { color: C.white }; addTopBar(s); addTitle(s, "Gemini の解決策", "SOLUTION"); addFooter(s, 4);
    addCards(s, [{ label: "テンプレート活用", desc: "成功した提案書を参照\nGemini が似た構成で新規作成", color: C.green, bg: C.greenBg, borderColor: C.green }, { label: "自動カスタマイズ", desc: "顧客情報を入力\nAI が最適な提案を自動生成", color: C.accent, bg: C.accentLight, borderColor: C.accent }, { label: "品質安定化", desc: "経験の有無問わず\n一定水準の提案書が完成", color: C.green, bg: C.greenBg, borderColor: C.green }], 1.0, 2.5, 2.0);
  }

  // ========== SLIDE 5: DEMO PREP ==========
  { const s = pres.addSlide(); s.background = { color: C.white }; addTopBar(s); addTitle(s, "実演のシナリオ", "DEMO PREP"); addFooter(s, 5);
    s.addShape(pres.shapes.RECTANGLE, { x: L.mx, y: 0.9, w: L.W - L.mx * 2, h: 1.2, fill: { color: C.accentLight }, rectRadius: 0.05 });
    s.addText("営業チームが新規顧客向けの提案書を 80秒で作成する様子をお見せします。", { x: L.mx + 0.3, y: 0.95, w: 8.4, h: 0.4, fontSize: F.size.h3, fontFace: F.sans, color: C.textDark, shrinkText: true });
    s.addText("従来: 3日 → Gemini: 数分", { x: L.mx + 0.3, y: 1.38, w: 8.4, h: 0.7, fontSize: F.size.h2, fontFace: F.sans, bold: true, color: C.accent, lineSpacingMultiple: 1.2, shrinkText: true });
  }

  // ========== SLIDE 6: DEMO LIVE ==========
  { const s = pres.addSlide(); s.background = { color: C.white }; addTopBar(s); addTitle(s, "実演: 提案書自動生成", "DEMO LIVE"); addFooter(s, 6);
    s.addShape(pres.shapes.RECTANGLE, { x: L.mx, y: 0.95, w: L.W - L.mx * 2, h: 1.8, fill: { color: C.lightGray }, rectRadius: 0.05 });
    s.addText("【実演動画: 80.6秒】\n\n1. Google ドキュメントを開く\n2. 『テンプレートから新提案書』を選択\n3. 顧客情報を入力（企業名、業界、課題）\n4. Gemini が 3 パターンの提案を自動生成\n5. 最適な案を選び、数字を微調整して完成", { x: L.mx + 0.3, y: 1.0, w: 8.4, h: 1.7, fontSize: F.size.body, fontFace: F.sans, color: C.textBody, lineSpacingMultiple: 1.3, shrinkText: true });
  }

  // ========== SLIDE 7: HOW IT WORKS ==========
  { const s = pres.addSlide(); s.background = { color: C.white }; addTopBar(s); addTitle(s, "提案書自動生成の仕組み", "HOW IT WORKS"); addFooter(s, 7);
    const steps = [{ label: "Step 1: テンプレート選択", desc: "過去の成功提案書から最適なフォーマットを選ぶ" }, { label: "Step 2: 顧客情報入力", desc: "企業名、課題、予算などを簡潔に入力" }, { label: "Step 3: AI 分析・生成", desc: "Gemini が顧客に合わせた最適な提案内容を複数案生成" }, { label: "Step 4: 選択・カスタマイズ", desc: "提案の方向性を選び、細部を微調整" }];
    steps.forEach((step, i) => { const y = 0.95 + i * 1.0; s.addShape(pres.shapes.RECTANGLE, { x: L.mx, y, w: L.W - L.mx * 2, h: 0.85, fill: { color: C.offWhite }, line: { color: C.border, width: 0.5 }, rectRadius: 0.05 }); s.addText(step.label, { x: L.mx + 0.3, y: y + 0.08, w: 3.5, h: 0.3, fontSize: F.size.h3, fontFace: F.sans, bold: true, color: C.accent, shrinkText: true }); s.addText(step.desc, { x: L.mx + 0.3, y: y + 0.4, w: 8.4, h: 0.35, fontSize: F.size.body, fontFace: F.sans, color: C.textBody, shrinkText: true }); });
  }

  // ========== SLIDE 8: IMPACT ON SALES ==========
  { const s = pres.addSlide(); s.background = { color: C.white }; addTopBar(s); addTitle(s, "営業効率化の実績", "SALES IMPACT"); addFooter(s, 8);
    const impacts = [{ label: "作成時間削減", value: "70-80%", desc: "3日 → 数分" }, { label: "提案件数増加", value: "2.5倍", desc: "同じ営業人数で 2.5 倍の提案が可能" }, { label: "成約率向上", value: "15%UP", desc: "テンプレートの質がより高まるため" }];
    impacts.forEach((impact, i) => { const x = L.mx + i * 3.1; s.addShape(pres.shapes.RECTANGLE, { x, y: 1.0, w: 2.8, h: 3.2, fill: { color: C.greenBg }, line: { color: C.green, width: 1 }, rectRadius: 0.05 }); s.addText(impact.label, { x: x + 0.15, y: 1.15, w: 2.5, h: 0.35, fontSize: F.size.h3, fontFace: F.sans, bold: true, color: C.textDark, align: "center", shrinkText: true }); s.addText(impact.value, { x: x + 0.15, y: 1.6, w: 2.5, h: 0.55, fontSize: 32, fontFace: F.sans, bold: true, color: C.green, align: "center", shrinkText: true }); s.addText(impact.desc, { x: x + 0.15, y: 2.2, w: 2.5, h: 1.0, fontSize: F.size.body, fontFace: F.sans, color: C.textBody, align: "center", lineSpacingMultiple: 1.2, shrinkText: true }); });
  }

  // ========== SLIDE 9: KEY SUCCESS FACTORS ==========
  { const s = pres.addSlide(); s.background = { color: C.white }; addTopBar(s); addTitle(s, "成功のポイント", "KEY FACTORS"); addFooter(s, 9);
    const factors = [{ label: "✓ テンプレート整備が鍵", desc: "成功事例の提案書を体系的に整理・保管すること" }, { label: "✓ 顧客情報を正確に入力", desc: "課題・ニーズを詳しく入力するほど提案精度が上がる" }, { label: "✓ 提案の方向性を人間が判断", desc: "複数案から『どのアプローチがベストか』は営業経験値で選ぶ" }];
    factors.forEach((factor, i) => { const y = 1.0 + i * 1.2; s.addText(factor.label, { x: L.mx + 0.3, y, w: 2.5, h: 0.35, fontSize: F.size.h3, fontFace: F.sans, bold: true, color: C.green, shrinkText: true }); s.addText(factor.desc, { x: L.mx + 3.0, y, w: 6.2, h: 0.35, fontSize: F.size.body, fontFace: F.sans, color: C.textBody, shrinkText: true }); });
  }

  // ========== SLIDE 10: NEXT STEPS FOR SALES ==========
  { const s = pres.addSlide(); s.background = { color: C.white }; addTopBar(s); addTitle(s, "営業チームが今からやること", "NEXT STEPS"); addFooter(s, 10);
    addCards(s, [{ label: "Step 1", desc: "成功提案書を\nドライブにまとめる", color: C.accent, bg: C.accentLight, borderColor: C.accent }, { label: "Step 2", desc: "テンプレートを\nGemini に学習させる", color: C.green, bg: C.greenBg, borderColor: C.green }, { label: "Step 3", desc: "小さく試しながら\nプロセスを最適化", color: C.amber, bg: C.amberBg, borderColor: C.amber }], 1.0, 2.5, 2.0);
  }

  // ========== SLIDE 11: SUMMARY ==========
  { const s = pres.addSlide(); s.background = { color: C.navy };
    s.addText("まとめ", { x: 0.5, y: 0.5, w: 9, h: 0.6, fontSize: F.size.h1, fontFace: F.sans, bold: true, color: C.white, align: "center", shrinkText: true });
    const summaries = ["提案書作成が 3 日 → 数分に短縮。営業が顧客対応に時間を使える", "テンプレート品質が高いほど、AI の提案精度が向上", "同じ営業人数で 2.5 倍の提案件数を作成可能 → 売上 15% 向上"];
    summaries.forEach((text, i) => { const y = 1.5 + i * 1.0; s.addText(String(i + 1), { x: 2.5, y, w: 0.5, h: 0.5, fontSize: F.size.h2, fontFace: F.sans, bold: true, color: C.navy, align: "center", valign: "middle", fill: { color: C.accentMid }, shape: pres.shapes.OVAL, shrinkText: true }); s.addText(text, { x: 3.2, y, w: 5, h: 0.5, fontSize: F.size.h3, fontFace: F.sans, color: C.white, valign: "middle", shrinkText: true }); });
    addFooter(s, 11);
  }

  // ========== SLIDE 12: END ==========
  { const s = pres.addSlide(); s.background = { color: C.navy };
    s.addText("P-03 修了", { x: 0.5, y: 1.8, w: 9, h: 0.7, fontSize: F.size.hero, fontFace: F.sans, bold: true, color: C.white, align: "center", shrinkText: true });
    s.addShape(pres.shapes.LINE, { x: 3.5, y: 2.65, w: 3, h: 0, line: { color: C.accentMid, width: 1.5 } });
    s.addText("営業効率化は、すぐそこまで来ている", { x: 0.5, y: 2.8, w: 9, h: 0.45, fontSize: F.size.h2, fontFace: F.sans, color: C.accentMid, align: "center", shrinkText: true });
    s.addText("NEXT → P-04 セキュリティ・対象者ガイド", { x: 0.5, y: 3.8, w: 9, h: 0.35, fontSize: F.size.label, fontFace: F.sans, color: C.textMuted, align: "center", shrinkText: true });
  }

  const outPath = __dirname + "/スライド.pptx";
  await pres.writeFile({ fileName: outPath });
  console.log("Created: " + outPath);
}

main().catch(err => { console.error(err); process.exit(1); });
