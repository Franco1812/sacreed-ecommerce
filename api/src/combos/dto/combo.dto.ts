import { IsArray, IsBoolean, IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

const RITUALES = ['AM', 'PM'];

/**
 * Cubre alta y edición — ver el mismo patrón en productos/dto/producto.dto.ts.
 * `productos` es la lista de slugs de producto que integran el combo; al
 * editar, reemplaza el set completo (ver ComboService.actualizar).
 */
export class ComboDto {
  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  bajada?: string;

  @IsOptional()
  @IsArray()
  @IsIn(RITUALES, { each: true })
  ritual?: string[];

  @IsOptional()
  @IsString()
  porQueSePotencian?: string;

  @IsOptional()
  @IsBoolean()
  copyAprobado?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  precio?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  productos?: string[];
}
