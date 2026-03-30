const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const {
  FaBriefcase, FaFileAlt, FaEnvelope, FaSearch, FaUsers,
  FaChartLine, FaCheckCircle, FaArrowRight, FaBullseye,
  FaLightbulb, FaDatabase, FaClipboardList, FaComments,
  FaPencilAlt, FaCogs, FaRocket, FaCalendarCheck,
  FaChartBar, FaListOl, FaStar
} = require("react-icons/fa");

// =====================================================
// DESIGN SYSTEM (navy:1B2A4A, accent:2563EB, Calibri, 10x5.625)
// =====================================================

const C = {
  white: "FFFFFF", offWhite: "FAFBFC", lightGray: "F3F4F6",
  navy: "1B2A4A", navyLight: "2D4A7A",
  accent: "2563EB", accentLight: "DBEAFE", accentMid: "93C5FD",
  textDark: "111827", textBody: "374151", textMuted: "9CA3AF", textLight: "6B7280",
  green: "059669", greenBg: "D1FAE5",
  amber: "D97706", amberBg: "FEF3C7",
  red: "DC2626", redBg: "FEE2E2",
  border: "E5E7EB",
};

const F = {
  sans: "Calibri",
  size: { hero: 44, h1: 32, h2: 22, h3: 18, body: 16, label: 13, caption: 11, tag: 10 }
};

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
  slide.addText("A-111", {
    x: L.mx, y: L.H - 0.38, w: 2, h: 0.3,
    fontSize: F.size.caption, fontFace: F.sans,
    color: C.textMuted, align: "left", margin: 0
  });
}

function addSectionTitle(slide, title) {
  slide.addText(title, {
    x: L.mx, y: 0.35, w: 8.5, h: 0.55,
    fontSize: F.size.h1, fontFace: F.sans, bold: true,
    color: C.textDark, margin: 0
  });
}

function addTag(slide, pres, text, color, bgColor) {
  const w = text.length * 0.14 + 0.4;
  slide.addShape(pres.shapes.RECTANGLE, {
    x: L.mx, y: 0.35, w, h: 0.28,
    fill: { color: bgColor }, rectRadius: 0.05
  });
  slide.addText(text, {
    x: L.mx, y: 0.35, w, h: 0.28,
    fontSize: F.size.tag, fontFace: F.sans, bold: true,
    color, align: "center", valign: "middle"
  });
}

// Before/After helper
function addBeforeAfter(slide, pres, ic, beforeItems, afterItems, y, h) {
  const boxW = 3.5;
  const bx = L.mx;
  const ax = L.W - L.mx - boxW;

  // Before box
  slide.addShape(pres.shapes.RECTANGLE, {
    x: bx, y, w: boxW, h, fill: { color: C.redBg }, line: { color: "FECACA", width: 0.5 }
  });
  slide.addText("BEFORE", {
    x: bx + 0.2, y: y + 0.1, w: 1.5, h: 0.25,
    fontSize: F.size.tag, fontFace: F.sans, bold: true, color: C.red, margin: 0
  });
  beforeItems.forEach((item, i) => {
    slide.addText(item, {
      x: bx + 0.2, y: y + 0.4 + i * 0.4, w: boxW - 0.4, h: 0.35,
      fontSize: F.size.body, fontFace: F.sans, color: C.textBody, margin: 0
    });
  });

  // Arrow
  slide.addImage({ data: ic.arrow, x: bx + boxW + 0.3, y: y + h / 2 - 0.2, w: 0.4, h: 0.4 });

  // After box
  slide.addShape(pres.shapes.RECTANGLE, {
    x: ax, y, w: boxW, h, fill: { color: C.greenBg }, line: { color: "A7F3D0", width: 0.5 }
  });
  slide.addText("AFTER", {
    x: ax + 0.2, y: y + 0.1, w: 1.5, h: 0.25,
    fontSize: F.size.tag, fontFace: F.sans, bold: true, color: C.green, margin: 0
  });
  afterItems.forEach((item, i) => {
    slide.addText(item, {
      x: ax + 0.2, y: y + 0.4 + i * 0.4, w: boxW - 0.4, h: 0.35,
      fontSize: F.size.body, fontFace: F.sans, color: C.textBody, margin: 0
    });
  });
}

// Reduction badge
function addBadge(slide, pres, text, x, y) {
  const w = text.length * 0.11 + 0.6;
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h: 0.35, fill: { color: C.accent }, rectRadius: 0.15
  });
  slide.addText(text, {
    x, y, w, h: 0.35,
    fontSize: F.size.label, fontFace: F.sans, bold: true,
    color: C.white, align: "center", valign: "middle"
  });
}

async function main() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "Gorilla Knowledge";
  pres.title = "A-111: 業務別AI活用マップ 〜営業・事務・企画";

  // Pre-render icons
  const ic = {
    briefcase: await icon(FaBriefcase, C.accent),
    file: await icon(FaFileAlt, C.accent),
    envelope: await icon(FaEnvelope, C.accent),
    search: await icon(FaSearch, C.accent),
    users: await icon(FaUsers, C.navyLight),
    chart: await icon(FaChartLine, C.accent),
    check: await icon(FaCheckCircle, C.green),
    checkBlue: await icon(FaCheckCircle, C.accent),
    arrow: await icon(FaArrowRight, C.accent),
    target: await icon(FaBullseye, C.accent),
    bulb: await icon(FaLightbulb, C.amber),
    database: await icon(FaDatabase, C.green),
    clipboard: await icon(FaClipboardList, C.green),
    comments: await icon(FaComments, C.green),
    pencil: await icon(FaPencilAlt, C.amber),
    cogs: await icon(FaCogs, C.accent),
    rocket: await icon(FaRocket, C.accent),
    calendar: await icon(FaCalendarCheck, C.amber),
    chartBar: await icon(FaChartBar, C.amber),
    listOl: await icon(FaListOl, C.accent),
    star: await icon(FaStar, C.amber),
  };

  const T = 12;

  // ============================================================
  // SLIDE 1: TITLE
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };

    s.addImage({ data: ic.briefcase, x: (L.W - 0.7) / 2, y: 0.9, w: 0.7, h: 0.7 });

    s.addText("業務別AI活用マップ", {
      x: 0.5, y: 1.8, w: 9, h: 0.9,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center", margin: 0
    });

    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 2.85, w: 3, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });

    s.addText("営業・事務・企画 — 明日から使えるAI活用ポイント", {
      x: 0.5, y: 3.05, w: 9, h: 0.5,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", margin: 0
    });

    s.addText("A-111   |   全社員向け   |   20分", {
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
      "営業・事務・企画の各部門でAIが活用できるポイントを3つ以上挙げられる",
      "部門別のAI活用Before/After（工数削減イメージ）を説明できる",
      "自分の業務でAIが使えるポイントを特定し、優先順位をつけられる",
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
  // SLIDE 3: AI UTILIZATION MAP
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "AI活用マップ — 3部門 × 主要業務");
    addFooter(s, 3, T, pres);

    const cols = [
      { title: "営業", color: C.accent, items: ["提案書作成", "顧客分析", "メール対応", "商談準備"] },
      { title: "事務", color: C.green, items: ["データ入力・集計", "書類作成", "スケジュール管理", "問合せ対応"] },
      { title: "企画", color: C.amber, items: ["市場調査", "企画書作成", "コンテンツ制作", "効果分析"] },
    ];

    const colW = 2.6;
    const colGap = 0.25;
    const totalW = colW * 3 + colGap * 2;
    const startX = (L.W - totalW) / 2;

    cols.forEach((col, i) => {
      const x = startX + i * (colW + colGap);
      const y = 1.1;

      // Column background
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: colW, h: 3.2,
        fill: { color: C.white }, line: { color: C.border, width: 0.75 }
      });

      // Header
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: colW, h: 0.5, fill: { color: col.color }
      });
      s.addText(col.title, {
        x, y, w: colW, h: 0.5,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle"
      });

      // Items
      col.items.forEach((item, j) => {
        s.addImage({ data: ic.checkBlue, x: x + 0.2, y: y + 0.7 + j * 0.6, w: 0.2, h: 0.2 });
        s.addText(item, {
          x: x + 0.5, y: y + 0.63 + j * 0.6, w: colW - 0.7, h: 0.35,
          fontSize: F.size.body, fontFace: F.sans,
          color: C.textBody, valign: "middle", margin: 0
        });
      });
    });

    // Key message
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.5, w: L.W - L.mx * 2, h: 0.5, fill: { color: C.navy }
    });
    s.addText([
      { text: "共通ポイント：", options: { color: C.accentMid } },
      { text: "定型 × 大量 × 繰り返し", options: { color: C.white, bold: true } },
      { text: " = AI向きの業務", options: { color: C.accentMid } },
    ], {
      x: L.mx + 0.3, y: 4.5, w: L.W - L.mx * 2 - 0.6, h: 0.5,
      fontSize: F.size.body, fontFace: F.sans,
      align: "center", valign: "middle"
    });
  }

  // ============================================================
  // SLIDE 4: SALES — Proposals & Email
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addTag(s, pres, "営業部門", C.accent, C.accentLight);
    s.addText("提案書作成 & メール対応", {
      x: L.mx, y: 0.7, w: 8, h: 0.5,
      fontSize: F.size.h1, fontFace: F.sans, bold: true,
      color: C.textDark, margin: 0
    });
    addFooter(s, 4, T, pres);

    addBeforeAfter(s, pres, ic,
      ["提案書1件 → 3時間", "メール返信 → 1通15分", "テンプレ探し → 30分"],
      ["AIが下書き → 確認で1時間", "メール返信 → 5分", "テンプレ自動提案"],
      1.4, 1.7
    );

    addBadge(s, pres, "提案書 -60%", L.mx, 3.35);
    addBadge(s, pres, "メール -65%", L.mx + 2.2, 3.35);
  }

  // ============================================================
  // SLIDE 5: SALES — Analysis & Prep
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addTag(s, pres, "営業部門", C.accent, C.accentLight);
    s.addText("顧客分析 & 商談準備", {
      x: L.mx, y: 0.7, w: 8, h: 0.5,
      fontSize: F.size.h1, fontFace: F.sans, bold: true,
      color: C.textDark, margin: 0
    });
    addFooter(s, 5, T, pres);

    addBeforeAfter(s, pres, ic,
      ["顧客情報調べ → 2時間", "業界動向把握 → 半日", "商談シナリオ → 手探り"],
      ["AI自動収集・要約 → 30分", "業界課題トップ5 → 即取得", "商談シナリオ3案提案"],
      1.4, 1.7
    );

    addBadge(s, pres, "商談準備 -75%", L.mx, 3.35);

    // Tip
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.9, w: L.W - L.mx * 2, h: 0.5, fill: { color: C.navy }
    });
    s.addText([
      { text: "コツ：", options: { color: C.accentMid } },
      { text: "「株式会社○○のDX戦略と直近の投資動向を教えて」", options: { color: C.white, bold: true } },
    ], {
      x: L.mx + 0.3, y: 3.9, w: L.W - L.mx * 2 - 0.6, h: 0.5,
      fontSize: F.size.label, fontFace: F.sans,
      align: "center", valign: "middle"
    });
  }

  // ============================================================
  // SLIDE 6: ADMIN — Data Entry & Aggregation
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addTag(s, pres, "事務部門", C.green, C.greenBg);
    s.addText("データ入力 & 集計・レポート", {
      x: L.mx, y: 0.7, w: 8, h: 0.5,
      fontSize: F.size.h1, fontFace: F.sans, bold: true,
      color: C.textDark, margin: 0
    });
    addFooter(s, 6, T, pres);

    addBeforeAfter(s, pres, ic,
      ["手入力 → 1日がかり", "Excel関数 → 半日", "ミス率 3〜5%"],
      ["AI-OCR自動読取 → 確認のみ", "自然言語で集計・グラフ", "ミス率 0.5%以下"],
      1.4, 1.7
    );

    addBadge(s, pres, "データ入力 -80%", L.mx, 3.35);
    addBadge(s, pres, "集計 -70%", L.mx + 2.6, 3.35);
  }

  // ============================================================
  // SLIDE 7: ADMIN — Documents & FAQ
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addTag(s, pres, "事務部門", C.green, C.greenBg);
    s.addText("書類作成 & 社内問合せ対応", {
      x: L.mx, y: 0.7, w: 8, h: 0.5,
      fontSize: F.size.h1, fontFace: F.sans, bold: true,
      color: C.textDark, margin: 0
    });
    addFooter(s, 7, T, pres);

    addBeforeAfter(s, pres, ic,
      ["議事録作成 → 2時間", "マニュアル → 1週間", "問合せ対応 → 1件15分"],
      ["AI文字起こし+要約 → 20分", "AI下書き+レビュー → 2日", "FAQチャットボット → 即答"],
      1.4, 1.7
    );

    addBadge(s, pres, "議事録 -85%", L.mx, 3.35);
    addBadge(s, pres, "問合せ -70%", L.mx + 2.2, 3.35);
  }

  // ============================================================
  // SLIDE 8: PLANNING — Research & Proposal
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addTag(s, pres, "企画部門", C.amber, C.amberBg);
    s.addText("市場調査 & 企画書作成", {
      x: L.mx, y: 0.7, w: 8, h: 0.5,
      fontSize: F.size.h1, fontFace: F.sans, bold: true,
      color: C.textDark, margin: 0
    });
    addFooter(s, 8, T, pres);

    addBeforeAfter(s, pres, ic,
      ["市場調査 → 2週間", "競合分析 → 1週間", "企画書 → 3日"],
      ["AIデータ収集・整理 → 3日", "競合分析 → 1日", "骨子1時間 → 仕上げ1日"],
      1.4, 1.7
    );

    addBadge(s, pres, "市場調査 -80%", L.mx, 3.35);
    addBadge(s, pres, "企画書 -65%", L.mx + 2.4, 3.35);

    // Tip
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.9, w: L.W - L.mx * 2, h: 0.5, fill: { color: C.navy }
    });
    s.addText([
      { text: "AIは「調査の出発点」であって「結論」ではない", options: { color: C.white, bold: true } },
    ], {
      x: L.mx + 0.3, y: 3.9, w: L.W - L.mx * 2 - 0.6, h: 0.5,
      fontSize: F.size.label, fontFace: F.sans,
      align: "center", valign: "middle"
    });
  }

  // ============================================================
  // SLIDE 9: PLANNING — Content & Analytics
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addTag(s, pres, "企画部門", C.amber, C.amberBg);
    s.addText("コンテンツ制作 & 効果分析", {
      x: L.mx, y: 0.7, w: 8, h: 0.5,
      fontSize: F.size.h1, fontFace: F.sans, bold: true,
      color: C.textDark, margin: 0
    });
    addFooter(s, 9, T, pres);

    addBeforeAfter(s, pres, ic,
      ["SNS投稿案10本 → 2日", "効果レポート → 半日", "A/Bテスト設計 → 1日"],
      ["AI案出し+選定 → 半日", "データ分析+自動生成 → 2時間", "AI仮説立案 → 30分"],
      1.4, 1.7
    );

    addBadge(s, pres, "コンテンツ -75%", L.mx, 3.35);
    addBadge(s, pres, "効果分析 -70%", L.mx + 2.6, 3.35);
  }

  // ============================================================
  // SLIDE 10: SUMMARY TABLE
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "Before/After 工数削減サマリー");
    addFooter(s, 10, T, pres);

    const tableY = 1.1;
    const rows = [
      ["部門", "業務", "Before", "After", "削減率"],
      ["営業", "提案書作成", "3時間", "1時間", "-60%"],
      ["営業", "商談準備", "1日", "2時間", "-75%"],
      ["事務", "データ入力", "1日", "2時間", "-80%"],
      ["事務", "議事録作成", "2時間", "20分", "-85%"],
      ["企画", "市場調査", "2週間", "3日", "-80%"],
      ["企画", "コンテンツ制作", "2日", "半日", "-75%"],
    ];

    const colWidths = [1.2, 2.2, 1.8, 1.8, 1.5];
    const rowH = 0.4;
    const startX = L.mx;

    rows.forEach((row, ri) => {
      let cx = startX;
      row.forEach((cell, ci) => {
        const isHeader = ri === 0;
        const isReduction = ci === 4 && ri > 0;
        s.addShape(pres.shapes.RECTANGLE, {
          x: cx, y: tableY + ri * rowH, w: colWidths[ci], h: rowH,
          fill: { color: isHeader ? C.navy : (ri % 2 === 0 ? C.offWhite : C.white) },
          line: { color: C.border, width: 0.3 }
        });
        s.addText(cell, {
          x: cx, y: tableY + ri * rowH, w: colWidths[ci], h: rowH,
          fontSize: isHeader ? F.size.label : F.size.body,
          fontFace: F.sans,
          bold: isHeader || isReduction,
          color: isHeader ? C.white : (isReduction ? C.green : C.textBody),
          align: "center", valign: "middle", margin: 0
        });
        cx += colWidths[ci];
      });
    });

    // Key message
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.2, w: L.W - L.mx * 2, h: 0.5, fill: { color: C.navy }
    });
    s.addText([
      { text: "平均 ", options: { color: C.accentMid } },
      { text: "60〜80%の工数削減", options: { color: C.white, bold: true } },
      { text: " が見込める", options: { color: C.accentMid } },
    ], {
      x: L.mx + 0.3, y: 4.2, w: L.W - L.mx * 2 - 0.6, h: 0.5,
      fontSize: F.size.body, fontFace: F.sans,
      align: "center", valign: "middle"
    });
  }

  // ============================================================
  // SLIDE 11: 3 STEPS TO START
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "自分の業務でAIを始める3ステップ");
    addFooter(s, 11, T, pres);

    const steps = [
      { num: "1", label: "棚卸し", desc: "1週間の業務を書き出し\n「定型×大量×繰り返し」\nにチェック", ic: ic.clipboard, color: C.accent },
      { num: "2", label: "優先順位", desc: "効果(時間削減)×\n難易度(すぐ始められるか)\nでマトリクス評価", ic: ic.listOl, color: C.green },
      { num: "3", label: "小さく試す", desc: "1つ選んで今週中に\nAIで試す。\nうまくいかなくてもOK", ic: ic.rocket, color: C.amber },
    ];

    const cardW = 2.6;
    const cardGap = 0.25;
    const totalW = cardW * 3 + cardGap * 2;
    const sx = (L.W - totalW) / 2;

    steps.forEach((st, i) => {
      const x = sx + i * (cardW + cardGap);
      const y = 1.1;
      const h = 3.4;

      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h,
        fill: { color: C.white }, line: { color: C.border, width: 0.75 }
      });

      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 0.05, fill: { color: st.color }
      });

      s.addText(st.num, {
        x: x + (cardW - 0.55) / 2, y: y + 0.3, w: 0.55, h: 0.55,
        fontSize: F.size.h2, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: st.color }, shape: pres.shapes.OVAL
      });

      s.addText(st.label, {
        x, y: y + 1.1, w: cardW, h: 0.4,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, align: "center", margin: 0
      });

      s.addShape(pres.shapes.LINE, {
        x: x + 0.4, y: y + 1.6, w: cardW - 0.8, h: 0,
        line: { color: C.border, width: 0.5 }
      });

      s.addText(st.desc, {
        x: x + 0.2, y: y + 1.75, w: cardW - 0.4, h: 1.2,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textLight, align: "center", valign: "top", margin: 0
      });
    });

    // Key message
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.7, w: L.W - L.mx * 2, h: 0.45, fill: { color: C.navy }
    });
    s.addText([
      { text: "「まず1つやってみる」", options: { color: C.white, bold: true } },
      { text: " — これがAI活用の最大のコツ", options: { color: C.accentMid } },
    ], {
      x: L.mx + 0.3, y: 4.7, w: L.W - L.mx * 2 - 0.6, h: 0.45,
      fontSize: F.size.body, fontFace: F.sans,
      align: "center", valign: "middle"
    });
  }

  // ============================================================
  // SLIDE 12: END
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };

    s.addText("業務別AI活用マップ — まとめ", {
      x: 0.5, y: 0.8, w: 9, h: 0.6,
      fontSize: F.size.h1, fontFace: F.sans, bold: true,
      color: C.accentMid, align: "center", margin: 0
    });

    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 1.5, w: 3, h: 0,
      line: { color: C.accentMid, width: 1 }
    });

    const summaryItems = [
      { dept: "営業", text: "提案書・メール・顧客分析・商談準備" },
      { dept: "事務", text: "データ入力・集計・議事録・問合せ対応" },
      { dept: "企画", text: "市場調査・企画書・コンテンツ・効果分析" },
    ];

    summaryItems.forEach((item, i) => {
      s.addText(item.dept, {
        x: 2, y: 1.8 + i * 0.55, w: 1.2, h: 0.4,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.accentMid, align: "right", valign: "middle", margin: 0
      });
      s.addText(item.text, {
        x: 3.4, y: 1.8 + i * 0.55, w: 5, h: 0.4,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.white, valign: "middle", margin: 0
      });
    });

    s.addText("確認テスト（5問）→ 80%以上で修了", {
      x: 0.5, y: 3.6, w: 9, h: 0.5,
      fontSize: F.size.h3, fontFace: F.sans,
      color: C.white, align: "center", margin: 0
    });

    s.addText("今週、1つだけAIで試してみましょう", {
      x: 0.5, y: 4.2, w: 9, h: 0.4,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textMuted, align: "center", margin: 0
    });

    s.addText("A-111 | Gorilla Knowledge", {
      x: 0.5, y: 4.8, w: 9, h: 0.3,
      fontSize: F.size.caption, fontFace: F.sans,
      color: C.textMuted, align: "center", margin: 0
    });
  }

  // Save
  const outPath = __dirname + "/スライド.pptx";
  await pres.writeFile({ fileName: outPath });
  console.log("Generated:", outPath);
}

main().catch(e => { console.error(e); process.exit(1); });
