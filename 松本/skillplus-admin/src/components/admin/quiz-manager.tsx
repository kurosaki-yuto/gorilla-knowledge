"use client";

import { useState, useEffect, useCallback } from "react";

interface QuizItem {
  id: string;
  question: string;
  choices: string[];
  correctAnswer: number;
  sortOrder: number;
}

interface QuizManagerProps {
  courseId: string;
  courseName: string;
  onClose: () => void;
}

async function fetchQuizzes(courseId: string): Promise<QuizItem[]> {
  const res = await fetch(`/api/admin?type=quizzes&courseId=${courseId}`);
  const data = await res.json();
  return (data || []).map((q: Record<string, unknown>) => ({
    id: q.id,
    question: q.question,
    choices: q.choices,
    correctAnswer: q.correctAnswer ?? q.correct_answer ?? 0,
    sortOrder: q.sortOrder ?? q.sort_order ?? 0,
  }));
}

async function post(body: Record<string, unknown>) {
  return (await fetch("/api/admin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })).json();
}

export function QuizManager({ courseId, courseName, onClose }: QuizManagerProps) {
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [editing, setEditing] = useState<Partial<QuizItem> | null>(null);
  const [isNew, setIsNew] = useState(false);

  const load = useCallback(async () => {
    setQuizzes(await fetchQuizzes(courseId));
  }, [courseId]);

  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    if (!editing?.question || !editing.choices || editing.choices.length < 2) return;

    if (isNew) {
      await post({
        action: "createQuiz",
        courseId,
        question: editing.question,
        choices: editing.choices,
        correctAnswer: editing.correctAnswer || 0,
        sortOrder: quizzes.length,
      });
    } else if (editing.id) {
      await post({
        action: "updateQuiz",
        id: editing.id,
        question: editing.question,
        choices: editing.choices,
        correctAnswer: editing.correctAnswer,
        sortOrder: editing.sortOrder,
      });
    }
    setEditing(null);
    setIsNew(false);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("この問題を削除しますか？")) return;
    await post({ action: "deleteQuiz", id });
    load();
  };

  const addNewQuiz = () => {
    setIsNew(true);
    setEditing({
      question: "",
      choices: ["", "", "", ""],
      correctAnswer: 0,
      sortOrder: quizzes.length,
    });
  };

  const updateChoice = (index: number, value: string) => {
    if (!editing) return;
    const newChoices = [...(editing.choices || [])];
    newChoices[index] = value;
    setEditing({ ...editing, choices: newChoices });
  };

  const addChoice = () => {
    if (!editing || (editing.choices?.length || 0) >= 6) return;
    setEditing({ ...editing, choices: [...(editing.choices || []), ""] });
  };

  const removeChoice = (index: number) => {
    if (!editing || (editing.choices?.length || 0) <= 2) return;
    const newChoices = (editing.choices || []).filter((_, i) => i !== index);
    let newCorrect = editing.correctAnswer || 0;
    if (index === newCorrect) newCorrect = 0;
    else if (index < newCorrect) newCorrect--;
    setEditing({ ...editing, choices: newChoices, correctAnswer: newCorrect });
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <header className="border-b border-gray-200 px-6 h-14 flex items-center justify-between shrink-0">
        <button onClick={onClose} className="text-sm text-gray-700 hover:text-black cursor-pointer">
          ← 戻る
        </button>
        <span className="text-sm text-gray-700">
          {quizzes.length}問 / 推奨3〜5問（合格基準: 80%）
        </span>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[720px] mx-auto px-6 py-10">
          <h1 className="text-2xl font-bold text-black mb-2">確認テスト</h1>
          <p className="text-sm text-gray-600 mb-8">{courseName}</p>

          {/* 問題一覧 */}
          <div className="space-y-4 mb-8">
            {quizzes.map((q, index) => (
              <div key={q.id} className="border border-gray-200 rounded p-4">
                {editing?.id === q.id ? (
                  // 編集モード
                  <QuizForm
                    editing={editing}
                    setEditing={setEditing}
                    updateChoice={updateChoice}
                    addChoice={addChoice}
                    removeChoice={removeChoice}
                    onSave={handleSave}
                    onCancel={() => { setEditing(null); setIsNew(false); }}
                  />
                ) : (
                  // 表示モード
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-black">Q{index + 1}. {q.question}</p>
                        <div className="mt-2 space-y-1">
                          {q.choices.map((c, i) => (
                            <p key={i} className={`text-sm ${i === q.correctAnswer ? "text-green-700 font-medium" : "text-gray-600"}`}>
                              {i === q.correctAnswer ? "✓" : "○"} {c}
                            </p>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0 ml-4">
                        <button onClick={() => { setEditing(q); setIsNew(false); }} className="text-xs text-gray-700 hover:text-black cursor-pointer">編集</button>
                        <button onClick={() => handleDelete(q.id)} className="text-xs text-gray-600 hover:text-red-600 cursor-pointer">削除</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 新規追加フォーム */}
          {isNew && editing && !editing.id ? (
            <div className="border border-gray-200 rounded p-4 mb-8">
              <p className="text-sm font-medium text-black mb-3">新しい問題</p>
              <QuizForm
                editing={editing}
                setEditing={setEditing}
                updateChoice={updateChoice}
                addChoice={addChoice}
                removeChoice={removeChoice}
                onSave={handleSave}
                onCancel={() => { setEditing(null); setIsNew(false); }}
              />
            </div>
          ) : (
            <button
              onClick={addNewQuiz}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded text-sm text-gray-700 hover:border-black hover:text-black transition-colors cursor-pointer"
            >
              ＋ 問題を追加
            </button>
          )}

          {quizzes.length > 0 && quizzes.length < 3 && (
            <p className="mt-4 text-sm text-yellow-700 bg-yellow-50 rounded px-4 py-2">
              助成金要件: 3〜5問が推奨です（現在{quizzes.length}問）
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// テスト問題フォーム
function QuizForm({
  editing,
  setEditing,
  updateChoice,
  addChoice,
  removeChoice,
  onSave,
  onCancel,
}: {
  editing: Partial<QuizItem>;
  setEditing: (q: Partial<QuizItem>) => void;
  updateChoice: (i: number, v: string) => void;
  addChoice: () => void;
  removeChoice: (i: number) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="space-y-3">
      <input
        value={editing.question || ""}
        onChange={(e) => setEditing({ ...editing, question: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none focus:border-black"
        placeholder="問題文を入力"
      />

      <div className="space-y-2">
        <p className="text-xs text-gray-600">選択肢（正解をクリックして選択）</p>
        {(editing.choices || []).map((choice, i) => (
          <div key={i} className="flex items-center gap-2">
            <button
              onClick={() => setEditing({ ...editing, correctAnswer: i })}
              className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-pointer ${
                i === editing.correctAnswer
                  ? "border-green-600 bg-green-600"
                  : "border-gray-300 hover:border-green-400"
              }`}
            >
              {i === editing.correctAnswer && (
                <span className="text-white text-[10px]">✓</span>
              )}
            </button>
            <input
              value={choice}
              onChange={(e) => updateChoice(i, e.target.value)}
              className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm text-black focus:outline-none focus:border-black"
              placeholder={`選択肢 ${i + 1}`}
            />
            {(editing.choices?.length || 0) > 2 && (
              <button onClick={() => removeChoice(i)} className="text-xs text-gray-500 hover:text-red-600 cursor-pointer">✕</button>
            )}
          </div>
        ))}
        {(editing.choices?.length || 0) < 6 && (
          <button onClick={addChoice} className="text-xs text-gray-600 hover:text-black cursor-pointer">＋ 選択肢を追加</button>
        )}
      </div>

      <div className="flex gap-2 pt-2">
        <button onClick={onSave} className="px-4 py-1.5 bg-black text-white text-sm rounded cursor-pointer">保存</button>
        <button onClick={onCancel} className="px-4 py-1.5 text-sm text-gray-700 cursor-pointer">キャンセル</button>
      </div>
    </div>
  );
}
