const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const {
  FaBullseye, FaGraduationCap, FaHandshake, FaServer,
  FaArrowRight, FaYenSign, FaHeadset, FaUsers, FaRocket,
  FaCog, FaShieldAlt, FaLaptopCode, FaChartLine, FaComments,
  FaClipboardCheck, FaUserTie, FaTools, FaFileAlt
} = require("react-icons/fa");

function renderIconSvg(Icon, color, size = 256) {
  return ReactDOMServer.renderToStaticMarkup(React.createElement(Icon, { color, size: String(size) }));
}
async function icon(Icon, color, size = 256) {
  const svg = renderIconSvg(Icon, color, size);
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

// Theme: Tech Innovation
const T = {
  blue: "0066FF",
  cyan: "00DDFF",
  dark: "0A0E1A",
  darkCard: "141B2D",
  darkLight: "1A2236",
  white: "FFFFFF",
  gray: "8892A8",
  lightGray: "C0C8D8",
  accentGlow: "0066FF",
};

// Helper: fresh shadow each time (pptxgenjs mutates)
const mkShadow = () => ({ type: "outer", blur: 8, offset: 3, angle: 135, color: "000000", opacity: 0.25 });

// Helper: accent line at top of slide
function addTopLine(slide) {
  // Gradient-like effect: two overlapping lines
  slide.addShape("rect", { x: 0, y: 0, w: 10, h: 0.04, fill: { color: T.blue } });
  slide.addShape("rect", { x: 0, y: 0, w: 3.5, h: 0.04, fill: { color: T.cyan } });
}

// Helper: slide number
function addSlideNum(slide, num, total) {
  slide.addText(`${num} / ${total}`, {
    x: 8.5, y: 5.25, w: 1.2, h: 0.3, fontSize: 9, fontFace: "Arial",
    color: T.gray, align: "right", margin: 0
  });
}

async function main() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "Gorilla Knowledge";
  pres.title = "AI導入・活用 総合サービスのご案内";

  const TOTAL = 6;

  // ===== SLIDE 1: 私たちのAI導入の考え方 =====
  let s1 = pres.addSlide();
  s1.background = { color: T.dark };
  addTopLine(s1);
  addSlideNum(s1, 1, TOTAL);

  const iconTarget = await icon(FaBullseye, "#00DDFF");
  s1.addImage({ data: iconTarget, x: 4.5, y: 0.3, w: 0.55, h: 0.55 });

  s1.addText("私たちのAI導入の考え方", {
    x: 0.5, y: 0.9, w: 9, h: 0.65, fontSize: 34, fontFace: "Arial Black",
    color: T.white, align: "center", margin: 0
  });

  // Cyan underline accent
  s1.addShape("rect", { x: 3.8, y: 1.6, w: 2.4, h: 0.035, fill: { color: T.cyan } });

  s1.addText("「とりあえずAI入れましょう」はやりません。", {
    x: 0.5, y: 1.85, w: 9, h: 0.45, fontSize: 17, fontFace: "Arial",
    color: T.cyan, align: "center", bold: true, margin: 0
  });

  // 3 step cards
  const steps = [
    { n: "01", title: "経営目標の\nヒアリング", desc: "売上・コスト・生産性\n何を改善したいのか", ic: FaComments },
    { n: "02", title: "目標設定", desc: "AIで解決すべき課題と\n達成すべき数値目標を明確化", ic: FaChartLine },
    { n: "03", title: "導入設計", desc: "目標に最適なサービスを\nご提案", ic: FaRocket },
  ];
  const cw = 2.65, cg = 0.35, cx0 = (10 - (cw * 3 + cg * 2)) / 2;
  for (let i = 0; i < 3; i++) {
    const x = cx0 + i * (cw + cg);
    s1.addShape("rect", { x, y: 2.55, w: cw, h: 2.15, fill: { color: T.darkCard },
      line: { color: "1E2A45", width: 1 } });
    // Number badge
    s1.addShape("rect", { x: x + 0.15, y: 2.7, w: 0.55, h: 0.35, fill: { color: T.blue },
      rectRadius: 0.04 });
    s1.addText(steps[i].n, { x: x + 0.15, y: 2.7, w: 0.55, h: 0.35, fontSize: 14,
      fontFace: "Inter", color: T.white, bold: true, align: "center", valign: "middle", margin: 0 });
    // Icon
    const sIcon = await icon(steps[i].ic, "#00DDFF");
    s1.addImage({ data: sIcon, x: x + cw - 0.55, y: 2.7, w: 0.35, h: 0.35 });
    // Title
    s1.addText(steps[i].title, { x: x + 0.15, y: 3.2, w: cw - 0.3, h: 0.55,
      fontSize: 15, fontFace: "Arial", color: T.white, bold: true, margin: 0 });
    // Desc
    s1.addText(steps[i].desc, { x: x + 0.15, y: 3.8, w: cw - 0.3, h: 0.7,
      fontSize: 10.5, fontFace: "Arial", color: T.gray, margin: 0 });
  }

  s1.addText("「AIを入れること」がゴールではなく、「経営課題を解決すること」がゴールです。", {
    x: 0.5, y: 4.95, w: 9, h: 0.35, fontSize: 12, fontFace: "Arial",
    color: T.lightGray, align: "center", margin: 0
  });

  // ===== SLIDE 2: お悩み診断 =====
  let s2 = pres.addSlide();
  s2.background = { color: T.dark };
  addTopLine(s2);
  addSlideNum(s2, 2, TOTAL);

  s2.addText("あなたの会社、どこで止まっていますか？", {
    x: 0.5, y: 0.35, w: 9, h: 0.65, fontSize: 30, fontFace: "Arial Black",
    color: T.white, align: "center", margin: 0
  });
  s2.addShape("rect", { x: 3.5, y: 1.05, w: 3, h: 0.035, fill: { color: T.cyan } });

  const cards = [
    { problem: "社員がAIを\n全く使えない", solution: "AI研修", color: T.blue, ic: FaGraduationCap },
    { problem: "AI分かる人がいない\n推進できる人材がほしい", solution: "AI伴走支援", color: "10B981", ic: FaHandshake },
    { problem: "AIを使える環境が\nそもそも整っていない", solution: "AIインフラ整備", color: "8B5CF6", ic: FaServer },
  ];
  const cardW = 2.65, cardH = 3.3, cardGap = 0.4;
  const cardX0 = (10 - (cardW * 3 + cardGap * 2)) / 2;
  for (let i = 0; i < 3; i++) {
    const x = cardX0 + i * (cardW + cardGap);
    // Card bg
    s2.addShape("rect", { x, y: 1.45, w: cardW, h: cardH, fill: { color: T.darkCard },
      line: { color: "1E2A45", width: 1 } });
    // Top color accent
    s2.addShape("rect", { x, y: 1.45, w: cardW, h: 0.05, fill: { color: cards[i].color } });
    // Icon
    const cIcon = await icon(cards[i].ic, "#" + cards[i].color);
    s2.addImage({ data: cIcon, x: x + cardW / 2 - 0.3, y: 1.75, w: 0.6, h: 0.6 });
    // Problem text
    s2.addText(cards[i].problem, { x: x + 0.15, y: 2.5, w: cardW - 0.3, h: 0.7,
      fontSize: 12, fontFace: "Arial", color: T.lightGray, align: "center", valign: "middle", margin: 0 });
    // Arrow
    const arrowIc = await icon(FaArrowRight, "#" + cards[i].color);
    s2.addImage({ data: arrowIc, x: x + cardW / 2 - 0.15, y: 3.35, w: 0.3, h: 0.3 });
    // Solution label
    s2.addText(cards[i].solution, { x: x + 0.15, y: 3.8, w: cardW - 0.3, h: 0.5,
      fontSize: 20, fontFace: "Arial Black", color: cards[i].color, align: "center", margin: 0 });
  }

  // ===== SLIDE 3: AI研修 =====
  let s3 = pres.addSlide();
  s3.background = { color: T.dark };
  addTopLine(s3);
  addSlideNum(s3, 3, TOTAL);

  const gradIcon = await icon(FaGraduationCap, "#0066FF");
  s3.addImage({ data: gradIcon, x: 0.5, y: 0.2, w: 0.4, h: 0.4 });
  s3.addText("サービス①", { x: 1.0, y: 0.15, w: 1.5, h: 0.5, fontSize: 13,
    fontFace: "Arial", color: T.cyan, bold: true, margin: 0 });
  s3.addText("AI研修", { x: 2.3, y: 0.15, w: 3, h: 0.5, fontSize: 28,
    fontFace: "Arial Black", color: T.white, margin: 0 });

  // Price badge top right
  s3.addShape("rect", { x: 6.2, y: 0.15, w: 3.5, h: 0.5, fill: { color: T.blue },
    rectRadius: 0.04 });
  s3.addText("年間40万円/人（助成金で実質16万円）", { x: 6.2, y: 0.15, w: 3.5, h: 0.5,
    fontSize: 12, fontFace: "Arial", color: T.white, bold: true, align: "center", valign: "middle", margin: 0 });

  // Left card: こんな企業に + 提供内容
  s3.addShape("rect", { x: 0.5, y: 0.85, w: 4.3, h: 1.55, fill: { color: T.darkCard },
    line: { color: "1E2A45", width: 1 } });
  s3.addText("こんな企業に", { x: 0.7, y: 0.92, w: 3, h: 0.3, fontSize: 13,
    fontFace: "Arial", color: T.cyan, bold: true, margin: 0 });
  s3.addText([
    { text: "社員のAIリテラシーにバラつきがある", options: { bullet: true, breakLine: true } },
    { text: "「ChatGPTって何？」という社員がまだいる", options: { bullet: true, breakLine: true } },
    { text: "全社員に最低限のAI知識を持たせたい", options: { bullet: true } },
  ], { x: 0.7, y: 1.25, w: 3.9, h: 1.0, fontSize: 10, fontFace: "Arial", color: T.lightGray, margin: 0 });

  // Right card: 提供内容
  s3.addShape("rect", { x: 5.2, y: 0.85, w: 4.3, h: 1.55, fill: { color: T.darkCard },
    line: { color: "1E2A45", width: 1 } });
  s3.addText("提供内容", { x: 5.4, y: 0.92, w: 3, h: 0.3, fontSize: 13,
    fontFace: "Arial", color: T.cyan, bold: true, margin: 0 });
  s3.addText([
    { text: "AI入門〜応用まで全コース完備", options: { bullet: true, breakLine: true } },
    { text: "業種・職種に合わせてカスタマイズ", options: { bullet: true, breakLine: true } },
    { text: "eラーニング（1コース約10分）", options: { bullet: true, breakLine: true } },
    { text: "LMS完備 / 修了テスト付き", options: { bullet: true } },
  ], { x: 5.4, y: 1.25, w: 3.9, h: 1.0, fontSize: 10, fontFace: "Arial", color: T.lightGray, margin: 0 });

  // 助成金 banner
  s3.addShape("rect", { x: 0.5, y: 2.65, w: 9, h: 0.45, fill: { color: T.blue } });
  s3.addText("助成金で研修費用の60%が返ってきます", {
    x: 0.5, y: 2.65, w: 9, h: 0.45, fontSize: 16, fontFace: "Arial",
    color: T.white, bold: true, align: "center", valign: "middle", margin: 0
  });

  // 助成金 table
  const grantRows = [
    [
      { text: "項目", options: { fill: { color: "0D1526" }, color: T.cyan, bold: true, fontSize: 10, fontFace: "Arial", align: "center" } },
      { text: "内容", options: { fill: { color: "0D1526" }, color: T.cyan, bold: true, fontSize: 10, fontFace: "Arial", align: "center" } },
    ],
    [
      { text: "助成率（中小企業）", options: { fontSize: 10, fontFace: "Arial", color: T.lightGray, fill: { color: T.darkCard } } },
      { text: "60%", options: { fontSize: 10, fontFace: "Arial", color: T.cyan, bold: true, fill: { color: T.darkCard } } },
    ],
    [
      { text: "1人あたり上限", options: { fontSize: 10, fontFace: "Arial", color: T.lightGray, fill: { color: "111827" } } },
      { text: "月額2万円（年間24万円）", options: { fontSize: 10, fontFace: "Arial", color: T.lightGray, fill: { color: "111827" } } },
    ],
    [
      { text: "対象企業", options: { fontSize: 10, fontFace: "Arial", color: T.lightGray, fill: { color: T.darkCard } } },
      { text: "全国・全規模", options: { fontSize: 10, fontFace: "Arial", color: T.lightGray, fill: { color: T.darkCard } } },
    ],
    [
      { text: "制度終了", options: { fontSize: 10, fontFace: "Arial", color: T.lightGray, fill: { color: "111827" } } },
      { text: "2027年3月末", options: { fontSize: 10, fontFace: "Arial", color: "FF6B6B", bold: true, fill: { color: "111827" } } },
    ],
  ];
  s3.addTable(grantRows, {
    x: 0.5, y: 3.25, w: 4.3, colW: [1.8, 2.5],
    border: { pt: 0.5, color: "1E2A45" }, rowH: [0.28, 0.28, 0.28, 0.28, 0.28],
  });

  // シミュレーション card
  s3.addShape("rect", { x: 5.2, y: 3.25, w: 4.3, h: 1.85, fill: { color: T.darkCard },
    line: { color: "1E2A45", width: 1 } });
  s3.addText("金額シミュレーション（中小・10名）", { x: 5.4, y: 3.3, w: 4, h: 0.3,
    fontSize: 12, fontFace: "Arial", color: T.cyan, bold: true, margin: 0 });
  s3.addText([
    { text: "年間利用料: ", options: { fontSize: 10, breakLine: false } },
    { text: "40万円 × 10名 = 400万円", options: { fontSize: 10, bold: true, breakLine: true } },
    { text: "助成額(60%): ", options: { fontSize: 10, breakLine: false } },
    { text: "24万円 × 10名 = 240万円", options: { fontSize: 10, bold: true, breakLine: true } },
    { text: "", options: { fontSize: 5, breakLine: true } },
    { text: "1人あたり実質負担: ", options: { fontSize: 12, breakLine: false } },
    { text: "16万円", options: { fontSize: 22, bold: true, color: T.cyan, breakLine: true } },
    { text: "", options: { fontSize: 4, breakLine: true } },
    { text: "4か月ごとに分割申請OK → 立替負担も軽減", options: { fontSize: 9, color: T.gray } },
  ], { x: 5.4, y: 3.65, w: 3.9, h: 1.35, fontFace: "Arial", color: T.lightGray, margin: 0 });

  // 導入の流れ
  s3.addText("導入の流れ：  ヒアリング → カリキュラム設計 → 受講開始 → 助成金申請サポート", {
    x: 0.5, y: 5.2, w: 9, h: 0.3, fontSize: 10, fontFace: "Arial",
    color: T.gray, align: "center", margin: 0
  });

  // ===== SLIDE 4: AI伴走支援 =====
  let s4 = pres.addSlide();
  s4.background = { color: T.dark };
  addTopLine(s4);
  addSlideNum(s4, 4, TOTAL);

  const handIcon = await icon(FaHandshake, "#10B981");
  s4.addImage({ data: handIcon, x: 0.5, y: 0.2, w: 0.4, h: 0.4 });
  s4.addText("サービス②", { x: 1.0, y: 0.15, w: 1.5, h: 0.5, fontSize: 13,
    fontFace: "Arial", color: T.cyan, bold: true, margin: 0 });
  s4.addText("AI伴走支援", { x: 2.3, y: 0.15, w: 4, h: 0.5, fontSize: 28,
    fontFace: "Arial Black", color: T.white, margin: 0 });

  // こんな企業に
  s4.addShape("rect", { x: 0.5, y: 0.8, w: 9, h: 0.85, fill: { color: T.darkCard },
    line: { color: "1E2A45", width: 1 } });
  s4.addText([
    { text: "研修はやったけど現場で活用が進まない", options: { bullet: true, breakLine: true } },
    { text: "AI分かる人がいない・相談相手がほしい", options: { bullet: true, breakLine: true } },
    { text: "AI推進できる人材を現場に入れたい", options: { bullet: true } },
  ], { x: 0.7, y: 0.9, w: 8.6, h: 0.65, fontSize: 10.5, fontFace: "Arial", color: T.lightGray, margin: 0 });

  // AI顧問 card
  s4.addShape("rect", { x: 0.5, y: 1.9, w: 4.3, h: 2.7, fill: { color: T.darkCard },
    line: { color: "1E2A45", width: 1 } });
  s4.addShape("rect", { x: 0.5, y: 1.9, w: 4.3, h: 0.45, fill: { color: "10B981" } });
  s4.addText("AI顧問プラン", { x: 0.5, y: 1.9, w: 4.3, h: 0.45, fontSize: 16,
    fontFace: "Arial", color: T.white, bold: true, align: "center", valign: "middle", margin: 0 });
  s4.addText([
    { text: "プロが顧問としてつきます", options: { bullet: true, breakLine: true } },
    { text: "定期MTGで課題整理・活用アドバイス", options: { bullet: true, breakLine: true } },
    { text: "部門別AI活用ユースケース提案", options: { bullet: true, breakLine: true } },
    { text: "プロンプトテンプレートの作成・提供", options: { bullet: true } },
  ], { x: 0.7, y: 2.5, w: 3.9, h: 1.1, fontSize: 10.5, fontFace: "Arial", color: T.lightGray, margin: 0 });
  s4.addText("月額10万円", { x: 0.5, y: 3.85, w: 4.3, h: 0.55, fontSize: 26,
    fontFace: "Arial Black", color: "10B981", align: "center", margin: 0 });

  // AI人材派遣 card
  s4.addShape("rect", { x: 5.2, y: 1.9, w: 4.3, h: 2.7, fill: { color: T.darkCard },
    line: { color: "1E2A45", width: 1 } });
  s4.addShape("rect", { x: 5.2, y: 1.9, w: 4.3, h: 0.45, fill: { color: T.blue } });
  s4.addText("AI人材派遣プラン", { x: 5.2, y: 1.9, w: 4.3, h: 0.45, fontSize: 16,
    fontFace: "Arial", color: T.white, bold: true, align: "center", valign: "middle", margin: 0 });
  s4.addText([
    { text: "AI人材を常駐/業務委託で派遣", options: { bullet: true, breakLine: true } },
    { text: "社内AI活用の推進・旗振り", options: { bullet: true, breakLine: true } },
    { text: "業務プロセス分析 → AI化の設計・実行", options: { bullet: true, breakLine: true } },
    { text: "ノウハウを社内に移管し自走へ", options: { bullet: true } },
  ], { x: 5.4, y: 2.5, w: 3.9, h: 1.1, fontSize: 10.5, fontFace: "Arial", color: T.lightGray, margin: 0 });
  s4.addText("月額30万円", { x: 5.2, y: 3.85, w: 4.3, h: 0.55, fontSize: 26,
    fontFace: "Arial Black", color: T.cyan, align: "center", margin: 0 });

  // 比較表
  const comp = [
    [
      { text: "", options: { fill: { color: "0D1526" }, fontSize: 10, fontFace: "Arial" } },
      { text: "AI顧問", options: { fill: { color: "0D1526" }, color: "10B981", bold: true, fontSize: 10, fontFace: "Arial", align: "center" } },
      { text: "AI人材派遣", options: { fill: { color: "0D1526" }, color: T.cyan, bold: true, fontSize: 10, fontFace: "Arial", align: "center" } },
    ],
    [
      { text: "関わり方", options: { bold: true, fontSize: 10, fontFace: "Arial", color: T.lightGray, fill: { color: T.darkCard } } },
      { text: "相談・アドバイス", options: { fontSize: 10, fontFace: "Arial", color: T.lightGray, fill: { color: T.darkCard }, align: "center" } },
      { text: "現場に入って実行", options: { fontSize: 10, fontFace: "Arial", color: T.lightGray, fill: { color: T.darkCard }, align: "center" } },
    ],
    [
      { text: "頻度", options: { bold: true, fontSize: 10, fontFace: "Arial", color: T.lightGray, fill: { color: "111827" } } },
      { text: "月1〜2回のMTG", options: { fontSize: 10, fontFace: "Arial", color: T.lightGray, fill: { color: "111827" }, align: "center" } },
      { text: "週2〜5日の常駐", options: { fontSize: 10, fontFace: "Arial", color: T.lightGray, fill: { color: "111827" }, align: "center" } },
    ],
    [
      { text: "向いてる企業", options: { bold: true, fontSize: 10, fontFace: "Arial", color: T.lightGray, fill: { color: T.darkCard } } },
      { text: "方向性に迷う企業", options: { fontSize: 10, fontFace: "Arial", color: T.lightGray, fill: { color: T.darkCard }, align: "center" } },
      { text: "動ける人がいない企業", options: { fontSize: 10, fontFace: "Arial", color: T.lightGray, fill: { color: T.darkCard }, align: "center" } },
    ],
  ];
  s4.addTable(comp, {
    x: 0.5, y: 4.8, w: 9, colW: [1.8, 3.6, 3.6],
    border: { pt: 0.5, color: "1E2A45" }, rowH: [0.28, 0.28, 0.28, 0.28],
  });

  // ===== SLIDE 5: AIインフラ整備 =====
  let s5 = pres.addSlide();
  s5.background = { color: T.dark };
  addTopLine(s5);
  addSlideNum(s5, 5, TOTAL);

  const srvIcon = await icon(FaServer, "#8B5CF6");
  s5.addImage({ data: srvIcon, x: 0.5, y: 0.2, w: 0.4, h: 0.4 });
  s5.addText("サービス③", { x: 1.0, y: 0.15, w: 1.5, h: 0.5, fontSize: 13,
    fontFace: "Arial", color: T.cyan, bold: true, margin: 0 });
  s5.addText("AIインフラ整備", { x: 2.3, y: 0.15, w: 5, h: 0.5, fontSize: 28,
    fontFace: "Arial Black", color: T.white, margin: 0 });

  // こんな企業に
  s5.addShape("rect", { x: 0.5, y: 0.8, w: 9, h: 0.85, fill: { color: T.darkCard },
    line: { color: "1E2A45", width: 1 } });
  s5.addText([
    { text: "「AIを導入したい」が、何から手をつけていいか分からない", options: { bullet: true, breakLine: true } },
    { text: "ChatGPTのアカウントは作ったが、それ以上進んでいない", options: { bullet: true, breakLine: true } },
    { text: "社員が日常業務でAIを当たり前に使える環境を作りたい", options: { bullet: true } },
  ], { x: 0.7, y: 0.9, w: 8.6, h: 0.65, fontSize: 10.5, fontFace: "Arial", color: T.lightGray, margin: 0 });

  // Main message banner
  s5.addShape("rect", { x: 0.5, y: 1.9, w: 9, h: 0.5, fill: { color: "8B5CF6" } });
  s5.addText("Claude Code・Cursor などの最新AIツールを基盤に、全員がAIを使える環境を構築", {
    x: 0.5, y: 1.9, w: 9, h: 0.5, fontSize: 13, fontFace: "Arial",
    color: T.white, bold: true, align: "center", valign: "middle", margin: 0
  });

  // 5 feature cards
  const infra = [
    { title: "AI開発環境\nの構築", desc: "Claude Code / Cursor /\nGitHub Copilot", ic: FaLaptopCode },
    { title: "業務フローへの\nAI組み込み", desc: "既存プロセスにAIを\n自然に組み込む", ic: FaCog },
    { title: "社内AI\nガイドライン策定", desc: "利用ルール・セキュリティ\nポリシーを整備", ic: FaShieldAlt },
    { title: "プロンプト・\nワークフロー整備", desc: "部門別テンプレート\n自動化フロー納品", ic: FaFileAlt },
    { title: "運用サポート", desc: "トラブルシューティング\nアップデート対応", ic: FaTools },
  ];
  const iW = 1.65, iGap = 0.12, iX0 = (10 - (iW * 5 + iGap * 4)) / 2;
  for (let i = 0; i < 5; i++) {
    const x = iX0 + i * (iW + iGap);
    s5.addShape("rect", { x, y: 2.65, w: iW, h: 2.0, fill: { color: T.darkCard },
      line: { color: "1E2A45", width: 1 } });
    s5.addShape("rect", { x, y: 2.65, w: iW, h: 0.04, fill: { color: "8B5CF6" } });
    const iIcon = await icon(infra[i].ic, "#8B5CF6");
    s5.addImage({ data: iIcon, x: x + iW / 2 - 0.2, y: 2.8, w: 0.4, h: 0.4 });
    s5.addText(infra[i].title, { x: x + 0.08, y: 3.25, w: iW - 0.16, h: 0.6,
      fontSize: 10, fontFace: "Arial", color: T.white, bold: true, align: "center", valign: "middle", margin: 0 });
    s5.addText(infra[i].desc, { x: x + 0.08, y: 3.85, w: iW - 0.16, h: 0.6,
      fontSize: 8.5, fontFace: "Arial", color: T.gray, align: "center", margin: 0 });
  }

  s5.addText("導入の流れ：  現状診断 → AI導入計画策定 → ツール導入・ガイドライン整備 → 社内展開・研修", {
    x: 0.5, y: 4.85, w: 9, h: 0.3, fontSize: 10.5, fontFace: "Arial",
    color: T.gray, align: "center", margin: 0
  });
  s5.addText("※ 料金はスコープに応じてお見積もり", {
    x: 0.5, y: 5.15, w: 9, h: 0.25, fontSize: 9, fontFace: "Arial",
    color: T.gray, align: "center", margin: 0
  });

  // ===== SLIDE 6: 料金まとめ =====
  let s6 = pres.addSlide();
  s6.background = { color: T.dark };
  addTopLine(s6);
  addSlideNum(s6, 6, TOTAL);

  const yenIcon = await icon(FaYenSign, "#00DDFF");
  s6.addImage({ data: yenIcon, x: 4.5, y: 0.3, w: 0.5, h: 0.5 });
  s6.addText("料金まとめ", {
    x: 0.5, y: 0.85, w: 9, h: 0.6, fontSize: 34, fontFace: "Arial Black",
    color: T.white, align: "center", margin: 0
  });
  s6.addShape("rect", { x: 4.0, y: 1.5, w: 2, h: 0.035, fill: { color: T.cyan } });

  const priceRows = [
    [
      { text: "サービス", options: { fill: { color: T.blue }, color: T.white, bold: true, fontSize: 14, fontFace: "Arial", align: "center" } },
      { text: "料金", options: { fill: { color: T.blue }, color: T.white, bold: true, fontSize: 14, fontFace: "Arial", align: "center" } },
    ],
    [
      { text: "AI研修", options: { fontSize: 14, fontFace: "Arial", color: T.white, bold: true, fill: { color: T.darkCard } } },
      { text: "年間40万円/人（助成金で実質16万円）", options: { fontSize: 14, fontFace: "Arial", color: T.lightGray, fill: { color: T.darkCard }, align: "center" } },
    ],
    [
      { text: "AI伴走支援（顧問）", options: { fontSize: 14, fontFace: "Arial", color: T.white, bold: true, fill: { color: "111827" } } },
      { text: "月額10万円", options: { fontSize: 14, fontFace: "Arial", color: T.lightGray, fill: { color: "111827" }, align: "center" } },
    ],
    [
      { text: "AI伴走支援（人材派遣）", options: { fontSize: 14, fontFace: "Arial", color: T.white, bold: true, fill: { color: T.darkCard } } },
      { text: "月額30万円", options: { fontSize: 14, fontFace: "Arial", color: T.lightGray, fill: { color: T.darkCard }, align: "center" } },
    ],
    [
      { text: "AIインフラ整備", options: { fontSize: 14, fontFace: "Arial", color: T.white, bold: true, fill: { color: "111827" } } },
      { text: "別途お見積もり", options: { fontSize: 14, fontFace: "Arial", color: T.gray, fill: { color: "111827" }, align: "center" } },
    ],
  ];
  s6.addTable(priceRows, {
    x: 1.0, y: 1.8, w: 8, colW: [3.3, 4.7],
    border: { pt: 0.5, color: "1E2A45" }, rowH: [0.5, 0.55, 0.55, 0.55, 0.55],
  });

  // CTA
  s6.addText("まずは無料ヒアリングで、貴社に最適なプランをご提案します。", {
    x: 0.5, y: 4.65, w: 9, h: 0.5, fontSize: 16, fontFace: "Arial",
    color: T.cyan, bold: true, align: "center", margin: 0
  });

  const outPath = "/Users/kurosakiyuto/Downloads/開発/gorilla-knowledge/黒崎/営業資料/サービス総合案内.pptx";
  await pres.writeFile({ fileName: outPath });
  console.log("Done: " + outPath);
}

main().catch(e => { console.error(e); process.exit(1); });
