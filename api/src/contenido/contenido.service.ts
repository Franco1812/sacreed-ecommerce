import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { LineaBeneficio } from '../generated/prisma/client.js';
import { HOME_DEFAULT, LINEAS_DEFAULT } from './contenido.defaults.js';
import type { ContenidoHomeDto, LineaDto } from './dto/contenido.dto.js';

const LINEAS_VALIDAS = new Set<string>(LINEAS_DEFAULT.map((l) => l.id));

@Injectable()
export class ContenidoService {
  constructor(private readonly prisma: PrismaService) {}

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
}
