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
  red: "DC2626", redBg: "FEE2E2", border: "E5E7EB", purple: "7C3AED", purpleBg: "EDE9FE"
};

const F = { sans: "Calibri", size: { hero: 40, h1: 32, h2: 20, h3: 16, body: 14, label: 12, caption: 10 } };
const L = { W: 10, H: 5.625, mx: 0.75, my: 0.5, gap: 0.3 };

let pres;

function addTopBar(slide) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: L.W, h: 0.04, fill: { color: C.accent }
  });
}

function addFooter(slide, num, total) {
  slide.addShape(pres.shapes.LINE, {
    x: L.mx, y: L.H - 0.42, w: L.W - L.mx * 2, h: 0,
    line: { color: C.border, width: 0.5 }
  });
  slide.addText(`P-04`, {
    x: L.mx, y: L.H - 0.40, w: 2, h: 0.3,
    fontSize: F.size.caption, fontFace: F.sans,
    color: C.textMuted, align: "left", shrinkText: true
  });
  slide.addText(`${num} / ${total}`, {
    x: L.W - 1.5, y: L.H - 0.40, w: 1.2, h: 0.3,
    fontSize: F.size.caption, fontFace: F.sans,
    color: C.textMuted, align: "right", shrinkText: true
  });
}

function addTitle(slide, title, tag) {
  if (tag) {
    const tagW = Math.max(tag.length * 0.13 + 0.4, 0.9);
    slide.addShape(pres.shapes.RECTANGLE, {
      x: L.mx, y: 0.22, w: tagW, h: 0.28,
      fill: { color: C.accentLight }, rectRadius: 0.04
    });
    slide.addText(tag, {
      x: L.mx, y: 0.22, w: tagW, h: 0.28,
      fontSize: F.size.caption, fontFace: F.sans, bold: true,
      color: C.accent, align: "center", valign: "middle", shrinkText: true
    });
  }
  slide.addText(title, {
    x: L.mx, y: tag ? 0.58 : 0.22, w: 8.5, h: 0.48,
    fontSize: F.size.h1, fontFace: F.sans, bold: true,
    color: C.textDark, shrinkText: true
  });
}

const T = 12; // total slides

async function main() {
  pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "Gorilla Knowledge";
  pres.title = "P-04: セキュリティ・コンプライアンス・対象者 -- Gemini Enterpriseのセキュアな使い方";

  // ============================================================
  // SLIDE 1: TITLE
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };
    s.addText("🔐", {
      x: (L.W - 0.65) / 2, y: 0.85, w: 0.65, h: 0.65,
      fontSize: 48, align: "center", valign: "middle"
    });
    s.addText("セキュリティ・コンプライアンス・対象者", {
      x: 0.5, y: 1.65, w: 9, h: 0.85,
      fontSize: F.size.hero, fontFace: F.sans, bold: true,
      color: C.white, align: "center", shrinkText: true
    });
    s.addShape(pres.shapes.LINE, {
      x: 2.5, y: 2.65, w: 5, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });
    s.addText("Gemini Enterpriseのセキュアな使い方", {
      x: 0.5, y: 2.8, w: 9, h: 0.45,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.accentMid, align: "center", shrinkText: true
    });
    s.addText("P-04  |  全社員向け  |  12分", {
      x: 0.5, y: 3.9, w: 9, h: 0.35,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.textMuted, align: "center", shrinkText: true
    });
  }

  // ============================================================
  // SLIDE 2: GOALS
  // ============================================================
  {
    const s = pres.addSlide();
    addTopBar(s);
    addTitle(s, "今日のゴール", "SLIDE 2");

    const goals = [
      { emoji: "🔒", title: "セキュリティ機能を理解", text: "CMEK・EKM・VPC Service Controls" },
      { emoji: "✅", title: "コンプライアンス認証を知る", text: "HIPAA・FedRAMP・ISO 27001・SOC2・PCI DSS" },
      { emoji: "🏢", title: "業界別導入判断ができる", text: "医療・金融・政府・防衛・スタートアップ" },
      { emoji: "⚖️", title: "セキュリティ vs 利便性", text: "バランスの考え方を理解する" }
    ];

    let y = 1.15;
    for (let i = 0; i < goals.length; i++) {
      s.addText(goals[i].emoji, {
        x: L.mx + 0.1, y: y + 0.02, w: 0.25, h: 0.25,
        fontSize: 20, align: "center", valign: "middle"
      });
      s.addText(goals[i].title, {
        x: L.mx + 0.5, y: y, w: 4.5, h: 0.2,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark
      });
      s.addText(goals[i].text, {
        x: L.mx + 0.5, y: y + 0.23, w: 4.5, h: 0.15,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textLight
      });
      y += 0.9;
    }
    addFooter(s, 2, T);
  }

  // ============================================================
  // SLIDE 3: Security Overview
  // ============================================================
  {
    const s = pres.addSlide();
    addTopBar(s);
    addTitle(s, "Gemini Enterprise のセキュリティ全体像", "SLIDE 3");

    // 4-layer pyramid
    const layers = [
      { label: "コンプライアンス", color: C.red, y: 1.0 },
      { label: "データ保護", color: C.amber, y: 1.8 },
      { label: "ネットワークセキュリティ", color: C.accent, y: 2.6 },
      { label: "暗号化キー管理", color: C.green, y: 3.4 }
    ];

    layers.forEach((layer, idx) => {
      const width = 9 - idx * 1.8;
      const x = L.mx + (9 - width) / 2;
      s.addShape(pres.shapes.RECTANGLE, {
        x: x, y: layer.y, w: width, h: 0.6,
        fill: { color: layer.color }, line: { color: C.white, width: 2 }
      });
      s.addText(layer.label, {
        x: x, y: layer.y, w: width, h: 0.6,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.white, align: "center", valign: "middle"
      });
    });

    addFooter(s, 3, T);
  }

  // ============================================================
  // SLIDE 4: CMEK・EKM・VPC
  // ============================================================
  {
    const s = pres.addSlide();
    addTopBar(s);
    addTitle(s, "CMEK・EKM・VPC Service Controls とは", "SLIDE 4");

    const features = [
      {
        emoji: "🔑",
        num: "1️⃣",
        title: "CMEK",
        points: ["データ暗号化キーを顧客管理", "Cloud Key Management Service", "鍵の交換・破棄が自由"]
      },
      {
        emoji: "🔐",
        num: "2️⃣",
        title: "EKM",
        points: ["キーを社内システムに配置", "HSM（ハードウェアセキュリティ）対応", "Googleさえ中身を見られない"]
      },
      {
        emoji: "🌐",
        num: "3️⃣",
        title: "VPC Service Controls",
        points: ["アクセスを『要塞』の中に制限", "社内ネットワーク経由のみ", "データが社外に出ない"]
      }
    ];

    let x = L.mx;
    features.forEach((feature) => {
      s.addShape(pres.shapes.RECTANGLE, {
        x: x, y: 1.15, w: 2.8, h: 3.8,
        fill: { color: C.lightGray }, line: { color: C.border, width: 1 }
      });
      s.addText(feature.emoji, {
        x: x + 1.15, y: 1.3, w: 0.5, h: 0.5,
        fontSize: 24, align: "center", valign: "middle"
      });
      s.addText(feature.num, {
        x: x + 0.15, y: 1.35, w: 0.4, h: 0.4,
        fontSize: 16, fontFace: F.sans, bold: true,
        color: C.accent
      });
      s.addText(feature.title, {
        x: x + 0.15, y: 1.95, w: 2.5, h: 0.3,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark
      });

      let py = 2.35;
      feature.points.forEach((point) => {
        s.addText("• " + point, {
          x: x + 0.25, y: py, w: 2.3, h: 0.35,
          fontSize: F.size.body, fontFace: F.sans,
          color: C.textBody, wrap: true
        });
        py += 0.4;
      });
      x += 3.0;
    });

    addFooter(s, 4, T);
  }

  // ============================================================
  // SLIDE 5: Key Management 3 Levels
  // ============================================================
  {
    const s = pres.addSlide();
    addTopBar(s);
    addTitle(s, "暗号化キー管理：3つのレベル", "SLIDE 5");

    const levels = [
      { label: "🟥 高度（EKM/HSM）", color: C.redBg, border: C.red, desc: "最高のセキュリティ\n社内システムに鍵を配置\nGoogle さえ中身を見られない", y: 1.15 },
      { label: "🟨 中級（CMEK）", color: C.amberBg, border: C.amber, desc: "中レベルのセキュリティ\n顧客がクラウドで鍵を管理\n定期的に交換・破棄可能", y: 2.3 },
      { label: "🟩 標準（Google管理）", color: C.greenBg, border: C.green, desc: "十分なセキュリティ\nGoogle が鍵を管理\nほぼすべての企業が選択", y: 3.45 }
    ];

    levels.forEach((level) => {
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y: level.y, w: 8.5, h: 0.95,
        fill: { color: level.color }, line: { color: level.border, width: 2 }
      });
      s.addText(level.label, {
        x: L.mx + 0.2, y: level.y + 0.05, w: 2, h: 0.3,
        fontSize: F.size.h2, fontFace: F.sans, bold: true,
        color: C.textDark
      });
      s.addText(level.desc, {
        x: L.mx + 2.5, y: level.y + 0.05, w: 5.8, h: 0.85,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody
      });
    });

    addFooter(s, 5, T);
  }

  // ============================================================
  // SLIDE 6: Compliance Certifications
  // ============================================================
  {
    const s = pres.addSlide();
    addTopBar(s);
    addTitle(s, "コンプライアンス認証ガイド", "SLIDE 6");

    const certs = [
      { emoji: "🏥", label: "HIPAA", desc: "医療業界\n患者情報の取扱い必須", color: C.red },
      { emoji: "🏛️", label: "FedRAMP", desc: "米国政府機関向け\n防衛・政府との取引必須", color: C.red },
      { emoji: "🌍", label: "ISO 27001", desc: "国際標準\nグローバル企業のデファクト", color: C.accent },
      { emoji: "📋", label: "SOC 2", desc: "監査報告書\nセキュリティ監査で要求", color: C.amber },
      { emoji: "💳", label: "PCI DSS", desc: "クレジットカード業界\n決済システムに必須", color: C.purple }
    ];

    let x = L.mx;
    let row = 0;
    certs.forEach((cert, idx) => {
      if (idx === 3) {
        x = L.mx + (10 - 2 * 1.9) / 2;
        row = 1;
      }

      const cy = 1.0 + row * 2.2;
      s.addShape(pres.shapes.RECTANGLE, {
        x: x, y: cy, w: 1.9, h: 1.9,
        fill: { color: C.white }, line: { color: cert.color, width: 2 }
      });
      s.addText(cert.emoji, {
        x: x + 0.6, y: cy + 0.15, w: 0.7, h: 0.7,
        fontSize: 32, align: "center", valign: "middle"
      });
      s.addText(cert.label, {
        x: x, y: cy + 1.0, w: 1.9, h: 0.25,
        fontSize: F.size.h2, fontFace: F.sans, bold: true,
        color: cert.color, align: "center"
      });
      s.addText(cert.desc, {
        x: x + 0.1, y: cy + 1.3, w: 1.7, h: 0.5,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.textLight, align: "center", wrap: true
      });
      x += 2.0;
    });

    addFooter(s, 6, T);
  }

  // ============================================================
  // SLIDE 7: Case Studies
  // ============================================================
  {
    const s = pres.addSlide();
    addTopBar(s);
    addTitle(s, "HIPAA・FedRAMP 準備企業の導入事例", "SLIDE 7");

    const cases = [
      { emoji: "🏥", title: "医療機関", result: "医師の業務時間 20% 削減\nHIPAA対応を実現" },
      { emoji: "🏛️", title: "米国防衛企業", result: "文書分類工数 40% 削減\nFedRAMP要件をクリア" },
      { emoji: "🏦", title: "金融機関", result: "リスク分析精度 50% 向上\n内部統制を強化" },
      { emoji: "🛍️", title: "大手小売", result: "不正検知精度 35% 向上\nPCI DSS対応を実現" }
    ];

    let y = 1.15;
    cases.forEach((caseItem) => {
      s.addText(caseItem.emoji, {
        x: L.mx + 0.1, y: y + 0.05, w: 0.35, h: 0.35,
        fontSize: 20, align: "center", valign: "middle"
      });
      s.addText(caseItem.title, {
        x: L.mx + 0.6, y: y, w: 2, h: 0.25,
        fontSize: F.size.h2, fontFace: F.sans, bold: true,
        color: C.textDark
      });
      s.addText(caseItem.result, {
        x: L.mx + 0.6, y: y + 0.28, w: 8.3, h: 0.5,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody
      });
      y += 0.95;
    });

    addFooter(s, 7, T);
  }

  // ============================================================
  // SLIDE 8: Industry Suitability
  // ============================================================
  {
    const s = pres.addSlide();
    addTopBar(s);
    addTitle(s, "業界別：向いている企業・向かない企業", "SLIDE 8");

    const rows = [
      { level: "🟩 推奨度『高い』", color: C.greenBg, border: C.green, industries: "医療・ヘルスケア ／ 金融・銀行 ／ 政府・防衛 ／ 製造業 ／ 法律事務所" },
      { level: "🟨 推奨度『中程度』", color: C.amberBg, border: C.amber, industries: "大企業グループ ／ グローバル企業 ／ 公共サービス ／ 大手小売" },
      { level: "🟥 推奨度『低い』", color: C.redBg, border: C.red, industries: "スタートアップ ／ 中小企業 ／ 一般的なSaaS企業" }
    ];

    let y = 1.15;
    rows.forEach((row) => {
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y: y, w: 8.5, h: 1.1,
        fill: { color: row.color }, line: { color: row.border, width: 2 }
      });
      s.addText(row.level, {
        x: L.mx + 0.2, y: y + 0.08, w: 2.2, h: 0.3,
        fontSize: F.size.h2, fontFace: F.sans, bold: true,
        color: C.textDark
      });
      s.addText(row.industries, {
        x: L.mx + 2.6, y: y + 0.08, w: 5.7, h: 0.9,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, wrap: true
      });
      y += 1.25;
    });

    addFooter(s, 8, T);
  }

  // ============================================================
  // SLIDE 9: Job Roles Suitability
  // ============================================================
  {
    const s = pres.addSlide();
    addTopBar(s);
    addTitle(s, "職種別：Gemini企業向きの人・そうでない人", "SLIDE 9");

    const roles = [
      { level: "🌟 活躍度『高い』", color: C.greenBg, border: C.green, roles: "CEO・CFO ／ セキュリティ・コンプライアンス担当 ／ R&D・開発 ／ 法務 ／ 医療研究者 ／ 金融アナリスト" },
      { level: "🟡 活躍度『中程度』", color: C.amberBg, border: C.amber, roles: "営業 ／ マーケティング ／ 人事 ／ カスタマーサクセス" },
      { level: "🟥 活躍度『低い』", color: C.redBg, border: C.red, roles: "事務スタッフ ／ アルバイト ／ 外部協力者" }
    ];

    let y = 1.15;
    roles.forEach((role) => {
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx, y: y, w: 8.5, h: 1.1,
        fill: { color: role.color }, line: { color: role.border, width: 2 }
      });
      s.addText(role.level, {
        x: L.mx + 0.2, y: y + 0.08, w: 2.2, h: 0.3,
        fontSize: F.size.h2, fontFace: F.sans, bold: true,
        color: C.textDark
      });
      s.addText(role.roles, {
        x: L.mx + 2.6, y: y + 0.08, w: 5.7, h: 0.9,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody, wrap: true
      });
      y += 1.25;
    });

    addFooter(s, 9, T);
  }

  // ============================================================
  // SLIDE 10: Security vs Usability
  // ============================================================
  {
    const s = pres.addSlide();
    addTopBar(s);
    addTitle(s, "セキュリティ vs 利便性のバランス", "SLIDE 10");

    // Chart
    const items = [
      { label: "EKM・HSM", sec: 4.8, usab: 1.5, y: 1.15 },
      { label: "CMEK", sec: 3.5, usab: 3.0, y: 2.2 },
      { label: "標準Google", sec: 2.8, usab: 4.5, y: 3.25 }
    ];

    items.forEach((item) => {
      // Security bar
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx + 1.5, y: item.y, w: item.sec * 0.8, h: 0.25,
        fill: { color: C.red }
      });
      s.addText(item.label, {
        x: L.mx + 0.1, y: item.y, w: 1.3, h: 0.25,
        fontSize: F.size.h3, fontFace: F.sans, bold: true,
        color: C.textDark, valign: "middle"
      });
      s.addText("セキュリティ", {
        x: L.mx + 1.5, y: item.y - 0.25, w: 1.5, h: 0.2,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.red
      });

      // Usability bar
      s.addShape(pres.shapes.RECTANGLE, {
        x: L.mx + 1.5 + item.sec * 0.8 + 0.3, y: item.y, w: item.usab * 0.8, h: 0.25,
        fill: { color: C.green }
      });
      s.addText("利便性", {
        x: L.mx + 1.5 + item.sec * 0.8 + 0.3, y: item.y - 0.25, w: 1.5, h: 0.2,
        fontSize: F.size.label, fontFace: F.sans,
        color: C.green
      });
    });

    addFooter(s, 10, T);
  }

  // ============================================================
  // SLIDE 11: Deployment Checklist
  // ============================================================
  {
    const s = pres.addSlide();
    addTopBar(s);
    addTitle(s, "まとめ：導入チェックリスト", "SLIDE 11");

    const checklist = [
      "業界規制（HIPAA・FedRAMP・ISO 27001など）がある",
      "取り扱うデータが『極秘情報』『個人情報』『医療情報』",
      "データ漏洩時のリスク（損害額・規制罰金）が大きい",
      "海外進出・グローバル展開を考えている",
      "監査・コンプライアンス部門から『セキュリティ強化』を要求されている"
    ];

    let y = 1.0;
    checklist.forEach((item) => {
      s.addText("☐ " + item, {
        x: L.mx + 0.3, y: y, w: 8, h: 0.35,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textBody
      });
      y += 0.4;
    });

    s.addText("結果判定:", {
      x: L.mx + 0.3, y: y + 0.2, w: 2, h: 0.25,
      fontSize: F.size.h2, fontFace: F.sans, bold: true,
      color: C.textDark
    });

    const results = [
      "8個『はい』 → 強く推奨",
      "5～7個『はい』 → 導入検討価値あり",
      "3～4個『はい』 → 標準Google Workspace で検討"
    ];

    y += 0.55;
    results.forEach((result) => {
      s.addText(result, {
        x: L.mx + 0.8, y: y, w: 7, h: 0.25,
        fontSize: F.size.body, fontFace: F.sans,
        color: C.textLight
      });
      y += 0.3;
    });

    addFooter(s, 11, T);
  }

  // ============================================================
  // SLIDE 12: CLOSING
  // ============================================================
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };
    s.addText("次回予告", {
      x: 0.5, y: 0.8, w: 9, h: 0.5,
      fontSize: F.size.h1, fontFace: F.sans, bold: true,
      color: C.white, align: "center"
    });
    s.addText("P-05", {
      x: 0.5, y: 1.5, w: 9, h: 0.6,
      fontSize: 44, fontFace: F.sans, bold: true,
      color: C.accentMid, align: "center"
    });
    s.addText("実運用：セキュアな使い方・よくある失敗", {
      x: 0.5, y: 2.2, w: 9, h: 0.5,
      fontSize: F.size.h2, fontFace: F.sans,
      color: C.white, align: "center"
    });
    s.addShape(pres.shapes.LINE, {
      x: 2.5, y: 2.9, w: 5, h: 0,
      line: { color: C.accentMid, width: 1.5 }
    });
    s.addText("実務でのセキュアな使い方とよくある失敗パターンを詳しく解説します。", {
      x: 1, y: 3.3, w: 8, h: 0.5,
      fontSize: F.size.h3, fontFace: F.sans,
      color: C.textMuted, align: "center"
    });
    s.addText("2026年5月配信予定", {
      x: 0.5, y: 4.6, w: 9, h: 0.4,
      fontSize: F.size.label, fontFace: F.sans,
      color: C.accentMid, align: "center"
    });
  }

  // Generate
  const outPath = "/Users/kurosakiyuto/Downloads/開発/gorilla-knowledge/黒崎/AI研修一覧/Gemini/P-04_セキュリティ・対象者/スライド.pptx";
  await pres.writeFile({ fileName: outPath });
  console.log("✅ スライド.pptx generated successfully!");
}

main().catch(console.error);
