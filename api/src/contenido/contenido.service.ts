import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { SupabaseStorageService } from '../storage/supabase-storage.service.js';
import type { LineaBeneficio } from '../generated/prisma/client.js';
import { HOME_DEFAULT, LINEAS_DEFAULT } from './contenido.defaults.js';
import type { ContenidoHomeDto, LineaDto } from './dto/contenido.dto.js';

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
