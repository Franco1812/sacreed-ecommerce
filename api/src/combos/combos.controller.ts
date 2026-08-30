import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { InternalApiKeyGuard } from '../common/internal-api-key.guard.js';
import { ComboDto } from './dto/combo.dto.js';
import { CombosService } from './combos.service.js';

@Controller('combos')
export class CombosController {
  constructor(private readonly combosService: CombosService) {}

  @Get()
  findAll() {
    return this.combosService.findAll();
  }

  @Post()
  @UseGuards(InternalApiKeyGuard)
  crear(@Body() dto: ComboDto) {
    return this.combosService.crear(dto);
  }

  @Patch(':slug')
  @UseGuards(InternalApiKeyGuard)
  actualizar(@Param('slug') slug: string, @Body() dto: ComboDto) {
    return this.combosService.actualizar(slug, dto);
  }

  @Post(':slug/imagenes')
  @UseGuards(InternalApiKeyGuard)
  @UseInterceptors(FileInterceptor('file'))
  agregarImagen(
    @Param('slug') slug: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('alt') alt: string
  ) {
    return this.combosService.agregarImagen(slug, file, alt ?? '');
  }

  @Delete(':slug/imagenes/:id')
  @UseGuards(InternalApiKeyGuard)
  eliminarImagen(@Param('slug') slug: string, @Param('id') id: string) {
    return this.combosService.eliminarImagen(slug, id);
  }
}
