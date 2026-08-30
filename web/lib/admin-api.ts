/** fetch hacia api/ con el header que exigen los endpoints de admin (ver InternalApiKeyGuard en api/). */
const API_URL = process.env.API_URL ?? "http://localhost:4000";
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY ?? "";

export function adminApiFetch(path: string, init?: RequestInit) {
  const esFormData = init?.body instanceof FormData;
  return fetch(`${API_URL}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      // Si el body es FormData, dejamos que fetch calcule el boundary del multipart solo.
      ...(esFormData ? {} : { "Content-Type": "application/json" }),
      "x-internal-api-key": INTERNAL_API_KEY,
      ...(init?.headers ?? {}),
    },
  });
}

export async function mensajeDeError(res: Response): Promise<string> {
  try {
    const body = await res.json();
    if (Array.isArray(body.message)) return body.message.join(" ");
    if (typeof body.message === "string") return body.message;
  } catch {
    // respuesta sin JSON — se usa el mensaje genérico de abajo
  }
  return "No se pudo guardar.";
}
