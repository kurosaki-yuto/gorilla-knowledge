"use client";

import { useState, useRef } from "react";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import type { Course } from "@/types";

interface CourseEditorProps {
  course?: Partial<Course>;
  categoryId: string;
  onSave: (data: {
    name: string;
    description: string;
    videoUrl: string;
    durationSeconds: number;
    content: string;
  }) => void;
  onClose: () => void;
}

export function CourseEditor({ course, onSave, onClose }: CourseEditorProps) {
  const [name, setName] = useState(course?.name || "");
  const [videoUrl, setVideoUrl] = useState(course?.videoUrl || "");
  const [durationSeconds, setDurationSeconds] = useState(course?.durationSeconds || 0);
  const [saving, setSaving] = useState(false);
  const [dragging, setDragging] = useState(false);

  // 3つのセクションの順序管理: "above" = 上テキスト, "video" = 動画, "below" = 下テキスト
  const [sections, setSections] = useState<("above" | "video" | "below")[]>(["above", "video", "below"]);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const editorAbove = useCreateBlockNote();
  const editorBelow = useCreateBlockNote();

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
      content: JSON.stringify({
        sections,
        above: editorAbove.document,
        below: editorBelow.document,
      }),
    });
    setSaving(false);
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
              <span className="text-sm font-semibold text-black">🎬 動画</span>
              <span className="text-xs text-gray-500">ドラッグで移動</span>
            </div>
            <input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none focus:border-black mb-2"
              placeholder="YouTube URL を入力"
            />
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
        </div>
      </div>
    </div>
  );
}
