import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { InternalApiKeyGuard } from '../common/internal-api-key.guard.js';
import { ContenidoService } from './contenido.service.js';
import { ContenidoHomeDto, LineaDto, MasVendidosDto, OrdenHeroImagenesDto, PaginaDto, TextosDto } from './dto/contenido.dto.js';

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

  @Get('mas-vendidos')
  getMasVendidos() {
    return this.contenidoService.getMasVendidos();
  }

  @Put('mas-vendidos')
  @UseGuards(InternalApiKeyGuard)
  reemplazarMasVendidos(@Body() dto: MasVendidosDto) {
    return this.contenidoService.reemplazarMasVendidos(dto);
  }

  @Get('textos')
  getTextos() {
    return this.contenidoService.getTextos();
  }

  @Get('textos/campos')
  getCampos() {
    return this.contenidoService.getCampos();
  }

  @Put('textos')
  @UseGuards(InternalApiKeyGuard)
  actualizarTextos(@Body() dto: TextosDto) {
    return this.contenidoService.actualizarTextos(dto.valores);
  }

  @Post('textos/imagen/:clave')
  @UseGuards(InternalApiKeyGuard)
  @UseInterceptors(FileInterceptor('file'))
  subirImagenTexto(@Param('clave') clave: string, @UploadedFile() file: Express.Multer.File) {
    return this.contenidoService.subirImagenTexto(clave, file);
  }

  @Delete('textos/imagen/:clave')
  @UseGuards(InternalApiKeyGuard)
  quitarImagenTexto(@Param('clave') clave: string) {
    return this.contenidoService.quitarImagenTexto(clave);
  }

  @Get('ajustes')
  getAjustes() {
    return this.contenidoService.getAjustes();
  }

  @Get('paginas')
  getPaginas() {
    return this.contenidoService.getPaginas();
  }

  @Get('paginas/:slug')
  getPagina(@Param('slug') slug: string) {
    return this.contenidoService.getPagina(slug);
  }

  @Put('paginas/:slug')
  @UseGuards(InternalApiKeyGuard)
  guardarPagina(@Param('slug') slug: string, @Body() dto: PaginaDto) {
    return this.contenidoService.guardarPagina(slug, dto);
  }

  @Delete('paginas/:slug')
  @UseGuards(InternalApiKeyGuard)
  restaurarPagina(@Param('slug') slug: string) {
    return this.contenidoService.restaurarPagina(slug);
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
