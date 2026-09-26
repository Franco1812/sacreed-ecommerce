"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
// updateTag y no revalidateTag(tag, "max"): con "max" el primer request después
// de guardar se sirve stale a propósito, así que Cintia guardaba, entraba al
// sitio y veía el contenido viejo. updateTag expira la entrada de una y sólo
// se puede usar desde Server Actions, que es justo lo que hay acá.
import { revalidatePath, updateTag } from "next/cache";
import { timingSafeEqual } from "crypto";
import { ADMIN_SESSION_COOKIE, createAdminSessionToken } from "@/lib/admin-auth";
import { adminApiFetch, mensajeDeError } from "@/lib/admin-api";
import type { ProductoFormValues } from "./(protected)/productos/ProductoForm";
import type { ComboFormValues } from "./(protected)/combos/ComboForm";

function passwordsMatch(input: string, expected: string): boolean {
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function login(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || !passwordsMatch(password, expected)) {
    redirect("/admin/login?error=1");
  }

  const token = await createAdminSessionToken();
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  redirect("/admin/pedidos");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
  redirect("/admin/login");
}

export async function actualizarProducto(slug: string, data: { precio?: number; stock?: number }) {
  const res = await adminApiFetch(`/productos/${slug}`, { method: "PATCH", body: JSON.stringify(data) });
  if (!res.ok) return { ok: false, error: "No se pudo actualizar el producto." };
  updateTag("productos");
  revalidatePath("/admin/productos");
  return { ok: true };
}

export async function actualizarCombo(slug: string, data: { precio?: number; stock?: number }) {
  const res = await adminApiFetch(`/combos/${slug}`, { method: "PATCH", body: JSON.stringify(data) });
  if (!res.ok) return { ok: false, error: "No se pudo actualizar el combo." };
  updateTag("combos");
  revalidatePath("/admin/combos");
  return { ok: true };
}

export async function actualizarEstadoPedido(numero: number, estado: string) {
  const res = await adminApiFetch(`/pedidos/${numero}/estado`, { method: "PATCH", body: JSON.stringify({ estado }) });
  if (!res.ok) return { ok: false, error: "No se pudo actualizar el estado del pedido." };
  // Confirmar el pago puede descontar stock (ver PedidosService en api/) — invalidamos catálogo también.
  revalidatePath(`/admin/pedidos/${numero}`);
  revalidatePath("/admin/pedidos");
  revalidatePath("/admin");
  updateTag("productos");
  updateTag("combos");
  return { ok: true };
}

/** Guarda de una vez los textos de la portada, las 4 líneas y la lista de más vendidos; corta en el primer error. */
export async function guardarContenido(
  home: Record<string, string>,
  lineas: { id: string; nombre: string; texto: string }[],
  masVendidos: { slug: string; vendidos: number | null }[]
) {
  const resHome = await adminApiFetch("/contenido/home", { method: "PATCH", body: JSON.stringify(home) });
  if (!resHome.ok) return { ok: false, error: await mensajeDeError(resHome) };

  for (const { id, nombre, texto } of lineas) {
    const res = await adminApiFetch(`/contenido/lineas/${id}`, { method: "PATCH", body: JSON.stringify({ nombre, texto }) });
    if (!res.ok) return { ok: false, error: await mensajeDeError(res) };
  }

  const resMasVendidos = await adminApiFetch("/contenido/mas-vendidos", { method: "PUT", body: JSON.stringify({ items: masVendidos }) });
  if (!resMasVendidos.ok) return { ok: false, error: await mensajeDeError(resMasVendidos) };

  updateTag("contenido");
  updateTag("productos");
  revalidatePath("/admin/contenido");
  return { ok: true };
}

/** Guarda los textos y valores que Cintia cambió en Textos / Envíos y pagos (solo los que cambiaron). */
export async function guardarTextos(valores: Record<string, string>) {
  const res = await adminApiFetch("/contenido/textos", { method: "PUT", body: JSON.stringify({ valores }) });
  if (!res.ok) return { ok: false, error: await mensajeDeError(res) };
  updateTag("contenido");
  revalidatePath("/admin/textos");
  revalidatePath("/admin/envios-y-pagos");
  return { ok: true };
}

/** Sube la foto de un campo de imagen (pilares, banner). Se aplica al instante, sin esperar «Guardar». */
export async function subirImagenTexto(clave: string, formData: FormData) {
  const res = await adminApiFetch(`/contenido/textos/imagen/${encodeURIComponent(clave)}`, { method: "POST", body: formData });
  if (!res.ok) return { ok: false, error: await mensajeDeError(res) };
  updateTag("contenido");
  revalidatePath("/admin/textos");
  return { ok: true };
}

export async function quitarImagenTexto(clave: string) {
  const res = await adminApiFetch(`/contenido/textos/imagen/${encodeURIComponent(clave)}`, { method: "DELETE" });
  if (!res.ok) return { ok: false, error: await mensajeDeError(res) };
  updateTag("contenido");
  revalidatePath("/admin/textos");
  return { ok: true };
}

export async function guardarPagina(slug: string, data: { titulo: string; cuerpo: string }) {
  const res = await adminApiFetch(`/contenido/paginas/${slug}`, { method: "PUT", body: JSON.stringify(data) });
  if (!res.ok) return { ok: false, error: await mensajeDeError(res) };
  updateTag("contenido");
  revalidatePath("/admin/paginas");
  revalidatePath(`/admin/paginas/${slug}`);
  return { ok: true };
}

/** Deja la página con el texto con el que venía el sitio. */
export async function restaurarPagina(slug: string) {
  const res = await adminApiFetch(`/contenido/paginas/${slug}`, { method: "DELETE" });
  if (!res.ok) return { ok: false, error: await mensajeDeError(res) };
  updateTag("contenido");
  revalidatePath("/admin/paginas");
  revalidatePath(`/admin/paginas/${slug}`);
  return { ok: true };
}

export async function subirImagenHero(formData: FormData) {
  const res = await adminApiFetch("/contenido/hero-imagenes", { method: "POST", body: formData });
  if (!res.ok) return { ok: false, error: await mensajeDeError(res) };
  updateTag("contenido");
  revalidatePath("/admin/contenido");
  return { ok: true };
}

export async function eliminarImagenHero(imagenId: string) {
  const res = await adminApiFetch(`/contenido/hero-imagenes/${imagenId}`, { method: "DELETE" });
  if (!res.ok) return { ok: false, error: await mensajeDeError(res) };
  updateTag("contenido");
  revalidatePath("/admin/contenido");
  return { ok: true };
}

export async function ordenarImagenesHero(ids: string[]) {
  const res = await adminApiFetch("/contenido/hero-imagenes/orden", { method: "PATCH", body: JSON.stringify({ ids }) });
  if (!res.ok) return { ok: false, error: await mensajeDeError(res) };
  updateTag("contenido");
  revalidatePath("/admin/contenido");
  return { ok: true };
}

export async function subirComprobantePedido(numero: number, formData: FormData) {
  const res = await adminApiFetch(`/pedidos/${numero}/imagenes`, { method: "POST", body: formData });
  if (!res.ok) return { ok: false, error: await mensajeDeError(res) };
  revalidatePath(`/admin/pedidos/${numero}`);
  return { ok: true };
}

export async function eliminarComprobantePedido(numero: number, imagenId: string) {
  const res = await adminApiFetch(`/pedidos/${numero}/imagenes/${imagenId}`, { method: "DELETE" });
  if (!res.ok) return { ok: false, error: await mensajeDeError(res) };
  revalidatePath(`/admin/pedidos/${numero}`);
  return { ok: true };
}

function numOrUndefined(value: string): number | undefined {
  if (value.trim() === "") return undefined;
  const n = Number(value);
  return Number.isNaN(n) ? undefined : n;
}

function strOrUndefined(value: string): string | undefined {
  const v = value.trim();
  return v === "" ? undefined : v;
}

function toProductoDto(data: ProductoFormValues) {
  const laFormula = data.laFormula.filter((i) => i.ingrediente.trim() !== "" || i.texto.trim() !== "");
  return {
    slug: data.slug,
    nombre: data.nombre,
    formulaSubtitulo: strOrUndefined(data.formulaSubtitulo),
    linea: data.linea,
    ritual: data.ritual.map((r) => r.toUpperCase()),
    orden: numOrUndefined(data.orden),
    momentoSugerido: strOrUndefined(data.momentoSugerido),
    descripcion: data.descripcion,
    laFormula: laFormula.length > 0 ? laFormula : undefined,
    beneficios: data.beneficios.filter((b) => b.trim() !== ""),
    ritualDeUso: data.ritualDeUso,
    ingredientes: strOrUndefined(data.ingredientes),
    notaDePureza: strOrUndefined(data.notaDePureza),
    origen: strOrUndefined(data.origen),
    precio: numOrUndefined(data.precio),
    formato: strOrUndefined(data.formato),
    pesoNetoGramos: numOrUndefined(data.pesoNetoGramos),
    paqueteAltoCm: numOrUndefined(data.paqueteAltoCm),
    paqueteAnchoCm: numOrUndefined(data.paqueteAnchoCm),
    paqueteProfundidadCm: numOrUndefined(data.paqueteProfundidadCm),
    stock: numOrUndefined(data.stock),
    destacado: strOrUndefined(data.destacado),
    nombrePendiente: data.nombrePendiente,
    seoTitulo: strOrUndefined(data.seoTitulo),
    seoDescripcion: strOrUndefined(data.seoDescripcion),
  };
}

export async function crearProducto(data: ProductoFormValues) {
  const res = await adminApiFetch("/productos", { method: "POST", body: JSON.stringify(toProductoDto(data)) });
  if (!res.ok) return { ok: false, error: await mensajeDeError(res) };
  updateTag("productos");
  revalidatePath("/admin/productos");
  return { ok: true, slug: data.slug };
}

export async function actualizarProductoCompleto(slug: string, data: ProductoFormValues) {
  const res = await adminApiFetch(`/productos/${slug}`, { method: "PATCH", body: JSON.stringify(toProductoDto(data)) });
  if (!res.ok) return { ok: false, error: await mensajeDeError(res) };
  updateTag("productos");
  revalidatePath("/admin/productos");
  revalidatePath(`/admin/productos/${slug}/editar`);
  return { ok: true, slug };
}

export async function subirImagenProducto(slug: string, formData: FormData) {
  const res = await adminApiFetch(`/productos/${slug}/imagenes`, { method: "POST", body: formData });
  if (!res.ok) return { ok: false, error: await mensajeDeError(res) };
  updateTag("productos");
  revalidatePath(`/admin/productos/${slug}/editar`);
  return { ok: true };
}

export async function eliminarImagenProducto(slug: string, imagenId: string) {
  const res = await adminApiFetch(`/productos/${slug}/imagenes/${imagenId}`, { method: "DELETE" });
  if (!res.ok) return { ok: false, error: await mensajeDeError(res) };
  updateTag("productos");
  revalidatePath(`/admin/productos/${slug}/editar`);
  return { ok: true };
}

function toComboDto(data: ComboFormValues) {
  return {
    slug: data.slug,
    nombre: data.nombre,
    bajada: data.bajada,
    ritual: data.ritual.map((r) => r.toUpperCase()),
    porQueSePotencian: data.porQueSePotencian,
    copyAprobado: data.copyAprobado,
    precio: numOrUndefined(data.precio),
    stock: numOrUndefined(data.stock),
    productos: data.productos,
  };
}

export async function crearCombo(data: ComboFormValues) {
  const res = await adminApiFetch("/combos", { method: "POST", body: JSON.stringify(toComboDto(data)) });
  if (!res.ok) return { ok: false, error: await mensajeDeError(res) };
  updateTag("combos");
  revalidatePath("/admin/combos");
  return { ok: true, slug: data.slug };
}

export async function actualizarComboCompleto(slug: string, data: ComboFormValues) {
  const res = await adminApiFetch(`/combos/${slug}`, { method: "PATCH", body: JSON.stringify(toComboDto(data)) });
  if (!res.ok) return { ok: false, error: await mensajeDeError(res) };
  updateTag("combos");
  revalidatePath("/admin/combos");
  revalidatePath(`/admin/combos/${slug}/editar`);
  return { ok: true, slug };
}

export async function subirImagenCombo(slug: string, formData: FormData) {
  const res = await adminApiFetch(`/combos/${slug}/imagenes`, { method: "POST", body: formData });
  if (!res.ok) return { ok: false, error: await mensajeDeError(res) };
  updateTag("combos");
  revalidatePath(`/admin/combos/${slug}/editar`);
  return { ok: true };
}

export async function eliminarImagenCombo(slug: string, imagenId: string) {
  const res = await adminApiFetch(`/combos/${slug}/imagenes/${imagenId}`, { method: "DELETE" });
  if (!res.ok) return { ok: false, error: await mensajeDeError(res) };
  updateTag("combos");
  revalidatePath(`/admin/combos/${slug}/editar`);
  return { ok: true };
}
