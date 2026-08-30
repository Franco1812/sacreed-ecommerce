import { IsInt, IsOptional, Min } from 'class-validator';

export class ActualizarComboDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  precio?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;
}
