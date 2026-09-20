import { ArrayNotEmpty, IsArray, IsInt, IsOptional, IsString, Min } from 'class-validator';

/** Todo opcional: el admin manda solo los campos que tocó. */
export class ContenidoHomeDto {
  @IsOptional() @IsString() heroEyebrow?: string;
  @IsOptional() @IsString() heroTitulo?: string;
  @IsOptional() @IsString() heroTituloEnfasis?: string;
  @IsOptional() @IsString() heroBajada?: string;
  @IsOptional() @IsString() heroCta1Label?: string;
  @IsOptional() @IsString() heroCta1Href?: string;
  @IsOptional() @IsString() heroCta2Label?: string;
  @IsOptional() @IsString() heroCta2Href?: string;
  @IsOptional() @IsString() beneficiosEyebrow?: string;
  @IsOptional() @IsString() beneficiosTitulo?: string;
  @IsOptional() @IsString() masVendidosEyebrow?: string;
  @IsOptional() @IsString() masVendidosTitulo?: string;
}

export class LineaDto {
  @IsOptional() @IsString() nombre?: string;
  @IsOptional() @IsString() texto?: string;
  @IsOptional() @IsInt() @Min(0) orden?: number;
}

/** Orden completo del carrusel: todos los ids de las fotos, en el orden en que deben mostrarse. */
export class OrdenHeroImagenesDto {
  @IsArray() @ArrayNotEmpty() @IsString({ each: true }) ids!: string[];
}

/**
 * Lista completa de "Los más vendidos", en el orden en que se muestra. `vendidos`
 * es el número opcional del "+N vendidos" de la tarjeta (null/ausente = sin número).
 * Los items se validan a mano en el servicio (ValidationPipe no baja a objetos anidados sin class-transformer).
 */
export class MasVendidosDto {
  @IsArray() items!: { slug: string; vendidos?: number | null }[];
}
