"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

interface QuizQuestion {
  id: string;
  courseId: string;
  question: string;
  choices: string[];
  order: number;
}

interface QuizFormProps {
  courseId: string;
  videoCompleted: boolean;
  quizType?: "quiz" | "pdf" | "none"; // テストタイプ
  quizPdfUrl?: string;                 // PDF型の場合のURL
  onPass?: () => void;
}

export function QuizForm({ courseId, videoCompleted, quizType, quizPdfUrl, onPass }: QuizFormProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<number[]>([]);
  const [hasQuiz, setHasQuiz] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    passed: boolean;
    correctCount: number;
    totalCount: number;
    corrections: { questionId: string; correct: boolean }[];
    message: string;
  } | null>(null);
  const [bestScore, setBestScore] = useState<{ score: number; passed: boolean } | null>(null);

  // PDF自己申告の状態
  const [selfDeclared, setSelfDeclared] = useState(false);
  const [pdfDownloaded, setPdfDownloaded] = useState(false);

  const fetchQuiz = useCallback(async () => {
    try {
      const res = await fetch(`/api/quiz?courseId=${courseId}`);
      const data = await res.json();
      if (data.success) {
        setQuestions(data.questions);
        setHasQuiz(data.hasQuiz);
        setAnswers(new Array(data.questions.length).fill(-1));
        if (data.bestResult) {
          setBestScore({ score: data.bestResult.score, passed: data.bestResult.passed });
        }
      }
    } catch {
      toast.error("テストの読み込みに失敗しました");
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchQuiz();
  }, [fetchQuiz]);

  const handleSubmit = async () => {
    if (answers.some((a) => a === -1)) {
      toast.error("全ての問題に回答してください");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, answers }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data);
        if (data.passed) {
          setBestScore({ score: data.score, passed: true });
          onPass?.();
          toast.success("テスト合格！修了おめでとうございます！");
        } else {
          toast("不合格です。再チャレンジしてください。");
        }
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("送信に失敗しました");
    } finally {
      setSubmitting(false);
    }
  };

  // PDF型: 自己申告で合格を送信
  const handleSelfDeclare = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, answers: [], selfDeclaredPass: true }),
      });
      const data = await res.json();
      if (data.success && data.passed) {
        setSelfDeclared(true);
        setBestScore({ score: 100, passed: true });
        onPass?.();
        toast.success("合格を記録しました。修了おめでとうございます！");
      }
    } catch {
      toast.error("送信に失敗しました");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setResult(null);
    setAnswers(new Array(questions.length).fill(-1));
  };

  if (loading) {
    return (
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-3 bg-gray-200 rounded w-full" />
        </div>
      </div>
    );
  }

  // テストなし（quizType=none かつ LMS内テストもない）
  if (quizType === "none" && !hasQuiz) return null;
  if (!quizType && !hasQuiz) return null;

  if (!videoCompleted) {
    return (
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="font-semibold mb-2">確認テスト</h3>
        <p className="text-sm text-gray-500">
          動画を最後まで視聴すると、確認テストを受験できます。
        </p>
      </div>
    );
  }

  // ==========================================
  // PDF自己申告型テスト
  // ==========================================
  if (quizType === "pdf") {
    // 既に合格済み
    if (bestScore?.passed || selfDeclared) {
      return (
        <div className="border border-green-200 bg-green-50 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-600 text-white text-xs">✓</span>
            <h3 className="font-semibold text-green-800">確認テスト合格済み</h3>
          </div>
          <p className="text-sm text-green-700">自己申告により合格が記録されています</p>
        </div>
      );
    }

    return (
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="font-semibold mb-3">確認テスト</h3>

        {/* PDF ダウンロード */}
        {quizPdfUrl && (
          <div className="mb-6">
            <p className="text-sm text-gray-700 mb-3">
              以下のPDFをダウンロードしてテストに回答してください。
            </p>
            <a
              href={quizPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setPdfDownloaded(true)}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded text-sm text-black hover:bg-gray-50 transition-colors"
            >
              テストPDFをダウンロード ↓
            </a>
          </div>
        )}

        {/* 自己申告 */}
        <div className="border-t border-gray-200 pt-6">
          <p className="text-sm font-medium text-black mb-3">
            テストに合格しましたか？
          </p>
          <p className="text-xs text-gray-500 mb-4">
            合格基準: 80%以上の正答率。正直に回答してください。
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleSelfDeclare}
              disabled={submitting || (quizPdfUrl ? !pdfDownloaded : false)}
              className="px-6 py-2 bg-black text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {submitting ? "記録中..." : "はい、合格しました"}
            </button>
            <button
              disabled
              className="px-6 py-2 border border-gray-300 text-sm text-gray-500 rounded cursor-not-allowed"
            >
              いいえ、不合格でした
            </button>
          </div>
          {quizPdfUrl && !pdfDownloaded && (
            <p className="mt-2 text-xs text-yellow-700">
              まずPDFをダウンロードしてテストに回答してください
            </p>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // LMS内自動採点テスト（既存ロジック）
  // ==========================================

  // 合格済み
  if (bestScore?.passed && !result) {
    return (
      <div className="border border-green-200 bg-green-50 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-600 text-white text-xs">✓</span>
          <h3 className="font-semibold text-green-800">確認テスト合格済み</h3>
        </div>
        <p className="text-sm text-green-700">スコア: {bestScore.score}点</p>
      </div>
    );
  }

  // 結果表示
  if (result) {
    return (
      <div className={`border rounded-lg p-6 ${result.passed ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
        <h3 className={`font-semibold mb-3 ${result.passed ? "text-green-800" : "text-red-800"}`}>
          {result.passed ? "合格！" : "不合格"}
        </h3>
        <p className={`text-sm mb-4 ${result.passed ? "text-green-700" : "text-red-700"}`}>
          {result.message}
        </p>
        <div className="space-y-3 mb-4">
          {questions.map((q, i) => {
            const correction = result.corrections.find((c) => c.questionId === q.id);
            return (
              <div key={q.id} className="text-sm">
                <div className="flex items-center gap-2">
                  <span className={correction?.correct ? "text-green-600" : "text-red-600"}>
                    {correction?.correct ? "○" : "×"}
                  </span>
                  <span className="text-gray-700">問{i + 1}: {q.question}</span>
                </div>
                {!correction?.correct && (
                  <div className="ml-6 mt-1 text-gray-500">
                    あなたの回答: {q.choices[answers[i]]}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {!result.passed && (
          <button onClick={handleRetry} className="px-4 py-2 bg-black text-white text-sm rounded hover:bg-gray-800 cursor-pointer">
            再チャレンジ
          </button>
        )}
      </div>
    );
  }

  // テスト問題表示
  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <h3 className="font-semibold mb-1">確認テスト</h3>
      <p className="text-xs text-gray-500 mb-6">合格基準: 80%以上の正答率（{questions.length}問中{Math.ceil(questions.length * 0.8)}問以上正解）</p>

      <div className="space-y-6">
        {questions.map((q, qIndex) => (
          <div key={q.id}>
            <p className="text-sm font-medium mb-3">問{qIndex + 1}. {q.question}</p>
            <div className="space-y-2">
              {q.choices.map((choice, cIndex) => (
                <label
                  key={cIndex}
                  className={`flex items-center gap-3 px-3 py-2 rounded border text-sm cursor-pointer transition-colors ${
                    answers[qIndex] === cIndex ? "border-black bg-gray-50" : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <input
                    type="radio"
                    name={`q-${q.id}`}
                    checked={answers[qIndex] === cIndex}
                    onChange={() => { const next = [...answers]; next[qIndex] = cIndex; setAnswers(next); }}
                    className="accent-black"
                  />
                  <span>{choice}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={handleSubmit}
          disabled={submitting || answers.some((a) => a === -1)}
          className="px-6 py-2 bg-black text-white text-sm font-medium rounded hover:bg-gray-800 disabled:opacity-50 cursor-pointer"
        >
          {submitting ? "採点中..." : "回答を送信"}
        </button>
        <span className="text-xs text-gray-400">
          {answers.filter((a) => a !== -1).length}/{questions.length}問 回答済み
        </span>
      </div>
    </div>
  );
}
