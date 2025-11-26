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

@Injectable()
export class DevicesService {
  constructor(
    @InjectRepository(Device)
    private readonly devicesRepo: Repository<Device>,
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
