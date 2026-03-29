import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { writeFile } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";

const oauth2Client = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
  process.env.YOUTUBE_REDIRECT_URI
);

const TOKEN_PATH = join(tmpdir(), "youtube-token.json");

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const error = request.nextUrl.searchParams.get("error");

  if (error) {
    return new NextResponse(`
      <html><body>
        <h2>YouTube認証エラー</h2>
        <p>${error}</p>
        <script>setTimeout(() => window.close(), 3000)</script>
      </body></html>
    `, { headers: { "Content-Type": "text/html" } });
  }

  if (!code) {
    return new NextResponse("認証コードがありません", { status: 400 });
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    await writeFile(TOKEN_PATH, JSON.stringify(tokens));

    return new NextResponse(`
      <html><body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0;">
        <div style="text-align: center;">
          <h2>YouTube認証完了</h2>
          <p>このウィンドウは自動で閉じます</p>
          <script>
            if (window.opener) window.opener.postMessage({ type: "youtube-auth-success" }, "*");
            setTimeout(() => window.close(), 2000);
          </script>
        </div>
      </body></html>
    `, { headers: { "Content-Type": "text/html" } });
  } catch (err) {
    console.error("YouTube OAuth error:", err);
    return new NextResponse(`
      <html><body>
        <h2>トークン取得エラー</h2>
        <p>${err instanceof Error ? err.message : "不明なエラー"}</p>
      </body></html>
    `, { headers: { "Content-Type": "text/html" } });
  }
}
