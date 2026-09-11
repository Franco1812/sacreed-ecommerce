import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { InternalApiKeyGuard } from '../common/internal-api-key.guard.js';
import { ContenidoService } from './contenido.service.js';
import { ContenidoHomeDto, LineaDto } from './dto/contenido.dto.js';

@Controller('contenido')
export class ContenidoController {
  constructor(private readonly contenidoService: ContenidoService) {}

  @Get('home')
  getHome() {
    return this.contenidoService.getHome();
  }

  @Patch('home')
  @UseGuards(InternalApiKeyGuard)
  actualizarHome(@Body() dto: ContenidoHomeDto) {
    return this.contenidoService.actualizarHome(dto);
  }

  @Get('lineas')
  getLineas() {
    return this.contenidoService.getLineas();
  }

  @Patch('lineas/:id')
  @UseGuards(InternalApiKeyGuard)
  actualizarLinea(@Param('id') id: string, @Body() dto: LineaDto) {
    return this.contenidoService.actualizarLinea(id, dto);
  }
}
