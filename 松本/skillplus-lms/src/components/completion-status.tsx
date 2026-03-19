"use client";

import { useState, useEffect, useCallback } from "react";

interface CompletionStatusProps {
  courseId: string;
  videoCompleted: boolean;
  quizPassed: boolean;
}

export function CompletionStatus({ courseId, videoCompleted, quizPassed }: CompletionStatusProps) {
  const [hasQuiz, setHasQuiz] = useState(true);
  const [loading, setLoading] = useState(true);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch(`/api/completion?courseId=${courseId}`);
      const data = await res.json();
      if (data.success) {
        setHasQuiz(data.status.hasQuiz);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  if (loading) return null;

  const isCompleted = hasQuiz ? (videoCompleted && quizPassed) : videoCompleted;

  const steps = [
    { label: "動画視聴", done: videoCompleted },
    ...(hasQuiz ? [{ label: "確認テスト合格", done: quizPassed }] : []),
  ];

  return (
    <div className={`rounded-lg p-4 ${isCompleted ? "bg-green-50 border border-green-200" : "bg-gray-50 border border-gray-200"}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">
          {isCompleted ? "修了済み" : "修了条件"}
        </h3>
        {isCompleted && (
          <button
            onClick={() => {
              window.open(`/api/certificate?courseId=${courseId}`, "_blank");
            }}
            className="px-3 py-1.5 bg-black text-white text-xs font-medium rounded hover:bg-gray-800 transition-colors cursor-pointer"
          >
            修了証をダウンロード
          </button>
        )}
      </div>

      <div className="flex items-center gap-4">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs ${
              step.done
                ? "bg-green-600 text-white"
                : "bg-gray-300 text-white"
            }`}>
              {step.done ? "✓" : (i + 1)}
            </span>
            <span className={`text-sm ${step.done ? "text-green-700" : "text-gray-500"}`}>
              {step.label}
            </span>
            {i < steps.length - 1 && (
              <span className="text-gray-300 mx-1">→</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
