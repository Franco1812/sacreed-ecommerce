import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { SupabaseStorageService } from '../storage/supabase-storage.service.js';
import type { LineaBeneficio } from '../generated/prisma/client.js';
import { HOME_DEFAULT, LINEAS_DEFAULT } from './contenido.defaults.js';
import { CAMPO_POR_CLAVE, CAMPOS, GRUPOS, PAGINA_POR_SLUG, PAGINAS } from './contenido.registro.js';
import type { ContenidoHomeDto, LineaDto, MasVendidosDto, PaginaDto } from './dto/contenido.dto.js';

/** Cuántos productos entran en la sección: más que eso ya no cabe bien en la fila de la portada. */
export const MAS_VENDIDOS_MAX = 8;

const LINEAS_VALIDAS = new Set<string>(LINEAS_DEFAULT.map((l) => l.id));

@Injectable()
export class ContenidoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: SupabaseStorageService
  ) {}

  /**
   * Las filas de contenido se crean solas con los defaults la primera vez que
   * alguien las pide. Es a propósito: no hay paso de seed de contenido, así
   * que esto es lo que hace que un ambiente nuevo (o Railway, que no corre
   * seeds) muestre el copy correcto apenas se aplica la migración.
   */
  async getHome() {
    const existente = await this.prisma.contenidoHome.findUnique({ where: { id: 'home' } });
    if (existente) return existente;
    return this.prisma.contenidoHome.create({ data: { id: 'home', ...HOME_DEFAULT } });
  }

  async actualizarHome(dto: ContenidoHomeDto) {
    await this.getHome();
    return this.prisma.contenidoHome.update({ where: { id: 'home' }, data: dto });
  }

  async getLineas() {
    const filas = await this.prisma.linea.findMany({ orderBy: { orden: 'asc' } });
    if (filas.length === LINEAS_DEFAULT.length) return filas;

    // Falta alguna: primer arranque, o se sumó un valor nuevo al enum LineaBeneficio.
    const existentes = new Set(filas.map((f) => f.id as string));
    await this.prisma.linea.createMany({
      data: LINEAS_DEFAULT.filter((l) => !existentes.has(l.id)),
      skipDuplicates: true,
    });
    return this.prisma.linea.findMany({ orderBy: { orden: 'asc' } });
  }

  async actualizarLinea(id: string, dto: LineaDto) {
    if (!LINEAS_VALIDAS.has(id)) throw new NotFoundException();
    await this.getLineas();
    return this.prisma.linea.update({ where: { id: id as LineaBeneficio }, data: dto });
  }

  /** Público: lo lee la portada. Devuelve solo slug + número, la ficha completa ya la tiene el catálogo. */
  async getMasVendidos() {
    const filas = await this.prisma.masVendido.findMany({
      orderBy: { orden: 'asc' },
      include: { producto: { select: { slug: true, vendidos: true } } },
    });
    return filas.map((f) => ({ slug: f.producto.slug, vendidos: f.producto.vendidos }));
  }

  /** Reemplaza la lista entera (qué productos y en qué orden) y actualiza el "+N vendidos" de cada uno. */
  async reemplazarMasVendidos(dto: MasVendidosDto) {
    const items = dto.items;
    if (!items.every((i) => i && typeof i.slug === 'string' && (i.vendidos == null || (Number.isInteger(i.vendidos) && i.vendidos >= 0)))) {
      throw new BadRequestException('Cada producto necesita un slug y, si lleva número de vendidos, un entero mayor o igual a 0.');
    }
    if (items.length > MAS_VENDIDOS_MAX) throw new BadRequestException(`Pueden ser hasta ${MAS_VENDIDOS_MAX} productos.`);
    if (new Set(items.map((i) => i.slug)).size !== items.length) throw new BadRequestException('Un producto no puede repetirse.');

    const productos = await this.prisma.producto.findMany({ where: { slug: { in: items.map((i) => i.slug) } }, select: { id: true, slug: true } });
    const idPorSlug = new Map(productos.map((p) => [p.slug, p.id]));
    const faltante = items.find((i) => !idPorSlug.has(i.slug));
    if (faltante) throw new BadRequestException(`No existe el producto "${faltante.slug}".`);

    await this.prisma.$transaction([
      this.prisma.masVendido.deleteMany(),
      this.prisma.masVendido.createMany({ data: items.map((i, orden) => ({ orden, productoId: idPorSlug.get(i.slug)! })) }),
      ...items.map((i) => this.prisma.producto.update({ where: { id: idPorSlug.get(i.slug)! }, data: { vendidos: i.vendidos ?? null } })),
    ]);
    return this.getMasVendidos();
  }

  // ---- Textos, fotos y valores sueltos del sitio (registro en contenido.registro.ts)

  /** Público: todos los textos del sitio, con lo que Cintia cambió por encima de los defaults. */
  async getTextos(): Promise<Record<string, string>> {
    const guardados = await this.textosGuardados();
    return Object.fromEntries(CAMPOS.map((c) => [c.clave, guardados.get(c.clave) ?? c.porDefecto]));
  }

  /** Para el admin: cada campo con su valor actual y el original. */
  async getCampos() {
    const guardados = await this.textosGuardados();
    return {
      grupos: GRUPOS,
      campos: CAMPOS.map((c) => ({ ...c, valor: guardados.get(c.clave) ?? c.porDefecto })),
    };
  }

  async actualizarTextos(valores: Record<string, string>) {
    const entradas = Object.entries(valores);
    for (const [clave, valor] of entradas) {
      const campo = CAMPO_POR_CLAVE.get(clave);
      if (!campo) throw new BadRequestException(`No existe el texto "${clave}".`);
      if (typeof valor !== 'string') throw new BadRequestException(`El texto "${campo.etiqueta}" tiene que ser texto.`);
      if (campo.tipo === 'imagen') throw new BadRequestException('Las fotos se suben aparte.');
      if (campo.tipo === 'numero' && !/^\d{1,9}$/.test(valor.trim())) {
        throw new BadRequestException(`"${campo.etiqueta}" tiene que ser un número entero, sin puntos ni signos.`);
      }
      if (valor.length > 5000) throw new BadRequestException(`"${campo.etiqueta}" es demasiado largo.`);
    }

    await this.prisma.$transaction(
      entradas.map(([clave, valor]) => {
        const limpio = this.limpiar(CAMPO_POR_CLAVE.get(clave)!.tipo, valor);
        return this.prisma.texto.upsert({ where: { clave }, create: { clave, valor: limpio }, update: { valor: limpio } });
      })
    );
    return this.getTextos();
  }

  async subirImagenTexto(clave: string, file: Express.Multer.File) {
    const campo = this.campoImagen(clave);
    if (!file) throw new BadRequestException('Falta el archivo de la foto.');

    const anterior = await this.prisma.texto.findUnique({ where: { clave } });
    const url = await this.storage.upload(`sitio-${clave.replace(/\./g, '-')}`, file);
    await this.prisma.texto.upsert({ where: { clave }, create: { clave, valor: url }, update: { valor: url } });
    if (anterior?.valor) await this.storage.remove(anterior.valor);
    return { clave: campo.clave, url };
  }

  async quitarImagenTexto(clave: string) {
    this.campoImagen(clave);
    const existente = await this.prisma.texto.findUnique({ where: { clave } });
    if (!existente) return;
    await this.storage.remove(existente.valor);
    await this.prisma.texto.delete({ where: { clave } });
  }

  /**
   * Valores con tipo que también usa el servidor (pedidos.service cobra el envío con
   * estos mismos números) y el checkout. Si un valor guardado no se puede leer, cae al original.
   */
  async getAjustes() {
    const t = await this.getTextos();
    const numero = (clave: string) => {
      const n = Number(t[clave]);
      return Number.isFinite(n) && n >= 0 ? n : Number(CAMPO_POR_CLAVE.get(clave)!.porDefecto);
    };
    return {
      envioGratisDesde: numero('envio.gratisDesde'),
      costoEnvioZona: numero('envio.costoZona'),
      barriosZona: t['envio.barrios'].split('\n').map((b) => b.trim()).filter(Boolean),
    };
  }

  // ---- Páginas de texto

  async getPaginas() {
    const guardadas = new Map((await this.prisma.pagina.findMany()).map((p) => [p.slug, p]));
    return PAGINAS.map((p) => {
      const g = guardadas.get(p.slug);
      return { slug: p.slug, ruta: p.ruta, titulo: g?.titulo ?? p.titulo, cuerpo: g?.cuerpo ?? p.cuerpo, editada: Boolean(g) };
    });
  }

  async getPagina(slug: string) {
    const original = PAGINA_POR_SLUG.get(slug);
    if (!original) throw new NotFoundException();
    const g = await this.prisma.pagina.findUnique({ where: { slug } });
    return { slug, ruta: original.ruta, titulo: g?.titulo ?? original.titulo, cuerpo: g?.cuerpo ?? original.cuerpo, editada: Boolean(g) };
  }

  async guardarPagina(slug: string, dto: PaginaDto) {
    if (!PAGINA_POR_SLUG.has(slug)) throw new NotFoundException();
    await this.prisma.pagina.upsert({ where: { slug }, create: { slug, ...dto }, update: dto });
    return this.getPagina(slug);
  }

  /** Vuelve la página al texto con el que venía el sitio. */
  async restaurarPagina(slug: string) {
    if (!PAGINA_POR_SLUG.has(slug)) throw new NotFoundException();
    await this.prisma.pagina.deleteMany({ where: { slug } });
    return this.getPagina(slug);
  }

  private async textosGuardados() {
    return new Map((await this.prisma.texto.findMany()).map((t) => [t.clave, t.valor]));
  }

  private campoImagen(clave: string) {
    const campo = CAMPO_POR_CLAVE.get(clave);
    if (!campo || campo.tipo !== 'imagen') throw new NotFoundException();
    return campo;
  }

  /** Una lista queda sin espacios ni renglones vacíos; el resto solo se recorta. */
  private limpiar(tipo: string, valor: string) {
    if (tipo === 'lista') return valor.split('\n').map((l) => l.trim()).filter(Boolean).join('\n');
    return valor.trim();
  }

  getHeroImagenes() {
    return this.prisma.heroImagen.findMany({ orderBy: { orden: 'asc' } });
  }

  async agregarHeroImagen(file: Express.Multer.File, alt: string) {
    if (!file) throw new BadRequestException('Falta el archivo de la foto.');
    const { _max } = await this.prisma.heroImagen.aggregate({ _max: { orden: true } });
    const url = await this.storage.upload('hero', file);
    // max+1 y no count: después de borrar una del medio, count repetiría un orden.
    return this.prisma.heroImagen.create({ data: { url, alt, orden: (_max.orden ?? -1) + 1 } });
  }

  async eliminarHeroImagen(id: string) {
    const imagen = await this.prisma.heroImagen.findUnique({ where: { id } });
    if (!imagen) throw new NotFoundException();

    // No-op para las fotos iniciales (viven en web/public, no en el bucket).
    await this.storage.remove(imagen.url);
    await this.prisma.heroImagen.delete({ where: { id } });
  }

  async ordenarHeroImagenes(ids: string[]) {
    const existentes = await this.prisma.heroImagen.findMany({ select: { id: true } });
    const mismasFotos = ids.length === existentes.length && new Set(ids).size === ids.length && existentes.every((e) => ids.includes(e.id));
    if (!mismasFotos) throw new BadRequestException('La lista de fotos no coincide con las del carrusel.');

    await this.prisma.$transaction(
      ids.map((id, orden) => this.prisma.heroImagen.update({ where: { id }, data: { orden } }))
    );
    return this.getHeroImagenes();
  }
}
