import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { SupabaseStorageService } from '../storage/supabase-storage.service.js';
import type { EstadoOrden, MetodoEntrega, MetodoPago } from '../generated/prisma/client.js';
import { ContenidoService } from '../contenido/contenido.service.js';
import type { CrearPedidoDto } from './dto/crear-pedido.dto.js';

export type CrearPedidoResult = { ok: true; numero: number } | { ok: false; error: string };

@Injectable()
export class PedidosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: SupabaseStorageService,
    private readonly contenido: ContenidoService
  ) {}

  /**
   * Lee precio/stock DIRECTO de la base (nunca confiar en lo que mande el
   * cliente para el precio que se cobra). No descuenta stock acá: el pedido
   * queda PENDIENTE_PAGO y el pago se confirma a mano (todavía no hay admin).
   * Descontar stock recién en la confirmación evita que un carrito abandonado
   * bloquee stock real.
   */
  async crearPedido(input: CrearPedidoDto): Promise<CrearPedidoResult> {
    if (
      input.metodoEntrega === 'ENVIO_DOMICILIO' &&
      (!input.calle || !input.numeroDom || !input.localidad || !input.provincia || !input.codigoPostal)
    ) {
      return { ok: false, error: 'Completá la dirección de envío.' };
    }

    const productoSlugs = input.items.filter((i) => i.tipo === 'producto').map((i) => i.slug);
    const comboSlugs = input.items.filter((i) => i.tipo === 'combo').map((i) => i.slug);

    const [productos, combos] = await Promise.all([
      this.prisma.producto.findMany({ where: { slug: { in: productoSlugs } } }),
      this.prisma.combo.findMany({ where: { slug: { in: comboSlugs } } }),
    ]);

    const orderItemsData: { productoId?: string; comboId?: string; nombre: string; precioUnitario: number; cantidad: number }[] = [];
    let subtotal = 0;

    for (const item of input.items) {
      if (item.tipo === 'producto') {
        const p = productos.find((x) => x.slug === item.slug);
        if (!p) return { ok: false, error: `Un producto de tu carrito ya no está disponible.` };
        if (p.stock < item.cantidad) return { ok: false, error: `"${p.nombre}" no tiene stock suficiente (quedan ${p.stock}).` };
        orderItemsData.push({ productoId: p.id, nombre: p.nombre, precioUnitario: p.precio, cantidad: item.cantidad });
        subtotal += p.precio * item.cantidad;
      } else {
        const c = combos.find((x) => x.slug === item.slug);
        if (!c) return { ok: false, error: `Un combo de tu carrito ya no está disponible.` };
        if (c.stock < item.cantidad) return { ok: false, error: `"${c.nombre}" no tiene stock suficiente (quedan ${c.stock}).` };
        orderItemsData.push({ comboId: c.id, nombre: c.nombre, precioUnitario: c.precio, cantidad: item.cantidad });
        subtotal += c.precio * item.cantidad;
      }
    }

    // Monto de envío gratis, costo y barrios los edita Cintia desde el admin (Envíos y pagos).
    const ajustes = await this.contenido.getAjustes();
    let costoEnvio = 0;
    if (input.metodoEntrega === 'ENVIO_DOMICILIO' && subtotal < ajustes.envioGratisDesde) {
      const enZona = ajustes.barriosZona.includes(input.barrioZona ?? '');
      // fuera de la zona de reparto: costo pendiente de cotización real por CP (§6.4.2) — se aclara en la confirmación.
      if (enZona) costoEnvio = ajustes.costoEnvioZona;
    }

    const order = await this.prisma.order.create({
      data: {
        estado: 'PENDIENTE_PAGO',
        metodoEntrega: input.metodoEntrega as MetodoEntrega,
        metodoPago: input.metodoPago as MetodoPago,
        nombre: input.nombre,
        apellido: input.apellido,
        email: input.email,
        telefono: input.telefono,
        dni: input.dni || null,
        calle: input.calle || null,
        numeroDom: input.numeroDom || null,
        piso: input.piso || null,
        localidad: input.localidad || null,
        provincia: input.provincia || null,
        codigoPostal: input.codigoPostal || null,
        barrioZona: input.barrioZona || null,
        notas: input.notas || null,
        subtotal,
        costoEnvio,
        total: subtotal + costoEnvio,
        items: { create: orderItemsData },
      },
    });

    return { ok: true, numero: order.numero };
  }

  async findByNumero(numero: number) {
    const pedido = await this.prisma.order.findUnique({
      where: { numero },
      include: { items: true, imagenes: true },
    });
    if (!pedido) throw new NotFoundException();
    return pedido;
  }

  findAll() {
    return this.prisma.order.findMany({
      orderBy: { numero: 'desc' },
      include: { items: true },
    });
  }

  /**
   * Solo la transición PENDIENTE_PAGO → PAGO_CONFIRMADO descuenta stock (es
   * cuando Cintia confirmó que el pago llegó de verdad). El resto de las
   * transiciones de estado no tocan stock. No restaura stock si un pedido ya
   * confirmado se cancela después — fuera de alcance de este v1 a propósito.
   */
  async actualizarEstado(numero: number, estado: EstadoOrden) {
    const pedido = await this.prisma.order.findUnique({ where: { numero }, include: { items: true } });
    if (!pedido) throw new NotFoundException();

    const debeDescontarStock = pedido.estado === 'PENDIENTE_PAGO' && estado === 'PAGO_CONFIRMADO';

    return this.prisma.$transaction(async (tx) => {
      if (debeDescontarStock) {
        for (const item of pedido.items) {
          if (item.productoId) {
            await tx.producto.update({ where: { id: item.productoId }, data: { stock: { decrement: item.cantidad } } });
          } else if (item.comboId) {
            await tx.combo.update({ where: { id: item.comboId }, data: { stock: { decrement: item.cantidad } } });
          }
        }
      }
      return tx.order.update({ where: { numero }, data: { estado }, include: { items: true } });
    });
  }

  async agregarComprobante(numero: number, file: Express.Multer.File) {
    const pedido = await this.prisma.order.findUnique({ where: { numero } });
    if (!pedido) throw new NotFoundException();

    const url = await this.storage.upload(`pedido-${numero}`, file);
    return this.prisma.imagen.create({
      data: { url, alt: 'Comprobante de pago', orderId: pedido.id },
    });
  }

  async eliminarComprobante(numero: number, imagenId: string) {
    const imagen = await this.prisma.imagen.findFirst({ where: { id: imagenId, order: { numero } } });
    if (!imagen) throw new NotFoundException();

    await this.storage.remove(imagen.url);
    await this.prisma.imagen.delete({ where: { id: imagenId } });
  }
}
