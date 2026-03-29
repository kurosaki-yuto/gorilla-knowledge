import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { getSession } from "@/lib/auth";
import { readFile, unlink } from "fs/promises";
import { writeFile } from "fs/promises";

// 動画アップロード用: Hobbyプラン上限300秒
export const maxDuration = 300;

import { join } from "path";
import { tmpdir } from "os";
import { Readable } from "stream";

const oauth2Client = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
  process.env.YOUTUBE_REDIRECT_URI
);

// トークン保存用（簡易実装 - ファイルベース）
const TOKEN_PATH = join(tmpdir(), "youtube-token.json");

async function getStoredToken() {
  try {
    const data = await readFile(TOKEN_PATH, "utf-8");
    return JSON.parse(data);
  } catch {
    return null;
  }
}

async function storeToken(token: unknown) {
  await writeFile(TOKEN_PATH, JSON.stringify(token));
}

// GET: 認証状態チェック or OAuth URL取得
export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const action = request.nextUrl.searchParams.get("action");

  if (action === "status") {
    const token = await getStoredToken();
    return NextResponse.json({ authenticated: !!token });
  }

  if (action === "auth") {
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: ["https://www.googleapis.com/auth/youtube.upload"],
      prompt: "consent",
    });
    return NextResponse.json({ url });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}

// POST: MP4アップロード → YouTube
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = await getStoredToken();
  if (!token) {
    return NextResponse.json({ error: "YouTube未認証。先にYouTube認証を行ってください。" }, { status: 401 });
  }

  oauth2Client.setCredentials(token);

  // トークンリフレッシュ
  oauth2Client.on("tokens", async (newTokens) => {
    const current = await getStoredToken();
    await storeToken({ ...current, ...newTokens });
  });

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const title = (formData.get("title") as string) || "無題の講座";
    const description = (formData.get("description") as string) || "";

    if (!file) {
      return NextResponse.json({ error: "ファイルが必要です" }, { status: 400 });
    }

    // ファイルを一時保存
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const tmpPath = join(tmpdir(), `upload-${Date.now()}.mp4`);
    await writeFile(tmpPath, buffer);

    const youtube = google.youtube({ version: "v3", auth: oauth2Client });

    // YouTube にアップロード（限定公開）
    const res = await youtube.videos.insert({
      part: ["snippet", "status"],
      requestBody: {
        snippet: {
          title,
          description,
          categoryId: "27", // Education
        },
        status: {
          privacyStatus: "unlisted", // 限定公開
        },
      },
      media: {
        body: Readable.from(buffer),
      },
    });

    // 一時ファイル削除
    await unlink(tmpPath).catch(() => {});

    const videoId = res.data.id;
    const videoUrl = `https://youtu.be/${videoId}`;

    // 動画の長さを取得
    let durationSeconds = 0;
    if (videoId) {
      // アップロード直後は処理中のため、少し待つ
      await new Promise((r) => setTimeout(r, 3000));
      try {
        const details = await youtube.videos.list({
          part: ["contentDetails"],
          id: [videoId],
        });
        const duration = details.data.items?.[0]?.contentDetails?.duration || "";
        // ISO 8601 duration (PT1H2M3S) をパース
        const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        if (match) {
          durationSeconds = (parseInt(match[1] || "0") * 3600) +
            (parseInt(match[2] || "0") * 60) +
            (parseInt(match[3] || "0"));
        }
      } catch {
        // 処理中の場合は取得できない場合がある
      }
    }

    return NextResponse.json({
      success: true,
      videoId,
      videoUrl,
      durationSeconds,
    });
  } catch (error) {
    console.error("YouTube upload error:", error);
    const message = error instanceof Error ? error.message : "アップロードに失敗しました";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
