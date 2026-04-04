const PptxGenJS = require("pptxgenjs");

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
const COURSE_ID = "P-01";
const TOTAL = 12;

// =====================================================
// LAYOUT HELPERS
// =====================================================
function addTopBar(slide, pres) {
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: L.W, h: 0.035, fill: { color: C.accent } });
}

function addFooter(slide, pres, num) {
  slide.addShape(pres.shapes.LINE, {
    x: L.mx, y: L.H - 0.4, w: L.W - L.mx * 2, h: 0,
    line: { color: C.border, width: 0.5 }
  });
  slide.addText(`${num} / ${TOTAL}`, {
    x: L.W - 1.5, y: L.H - 0.38, w: 1.2, h: 0.3,
    fontSize: F.size.caption, fontFace: F.sans, color: C.textMuted, align: "right"
  });
  slide.addText(COURSE_ID, {
    x: L.mx, y: L.H - 0.38, w: 2, h: 0.3,
    fontSize: F.size.caption, fontFace: F.sans, color: C.textMuted, align: "left"
  });
}

function addSectionTitle(slide, title, tag) {
  if (tag) {
    slide.addShape("rect", {
      x: L.mx, y: 0.15, w: tag.length * 0.12 + 0.4, h: 0.28,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    slide.addText(tag, {
      x: L.mx, y: 0.15, w: tag.length * 0.12 + 0.4, h: 0.28,
      fontSize: F.size.caption, fontFace: F.sans, bold: true,
      color: C.accent, align: "center", valign: "middle"
    });
  }
  slide.addText(title, {
    x: L.mx, y: tag ? 0.5 : 0.15, w: 8.5, h: 0.5,
    fontSize: F.size.h1, fontFace: F.sans, bold: true,
    color: C.textDark
  });
}

function addCard(slide, pres, x, y, w, h, opts = {}) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h,
    fill: { color: opts.bg || C.white },
    shadow: { type: "outer", blur: 4, offset: 1, color: "000000", opacity: 0.1 },
    rectRadius: 0.08,
    line: opts.borderColor ? { color: opts.borderColor, width: 1 } : undefined
  });
}

// =====================================================
// MAIN
// =====================================================
function main() {
  const pres = new PptxGenJS();
  pres.defineLayout({ name: "CUSTOM_16x9", width: 10, height: 5.625 });
  pres.layout = "CUSTOM_16x9";
  pres.author = "Gorilla Knowledge";
  pres.title = "P-01: なぜ今AI動画なのか＋Veo3が最強な理由";

  // ============================================================
  // SLIDE 1: TITLE (Navy)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };

    s.addText("なぜ今AI動画なのか", {
      x: 0.5, y: 1.4, w: 9, h: 0.9,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center"
    });

    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 2.45, w: 3, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });

    s.addText("Veo3が最強な理由", {
      x: 0.5, y: 2.65, w: 9, h: 0.45,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center"
    });

    s.addText("P-01   |   ビジネスパーソン向け入門   |   約12分", {
      x: 0.5, y: 4.2, w: 9, h: 0.3,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textMuted, align: "center"
    });
  }

  // ============================================================
  // SLIDE 2: 今日のゴール
  // ============================================================
  {
    const s = pres.addSlide();
    addTopBar(s, pres);
    addSectionTitle(s, "今日のゴール", "GOAL");
    addFooter(s, pres, 2);

    const goals = [
      { num: "1", text: "AI動画が注目される理由を理解する" },
      { num: "2", text: "主要なAI動画ツールの全体像を把握する" },
      { num: "3", text: "Veo3が最強と言える3つの理由を説明できる" },
      { num: "4", text: "自分の業務での活用イメージを持つ" },
    ];

    goals.forEach((g, i) => {
      const y = 1.2 + i * 0.85;
      addCard(s, pres, L.mx, y, L.W - L.mx * 2, 0.7);
      s.addShape(pres.shapes.OVAL, {
        x: L.mx + 0.2, y: y + 0.12, w: 0.45, h: 0.45,
        fill: { color: C.accent }
      });
      s.addText(g.num, {
        x: L.mx + 0.2, y: y + 0.12, w: 0.45, h: 0.45,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle"
      });
      s.addText(g.text, {
        x: L.mx + 0.85, y: y + 0.1, w: 7, h: 0.5,
        fontSize: F.size.h3, fontFace: F.sans, color: C.textDark, valign: "middle"
      });
    });
  }

  // ============================================================
  // SLIDE 3: Before/After比較
  // ============================================================
  {
    const s = pres.addSlide();
    addTopBar(s, pres);
    addSectionTitle(s, "動画制作の革命 — Before / After", "REVOLUTION");
    addFooter(s, pres, 3);

    const headers = [
      { text: "項目", opts: { fill: { color: C.navy }, color: C.white, bold: true } },
      { text: "Before（従来）", opts: { fill: { color: C.navy }, color: C.white, bold: true } },
      { text: "After（AI活用）", opts: { fill: { color: C.navy }, color: C.white, bold: true } },
    ];

    const rows = [
      [
        { text: "プロモ動画", opts: { bold: true } },
        { text: "30万円・2週間", opts: { color: C.red } },
        { text: "無料・30分", opts: { color: C.green, bold: true } },
      ],
      [
        { text: "SNS動画", opts: { bold: true } },
        { text: "3時間・編集ソフト必要", opts: { color: C.red } },
        { text: "30秒・テキスト入力だけ", opts: { color: C.green, bold: true } },
      ],
      [
        { text: "研修動画", opts: { bold: true } },
        { text: "撮影チーム必要", opts: { color: C.red } },
        { text: "1人で完結", opts: { color: C.green, bold: true } },
      ],
      [
        { text: "ナレーション", opts: { bold: true } },
        { text: "声優手配・スタジオ", opts: { color: C.red } },
        { text: "AIが自動生成", opts: { color: C.green, bold: true } },
      ],
    ];

    s.addTable([headers, ...rows], {
      x: L.mx, y: 1.2, w: L.W - L.mx * 2,
      fontSize: F.size.body, fontFace: F.sans,
      border: { type: "solid", pt: 0.5, color: C.border },
      colW: [2.2, 3.15, 3.15],
      rowH: [0.45, 0.55, 0.55, 0.55, 0.55],
      align: "center", valign: "middle",
      autoPage: false,
    });
  }

  // ============================================================
  // SLIDE 4: 4大カテゴリ
  // ============================================================
  {
    const s = pres.addSlide();
    addTopBar(s, pres);
    addSectionTitle(s, "AI動画ツール 4大カテゴリ", "CATEGORY");
    addFooter(s, pres, 4);

    const cats = [
      { title: "テキスト → 動画", desc: "文章を入力するだけで\n映像が生成される", color: C.accent },
      { title: "画像 → 動画", desc: "静止画をアップロードして\n動画に変換する", color: C.green },
      { title: "アバター動画", desc: "AIの人物がカメラに向かって\n話す動画を生成", color: C.amber },
      { title: "AI音声合成", desc: "テキストから自然な\n音声を生成する", color: "7C3AED" },
    ];

    cats.forEach((c, i) => {
      const x = L.mx + i * 2.15;
      const y = 1.2;
      const w = 2.0;
      const h = 3.2;

      addCard(s, pres, x, y, w, h);

      // Color top stripe
      s.addShape(pres.shapes.RECTANGLE, {
        x: x, y: y, w: w, h: 0.08,
        fill: { color: c.color }, rectRadius: 0.08
      });

      // Number circle
      s.addShape(pres.shapes.OVAL, {
        x: x + (w - 0.5) / 2, y: y + 0.35, w: 0.5, h: 0.5,
        fill: { color: c.color }
      });
      s.addText(String(i + 1), {
        x: x + (w - 0.5) / 2, y: y + 0.35, w: 0.5, h: 0.5,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle"
      });

      s.addText(c.title, {
        x: x + 0.1, y: y + 1.1, w: w - 0.2, h: 0.5,
        fontSize: F.size.body + 1, fontFace: F.sans, bold: true,
        color: C.textDark, align: "center", valign: "middle"
      });

      s.addText(c.desc, {
        x: x + 0.1, y: y + 1.7, w: w - 0.2, h: 1.0,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textBody, align: "center", valign: "top"
      });
    });
  }

  // ============================================================
  // SLIDE 5: 4大ツール比較表
  // ============================================================
  {
    const s = pres.addSlide();
    addTopBar(s, pres);
    addSectionTitle(s, "4大ツール比較表", "COMPARISON");
    addFooter(s, pres, 5);

    const hdr = [
      { text: "項目", opts: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: F.size.label } },
      { text: "Veo3", opts: { fill: { color: C.accent }, color: C.white, bold: true, fontSize: F.size.label } },
      { text: "Runway\nGen-4.5", opts: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: F.size.label } },
      { text: "HeyGen", opts: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: F.size.label } },
      { text: "ElevenLabs", opts: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: F.size.label } },
    ];

    const dataRows = [
      ["得意分野", "テキスト/画像\n→動画", "高品質\n映像生成", "アバター\n動画", "AI音声\n合成"],
      ["価格", "無料枠あり", "月$12〜", "月$29〜", "無料枠あり"],
      ["音声生成", "同時生成 ★", "追加機能", "リップシンク", "音声専門"],
      ["特徴", "Google連携\n簡単操作", "最高画質\n一貫性", "175言語\n対応", "70言語\n声クローン"],
    ];

    const rows = dataRows.map(r => r.map((cell, ci) => ({
      text: cell,
      opts: {
        fontSize: F.size.label,
        color: ci === 0 ? C.textDark : C.textBody,
        bold: ci === 0,
        fill: ci === 1 ? { color: C.accentLight } : undefined,
      }
    })));

    s.addTable([hdr, ...rows], {
      x: L.mx, y: 1.15, w: L.W - L.mx * 2,
      fontSize: F.size.label, fontFace: F.sans,
      border: { type: "solid", pt: 0.5, color: C.border },
      colW: [1.3, 2.0, 1.7, 1.7, 1.8],
      rowH: [0.45, 0.65, 0.5, 0.5, 0.65],
      align: "center", valign: "middle",
      autoPage: false,
    });
  }

  // ============================================================
  // SLIDE 6: なぜVeo3が最強なのか
  // ============================================================
  {
    const s = pres.addSlide();
    addTopBar(s, pres);
    addSectionTitle(s, "なぜVeo3が最強なのか", "KEY POINT");
    addFooter(s, pres, 6);

    const reasons = [
      { icon: "💰", title: "無料で使える", desc: "Google AI Studio / Gemini経由\nお金をかけずに動画生成", color: C.green },
      { icon: "✨", title: "操作が簡単", desc: "専門知識不要\nテキストを入力するだけ", color: C.accent },
      { icon: "🔊", title: "音声同時生成", desc: "他ツールにない唯一の強み\nセリフ・効果音も一括", color: C.amber },
      { icon: "🔗", title: "Google連携", desc: "Googleアカウントだけで\nすぐに始められる", color: "7C3AED" },
    ];

    reasons.forEach((r, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = L.mx + col * 4.35;
      const y = 1.15 + row * 1.85;
      const w = 4.1;
      const h = 1.65;

      addCard(s, pres, x, y, w, h);

      // Left color bar
      s.addShape(pres.shapes.RECTANGLE, {
        x: x, y: y, w: 0.06, h: h,
        fill: { color: r.color }
      });

      s.addText(r.icon, {
        x: x + 0.2, y: y + 0.2, w: 0.5, h: 0.5,
        fontSize: 24, align: "center", valign: "middle"
      });

      s.addText(r.title, {
        x: x + 0.8, y: y + 0.2, w: 2.8, h: 0.4,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, valign: "middle"
      });

      s.addText(r.desc, {
        x: x + 0.8, y: y + 0.7, w: 3.0, h: 0.8,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textBody, valign: "top"
      });
    });
  }

  // ============================================================
  // SLIDE 7: Veo3の3つの強み詳細
  // ============================================================
  {
    const s = pres.addSlide();
    addTopBar(s, pres);
    addSectionTitle(s, "Veo3の3つの強み — 詳細", "DEEP DIVE");
    addFooter(s, pres, 7);

    const strengths = [
      {
        num: "1", title: "無料で始められる",
        bullets: ["Google AI Studioで無料枠利用可", "Google One AI Premium: $19.99/月", "14日間の無料トライアルあり"],
        color: C.green,
      },
      {
        num: "2", title: "音声も同時に作れる",
        bullets: ["セリフ・効果音を同時生成", "1080pの高画質", "別途音声ツール不要"],
        color: C.accent,
      },
      {
        num: "3", title: "Googleアカウントだけ",
        bullets: ["Gemini / AI Studio経由でアクセス", "追加アプリインストール不要", "ブラウザだけで完結"],
        color: C.amber,
      },
    ];

    strengths.forEach((st, i) => {
      const x = L.mx + i * 2.9;
      const y = 1.15;
      const w = 2.7;
      const h = 3.6;

      addCard(s, pres, x, y, w, h);

      // Number badge
      s.addShape(pres.shapes.OVAL, {
        x: x + (w - 0.5) / 2, y: y + 0.2, w: 0.5, h: 0.5,
        fill: { color: st.color }
      });
      s.addText(st.num, {
        x: x + (w - 0.5) / 2, y: y + 0.2, w: 0.5, h: 0.5,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle"
      });

      s.addText(st.title, {
        x: x + 0.15, y: y + 0.85, w: w - 0.3, h: 0.4,
        fontSize: F.size.body + 1, fontFace: F.sans, bold: true,
        color: C.textDark, align: "center"
      });

      // Divider
      s.addShape(pres.shapes.LINE, {
        x: x + 0.3, y: y + 1.35, w: w - 0.6, h: 0,
        line: { color: C.border, width: 0.5 }
      });

      st.bullets.forEach((b, bi) => {
        s.addText(`• ${b}`, {
          x: x + 0.2, y: y + 1.5 + bi * 0.55, w: w - 0.4, h: 0.5,
          fontSize: F.size.label, fontFace: F.sans,
          color: C.textBody, valign: "top"
        });
      });
    });
  }

  // ============================================================
  // SLIDE 8: 使い分けマップ
  // ============================================================
  {
    const s = pres.addSlide();
    addTopBar(s, pres);
    addSectionTitle(s, "用途別 使い分けマップ", "GUIDE");
    addFooter(s, pres, 8);

    const items = [
      { use: "SNSショート動画", tool: "Veo3", reason: "無料で手軽に量産", toolColor: C.accent },
      { use: "高品質プロモ動画", tool: "Runway Gen-4.5", reason: "最高画質", toolColor: C.navy },
      { use: "顔出し説明動画", tool: "HeyGen", reason: "AIアバター", toolColor: C.amber },
      { use: "ナレーション追加", tool: "ElevenLabs", reason: "音声専門", toolColor: "7C3AED" },
      { use: "まず最初に試すなら", tool: "Veo3", reason: "無料・簡単・音声付き", toolColor: C.green },
    ];

    items.forEach((item, i) => {
      const y = 1.1 + i * 0.75;
      const isLast = i === items.length - 1;

      if (isLast) {
        s.addShape(pres.shapes.RECTANGLE, {
          x: L.mx, y: y, w: L.W - L.mx * 2, h: 0.65,
          fill: { color: C.accentLight }, rectRadius: 0.06
        });
      }

      // Use case
      s.addText(item.use, {
        x: L.mx + 0.2, y: y + 0.05, w: 2.8, h: 0.55,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.textDark, valign: "middle"
      });

      // Arrow
      s.addText("→", {
        x: 3.3, y: y + 0.05, w: 0.5, h: 0.55,
        fontSize: F.size.h3, fontFace: F.sans, color: C.textMuted,
        align: "center", valign: "middle"
      });

      // Tool badge
      s.addShape(pres.shapes.RECTANGLE, {
        x: 4.0, y: y + 0.1, w: 2.2, h: 0.45,
        fill: { color: item.toolColor }, rectRadius: 0.05
      });
      s.addText(item.tool, {
        x: 4.0, y: y + 0.1, w: 2.2, h: 0.45,
        fontSize: F.size.label, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle"
      });

      // Reason
      s.addText(item.reason, {
        x: 6.5, y: y + 0.05, w: 2.5, h: 0.55,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textLight, valign: "middle"
      });
    });
  }

  // ============================================================
  // SLIDE 9: 業務活用シーン
  // ============================================================
  {
    const s = pres.addSlide();
    addTopBar(s, pres);
    addSectionTitle(s, "業務活用シーン", "USE CASES");
    addFooter(s, pres, 9);

    const scenes = [
      {
        icon: "📢", title: "マーケティング",
        items: ["製品紹介動画", "キャンペーン告知", "LP用動画"],
        color: C.accent,
      },
      {
        icon: "💼", title: "営業",
        items: ["提案資料の動画化", "顧客向けデモ動画", "事例紹介"],
        color: C.green,
      },
      {
        icon: "📚", title: "研修・教育",
        items: ["社内研修動画", "マニュアル動画", "オンボーディング"],
        color: C.amber,
      },
      {
        icon: "📱", title: "SNS運用",
        items: ["Instagram Reels", "TikTok", "YouTube Shorts"],
        color: "7C3AED",
      },
    ];

    scenes.forEach((sc, i) => {
      const x = L.mx + i * 2.15;
      const y = 1.15;
      const w = 2.0;
      const h = 3.4;

      addCard(s, pres, x, y, w, h);

      // Top color bar
      s.addShape(pres.shapes.RECTANGLE, {
        x: x, y: y, w: w, h: 0.06,
        fill: { color: sc.color }
      });

      s.addText(sc.icon, {
        x: x, y: y + 0.2, w: w, h: 0.5,
        fontSize: 24, align: "center", valign: "middle"
      });

      s.addText(sc.title, {
        x: x + 0.1, y: y + 0.8, w: w - 0.2, h: 0.4,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.textDark, align: "center"
      });

      s.addShape(pres.shapes.LINE, {
        x: x + 0.2, y: y + 1.3, w: w - 0.4, h: 0,
        line: { color: C.border, width: 0.5 }
      });

      sc.items.forEach((item, ii) => {
        s.addText(`• ${item}`, {
          x: x + 0.15, y: y + 1.45 + ii * 0.5, w: w - 0.3, h: 0.45,
          fontSize: F.size.label, fontFace: F.sans,
          color: C.textBody, valign: "top"
        });
      });
    });
  }

  // ============================================================
  // SLIDE 10: 注意点
  // ============================================================
  {
    const s = pres.addSlide();
    addTopBar(s, pres);
    addSectionTitle(s, "AI動画生成の注意点", "CAUTION");
    addFooter(s, pres, 10);

    const cautions = [
      {
        icon: "⚖️", title: "著作権・利用規約",
        desc: "商用利用の可否をツールごとに確認\n生成物の権利帰属を把握する",
        color: C.amber, bg: C.amberBg,
      },
      {
        icon: "🔍", title: "品質チェック",
        desc: "AIは完璧ではない\n不自然な表現・誤情報を人の目で確認",
        color: C.red, bg: C.redBg,
      },
      {
        icon: "🏢", title: "ブランドガイドライン",
        desc: "企業ロゴ・色使い・トーンが\n自社基準に合っているか確認",
        color: C.accent, bg: C.accentLight,
      },
    ];

    cautions.forEach((c, i) => {
      const y = 1.15 + i * 1.25;
      const w = L.W - L.mx * 2;
      const h = 1.1;

      addCard(s, pres, L.mx, y, w, h, { bg: c.bg, borderColor: c.color });

      s.addText(c.icon, {
        x: L.mx + 0.2, y: y + 0.15, w: 0.6, h: 0.6,
        fontSize: 28, align: "center", valign: "middle"
      });

      s.addText(c.title, {
        x: L.mx + 1.0, y: y + 0.1, w: 3, h: 0.4,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, valign: "middle"
      });

      s.addText(c.desc, {
        x: L.mx + 1.0, y: y + 0.5, w: 6.5, h: 0.5,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textBody, valign: "top"
      });
    });
  }

  // ============================================================
  // SLIDE 11: まとめ
  // ============================================================
  {
    const s = pres.addSlide();
    addTopBar(s, pres);
    addSectionTitle(s, "まとめ", "SUMMARY");
    addFooter(s, pres, 11);

    const points = [
      "AI動画ツールで、動画制作のコストと時間が劇的に下がった",
      "ツールは4カテゴリ（テキスト→動画、画像→動画、アバター、音声）",
      "Veo3は無料・簡単・音声同時生成の3拍子揃った最強ツール",
      "まずVeo3から始めて、用途に応じて他ツールを使い分ける",
    ];

    points.forEach((p, i) => {
      const y = 1.2 + i * 0.9;

      // Check mark circle
      s.addShape(pres.shapes.OVAL, {
        x: L.mx + 0.1, y: y + 0.1, w: 0.45, h: 0.45,
        fill: { color: C.green }
      });
      s.addText("✓", {
        x: L.mx + 0.1, y: y + 0.08, w: 0.45, h: 0.45,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle"
      });

      addCard(s, pres, L.mx + 0.7, y, L.W - L.mx * 2 - 0.7, 0.65);
      s.addText(p, {
        x: L.mx + 0.9, y: y + 0.05, w: L.W - L.mx * 2 - 1.1, h: 0.55,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textDark, valign: "middle"
      });
    });
  }

  // ============================================================
  // SLIDE 12: 確認テストへ (Navy)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };

    s.addText("確認テストに進みましょう", {
      x: 0.5, y: 1.8, w: 9, h: 0.8,
      fontSize: F.size.hero - 4, fontFace: F.sans, bold: true,
      color: C.white, align: "center"
    });

    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 2.75, w: 3, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });

    s.addText("全5問 — 今日学んだ内容を確認しましょう", {
      x: 0.5, y: 3.0, w: 9, h: 0.4,
      fontSize: F.size.h3, fontFace: F.sans,
      color: C.accentMid, align: "center"
    });

    s.addText("P-01   |   なぜ今AI動画なのか", {
      x: 0.5, y: 4.2, w: 9, h: 0.3,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textMuted, align: "center"
    });
  }

  // ============================================================
  // SAVE
  // ============================================================
  pres.writeFile({ fileName: "スライド.pptx" }).then(() => {
    console.log("スライド.pptx を生成しました");
  });
}

main();
