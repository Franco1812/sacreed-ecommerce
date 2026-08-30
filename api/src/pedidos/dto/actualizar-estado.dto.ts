import { IsIn } from 'class-validator';
import { EstadoOrden } from '../../generated/prisma/client.js';

const ESTADOS = Object.values(EstadoOrden);

export class ActualizarEstadoDto {
  @IsIn(ESTADOS)
  estado!: EstadoOrden;
}
