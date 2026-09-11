import { Module } from '@nestjs/common';
import { ContenidoController } from './contenido.controller.js';
import { ContenidoService } from './contenido.service.js';

@Module({
  controllers: [ContenidoController],
  providers: [ContenidoService],
})
export class ContenidoModule {}
