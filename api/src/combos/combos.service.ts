import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { SupabaseStorageService } from '../storage/supabase-storage.service.js';
import type { Prisma, Ritual } from '../generated/prisma/client.js';
import type { ComboDto } from './dto/combo.dto.js';

const CAMPOS_OBLIGATORIOS_ALTA = ['slug', 'nombre', 'bajada', 'porQueSePotencian', 'precio', 'productos'] as const;

@Injectable()
export class CombosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: SupabaseStorageService
  ) {}

  findAll() {
    return this.prisma.combo.findMany({
      include: {
        productos: { include: { producto: true } },
        imagenes: { orderBy: { orden: 'asc' } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async crear(dto: ComboDto) {
    const faltantes = CAMPOS_OBLIGATORIOS_ALTA.filter((campo) => dto[campo] === undefined);
    if (faltantes.length > 0) {
      throw new BadRequestException(`Faltan campos obligatorios: ${faltantes.join(', ')}.`);
    }
    const productos = await this.prisma.producto.findMany({ where: { slug: { in: dto.productos } } });
    const { slug, ritual, productos: _productos, ...resto } = dto;

    return this.prisma.combo.create({
      data: {
        ...resto,
        slug: slug!,
        ritual: (ritual ?? []) as Ritual[],
        productos: { create: productos.map((p) => ({ productoId: p.id })) },
      } as Prisma.ComboCreateInput,
      include: { productos: { include: { producto: true } } },
    });
  }

  async actualizar(slug: string, dto: ComboDto) {
    const combo = await this.prisma.combo.findUnique({ where: { slug } });
    if (!combo) throw new NotFoundException();

    const { slug: _slug, ritual, productos, ...resto } = dto;

    return this.prisma.$transaction(async (tx) => {
      if (productos !== undefined) {
        const filas = await tx.producto.findMany({ where: { slug: { in: productos } } });
        await tx.comboProducto.deleteMany({ where: { comboId: combo.id } });
        await tx.comboProducto.createMany({ data: filas.map((p) => ({ comboId: combo.id, productoId: p.id })) });
      }
      return tx.combo.update({
        where: { slug },
        data: { ...resto, ritual: ritual as Ritual[] | undefined },
        include: { productos: { include: { producto: true } } },
      });
    });
  }

  async agregarImagen(slug: string, file: Express.Multer.File, alt: string) {
    const combo = await this.prisma.combo.findUnique({ where: { slug }, include: { imagenes: true } });
    if (!combo) throw new NotFoundException();

    const url = await this.storage.upload(slug, file);
    return this.prisma.imagen.create({
      data: { url, alt, orden: combo.imagenes.length, comboId: combo.id },
    });
  }

  async eliminarImagen(slug: string, imagenId: string) {
    const imagen = await this.prisma.imagen.findFirst({ where: { id: imagenId, combo: { slug } } });
    if (!imagen) throw new NotFoundException();

    await this.storage.remove(imagen.url);
    await this.prisma.imagen.delete({ where: { id: imagenId } });
  }
}
