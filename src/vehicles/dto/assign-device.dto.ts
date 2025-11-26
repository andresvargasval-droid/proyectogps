// src/vehicles/dto/assign-device.dto.ts
import { IsUUID } from 'class-validator';

export class AssignDeviceDto {
  @IsUUID()
  deviceId: string;
}
