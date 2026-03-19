"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { toast } from "sonner";
import type { Course } from "@/types";

declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string,
        config: {
          videoId: string;
          height: string;
          width: string;
          playerVars?: Record<string, number>;
          events?: {
            onReady?: (event: { target: YTPlayer }) => void;
            onStateChange?: (event: { data: number; target: YTPlayer }) => void;
          };
        }
      ) => YTPlayer;
      PlayerState: {
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YTPlayer {
  getCurrentTime: () => number;
  getDuration: () => number;
  playVideo: () => void;
  pauseVideo: () => void;
  stopVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getPlayerState: () => number;
  destroy: () => void;
}

interface VideoPlayerProps {
  course: Course;
  onComplete?: (courseId: string) => void;
}

function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/
  );
  return match ? match[1] : null;
}

export function VideoPlayer({ course, onComplete }: VideoPlayerProps) {
  const [isStarted, setIsStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const playerRef = useRef<YTPlayer | null>(null);
  const startTimeRef = useRef<number>(0);
  const maxWatchedRef = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const apiReady = useRef(false);

  const videoId = extractYouTubeId(course.videoUrl);

  useEffect(() => {
    if (!videoId) return;
    if (window.YT?.Player) {
      apiReady.current = true;
      return;
    }
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
    window.onYouTubeIframeAPIReady = () => {
      apiReady.current = true;
    };
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [videoId]);

  const saveProgress = useCallback(
    async (actualSeconds: number) => {
      if (isSaving) return;
      setIsSaving(true);
      try {
        const res = await fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            courseId: course.id,
            startTimestamp: startTimeRef.current,
            endTimestamp: Date.now(),
            actualViewingSeconds: actualSeconds,
            videoDurationSeconds: course.durationSeconds,
          }),
        });
        const data = await res.json();
        if (data.success && data.completion?.isComplete) {
          setIsComplete(true);
          onComplete?.(course.id);
          toast.success("視聴完了しました");
        } else {
          toast("最後まで視聴できていません。再チャレンジしてください。");
        }
      } catch {
        toast.error("保存に失敗しました");
      } finally {
        setIsSaving(false);
      }
    },
    [course.id, course.durationSeconds, isSaving]
  );

  const startViewing = useCallback(() => {
    if (!videoId || !apiReady.current) return;
    setIsStarted(true);
    startTimeRef.current = Date.now();
    maxWatchedRef.current = 0;

    setTimeout(() => {
      playerRef.current = new window.YT.Player("yt-player", {
        videoId,
        height: "100%",
        width: "100%",
        playerVars: { autoplay: 1, controls: 1, rel: 0, modestbranding: 1 },
        events: {
          onReady: () => {
            intervalRef.current = setInterval(() => {
              if (!playerRef.current) return;
              if (playerRef.current.getPlayerState() === 1) {
                const ct = playerRef.current.getCurrentTime();
                if (ct <= maxWatchedRef.current + 3) {
                  maxWatchedRef.current = Math.max(maxWatchedRef.current, ct);
                } else {
                  playerRef.current.seekTo(maxWatchedRef.current, true);
                }
              }
            }, 1000);
          },
          onStateChange: (event) => {
            if (event.data === 0) {
              if (intervalRef.current) clearInterval(intervalRef.current);
              saveProgress((Date.now() - startTimeRef.current) / 1000);
            }
          },
        },
      });
    }, 50);
  }, [videoId, saveProgress]);

  useEffect(() => {
    const handleUnload = () => {
      if (isStarted && !isComplete && startTimeRef.current > 0) {
        navigator.sendBeacon(
          "/api/progress",
          JSON.stringify({
            courseId: course.id,
            startTimestamp: startTimeRef.current,
            endTimestamp: Date.now(),
            actualViewingSeconds: (Date.now() - startTimeRef.current) / 1000,
            videoDurationSeconds: course.durationSeconds,
          })
        );
      }
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      if (intervalRef.current) clearInterval(intervalRef.current);
      playerRef.current?.destroy();
    };
  }, [isStarted, isComplete, course.id, course.durationSeconds]);

  if (!videoId) {
    return (
      <div className="aspect-video bg-gray-100 rounded flex items-center justify-center text-gray-400">
        動画が設定されていません
      </div>
    );
  }

  return (
    <div>
      <div className="aspect-video bg-black rounded overflow-hidden">
        {isStarted ? (
          <div id="yt-player" className="w-full h-full" />
        ) : (
          <button
            onClick={startViewing}
            className="w-full h-full flex items-center justify-center bg-gray-900 hover:bg-gray-800 transition-colors cursor-pointer group"
          >
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-white/20 transition-colors">
                <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <span className="text-white/70 text-sm">クリックして視聴開始</span>
            </div>
          </button>
        )}
      </div>

      {isComplete && (
        <div className="mt-3 text-sm text-green-700 bg-green-50 rounded px-4 py-2">
          ✓ この講座は視聴完了しました
        </div>
      )}

      <p className="mt-3 text-xs text-gray-400">
        最後まで視聴しない場合、視聴済みになりません。倍速再生は非対応です。
      </p>
    </div>
  );
}
