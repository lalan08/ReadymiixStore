import { cookies } from "next/headers";

const COOKIE_NAME = "rmx_admin_session";
const SESSION_DURATION = 24 * 60 * 60; // 24 hours in seconds

export function getAdminSecret(): string {
  return process.env.ADMIN_SECRET ?? "fallback_secret_change_in_production";
}

export async function createAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = Buffer.from(
    `admin:${Date.now()}:${getAdminSecret()}`
  ).toString("base64");
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION,
    path: "/",
  });
}

export async function destroyAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const [role, timestamp, secret] = decoded.split(":");
    if (role !== "admin") return false;
    if (secret !== getAdminSecret()) return false;
    const sessionAge = Date.now() - parseInt(timestamp, 10);
    return sessionAge < SESSION_DURATION * 1000;
  } catch {
    return false;
  }
}
