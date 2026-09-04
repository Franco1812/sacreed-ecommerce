import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { InternalApiKeyGuard } from '../common/internal-api-key.guard.js';
import { ActualizarEstadoDto } from './dto/actualizar-estado.dto.js';
import { CrearPedidoDto } from './dto/crear-pedido.dto.js';
import { PedidosService } from './pedidos.service.js';

@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Post()
  crear(@Body() dto: CrearPedidoDto) {
    return this.pedidosService.crearPedido(dto);
  }

  @Get()
  @UseGuards(InternalApiKeyGuard)
  findAll() {
    return this.pedidosService.findAll();
  }

  @Get(':numero')
  findByNumero(@Param('numero', ParseIntPipe) numero: number) {
    return this.pedidosService.findByNumero(numero);
  }

  @Patch(':numero/estado')
  @UseGuards(InternalApiKeyGuard)
  actualizarEstado(@Param('numero', ParseIntPipe) numero: number, @Body() dto: ActualizarEstadoDto) {
    return this.pedidosService.actualizarEstado(numero, dto.estado);
  }

  @Post(':numero/imagenes')
  @UseGuards(InternalApiKeyGuard)
  @UseInterceptors(FileInterceptor('file'))
  agregarComprobante(@Param('numero', ParseIntPipe) numero: number, @UploadedFile() file: Express.Multer.File) {
    return this.pedidosService.agregarComprobante(numero, file);
  }

  @Delete(':numero/imagenes/:id')
  @UseGuards(InternalApiKeyGuard)
  eliminarComprobante(@Param('numero', ParseIntPipe) numero: number, @Param('id') id: string) {
    return this.pedidosService.eliminarComprobante(numero, id);
  }
}
