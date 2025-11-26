// src/devices/dto/create-device.dto.ts
import { IsString } from 'class-validator';

export class CreateDeviceDto {
  @IsString()
  serial: string;

  @IsString()
  name: string;
}
