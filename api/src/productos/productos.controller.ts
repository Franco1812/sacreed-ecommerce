import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { InternalApiKeyGuard } from '../common/internal-api-key.guard.js';
import { ProductoDto } from './dto/producto.dto.js';
import { ProductosService } from './productos.service.js';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Get()
  findAll() {
    return this.productosService.findAll();
  }

  @Post()
  @UseGuards(InternalApiKeyGuard)
  crear(@Body() dto: ProductoDto) {
    return this.productosService.crear(dto);
  }

  @Patch(':slug')
  @UseGuards(InternalApiKeyGuard)
  actualizar(@Param('slug') slug: string, @Body() dto: ProductoDto) {
    return this.productosService.actualizar(slug, dto);
  }

  @Post(':slug/imagenes')
  @UseGuards(InternalApiKeyGuard)
  @UseInterceptors(FileInterceptor('file'))
  agregarImagen(
    @Param('slug') slug: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('alt') alt: string
  ) {
    return this.productosService.agregarImagen(slug, file, alt ?? '');
  }

  @Delete(':slug/imagenes/:id')
  @UseGuards(InternalApiKeyGuard)
  eliminarImagen(@Param('slug') slug: string, @Param('id') id: string) {
    return this.productosService.eliminarImagen(slug, id);
  }
}
