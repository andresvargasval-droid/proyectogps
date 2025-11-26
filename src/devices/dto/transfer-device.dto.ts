import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreateVehicleDto } from '../../vehicles/dto/create-vehicle.dto';

export class TransferDeviceDto {
  @IsOptional()
  @IsString()
  vehicleId?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateVehicleDto)
  newVehicle?: CreateVehicleDto;
}
