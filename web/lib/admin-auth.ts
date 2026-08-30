/**
 * Sesión de admin por contraseña única (no hay usuarios, solo Cintia entra).
 * La cookie nunca guarda la contraseña: guarda un token derivado por HMAC de
 * ADMIN_SESSION_SECRET, así que conocer la cookie sin conocer el secreto no
 * sirve para nada. `crypto.subtle` (Web Crypto) en vez de Node `crypto`
 * porque este archivo lo usa tanto middleware.ts (runtime Edge) como las
 * Server Actions (runtime Node) — Web Crypto funciona en los dos.
 */
export const ADMIN_SESSION_COOKIE = "sacred_admin_session";

const TOKEN_MESSAGE = "sacred-admin-session";

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmac(secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(TOKEN_MESSAGE));
  return toHex(signature);
}

export async function createAdminSessionToken(): Promise<string> {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("Falta ADMIN_SESSION_SECRET");
  return hmac(secret);
}

export async function isValidAdminSessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const expected = await createAdminSessionToken();
  return token === expected;
}
