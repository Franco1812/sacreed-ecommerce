import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class PedidoItemDto {
  @IsString()
  slug!: string;

  @IsIn(['producto', 'combo'])
  tipo!: 'producto' | 'combo';

  @IsInt()
  @Min(1)
  cantidad!: number;
}

export class CrearPedidoDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PedidoItemDto)
  items!: PedidoItemDto[];

  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @IsString()
  @IsNotEmpty()
  apellido!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  telefono!: string;

  @IsOptional()
  @IsString()
  dni?: string;

  @IsIn(['ENVIO_DOMICILIO', 'RETIRO'])
  metodoEntrega!: 'ENVIO_DOMICILIO' | 'RETIRO';

  @IsOptional()
  @IsString()
  calle?: string;

  @IsOptional()
  @IsString()
  numeroDom?: string;

  @IsOptional()
  @IsString()
  piso?: string;

  @IsOptional()
  @IsString()
  localidad?: string;

  @IsOptional()
  @IsString()
  provincia?: string;

  @IsOptional()
  @IsString()
  codigoPostal?: string;

  @IsOptional()
  @IsString()
  barrioZona?: string;

  @IsIn(['TRANSFERENCIA', 'EFECTIVO'])
  metodoPago!: 'TRANSFERENCIA' | 'EFECTIVO';

  @IsOptional()
  @IsString()
  notas?: string;
}
