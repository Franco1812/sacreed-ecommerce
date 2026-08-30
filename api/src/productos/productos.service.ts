import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { SupabaseStorageService } from '../storage/supabase-storage.service.js';
import type { LineaBeneficio, Prisma, Ritual } from '../generated/prisma/client.js';
import type { ProductoDto } from './dto/producto.dto.js';

const CAMPOS_OBLIGATORIOS_ALTA = ['slug', 'nombre', 'linea', 'orden', 'descripcion', 'ritualDeUso', 'precio'] as const;

@Injectable()
export class ProductosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: SupabaseStorageService
  ) {}

  findAll() {
    return this.prisma.producto.findMany({
      orderBy: { orden: 'asc' },
      include: { imagenes: { orderBy: { orden: 'asc' } } },
    });
  }

  crear(dto: ProductoDto) {
    const faltantes = CAMPOS_OBLIGATORIOS_ALTA.filter((campo) => dto[campo] === undefined);
    if (faltantes.length > 0) {
      throw new BadRequestException(`Faltan campos obligatorios: ${faltantes.join(', ')}.`);
    }
    const { slug, ritual, laFormula, beneficios, ...resto } = dto;
    return this.prisma.producto.create({
      data: {
        ...resto,
        slug: slug!,
        linea: dto.linea as LineaBeneficio,
        ritual: (ritual ?? []) as Ritual[],
        laFormula: (laFormula as unknown as Prisma.InputJsonValue) ?? undefined,
        beneficios: beneficios ?? [],
      } as Prisma.ProductoCreateInput,
    });
  }

  async actualizar(slug: string, dto: ProductoDto) {
    const existe = await this.prisma.producto.findUnique({ where: { slug } });
    if (!existe) throw new NotFoundException();

    const { slug: _slug, ritual, laFormula, ...resto } = dto;
    return this.prisma.producto.update({
      where: { slug },
      data: {
        ...resto,
        linea: dto.linea as LineaBeneficio | undefined,
        ritual: ritual as Ritual[] | undefined,
        laFormula: laFormula !== undefined ? (laFormula as unknown as Prisma.InputJsonValue) : undefined,
      },
    });
  }

  async agregarImagen(slug: string, file: Express.Multer.File, alt: string) {
    const producto = await this.prisma.producto.findUnique({ where: { slug }, include: { imagenes: true } });
    if (!producto) throw new NotFoundException();

    const url = await this.storage.upload(slug, file);
    return this.prisma.imagen.create({
      data: { url, alt, orden: producto.imagenes.length, productoId: producto.id },
    });
  }

  async eliminarImagen(slug: string, imagenId: string) {
    const imagen = await this.prisma.imagen.findFirst({ where: { id: imagenId, producto: { slug } } });
    if (!imagen) throw new NotFoundException();

    await this.storage.remove(imagen.url);
    await this.prisma.imagen.delete({ where: { id: imagenId } });
  }
}
