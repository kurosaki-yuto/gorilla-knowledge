const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const {
  FaMicrophone, FaBullseye, FaChevronRight, FaBookOpen,
  FaCogs, FaGraduationCap, FaLightbulb, FaVolumeUp,
  FaExclamationTriangle, FaCheckCircle, FaTimesCircle,
  FaDollarSign, FaGlobe, FaRobot, FaPencilAlt,
  FaLanguage, FaCode, FaShieldAlt, FaClipboardCheck,
  FaUserFriends, FaChartBar, FaPlay, FaClock,
  FaLock, FaBalanceScale, FaArrowRight, FaHeadphones,
  FaClone, FaSlidersH, FaFileAudio, FaUserShield
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
  red: "DC2626", redBg: "FEE2E2", border: "E5E7EB",
};

const F = { sans: "Calibri", size: { hero: 40, h1: 28, h2: 20, h3: 16, body: 14, label: 12, caption: 10 } };
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
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: L.W, h: 0.035, fill: { color: C.accent } });
}

function addFooter(slide, pres, num, total) {
  slide.addShape(pres.shapes.LINE, {
    x: L.mx, y: L.H - 0.4, w: L.W - L.mx * 2, h: 0,
    line: { color: C.border, width: 0.5 }
  });
  slide.addText(`${num} / ${total}`, {
    x: L.W - 1.5, y: L.H - 0.38, w: 1.2, h: 0.3,
    fontSize: F.size.caption, fontFace: F.sans, color: C.textMuted, align: "right", shrinkText: true
  });
  slide.addText("P-04", {
    x: L.mx, y: L.H - 0.38, w: 2, h: 0.3,
    fontSize: F.size.caption, fontFace: F.sans, color: C.textMuted, align: "left", shrinkText: true
  });
}

function addSectionTitle(slide, pres, title, tag) {
  if (tag) {
    slide.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.15, w: tag.length * 0.1 + 0.4, h: 0.28,
      fill: { color: C.accentLight }, rectRadius: 0.05
    });
    slide.addText(tag, {
      x: L.mx, y: 0.15, w: tag.length * 0.1 + 0.4, h: 0.28,
      fontSize: F.size.caption, fontFace: F.sans, bold: true,
      color: C.accent, align: "center", valign: "middle", shrinkText: true
    });
  }
  slide.addText(title, {
    x: L.mx, y: tag ? 0.5 : 0.15, w: 8.5, h: 0.5,
    fontSize: F.size.h1, fontFace: F.sans, bold: true,
    color: C.textDark, shrinkText: true
  });
}

async function main() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "Gorilla Knowledge";
  pres.title = "P-04: ElevenLabs完全攻略：AI音声の世界";

  const ic = {
    mic: await icon(FaMicrophone, C.accent),
    target: await icon(FaBullseye, C.accent),
    cogs: await icon(FaCogs, C.accent),
    grad: await icon(FaGraduationCap, C.accent),
    bulb: await icon(FaLightbulb, C.amber),
    volume: await icon(FaVolumeUp, C.accent),
    warn: await icon(FaExclamationTriangle, C.amber),
    check: await icon(FaCheckCircle, C.green),
    times: await icon(FaTimesCircle, C.red),
    dollar: await icon(FaDollarSign, C.accent),
    globe: await icon(FaGlobe, C.accent),
    robot: await icon(FaRobot, C.accent),
    pencil: await icon(FaPencilAlt, C.accent),
    lang: await icon(FaLanguage, C.accent),
    shield: await icon(FaShieldAlt, C.green),
    clipboard: await icon(FaClipboardCheck, C.accent),
    book: await icon(FaBookOpen, C.accent),
    warnRed: await icon(FaExclamationTriangle, C.red),
    chevron: await icon(FaChevronRight, C.textMuted),
    users: await icon(FaUserFriends, C.accent),
    chart: await icon(FaChartBar, C.accent),
    play: await icon(FaPlay, C.accent),
    clock: await icon(FaClock, C.amber),
    lock: await icon(FaLock, C.red),
    balance: await icon(FaBalanceScale, C.amber),
    arrow: await icon(FaArrowRight, C.accent),
    headphones: await icon(FaHeadphones, C.accent),
    clone: await icon(FaClone, C.accent),
    sliders: await icon(FaSlidersH, C.accent),
    fileAudio: await icon(FaFileAudio, C.accent),
    userShield: await icon(FaUserShield, C.red),
  };

  const T = 12;

  // ============================================================
  // SLIDE 1: TITLE (Navy background)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };

    s.addImage({ data: ic.mic, x: (L.W - 0.6) / 2, y: 0.9, w: 0.6, h: 0.6 });

    s.addText("ElevenLabs完全攻略", {
      x: 0.5, y: 1.7, w: 9, h: 0.8,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center", shrinkText: true
    });

    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 2.65, w: 3, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });

    s.addText("AI音声の世界", {
      x: 0.5, y: 2.85, w: 9, h: 0.45,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", shrinkText: true
    });

    s.addText("P-04   |   AI動画生成シリーズ   |   12分", {
      x: 0.5, y: 4.2, w: 9, h: 0.3,
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
    addTopBar(s, pres);
    addSectionTitle(s, pres, "今日のゴール");
    addFooter(s, pres, 2, T);

    const goals = [
      "ElevenLabsでテキストから高品質な音声を生成できる",
      "音声クローン（Instant / Professional）の仕組みと手順を理解する",
      "AI音声の倫理・法的注意点を説明できる",
    ];

    goals.forEach((g, i) => {
      const y = 1.1 + i * 1.1;
      s.addText(String(i + 1), {
        x: L.mx, y: y + 0.05, w: 0.5, h: 0.5,
        fontSize: F.size.h2, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: C.accent }, shape: pres.shapes.OVAL
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
  // SLIDE 3: WHY AI VOICE?
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, pres, "なぜAI音声が必要なのか", "BACKGROUND");
    addFooter(s, pres, 3, T);

    // Comparison cards
    const items = [
      { label: "ナレーター外注", vals: ["1本 数万円", "納品 数日~1週間", "修正に追加費用"], color: C.amberBg, textColor: C.amber },
      { label: "AI音声", vals: ["月額 $5~", "生成 数秒", "テキスト修正で即再生成"], color: C.greenBg, textColor: C.green },
    ];

    items.forEach((item, i) => {
      const x = L.mx + i * 4.3;
      const y = 1.15;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: 4, h: 2.8,
        fill: { color: C.offWhite }, rectRadius: 0.1,
        line: { color: C.border, width: 0.5 }
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x: x + 0.3, y: y + 0.2, w: 3.4, h: 0.35,
        fill: { color: item.color }, rectRadius: 0.05
      });
      s.addText(item.label, {
        x: x + 0.3, y: y + 0.2, w: 3.4, h: 0.35,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: item.textColor, align: "center", valign: "middle"
      });
      item.vals.forEach((v, j) => {
        s.addText("•  " + v, {
          x: x + 0.4, y: y + 0.8 + j * 0.55, w: 3.2, h: 0.45,
          fontSize: F.size.body, fontFace: F.sans,
          color: C.textBody, valign: "middle", shrinkText: true
        });
      });
    });

    // Bottom message
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.2, w: L.W - L.mx * 2, h: 0.5,
      fill: { color: C.accentLight }, rectRadius: 0.08
    });
    s.addText("70以上の言語に対応  |  研修・製品紹介・マーケティングなど幅広く活用", {
      x: L.mx, y: 4.2, w: L.W - L.mx * 2, h: 0.5,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.accent, align: "center", valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 4: ELEVENLABS OVERVIEW
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, pres, "ElevenLabsの全体像", "OVERVIEW");
    addFooter(s, pres, 4, T);

    const features = [
      { name: "Text-to-Speech", desc: "テキスト→自然な音声", img: ic.volume },
      { name: "Voice Cloning", desc: "声を学習し再現", img: ic.clone },
      { name: "AI Dubbing", desc: "動画の多言語吹替", img: ic.globe },
      { name: "Sound Effects", desc: "テキストで効果音生成", img: ic.headphones },
    ];

    features.forEach((f, i) => {
      const x = L.mx + i * 2.15;
      const y = 1.15;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: 2.0, h: 2.4,
        fill: { color: C.offWhite }, rectRadius: 0.1,
        line: { color: C.border, width: 0.5 }
      });
      s.addImage({ data: f.img, x: x + 0.7, y: y + 0.25, w: 0.5, h: 0.5 });
      s.addText(f.name, {
        x, y: y + 0.9, w: 2.0, h: 0.4,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.textDark, align: "center", valign: "middle", shrinkText: true
      });
      s.addText(f.desc, {
        x: x + 0.15, y: y + 1.4, w: 1.7, h: 0.6,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textLight, align: "center", valign: "top", shrinkText: true
      });
    });

    // Models row
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.85, w: 4, h: 0.55,
      fill: { color: C.accentLight }, rectRadius: 0.08
    });
    s.addText("Flash : 高速・リアルタイム向き", {
      x: L.mx, y: 3.85, w: 4, h: 0.55,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.accent, align: "center", valign: "middle", shrinkText: true
    });

    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx + 4.5, y: 3.85, w: 4, h: 0.55,
      fill: { color: C.accentLight }, rectRadius: 0.08
    });
    s.addText("Multilingual V2 : 高品質・多言語", {
      x: L.mx + 4.5, y: 3.85, w: 4, h: 0.55,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.accent, align: "center", valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 5: PRICING
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, pres, "料金プラン比較", "PRICING");
    addFooter(s, pres, 5, T);

    const plans = [
      { name: "Free", price: "$0", chars: "10,000字", feat: "TTS\n3カスタム音声", bg: C.lightGray },
      { name: "Starter", price: "$5/月", chars: "30,000字", feat: "Instant Clone\n10カスタム音声", bg: C.lightGray },
      { name: "Creator", price: "$11/月", chars: "100,000字", feat: "Professional Clone\n全機能解放", bg: C.accentLight },
      { name: "Pro", price: "$99/月", chars: "500,000字", feat: "API優先\n高品質クローン", bg: C.lightGray },
    ];

    plans.forEach((p, i) => {
      const x = L.mx + i * 2.15;
      const y = 1.1;
      const isHighlight = i === 2;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: 2.0, h: 3.3,
        fill: { color: C.white }, rectRadius: 0.1,
        line: { color: isHighlight ? C.accent : C.border, width: isHighlight ? 2 : 0.5 }
      });
      // Plan name
      s.addShape(pres.shapes.RECTANGLE, {
        x: x + 0.15, y: y + 0.15, w: 1.7, h: 0.35,
        fill: { color: isHighlight ? C.accent : C.lightGray }, rectRadius: 0.05
      });
      s.addText(p.name, {
        x: x + 0.15, y: y + 0.15, w: 1.7, h: 0.35,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: isHighlight ? C.white : C.textDark, align: "center", valign: "middle"
      });
      // Price
      s.addText(p.price, {
        x, y: y + 0.65, w: 2.0, h: 0.5,
        fontSize: F.size.h2, fontFace: F.sans, bold: true,
        color: C.textDark, align: "center", valign: "middle"
      });
      // Chars
      s.addText(p.chars, {
        x, y: y + 1.2, w: 2.0, h: 0.35,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textLight, align: "center", valign: "middle"
      });
      // Separator
      s.addShape(pres.shapes.LINE, {
        x: x + 0.3, y: y + 1.65, w: 1.4, h: 0,
        line: { color: C.border, width: 0.5 }
      });
      // Features
      s.addText(p.feat, {
        x: x + 0.15, y: y + 1.8, w: 1.7, h: 1.2,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textBody, align: "center", valign: "top", shrinkText: true
      });
    });

    // Recommendation
    s.addText("おすすめ: まずFreeで試す → 本格利用はCreator", {
      x: L.mx, y: 4.6, w: L.W - L.mx * 2, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans, italic: true,
      color: C.accent, align: "center", valign: "middle"
    });
  }

  // ============================================================
  // SLIDE 6: TEXT-TO-SPEECH STEPS
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, pres, "実践：テキスト→音声変換の手順", "HANDS-ON");
    addFooter(s, pres, 6, T);

    const steps = [
      "elevenlabs.io にアクセス\nアカウント作成",
      "Text to Speech を選択",
      "テキストを入力\n（日本語OK）",
      "声（Voice）を\n選択",
      "Generate → 試聴\n→ ダウンロード",
    ];

    steps.forEach((st, i) => {
      const x = L.mx + i * 1.75;
      const y = 1.2;
      // Step number circle
      s.addText(String(i + 1), {
        x: x + 0.45, y, w: 0.4, h: 0.4,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: C.accent }, shape: pres.shapes.OVAL
      });
      // Card
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: y + 0.55, w: 1.55, h: 1.6,
        fill: { color: C.offWhite }, rectRadius: 0.08,
        line: { color: C.border, width: 0.5 }
      });
      s.addText(st, {
        x: x + 0.08, y: y + 0.65, w: 1.4, h: 1.4,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textBody, align: "center", valign: "middle", shrinkText: true
      });
      // Arrow
      if (i < 4) {
        s.addText("→", {
          x: x + 1.55, y: y + 1.05, w: 0.2, h: 0.3,
          fontSize: F.size.body, fontFace: F.sans, bold: true,
          color: C.accent, align: "center", valign: "middle"
        });
      }
    });

    // Tip
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.65, w: L.W - L.mx * 2, h: 0.65,
      fill: { color: C.amberBg }, rectRadius: 0.08
    });
    s.addText("Tip: まず短いテキストで試して声の雰囲気を確認 → モデル選択（Flash / Multilingual V2）で品質調整", {
      x: L.mx + 0.2, y: 3.65, w: L.W - L.mx * 2 - 0.4, h: 0.65,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.amber, align: "left", valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 7: QUALITY TIPS
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, pres, "音声の品質を上げるコツ", "TIPS");
    addFooter(s, pres, 7, T);

    const tips = [
      { title: "句読点で「間」を作る", desc: "句点=長い間\n読点=短い間", ico: ic.pencil },
      { title: "「...」でポーズ挿入", desc: "強調したい箇所の\n前に間を置く", ico: ic.clock },
      { title: "速度・安定性スライダー", desc: "遅め=落ち着いた印象\n安定性↑=一貫した読み", ico: ic.sliders },
      { title: "SSMLタグで感情表現", desc: "強調、ささやき\n細かい表現が可能", ico: ic.volume },
    ];

    tips.forEach((t, i) => {
      const x = L.mx + (i % 2) * 4.3;
      const y = 1.1 + Math.floor(i / 2) * 1.65;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: 4.0, h: 1.4,
        fill: { color: C.offWhite }, rectRadius: 0.1,
        line: { color: C.border, width: 0.5 }
      });
      s.addImage({ data: t.ico, x: x + 0.2, y: y + 0.35, w: 0.4, h: 0.4 });
      s.addText(t.title, {
        x: x + 0.75, y: y + 0.1, w: 3.0, h: 0.4,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.textDark, valign: "middle", shrinkText: true
      });
      s.addText(t.desc, {
        x: x + 0.75, y: y + 0.55, w: 3.0, h: 0.7,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textLight, valign: "top", shrinkText: true
      });
    });
  }

  // ============================================================
  // SLIDE 8: INSTANT VOICE CLONE
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, pres, "Instant Voice Clone実践", "VOICE CLONE");
    addFooter(s, pres, 8, T);

    // Flow diagram
    const flowItems = [
      "Voices → Add Voice\n→ Instant Clone",
      "1分の音声サンプル\nをアップロード",
      "名前を設定\n→ 作成",
      "TTSで声を選択\n→ テキスト入力 → 生成",
    ];

    flowItems.forEach((fi, i) => {
      const x = L.mx + i * 2.2;
      const y = 1.2;
      s.addText(String(i + 1), {
        x: x + 0.6, y, w: 0.35, h: 0.35,
        fontSize: F.size.label, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: C.accent }, shape: pres.shapes.OVAL
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: y + 0.5, w: 1.95, h: 1.3,
        fill: { color: C.offWhite }, rectRadius: 0.08,
        line: { color: C.border, width: 0.5 }
      });
      s.addText(fi, {
        x: x + 0.1, y: y + 0.6, w: 1.75, h: 1.1,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textBody, align: "center", valign: "middle", shrinkText: true
      });
      if (i < 3) {
        s.addText("→", {
          x: x + 1.95, y: y + 0.9, w: 0.25, h: 0.3,
          fontSize: F.size.body, fontFace: F.sans, bold: true,
          color: C.accent, align: "center", valign: "middle"
        });
      }
    });

    // Key points
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.3, w: L.W - L.mx * 2, h: 0.5,
      fill: { color: C.greenBg }, rectRadius: 0.08
    });
    s.addText("自分の声をクローン → 台本を書くだけでナレーション自動生成", {
      x: L.mx + 0.2, y: 3.3, w: L.W - L.mx * 2 - 0.4, h: 0.5,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.green, align: "center", valign: "middle", shrinkText: true
    });

    // Warning
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.0, w: L.W - L.mx * 2, h: 0.5,
      fill: { color: C.redBg }, rectRadius: 0.08
    });
    s.addText("注意: 他人の声をクローンする場合は必ず本人の同意が必須", {
      x: L.mx + 0.2, y: 4.0, w: L.W - L.mx * 2 - 0.4, h: 0.5,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.red, align: "center", valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 9: PROFESSIONAL VOICE CLONE
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, pres, "Professional Voice Clone", "ADVANCED");
    addFooter(s, pres, 9, T);

    // Comparison table header
    const colX = [L.mx, L.mx + 2.5, L.mx + 5.3];
    const colW = [2.3, 2.6, 2.6];
    const headerY = 1.15;

    ["項目", "Instant", "Professional"].forEach((h, i) => {
      s.addShape(pres.shapes.RECTANGLE, {
        x: colX[i], y: headerY, w: colW[i], h: 0.45,
        fill: { color: C.accent }
      });
      s.addText(h, {
        x: colX[i], y: headerY, w: colW[i], h: 0.45,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle"
      });
    });

    const rows = [
      ["サンプル量", "1分程度", "30分以上"],
      ["精度", "良好", "非常に高い"],
      ["用途", "個人利用", "企業・商用"],
      ["プラン", "Starter以上", "Creator以上"],
    ];

    rows.forEach((row, ri) => {
      const y = headerY + 0.45 + ri * 0.55;
      const bg = ri % 2 === 0 ? C.offWhite : C.white;
      row.forEach((cell, ci) => {
        s.addShape(pres.shapes.RECTANGLE, {
          x: colX[ci], y, w: colW[ci], h: 0.55,
          fill: { color: bg },
          line: { color: C.border, width: 0.3 }
        });
        s.addText(cell, {
          x: colX[ci], y, w: colW[ci], h: 0.55,
          fontSize: F.size.label, fontFace: F.sans,
          color: ci === 0 ? C.textDark : C.textBody,
          bold: ci === 0,
          align: "center", valign: "middle", shrinkText: true
        });
      });
    });

    // Flow
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.7, w: L.W - L.mx * 2, h: 0.6,
      fill: { color: C.accentLight }, rectRadius: 0.08
    });
    s.addText("30分録音 → アップロード → AI学習（数時間）→ 高品質クローン完成", {
      x: L.mx + 0.2, y: 3.7, w: L.W - L.mx * 2 - 0.4, h: 0.6,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.accent, align: "center", valign: "middle", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 10: ETHICS & LEGAL
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, pres, "倫理と法的注意点", "IMPORTANT");
    addFooter(s, pres, 10, T);

    const rules = [
      { title: "本人同意の原則", desc: "他人の声をクローンする場合\n書面での同意が必須", ico: ic.shield, bg: C.greenBg, tc: C.green },
      { title: "無断クローンの禁止", desc: "著名人・他者の声の無断利用は\n肖像権・人格権の侵害に", ico: ic.lock, bg: C.redBg, tc: C.red },
      { title: "著作権の確認", desc: "生成音声の利用範囲を\nプランごとに確認", ico: ic.balance, bg: C.amberBg, tc: C.amber },
      { title: "社内ルールの整備", desc: "AI音声の利用ポリシーを\n事前に策定", ico: ic.clipboard, bg: C.accentLight, tc: C.accent },
    ];

    rules.forEach((r, i) => {
      const x = L.mx + (i % 2) * 4.3;
      const y = 1.1 + Math.floor(i / 2) * 1.65;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: 4.0, h: 1.4,
        fill: { color: C.white }, rectRadius: 0.1,
        line: { color: C.border, width: 0.5 }
      });
      // Icon badge
      s.addShape(pres.shapes.RECTANGLE, {
        x: x + 0.15, y: y + 0.15, w: 0.55, h: 0.55,
        fill: { color: r.bg }, rectRadius: 0.08
      });
      s.addImage({ data: r.ico, x: x + 0.22, y: y + 0.22, w: 0.4, h: 0.4 });
      s.addText(r.title, {
        x: x + 0.85, y: y + 0.1, w: 2.9, h: 0.4,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: r.tc, valign: "middle", shrinkText: true
      });
      s.addText(r.desc, {
        x: x + 0.85, y: y + 0.55, w: 2.9, h: 0.7,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textBody, valign: "top", shrinkText: true
      });
    });

    // Bottom warning
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.5, w: L.W - L.mx * 2, h: 0.45,
      fill: { color: C.redBg }, rectRadius: 0.08
    });
    s.addText("詐欺・なりすましへの悪用は絶対にNG", {
      x: L.mx, y: 4.5, w: L.W - L.mx * 2, h: 0.45,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.red, align: "center", valign: "middle"
    });
  }

  // ============================================================
  // SLIDE 11: SUMMARY
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, pres, "まとめ");
    addFooter(s, pres, 11, T);

    const points = [
      "ElevenLabsでテキストから数秒で高品質音声を生成できる",
      "音声クローンはInstant（手軽）とProfessional（高精度）の2種類",
      "本人同意・社内ルールなど倫理面の配慮が不可欠",
    ];

    points.forEach((p, i) => {
      const y = 1.1 + i * 1.1;
      s.addText(String(i + 1), {
        x: L.mx, y: y + 0.05, w: 0.5, h: 0.5,
        fontSize: F.size.h2, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle",
        fill: { color: C.accent }, shape: pres.shapes.OVAL
      });
      s.addText(p, {
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

    // Next step
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 4.3, w: L.W - L.mx * 2, h: 0.55,
      fill: { color: C.accentLight }, rectRadius: 0.08
    });
    s.addText("次のステップ → 確認テスト（5問中4問正解で修了）", {
      x: L.mx, y: 4.3, w: L.W - L.mx * 2, h: 0.55,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.accent, align: "center", valign: "middle"
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
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center", shrinkText: true
    });

    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 2.45, w: 3, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });

    s.addText("確認テストに進みましょう", {
      x: 0.5, y: 2.7, w: 9, h: 0.5,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", shrinkText: true
    });

    s.addText("P-04  ElevenLabs完全攻略：AI音声の世界", {
      x: 0.5, y: 3.8, w: 9, h: 0.3,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textMuted, align: "center", shrinkText: true
    });
  }

  // Save
  await pres.writeFile({ fileName: "スライド.pptx" });
  console.log("Generated: スライド.pptx (12 slides)");
}

main().catch(err => { console.error(err); process.exit(1); });
