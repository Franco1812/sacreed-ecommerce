import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import type { Request } from 'express';

/**
 * Protege los endpoints que solo debe poder llamar el admin de web/ (nunca el
 * storefront público). Necesario porque en producción api/ es un servicio de
 * Railway con su propia URL — sin este guard, cualquiera que la encuentre
 * podría listar pedidos (PII de clientes) o cambiar precios/stock sin pasar
 * por el login del admin.
 */
@Injectable()
export class InternalApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const key = request.headers['x-internal-api-key'];
    if (!process.env.INTERNAL_API_KEY || key !== process.env.INTERNAL_API_KEY) {
      throw new ForbiddenException();
    }
    return true;
  }
}
