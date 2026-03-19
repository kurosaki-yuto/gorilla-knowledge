#!/usr/bin/env node
/**
 * AI研修スライド生成エンジン（汎用版）
 *
 * Usage:
 *   NODE_PATH=$(npm root -g) node slide-generator.js <course.yaml> [chapterIndex] [outputDir]
 *
 *   chapterIndex: 省略すると全チャプターを生成
 *   outputDir:    省略するとYAMLと同じディレクトリに出力
 *
 * Examples:
 *   node slide-generator.js ../AI-101_AIの基本/course.yaml
 *   node slide-generator.js course.yaml 0 ./output
 */

const fs = require("fs");
const path = require("path");
const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");

// =====================================================
// DESIGN SYSTEM (Consulting-grade)
// =====================================================

const C = {
  white: "FFFFFF", offWhite: "FAFBFC", lightGray: "F3F4F6",
  navy: "1B2A4A", navyLight: "2D4A7A",
  accent: "2563EB", accentLight: "DBEAFE", accentMid: "93C5FD",
  textDark: "111827", textBody: "374151", textLight: "6B7280", textMuted: "9CA3AF",
  green: "059669", greenBg: "D1FAE5",
  amber: "D97706", amberBg: "FEF3C7",
  red: "DC2626", redBg: "FEE2E2",
  border: "E5E7EB",
};

const F = { sans: "Calibri", size: { hero: 44, h1: 32, h2: 22, h3: 18, body: 16, label: 13, caption: 11, tag: 10 } };
const L = { W: 10, H: 5.625, mx: 0.75, my: 0.5, gap: 0.3 };

function resolveColor(name) {
  const map = { accent: C.accent, green: C.green, amber: C.amber, red: C.red, offWhite: C.offWhite };
  return map[name] || C[name] || name;
}
function resolveBgColor(name) {
  const map = { accent: C.accentLight, green: C.greenBg, amber: C.amberBg, red: C.redBg, offWhite: C.offWhite };
  return map[name] || C[name] || name;
}

// =====================================================
// ICON SYSTEM
// =====================================================

const FA = require("react-icons/fa");
const ICON_MAP = {
  brain: FA.FaBrain, target: FA.FaBullseye, robot: FA.FaRobot,
  cogs: FA.FaCogs, database: FA.FaDatabase, magic: FA.FaMagic,
  bulb: FA.FaLightbulb, lightbulb: FA.FaLightbulb,
  warning: FA.FaExclamationTriangle, exclamation: FA.FaExclamationTriangle,
  check: FA.FaCheckCircle, arrow: FA.FaArrowRight, chevron: FA.FaChevronRight,
  file: FA.FaFileAlt, search: FA.FaSearch, comments: FA.FaComments,
  lock: FA.FaLock, eye: FA.FaEye, balance: FA.FaBalanceScale,
  pencil: FA.FaPencilAlt, cart: FA.FaShoppingCart, envelope: FA.FaEnvelope,
  users: FA.FaUsers, chart: FA.FaChartLine, code: FA.FaCode,
  globe: FA.FaGlobe, shield: FA.FaShieldAlt, star: FA.FaStar,
  book: FA.FaBook, laptop: FA.FaLaptop, tools: FA.FaTools,
};

const iconCache = {};
async function getIcon(name, color) {
  const key = `${name}_${color}`;
  if (iconCache[key]) return iconCache[key];
  const Comp = ICON_MAP[name];
  if (!Comp) return null;
  const svg = ReactDOMServer.renderToStaticMarkup(React.createElement(Comp, { color: `#${color}`, size: "256" }));
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  const data = "image/png;base64," + buf.toString("base64");
  iconCache[key] = data;
  return data;
}

// =====================================================
// SLIDE PRIMITIVES
// =====================================================

function addTopBar(s, pres) {
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: L.W, h: 0.035, fill: { color: C.accent } });
}

function addFooter(s, pres, courseId, num, total) {
  s.addShape(pres.shapes.LINE, { x: L.mx, y: L.H - 0.4, w: L.W - L.mx * 2, h: 0, line: { color: C.border, width: 0.5 } });
  s.addText(`${num} / ${total}`, { x: L.W - 1.5, y: L.H - 0.38, w: 1.2, h: 0.3, fontSize: F.size.caption, fontFace: F.sans, color: C.textMuted, align: "right", margin: 0 });
  s.addText(courseId, { x: L.mx, y: L.H - 0.38, w: 2, h: 0.3, fontSize: F.size.caption, fontFace: F.sans, color: C.textMuted, align: "left", margin: 0 });
}

// =====================================================
// SLIDE TYPE RENDERERS
// =====================================================

async function renderTitle(s, pres, slide, chapter, course) {
  s.background = { color: C.navy };
  const brainIcon = await getIcon("brain", C.accent);
  if (brainIcon) s.addImage({ data: brainIcon, x: (L.W - 0.7) / 2, y: 1.0, w: 0.7, h: 0.7 });
  s.addText(slide.title || chapter.title.split("—")[0].trim(), {
    x: 0.5, y: 1.9, w: 9, h: 0.9, fontSize: F.size.hero, fontFace: F.sans, bold: true, color: C.white, align: "center", margin: 0
  });
  s.addShape(pres.shapes.LINE, { x: 3.5, y: 2.95, w: 3, h: 0, line: { color: C.accentMid, width: 1.5 } });
  s.addText(slide.subtitle || chapter.title.split("—").slice(1).join("—").trim() || "", {
    x: 0.5, y: 3.15, w: 9, h: 0.5, fontSize: F.size.h2, fontFace: F.sans, color: C.accentMid, align: "center", margin: 0
  });
  const meta = `${chapter.id}   |   ${course.target || "全社員向け"}   |   ${course.duration || "10分"}`;
  s.addText(meta, { x: 0.5, y: 4.2, w: 9, h: 0.35, fontSize: F.size.label, fontFace: F.sans, color: C.textMuted, align: "center", margin: 0 });
}

async function renderGoals(s, pres, slide, chapter, course, num, total) {
  s.background = { color: C.white };
  addTopBar(s, pres);
  s.addText(slide.title || "今日のゴール", { x: L.mx, y: 0.35, w: 8.5, h: 0.55, fontSize: F.size.h1, fontFace: F.sans, bold: true, color: C.textDark, margin: 0 });
  addFooter(s, pres, chapter.id, num, total);
  const items = slide.items || chapter.learning_goals || [];
  items.forEach((g, i) => {
    const y = 1.25 + i * 1.15;
    s.addText(String(i + 1), { x: L.mx, y: y + 0.05, w: 0.55, h: 0.55, fontSize: F.size.h2, fontFace: F.sans, bold: true, color: C.white, align: "center", valign: "middle", fill: { color: C.accent }, shape: pres.shapes.OVAL });
    s.addText(g, { x: L.mx + 0.8, y, w: 7.5, h: 0.65, fontSize: F.size.h3, fontFace: F.sans, color: C.textDark, valign: "middle", margin: 0 });
    if (i < items.length - 1) s.addShape(pres.shapes.LINE, { x: L.mx, y: y + 0.85, w: L.W - L.mx * 2, h: 0, line: { color: C.border, width: 0.5 } });
  });
}

async function renderDefinition(s, pres, slide, chapter, course, num, total) {
  s.background = { color: C.white };
  addTopBar(s, pres);
  s.addText(slide.title, { x: L.mx, y: 0.35, w: 8.5, h: 0.55, fontSize: F.size.h1, fontFace: F.sans, bold: true, color: C.textDark, margin: 0 });
  addFooter(s, pres, chapter.id, num, total);

  // Definition box
  s.addShape(pres.shapes.RECTANGLE, { x: L.mx, y: 1.15, w: L.W - L.mx * 2, h: 0.85, fill: { color: C.accentLight } });
  s.addText(slide.definition, { x: L.mx + 0.3, y: 1.15, w: L.W - L.mx * 2 - 0.6, h: 0.85, fontSize: F.size.h2, fontFace: F.sans, bold: true, color: C.accent, valign: "middle", margin: 0 });

  if (slide.comparison) {
    const colW = 3.5, colY = 2.35, colH = 2.5;
    const arrowIcon = await getIcon("arrow", C.accent);

    // Left
    const lx = L.mx;
    s.addShape(pres.shapes.RECTANGLE, { x: lx, y: colY, w: colW, h: colH, fill: { color: C.offWhite }, line: { color: C.border, width: 0.5 } });
    s.addText(slide.comparison.left.label, { x: lx, y: colY + 0.15, w: colW, h: 0.4, fontSize: F.size.h3, fontFace: F.sans, bold: true, color: C.textDark, align: "center", margin: 0 });
    slide.comparison.left.steps.forEach((step, i) => {
      s.addText(`${i + 1}.  ${step}`, { x: lx + 0.4, y: colY + 0.7 + i * 0.55, w: colW - 0.8, h: 0.4, fontSize: F.size.body, fontFace: F.sans, color: C.textBody, valign: "middle", margin: 0 });
    });

    // Arrow
    if (arrowIcon) s.addImage({ data: arrowIcon, x: L.mx + colW + 0.35, y: 3.3, w: 0.5, h: 0.5 });

    // Right
    const rx = L.mx + colW + 1.2;
    s.addShape(pres.shapes.RECTANGLE, { x: rx, y: colY, w: colW, h: colH, fill: { color: C.offWhite }, line: { color: C.border, width: 0.5 } });
    s.addText(slide.comparison.right.label, { x: rx, y: colY + 0.15, w: colW, h: 0.4, fontSize: F.size.h3, fontFace: F.sans, bold: true, color: C.accent, align: "center", margin: 0 });
    slide.comparison.right.steps.forEach((step, i) => {
      s.addText(`${i + 1}.  ${step}`, { x: rx + 0.4, y: colY + 0.7 + i * 0.55, w: colW - 0.8, h: 0.4, fontSize: F.size.body, fontFace: F.sans, color: C.textBody, valign: "middle", margin: 0 });
    });
  }

  if (slide.footnote) {
    s.addText(slide.footnote, { x: L.mx, y: 4.9, w: L.W - L.mx * 2, h: 0.3, fontSize: F.size.label, fontFace: F.sans, italic: true, color: C.textLight, margin: 0 });
  }
}

async function renderCards(s, pres, slide, chapter, course, num, total) {
  s.background = { color: C.white };
  addTopBar(s, pres);
  s.addText(slide.title, { x: L.mx, y: 0.35, w: 8.5, h: 0.55, fontSize: F.size.h1, fontFace: F.sans, bold: true, color: C.textDark, margin: 0 });
  addFooter(s, pres, chapter.id, num, total);

  const cards = slide.cards || [];
  const cardW = 2.55, cardGap = 0.3;
  const totalW = cardW * cards.length + cardGap * (cards.length - 1);
  const startX = (L.W - totalW) / 2;
  const chevronIcon = await getIcon("chevron", C.textMuted);

  for (let i = 0; i < cards.length; i++) {
    const c = cards[i];
    const x = startX + i * (cardW + cardGap);
    const y = 1.15, h = 3.3;
    const color = resolveColor(c.color);
    const bgColor = resolveBgColor(c.color);

    s.addShape(pres.shapes.RECTANGLE, { x, y, w: cardW, h, fill: { color: C.white }, line: { color: C.border, width: 0.75 } });
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: cardW, h: 0.06, fill: { color } });

    // Icon
    const ic = await getIcon(c.icon, color);
    if (ic) {
      s.addShape(pres.shapes.OVAL, { x: x + (cardW - 0.7) / 2, y: y + 0.4, w: 0.7, h: 0.7, fill: { color: bgColor } });
      s.addImage({ data: ic, x: x + (cardW - 0.4) / 2, y: y + 0.55, w: 0.4, h: 0.4 });
    }

    s.addText(c.label, { x, y: y + 1.35, w: cardW, h: 0.5, fontSize: F.size.h3, fontFace: F.sans, bold: true, color: C.textDark, align: "center", margin: 0 });
    s.addShape(pres.shapes.LINE, { x: x + 0.4, y: y + 2.0, w: cardW - 0.8, h: 0, line: { color: C.border, width: 0.5 } });
    s.addText(c.desc, { x, y: y + 2.15, w: cardW, h: 0.5, fontSize: F.size.body, fontFace: F.sans, color: C.textLight, align: "center", margin: 0 });

    if (i < cards.length - 1 && chevronIcon) {
      s.addImage({ data: chevronIcon, x: x + cardW + 0.06, y: y + h / 2 - 0.15, w: 0.2, h: 0.2 });
    }
  }
}

async function renderExamples(s, pres, slide, chapter, course, num, total) {
  s.background = { color: C.white };
  addTopBar(s, pres);

  const color = resolveColor(slide.color || "accent");
  const bgColor = resolveBgColor(slide.color || "accent");

  // Number tag
  if (slide.number) {
    s.addShape(pres.shapes.RECTANGLE, { x: L.mx, y: 0.35, w: 0.7, h: 0.28, fill: { color: bgColor }, rectRadius: 0.05 });
    s.addText(String(slide.number).padStart(2, "0"), { x: L.mx, y: 0.35, w: 0.7, h: 0.28, fontSize: F.size.tag, fontFace: F.sans, bold: true, color, align: "center", valign: "middle" });
  }
  s.addText(slide.title, { x: L.mx, y: 0.7, w: 8, h: 0.5, fontSize: F.size.h1, fontFace: F.sans, bold: true, color: C.textDark, margin: 0 });
  if (slide.subtitle) s.addText(slide.subtitle, { x: L.mx, y: 1.2, w: 8.5, h: 0.3, fontSize: F.size.body, fontFace: F.sans, color: C.textLight, margin: 0 });

  // Badge
  if (slide.badge) {
    s.addShape(pres.shapes.RECTANGLE, { x: L.W - L.mx - 2.0, y: 0.75, w: 2.0, h: 0.35, fill: { color: bgColor }, rectRadius: 0.05 });
    s.addText(slide.badge, { x: L.W - L.mx - 2.0, y: 0.75, w: 2.0, h: 0.35, fontSize: F.size.label, fontFace: F.sans, bold: true, color, align: "center", valign: "middle" });
  }
  addFooter(s, pres, chapter.id, num, total);

  // Flow diagram
  if (slide.flow) {
    const fW = 1.7, fGap = 0.55;
    const fTotalW = fW * slide.flow.length + fGap * (slide.flow.length - 1);
    const fStartX = (L.W - fTotalW) / 2;
    const chevIcon = await getIcon("chevron", C.accentMid);
    slide.flow.forEach((item, i) => {
      const x = fStartX + i * (fW + fGap);
      s.addShape(pres.shapes.RECTANGLE, { x, y: 1.75, w: fW, h: 0.55, fill: { color: i === slide.flow.length - 1 ? color : C.accent }, rectRadius: 0.05 });
      s.addText(item, { x, y: 1.75, w: fW, h: 0.55, fontSize: F.size.label, fontFace: F.sans, bold: true, color: C.white, align: "center", valign: "middle" });
      if (i < slide.flow.length - 1 && chevIcon) s.addImage({ data: chevIcon, x: x + fW + 0.15, y: 1.92, w: 0.2, h: 0.2 });
    });
  }

  // Examples
  const startY = slide.flow ? 2.65 : 1.75;
  const examples = slide.examples || [];
  examples.forEach((e, i) => {
    const y = startY + i * (slide.flow ? 0.75 : 0.85);
    if (slide.flow) {
      // Simple label + desc
      if (i > 0) s.addShape(pres.shapes.LINE, { x: L.mx, y, w: L.W - L.mx * 2, h: 0, line: { color: C.border, width: 0.5 } });
      s.addText(e.label, { x: L.mx + 0.2, y, w: 1.5, h: 0.6, fontSize: F.size.body, fontFace: F.sans, bold: true, color, valign: "middle", margin: 0 });
      s.addText(e.desc, { x: L.mx + 2.0, y, w: 6.5, h: 0.6, fontSize: F.size.body, fontFace: F.sans, color: C.textBody, valign: "middle", margin: 0 });
    } else if (e.input && e.output) {
      // Table-style: label | input → output
      s.addShape(pres.shapes.RECTANGLE, { x: L.mx, y, w: 0.05, h: 0.7, fill: { color: C.amber } });
      s.addShape(pres.shapes.RECTANGLE, { x: L.mx, y, w: L.W - L.mx * 2, h: 0.7, fill: { color: C.offWhite } });
      s.addShape(pres.shapes.RECTANGLE, { x: L.mx, y, w: 0.05, h: 0.7, fill: { color } });
      s.addText(e.label, { x: L.mx + 0.3, y, w: 1.5, h: 0.4, fontSize: F.size.body, fontFace: F.sans, bold: true, color: C.textDark, valign: "bottom", margin: 0 });
      if (e.tools) s.addText(e.tools, { x: L.mx + 0.3, y: y + 0.38, w: 1.5, h: 0.3, fontSize: F.size.caption, fontFace: F.sans, color: C.textMuted, valign: "top", margin: 0 });
      s.addText(e.desc || `${e.input} → ${e.output}`, { x: L.mx + 2.2, y, w: 6.0, h: 0.7, fontSize: F.size.body, fontFace: F.sans, color: C.textBody, valign: "middle", margin: 0 });
    } else {
      // Card-style with accent border
      s.addShape(pres.shapes.RECTANGLE, { x: L.mx, y, w: L.W - L.mx * 2, h: 0.7, fill: { color: C.offWhite } });
      s.addShape(pres.shapes.RECTANGLE, { x: L.mx, y, w: 0.05, h: 0.7, fill: { color } });
      s.addText(e.label, { x: L.mx + 0.3, y, w: 1.5, h: 0.4, fontSize: F.size.body, fontFace: F.sans, bold: true, color: C.textDark, valign: "bottom", margin: 0 });
      if (e.tools) s.addText(e.tools, { x: L.mx + 0.3, y: y + 0.38, w: 1.5, h: 0.3, fontSize: F.size.caption, fontFace: F.sans, color: C.textMuted, valign: "top", margin: 0 });
      s.addText(e.desc, { x: L.mx + 2.2, y, w: 6.0, h: 0.7, fontSize: F.size.body, fontFace: F.sans, color: C.textBody, valign: "middle", margin: 0 });
    }
  });

  // Pros/Cons or Insight
  if (slide.pros || slide.cons) {
    const by = slide.flow ? 4.55 : 4.35;
    if (slide.pros) {
      const checkIcon = await getIcon("check", C.green);
      s.addShape(pres.shapes.RECTANGLE, { x: L.mx, y: by, w: 4.0, h: 0.55, fill: { color: C.greenBg } });
      if (checkIcon) s.addImage({ data: checkIcon, x: L.mx + 0.15, y: by + 0.1, w: 0.3, h: 0.3 });
      s.addText(slide.pros, { x: L.mx + 0.6, y: by, w: 3.2, h: 0.55, fontSize: F.size.label, fontFace: F.sans, color: C.green, valign: "middle", margin: 0 });
    }
    if (slide.cons) {
      const warnIcon = await getIcon("warning", C.amber);
      s.addShape(pres.shapes.RECTANGLE, { x: L.mx + 4.5, y: by, w: 4.0, h: 0.55, fill: { color: C.amberBg } });
      if (warnIcon) s.addImage({ data: warnIcon, x: L.mx + 4.65, y: by + 0.1, w: 0.3, h: 0.3 });
      s.addText(slide.cons, { x: L.mx + 5.1, y: by, w: 3.2, h: 0.55, fontSize: F.size.label, fontFace: F.sans, color: C.amber, valign: "middle", margin: 0 });
    }
  }
  if (slide.insight) {
    const bulbIcon = await getIcon("bulb", C.amber);
    s.addShape(pres.shapes.RECTANGLE, { x: L.mx, y: 4.55, w: L.W - L.mx * 2, h: 0.5, fill: { color: C.accentLight } });
    if (bulbIcon) s.addImage({ data: bulbIcon, x: L.mx + 0.2, y: 4.63, w: 0.3, h: 0.3 });
    s.addText(slide.insight, { x: L.mx + 0.7, y: 4.55, w: 7.5, h: 0.5, fontSize: F.size.label, fontFace: F.sans, bold: true, color: C.accent, valign: "middle", margin: 0 });
  }
}

async function renderTable(s, pres, slide, chapter, course, num, total) {
  s.background = { color: C.white };
  addTopBar(s, pres);
  s.addText(slide.title, { x: L.mx, y: 0.35, w: 8.5, h: 0.55, fontSize: F.size.h1, fontFace: F.sans, bold: true, color: C.textDark, margin: 0 });
  addFooter(s, pres, chapter.id, num, total);

  const headers = slide.headers || [];
  const rows = slide.rows || [];
  const hdrColors = (slide.header_colors || []).map(resolveColor);
  const colCount = headers.length;
  const firstColW = 1.8;
  const dataColW = (L.W - L.mx * 2 - firstColW) / (colCount - 1);
  const colW = [firstColW, ...Array(colCount - 1).fill(dataColW)];
  const tblW = colW.reduce((a, b) => a + b, 0);
  const tblX = (L.W - tblW) / 2;
  const tblY = 1.2;
  const rowH = 0.7;

  // Header
  let cx = tblX;
  headers.forEach((h, i) => {
    s.addShape(pres.shapes.RECTANGLE, { x: cx, y: tblY, w: colW[i], h: rowH, fill: { color: hdrColors[i] || C.accent } });
    s.addText(h, { x: cx, y: tblY, w: colW[i], h: rowH, fontSize: F.size.label, fontFace: F.sans, bold: true, color: i === 0 ? C.textMuted : C.white, align: "center", valign: "middle" });
    cx += colW[i];
  });

  rows.forEach((row, ri) => {
    cx = tblX;
    const ry = tblY + (ri + 1) * rowH;
    row.forEach((cell, ci) => {
      const bg = ri % 2 === 0 ? C.offWhite : C.white;
      s.addShape(pres.shapes.RECTANGLE, { x: cx, y: ry, w: colW[ci], h: rowH, fill: { color: ci === 0 ? C.offWhite : bg } });
      s.addText(cell, { x: cx, y: ry, w: colW[ci], h: rowH, fontSize: ci === 0 ? F.size.label : F.size.body, fontFace: F.sans, bold: ci === 0, color: ci === 0 ? C.textMuted : C.textDark, align: "center", valign: "middle" });
      cx += colW[ci];
    });
  });
}

async function renderGrid(s, pres, slide, chapter, course, num, total) {
  s.background = { color: C.white };
  addTopBar(s, pres);
  s.addText(slide.title, { x: L.mx, y: 0.35, w: 8.5, h: 0.55, fontSize: F.size.h1, fontFace: F.sans, bold: true, color: C.textDark, margin: 0 });
  addFooter(s, pres, chapter.id, num, total);

  const items = slide.items || [];
  const cardW = 4.0, cardH = 1.2, gapX = 0.5, gapY = 0.4;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const col = i % 2, row = Math.floor(i / 2);
    const x = L.mx + col * (cardW + gapX);
    const y = 1.2 + row * (cardH + gapY);

    s.addShape(pres.shapes.RECTANGLE, { x, y, w: cardW, h: cardH, fill: { color: C.offWhite }, line: { color: C.border, width: 0.5 } });

    const ic = await getIcon(item.icon, C.accent);
    if (ic) s.addImage({ data: ic, x: x + 0.3, y: y + (cardH - 0.4) / 2, w: 0.4, h: 0.4 });

    s.addText(item.label, { x: x + 0.95, y: y + 0.15, w: 2.8, h: 0.4, fontSize: F.size.h3, fontFace: F.sans, bold: true, color: C.textDark, valign: "middle", margin: 0 });
    s.addText(item.desc, { x: x + 0.95, y: y + 0.6, w: 2.8, h: 0.4, fontSize: F.size.label, fontFace: F.sans, color: C.textLight, valign: "top", margin: 0 });
  }

  if (slide.key_message) {
    s.addShape(pres.shapes.RECTANGLE, { x: L.mx, y: 4.0, w: L.W - L.mx * 2, h: 0.7, fill: { color: C.navy } });
    s.addText(slide.key_message, { x: L.mx + 0.3, y: 4.0, w: L.W - L.mx * 2 - 0.6, h: 0.7, fontSize: F.size.body, fontFace: F.sans, bold: true, color: C.white, align: "center", valign: "middle" });
  }
}

async function renderCaution(s, pres, slide, chapter, course, num, total) {
  s.background = { color: C.white };
  addTopBar(s, pres);
  s.addText(slide.title, { x: L.mx, y: 0.35, w: 8.5, h: 0.55, fontSize: F.size.h1, fontFace: F.sans, bold: true, color: C.textDark, margin: 0 });
  addFooter(s, pres, chapter.id, num, total);

  const items = slide.items || [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const y = 1.2 + i * 1.2;
    const color = resolveColor(item.color);
    const bgColor = resolveBgColor(item.color);

    s.addShape(pres.shapes.RECTANGLE, { x: L.mx, y, w: 0.05, h: 0.95, fill: { color } });

    const ic = await getIcon(item.icon, color);
    s.addShape(pres.shapes.OVAL, { x: L.mx + 0.3, y: y + 0.15, w: 0.6, h: 0.6, fill: { color: bgColor } });
    if (ic) s.addImage({ data: ic, x: L.mx + 0.4, y: y + 0.25, w: 0.4, h: 0.4 });

    s.addText(item.title, { x: L.mx + 1.2, y: y + 0.05, w: 7, h: 0.4, fontSize: F.size.h3, fontFace: F.sans, bold: true, color: C.textDark, valign: "middle", margin: 0 });
    s.addText(item.desc, { x: L.mx + 1.2, y: y + 0.5, w: 7, h: 0.4, fontSize: F.size.body, fontFace: F.sans, color: C.textLight, valign: "top", margin: 0 });
  }
}

async function renderSummary(s, pres, slide, chapter, course, num, total) {
  s.background = { color: C.offWhite };
  addTopBar(s, pres);
  s.addText(slide.title || "まとめ", { x: L.mx, y: 0.35, w: 8.5, h: 0.55, fontSize: F.size.h1, fontFace: F.sans, bold: true, color: C.textDark, margin: 0 });
  addFooter(s, pres, chapter.id, num, total);

  const items = slide.items || [];
  items.forEach((item, i) => {
    const y = 1.2 + i * 0.95;
    const color = resolveColor(item.color);
    s.addShape(pres.shapes.RECTANGLE, { x: L.mx, y, w: L.W - L.mx * 2, h: 0.75, fill: { color: C.white }, line: { color: C.border, width: 0.5 } });
    s.addShape(pres.shapes.RECTANGLE, { x: L.mx, y, w: 0.05, h: 0.75, fill: { color } });
    s.addText(item.label, { x: L.mx + 0.35, y, w: 1.8, h: 0.75, fontSize: F.size.body, fontFace: F.sans, bold: true, color, valign: "middle", margin: 0 });
    s.addText(item.text, { x: L.mx + 2.2, y, w: 6.0, h: 0.75, fontSize: F.size.body, fontFace: F.sans, color: C.textDark, valign: "middle", margin: 0 });
  });
}

async function renderEnd(s, pres, slide, chapter, course, num, total) {
  s.background = { color: C.navy };
  s.addText("お疲れさまでした！", { x: 0.5, y: 1.2, w: 9, h: 0.8, fontSize: 36, fontFace: F.sans, bold: true, color: C.white, align: "center", margin: 0 });
  s.addShape(pres.shapes.RECTANGLE, { x: 2.5, y: 2.3, w: 5, h: 2.2, fill: { color: C.white } });
  s.addText(`確認テスト（${slide.test_count || 5}問）`, { x: 2.5, y: 2.5, w: 5, h: 0.55, fontSize: F.size.h2, fontFace: F.sans, bold: true, color: C.textDark, align: "center", margin: 0 });
  s.addShape(pres.shapes.LINE, { x: 3.5, y: 3.1, w: 3, h: 0, line: { color: C.border, width: 0.5 } });
  s.addText(`${slide.pass_rate || 80}%以上の正答で修了`, { x: 2.5, y: 3.25, w: 5, h: 0.45, fontSize: F.size.h3, fontFace: F.sans, color: C.accent, align: "center", margin: 0 });
  if (slide.next) {
    s.addText(`次の動画: ${slide.next}`, { x: 2.5, y: 3.8, w: 5, h: 0.35, fontSize: F.size.label, fontFace: F.sans, color: C.textMuted, align: "center", margin: 0 });
  }
}

// =====================================================
// RENDERER MAP
// =====================================================

const RENDERERS = {
  title: renderTitle,
  goals: renderGoals,
  definition: renderDefinition,
  cards: renderCards,
  examples: renderExamples,
  table: renderTable,
  grid: renderGrid,
  caution: renderCaution,
  summary: renderSummary,
  end: renderEnd,
};

// =====================================================
// YAML PARSER (simple, no dependency)
// =====================================================

function parseYaml(text) {
  // Use JSON fallback: convert YAML to JSON via simple regex for our subset
  // For production, use js-yaml. This handles our course.yaml format.
  try {
    const jsYaml = require("js-yaml");
    return jsYaml.load(text);
  } catch (e) {
    // Fallback: try to find a JSON version
    throw new Error("js-yaml not found. Install with: npm install -g js-yaml");
  }
}

// =====================================================
// MAIN
// =====================================================

async function generateChapter(courseData, chapterIndex, outputDir) {
  const course = courseData.course;
  const chapter = courseData.chapters[chapterIndex];
  const slides = chapter.slides || [];
  const total = slides.length;

  console.log(`\n[生成] ${chapter.id}: ${chapter.title} (${total}スライド)`);

  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "Gorilla Knowledge";
  pres.title = `${chapter.id}: ${chapter.title}`;

  for (let i = 0; i < slides.length; i++) {
    const slideDef = slides[i];
    const renderer = RENDERERS[slideDef.type];
    if (!renderer) {
      console.log(`  WARNING: 未知のスライドタイプ "${slideDef.type}", スキップ`);
      continue;
    }

    const s = pres.addSlide();
    await renderer(s, pres, slideDef, chapter, course, i + 1, total);
    console.log(`  [スライド ${i + 1}/${total}] ${slideDef.type}: ${slideDef.title || ""}`);
  }

  const outPath = path.join(outputDir, "スライド.pptx");
  await pres.writeFile({ fileName: outPath });
  console.log(`  [出力] ${outPath}`);
  return outPath;
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.log("Usage: node slide-generator.js <course.yaml> [chapterIndex] [outputDir]");
    process.exit(1);
  }

  const yamlPath = path.resolve(args[0]);
  const chapterIndex = args[1] !== undefined ? parseInt(args[1]) : null;
  const outputDir = args[2] ? path.resolve(args[2]) : path.dirname(yamlPath);

  const yamlText = fs.readFileSync(yamlPath, "utf-8");
  const courseData = parseYaml(yamlText);

  if (chapterIndex !== null) {
    await generateChapter(courseData, chapterIndex, outputDir);
  } else {
    // Generate all chapters
    for (let i = 0; i < courseData.chapters.length; i++) {
      const ch = courseData.chapters[i];
      const chDir = path.join(path.dirname(yamlPath), `${ch.id}_${ch.title.split("—")[0].trim()}`);
      if (!fs.existsSync(chDir)) fs.mkdirSync(chDir, { recursive: true });
      await generateChapter(courseData, i, chDir);
    }
  }

  console.log("\n=== 完了 ===");
}

main().catch(err => { console.error(err); process.exit(1); });
