import { Module } from '@nestjs/common';
import { ContenidoModule } from '../contenido/contenido.module.js';
import { PedidosController } from './pedidos.controller.js';
import { PedidosService } from './pedidos.service.js';

@Module({
  imports: [ContenidoModule],
  controllers: [PedidosController],
  providers: [PedidosService],
})
export class PedidosModule {}
