import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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

  /**
   * Borra el producto con sus fotos (filas y archivos) y lo saca de "Más vendidos". Los pedidos
   * viejos no cambian: cada ítem guarda su propio nombre y precio. Si integra algún combo no se
   * borra, para no dejar un combo incompleto sin que nadie lo note.
   */
  async eliminar(slug: string) {
    const producto = await this.prisma.producto.findUnique({
      where: { slug },
      include: { imagenes: true, comboItems: { include: { combo: { select: { nombre: true } } } } },
    });
    if (!producto) throw new NotFoundException();

    if (producto.comboItems.length > 0) {
      const combos = producto.comboItems.map((ci) => `«${ci.combo.nombre}»`).join(', ');
      throw new ConflictException(`Este producto forma parte de ${combos}. Sacalo de ahí primero (Admin → Combos) y después eliminalo.`);
    }

    await this.prisma.producto.delete({ where: { slug } });
    // Después de borrar la fila: si falla el Storage queda un archivo huérfano, no un producto con fotos rotas.
    await Promise.allSettled(producto.imagenes.map((img) => this.storage.remove(img.url)));
  }

  async agregarImagen(slug: string, file: Express.Multer.File, alt: string) {
    const producto = await this.prisma.producto.findUnique({ where: { slug } });
    if (!producto) throw new NotFoundException();

    const { _max } = await this.prisma.imagen.aggregate({ where: { productoId: producto.id }, _max: { orden: true } });
    const url = await this.storage.upload(slug, file);
    // max+1 y no count: después de borrar una del medio, count repetiría un orden.
    return this.prisma.imagen.create({
      data: { url, alt, orden: (_max.orden ?? -1) + 1, productoId: producto.id },
    });
  }

  async ordenarImagenes(slug: string, ids: string[]) {
    const existentes = await this.prisma.imagen.findMany({ where: { producto: { slug } }, select: { id: true } });
    const mismasFotos = ids.length === existentes.length && new Set(ids).size === ids.length && existentes.every((e) => ids.includes(e.id));
    if (!mismasFotos) throw new BadRequestException('La lista de fotos no coincide con las del producto.');

    await this.prisma.$transaction(
      ids.map((id, orden) => this.prisma.imagen.update({ where: { id }, data: { orden } }))
    );
    return this.prisma.imagen.findMany({ where: { producto: { slug } }, orderBy: { orden: 'asc' } });
  }

  async eliminarImagen(slug: string, imagenId: string) {
    const imagen = await this.prisma.imagen.findFirst({ where: { id: imagenId, producto: { slug } } });
    if (!imagen) throw new NotFoundException();

    await this.storage.remove(imagen.url);
    await this.prisma.imagen.delete({ where: { id: imagenId } });
  }
}
