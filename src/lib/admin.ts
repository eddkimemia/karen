import { cookies } from "next/headers";
import { createHash } from "crypto";

export const ADMIN_COOKIE = "karen_admin_session";

/**
 * The admin password from the environment. In development, a default is
 * provided so the dashboard works out of the box — production always
 * requires ADMIN_PASSWORD to be set.
 */
export function adminPassword() {
  if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD;
  if (process.env.NODE_ENV !== "production") return "karen-admin";
  return "";
}

export function adminSessionValue() {
  const secret = process.env.ADMIN_SECRET ?? "";
  return createHash("sha256")
    .update(`karen-admin:${adminPassword()}:${secret}`)
    .digest("hex");
}

/** True when the request carries a valid admin session cookie. */
export async function isAdminAuthed() {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  const expected = adminSessionValue();
  return token.length === expected.length && token === expected;
}
