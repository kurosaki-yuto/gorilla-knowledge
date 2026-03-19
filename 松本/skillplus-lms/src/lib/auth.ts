import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "skillplus-dev-secret"
);
const COOKIE_NAME = "sp_session";
const EXPIRY = "7d";

export interface SessionUser {
  id: string;
  name: string;
  companyName: string;
}

/** JWTトークンを生成 */
async function createToken(user: SessionUser): Promise<string> {
  return new SignJWT({ ...user })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(EXPIRY)
    .setIssuedAt()
    .sign(SECRET);
}

/** JWTトークンを検証 */
async function verifyToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return {
      id: payload.id as string,
      name: payload.name as string,
      companyName: payload.companyName as string,
    };
  } catch {
    return null;
  }
}

/** ログイン */
export async function login(
  userId: string,
  password: string
): Promise<{ success: boolean; message?: string }> {
  const user = await db.getUserById(userId);
  if (!user) return { success: false, message: "ユーザーが見つかりません" };

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid)
    return { success: false, message: "パスワードが正しくありません" };

  const token = await createToken({
    id: user.id,
    name: user.name,
    companyName: user.companyName,
  });

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });

  return { success: true };
}

/** ログアウト */
export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/** 現在のセッションを取得 */
export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}
