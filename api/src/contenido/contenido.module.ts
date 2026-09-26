import { Module } from '@nestjs/common';
import { ContenidoController } from './contenido.controller.js';
import { ContenidoService } from './contenido.service.js';

@Module({
  controllers: [ContenidoController],
  providers: [ContenidoService],
  // PedidosService cobra el envío con los valores que Cintia edita (getAjustes).
  exports: [ContenidoService],
})
export class ContenidoModule {}
