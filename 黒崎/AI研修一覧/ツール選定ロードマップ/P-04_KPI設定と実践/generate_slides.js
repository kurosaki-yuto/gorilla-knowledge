const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const {
  FaBullseye, FaClock, FaChartLine, FaStar, FaArrowRight,
  FaCheckCircle, FaExclamationTriangle, FaLightbulb,
  FaClipboardList, FaFileAlt, FaUsers, FaRocket,
  FaChevronRight, FaTrophy, FaUserTie, FaSeedling,
  FaShareAlt, FaHeart, FaTimesCircle, FaTable,
  FaRedoAlt, FaShieldAlt, FaComments, FaSearch,
  FaIndustry, FaPercentage
} = require("react-icons/fa");

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

// Icon helper
async function icon(Comp, color, size = 256) {
  const svg = ReactDOMServer.renderToStaticMarkup(
    React.createElement(Comp, { color: `#${color}`, size: String(size) })
  );
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

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
  slide.addText("P-04", {
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

const T = 12; // total slides

async function main() {
  pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "Gorilla Knowledge";
  pres.title = "P-04: KPI設定＋効果測定";

  // Pre-render icons
  const ic = {
    target: await icon(FaBullseye, C.accent),
    clock: await icon(FaClock, C.accent),
    chart: await icon(FaChartLine, C.green),
    star: await icon(FaStar, C.amber),
    arrow: await icon(FaArrowRight, C.accent),
    check: await icon(FaCheckCircle, C.green),
    checkBlue: await icon(FaCheckCircle, C.accent),
    warn: await icon(FaExclamationTriangle, C.amber),
    bulb: await icon(FaLightbulb, C.amber),
    clipboard: await icon(FaClipboardList, C.accent),
    file: await icon(FaFileAlt, C.accent),
    users: await icon(FaUsers, C.green),
    rocket: await icon(FaRocket, C.accent),
    chevron: await icon(FaChevronRight, C.textMuted),
    trophy: await icon(FaTrophy, C.amber),
    userTie: await icon(FaUserTie, C.accent),
    seedling: await icon(FaSeedling, C.green),
    share: await icon(FaShareAlt, C.amber),
    heart: await icon(FaHeart, C.red),
    timesCircle: await icon(FaTimesCircle, C.red),
    table: await icon(FaTable, C.accent),
    redo: await icon(FaRedoAlt, C.red),
    shield: await icon(FaShieldAlt, C.green),
    comments: await icon(FaComments, C.accent),
    search: await icon(FaSearch, C.amber),
    industry: await icon(FaIndustry, C.accent),
    percent: await icon(FaPercentage, C.red),
  };

  // ============================================================
  // SLIDE 1: TITLE (Navy background)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };
    s.addImage({ data: ic.target, x: (L.W - 0.6) / 2, y: 1.0, w: 0.6, h: 0.6 });
    s.addText("KPI設定＋効果測定", {
      x: 0.5, y: 1.8, w: 9, h: 0.8,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center", shrinkText: true
    });
    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 2.75, w: 3, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });
    s.addText("感覚ではなく数字で成果を証明する", {
      x: 0.5, y: 2.95, w: 9, h: 0.45,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", shrinkText: true
    });
    s.addText("P-04  |  ツール選定ロードマップ  |  12分", {
      x: 0.5, y: 4.0, w: 9, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textMuted, align: "center", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 2: GOALS
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "今日のゴール");
    addFooter(s, 2, T);

    const goals = [
      "AI導入に必要な3つのKPIを設計できる",
      "効果測定テンプレートで週次記録を始められる",
      "やり直しロスを防ぐ具体策を実行できる",
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

  // ============================================================
  // SLIDE 3: WHY KPI? "数字で測れないものは改善できない"
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "数字で測れないものは改善できない");
    addFooter(s, 3, T);

    // Quote box
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.85, w: L.W - L.mx * 2, h: 0.55,
      fill: { color: C.navy }, rectRadius: 0.05
    });
    s.addText("KPIを設定する理由: 感覚ではなくデータで判断する", {
      x: L.mx + 0.2, y: 0.85, w: L.W - L.mx * 2 - 0.4, h: 0.55,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.white, valign: "middle", align: "center", shrinkText: true
    });

    // Two comparison cards
    const cardW = 3.9;
    const cardGap = 0.4;

    // Left: Bad
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 1.65, w: cardW, h: 1.5,
      fill: { color: C.redBg }, line: { color: C.red, width: 1 }, rectRadius: 0.05
    });
    s.addImage({ data: ic.timesCircle, x: L.mx + 0.15, y: 1.8, w: 0.3, h: 0.3 });
    s.addText("感覚で判断", {
      x: L.mx + 0.55, y: 1.75, w: cardW - 0.7, h: 0.3,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.red, shrinkText: true
    });
    s.addText("「なんとなく便利になった」\n→ 予算カット・継続困難", {
      x: L.mx + 0.2, y: 2.2, w: cardW - 0.4, h: 0.8,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textBody, lineSpacingMultiple: 1.3, shrinkText: true
    });

    // Right: Good
    const rightX = L.mx + cardW + cardGap;
    s.addShape(pres.shapes.RECTANGLE, {
      x: rightX, y: 1.65, w: cardW, h: 1.5,
      fill: { color: C.greenBg }, line: { color: C.green, width: 1 }, rectRadius: 0.05
    });
    s.addImage({ data: ic.check, x: rightX + 0.15, y: 1.8, w: 0.3, h: 0.3 });
    s.addText("データで判断", {
      x: rightX + 0.55, y: 1.75, w: cardW - 0.7, h: 0.3,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.green, shrinkText: true
    });
    s.addText("「月20時間削減、人件費換算10万円」\n→ 予算継続・拡大承認", {
      x: rightX + 0.2, y: 2.2, w: cardW - 0.4, h: 0.8,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textBody, lineSpacingMultiple: 1.3, shrinkText: true
    });

    // Stat box
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.5, w: L.W - L.mx * 2, h: 0.55,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    s.addImage({ data: ic.chart, x: L.mx + 0.2, y: 3.6, w: 0.25, h: 0.25 });
    s.addText("統計: 85%の従業員がAIで週1-7時間の節約を報告", {
      x: L.mx + 0.55, y: 3.5, w: L.W - L.mx * 2 - 0.75, h: 0.55,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 4: KPI1 - TIME SAVED
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "KPI①: 削減時間", "KPI 1");
    addFooter(s, 4, T);

    // 3-step flow
    const steps = [
      { label: "STEP 1", desc: "作業開始時刻\nを記録", color: C.accent, bg: C.accentLight },
      { label: "STEP 2", desc: "AI使用後の\n完了時刻を記録", color: C.green, bg: C.greenBg },
      { label: "STEP 3", desc: "差分 =\n削減時間", color: C.amber, bg: C.amberBg },
    ];

    const stepW = 2.3;
    const stepGap = 0.5;
    const totalStepW = stepW * 3 + stepGap * 2;
    const startStepX = (L.W - totalStepW) / 2;

    steps.forEach((st, i) => {
      const x = startStepX + i * (stepW + stepGap);
      const y = 0.85;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: stepW, h: 1.5,
        fill: { color: st.bg }, line: { color: st.color, width: 1 }, rectRadius: 0.05
      });
      s.addText(st.label, {
        x, y: y + 0.1, w: stepW, h: 0.3,
        fontSize: F.size.label, fontFace: F.sans, bold: true,
        color: st.color, align: "center", shrinkText: true
      });
      s.addText(st.desc, {
        x: x + 0.1, y: y + 0.45, w: stepW - 0.2, h: 0.8,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, align: "center", lineSpacingMultiple: 1.3, shrinkText: true
      });
      if (i < 2) {
        s.addImage({
          data: ic.chevron,
          x: x + stepW + (stepGap - 0.2) / 2,
          y: y + 0.55, w: 0.2, h: 0.2
        });
      }
    });

    // Excel template example
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 2.65, w: L.W - L.mx * 2, h: 0.55,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    s.addText("Excelテンプレート例: 日付 | 業務名 | 開始時刻 | 終了時刻 | 従来所要時間 | 差分", {
      x: L.mx + 0.2, y: 2.65, w: L.W - L.mx * 2 - 0.4, h: 0.55,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", shrinkText: true
    });

    // Stats & Point
    s.addImage({ data: ic.bulb, x: L.mx, y: 3.5, w: 0.22, h: 0.22 });
    s.addText("最初の1週間はベースライン計測に使う | 週5-7時間節約が平均的な効果", {
      x: L.mx + 0.3, y: 3.45, w: L.W - L.mx * 2 - 0.35, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans, italic: true,
      color: C.textLight, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 5: KPI2 - AI USAGE FREQUENCY
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "KPI②: AI活用頻度", "KPI 2");
    addFooter(s, 5, T);

    // Definition box
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.85, w: L.W - L.mx * 2, h: 0.55,
      fill: { color: C.accentLight }
    });
    s.addText("1日何回AIを使ったか。段階的に目標を上げていく", {
      x: L.mx + 0.2, y: 0.85, w: L.W - L.mx * 2 - 0.4, h: 0.55,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", shrinkText: true
    });

    // Phase cards
    const phases = [
      { label: "初月", desc: "1日3回", sub: "習慣づけ", color: C.accent, bg: C.accentLight },
      { label: "2ヶ月目", desc: "1日5回", sub: "定着", color: C.amber, bg: C.amberBg },
      { label: "3ヶ月目", desc: "1日10回", sub: "自然に使える", color: C.green, bg: C.greenBg },
    ];

    const cardW = 2.5;
    const cardGap = 0.3;
    const totalCardW = cardW * 3 + cardGap * 2;
    const startCardX = (L.W - totalCardW) / 2;

    phases.forEach((p, i) => {
      const x = startCardX + i * (cardW + cardGap);
      const y = 1.7;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 1.6,
        fill: { color: p.bg }, line: { color: p.color, width: 1 }, rectRadius: 0.05
      });
      s.addText(p.label, {
        x, y: y + 0.1, w: cardW, h: 0.35,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: p.color, align: "center", shrinkText: true
      });
      s.addText(p.desc, {
        x, y: y + 0.5, w: cardW, h: 0.35,
        fontSize: F.size.h2, fontFace: F.sans, bold: true,
        color: C.textDark, align: "center", shrinkText: true
      });
      s.addText(p.sub, {
        x, y: y + 0.95, w: cardW, h: 0.35,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, align: "center", shrinkText: true
      });

      if (i < 2) {
        s.addImage({
          data: ic.chevron,
          x: x + cardW + (cardGap - 0.2) / 2,
          y: y + 0.55, w: 0.2, h: 0.2
        });
      }
    });

    // Measurement method
    s.addImage({ data: ic.bulb, x: L.mx, y: 3.6, w: 0.22, h: 0.22 });
    s.addText("計測方法: 退勤前1分メモ。段階を踏むのがポイント", {
      x: L.mx + 0.3, y: 3.55, w: L.W - L.mx * 2 - 0.35, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans, italic: true,
      color: C.textLight, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 6: KPI3 - OUTPUT QUALITY
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "KPI③: アウトプット品質", "KPI 3");
    addFooter(s, 6, T);

    const axes = [
      {
        ic: ic.file, num: "1", label: "手戻り率",
        desc: "AI使用前後で修正回数が減ったか\n提出→差し戻し回数をカウント",
        color: C.accent, bg: C.accentLight
      },
      {
        ic: ic.users, num: "2", label: "上司修正回数",
        desc: "赤ペンが入った箇所数を記録\n指摘が減れば品質向上の証拠",
        color: C.green, bg: C.greenBg
      },
      {
        ic: ic.trophy, num: "3", label: "クライアント満足度",
        desc: "提案への反応をヒアリングまたはアンケート\nポジティブ評価の変化を追跡",
        color: C.amber, bg: C.amberBg
      },
    ];

    axes.forEach((a, i) => {
      const y = 0.85 + i * 1.1;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.9,
        fill: { color: a.bg }, rectRadius: 0.05
      });
      s.addText(a.num, {
        x: L.mx + 0.15, y: y + 0.15, w: 0.45, h: 0.45,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: a.color }, shape: pres.shapes.OVAL, shrinkText: true
      });
      s.addImage({ data: a.ic, x: L.mx + 0.7, y: y + 0.2, w: 0.3, h: 0.3 });
      s.addText(a.label, {
        x: L.mx + 1.1, y: y + 0.1, w: 3.5, h: 0.35,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: a.color, shrinkText: true
      });
      s.addText(a.desc, {
        x: L.mx + 1.1, y: y + 0.45, w: L.W - L.mx * 2 - 1.3, h: 0.4,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, lineSpacingMultiple: 1.2, shrinkText: true
      });
    });

    // Core question
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.15, w: L.W - L.mx * 2, h: 0.45,
      fill: { color: C.navy }, rectRadius: 0.05
    });
    s.addText("核心の問い: 「AI使用前後で修正回数が減ったか？」", {
      x: L.mx + 0.2, y: 4.15, w: L.W - L.mx * 2 - 0.4, h: 0.45,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.white, valign: "middle", align: "center", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 7: MEASUREMENT TEMPLATE
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "効果測定テンプレート（週次記録シート）");
    addFooter(s, 7, T);

    // Table
    const tableX = L.mx;
    const tableY = 0.85;
    const colWidths = [1.8, 1.4, 1.4, 1.2, 2.7];
    const rowH = 0.5;
    const headers = ["業務名", "従来時間", "AI後時間", "削減率", "気づき"];

    // Header row
    let cx = tableX;
    headers.forEach((h, i) => {
      s.addShape(pres.shapes.RECTANGLE, {
        x: cx, y: tableY, w: colWidths[i], h: rowH,
        fill: { color: C.navy }
      });
      s.addText(h, {
        x: cx, y: tableY, w: colWidths[i], h: rowH,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle", shrinkText: true
      });
      cx += colWidths[i];
    });

    // Data rows
    const rows = [
      ["メール作成", "15分", "5分", "67%", "定型文は特に効果大"],
      ["議事録要約", "30分", "8分", "73%", "音声録音と組合せると最強"],
      ["提案書下書き", "60分", "20分", "67%", "構成案から作らせるのがコツ"],
    ];

    rows.forEach((row, ri) => {
      cx = tableX;
      const ry = tableY + (ri + 1) * rowH;
      const bgColor = ri % 2 === 0 ? C.offWhite : C.white;
      row.forEach((cell, ci) => {
        s.addShape(pres.shapes.RECTANGLE, {
          x: cx, y: ry, w: colWidths[ci], h: rowH,
          fill: { color: bgColor }, line: { color: C.border, width: 0.5 }
        });
        s.addText(cell, {
          x: cx, y: ry, w: colWidths[ci], h: rowH,
          fontSize: ci === 4 ? F.size.label : F.size.body, fontFace: F.sans,
          bold: ci === 3,
          color: ci === 3 ? C.green : (ci === 4 ? C.textLight : C.textBody),
          align: "center", valign: "middle", shrinkText: true
        });
        cx += colWidths[ci];
      });
    });

    // Info box
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.2, w: L.W - L.mx * 2, h: 0.8,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    s.addImage({ data: ic.clipboard, x: L.mx + 0.2, y: 3.35, w: 0.3, h: 0.3 });
    s.addText("記入: 金曜の退勤前5分 | フォーマット: Excel / スプレッドシート / Notion", {
      x: L.mx + 0.65, y: 3.2, w: L.W - L.mx * 2 - 0.85, h: 0.8,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", lineSpacingMultiple: 1.3, shrinkText: true
    });

    // Note
    s.addText("「気づき」列がチーム内ナレッジ共有に化ける。5列以上に増やさない", {
      x: L.mx, y: 4.2, w: L.W - L.mx * 2, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans, italic: true,
      color: C.textLight, shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 8: 40% REWORK PROBLEM
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "節約時間の40%がやり直しで消える");
    addFooter(s, 8, T);

    // Big number
    s.addText("40%", {
      x: L.mx, y: 0.75, w: 2.5, h: 1.5,
      fontSize: 60, fontFace: F.sans, bold: true,
      color: C.red, align: "center", valign: "middle", shrinkText: true
    });
    s.addText("がやり直しで\n消えている", {
      x: L.mx + 2.5, y: 0.75, w: 3, h: 1.5,
      fontSize: F.size.h2, fontFace: F.sans, bold: true,
      color: C.textDark, valign: "middle", lineSpacingMultiple: 1.3, shrinkText: true
    });

    // Stat detail
    s.addShape(pres.shapes.RECTANGLE, {
      x: 6.0, y: 0.85, w: 3.3, h: 1.2,
      fill: { color: C.redBg }, rectRadius: 0.05
    });
    s.addText("週5-7時間節約\n→ うち2-3時間がロス", {
      x: 6.2, y: 0.85, w: 2.9, h: 1.2,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.red, valign: "middle", align: "center", lineSpacingMultiple: 1.3, shrinkText: true
    });

    // 3 causes
    const causes = [
      {
        ic: ic.timesCircle, label: "プロンプトが雑",
        desc: "目的が不明確なまま投げる",
        color: C.red, bg: C.redBg
      },
      {
        ic: ic.search, label: "ファクトチェックしない",
        desc: "AIの嘘をそのまま使う",
        color: C.amber, bg: C.amberBg
      },
      {
        ic: ic.warn, label: "AIに丸投げ",
        desc: "自分の判断を放棄する",
        color: C.accent, bg: C.accentLight
      },
    ];

    causes.forEach((c, i) => {
      const y = 2.5 + i * 0.7;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.55,
        fill: { color: c.bg }, rectRadius: 0.05
      });
      s.addImage({ data: c.ic, x: L.mx + 0.15, y: y + 0.12, w: 0.25, h: 0.25 });
      s.addText(`原因${i + 1}: ${c.label}`, {
        x: L.mx + 0.5, y, w: 3.0, h: 0.55,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: c.color, valign: "middle", shrinkText: true
      });
      s.addText(c.desc, {
        x: L.mx + 3.5, y, w: L.W - L.mx * 2 - 3.7, h: 0.55,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, valign: "middle", shrinkText: true
      });
    });
  }

  // ============================================================
  // SLIDE 9: 3 SOLUTIONS TO REDUCE REWORK
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "やり直しを減らす3つの対策");
    addFooter(s, 9, T);

    const solutions = [
      {
        ic: ic.target, num: "1",
        label: "目的を明確にしてからAIに投げる",
        desc: "「誰に」「何を」「どうしたい」を必ず書く\nこの3点をプロンプトに入れるだけで精度が劇的に変わる",
        color: C.accent, bg: C.accentLight
      },
      {
        ic: ic.shield, num: "2",
        label: "出力は必ず人間がチェック",
        desc: "数字・固有名詞・論理の飛躍を確認\n全文精読は不要。危険ポイントだけチェック",
        color: C.green, bg: C.greenBg
      },
      {
        ic: ic.comments, num: "3",
        label: "「もっと具体的に」と追加指示する習慣",
        desc: "1回で完璧は無理。2-3往復の対話で磨く\n→ 40%のロスを10%以下に下げられる",
        color: C.amber, bg: C.amberBg
      },
    ];

    solutions.forEach((sol, i) => {
      const y = 0.85 + i * 1.15;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.95,
        fill: { color: sol.bg }, rectRadius: 0.05
      });
      s.addText(sol.num, {
        x: L.mx + 0.15, y: y + 0.15, w: 0.45, h: 0.45,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: sol.color }, shape: pres.shapes.OVAL, shrinkText: true
      });
      s.addImage({ data: sol.ic, x: L.mx + 0.7, y: y + 0.2, w: 0.3, h: 0.3 });
      s.addText(sol.label, {
        x: L.mx + 1.1, y: y + 0.05, w: L.W - L.mx * 2 - 1.3, h: 0.35,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: sol.color, shrinkText: true
      });
      s.addText(sol.desc, {
        x: L.mx + 1.1, y: y + 0.4, w: L.W - L.mx * 2 - 1.3, h: 0.5,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, lineSpacingMultiple: 1.2, shrinkText: true
      });
    });
  }

  // ============================================================
  // SLIDE 10: SUCCESS PATTERNS
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "成功する組織の共通点");
    addFooter(s, 10, T);

    const patterns = [
      { ic: ic.userTie, label: "トップが率先して使う", desc: "経営層が自ら使う姿を見せる", color: C.accent, bg: C.accentLight },
      { ic: ic.heart, label: "強制しない", desc: "義務ではなく環境を整える", color: C.red, bg: C.redBg },
      { ic: ic.share, label: "成功事例を社内共有", desc: "Slack/Teamsで「便利だった」を投稿", color: C.amber, bg: C.amberBg },
      { ic: ic.seedling, label: "小さく始めて大きく育てる", desc: "1チーム→全社に横展開", color: C.green, bg: C.greenBg },
    ];

    const cardW = 3.9;
    const cardH = 1.1;
    const gapX = 0.4;
    const gapY = 0.2;

    patterns.forEach((p, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = L.mx + col * (cardW + gapX);
      const y = 0.85 + row * (cardH + gapY);

      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: cardH,
        fill: { color: p.bg }, rectRadius: 0.05
      });
      s.addImage({ data: p.ic, x: x + 0.2, y: y + 0.15, w: 0.3, h: 0.3 });
      s.addText(p.label, {
        x: x + 0.6, y: y + 0.1, w: cardW - 0.8, h: 0.3,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: p.color, shrinkText: true
      });
      s.addText(p.desc, {
        x: x + 0.6, y: y + 0.45, w: cardW - 0.8, h: 0.5,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, lineSpacingMultiple: 1.2, shrinkText: true
      });
    });

    // Stats bar
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.5, w: L.W - L.mx * 2, h: 0.85,
      fill: { color: C.lightGray }, rectRadius: 0.05
    });
    s.addText("AI導入成功率", {
      x: L.mx + 0.2, y: 3.5, w: 2.0, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans, bold: true,
      color: C.textDark, valign: "middle", shrinkText: true
    });

    const stats = [
      { label: "テクノロジー", value: "88%", color: C.green },
      { label: "金融", value: "83%", color: C.accent },
      { label: "製造", value: "75%", color: C.amber },
    ];
    const statW = 2.5;
    const statStartX = L.mx + 0.3;
    stats.forEach((st, i) => {
      const x = statStartX + i * statW;
      s.addText(st.value, {
        x, y: 3.85, w: 1.0, h: 0.4,
        fontSize: F.size.h2, fontFace: F.sans, bold: true,
        color: st.color, valign: "middle", shrinkText: true
      });
      s.addText(st.label, {
        x: x + 1.0, y: 3.85, w: 1.5, h: 0.4,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, valign: "middle", shrinkText: true
      });
    });

    // SME note
    s.addImage({ data: ic.bulb, x: L.mx, y: 4.55, w: 0.22, h: 0.22 });
    s.addText("中小企業のAI導入率はまだ10%未満。今始めれば先行者利益を取れる", {
      x: L.mx + 0.3, y: 4.5, w: L.W - L.mx * 2 - 0.35, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans, italic: true,
      color: C.textLight, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 11: SUMMARY
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s);
    addTitle(s, "まとめ");
    addFooter(s, 11, T);

    const points = [
      { ic: ic.target, text: "KPIは3つ: 削減時間・AI活用頻度・アウトプット品質", color: C.accent },
      { ic: ic.table, text: "効果測定テンプレートで週次記録（金曜5分）", color: C.green },
      { ic: ic.redo, text: "40%ロスは「目的明確化＋チェック＋追加指示」で防ぐ", color: C.red },
      { ic: ic.rocket, text: "成功組織は「トップが使い、強制せず、成功を共有し、小さく始める」", color: C.accent },
    ];

    points.forEach((p, i) => {
      const y = 0.85 + i * 0.75;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.6,
        fill: { color: C.offWhite }, line: { color: C.border, width: 0.5 }, rectRadius: 0.05
      });
      s.addImage({ data: p.ic, x: L.mx + 0.2, y: y + 0.15, w: 0.3, h: 0.3 });
      s.addText(p.text, {
        x: L.mx + 0.65, y, w: L.W - L.mx * 2 - 0.85, h: 0.6,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: p.color, valign: "middle", shrinkText: true
      });
    });

    // Test info
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.95, w: L.W - L.mx * 2, h: 0.5,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    s.addImage({ data: ic.checkBlue, x: L.mx + 0.2, y: 4.05, w: 0.25, h: 0.25 });
    s.addText("確認テスト: 5問中4問正解(80%)で修了", {
      x: L.mx + 0.55, y: 3.95, w: L.W - L.mx * 2 - 0.75, h: 0.5,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 12: END (Navy background)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };
    s.addImage({ data: ic.check, x: (L.W - 0.6) / 2, y: 1.2, w: 0.6, h: 0.6 });
    s.addText("P-04 修了", {
      x: 0.5, y: 2.0, w: 9, h: 0.7,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center", shrinkText: true
    });
    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 2.85, w: 3, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });
    s.addText("数字で語れるAI活用者になろう", {
      x: 0.5, y: 3.05, w: 9, h: 0.45,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", shrinkText: true
    });
    s.addText("次のステップ: P-05 Pack6総まとめ", {
      x: 0.5, y: 3.85, w: 9, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textMuted, align: "center", shrinkText: true
    });
  }

  // Write file
  const outPath = __dirname + "/スライド.pptx";
  await pres.writeFile({ fileName: outPath });
  console.log("Generated:", outPath);
}

main().catch(e => { console.error(e); process.exit(1); });
