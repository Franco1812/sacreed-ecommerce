import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { InternalApiKeyGuard } from '../common/internal-api-key.guard.js';
import { ContenidoService } from './contenido.service.js';
import { ContenidoHomeDto, LineaDto, OrdenHeroImagenesDto } from './dto/contenido.dto.js';

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

  @Get('hero-imagenes')
  getHeroImagenes() {
    return this.contenidoService.getHeroImagenes();
  }

  @Post('hero-imagenes')
  @UseGuards(InternalApiKeyGuard)
  @UseInterceptors(FileInterceptor('file'))
  agregarHeroImagen(@UploadedFile() file: Express.Multer.File, @Body('alt') alt: string) {
    return this.contenidoService.agregarHeroImagen(file, alt ?? '');
  }

  // Va antes que ':id' para que "orden" no se lea como un id.
  @Patch('hero-imagenes/orden')
  @UseGuards(InternalApiKeyGuard)
  ordenarHeroImagenes(@Body() dto: OrdenHeroImagenesDto) {
    return this.contenidoService.ordenarHeroImagenes(dto.ids);
  }

  @Delete('hero-imagenes/:id')
  @UseGuards(InternalApiKeyGuard)
  eliminarHeroImagen(@Param('id') id: string) {
    return this.contenidoService.eliminarHeroImagen(id);
  }
}
