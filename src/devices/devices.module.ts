// src/devices/devices.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from './device.entity';
import { DevicesService } from './devices.service';
import { DevicesController } from './devices.controller';
import { Vehicle } from '../vehicles/vehicle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Device, Vehicle])],
  providers: [DevicesService],
  controllers: [DevicesController],
  exports: [DevicesService],
})
export class DevicesModule {}
