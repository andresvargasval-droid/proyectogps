// src/vehicles/vehicles.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle, VehicleStatus } from './vehicle.entity';
import { Device, DeviceStatus } from '../devices/device.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { MESSAGES } from '../common/constants/messages';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehiclesRepo: Repository<Vehicle>,

    @InjectRepository(Device)
    private readonly devicesRepo: Repository<Device>,
  ) {}

  // Crear vehículo para el usuario autenticado
  async createForUser(dto: CreateVehicleDto, userId: string) {
    const vehicle = this.vehiclesRepo.create({
      name: dto.name,
      plate: dto.plate,
      type: dto.type,
      user: { id: userId } as any,
      deviceId: null,
      status: VehicleStatus.AVAILABLE,
    });

    return this.vehiclesRepo.save(vehicle);
  }

  // Ver vehículos del usuario
  async findForUser(userId: string) {
    return this.vehiclesRepo.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  // Asignar dispositivo a vehículo
  async assignDeviceToVehicle(
    userId: string,
    vehicleId: string,
    deviceId: string,
  ) {
    const vehicle = await this.vehiclesRepo.findOne({
      where: { id: vehicleId, user: { id: userId } },
    });

    if (!vehicle) {
      throw new NotFoundException(MESSAGES.VEHICLES.NOT_FOUND);
    }

    if (vehicle.deviceId) {
      throw new BadRequestException(MESSAGES.VEHICLES.ALREADY_HAS_DEVICE);
    }

    const device = await this.devicesRepo.findOne({
      where: { id: deviceId, user: { id: userId } },
    });

    if (!device) {
      throw new NotFoundException(MESSAGES.DEVICES.NOT_FOUND);
    }

    if (device.status !== DeviceStatus.APPROVED) {
      throw new BadRequestException(MESSAGES.DEVICES.NOT_APPROVED);
    }

    device.status = DeviceStatus.ASSIGNED;
    await this.devicesRepo.save(device);

    vehicle.deviceId = device.id;
    await this.vehiclesRepo.save(vehicle);

    return {
      vehicle,
      device,
    };
  }
}
