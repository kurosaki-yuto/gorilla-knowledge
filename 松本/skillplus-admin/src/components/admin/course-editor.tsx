"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import type { Course } from "@/types";

interface QuizItem {
  id: string;
  question: string;
  choices: string[];
  correctAnswer: number;
  sortOrder: number;
}

interface CourseEditorProps {
  course?: Partial<Course>;
  categoryId: string;
  onSave: (data: {
    name: string;
    description: string;
    videoUrl: string;
    durationSeconds: number;
    contentJson: unknown;
  }) => void;
  onClose: () => void;
}

async function postApi(body: Record<string, unknown>) {
  return (await fetch("/api/admin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })).json();
}

export function CourseEditor({ course, onSave, onClose }: CourseEditorProps) {
  const [name, setName] = useState(course?.name || "");
  const [videoUrl, setVideoUrl] = useState(course?.videoUrl || "");
  const [durationSeconds, setDurationSeconds] = useState(course?.durationSeconds || 0);
  const [saving, setSaving] = useState(false);
  const [dragging, setDragging] = useState(false);

  // YouTube アップロード
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [ytAuthenticated, setYtAuthenticated] = useState<boolean | null>(null);

  // YouTube認証状態チェック
  useEffect(() => {
    fetch("/api/youtube?action=status")
      .then((r) => r.json())
      .then((d) => setYtAuthenticated(d.authenticated))
      .catch(() => setYtAuthenticated(false));
  }, []);

  // OAuth認証完了メッセージを受信
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "youtube-auth-success") {
        setYtAuthenticated(true);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  const handleYouTubeAuth = async () => {
    const res = await fetch("/api/youtube?action=auth");
    const { url } = await res.json();
    window.open(url, "youtube-auth", "width=600,height=700");
  };

  const handleFileUpload = async (file: File) => {
    if (!file.name.endsWith(".mp4") && !file.name.endsWith(".mov") && !file.name.endsWith(".webm")) {
      alert("MP4, MOV, WebM ファイルのみ対応しています");
      return;
    }

    setUploading(true);
    setUploadProgress("YouTube にアップロード中...");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", name || file.name.replace(/\.[^.]+$/, ""));

    try {
      const res = await fetch("/api/youtube", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        setVideoUrl(data.videoUrl);
        if (data.durationSeconds > 0) {
          setDurationSeconds(data.durationSeconds);
        }
        setUploadProgress("アップロード完了！");
        setTimeout(() => setUploadProgress(""), 3000);
      } else {
        setUploadProgress(`エラー: ${data.error}`);
      }
    } catch (err) {
      setUploadProgress("アップロードに失敗しました");
    } finally {
      setUploading(false);
    }
  };

  // テスト資料URL
  const [quizMaterialUrl, setQuizMaterialUrl] = useState(() => {
    if (!course?.contentJson) return "";
    try {
      const c = typeof course.contentJson === "string" ? JSON.parse(course.contentJson) : course.contentJson;
      return (c as Record<string, unknown>)?.quizMaterialUrl as string || "";
    } catch { return ""; }
  });

  // contentJsonから初期値を復元
  const existingContent = (() => {
    if (!course?.contentJson) return null;
    try {
      if (typeof course.contentJson === "string") return JSON.parse(course.contentJson);
      return course.contentJson as { sections?: ("above" | "video" | "below")[]; above?: unknown[]; below?: unknown[] };
    } catch { return null; }
  })();

  // 3つのセクションの順序管理: "above" = 上テキスト, "video" = 動画, "below" = 下テキスト
  const [sections, setSections] = useState<("above" | "video" | "below")[]>(
    existingContent?.sections || ["above", "video", "below"]
  );
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorAbove = useCreateBlockNote({
    initialContent: existingContent?.above && (existingContent.above as any[]).length > 0
      ? existingContent.above as any
      : undefined,
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorBelow = useCreateBlockNote({
    initialContent: existingContent?.below && (existingContent.below as any[]).length > 0
      ? existingContent.below as any
      : undefined,
  });

  // テスト管理
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [editingQuiz, setEditingQuiz] = useState<Partial<QuizItem> | null>(null);
  const [isNewQuiz, setIsNewQuiz] = useState(false);

  const loadQuizzes = useCallback(async () => {
    if (!course?.id) return;
    const res = await fetch(`/api/admin?type=quizzes&courseId=${course.id}`);
    const data = await res.json();
    const arr = Array.isArray(data) ? data : [];
    setQuizzes(arr.map((q: Record<string, unknown>) => ({
      id: q.id as string,
      question: q.question as string,
      choices: q.choices as string[],
      correctAnswer: (q.correctAnswer ?? q.correct_answer ?? 0) as number,
      sortOrder: (q.sortOrder ?? q.sort_order ?? 0) as number,
    })));
  }, [course?.id]);

  useEffect(() => { loadQuizzes(); }, [loadQuizzes]);

  function extractVideoId(url: string): string | null {
    const match = url.match(
      /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/
    );
    return match ? match[1] : null;
  }

  const videoId = extractVideoId(videoUrl);

  // ドラッグ&ドロップ
  const handleDragStart = (index: number) => {
    dragItem.current = index;
    setDragging(true);
  };

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    if (dragItem.current === null || dragOverItem.current === null) {
      setDragging(false);
      return;
    }
    const newSections = [...sections];
    const draggedItem = newSections[dragItem.current];
    newSections.splice(dragItem.current, 1);
    newSections.splice(dragOverItem.current, 0, draggedItem);
    setSections(newSections);
    dragItem.current = null;
    dragOverItem.current = null;
    setDragging(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function getBlocksText(editor: any) {
    return editor.document
      .map((b: any) => {
        if (b.content && Array.isArray(b.content)) {
          return b.content.map((c: any) => c.text || "").join("");
        }
        return "";
      })
      .filter(Boolean)
      .join("\n");
  }

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);

    const aboveText = getBlocksText(editorAbove);
    const belowText = getBlocksText(editorBelow);
    const description = [aboveText, belowText].filter(Boolean).join("\n");

    onSave({
      name,
      description,
      videoUrl,
      durationSeconds,
      contentJson: {
        sections,
        above: editorAbove.document,
        below: editorBelow.document,
        quizMaterialUrl: quizMaterialUrl || undefined,
      },
    });
    setSaving(false);
  };

  // テスト関連
  const handleSaveQuiz = async () => {
    if (!editingQuiz?.question || !editingQuiz.choices || editingQuiz.choices.length < 2) return;

    if (isNewQuiz) {
      await postApi({
        action: "createQuiz",
        courseId: course?.id,
        question: editingQuiz.question,
        choices: editingQuiz.choices,
        correctAnswer: editingQuiz.correctAnswer || 0,
        sortOrder: quizzes.length,
      });
    } else if (editingQuiz.id) {
      await postApi({
        action: "updateQuiz",
        id: editingQuiz.id,
        question: editingQuiz.question,
        choices: editingQuiz.choices,
        correctAnswer: editingQuiz.correctAnswer,
        sortOrder: editingQuiz.sortOrder,
      });
    }
    setEditingQuiz(null);
    setIsNewQuiz(false);
    loadQuizzes();
  };

  const handleDeleteQuiz = async (id: string) => {
    if (!confirm("この問題を削除しますか？")) return;
    await postApi({ action: "deleteQuiz", id });
    loadQuizzes();
  };

  const addNewQuiz = () => {
    setIsNewQuiz(true);
    setEditingQuiz({
      question: "",
      choices: ["", "", "", ""],
      correctAnswer: 0,
      sortOrder: quizzes.length,
    });
  };

  const updateChoice = (index: number, value: string) => {
    if (!editingQuiz) return;
    const newChoices = [...(editingQuiz.choices || [])];
    newChoices[index] = value;
    setEditingQuiz({ ...editingQuiz, choices: newChoices });
  };

  const addChoice = () => {
    if (!editingQuiz || (editingQuiz.choices?.length || 0) >= 6) return;
    setEditingQuiz({ ...editingQuiz, choices: [...(editingQuiz.choices || []), ""] });
  };

  const removeChoice = (index: number) => {
    if (!editingQuiz || (editingQuiz.choices?.length || 0) <= 2) return;
    const newChoices = (editingQuiz.choices || []).filter((_, i) => i !== index);
    let newCorrect = editingQuiz.correctAnswer || 0;
    if (index === newCorrect) newCorrect = 0;
    else if (index < newCorrect) newCorrect--;
    setEditingQuiz({ ...editingQuiz, choices: newChoices, correctAnswer: newCorrect });
  };

  const renderSection = (type: "above" | "video" | "below", index: number) => {
    if (type === "video") {
      return (
        <div
          key="video"
          className="my-4"
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={() => handleDragEnter(index)}
        >
          <div
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragEnd={handleDragEnd}
            className="p-5 bg-gray-50 rounded-lg border border-gray-200 cursor-grab active:cursor-grabbing"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-black">動画</span>
              <span className="text-xs text-gray-500">ドラッグで移動</span>
            </div>

            {/* MP4アップロード or YouTube URL入力 */}
            <div className="flex gap-2 mb-2">
              <input
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none focus:border-black"
                placeholder="YouTube URL を入力"
              />
              {ytAuthenticated ? (
                <label className={`shrink-0 px-3 py-2 text-xs rounded cursor-pointer transition-colors ${
                  uploading ? "bg-gray-200 text-gray-500" : "bg-black text-white hover:bg-gray-800"
                }`}>
                  {uploading ? "アップロード中..." : "MP4をアップ"}
                  <input
                    type="file"
                    accept=".mp4,.mov,.webm"
                    className="hidden"
                    disabled={uploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                      e.target.value = "";
                    }}
                  />
                </label>
              ) : ytAuthenticated === false ? (
                <button
                  onClick={handleYouTubeAuth}
                  className="shrink-0 px-3 py-2 text-xs bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
                >
                  YouTube認証
                </button>
              ) : null}
            </div>
            {uploadProgress && (
              <p className={`text-xs mb-2 ${uploadProgress.startsWith("エラー") ? "text-red-600" : "text-green-600"}`}>
                {uploadProgress}
              </p>
            )}
            {videoId && (
              <div className="aspect-video rounded overflow-hidden mb-2">
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}`}
                  className="w-full h-full border-none"
                  allowFullScreen
                />
              </div>
            )}
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-gray-700">動画時間（秒）:</span>
              <input
                type="number"
                value={durationSeconds}
                onChange={(e) => setDurationSeconds(parseInt(e.target.value) || 0)}
                className="w-24 px-2 py-1 border border-gray-300 rounded text-sm text-black focus:outline-none focus:border-black"
                placeholder="300"
              />
              <span className="text-xs text-gray-700">
                = {Math.floor(durationSeconds / 60)}分{durationSeconds % 60}秒
              </span>
            </div>
          </div>
        </div>
      );
    }

    const editor = type === "above" ? editorAbove : editorBelow;

    return (
      <div
        key={type}
        className="my-1"
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={() => handleDragEnter(index)}
      >
        <div className="min-h-[80px]">
          <BlockNoteView editor={editor} theme="light" />
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <header className="border-b border-gray-200 px-6 h-14 flex items-center justify-between shrink-0">
        <button onClick={onClose} className="text-sm text-gray-700 hover:text-black cursor-pointer">
          ← 閉じる
        </button>
        <button
          onClick={handleSave}
          disabled={saving || !name.trim()}
          className="px-5 py-1.5 bg-black text-white text-sm rounded hover:bg-gray-800 disabled:opacity-50 cursor-pointer"
        >
          {saving ? "保存中..." : course?.id ? "保存" : "公開する"}
        </button>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[720px] mx-auto px-6 py-10">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full text-3xl font-bold text-black placeholder-gray-300 focus:outline-none mb-2"
            placeholder="講座タイトル"
          />
          <p className="text-xs text-gray-600 mb-6">
            動画ブロックをドラッグして位置を変えられます。上下にテキストを自由に入力。
          </p>

          {sections.map((section, index) => renderSection(section, index))}

          {/* テスト資料 */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-lg font-bold text-black mb-2">テスト資料</h2>
            <p className="text-xs text-gray-500 mb-3">受講生がテスト前に参照できる資料のURLを設定（PDF、Webページ等）</p>
            <input
              value={quizMaterialUrl}
              onChange={(e) => setQuizMaterialUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none focus:border-black"
              placeholder="https://example.com/test-material.pdf"
            />
            {quizMaterialUrl && (
              <a
                href={quizMaterialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-xs text-blue-600 hover:text-blue-800"
              >
                プレビュー ↗
              </a>
            )}
          </div>

          {/* 確認テスト セクション */}
          {course?.id ? (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-black">確認テスト</h2>
                <span className="text-xs text-gray-500">
                  {quizzes.length}問 / 推奨3〜5問（合格基準: 80%）
                </span>
              </div>

              {/* 問題一覧 */}
              <div className="space-y-3 mb-4">
                {quizzes.map((q, qIndex) => (
                  <div key={q.id}>
                    {editingQuiz?.id === q.id ? (
                      <div className="border border-gray-200 rounded p-4">
                        <QuizFormInline
                          editing={editingQuiz}
                          setEditing={setEditingQuiz}
                          updateChoice={updateChoice}
                          addChoice={addChoice}
                          removeChoice={removeChoice}
                          onSave={handleSaveQuiz}
                          onCancel={() => { setEditingQuiz(null); setIsNewQuiz(false); }}
                        />
                      </div>
                    ) : (
                      <div className="group flex items-start justify-between py-2 px-2 -mx-2 rounded hover:bg-gray-50">
                        <div>
                          <p className="text-sm text-black">
                            <span className="text-gray-400 mr-1">Q{qIndex + 1}.</span>
                            {q.question}
                          </p>
                          <div className="mt-1 space-y-0.5">
                            {q.choices.map((c, i) => (
                              <p key={i} className={`text-xs ${i === q.correctAnswer ? "text-green-600" : "text-gray-400"}`}>
                                {i === q.correctAnswer ? "✓" : "○"} {c}
                              </p>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2 shrink-0 ml-4 opacity-0 group-hover:opacity-100">
                          <button onClick={() => { setEditingQuiz(q); setIsNewQuiz(false); }} className="text-xs text-gray-500 hover:text-black cursor-pointer">編集</button>
                          <button onClick={() => handleDeleteQuiz(q.id)} className="text-xs text-gray-300 hover:text-red-500 cursor-pointer">削除</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* 新規追加 */}
              {isNewQuiz && editingQuiz && !editingQuiz.id ? (
                <div className="border border-gray-200 rounded p-4">
                  <QuizFormInline
                    editing={editingQuiz}
                    setEditing={setEditingQuiz}
                    updateChoice={updateChoice}
                    addChoice={addChoice}
                    removeChoice={removeChoice}
                    onSave={handleSaveQuiz}
                    onCancel={() => { setEditingQuiz(null); setIsNewQuiz(false); }}
                  />
                </div>
              ) : (
                <button
                  onClick={addNewQuiz}
                  className="w-full py-2.5 border border-dashed border-gray-300 rounded text-sm text-gray-500 hover:border-black hover:text-black transition-colors cursor-pointer"
                >
                  ＋ 問題を追加
                </button>
              )}

              {quizzes.length > 0 && quizzes.length < 3 && (
                <p className="mt-3 text-xs text-yellow-700 bg-yellow-50 rounded px-3 py-2">
                  助成金要件: 3〜5問が推奨です（現在{quizzes.length}問）
                </p>
              )}
            </div>
          ) : (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-400">確認テストは講座を保存した後に追加できます</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// インラインテストフォーム
function QuizFormInline({
  editing,
  setEditing,
  updateChoice,
  addChoice,
  removeChoice,
  onSave,
  onCancel,
}: {
  editing: Partial<QuizItem>;
  setEditing: (q: Partial<QuizItem> | null) => void;
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
        <p className="text-xs text-gray-500">選択肢（正解をクリックして選択）</p>
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
              <button onClick={() => removeChoice(i)} className="text-xs text-gray-400 hover:text-red-500 cursor-pointer">×</button>
            )}
          </div>
        ))}
        {(editing.choices?.length || 0) < 6 && (
          <button onClick={addChoice} className="text-xs text-gray-500 hover:text-black cursor-pointer">＋ 選択肢を追加</button>
        )}
      </div>
      <div className="flex gap-2 pt-1">
        <button onClick={onSave} className="px-4 py-1.5 bg-black text-white text-sm rounded cursor-pointer">保存</button>
        <button onClick={onCancel} className="px-4 py-1.5 text-sm text-gray-500 cursor-pointer">キャンセル</button>
      </div>
    </div>
  );
}
