// export class CreateSucursaleDto {}
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateSucursaleDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100, { message: 'La longitud maxima es de 100 caracteres' })
  sucursal: string;

  @IsNumber()
  @IsNotEmpty()
  departamento_id: number;
}
