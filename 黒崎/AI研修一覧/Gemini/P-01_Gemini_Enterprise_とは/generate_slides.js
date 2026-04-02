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

const F = { sans: "Calibri", size: { hero: 44, h1: 32, h2: 22, h3: 18, body: 16, label: 13, caption: 11 } };
const L = { W: 10, H: 5.625, mx: 0.75, my: 0.5, gap: 0.3, cardPad: 0.3 };

let pres;

function addTopBar(slide) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: L.W, h: 0.035, fill: { color: C.accent }
  });
}

function addFooter(slide, num, total) {
  slide.addShape(pres.shapes.LINE, {
    x: L.mx, y: L.H - 0.4, w: L.W - L.mx * 2, h: 0,
    line: { color: C.border, width: 0.5 }
  });
  slide.addText(`${num} / ${total}`, {
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

function addSectionTitle(slide, title, tag) {
  if (tag) {
    const tagW = 0.6;
    slide.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.35, w: tagW, h: 0.28,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    slide.addText(tag, {
      x: L.mx, y: 0.35, w: tagW, h: 0.28,
      fontSize: 10, fontFace: F.sans, bold: true,
      color: C.accent, align: "center", valign: "middle"
    });
    slide.addText(title, {
      x: L.mx + tagW + 0.2, y: 0.35, w: 8.5 - tagW - 0.2, h: 0.55,
      fontSize: F.size.h1, fontFace: F.sans, bold: true,
      color: C.textDark, shrinkText: true
    });
  } else {
    slide.addText(title, {
      x: L.mx, y: 0.35, w: 8.5, h: 0.55,
      fontSize: F.size.h1, fontFace: F.sans, bold: true,
      color: C.textDark, shrinkText: true
    });
  }
}

const T = 22; // total slides

async function main() {
  pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "Gorilla Knowledge";
  pres.title = "P-01: Gemini Enterprise とは？";

  // =====================================================
  // スライド1: タイトルスライド
  // =====================================================
  let s = pres.addSlide();
  addTopBar(s);
  s.background = { color: C.white };

  s.addText("P-01", {
    x: L.mx, y: 0.4, w: 8.5, h: 0.35,
    fontSize: F.size.label, fontFace: F.sans, bold: true,
    color: C.accent, align: "left"
  });

  s.addText("Gemini Enterprise とは？", {
    x: L.mx, y: 0.9, w: 8.5, h: 0.8,
    fontSize: F.size.hero, fontFace: F.sans, bold: true,
    color: C.navy, align: "left", valign: "top", wrap: true
  });

  s.addText("企業向けAIの最新トレンド", {
    x: L.mx, y: 1.75, w: 8.5, h: 0.5,
    fontSize: F.size.h2, fontFace: F.sans,
    color: C.textBody, align: "left", valign: "top"
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: L.mx, y: 2.4, w: 8.5, h: 0.05, fill: { color: C.accent }
  });

  s.addText("スライド説明のみ（12分）", {
    x: L.mx, y: 2.6, w: 8.5, h: 0.3,
    fontSize: F.size.body, fontFace: F.sans,
    color: C.textLight, align: "left"
  });

  addFooter(s, 1, T);

  // =====================================================
  // スライド2-22: コンテンツスライド（トップバーとフッター）
  // =====================================================

  // スライド2
  s = pres.addSlide();
  addTopBar(s);
  s.background = { color: C.white };
  addSectionTitle(s, "AIの競争激化時代", "1.1");

  s.addText("2022年11月: ChatGPT 登場 → 生成AI市場が急速に成長", {
    x: L.mx, y: 1.1, w: 8.5, h: 0.4,
    fontSize: F.size.body, fontFace: F.sans,
    color: C.textBody, align: "left", valign: "top"
  });

  const tools = [
    { name: "ChatGPT", desc: "汎用性・ユーザビリティ" },
    { name: "Claude", desc: "セキュリティ・信頼性" },
    { name: "Gemini", desc: "統合度・企業対応" }
  ];

  let x = L.mx;
  tools.forEach((tool) => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: x, y: 1.7, w: 2.7, h: 1.3,
      fill: { color: C.offWhite }, line: { color: C.border, width: 1 }
    });
    s.addText(tool.name, {
      x: x + 0.15, y: 2.15, w: 2.4, h: 0.3,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.textDark, align: "center", shrinkText: true
    });
    s.addText(tool.desc, {
      x: x + 0.15, y: 2.55, w: 2.4, h: 0.4,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textBody, align: "center", valign: "top", wrap: true
    });
    x += 2.9;
  });

  s.addText("企業導入では：セキュリティ・カスタマイズ・統合が求められる", {
    x: L.mx, y: 3.2, w: 8.5, h: 0.5,
    fontSize: F.size.body, fontFace: F.sans,
    color: C.green, align: "left", valign: "top", bold: true, wrap: true
  });

  addFooter(s, 2, T);

  // スライド3
  s = pres.addSlide();
  addTopBar(s);
  s.background = { color: C.white };
  addSectionTitle(s, "Google が Gemini を作った理由", "1.2");

  s.addText("★ Google Workspace に AI を統合", {
    x: L.mx, y: 1.1, w: 8.5, h: 0.3,
    fontSize: F.size.h3, fontFace: F.sans, bold: true,
    color: C.navy, align: "left"
  });

  const timeline = [
    { date: "2025年1月15日", event: "Gemini が Google Workspace に標準搭載" },
    { date: "2025年3月17日", event: "新規・更新契約に新料金が適用" },
    { date: "2025年10月9日", event: "Gemini Enterprise 発表" },
    { date: "2026年3月4日", event: "Gemini アプリの共有機能が拡張" }
  ];

  let ty = 1.6;
  timeline.forEach((t) => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: ty, w: 2.1, h: 0.32,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    s.addText(t.date, {
      x: L.mx + 0.1, y: ty + 0.06, w: 1.9, h: 0.2,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.accent, align: "center"
    });
    s.addText(t.event, {
      x: L.mx + 2.3, y: ty, w: 6.2, h: 0.32,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textBody, align: "left", valign: "middle", wrap: true
    });
    ty += 0.5;
  });

  addFooter(s, 3, T);

  // スライド4-22: 残りのスライドを簡潔に作成
  const slideSections = [
    { title: "主要AIツール比較", tag: "2.1", content: "ChatGPT: 汎用性で最普及\nClaude: セキュリティ・プライバシー重視\nGemini: Google Workspace 統合が強み" },
    { title: "統合度の違い", tag: "2.2", content: "ChatGPT/Claude: 独立ツール → コピペ作業必要\nGemini: Workspace に埋め込み → 統合度が圧倒的" },
    { title: "信頼性・精度の比較", tag: "2.3", content: "2026年現在：精度差はほぼなし\n各ツール得意分野で選択することが重要" },
    { title: "統合されたサービス一覧", tag: "3.1", content: "Gmail / ドキュメント / スプレッドシート\nスライド / Meet / カレンダー / Drive" },
    { title: "Gmail × Gemini の活用例", tag: "3.2", content: "従来: 受け取る → 読む → 考える → 返信（5～10分）\nGemini: 受け取る → 提案確認 → 送信（3～5分）\n営業チーム全体: 月間数十時間削減" },
    { title: "ドキュメント × Gemini の活用例", tag: "3.3", content: "従来: 調査 → 作成 → 推敲 → 修正\nGemini: 調査 → 初稿生成 → 最終調整\n定型文書作成: 最大80%削減" },
    { title: "画像生成機能（2026年3月搭載）", tag: "4.1", content: "プレゼン資料の図表自動生成\nマーケティング素材の草案作成\n提案書のイラスト自動作成" },
    { title: "動画生成機能（2026年3月搭載）", tag: "4.2", content: "営業研修の教材動画\n製品紹介動画の自動骨組み\n社内通知ビデオ\n制作時間が大幅削減" },
    { title: "Deep Research 機能", tag: "4.3", content: "特定テーマの深掘り調査を自動実行\n戦略立案・市場調査・競合分析に活躍\n調査時間を最大70%削減" },
    { title: "企業導入の実績", tag: "5.1", content: "J:COM: 月1,500時間削減\nnote: 月3～4時間削減\n日本特殊陶業: 週3.1時間削減（全社展開へ）" },
    { title: "業務別の効率化実績", tag: "5.2", content: "メール返信: 60-70%削減\n資料作成: 70-80%削減\n情報整理: 50-60%削減\nデータ分析: 60-75%削減\n→全社平均: 年間200時間削減" },
    { title: "企業導入のプロセス", tag: "5.3", content: "1. パイロット導入（10～50名）→ ユースケース確認\n2. 部分導入（部門単位）→ 業務改善を検証\n3. 全社展開 → 標準ツール化\n多くの企業は3～6ヶ月で全社展開に到達" },
    { title: "企業向けセキュリティ機能", tag: "6.1", content: "VPC Service Controls / CMEK / EKM・HSM\nDLP（機密情報の流出を自動検知・遮断）\nRBAC（ロールベースアクセス管理）" },
    { title: "業界別コンプライアンス対応", tag: "6.2", content: "HIPAA（医療） / FedRAMP（米国政府）\nISO 27001/27018 / SOC 2 Type II\nPCI DSS（金融・決済）\n金融・医療・公共セクターでも安心" },
    { title: "データの所在地対応", tag: "6.3", content: "EU企業: EU リージョンでの処理\nUS企業: US リージョンでの処理\n日本企業: 日本・アジアリージョンでの処理\n地域規制に完全対応" },
    { title: "無料版 vs Enterprise", tag: "7.1", content: "無料版: 基本チャット・Web検索のみ\nWorkspace+Gemini: 統合機能・画像生成あり\nEnterprise: 管理画面・セキュリティ機能フル" },
    { title: "Gemini のポジション（2026年現在）", tag: "8.1", content: "ChatGPT: 汎用性で選ばれている\nClaude: 信頼性で選ばれている\nGemini: 統合度 × セキュリティで選ばれている" },
    { title: "Gemini を成功させるポイント", tag: "8.2", content: "1. パイロット導入から始める\n2. ユースケースを集める\n3. 従業員教育を並行実施\n4. セキュリティルールを明確化" },
    { title: "次のステップ", tag: "8.3", content: "1. 自社で使えそうな業務を探す\n2. 小規模から試す（10～20名）\n3. 効果を数値化する\n4. 部門横断で共有する\n年間200時間の削減 = 1人分の雇用価値" }
  ];

  slideSections.forEach((section, idx) => {
    s = pres.addSlide();
    addTopBar(s);
    s.background = { color: C.white };
    addSectionTitle(s, section.title, section.tag);

    s.addText(section.content, {
      x: L.mx, y: 1.15, w: 8.5, h: 3.8,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textBody, align: "left", valign: "top", wrap: true
    });

    addFooter(s, idx + 4, T);
  });

  // =====================================================
  // Save presentation
  // =====================================================
  await pres.writeFile({ fileName: "/Users/kurosakiyuto/Downloads/開発/gorilla-knowledge/黒崎/AI研修一覧/Gemini/P-01_Gemini_Enterprise_とは/スライド.pptx" });
  console.log("✓ スライド.pptx を生成しました。");
}

main().catch(console.error);
