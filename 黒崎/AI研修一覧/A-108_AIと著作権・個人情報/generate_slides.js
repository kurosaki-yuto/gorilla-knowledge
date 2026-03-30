const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const {
  FaShieldAlt, FaExclamationTriangle, FaLock, FaBalanceScale,
  FaGavel, FaCheckCircle, FaTimesCircle, FaUserSecret,
  FaBrain, FaBullseye, FaChevronRight, FaSearch,
  FaFileAlt, FaClipboardCheck, FaDatabase, FaBan,
  FaLightbulb, FaUsers, FaBookOpen, FaGlobe,
  FaKey, FaHandshake, FaFileContract, FaEye
} = require("react-icons/fa");

// =====================================================
// DESIGN SYSTEM (Consulting-grade)
// =====================================================

const C = {
  white: "FFFFFF",
  offWhite: "FAFBFC",
  lightGray: "F3F4F6",
  navy: "1B2A4A",
  navyLight: "2D4A7A",
  accent: "2563EB",
  accentLight: "DBEAFE",
  accentMid: "93C5FD",
  textDark: "111827",
  textBody: "374151",
  textMuted: "9CA3AF",
  textLight: "6B7280",
  green: "059669",
  greenBg: "D1FAE5",
  amber: "D97706",
  amberBg: "FEF3C7",
  red: "DC2626",
  redBg: "FEE2E2",
  border: "E5E7EB",
};

const F = {
  sans: "Calibri",
  size: {
    hero: 44, h1: 32, h2: 22, h3: 18, body: 16, label: 13, caption: 11, tag: 10,
  }
};

const L = {
  W: 10, H: 5.625, mx: 0.75, my: 0.5, gap: 0.3,
};

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

function addFooter(slide, pres, num, total) {
  slide.addShape(pres.shapes.LINE, {
    x: L.mx, y: L.H - 0.4, w: L.W - L.mx * 2, h: 0,
    line: { color: C.border, width: 0.5 }
  });
  slide.addText(`${num} / ${total}`, {
    x: L.W - 1.5, y: L.H - 0.38, w: 1.2, h: 0.3,
    fontSize: F.size.caption, fontFace: F.sans,
    color: C.textMuted, align: "right", margin: 0
  });
  slide.addText("A-108", {
    x: L.mx, y: L.H - 0.38, w: 2, h: 0.3,
    fontSize: F.size.caption, fontFace: F.sans,
    color: C.textMuted, align: "left", margin: 0
  });
}

function addSectionTitle(slide, pres, title, tag) {
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
    fontSize: F.size.h1, fontFace: F.sans, bold: true,
    color: C.textDark, margin: 0
  });
}

// Card helper
function addCard(slide, pres, opts) {
  const { x, y, w, h, borderColor, bgColor, title, text, iconData, iconX, iconY } = opts;

  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h,
    fill: { color: bgColor || C.white },
    line: { color: borderColor || C.border, width: 1 },
    rectRadius: 0.08
  });

  if (borderColor) {
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 0.06, h,
      fill: { color: borderColor },
      rectRadius: 0.03
    });
  }

  if (iconData) {
    slide.addImage({
      data: iconData,
      x: iconX || x + 0.2, y: iconY || y + 0.15, w: 0.35, h: 0.35
    });
  }

  if (title) {
    slide.addText(title, {
      x: x + (iconData ? 0.65 : 0.2), y: y + 0.12, w: w - 0.8, h: 0.3,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.textDark, margin: 0, valign: "middle"
    });
  }

  if (text) {
    slide.addText(text, {
      x: x + 0.2, y: y + (title ? 0.45 : 0.12), w: w - 0.4, h: h - (title ? 0.55 : 0.24),
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textBody, margin: 0, valign: "top", lineSpacing: 18
    });
  }
}

async function main() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "Gorilla Knowledge";
  pres.title = "A-108: AIと著作権・個人情報";

  // Pre-render icons
  const ic = {
    shield: await icon(FaShieldAlt, C.accent),
    warn: await icon(FaExclamationTriangle, C.amber),
    lock: await icon(FaLock, C.red),
    balance: await icon(FaBalanceScale, C.amber),
    gavel: await icon(FaGavel, C.amber),
    check: await icon(FaCheckCircle, C.green),
    times: await icon(FaTimesCircle, C.red),
    userSecret: await icon(FaUserSecret, C.red),
    brain: await icon(FaBrain, C.accent),
    target: await icon(FaBullseye, C.accent),
    search: await icon(FaSearch, C.accent),
    file: await icon(FaFileAlt, C.accent),
    clipboard: await icon(FaClipboardCheck, C.accent),
    db: await icon(FaDatabase, C.accent),
    ban: await icon(FaBan, C.red),
    bulb: await icon(FaLightbulb, C.amber),
    users: await icon(FaUsers, C.accent),
    book: await icon(FaBookOpen, C.accent),
    globe: await icon(FaGlobe, C.accent),
    key: await icon(FaKey, C.red),
    handshake: await icon(FaHandshake, C.accent),
    contract: await icon(FaFileContract, C.accent),
    eye: await icon(FaEye, C.amber),
    shieldNavy: await icon(FaShieldAlt, C.navyLight),
    checkBlue: await icon(FaCheckCircle, C.accent),
    warnRed: await icon(FaExclamationTriangle, C.red),
  };

  const T = 12;

  // ============================================================
  // SLIDE 1: TITLE (Navy background)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };

    s.addImage({ data: ic.balance, x: (L.W - 0.7) / 2, y: 1.0, w: 0.7, h: 0.7 });

    s.addText("AIと著作権・個人情報", {
      x: 0.5, y: 1.9, w: 9, h: 0.9,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center", margin: 0
    });

    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 2.95, w: 3, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });

    s.addText("AI時代に知っておくべき法的リスクと対策", {
      x: 0.5, y: 3.15, w: 9, h: 0.5,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", margin: 0
    });

    s.addText("A-108   |   全社員向け   |   20分", {
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
    addSectionTitle(s, pres, "今日のゴール");
    addFooter(s, pres, 2, T);

    const goals = [
      "AI利用時の著作権リスク（学習データの著作権、生成物の著作権）を説明できる",
      "個人情報・機密情報をAIに入力する際のリスクと対策を理解する",
      "企業としてAIを安全に利用するためのルールを設計する視点を持てる",
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
          x: L.mx + 0.8, y: y + 0.85, w: 7.2, h: 0,
          line: { color: C.border, width: 0.5, dashType: "dash" }
        });
      }
    });
  }

  // ============================================================
  // SLIDE 3: AIと著作権の全体像
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, pres, "AIと著作権 — 2つの問題を区別する", "COPYRIGHT OVERVIEW");
    addFooter(s, pres, 3, T);

    // Problem A card
    addCard(s, pres, {
      x: L.mx, y: 1.5, w: 4.0, h: 1.6,
      borderColor: C.amber, bgColor: C.amberBg,
      title: "問題A: 学習データの著作権",
      text: "他人の著作物をAIが\n学習に使うのは合法か？",
      iconData: ic.book
    });

    // Problem B card
    addCard(s, pres, {
      x: 5.25, y: 1.5, w: 4.0, h: 1.6,
      borderColor: C.accent, bgColor: C.accentLight,
      title: "問題B: 生成物の著作権",
      text: "AIが作ったものに\n著作権は発生するか？",
      iconData: ic.file
    });

    // Arrow between
    s.addText("→", {
      x: 4.3, y: 1.8, w: 0.7, h: 0.8,
      fontSize: 28, fontFace: F.sans, color: C.textMuted,
      align: "center", valign: "middle"
    });

    // Bottom note
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.5, w: 8.5, h: 0.6,
      fill: { color: C.lightGray }, rectRadius: 0.08,
      line: { color: C.border, width: 0.5, dashType: "dash" }
    });
    s.addText("この2つは別の問題 — 混同しないことが重要", {
      x: L.mx, y: 3.5, w: 8.5, h: 0.6,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.accent, align: "center", valign: "middle"
    });
  }

  // ============================================================
  // SLIDE 4: 学習データの著作権
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, pres, "学習データの著作権 — 著作権法30条の4", "TRAINING DATA");
    addFooter(s, pres, 4, T);

    addCard(s, pres, {
      x: L.mx, y: 1.5, w: 8.5, h: 0.9,
      borderColor: C.green, bgColor: C.greenBg,
      title: "日本: 原則OK — 「情報解析」目的での著作物利用は認められる",
      iconData: ic.check
    });

    addCard(s, pres, {
      x: L.mx, y: 2.6, w: 8.5, h: 0.9,
      borderColor: C.amber, bgColor: C.amberBg,
      title: "ただし例外 — 「著作権者の利益を不当に害する場合」は不可",
      iconData: ic.warn
    });

    addCard(s, pres, {
      x: L.mx, y: 3.7, w: 8.5, h: 1.0,
      borderColor: C.red, bgColor: C.redBg,
      title: "海外では訴訟が進行中",
      text: "Getty Images vs Stability AI / New York Times vs OpenAI",
      iconData: ic.globe
    });
  }

  // ============================================================
  // SLIDE 5: AI生成物の著作権
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, pres, "AI生成物に著作権はあるか？", "AI OUTPUT");
    addFooter(s, pres, 5, T);

    s.addText("人間の関与度で著作権の有無が変わる", {
      x: L.mx, y: 1.3, w: 8.5, h: 0.35,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textLight, margin: 0
    });

    // Gradient 3 blocks
    const blocks = [
      { label: "著作権なし", sub: "AIに丸投げ", color: C.red, bg: C.redBg },
      { label: "グレーゾーン", sub: "詳細指示+修正", color: C.amber, bg: C.amberBg },
      { label: "著作権あり", sub: "人間が主体", color: C.green, bg: C.greenBg },
    ];

    blocks.forEach((b, i) => {
      const x = L.mx + i * 2.95;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: 1.8, w: 2.7, h: 1.2,
        fill: { color: b.bg }, rectRadius: 0.08
      });
      s.addText(b.label, {
        x, y: 1.9, w: 2.7, h: 0.5,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: b.color, align: "center", valign: "middle"
      });
      s.addText(b.sub, {
        x, y: 2.4, w: 2.7, h: 0.45,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textBody, align: "center", valign: "middle"
      });

      if (i < 2) {
        s.addText("→", {
          x: x + 2.7, y: 2.0, w: 0.3, h: 0.6,
          fontSize: 20, fontFace: F.sans, color: C.textMuted,
          align: "center", valign: "middle"
        });
      }
    });

    // Note
    addCard(s, pres, {
      x: L.mx, y: 3.4, w: 8.5, h: 0.8,
      borderColor: C.border, bgColor: C.lightGray,
      title: "ポイント: 著作権は「人間の思想や感情を創作的に表現したもの」に発生",
      iconData: ic.bulb
    });
  }

  // ============================================================
  // SLIDE 6: 著作権侵害のリスクと対策
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, pres, "実務で注意すべき著作権リスク", "RISK & ACTION");
    addFooter(s, pres, 6, T);

    // Left: Risks
    s.addImage({ data: ic.times, x: L.mx, y: 1.55, w: 0.25, h: 0.25 });
    s.addText("リスク", {
      x: L.mx + 0.3, y: 1.55, w: 3.5, h: 0.3,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.red, margin: 0
    });

    const risks = [
      "学習データに酷似したコンテンツの出力",
      "AI生成物を「自分のオリジナル」として公表",
      "他者の著作物を入力し改変・翻案させる",
    ];

    risks.forEach((r, i) => {
      s.addText(`• ${r}`, {
        x: L.mx + 0.15, y: 1.95 + i * 0.45, w: 4.0, h: 0.4,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textBody, margin: 0
      });
    });

    // Right: Actions
    s.addImage({ data: ic.check, x: 5.25, y: 1.55, w: 0.25, h: 0.25 });
    s.addText("対策", {
      x: 5.55, y: 1.55, w: 3.5, h: 0.3,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.green, margin: 0
    });

    const actions = [
      "外部公開前に類似コンテンツをチェック",
      "「AI作成」明記の社内ルール整備",
      "他者著作物の入力は引用ルールを遵守",
    ];

    actions.forEach((a, i) => {
      s.addText(`• ${a}`, {
        x: 5.4, y: 1.95 + i * 0.45, w: 4.0, h: 0.4,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textBody, margin: 0
      });
    });

    // Divider
    s.addShape(pres.shapes.LINE, {
      x: 4.85, y: 1.5, w: 0, h: 2.0,
      line: { color: C.border, width: 1 }
    });
  }

  // ============================================================
  // SLIDE 7: 個人情報とAI
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, pres, "個人情報保護法とAI", "PRIVACY LAW");
    addFooter(s, pres, 7, T);

    // Flow: Input → Third party → Risk
    const flowItems = [
      { label: "個人情報を\nAIに入力", color: C.red },
      { label: "サービス提供者への\n「第三者提供」", color: C.amber },
      { label: "本人同意なしは\n法律違反の可能性", color: C.red },
    ];

    flowItems.forEach((f, i) => {
      const x = L.mx + i * 3.15;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: 1.4, w: 2.6, h: 1.0,
        fill: { color: C.white },
        line: { color: f.color, width: 1.5 },
        rectRadius: 0.08
      });
      s.addText(f.label, {
        x, y: 1.4, w: 2.6, h: 1.0,
        fontSize: F.size.label, fontFace: F.sans, bold: true,
        color: C.textDark, align: "center", valign: "middle"
      });

      if (i < 2) {
        s.addText("→", {
          x: x + 2.6, y: 1.6, w: 0.55, h: 0.5,
          fontSize: 22, fontFace: F.sans, color: C.accent,
          align: "center", valign: "middle"
        });
      }
    });

    // Warning card
    addCard(s, pres, {
      x: L.mx, y: 2.8, w: 8.5, h: 1.1,
      borderColor: C.red, bgColor: C.redBg,
      title: "さらに: 学習データとして利用される可能性",
      text: "多くのAIサービスはデフォルトで入力データをモデル改善に利用。\nオプトアウトしない限りデータは残る。",
      iconData: ic.warnRed
    });
  }

  // ============================================================
  // SLIDE 8: 機密情報の漏洩リスク
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, pres, "AIに入力してはいけない情報", "DO NOT INPUT");
    addFooter(s, pres, 8, T);

    const ngItems = [
      { title: "顧客の個人情報", desc: "氏名・住所・連絡先・購買履歴", ic: ic.userSecret },
      { title: "社内の機密情報", desc: "売上データ・戦略資料・未公開情報", ic: ic.lock },
      { title: "認証情報", desc: "パスワード・APIキー・トークン", ic: ic.key },
      { title: "社員の人事情報", desc: "評価・給与・健康情報", ic: ic.clipboard },
      { title: "契約情報", desc: "契約書・NDA内容", ic: ic.contract },
    ];

    ngItems.forEach((item, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const x = L.mx + col * 2.95;
      const y = 1.4 + row * 1.35;

      addCard(s, pres, {
        x, y, w: 2.7, h: 1.1,
        borderColor: C.red, bgColor: C.redBg,
        title: item.title,
        text: item.desc,
        iconData: item.ic
      });
    });
  }

  // ============================================================
  // SLIDE 9: 安全なAI利用の実践
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, pres, "安全にAIを使うための5つの実践", "5 PRACTICES");
    addFooter(s, pres, 9, T);

    const practices = [
      "匿名化・抽象化してから入力する（固有名詞→「A社」「お客様」）",
      "社内承認済みのAIツールを使う（API版はデータ学習OFF設定が可能）",
      "入力前に「外部に漏れても問題ないか？」と自問する",
      "AI生成物の外部公開前にダブルチェック（著作権+機密情報）",
      "利用ログを残す（いつ・何を・どのAIで処理したか）",
    ];

    practices.forEach((p, i) => {
      const y = 1.25 + i * 0.72;
      s.addText(String(i + 1), {
        x: L.mx, y: y + 0.05, w: 0.45, h: 0.45,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: C.accent }, shape: pres.shapes.OVAL
      });
      s.addText(p, {
        x: L.mx + 0.65, y, w: 7.8, h: 0.55,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textDark, valign: "middle", margin: 0
      });
      if (i < 4) {
        s.addShape(pres.shapes.LINE, {
          x: L.mx + 0.65, y: y + 0.6, w: 7.5, h: 0,
          line: { color: C.border, width: 0.5, dashType: "dash" }
        });
      }
    });
  }

  // ============================================================
  // SLIDE 10: 企業のAI利用ルール設計
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, pres, "AI利用ガイドラインの4つの柱", "GUIDELINE DESIGN");
    addFooter(s, pres, 10, T);

    const pillars = [
      { title: "1. 利用範囲の明確化", desc: "どの業務で・どのAIツールを使ってよいか", ic: ic.target },
      { title: "2. 入力データの分類", desc: "公開/社内限定/機密/個人情報→レベル別ルール", ic: ic.db },
      { title: "3. 生成物の取扱いルール", desc: "社内利用OK / 外部公開は承認制 / 商用は要審査", ic: ic.file },
      { title: "4. インシデント対応フロー", desc: "報告先・初動対応・再発防止を事前に設計", ic: ic.shield },
    ];

    pillars.forEach((p, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = L.mx + col * 4.45;
      const y = 1.35 + row * 1.35;

      addCard(s, pres, {
        x, y, w: 4.1, h: 1.1,
        borderColor: C.accent, bgColor: C.accentLight,
        title: p.title,
        text: p.desc,
        iconData: p.ic
      });
    });

    // Bottom note
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.2, w: 8.5, h: 0.55,
      fill: { color: C.greenBg }, rectRadius: 0.08
    });
    s.addText("ガイドラインは「禁止」ではなく「安全に活用するための枠組み」", {
      x: L.mx, y: 4.2, w: 8.5, h: 0.55,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.green, align: "center", valign: "middle"
    });
  }

  // ============================================================
  // SLIDE 11: まとめ
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, pres, "今日のまとめ", "SUMMARY");
    addFooter(s, pres, 11, T);

    const summaryItems = [
      {
        title: "1. 著作権",
        desc: "学習データと生成物の2つの問題を区別する。\n生成物の著作権は人間の関与度で変わる。",
        color: "#c7b8ea",
        ic: ic.book
      },
      {
        title: "2. 個人情報",
        desc: "外部AIへの個人情報入力は法的リスクあり。\n匿名化・承認済みツール利用を徹底。",
        color: "#f4b8c5",
        ic: ic.lock
      },
      {
        title: "3. ルール設計",
        desc: "利用範囲・データ分類・生成物ルール・\nインシデント対応の4つの柱で設計。",
        color: "#ffe6a7",
        ic: ic.clipboard
      },
    ];

    summaryItems.forEach((item, i) => {
      const y = 1.3 + i * 1.15;

      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: 8.5, h: 0.95,
        fill: { color: C.white },
        line: { color: C.border, width: 0.5 },
        rectRadius: 0.08
      });

      // Color bar left
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: 0.08, h: 0.95,
        fill: { color: item.color.replace("#", "") },
        rectRadius: 0.03
      });

      s.addImage({ data: item.ic, x: L.mx + 0.25, y: y + 0.2, w: 0.4, h: 0.4 });

      s.addText(item.title, {
        x: L.mx + 0.8, y: y + 0.08, w: 7.0, h: 0.3,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.textDark, margin: 0
      });

      s.addText(item.desc, {
        x: L.mx + 0.8, y: y + 0.4, w: 7.0, h: 0.5,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textBody, margin: 0
      });
    });
  }

  // ============================================================
  // SLIDE 12: END (Navy background)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };

    s.addText("お疲れさまでした", {
      x: 0.5, y: 1.5, w: 9, h: 0.8,
      fontSize: F.size.h1, fontFace: F.sans, bold: true,
      color: C.white, align: "center", margin: 0
    });

    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 2.45, w: 3, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });

    s.addText("このあと確認テスト（5問）があります\n80%以上の正答で修了です", {
      x: 0.5, y: 2.7, w: 9, h: 0.8,
      fontSize: F.size.h3, fontFace: F.sans,
      color: C.textMuted, align: "center", margin: 0
    });

    s.addText("AIを正しく理解して、安全に活用していきましょう", {
      x: 0.5, y: 3.7, w: 9, h: 0.5,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.accentMid, align: "center", margin: 0
    });

    s.addText("A-108: AIと著作権・個人情報", {
      x: 0.5, y: 4.5, w: 9, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textMuted, align: "center", margin: 0
    });
  }

  // ============================================================
  // SAVE
  // ============================================================
  const outPath = __dirname + "/スライド.pptx";
  await pres.writeFile({ fileName: outPath });
  console.log("Generated: " + outPath);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
