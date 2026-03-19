"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { toast } from "sonner";
import type { Course } from "@/types";

// ==========================================
// 助成金コンプライアンス対応 VideoPlayer
// - YouTube / MP4 両対応
// - 初回視聴: 倍速・スキップ無効
// - PLAYING状態のみ時間カウント（一時停止除外）
// - 視聴イベントログ記録
// - 完了の二重判定（ENDED + 実再生時間）
// - タブ非表示検知
// ==========================================

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
            onPlaybackRateChange?: (event: { data: number; target: YTPlayer }) => void;
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
  getPlaybackRate: () => number;
  setPlaybackRate: (rate: number) => void;
  destroy: () => void;
}

interface VideoPlayerProps {
  course: Course;
  onComplete?: (courseId: string) => void;
}

interface WatchEvent {
  eventType: string;
  videoTime: number;
  wallClockAt: string;
  metadata?: Record<string, unknown>;
}

function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/
  );
  return match ? match[1] : null;
}

function isMP4Url(url: string): boolean {
  if (!url) return false;
  const lower = url.toLowerCase();
  // .mp4, .webm, .ogg or common video CDN patterns
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(lower)
    || lower.includes("video/")
    || (lower.startsWith("http") && !extractYouTubeId(url) && /\.(mp4|webm|ogg|mov)/i.test(lower));
}

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.round(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

// ==========================================
// MP4プレーヤー
// ==========================================
function MP4Player({ course, onComplete }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [actualPlaySeconds, setActualPlaySeconds] = useState(0);

  const startTimeRef = useRef<number>(0);
  const maxWatchedRef = useRef<number>(0);
  const actualPlaySecondsRef = useRef(0);
  const lastTickRef = useRef<number>(0);
  const isPlayingRef = useRef(false);
  const hasEndedRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const eventsRef = useRef<WatchEvent[]>([]);

  const logEvent = useCallback(
    (eventType: string, metadata?: Record<string, unknown>) => {
      const videoTime = videoRef.current?.currentTime || 0;
      eventsRef.current.push({
        eventType,
        videoTime: Math.round(videoTime * 10) / 10,
        wallClockAt: new Date().toISOString(),
        metadata,
      });
    },
    []
  );

  const saveProgress = useCallback(
    async (playSeconds: number, ended: boolean) => {
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
            actualViewingSeconds: playSeconds,
            videoDurationSeconds: course.durationSeconds,
            videoEnded: ended,
            actualPlaySeconds: Math.round(playSeconds),
            progressPercent: course.durationSeconds > 0
              ? Math.min(100, Math.round((playSeconds / course.durationSeconds) * 100))
              : 0,
            events: eventsRef.current,
          }),
        });
        const data = await res.json();
        if (data.success && data.completion?.isComplete) {
          setIsComplete(true);
          onComplete?.(course.id);
          toast.success("視聴完了しました");
        } else if (ended) {
          toast("視聴時間が不足しています。もう一度視聴してください。");
        }
      } catch {
        toast.error("保存に失敗しました");
      } finally {
        setIsSaving(false);
      }
    },
    [course.id, course.durationSeconds, isSaving, onComplete]
  );

  const startViewing = useCallback(() => {
    setIsStarted(true);
    startTimeRef.current = Date.now();
    maxWatchedRef.current = 0;
    actualPlaySecondsRef.current = 0;
    lastTickRef.current = Date.now();
    isPlayingRef.current = false;
    hasEndedRef.current = false;
    eventsRef.current = [];
  }, []);

  // MP4プレーヤーのイベント設定
  useEffect(() => {
    if (!isStarted) return;

    const video = videoRef.current;
    if (!video) return;

    // 自動再生
    video.play().catch(() => {});

    // 倍速防止
    const handleRateChange = () => {
      if (video.playbackRate !== 1.0) {
        video.playbackRate = 1.0;
        logEvent("speed_change", { attempted: video.playbackRate, forced: 1.0 });
        toast("倍速再生は無効です。等速でご視聴ください。");
      }
    };

    // 再生
    const handlePlay = () => {
      if (!isPlayingRef.current) {
        logEvent("play");
        isPlayingRef.current = true;
        lastTickRef.current = Date.now();
      }
    };

    // 一時停止
    const handlePause = () => {
      if (isPlayingRef.current && !hasEndedRef.current) {
        const now = Date.now();
        const delta = (now - lastTickRef.current) / 1000;
        if (delta < 5) {
          actualPlaySecondsRef.current += delta;
          setActualPlaySeconds(Math.round(actualPlaySecondsRef.current));
        }
        isPlayingRef.current = false;
        logEvent("pause");
      }
    };

    // スキップ防止
    const handleSeeking = () => {
      const ct = video.currentTime;
      if (ct > maxWatchedRef.current + 3) {
        logEvent("seek", { from: maxWatchedRef.current, to: ct });
        video.currentTime = maxWatchedRef.current;
      }
    };

    // 終了
    const handleEnded = () => {
      if (!hasEndedRef.current) {
        hasEndedRef.current = true;
        if (isPlayingRef.current) {
          const now = Date.now();
          const delta = (now - lastTickRef.current) / 1000;
          if (delta < 5) {
            actualPlaySecondsRef.current += delta;
          }
          isPlayingRef.current = false;
        }
        logEvent("ended");
        if (intervalRef.current) clearInterval(intervalRef.current);
        saveProgress(actualPlaySecondsRef.current, true);
      }
    };

    video.addEventListener("ratechange", handleRateChange);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("seeking", handleSeeking);
    video.addEventListener("ended", handleEnded);

    // 1秒ごとのチェック
    intervalRef.current = setInterval(() => {
      const now = Date.now();
      if (!video.paused && isPlayingRef.current) {
        const delta = (now - lastTickRef.current) / 1000;
        if (delta < 5) {
          actualPlaySecondsRef.current += delta;
          setActualPlaySeconds(Math.round(actualPlaySecondsRef.current));
        }
      }
      lastTickRef.current = now;

      if (!video.paused) {
        const ct = video.currentTime;
        if (ct <= maxWatchedRef.current + 3) {
          maxWatchedRef.current = Math.max(maxWatchedRef.current, ct);
        }
        if (video.duration > 0) {
          const pct = Math.min(100, Math.round((maxWatchedRef.current / video.duration) * 100));
          setProgressPercent(pct);
        }
      }
    }, 1000);

    return () => {
      video.removeEventListener("ratechange", handleRateChange);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("seeking", handleSeeking);
      video.removeEventListener("ended", handleEnded);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isStarted, logEvent, saveProgress]);

  // タブ非表示検知
  useEffect(() => {
    if (!isStarted) return;
    const handleVisibility = () => {
      if (document.hidden) {
        logEvent("tab_hidden");
        videoRef.current?.pause();
      } else {
        logEvent("tab_visible");
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [isStarted, logEvent]);

  // ページ離脱時
  useEffect(() => {
    const handleUnload = () => {
      if (isStarted && !isComplete && startTimeRef.current > 0) {
        logEvent("tab_hidden");
        navigator.sendBeacon(
          "/api/progress",
          JSON.stringify({
            courseId: course.id,
            startTimestamp: startTimeRef.current,
            endTimestamp: Date.now(),
            actualViewingSeconds: actualPlaySecondsRef.current,
            videoDurationSeconds: course.durationSeconds,
            videoEnded: false,
            actualPlaySeconds: Math.round(actualPlaySecondsRef.current),
            progressPercent: course.durationSeconds > 0
              ? Math.min(100, Math.round((actualPlaySecondsRef.current / course.durationSeconds) * 100))
              : 0,
            events: eventsRef.current,
          })
        );
      }
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [isStarted, isComplete, course.id, course.durationSeconds, logEvent]);

  return (
    <div>
      <div className="aspect-video bg-black rounded overflow-hidden">
        {isStarted ? (
          <video
            ref={videoRef}
            src={course.videoUrl}
            className="w-full h-full"
            controls
            controlsList="nodownload noplaybackrate"
            disablePictureInPicture
            playsInline
          />
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

      {isStarted && !isComplete && (
        <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <span>視聴時間: {formatTime(actualPlaySeconds)}</span>
            <span>進捗: {progressPercent}%</span>
          </div>
          <span className="text-xs text-gray-400">
            標準学習時間: {formatTime(course.durationSeconds)}
          </span>
        </div>
      )}

      {isComplete && (
        <div className="mt-3 text-sm text-green-700 bg-green-50 rounded px-4 py-2">
          ✓ この講座は視聴完了しました
        </div>
      )}

      <p className="mt-3 text-xs text-gray-500">
        初回視聴は等速再生のみ対応です。早送り・スキップはできません。
      </p>
    </div>
  );
}

// ==========================================
// YouTubeプレーヤー
// ==========================================
function YouTubePlayer({ course, onComplete }: VideoPlayerProps & { videoId: string }) {
  const [isStarted, setIsStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [actualPlaySeconds, setActualPlaySeconds] = useState(0);

  const playerRef = useRef<YTPlayer | null>(null);
  const startTimeRef = useRef<number>(0);
  const maxWatchedRef = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const apiReady = useRef(false);

  const actualPlaySecondsRef = useRef(0);
  const lastTickRef = useRef<number>(0);
  const isPlayingRef = useRef(false);
  const hasEndedRef = useRef(false);
  const eventsRef = useRef<WatchEvent[]>([]);

  const videoId = extractYouTubeId(course.videoUrl)!;

  const logEvent = useCallback(
    (eventType: string, metadata?: Record<string, unknown>) => {
      const videoTime = playerRef.current?.getCurrentTime() || 0;
      eventsRef.current.push({
        eventType,
        videoTime: Math.round(videoTime * 10) / 10,
        wallClockAt: new Date().toISOString(),
        metadata,
      });
    },
    []
  );

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    if (!isStarted) return;
    const handleVisibility = () => {
      if (document.hidden) {
        logEvent("tab_hidden");
        playerRef.current?.pauseVideo();
      } else {
        logEvent("tab_visible");
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [isStarted, logEvent]);

  const saveProgress = useCallback(
    async (playSeconds: number, ended: boolean) => {
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
            actualViewingSeconds: playSeconds,
            videoDurationSeconds: course.durationSeconds,
            videoEnded: ended,
            actualPlaySeconds: Math.round(playSeconds),
            progressPercent: course.durationSeconds > 0
              ? Math.min(100, Math.round((playSeconds / course.durationSeconds) * 100))
              : 0,
            events: eventsRef.current,
          }),
        });
        const data = await res.json();
        if (data.success && data.completion?.isComplete) {
          setIsComplete(true);
          onComplete?.(course.id);
          toast.success("視聴完了しました");
        } else if (ended) {
          toast("視聴時間が不足しています。もう一度視聴してください。");
        }
      } catch {
        toast.error("保存に失敗しました");
      } finally {
        setIsSaving(false);
      }
    },
    [course.id, course.durationSeconds, isSaving, onComplete]
  );

  const startViewing = useCallback(() => {
    if (!apiReady.current) return;
    setIsStarted(true);
    startTimeRef.current = Date.now();
    maxWatchedRef.current = 0;
    actualPlaySecondsRef.current = 0;
    lastTickRef.current = Date.now();
    isPlayingRef.current = false;
    hasEndedRef.current = false;
    eventsRef.current = [];

    setTimeout(() => {
      playerRef.current = new window.YT.Player("yt-player", {
        videoId,
        height: "100%",
        width: "100%",
        playerVars: {
          autoplay: 1,
          controls: 1,
          rel: 0,
          modestbranding: 1,
          disablekb: 1,
        },
        events: {
          onReady: () => {
            logEvent("play");
            playerRef.current?.setPlaybackRate(1.0);

            intervalRef.current = setInterval(() => {
              if (!playerRef.current) return;
              const state = playerRef.current.getPlayerState();
              const now = Date.now();

              if (state === 1 && isPlayingRef.current) {
                const delta = (now - lastTickRef.current) / 1000;
                if (delta < 5) {
                  actualPlaySecondsRef.current += delta;
                  setActualPlaySeconds(Math.round(actualPlaySecondsRef.current));
                }
              }
              lastTickRef.current = now;

              if (state === 1) {
                const ct = playerRef.current.getCurrentTime();
                const duration = playerRef.current.getDuration();

                if (ct <= maxWatchedRef.current + 3) {
                  maxWatchedRef.current = Math.max(maxWatchedRef.current, ct);
                } else {
                  logEvent("seek", { from: maxWatchedRef.current, to: ct });
                  playerRef.current.seekTo(maxWatchedRef.current, true);
                }

                if (duration > 0) {
                  const pct = Math.min(100, Math.round((maxWatchedRef.current / duration) * 100));
                  setProgressPercent(pct);
                }

                const rate = playerRef.current.getPlaybackRate();
                if (rate !== 1.0) {
                  playerRef.current.setPlaybackRate(1.0);
                  logEvent("speed_change", { attempted: rate, forced: 1.0 });
                }
              }
            }, 1000);
          },

          onStateChange: (event) => {
            const now = Date.now();

            switch (event.data) {
              case 1: // PLAYING
                if (!isPlayingRef.current) {
                  logEvent(isPlayingRef.current ? "resume" : "play");
                  isPlayingRef.current = true;
                  lastTickRef.current = now;
                }
                break;

              case 2: // PAUSED
                if (isPlayingRef.current) {
                  const delta = (now - lastTickRef.current) / 1000;
                  if (delta < 5) {
                    actualPlaySecondsRef.current += delta;
                    setActualPlaySeconds(Math.round(actualPlaySecondsRef.current));
                  }
                  isPlayingRef.current = false;
                  logEvent("pause");
                }
                break;

              case 0: // ENDED
                if (!hasEndedRef.current) {
                  hasEndedRef.current = true;
                  if (isPlayingRef.current) {
                    const delta = (now - lastTickRef.current) / 1000;
                    if (delta < 5) {
                      actualPlaySecondsRef.current += delta;
                    }
                    isPlayingRef.current = false;
                  }
                  logEvent("ended");
                  if (intervalRef.current) clearInterval(intervalRef.current);
                  saveProgress(actualPlaySecondsRef.current, true);
                }
                break;
            }
          },

          onPlaybackRateChange: (event) => {
            if (event.data !== 1.0) {
              playerRef.current?.setPlaybackRate(1.0);
              logEvent("speed_change", { attempted: event.data, forced: 1.0 });
              toast("倍速再生は無効です。等速でご視聴ください。");
            }
          },
        },
      });
    }, 50);
  }, [videoId, saveProgress, logEvent]);

  useEffect(() => {
    const handleUnload = () => {
      if (isStarted && !isComplete && startTimeRef.current > 0) {
        logEvent("tab_hidden");
        navigator.sendBeacon(
          "/api/progress",
          JSON.stringify({
            courseId: course.id,
            startTimestamp: startTimeRef.current,
            endTimestamp: Date.now(),
            actualViewingSeconds: actualPlaySecondsRef.current,
            videoDurationSeconds: course.durationSeconds,
            videoEnded: false,
            actualPlaySeconds: Math.round(actualPlaySecondsRef.current),
            progressPercent: course.durationSeconds > 0
              ? Math.min(100, Math.round((actualPlaySecondsRef.current / course.durationSeconds) * 100))
              : 0,
            events: eventsRef.current,
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
  }, [isStarted, isComplete, course.id, course.durationSeconds, logEvent]);

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

      {isStarted && !isComplete && (
        <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <span>視聴時間: {formatTime(actualPlaySeconds)}</span>
            <span>進捗: {progressPercent}%</span>
          </div>
          <span className="text-xs text-gray-400">
            標準学習時間: {formatTime(course.durationSeconds)}
          </span>
        </div>
      )}

      {isComplete && (
        <div className="mt-3 text-sm text-green-700 bg-green-50 rounded px-4 py-2">
          ✓ この講座は視聴完了しました
        </div>
      )}

      <p className="mt-3 text-xs text-gray-500">
        初回視聴は等速再生のみ対応です。早送り・スキップはできません。
      </p>
    </div>
  );
}

// ==========================================
// メインコンポーネント（YouTube/MP4を自動判別）
// ==========================================
export function VideoPlayer({ course, onComplete }: VideoPlayerProps) {
  if (!course.videoUrl) {
    return (
      <div className="aspect-video bg-gray-100 rounded flex items-center justify-center text-gray-400">
        動画が設定されていません
      </div>
    );
  }

  const youtubeId = extractYouTubeId(course.videoUrl);

  if (youtubeId) {
    return <YouTubePlayer course={course} onComplete={onComplete} videoId={youtubeId} />;
  }

  if (isMP4Url(course.videoUrl) || !youtubeId) {
    // YouTube URLでない場合はMP4/直接URLとして扱う
    return <MP4Player course={course} onComplete={onComplete} />;
  }

  return (
    <div className="aspect-video bg-gray-100 rounded flex items-center justify-center text-gray-400">
      動画が設定されていません
    </div>
  );
}
