const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const {
  FaRocket, FaBullseye, FaClock, FaCalendarAlt,
  FaCheckCircle, FaArrowRight, FaLightbulb,
  FaComments, FaSearch, FaFileAlt, FaPaintBrush,
  FaVideo, FaUsers, FaChalkboardTeacher,
  FaClipboardList, FaCogs, FaStar, FaLayerGroup,
  FaChartLine, FaListOl, FaEnvelope, FaSun, FaMoon,
  FaExchangeAlt, FaPlay, FaImage, FaShareAlt
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
  purple: "7C3AED", purpleBg: "EDE9FE",
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
  slide.addText("P-03", {
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

function addDualTag(slide, pres, text1, color1, bg1, text2, color2, bg2) {
  const w1 = text1.length * 0.14 + 0.4;
  const w2 = text2.length * 0.14 + 0.4;
  slide.addShape(pres.shapes.RECTANGLE, {
    x: L.mx, y: 0.35, w: w1, h: 0.28,
    fill: { color: bg1 }, rectRadius: 0.05
  });
  slide.addText(text1, {
    x: L.mx, y: 0.35, w: w1, h: 0.28,
    fontSize: F.size.tag, fontFace: F.sans, bold: true,
    color: color1, align: "center", valign: "middle"
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: L.mx + w1 + 0.1, y: 0.35, w: w2, h: 0.28,
    fill: { color: bg2 }, rectRadius: 0.05
  });
  slide.addText(text2, {
    x: L.mx + w1 + 0.1, y: 0.35, w: w2, h: 0.28,
    fontSize: F.size.tag, fontFace: F.sans, bold: true,
    color: color2, align: "center", valign: "middle"
  });
}

function addKeyMessage(slide, pres, parts, y) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x: L.mx, y, w: L.W - L.mx * 2, h: 0.5, fill: { color: C.navy }
  });
  slide.addText(parts, {
    x: L.mx + 0.3, y, w: L.W - L.mx * 2 - 0.6, h: 0.5,
    fontSize: F.size.body, fontFace: F.sans,
    align: "center", valign: "middle"
  });
}

async function main() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "Gorilla Knowledge";
  pres.title = "P-03: 90日AI導入ロードマップ";

  // Pre-render icons
  const ic = {
    rocket: await icon(FaRocket, C.accent),
    target: await icon(FaBullseye, C.accent),
    clock: await icon(FaClock, C.accent),
    calendar: await icon(FaCalendarAlt, C.accent),
    check: await icon(FaCheckCircle, C.green),
    checkBlue: await icon(FaCheckCircle, C.accent),
    arrow: await icon(FaArrowRight, C.accent),
    arrowWhite: await icon(FaArrowRight, C.white),
    bulb: await icon(FaLightbulb, C.amber),
    comments: await icon(FaComments, C.accent),
    search: await icon(FaSearch, C.accent),
    file: await icon(FaFileAlt, C.accent),
    paint: await icon(FaPaintBrush, C.amber),
    video: await icon(FaVideo, C.amber),
    users: await icon(FaUsers, C.purple),
    teacher: await icon(FaChalkboardTeacher, C.purple),
    clipboard: await icon(FaClipboardList, C.green),
    cogs: await icon(FaCogs, C.accent),
    star: await icon(FaStar, C.amber),
    layers: await icon(FaLayerGroup, C.purple),
    chart: await icon(FaChartLine, C.accent),
    listOl: await icon(FaListOl, C.accent),
    envelope: await icon(FaEnvelope, C.accent),
    sun: await icon(FaSun, C.amber),
    exchange: await icon(FaExchangeAlt, C.accent),
    play: await icon(FaPlay, C.amber),
    image: await icon(FaImage, C.amber),
    share: await icon(FaShareAlt, C.purple),
  };

  const T = 12;

  // ============================================================
  // SLIDE 1: TITLE (navy)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };

    s.addImage({ data: ic.rocket, x: (L.W - 0.7) / 2, y: 0.9, w: 0.7, h: 0.7 });

    s.addText("90\u65E5AI\u5C0E\u5165\u30ED\u30FC\u30C9\u30DE\u30C3\u30D7", {
      x: 0.5, y: 1.8, w: 9, h: 0.9,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center", margin: 0
    });

    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 2.85, w: 3, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });

    s.addText("\u9031\u5358\u4F4D\u3067\u300C\u660E\u65E5\u304B\u3089\u4F55\u3092\u3084\u308B\u304B\u300D\u304C\u6C7A\u307E\u308B\u5B9F\u8DF5\u8A08\u753B", {
      x: 0.5, y: 3.05, w: 9, h: 0.5,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", margin: 0
    });

    s.addText("P-03   |   \u5168\u793E\u54E1\u5411\u3051   |   12\u5206", {
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
    addSectionTitle(s, "\u4ECA\u65E5\u306E\u30B4\u30FC\u30EB");
    addFooter(s, 2, T, pres);

    const goals = [
      "90\u65E5\u9593\u30FB12\u9031\u30923\u30D5\u30A7\u30FC\u30BA\u306B\u5206\u3051\u305F\u5C0E\u5165\u8A08\u753B\u304C\u308F\u304B\u308B",
      "\u300C\u4ECA\u9031\u3084\u308B\u3053\u3068\u300D\u304C\u9031\u5358\u4F4D\u3067\u660E\u78BA\u306B\u306A\u308B",
      "90\u65E5\u5F8C\u306E\u81EA\u5206\u306EBefore/After\u304C\u30A4\u30E1\u30FC\u30B8\u3067\u304D\u308B",
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
  // SLIDE 3: WHY 90 DAYS
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "\u306A\u305C\u300C90\u65E5\u300D\u306A\u306E\u304B\uFF1F");
    addFooter(s, 3, T, pres);

    const reasons = [
      { label: "30\u65E5", desc: "\u77ED\u3059\u304E\u308B", detail: "\u7FD2\u6163\u5316\u3059\u308B\u524D\u306B\u7D42\u308F\u308B", color: C.red, bgColor: C.redBg },
      { label: "180\u65E5", desc: "\u9577\u3059\u304E\u308B", detail: "\u9014\u4E2D\u3067\u98FD\u304D\u3066\u30D5\u30A7\u30FC\u30C9\u30A2\u30A6\u30C8", color: C.amber, bgColor: C.amberBg },
      { label: "90\u65E5", desc: "\u3061\u3087\u3046\u3069\u3044\u3044", detail: "\u7FD2\u6163\u5B9A\u7740(66\u65E5)+3\u30D5\u30A7\u30FC\u30BA\u306B\u5206\u5272", color: C.green, bgColor: C.greenBg },
    ];

    const cardW = 2.5;
    const cardGap = 0.3;
    const totalW = cardW * 3 + cardGap * 2;
    const sx = (L.W - totalW) / 2;

    reasons.forEach((r, i) => {
      const x = sx + i * (cardW + cardGap);
      const y = 1.15;
      const h = 2.1;

      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h,
        fill: { color: C.white }, line: { color: C.border, width: 0.75 }
      });

      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 0.05, fill: { color: r.color }
      });

      s.addShape(pres.shapes.RECTANGLE, {
        x: x + (cardW - 1.2) / 2, y: y + 0.3, w: 1.2, h: 0.45,
        fill: { color: r.bgColor }, rectRadius: 0.1
      });
      s.addText(r.label, {
        x: x + (cardW - 1.2) / 2, y: y + 0.3, w: 1.2, h: 0.45,
        fontSize: F.size.h2, fontFace: F.sans, bold: true,
        color: r.color, align: "center", valign: "middle"
      });

      s.addText(r.desc, {
        x, y: y + 1.0, w: cardW, h: 0.35,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, align: "center", margin: 0
      });

      s.addText(r.detail, {
        x: x + 0.15, y: y + 1.4, w: cardW - 0.3, h: 0.5,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textLight, align: "center", valign: "top", margin: 0
      });
    });

    // 3 phases summary
    const phaseY = 3.55;
    const phases = [
      { text: "Month 1: \u500B\u4EBA\u3067\u4F7F\u3046", color: C.accent, bg: C.accentLight },
      { text: "Month 2: \u6B66\u5668\u3092\u5897\u3084\u3059", color: C.amber, bg: C.amberBg },
      { text: "Month 3: \u30C1\u30FC\u30E0\u306B\u5E83\u3052\u308B", color: C.purple, bg: C.purpleBg },
    ];
    const phW = 2.4;
    const phGap = 0.2;
    const phTotal = phW * 3 + phGap * 2;
    const phSx = (L.W - phTotal) / 2;

    phases.forEach((p, i) => {
      const x = phSx + i * (phW + phGap);
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: phaseY, w: phW, h: 0.45,
        fill: { color: p.bg }, rectRadius: 0.08
      });
      s.addText(p.text, {
        x, y: phaseY, w: phW, h: 0.45,
        fontSize: F.size.label, fontFace: F.sans, bold: true,
        color: p.color, align: "center", valign: "middle"
      });
      if (i < 2) {
        s.addImage({ data: ic.arrow, x: x + phW + 0.01, y: phaseY + 0.1, w: 0.18, h: 0.18 });
      }
    });

    addKeyMessage(s, pres, [
      { text: "90\u65E5 = ", options: { color: C.accentMid } },
      { text: "\u300C\u77E5\u308B \u2192 \u4F7F\u3046 \u2192 \u6559\u3048\u308B\u300D", options: { color: C.white, bold: true } },
      { text: "\u306E\u5168\u30B5\u30A4\u30AF\u30EB\u304C\u56DE\u305B\u308B", options: { color: C.accentMid } },
    ], 4.3);
  }

  // ============================================================
  // SLIDE 4: MONTH 1 WEEK 1-2 — ChatGPT
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addDualTag(s, pres, "Month 1", C.accent, C.accentLight, "Week 1-2", C.accent, C.accentLight);
    s.addText("ChatGPT\u5C0E\u5165 \u2014 \u300C1\u65E53\u56DEAI\u306B\u805E\u304F\u300D\u7FD2\u6163", {
      x: L.mx, y: 0.7, w: 8.5, h: 0.5,
      fontSize: F.size.h1, fontFace: F.sans, bold: true,
      color: C.textDark, margin: 0
    });
    addFooter(s, 4, T, pres);

    const dailyActions = [
      { time: "\u671D", action: "\u30E1\u30FC\u30EB\u306E\u4E0B\u66F8\u304D\u3092ChatGPT\u3067\u4F5C\u6210", ic: ic.envelope },
      { time: "\u6627", action: "\u4F1A\u8B70\u5F8C\u306E\u8B70\u4E8B\u9332\u3092AI\u3067\u8981\u7D04", ic: ic.comments },
      { time: "\u5915", action: "\u660E\u65E5\u306E\u30BF\u30B9\u30AF\u306E\u30A2\u30A4\u30C7\u30A2\u51FA\u3057\u3092AI\u306B\u76F8\u8AC7", ic: ic.bulb },
    ];

    dailyActions.forEach((d, i) => {
      const y = 1.35 + i * 0.75;
      const cardH = 0.65;

      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: cardH,
        fill: { color: C.offWhite }, line: { color: C.border, width: 0.5 }
      });

      // Time label
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx + 0.15, y: y + 0.12, w: 0.6, h: 0.4,
        fill: { color: C.accentLight }, rectRadius: 0.06
      });
      s.addText(d.time, {
        x: L.mx + 0.15, y: y + 0.12, w: 0.6, h: 0.4,
        fontSize: F.size.label, fontFace: F.sans, bold: true,
        color: C.accent, align: "center", valign: "middle"
      });

      s.addImage({ data: d.ic, x: L.mx + 1.0, y: y + 0.12, w: 0.35, h: 0.35 });

      s.addText(d.action, {
        x: L.mx + 1.55, y, w: 6, h: cardH,
        fontSize: F.size.h3, fontFace: F.sans,
        color: C.textDark, valign: "middle", margin: 0
      });
    });

    // Goal box
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.7, w: L.W - L.mx * 2, h: 0.55,
      fill: { color: C.accentLight }, rectRadius: 0.1
    });
    s.addImage({ data: ic.target, x: L.mx + 0.2, y: 3.8, w: 0.3, h: 0.3 });
    s.addText("\u76EE\u6A19: 1\u65E53\u56DEAI\u306B\u805E\u304F\u7FD2\u6163\u3092\u3064\u3051\u308B", {
      x: L.mx + 0.7, y: 3.7, w: 7, h: 0.55,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.accent, valign: "middle", margin: 0
    });

    // Tip
    addKeyMessage(s, pres, [
      { text: "\u30B3\u30C4: ", options: { color: C.accentMid } },
      { text: "\u5B8C\u74A7\u306A\u56DE\u7B54\u3092\u6C42\u3081\u306A\u3044\u3002\u300C\u305F\u305F\u304D\u53F0\u300D\u3092\u3082\u3089\u3046\u611F\u899A\u3067OK", options: { color: C.white, bold: true } },
    ], 4.5);
  }

  // ============================================================
  // SLIDE 5: MONTH 1 WEEK 3-4 — Perplexity + Claude
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addDualTag(s, pres, "Month 1", C.accent, C.accentLight, "Week 3-4", C.accent, C.accentLight);
    s.addText("Perplexity + Claude\u8FFD\u52A0 \u2014 \u4F7F\u3044\u5206\u3051\u3092\u4F53\u3067\u899A\u3048\u308B", {
      x: L.mx, y: 0.7, w: 8.5, h: 0.5,
      fontSize: F.size.h1, fontFace: F.sans, bold: true,
      color: C.textDark, margin: 0
    });
    addFooter(s, 5, T, pres);

    // 3-column tool comparison
    const tools = [
      { name: "ChatGPT", role: "\u4E07\u80FD\u9078\u624B", desc: "\u96D1\u8AC7\u304B\u3089\u30B3\u30FC\u30C9\u751F\u6210\u307E\u3067\u4F55\u3067\u3082\u3044\u3051\u308B", color: C.accent, bg: C.accentLight },
      { name: "Perplexity", role: "\u8ABF\u3079\u7269\u5C02\u7528", desc: "\u30BD\u30FC\u30B9\u4ED8\u304D\u3067\u4FE1\u983C\u6027\u304C\u9AD8\u3044", color: C.green, bg: C.greenBg },
      { name: "Claude", role: "\u9577\u6587\u30FB\u5206\u6790", desc: "\u5831\u544A\u66F8\u3084\u63D0\u6848\u66F8\u306E\u4E0B\u66F8\u304D\u306B\u6700\u9069", color: C.purple, bg: C.purpleBg },
    ];

    const colW = 2.5;
    const colGap = 0.25;
    const totalW = colW * 3 + colGap * 2;
    const startX = (L.W - totalW) / 2;

    tools.forEach((t, i) => {
      const x = startX + i * (colW + colGap);
      const y = 1.25;

      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: colW, h: 2.3,
        fill: { color: C.white }, line: { color: C.border, width: 0.75 }
      });

      // Header
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: colW, h: 0.5, fill: { color: t.color }
      });
      s.addText(t.name, {
        x, y, w: colW, h: 0.5,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle"
      });

      // Role tag
      s.addShape(pres.shapes.RECTANGLE, {
        x: x + (colW - 1.6) / 2, y: y + 0.7, w: 1.6, h: 0.35,
        fill: { color: t.bg }, rectRadius: 0.06
      });
      s.addText(t.role, {
        x: x + (colW - 1.6) / 2, y: y + 0.7, w: 1.6, h: 0.35,
        fontSize: F.size.label, fontFace: F.sans, bold: true,
        color: t.color, align: "center", valign: "middle"
      });

      // Description
      s.addText(t.desc, {
        x: x + 0.15, y: y + 1.25, w: colW - 0.3, h: 0.8,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, align: "center", valign: "top", margin: 0
      });
    });

    // Practice tip
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.8, w: L.W - L.mx * 2, h: 0.55,
      fill: { color: C.amberBg }, rectRadius: 0.08
    });
    s.addImage({ data: ic.bulb, x: L.mx + 0.2, y: 3.9, w: 0.3, h: 0.3 });
    s.addText("\u7DF4\u7FD2\u6CD5: \u540C\u3058\u8CEA\u554F\u30923\u30C4\u30FC\u30EB\u306B\u6295\u3052\u3066\u56DE\u7B54\u3092\u6BD4\u8F03\u3057\u3066\u307F\u308B", {
      x: L.mx + 0.7, y: 3.8, w: 7.2, h: 0.55,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.amber, valign: "middle", margin: 0
    });

    addKeyMessage(s, pres, [
      { text: "\u300C\u3053\u306E\u30BF\u30B9\u30AF\u306F\u3069\u306EAI\u304C\u5411\u3044\u3066\u308B\u304B\u300D", options: { color: C.white, bold: true } },
      { text: "\u3092\u4F53\u611F\u3059\u308B", options: { color: C.accentMid } },
    ], 4.6);
  }

  // ============================================================
  // SLIDE 6: MONTH 1 SUCCESS METRICS
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "Month 1\u306E\u6210\u529F\u6307\u6A19");
    addFooter(s, 6, T, pres);

    const checks = [
      "\u90B15\u6642\u9593\u4EE5\u4E0A\u306E\u6642\u9593\u524A\u6E1B\u3092\u5B9F\u611F\u3067\u304D\u3066\u3044\u308B",
      "\u300CAI\u306A\u3057\u3060\u3068\u4E0D\u4FBF\u300D\u3068\u611F\u3058\u308B\u30BF\u30B9\u30AF\u304C3\u3064\u4EE5\u4E0A\u3042\u308B",
      "ChatGPT / Perplexity / Claude \u3092\u5834\u9762\u3067\u4F7F\u3044\u5206\u3051\u3089\u308C\u308B",
    ];

    checks.forEach((c, i) => {
      const y = 1.15 + i * 0.7;
      s.addImage({ data: ic.check, x: L.mx + 0.15, y: y + 0.07, w: 0.28, h: 0.28 });
      s.addText(c, {
        x: L.mx + 0.6, y, w: 7.5, h: 0.45,
        fontSize: F.size.h3, fontFace: F.sans,
        color: C.textDark, valign: "middle", margin: 0
      });
    });

    // Self-test box
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.4, w: L.W - L.mx * 2, h: 0.7,
      fill: { color: C.amberBg }, rectRadius: 0.08
    });
    s.addImage({ data: ic.bulb, x: L.mx + 0.2, y: 3.52, w: 0.35, h: 0.35 });
    s.addText("\u30BB\u30EB\u30D5\u30C6\u30B9\u30C8: \u91D1\u66DC\u9000\u52E4\u6642\u300C\u4ECA\u9031AI\u304C\u306A\u304B\u3063\u305F\u3089\u4F55\u304C\u56F0\u3063\u305F\u304B\u300D\u30923\u3064\u8A00\u3048\u308B\u304B\uFF1F", {
      x: L.mx + 0.75, y: 3.4, w: 7, h: 0.7,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.amber, valign: "middle", margin: 0
    });

    addKeyMessage(s, pres, [
      { text: "\u5408\u683C\u30E9\u30A4\u30F3: ", options: { color: C.accentMid } },
      { text: "\u300CAI\u306A\u3057\u306B\u306F\u623B\u308C\u306A\u3044\u300D", options: { color: C.white, bold: true } },
      { text: "\u3068\u601D\u3048\u305F\u3089Month 1\u30AF\u30EA\u30A2", options: { color: C.accentMid } },
    ], 4.4);
  }

  // ============================================================
  // SLIDE 7: MONTH 2 WEEK 5-6 — Creative Tools
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addDualTag(s, pres, "Month 2", C.amber, C.amberBg, "Week 5-6", C.amber, C.amberBg);
    s.addText("\u30AF\u30EA\u30A8\u30A4\u30C6\u30A3\u30D6\u30C4\u30FC\u30EB\u5C0E\u5165 \u2014 \u307E\u305A\u89E6\u3063\u3066\u307F\u308B", {
      x: L.mx, y: 0.7, w: 8.5, h: 0.5,
      fontSize: F.size.h1, fontFace: F.sans, bold: true,
      color: C.textDark, margin: 0
    });
    addFooter(s, 7, T, pres);

    const tasks = [
      { text: "Veo3\u3067\u52D5\u753B\u30921\u672C\u4F5C\u308B\uFF0830\u79D2\u306E\u30D7\u30ED\u30E2\u52D5\u753B\u3067OK\uFF09", ic: ic.video },
      { text: "Midjourney\u3067\u753B\u50CF\u30925\u679A\u751F\u6210\uFF08SNS\u7528\u3001\u30D7\u30EC\u30BC\u30F3\u7D20\u6750\uFF09", ic: ic.image },
      { text: "\u300C\u30D7\u30ED\u30F3\u30D7\u30C8\u3092\u5909\u3048\u308B\u3068\u51FA\u529B\u304C\u5909\u308F\u308B\u300D\u3092\u4F53\u9A13\u3059\u308B", ic: ic.exchange },
    ];

    tasks.forEach((t, i) => {
      const y = 1.35 + i * 0.8;
      const cardH = 0.68;

      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y, w: L.W - L.mx * 2, h: cardH,
        fill: { color: C.offWhite }, line: { color: C.border, width: 0.5 }
      });

      s.addImage({ data: t.ic, x: L.mx + 0.3, y: y + 0.14, w: 0.35, h: 0.35 });

      s.addText(t.text, {
        x: L.mx + 0.9, y, w: 7, h: cardH,
        fontSize: F.size.h3, fontFace: F.sans,
        color: C.textDark, valign: "middle", margin: 0
      });
    });

    // Mindset
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.85, w: L.W - L.mx * 2, h: 0.55,
      fill: { color: C.amberBg }, rectRadius: 0.08
    });
    s.addImage({ data: ic.star, x: L.mx + 0.2, y: 3.95, w: 0.3, h: 0.3 });
    s.addText("\u30DE\u30A4\u30F3\u30C9\u30BB\u30C3\u30C8: \u4E0A\u624B\u304F\u4F5C\u308D\u3046\u3068\u3057\u306A\u3044\u3002\u300C\u3053\u3093\u306A\u3053\u3068\u3067\u304D\u308B\u3093\u3060\u300D\u3092\u5473\u308F\u3046", {
      x: L.mx + 0.7, y: 3.85, w: 7, h: 0.55,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.amber, valign: "middle", margin: 0
    });

    addKeyMessage(s, pres, [
      { text: "\u30C6\u30AD\u30B9\u30C8\u304B\u3089", options: { color: C.accentMid } },
      { text: "\u753B\u50CF\u30FB\u52D5\u753B", options: { color: C.white, bold: true } },
      { text: "\u3078\u3002AI\u6D3B\u7528\u306E\u5E45\u3092\u5E83\u3052\u308B2\u9031\u9593", options: { color: C.accentMid } },
    ], 4.65);
  }

  // ============================================================
  // SLIDE 8: MONTH 2 WEEK 7-8 — Workflow Integration
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addDualTag(s, pres, "Month 2", C.amber, C.amberBg, "Week 7-8", C.amber, C.amberBg);
    s.addText("\u696D\u52D9\u30D5\u30ED\u30FC\u7D71\u5408 \u2014 \u4E00\u6C17\u901A\u8CAB\u30923\u56DE\u4EE5\u4E0A\u5B9F\u8DF5", {
      x: L.mx, y: 0.7, w: 8.5, h: 0.5,
      fontSize: F.size.h1, fontFace: F.sans, bold: true,
      color: C.textDark, margin: 0
    });
    addFooter(s, 8, T, pres);

    // Flow diagram
    const flowY = 1.3;
    const flowItems = [
      { label: "Perplexity", sub: "\u30EA\u30B5\u30FC\u30C1", color: C.green, bg: C.greenBg },
      { label: "Claude", sub: "\u69CB\u6210+\u672C\u6587", color: C.purple, bg: C.purpleBg },
      { label: "\u8CC7\u6599\u5B8C\u6210", sub: "\u30A2\u30A6\u30C8\u30D7\u30C3\u30C8", color: C.accent, bg: C.accentLight },
    ];
    const fW = 2.2;
    const fGap = 0.5;
    const fTotal = fW * 3 + fGap * 2;
    const fSx = (L.W - fTotal) / 2;

    flowItems.forEach((f, i) => {
      const x = fSx + i * (fW + fGap);
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: flowY, w: fW, h: 0.8,
        fill: { color: f.bg }, line: { color: f.color, width: 1.5 }, rectRadius: 0.1
      });
      s.addText(f.label, {
        x, y: flowY, w: fW, h: 0.45,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: f.color, align: "center", valign: "bottom", margin: 0
      });
      s.addText(f.sub, {
        x, y: flowY + 0.4, w: fW, h: 0.35,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textLight, align: "center", valign: "top", margin: 0
      });
      if (i < 2) {
        s.addImage({ data: ic.arrow, x: x + fW + 0.14, y: flowY + 0.27, w: 0.22, h: 0.22 });
      }
    });

    // 3 practice tasks
    const practices = [
      { num: "1\u56DE\u76EE", text: "\u7AF6\u5408\u8ABF\u67FB\u30EC\u30DD\u30FC\u30C8\uFF08Perplexity\u3067\u8ABF\u67FB \u2192 Claude\u3067\u6574\u7406\uFF09" },
      { num: "2\u56DE\u76EE", text: "\u63D0\u6848\u66F8\u4F5C\u6210\uFF08Perplexity\u3067\u4E8B\u4F8B\u53CE\u96C6 \u2192 Claude\u3067\u63D0\u6848\u66F8\u5316\uFF09" },
      { num: "3\u56DE\u76EE", text: "\u81EA\u7531\u8AB2\u984C\uFF08\u81EA\u5206\u306E\u696D\u52D9\u3067\u540C\u3058\u30D5\u30ED\u30FC\u3092\u8A66\u3059\uFF09" },
    ];

    practices.forEach((p, i) => {
      const y = 2.5 + i * 0.55;
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx + 0.1, y: y + 0.05, w: 0.65, h: 0.35,
        fill: { color: C.accentLight }, rectRadius: 0.06
      });
      s.addText(p.num, {
        x: L.mx + 0.1, y: y + 0.05, w: 0.65, h: 0.35,
        fontSize: F.size.label, fontFace: F.sans, bold: true,
        color: C.accent, align: "center", valign: "middle"
      });
      s.addText(p.text, {
        x: L.mx + 0.95, y, w: 7, h: 0.45,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, valign: "middle", margin: 0
      });
    });

    addKeyMessage(s, pres, [
      { text: "3\u56DE\u3084\u308B\u3068", options: { color: C.accentMid } },
      { text: "\u300C\u5168\u90E8\u3053\u306E\u30D1\u30BF\u30FC\u30F3\u3067\u3044\u3051\u308B\u300D", options: { color: C.white, bold: true } },
      { text: "\u3068\u6C17\u3065\u304F", options: { color: C.accentMid } },
    ], 4.3);
  }

  // ============================================================
  // SLIDE 9: MONTH 2 SUCCESS METRICS
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "Month 2\u306E\u6210\u529F\u6307\u6A19");
    addFooter(s, 9, T, pres);

    const checks = [
      "\u300CAI\u306B\u4EFB\u305B\u308B\u30BF\u30B9\u30AF\u300D\u3068\u300C\u4EBA\u304C\u3084\u308B\u30BF\u30B9\u30AF\u300D\u306E\u7DDA\u5F15\u304D\u304C\u660E\u78BA",
      "\u30C6\u30AD\u30B9\u30C8\u4EE5\u5916\uFF08\u753B\u50CF\u30FB\u52D5\u753B\uFF09\u3082AI\u3067\u4F5C\u3063\u305F\u7D4C\u9A13\u304C\u3042\u308B",
      "Perplexity \u2192 Claude \u2192 \u8CC7\u6599\u306E\u4E00\u6C17\u901A\u8CAB\u30D5\u30ED\u30FC\u3092\u5B9F\u8DF5\u6E08\u307F",
    ];

    checks.forEach((c, i) => {
      const y = 1.15 + i * 0.7;
      s.addImage({ data: ic.check, x: L.mx + 0.15, y: y + 0.07, w: 0.28, h: 0.28 });
      s.addText(c, {
        x: L.mx + 0.6, y, w: 7.5, h: 0.45,
        fontSize: F.size.h3, fontFace: F.sans,
        color: C.textDark, valign: "middle", margin: 0
      });
    });

    // Self-test box
    s.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 3.4, w: L.W - L.mx * 2, h: 0.7,
      fill: { color: C.amberBg }, rectRadius: 0.08
    });
    s.addImage({ data: ic.bulb, x: L.mx + 0.2, y: 3.52, w: 0.35, h: 0.35 });
    s.addText("\u30BB\u30EB\u30D5\u30C6\u30B9\u30C8: \u300C\u3053\u306E\u30BF\u30B9\u30AF\u3001AI\u306B\u4EFB\u305B\u308B\uFF1F\u81EA\u5206\u3067\u3084\u308B\uFF1F\u300D\u306B\u5373\u7B54\u3067\u304D\u308B\u304B\uFF1F", {
      x: L.mx + 0.75, y: 3.4, w: 7, h: 0.7,
      fontSize: F.size.body, fontFace: F.sans, bold: true,
      color: C.amber, valign: "middle", margin: 0
    });

    addKeyMessage(s, pres, [
      { text: "\u5408\u683C\u30E9\u30A4\u30F3: AI\u3068\u81EA\u5206\u306E", options: { color: C.accentMid } },
      { text: "\u300C\u5F79\u5272\u5206\u62C5\u300D", options: { color: C.white, bold: true } },
      { text: "\u304C\u898B\u3048\u3066\u3044\u305F\u3089Month 2\u30AF\u30EA\u30A2", options: { color: C.accentMid } },
    ], 4.4);
  }

  // ============================================================
  // SLIDE 10: MONTH 3 — Team Expansion
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addDualTag(s, pres, "Month 3", C.purple, C.purpleBg, "Week 9-12", C.purple, C.purpleBg);
    s.addText("\u30C1\u30FC\u30E0\u5C55\u958B + \u30CA\u30EC\u30C3\u30B8\u5171\u6709 \u2014 \u500B\u4EBA\u304B\u3089\u7D44\u7E54\u3078", {
      x: L.mx, y: 0.7, w: 8.5, h: 0.5,
      fontSize: F.size.h1, fontFace: F.sans, bold: true,
      color: C.textDark, margin: 0
    });
    addFooter(s, 10, T, pres);

    const weeks = [
      { week: "Week 9", action: "\u81EA\u5206\u306E\u6210\u529F\u4F53\u9A13\u30923\u3064\u66F8\u304D\u51FA\u3059", ic: ic.clipboard },
      { week: "Week 10", action: "\u540C\u50DA1\u4EBA\u306B\u4F7F\u3044\u65B9\u3092\u6559\u3048\u308B\uFF08\u30E9\u30F3\u30C130\u5206\u3067OK\uFF09", ic: ic.teacher },
      { week: "Week 11", action: "\u793E\u5185\u52C9\u5F37\u4F1A\u30921\u56DE\u958B\u50AC\uFF08\u6D3B\u7528\u4E8B\u4F8B3\u3064\u7D39\u4ECB\uFF09", ic: ic.users },
      { week: "Week 12", action: "\u30D9\u30B9\u30C8\u30D7\u30E9\u30AF\u30C6\u30A3\u30B9\u30921\u679A\u306B\u307E\u3068\u3081\u3066\u5171\u6709", ic: ic.share },
    ];

    weeks.forEach((w, i) => {
      const y = 1.3 + i * 0.72;
      const rowH = 0.62;

      // Timeline dot
      s.addShape(pres.shapes.OVAL, {
        x: L.mx + 0.05, y: y + 0.18, w: 0.2, h: 0.2,
        fill: { color: C.purple }
      });

      // Connecting line
      if (i < 3) {
        s.addShape(pres.shapes.LINE, {
          x: L.mx + 0.14, y: y + 0.42, w: 0, h: 0.48,
          line: { color: C.purpleBg, width: 2 }
        });
      }

      // Week label
      s.addText(w.week, {
        x: L.mx + 0.4, y, w: 1.2, h: rowH,
        fontSize: F.size.label, fontFace: F.sans, bold: true,
        color: C.purple, valign: "middle", margin: 0
      });

      s.addImage({ data: w.ic, x: L.mx + 1.6, y: y + 0.12, w: 0.32, h: 0.32 });

      s.addText(w.action, {
        x: L.mx + 2.1, y, w: 5.8, h: rowH,
        fontSize: F.size.h3, fontFace: F.sans,
        color: C.textDark, valign: "middle", margin: 0
      });
    });

    addKeyMessage(s, pres, [
      { text: "\u30DD\u30A4\u30F3\u30C8: ", options: { color: C.accentMid } },
      { text: "\u6559\u3048\u308B\u3053\u3068\u3067\u81EA\u5206\u306E\u7406\u89E3\u3082\u6DF1\u307E\u308B", options: { color: C.white, bold: true } },
    ], 4.4);
  }

  // ============================================================
  // SLIDE 11: SUMMARY — Before / After
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    addTopBar(s, pres);
    addSectionTitle(s, "90\u65E5\u5F8C\u306E\u3042\u306A\u305F \u2014 Before / After");
    addFooter(s, 11, T, pres);

    // Two columns
    const colW = 3.8;
    const leftX = L.mx;
    const rightX = L.mx + colW + 0.9;

    // Before header
    s.addShape(pres.shapes.RECTANGLE, {
      x: leftX, y: 1.05, w: colW, h: 0.45, fill: { color: C.redBg }, rectRadius: 0.08
    });
    s.addText("Before", {
      x: leftX, y: 1.05, w: colW, h: 0.45,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.red, align: "center", valign: "middle"
    });

    // After header
    s.addShape(pres.shapes.RECTANGLE, {
      x: rightX, y: 1.05, w: colW, h: 0.45, fill: { color: C.greenBg }, rectRadius: 0.08
    });
    s.addText("After", {
      x: rightX, y: 1.05, w: colW, h: 0.45,
      fontSize: F.size.h3, fontFace: F.sans, bold: true,
      color: C.green, align: "center", valign: "middle"
    });

    // Arrow between
    s.addImage({ data: ic.arrow, x: leftX + colW + 0.3, y: 1.1, w: 0.3, h: 0.3 });

    const comparisons = [
      { before: "\u691C\u7D22\u306B30\u5206", after: "Perplexity\u30675\u5206" },
      { before: "\u30E1\u30FC\u30EB\u4F5C\u6210\u306B20\u5206", after: "ChatGPT\u30673\u5206\u306E\u305F\u305F\u304D\u53F0" },
      { before: "\u8CC7\u6599\u4F5C\u6210\u306B\u534A\u65E5", after: "\u4E00\u6C17\u901A\u8CAB\u30D5\u30ED\u30FC\u30672\u6642\u9593" },
      { before: "\u52D5\u753B\u306F\u5916\u6CE8", after: "Veo3\u3067\u81EA\u5206\u3067\u4F5C\u308C\u308B" },
      { before: "AI\u306F\u300C\u306A\u3093\u304B\u96E3\u3057\u305D\u3046\u300D", after: "\u300CAI\u306A\u3057\u306B\u306F\u623B\u308C\u306A\u3044\u300D" },
    ];

    comparisons.forEach((c, i) => {
      const y = 1.65 + i * 0.5;
      // Before item
      s.addText(c.before, {
        x: leftX + 0.15, y, w: colW - 0.3, h: 0.4,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, valign: "middle", margin: 0
      });
      // After item
      s.addText(c.after, {
        x: rightX + 0.15, y, w: colW - 0.3, h: 0.4,
        fontSize: F.size.body, fontFace: F.sans, bold: true,
        color: C.green, valign: "middle", margin: 0
      });
      // Separator
      if (i < 4) {
        s.addShape(pres.shapes.LINE, {
          x: leftX, y: y + 0.42, w: L.W - L.mx * 2, h: 0,
          line: { color: C.border, width: 0.3 }
        });
      }
    });

    addKeyMessage(s, pres, [
      { text: "\u5927\u4E8B\u306A\u306E\u306F", options: { color: C.accentMid } },
      { text: "\u6765\u9031\u306E\u6708\u66DC\u65E5\u3001Week 1\u306E\u30A2\u30AF\u30B7\u30E7\u30F3\u3092\u59CB\u3081\u308B\u3053\u3068", options: { color: C.white, bold: true } },
    ], 4.4);
  }

  // ============================================================
  // SLIDE 12: END (navy)
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };

    s.addText("90\u65E5AI\u5C0E\u5165\u30ED\u30FC\u30C9\u30DE\u30C3\u30D7", {
      x: 0.5, y: 0.8, w: 9, h: 0.6,
      fontSize: F.size.h1, fontFace: F.sans, bold: true,
      color: C.accentMid, align: "center", margin: 0
    });

    s.addShape(pres.shapes.LINE, {
      x: 3.5, y: 1.5, w: 3, h: 0,
      line: { color: C.accentMid, width: 1 }
    });

    const summaryItems = [
      { week: "Week 1-2", text: "ChatGPT\u5C0E\u5165 \u2192 1\u65E53\u56DE\u306E\u7FD2\u6163\u3065\u304F\u308A" },
      { week: "Week 3-4", text: "Perplexity + Claude \u2192 \u4F7F\u3044\u5206\u3051\u3092\u4F53\u3067\u899A\u3048\u308B" },
      { week: "Week 5-6", text: "Veo3 + Midjourney \u2192 \u30AF\u30EA\u30A8\u30A4\u30C6\u30A3\u30D6\u9818\u57DF\u3078" },
      { week: "Week 7-8", text: "\u4E00\u6C17\u901A\u8CAB\u30D5\u30ED\u30FC \u2192 \u696D\u52D9\u7D71\u5408" },
      { week: "Week 9-12", text: "\u30C1\u30FC\u30E0\u5C55\u958B \u2192 \u500B\u4EBA\u304B\u3089\u7D44\u7E54\u3078" },
    ];

    summaryItems.forEach((item, i) => {
      s.addText(item.week, {
        x: 1.2, y: 1.7 + i * 0.48, w: 1.6, h: 0.38,
        fontSize: F.size.label, fontFace: F.sans, bold: true,
        color: C.accentMid, align: "right", valign: "middle", margin: 0
      });
      s.addText(item.text, {
        x: 3.0, y: 1.7 + i * 0.48, w: 5.8, h: 0.38,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.white, valign: "middle", margin: 0
      });
    });

    s.addText("\u78BA\u8A8D\u30C6\u30B9\u30C8\uFF085\u554F\uFF09\u2192 80%\u4EE5\u4E0A\u3067\u4FEE\u4E86", {
      x: 0.5, y: 4.0, w: 9, h: 0.4,
      fontSize: F.size.h3, fontFace: F.sans,
      color: C.white, align: "center", margin: 0
    });

    s.addText("\u6765\u9031\u6708\u66DC\u65E5\u3001Week 1\u306E\u30A2\u30AF\u30B7\u30E7\u30F3\u3092\u59CB\u3081\u307E\u3057\u3087\u3046", {
      x: 0.5, y: 4.5, w: 9, h: 0.35,
      fontSize: F.size.body, fontFace: F.sans,
      color: C.textMuted, align: "center", margin: 0
    });

    s.addText("P-03 | Gorilla Knowledge", {
      x: 0.5, y: 4.95, w: 9, h: 0.3,
      fontSize: F.size.caption, fontFace: F.sans,
      color: C.textMuted, align: "center", margin: 0
    });
  }

  // Save
  const outPath = __dirname + "/\u30B9\u30E9\u30A4\u30C9.pptx";
  await pres.writeFile({ fileName: outPath });
  console.log("Generated:", outPath);
}

main().catch(e => { console.error(e); process.exit(1); });
