import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

const LINEAS = ['FOCO_VITALIDAD', 'LONGEVIDAD_GLOW', 'SALUD_INTESTINAL', 'CALMA_ALQUIMICA'];
const RITUALES = ['AM', 'PM'];

export class FormulaItemDto {
  @IsString()
  ingrediente!: string;

  @IsString()
  texto!: string;
}

/**
 * Cubre alta y edición (todos los campos opcionales acá; `ProductosService.crear`
 * valida a mano el puñado de campos realmente obligatorios para crear una fila).
 * `slug` solo se usa en alta — es el identificador estable, no se toca en un PATCH.
 */
export class ProductoDto {
  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  formulaSubtitulo?: string;

  @IsOptional()
  @IsIn(LINEAS)
  linea?: string;

  @IsOptional()
  @IsArray()
  @IsIn(RITUALES, { each: true })
  ritual?: string[];

  @IsOptional()
  @IsInt()
  orden?: number;

  @IsOptional()
  @IsString()
  momentoSugerido?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FormulaItemDto)
  laFormula?: FormulaItemDto[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  beneficios?: string[];

  @IsOptional()
  @IsString()
  ritualDeUso?: string;

  @IsOptional()
  @IsString()
  ingredientes?: string;

  @IsOptional()
  @IsString()
  notaDePureza?: string;

  @IsOptional()
  @IsString()
  origen?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  precio?: number;

  @IsOptional()
  @IsString()
  formato?: string;

  @IsOptional()
  @IsNumber()
  pesoNetoGramos?: number;

  @IsOptional()
  @IsNumber()
  paqueteAltoCm?: number;

  @IsOptional()
  @IsNumber()
  paqueteAnchoCm?: number;

  @IsOptional()
  @IsNumber()
  paqueteProfundidadCm?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsString()
  destacado?: string;

  @IsOptional()
  @IsBoolean()
  nombrePendiente?: boolean;

  @IsOptional()
  @IsString()
  seoTitulo?: string;

  @IsOptional()
  @IsString()
  seoDescripcion?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  vendidos?: number;
}
