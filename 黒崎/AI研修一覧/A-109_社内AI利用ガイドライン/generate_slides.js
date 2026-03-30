const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const {
  FaShieldAlt, FaBullseye, FaExclamationTriangle, FaCheckCircle,
  FaLock, FaDatabase, FaClipboardList, FaUsers, FaBuilding,
  FaChevronRight, FaArrowRight, FaBan, FaFileAlt, FaEye,
  FaBalanceScale, FaSitemap, FaCogs, FaLightbulb, FaRocket
} = require("react-icons/fa");

// =====================================================
// CONSULTING-GRADE DESIGN SYSTEM
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

const F = { sans: "Calibri", size: { hero: 44, h1: 32, h2: 22, h3: 18, body: 16, label: 13, caption: 11, tag: 10 } };
const L = { W: 10, H: 5.625, mx: 0.75, my: 0.5, gap: 0.3 };

async function icon(Comp, color, size = 256) {
  const svg = ReactDOMServer.renderToStaticMarkup(
    React.createElement(Comp, { color: `#${color}`, size: String(size) })
  );
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

function addTopBar(slide, pres) {
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: L.W, h: 0.035, fill: { color: C.accent } });
}

function addFooter(slide, num, total) {
  slide.addShape(pres.shapes.LINE, {
    x: L.mx, y: L.H - 0.4, w: L.W - L.mx * 2, h: 0,
    line: { color: C.border, width: 0.5 }
  });
  slide.addText(`${num} / ${total}`, {
    x: L.W - 1.5, y: L.H - 0.38, w: 1.2, h: 0.3,
    fontSize: F.size.caption, fontFace: F.sans, color: C.textMuted, align: "right", margin: 0
  });
  slide.addText("A-109", {
    x: L.mx, y: L.H - 0.38, w: 2, h: 0.3,
    fontSize: F.size.caption, fontFace: F.sans, color: C.textMuted, align: "left", margin: 0
  });
}

function addSectionTitle(slide, title, tag) {
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
    fontSize: F.size.h2, fontFace: F.sans, bold: true, color: C.textDark, margin: 0, shrinkText: true
  });
}

let pres;

async function main() {
  pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "Gorilla Knowledge";
  pres.title = "A-109: 社内AI利用ガイドラインの考え方";

  const TOTAL = 12;

  // Pre-render icons
  const ic = {
    shield: await icon(FaShieldAlt, C.accent),
    target: await icon(FaBullseye, C.accent),
    warn: await icon(FaExclamationTriangle, C.amber),
    check: await icon(FaCheckCircle, C.green),
    lock: await icon(FaLock, C.red),
    db: await icon(FaDatabase, C.accent),
    clipboard: await icon(FaClipboardList, C.accent),
    users: await icon(FaUsers, C.accent),
    building: await icon(FaBuilding, C.navyLight),
    chevron: await icon(FaChevronRight, C.textMuted),
    arrow: await icon(FaArrowRight, C.accent),
    ban: await icon(FaBan, C.red),
    file: await icon(FaFileAlt, C.accent),
    eye: await icon(FaEye, C.amber),
    balance: await icon(FaBalanceScale, C.red),
    sitemap: await icon(FaSitemap, C.accent),
    cogs: await icon(FaCogs, C.accent),
    bulb: await icon(FaLightbulb, C.amber),
    rocket: await icon(FaRocket, C.green),
    lockBlue: await icon(FaLock, C.accent),
    warnRed: await icon(FaExclamationTriangle, C.red),
    shieldGreen: await icon(FaShieldAlt, C.green),
  };

  // ===== SLIDE 1: TITLE =====
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };
    if (ic.shield) s.addImage({ data: ic.shield, x: (L.W - 0.7) / 2, y: 0.9, w: 0.7, h: 0.7 });
    s.addText("社内AIガイドラインの考え方", {
      x: 0.5, y: 1.8, w: 9, h: 0.9, fontSize: 36, fontFace: F.sans, bold: true,
      color: C.white, align: "center", margin: 0
    });
    s.addShape(pres.shapes.LINE, { x: 3.5, y: 2.85, w: 3, h: 0, line: { color: C.accentMid, width: 1.5 } });
    s.addText("安全で効果的なAI活用のための第一歩", {
      x: 0.5, y: 3.05, w: 9, h: 0.5, fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", margin: 0
    });
    s.addText("A-109   |   全社員向け入門   |   20分", {
      x: 0.5, y: 4.2, w: 9, h: 0.35, fontSize: F.size.label, fontFace: F.sans,
      color: C.textMuted, align: "center", margin: 0
    });
  }

  // ===== SLIDE 2: TODAY'S GOALS =====
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    s.addText("今日のゴール", {
      x: L.mx, y: 0.35, w: 8.5, h: 0.55,
      fontSize: F.size.h1, fontFace: F.sans, bold: true, color: C.textDark, margin: 0
    });
    addFooter(s, 2, TOTAL);

    const goals = [
      "なぜ社内AI利用ガイドラインが必要かを3つの理由で説明できる",
      "ガイドラインに含めるべき主要項目（利用範囲・禁止事項・データ取扱い・承認フロー）を理解する",
      "他社のAI利用ガイドライン事例から自社への応用ポイントを整理できる"
    ];
    goals.forEach((g, i) => {
      const y = 1.25 + i * 1.15;
      s.addText(String(i + 1), {
        x: L.mx, y: y + 0.05, w: 0.55, h: 0.55,
        fontSize: F.size.h2, fontFace: F.sans, bold: true, color: C.white,
        align: "center", valign: "middle", fill: { color: C.accent }, shape: pres.shapes.OVAL
      });
      s.addText(g, {
        x: L.mx + 0.8, y, w: 7.5, h: 0.65,
        fontSize: F.size.h3, fontFace: F.sans, color: C.textDark, valign: "middle", margin: 0
      });
      if (i < goals.length - 1) {
        s.addShape(pres.shapes.LINE, {
          x: L.mx, y: y + 0.85, w: L.W - L.mx * 2, h: 0, line: { color: C.border, width: 0.5 }
        });
      }
    });
  }

  // ===== SLIDE 3: AI IN THE WORKPLACE =====
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "AIが職場に浸透する今", "BACKGROUND");
    addFooter(s, 3, TOTAL);

    // Stat cards
    const stats = [
      { value: "約70%", label: "AIツールを業務利用\n（2025年時点）", color: C.green, bg: C.greenBg },
      { value: "約40%", label: "社内ルール未整備の\n企業の割合", color: C.red, bg: C.redBg },
    ];
    stats.forEach((st, i) => {
      const x = L.mx + i * 4.5;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: 1.3, w: 4.0, h: 1.8, fill: { color: st.bg },
        line: { color: C.border, width: 0.5 }, rectRadius: 0.1
      });
      s.addText(st.value, {
        x, y: 1.5, w: 4.0, h: 0.6, fontSize: 36, fontFace: F.sans, bold: true,
        color: st.color, align: "center", margin: 0
      });
      s.addText(st.label, {
        x, y: 2.2, w: 4.0, h: 0.7, fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, align: "center", margin: 0
      });
    });

    // Key message
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.4, w: L.W - L.mx * 2, h: 0.5,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    s.addText("使う人は増えているが、ルールが追いついていない", {
      x: L.mx + 0.3, y: 3.4, w: L.W - L.mx * 2 - 0.6, h: 0.5,
      fontSize: F.size.h3, fontFace: F.sans, bold: true, color: C.accent,
      valign: "middle", margin: 0
    });

    // Usage examples
    s.addText("用途: メール下書き / 資料作成 / コード生成 / データ分析 / 議事録要約", {
      x: L.mx, y: 4.1, w: L.W - L.mx * 2, h: 0.3,
      fontSize: F.size.label, fontFace: F.sans, italic: true, color: C.textLight, margin: 0
    });
  }

  // ===== SLIDE 4: 3 REASONS =====
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    s.addText("ガイドラインが必要な3つの理由", {
      x: L.mx, y: 0.35, w: 8.5, h: 0.55,
      fontSize: F.size.h1, fontFace: F.sans, bold: true, color: C.textDark, margin: 0
    });
    addFooter(s, 4, TOTAL);

    const cards = [
      { icon: ic.lock, title: "情報漏えいリスクの防止", desc: "機密情報や個人情報の\n外部流出を防ぐ", color: C.red, bg: C.redBg },
      { icon: ic.warn, title: "品質・正確性の担保", desc: "ハルシネーションによる\n業務ミスを防ぐ", color: C.amber, bg: C.amberBg },
      { icon: ic.balance, title: "法的・倫理的リスクの回避", desc: "著作権侵害や差別的\n出力を防ぐ", color: C.accent, bg: C.accentLight },
    ];
    const cardW = 2.55, cardGap = 0.3;
    const totalW = cardW * 3 + cardGap * 2;
    const startX = (L.W - totalW) / 2;

    cards.forEach((c, i) => {
      const x = startX + i * (cardW + cardGap);
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: 1.15, w: cardW, h: 3.3, fill: { color: C.white },
        line: { color: C.border, width: 0.75 }
      });
      s.addShape(pres.shapes.RECTANGLE, { x, y: 1.15, w: cardW, h: 0.06, fill: { color: c.color } });
      if (c.icon) {
        s.addShape(pres.shapes.OVAL, { x: x + (cardW - 0.7) / 2, y: 1.55, w: 0.7, h: 0.7, fill: { color: c.bg } });
        s.addImage({ data: c.icon, x: x + (cardW - 0.4) / 2, y: 1.7, w: 0.4, h: 0.4 });
      }
      s.addText(c.title, {
        x, y: 2.5, w: cardW, h: 0.5, fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, align: "center", margin: 0
      });
      s.addShape(pres.shapes.LINE, { x: x + 0.4, y: 3.15, w: cardW - 0.8, h: 0, line: { color: C.border, width: 0.5 } });
      s.addText(c.desc, {
        x, y: 3.3, w: cardW, h: 0.8, fontSize: F.size.body, fontFace: F.sans,
        color: C.textLight, align: "center", margin: 0
      });
    });
  }

  // ===== SLIDE 5: SCOPE =====
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "主要項目① 利用範囲の定義", "ITEM 01");
    addFooter(s, 5, TOTAL);

    // Table
    const tableY = 1.3;
    const rows = [
      { level: "利用推奨", example: "アイデア出し、文章校正、議事録要約", color: C.green },
      { level: "条件付き許可", example: "顧客向け資料の下書き（要上長確認）", color: C.amber },
      { level: "利用禁止", example: "機密情報の入力、無確認での最終利用", color: C.red },
    ];
    // Header
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: tableY, w: L.W - L.mx * 2, h: 0.45, fill: { color: C.accent }
    });
    s.addText("分類", { x: L.mx, y: tableY, w: 2.5, h: 0.45, fontSize: F.size.body, fontFace: F.sans, bold: true, color: C.white, margin: [0, 0, 0, 10] });
    s.addText("例", { x: L.mx + 2.5, y: tableY, w: 6, h: 0.45, fontSize: F.size.body, fontFace: F.sans, bold: true, color: C.white, margin: [0, 0, 0, 10] });

    rows.forEach((r, i) => {
      const y = tableY + 0.45 + i * 0.6;
      const bg = i % 2 === 0 ? C.offWhite : C.white;
      s.addShape(pres.shapes.RECTANGLE, { x: L.mx, y, w: L.W - L.mx * 2, h: 0.6, fill: { color: bg } });
      s.addShape(pres.shapes.RECTANGLE, { x: L.mx, y, w: 0.06, h: 0.6, fill: { color: r.color } });
      s.addText(r.level, { x: L.mx + 0.15, y, w: 2.35, h: 0.6, fontSize: F.size.body, fontFace: F.sans, bold: true, color: r.color, valign: "middle", margin: 0 });
      s.addText(r.example, { x: L.mx + 2.5, y, w: 6, h: 0.6, fontSize: F.size.body, fontFace: F.sans, color: C.textBody, valign: "middle", margin: 0 });
    });

    // Key message
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.6, w: L.W - L.mx * 2, h: 0.5,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    s.addText("曖昧な表現を避け、具体的にどの業務にどのレベルで使えるかを示す", {
      x: L.mx + 0.3, y: 3.6, w: L.W - L.mx * 2 - 0.6, h: 0.5,
      fontSize: F.size.body, fontFace: F.sans, bold: true, color: C.accent,
      valign: "middle", margin: 0
    });
  }

  // ===== SLIDE 6: PROHIBITED ACTIONS =====
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "主要項目② 禁止事項の明確化", "ITEM 02");
    addFooter(s, 6, TOTAL);

    const items = [
      { text: "個人情報・顧客情報のAIサービスへの入力", ic: ic.lock },
      { text: "AI生成コンテンツの無断での社外公開", ic: ic.ban },
      { text: "社内承認なしでの有料AIサービスの契約", ic: ic.warnRed },
      { text: "AIを使った他者の著作物の複製・改変", ic: ic.balance },
      { text: "人事評価・採用判断をAIに委ねること", ic: ic.warnRed },
    ];
    items.forEach((item, i) => {
      const y = 1.3 + i * 0.6;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: 0.5,
        fill: { color: i % 2 === 0 ? C.redBg : C.white },
        line: { color: C.border, width: 0.5 }, rectRadius: 0.05
      });
      if (item.ic) s.addImage({ data: item.ic, x: L.mx + 0.15, y: y + 0.1, w: 0.3, h: 0.3 });
      s.addText(item.text, {
        x: L.mx + 0.6, y, w: 7.5, h: 0.5,
        fontSize: F.size.body, fontFace: F.sans, color: C.textBody, valign: "middle", margin: 0
      });
    });

    s.addText("「不適切な利用は禁止」ではなく、具体的な行為を列挙する", {
      x: L.mx, y: 4.4, w: L.W - L.mx * 2, h: 0.3,
      fontSize: F.size.label, fontFace: F.sans, italic: true, color: C.accent, margin: 0
    });
  }

  // ===== SLIDE 7: DATA HANDLING =====
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "主要項目③ データ取扱いルール", "ITEM 03");
    addFooter(s, 7, TOTAL);

    // Flow diagram
    const flowItems = [
      { label: "データを分類", color: C.accent },
      { label: "公開情報\n外部AI OK", color: C.green },
      { label: "社内限定\n社内AIのみ", color: C.amber },
      { label: "機密/個人情報\nAI禁止", color: C.red },
    ];
    const fW = 1.9, fGap = 0.35;
    const fTotal = fW * flowItems.length + fGap * (flowItems.length - 1);
    const fStart = (L.W - fTotal) / 2;

    flowItems.forEach((fi, i) => {
      const x = fStart + i * (fW + fGap);
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: 1.4, w: fW, h: 0.9, fill: { color: fi.color }, rectRadius: 0.08
      });
      s.addText(fi.label, {
        x, y: 1.4, w: fW, h: 0.9, fontSize: F.size.label, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle"
      });
      if (i === 0 && ic.arrow) {
        s.addImage({ data: ic.arrow, x: x + fW + 0.07, y: 1.72, w: 0.2, h: 0.2 });
      }
    });

    // Opt-out note
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 2.7, w: L.W - L.mx * 2, h: 0.9,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    if (ic.lockBlue) s.addImage({ data: ic.lockBlue, x: L.mx + 0.3, y: 2.9, w: 0.4, h: 0.4 });
    s.addText("オプトアウト設定の義務化", {
      x: L.mx + 0.9, y: 2.75, w: 7, h: 0.4,
      fontSize: F.size.h3, fontFace: F.sans, bold: true, color: C.accent, margin: 0
    });
    s.addText("外部AIサービスの「入力データを学習に使わない」設定を必ず有効にする", {
      x: L.mx + 0.9, y: 3.15, w: 7, h: 0.35,
      fontSize: F.size.body, fontFace: F.sans, color: C.textBody, margin: 0
    });
  }

  // ===== SLIDE 8: APPROVAL FLOW =====
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "主要項目④ 承認フロー", "ITEM 04");
    addFooter(s, 8, TOTAL);

    const steps = [
      { num: "1", label: "利用申請", desc: "AIで何をしたいかを申請" },
      { num: "2", label: "上長承認", desc: "利用範囲内かを確認" },
      { num: "3", label: "情シスチェック", desc: "データ分類を確認" },
      { num: "4", label: "利用開始", desc: "承認後にAI利用を開始" },
      { num: "5", label: "定期レビュー", desc: "月次で利用状況を確認" },
    ];
    steps.forEach((st, i) => {
      const y = 1.3 + i * 0.58;
      // Number circle
      s.addText(st.num, {
        x: L.mx, y: y + 0.04, w: 0.45, h: 0.45,
        fontSize: F.size.body, fontFace: F.sans, bold: true, color: C.white,
        align: "center", valign: "middle", fill: { color: C.accent }, shape: pres.shapes.OVAL
      });
      s.addText(st.label, {
        x: L.mx + 0.6, y, w: 2.5, h: 0.5,
        fontSize: F.size.h3, fontFace: F.sans, bold: true, color: C.textDark, valign: "middle", margin: 0
      });
      s.addText(st.desc, {
        x: L.mx + 3.2, y, w: 5, h: 0.5,
        fontSize: F.size.body, fontFace: F.sans, color: C.textBody, valign: "middle", margin: 0
      });
      if (i < steps.length - 1) {
        s.addShape(pres.shapes.LINE, {
          x: L.mx, y: y + 0.53, w: L.W - L.mx * 2, h: 0,
          line: { color: C.border, width: 0.5 }
        });
      }
    });

    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.3, w: L.W - L.mx * 2, h: 0.45,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    s.addText("利用推奨は包括承認、条件付きのみ個別承認 → フローを重くしすぎない", {
      x: L.mx + 0.3, y: 4.3, w: L.W - L.mx * 2 - 0.6, h: 0.45,
      fontSize: F.size.body, fontFace: F.sans, bold: true, color: C.accent,
      valign: "middle", margin: 0
    });
  }

  // ===== SLIDE 9: CASE STUDY 1 (ENTERPRISE) =====
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "他社事例① 大手IT企業のアプローチ", "CASE STUDY");
    addFooter(s, 9, TOTAL);

    const cases = [
      { title: "全社員AIリテラシー研修", desc: "ガイドラインの「なぜ」を丁寧に説明", ic: ic.users, bg: C.greenBg },
      { title: "社内専用AIプラットフォーム", desc: "データの外部流出リスクを根本排除", ic: ic.lockBlue, bg: C.accentLight },
      { title: "AI利用ログの記録・監査", desc: "四半期ごとに不適切利用をチェック", ic: ic.eye, bg: C.amberBg },
      { title: "AI倫理委員会の設置", desc: "技術進化に合わせて継続アップデート", ic: ic.sitemap, bg: C.accentLight },
    ];
    cases.forEach((c, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = L.mx + col * 4.35;
      const y = 1.3 + row * 1.5;

      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: 4.0, h: 1.2, fill: { color: C.white },
        line: { color: C.border, width: 0.5 }, rectRadius: 0.08
      });
      if (c.ic) {
        s.addShape(pres.shapes.OVAL, { x: x + 0.2, y: y + 0.25, w: 0.6, h: 0.6, fill: { color: c.bg } });
        s.addImage({ data: c.ic, x: x + 0.3, y: y + 0.35, w: 0.4, h: 0.4 });
      }
      s.addText(c.title, {
        x: x + 1.0, y: y + 0.15, w: 2.8, h: 0.4,
        fontSize: F.size.h3, fontFace: F.sans, bold: true, color: C.textDark, margin: 0
      });
      s.addText(c.desc, {
        x: x + 1.0, y: y + 0.6, w: 2.8, h: 0.4,
        fontSize: F.size.body, fontFace: F.sans, color: C.textLight, margin: 0
      });
    });

    s.addText("「ルールを作って終わり」ではなく、運用体制を一体で整備", {
      x: L.mx, y: 4.5, w: L.W - L.mx * 2, h: 0.3,
      fontSize: F.size.label, fontFace: F.sans, italic: true, color: C.accent, margin: 0
    });
  }

  // ===== SLIDE 10: CASE STUDY 2 (SME) =====
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "他社事例② 中小企業の段階的アプローチ", "CASE STUDY");
    addFooter(s, 10, TOTAL);

    const phases = [
      { label: "Phase 1", time: "1ヶ月目", title: "最低限の禁止事項だけ", desc: "機密・個人情報のAI入力禁止\nAI出力の無断社外公開禁止", color: C.green },
      { label: "Phase 2", time: "3ヶ月目", title: "利用実態を調査", desc: "利用範囲の分類と\nデータ取扱いルールを策定", color: C.amber },
      { label: "Phase 3", time: "6ヶ月目", title: "正式ガイドライン", desc: "承認フローと研修プログラムを\n整備してリリース", color: C.accent },
    ];
    const pW = 2.55, pGap = 0.3;
    const pTotal = pW * 3 + pGap * 2;
    const pStart = (L.W - pTotal) / 2;

    phases.forEach((p, i) => {
      const x = pStart + i * (pW + pGap);
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: 1.3, w: pW, h: 2.8, fill: { color: C.white },
        line: { color: C.border, width: 0.75 }
      });
      s.addShape(pres.shapes.RECTANGLE, { x, y: 1.3, w: pW, h: 0.06, fill: { color: p.color } });
      s.addText(`${p.label}（${p.time}）`, {
        x, y: 1.5, w: pW, h: 0.35, fontSize: F.size.tag, fontFace: F.sans, bold: true,
        color: p.color, align: "center", margin: 0
      });
      s.addText(p.title, {
        x, y: 1.9, w: pW, h: 0.5, fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, align: "center", margin: 0
      });
      s.addShape(pres.shapes.LINE, { x: x + 0.3, y: 2.5, w: pW - 0.6, h: 0, line: { color: C.border, width: 0.5 } });
      s.addText(p.desc, {
        x, y: 2.65, w: pW, h: 1.0, fontSize: F.size.body, fontFace: F.sans,
        color: C.textLight, align: "center", margin: 0
      });

      if (i < 2 && ic.chevron) {
        s.addImage({ data: ic.chevron, x: x + pW + 0.05, y: 2.4, w: 0.2, h: 0.2 });
      }
    });

    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.3, w: L.W - L.mx * 2, h: 0.45,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    s.addText("完璧を目指さず、まず始めて段階的に改善する", {
      x: L.mx + 0.3, y: 4.3, w: L.W - L.mx * 2 - 0.6, h: 0.45,
      fontSize: F.size.body, fontFace: F.sans, bold: true, color: C.accent,
      valign: "middle", margin: 0
    });
  }

  // ===== SLIDE 11: 5 STEPS =====
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "自社で始める5つのステップ", "ACTION");
    addFooter(s, 11, TOTAL);

    const steps = [
      { label: "現状把握", desc: "社員のAI利用状況を調査", color: C.green },
      { label: "リスク評価", desc: "自社にとっての最大リスクを特定", color: C.amber },
      { label: "ドラフト作成", desc: "4つの主要項目を骨子にガイドラインを起草", color: C.accent },
      { label: "パイロット運用", desc: "一部門で試行してフィードバックを収集", color: C.accent },
      { label: "全社展開", desc: "研修と合わせてガイドラインを正式リリース", color: C.green },
    ];
    steps.forEach((st, i) => {
      const y = 1.25 + i * 0.58;
      s.addText(String(i + 1), {
        x: L.mx, y: y + 0.04, w: 0.45, h: 0.45,
        fontSize: F.size.body, fontFace: F.sans, bold: true, color: C.white,
        align: "center", valign: "middle", fill: { color: st.color }, shape: pres.shapes.OVAL
      });
      s.addText(st.label, {
        x: L.mx + 0.6, y, w: 2.0, h: 0.5,
        fontSize: F.size.h3, fontFace: F.sans, bold: true, color: C.textDark, valign: "middle", margin: 0
      });
      s.addText(st.desc, {
        x: L.mx + 2.7, y, w: 5.5, h: 0.5,
        fontSize: F.size.body, fontFace: F.sans, color: C.textBody, valign: "middle", margin: 0
      });
      if (i < steps.length - 1) {
        s.addShape(pres.shapes.LINE, {
          x: L.mx, y: y + 0.53, w: L.W - L.mx * 2, h: 0,
          line: { color: C.border, width: 0.5 }
        });
      }
    });

    s.addText("定期的な見直し（少なくとも年2回）を予定に組み込む", {
      x: L.mx, y: 4.4, w: L.W - L.mx * 2, h: 0.3,
      fontSize: F.size.label, fontFace: F.sans, italic: true, color: C.accent, margin: 0
    });
  }

  // ===== SLIDE 12: SUMMARY =====
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };

    s.addText("まとめ", {
      x: 0.5, y: 0.5, w: 9, h: 0.7, fontSize: F.size.h1, fontFace: F.sans, bold: true,
      color: C.white, align: "center", margin: 0
    });

    const summary = [
      { title: "必要な理由", desc: "情報漏えい防止\n品質担保\n法的リスク回避", ic: ic.shieldGreen, color: C.green },
      { title: "主要4項目", desc: "利用範囲\n禁止事項\nデータ取扱い\n承認フロー", ic: ic.clipboard, color: C.accent },
      { title: "成功のカギ", desc: "完璧を目指さず\n段階的に整備し\n定期的に見直す", ic: ic.rocket, color: C.green },
    ];
    const sW = 2.55, sGap = 0.3;
    const sTotal = sW * 3 + sGap * 2;
    const sStart = (L.W - sTotal) / 2;

    summary.forEach((item, i) => {
      const x = sStart + i * (sW + sGap);
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: 1.5, w: sW, h: 2.8,
        fill: { color: "1F3461" }, line: { color: C.accentMid, width: 0.5 }, rectRadius: 0.08
      });
      if (item.ic) s.addImage({ data: item.ic, x: x + (sW - 0.4) / 2, y: 1.75, w: 0.4, h: 0.4 });
      s.addText(item.title, {
        x, y: 2.3, w: sW, h: 0.4, fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.accentMid, align: "center", margin: 0
      });
      s.addText(item.desc, {
        x, y: 2.8, w: sW, h: 1.2, fontSize: F.size.body, fontFace: F.sans,
        color: C.textMuted, align: "center", margin: 0
      });
    });

    s.addText("確認テストへ進んでください（5問中4問正解で修了）", {
      x: 0.5, y: 4.6, w: 9, h: 0.35, fontSize: F.size.label, fontFace: F.sans, italic: true,
      color: C.textMuted, align: "center", margin: 0
    });
  }

  // Save
  const outPath = __dirname + "/スライド.pptx";
  await pres.writeFile({ fileName: outPath });
  console.log("Generated:", outPath);
}

main().catch(err => { console.error(err); process.exit(1); });
