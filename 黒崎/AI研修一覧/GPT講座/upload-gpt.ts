/**
 * GPT講座 5パート → YouTube（限定公開） → LMS登録（AI研修 実践編）
 */
import fs from "fs";
import path from "path";
import { config } from "dotenv";
import { google } from "googleapis";

config({ path: path.join(import.meta.dirname, "../lms-pipeline/.env") });

// Supabase
const SERVICE_KEY = (() => {
  try {
    const env = fs.readFileSync(path.join(import.meta.dirname, "../lms-admin/.env.local"), "utf-8");
    const m = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/);
    return m ? m[1].trim() : "";
  } catch { return ""; }
})();
const BASE = "https://ajfwzicdperweolgifkb.supabase.co/rest/v1";
const HEADERS: Record<string, string> = {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
  "Content-Type": "application/json",
  Prefer: "return=representation",
};

// YouTube
const oauth2 = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET
);
oauth2.setCredentials({ refresh_token: process.env.YOUTUBE_REFRESH_TOKEN });
const youtube = google.youtube({ version: "v3", auth: oauth2 });

const CATEGORY_ID = "cat-1775230929921"; // AI研修（実践編）
const DIR = import.meta.dirname;

const PARTS = [
  {
    file: "Part1.mp4",
    title: "ChatGPTの全体像と最新モデル整理",
    description: "ChatGPTを「ただのチャットツール」から「業務インフラ」に転換する。全体像・GPT-4o/o1等の最新モデル・今日のアジェンダを整理。",
    duration: 13,
    quizzes: [
      { question: "ChatGPT実践講座の主な目的として最も適切なものはどれか？", choices: ["ChatGPTの歴史を学ぶ", "ChatGPTを業務インフラとして活用できるようになる", "プログラミングスキルを習得する", "AIの理論的背景を理解する"], answer: 1 },
      { question: "この講座で扱う実演テーマに含まれないものはどれか？", choices: ["業務文書作成", "データ分析機能", "画像生成（DALL-E）", "動画編集"], answer: 3 },
      { question: "GPTs（カスタムGPT）について正しい説明はどれか？", choices: ["OpenAIが提供する有料APIのこと", "自分の業務に特化したChatGPTを自作できる機能", "ChatGPTの旧バージョンの名称", "画像生成専用のモデル"], answer: 1 },
      { question: "カスタム指示の設定で期待できる効果はどれか？", choices: ["ChatGPTの応答速度が上がる", "月額料金が割引される", "出力品質が劇的に向上する", "他のユーザーと設定を共有できる"], answer: 2 },
      { question: "この講座の受講姿勢として推奨されていることはどれか？", choices: ["メモを取りながら視聴する", "演習パートで動画を一時停止して実際に手を動かす", "倍速で視聴して効率を上げる", "テスト問題を先に確認する"], answer: 1 },
    ],
  },
  {
    file: "Part2.mp4",
    title: "セットアップと業務文書作成",
    description: "カスタム指示・メモリ・セキュリティ設定など最初にやるべき初期設定と、メール・議事録・報告書の業務文書作成テクニック。",
    duration: 13,
    quizzes: [
      { question: "カスタム指示の「あなたについて教えてください」欄に書くべき内容はどれか？", choices: ["好きな食べ物や趣味", "自分の職種・主要業務・読み手の特徴", "ChatGPTへの不満点", "過去の会話履歴"], answer: 1 },
      { question: "セキュリティ設定で必ずOFFにすべき項目はどれか？", choices: ["ダークモード", "モデルの学習に使用する", "メモリ機能", "プラグイン機能"], answer: 1 },
      { question: "カスタム指示を設定する最大のメリットはどれか？", choices: ["回答速度が2倍になる", "毎回同じ前提を書く手間が消滅し年間数十時間の節約になる", "無料プランでGPT-4が使える", "他のAIツールと連携できる"], answer: 1 },
      { question: "「ChatGPTにどう回答してほしいですか」欄の指示として適切なものはどれか？", choices: ["できるだけ長く詳細に書いてください", "簡潔で要点を絞った回答をしてください", "英語で回答してください", "回答は不要です"], answer: 1 },
      { question: "業務メール作成時にChatGPTの出力品質を高めるコツはどれか？", choices: ["「メールを書いて」とだけ指示する", "宛先・目的・トーン・制約を具体的に指定する", "過去のメールをすべてコピペする", "何も指定せずAIに任せる"], answer: 1 },
    ],
  },
  {
    file: "Part3.mp4",
    title: "キャンバス機能とデータ分析",
    description: "キャンバス（文書共同編集モード）で報告書ドラフトを作成する実演と、CSV/Excelアップロードによるデータ分析・グラフ生成の実演。",
    duration: 14,
    quizzes: [
      { question: "キャンバス機能の説明として正しいものはどれか？", choices: ["画像を描画する機能", "チャットの右側にドキュメントが表示され部分選択→修正指示が可能", "音声入力でチャットする機能", "複数人で同時にチャットする機能"], answer: 1 },
      { question: "キャンバス機能が従来のチャットと異なる最大の利点はどれか？", choices: ["回答が速い", "「全体を書き直す」のではなく「この段落だけ修正して」ができる", "画像が生成できる", "過去の会話を検索できる"], answer: 1 },
      { question: "データ分析機能でアップロードできるファイル形式に含まれないものはどれか？", choices: ["Excel/CSV", "PDF", "画像", "動画ファイル（MP4）"], answer: 3 },
      { question: "ChatGPTのデータ分析ワークフローとして正しい順序はどれか？", choices: ["グラフ生成→分析→アップロード", "アップロード→分析・要約→グラフ生成", "手動でグラフ作成→ChatGPTで修正", "分析→ダウンロード→アップロード"], answer: 1 },
      { question: "報告書作成にキャンバス機能を使う場面として最適なのはどれか？", choices: ["1行のメール返信", "月次報告書のドラフト作成と段落単位の修正", "画像の編集", "スケジュール管理"], answer: 1 },
    ],
  },
  {
    file: "Part4.mp4",
    title: "画像生成（DALL-E）とキャンバス活用",
    description: "DALL-Eで業務用画像を生成する実演と、ファイルアップロードの対応形式・活用パターンを解説。",
    duration: 13,
    quizzes: [
      { question: "DALL-Eで業務用画像を生成する際のプロンプトに含めるべき要素はどれか？", choices: ["個人的な感想", "スタイル・配色・含める要素を具体的に指定", "過去の画像のURL", "生成回数の指定"], answer: 1 },
      { question: "ファイルアップロードでPDFを渡した場合、ChatGPTができることはどれか？", choices: ["PDFを編集して再保存する", "報告書・契約書・論文の要約", "PDFのパスワードを解除する", "PDFを動画に変換する"], answer: 1 },
      { question: "ChatGPTへの画像アップロードで可能な処理はどれか？", choices: ["画像の解像度を上げる", "図表の読み取り・テキスト抽出", "画像ファイルの圧縮", "画像のウイルススキャン"], answer: 1 },
      { question: "DALL-Eによる画像生成で「フラットデザイン、ビジネス向け」と指定する理由はどれか？", choices: ["生成速度が速くなるから", "業務資料に適したクリーンな印象の画像になるから", "著作権フリーになるから", "ファイルサイズが小さくなるから"], answer: 1 },
      { question: "Excel/CSVファイルをアップロードした場合のChatGPTの処理として正しいものはどれか？", choices: ["ファイルを自動で共有フォルダに保存する", "データ分析・グラフ生成を自動で行う", "ファイルを暗号化する", "印刷用レイアウトに変換する"], answer: 1 },
    ],
  },
  {
    file: "Part5.mp4",
    title: "GPTs作成ライブデモ",
    description: "自社業務に特化したカスタムGPT（GPTs）の作り方をライブデモで実演。ナレッジファイルのアップロードから公開まで。",
    duration: 13,
    quizzes: [
      { question: "GPTs（カスタムGPT）を作成する最大のメリットはどれか？", choices: ["ChatGPTの月額料金が無料になる", "毎回同じプロンプトを書かなくても業務特化の回答が得られる", "インターネット接続なしで使える", "他社のAIモデルも組み込める"], answer: 1 },
      { question: "GPTs作成時に「ナレッジ」としてアップロードすべきファイルはどれか？", choices: ["個人の写真", "就業規則PDF・社内マニュアルなど業務関連文書", "音楽ファイル", "ゲームアプリ"], answer: 1 },
      { question: "GPTsの公開範囲の設定として正しいものはどれか？", choices: ["必ず全世界に公開される", "自分だけ・リンクを知っている人・全体公開から選べる", "社内ネットワークのみ", "公開範囲は設定できない"], answer: 1 },
      { question: "GPTs業務活用パターンとして紹介されていないものはどれか？", choices: ["社内FAQ Bot", "議事録テンプレート生成", "メール文面生成", "動画編集アシスタント"], answer: 3 },
      { question: "GPTs作成の最終ステップはどれか？", choices: ["プロンプトを書く", "ナレッジファイルをアップロードする", "「プレビュー」で動作確認→「保存」で公開範囲を選択", "ChatGPTを再起動する"], answer: 2 },
    ],
  },
];

async function main() {
  console.log("\n🚀 GPT講座 5パート → YouTube → LMS登録\n");

  for (let i = 0; i < PARTS.length; i++) {
    const part = PARTS[i];
    const videoPath = path.join(DIR, part.file);
    const num = String(i + 1).padStart(2, "0");

    console.log(`[${i + 1}/5] G-${num}: ${part.title}`);

    // YouTube upload
    console.log("  📤 YouTubeアップロード中...");
    const response = await youtube.videos.insert({
      part: ["snippet", "status"],
      requestBody: {
        snippet: {
          title: `【ChatGPT実践】${part.title}`,
          description: `${part.description}\n\nChatGPT実践：万能AIアシスタントを業務に組み込む（Part ${i + 1}/5）\n#AI研修 #ChatGPT #eラーニング`,
          tags: ["AI研修", "ChatGPT", "eラーニング", "LMS", "実践"],
          defaultLanguage: "ja",
          defaultAudioLanguage: "ja",
        },
        status: {
          privacyStatus: "unlisted",
          selfDeclaredMadeForKids: false,
        },
      },
      media: { body: fs.createReadStream(videoPath) },
    });

    const videoId = response.data.id;
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    console.log(`  ✅ ${embedUrl}`);

    // LMS content registration
    const contentId = `cnt-gpt-${num}`;
    console.log("  📝 LMS登録中...");

    const contentBody = {
      id: contentId,
      category_id: CATEGORY_ID,
      title: `G-${num} ${part.title}`,
      description: part.description,
      duration_minutes: part.duration,
      video_url: embedUrl,
      order_index: i + 6, // Perplexity P-01~P-05が0~4なので6から
    };

    const res = await fetch(`${BASE}/contents`, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify(contentBody),
    });

    if (!res.ok) {
      // already exists → update
      await fetch(`${BASE}/contents?id=eq.${contentId}`, {
        method: "PATCH",
        headers: HEADERS,
        body: JSON.stringify({ video_url: embedUrl, title: contentBody.title, description: part.description }),
      });
    }
    console.log(`  ✅ コンテンツ登録: ${contentId}`);

    // Quiz registration
    for (let q = 0; q < part.quizzes.length; q++) {
      const quiz = part.quizzes[q];
      const quizBody = {
        id: `quiz-gpt-${num}-${q + 1}`,
        content_id: contentId,
        question: quiz.question,
        option_a: quiz.choices[0],
        option_b: quiz.choices[1],
        option_c: quiz.choices[2],
        option_d: quiz.choices[3],
        correct_option: quiz.answer,
        order_index: q,
      };

      const qRes = await fetch(`${BASE}/quizzes`, {
        method: "POST",
        headers: HEADERS,
        body: JSON.stringify(quizBody),
      });
      if (!qRes.ok) {
        await fetch(`${BASE}/quizzes?id=eq.quiz-gpt-${num}-${q + 1}`, {
          method: "PATCH",
          headers: HEADERS,
          body: JSON.stringify(quizBody),
        });
      }
    }
    console.log(`  ✅ テスト${part.quizzes.length}問登録`);
    console.log();
  }

  console.log("=== 全パート完了 ===\n");
}

main().catch(err => { console.error("❌", err); process.exit(1); });
