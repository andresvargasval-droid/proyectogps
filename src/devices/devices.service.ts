// src/devices/devices.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device, DeviceStatus } from './device.entity';
import { CreateDeviceDto } from './dto/create-device.dto';
import { MESSAGES } from '../common/constants/messages';
import { Vehicle, VehicleStatus } from '../vehicles/vehicle.entity';
import { TransferDeviceDto } from './dto/transfer-device.dto';

@Injectable()
export class DevicesService {
  constructor(
    @InjectRepository(Device)
    private readonly devicesRepo: Repository<Device>,

    @InjectRepository(Vehicle)
    private readonly vehiclesRepo: Repository<Vehicle>,
  ) {}

  // Crear dispositivo para el usuario autenticado
  async createForUser(dto: CreateDeviceDto, userId: string) {
    const device = this.devicesRepo.create({
      imei: dto.imei,
      model: dto.model,
      status: DeviceStatus.PENDING,
      user: { id: userId } as any,
      vehicleId: null,
    });

    return this.devicesRepo.save(device);
  }

  // Ver dispositivos del usuario
  async findForUser(userId: string) {
    return this.devicesRepo.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async findPending() {
    return this.devicesRepo.find({
      where: { status: DeviceStatus.PENDING },
      order: { createdAt: 'DESC' },
    });
  }

  async removeForUser(deviceId: string, userId: string) {
    const device = await this.devicesRepo.findOne({
      where: { id: deviceId, user: { id: userId } },
    });

    if (!device) {
      throw new NotFoundException(MESSAGES.DEVICES.NOT_FOUND);
    }

    if (device.vehicleId) {
      const vehicle = await this.vehiclesRepo.findOne({
        where: { id: device.vehicleId },
      });

      if (vehicle) {
        vehicle.deviceId = null;
        await this.vehiclesRepo.save(vehicle);
      }
    }

    await this.devicesRepo.remove(device);

    return device;
  }

  async transferToVehicle(
    userId: string,
    deviceId: string,
    dto: TransferDeviceDto,
  ) {
    if (!dto.vehicleId && !dto.newVehicle) {
      throw new BadRequestException(MESSAGES.VEHICLES.TRANSFER_TARGET_REQUIRED);
    }

    const device = await this.devicesRepo.findOne({
      where: { id: deviceId, user: { id: userId } },
    });

    if (!device) {
      throw new NotFoundException(MESSAGES.DEVICES.NOT_FOUND);
    }

    if (device.status === DeviceStatus.PENDING) {
      throw new BadRequestException(MESSAGES.DEVICES.NOT_APPROVED);
    }

    let targetVehicle: Vehicle;

    if (dto.vehicleId) {
      targetVehicle = await this.vehiclesRepo.findOne({
        where: { id: dto.vehicleId, user: { id: userId } },
      });

      if (!targetVehicle) {
        throw new NotFoundException(MESSAGES.VEHICLES.NOT_FOUND);
      }
    }

    if (dto.newVehicle) {
      const plateExists = await this.vehiclesRepo.findOne({
        where: { plate: dto.newVehicle.plate },
      });

      if (plateExists) {
        throw new BadRequestException(MESSAGES.VEHICLES.PLATE_EXISTS);
      }

      targetVehicle = this.vehiclesRepo.create({
        name: dto.newVehicle.name,
        plate: dto.newVehicle.plate,
        type: dto.newVehicle.type,
        user: { id: userId } as any,
        deviceId: null,
        status: VehicleStatus.AVAILABLE,
      });

      targetVehicle = await this.vehiclesRepo.save(targetVehicle);
    }

    if (!targetVehicle) {
      throw new BadRequestException(MESSAGES.VEHICLES.NOT_FOUND);
    }

    if (targetVehicle.deviceId && targetVehicle.deviceId !== device.id) {
      throw new BadRequestException(MESSAGES.VEHICLES.ALREADY_HAS_DEVICE);
    }

    if (device.vehicleId && device.vehicleId !== targetVehicle.id) {
      const previousVehicle = await this.vehiclesRepo.findOne({
        where: { id: device.vehicleId },
      });

      if (previousVehicle) {
        previousVehicle.deviceId = null;
        await this.vehiclesRepo.save(previousVehicle);
      }
    }

    targetVehicle.deviceId = device.id;
    await this.vehiclesRepo.save(targetVehicle);

    device.vehicleId = targetVehicle.id;
    device.status = DeviceStatus.ASSIGNED;
    await this.devicesRepo.save(device);

    return { device, vehicle: targetVehicle };
  }

  // Aprobar dispositivo (ejemplo para rol admin)
  async approveDevice(deviceId: string, adminUserId: string) {
    const device = await this.devicesRepo.findOne({
      where: { id: deviceId },
    });

    if (!device) {
      throw new NotFoundException(MESSAGES.DEVICES.NOT_FOUND);
    }

    // Si tu lógica exige que solo se pueda aprobar desde cierto estado:
    if (device.status !== DeviceStatus.PENDING) {
      throw new BadRequestException(MESSAGES.DEVICES.INVALID_STATUS);
    }

    device.status = DeviceStatus.APPROVED;

    return this.devicesRepo.save(device);
  }
}
