import { IsString } from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  name: string;

  @IsString()
  plate: string;

  @IsString()
  type: string;
}
