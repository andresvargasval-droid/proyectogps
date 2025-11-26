// src/devices/devices.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  UseGuards,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DevicesService } from './devices.service';
import { GetUser } from '../auth/get-user.decorator';
import { ok } from '../common/utils/response.util';
import { ApiResponse } from '../common/dto/api-response.dto';
import { MESSAGES } from '../common/constants/messages';
import { Device } from './device.entity';
import { CreateDeviceDto } from './dto/create-device.dto';
import { TransferDeviceDto } from './dto/transfer-device.dto';

@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('request')
  async requestDevice(
    @Body() dto: CreateDeviceDto,
    @GetUser() user: any,
  ): Promise<ApiResponse<Device>> {
    const device = await this.devicesService.createForUser(dto, user.userId);

    return ok(MESSAGES.DEVICES.CREATE_SUCCESS, device);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('mine')
  async getMyDevices(
    @GetUser() user: any,
  ): Promise<ApiResponse<Device[]>> {
    const devices = await this.devicesService.findForUser(user.userId);

    return ok(MESSAGES.DEVICES.LIST_SUCCESS, devices);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('pending')
  async getPendingDevices(): Promise<ApiResponse<Device[]>> {
    const devices = await this.devicesService.findPending();

    return ok(MESSAGES.DEVICES.LIST_SUCCESS, devices);
  }

  // Ejemplo de aprobación (según tu lógica de roles)
  @UseGuards(AuthGuard('jwt'))
  @Post(':deviceId/approve')
  async approveDevice(
    @Param('deviceId') deviceId: string,
    @GetUser() user: any,
  ): Promise<ApiResponse<Device>> {
    const device = await this.devicesService.approveDevice(
      deviceId,
      user.userId,
    );

    return ok(MESSAGES.DEVICES.APPROVE_SUCCESS, device);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':deviceId')
  async deleteDevice(
    @Param('deviceId') deviceId: string,
    @GetUser() user: any,
  ): Promise<ApiResponse<Device>> {
    const device = await this.devicesService.removeForUser(
      deviceId,
      user.userId,
    );

    return ok(MESSAGES.DEVICES.DELETE_SUCCESS, device);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':deviceId/transfer')
  async transferDevice(
    @Param('deviceId') deviceId: string,
    @Body() dto: TransferDeviceDto,
    @GetUser() user: any,
  ): Promise<ApiResponse<{ device: Device; vehicle: any }>> {
    const result = await this.devicesService.transferToVehicle(
      user.userId,
      deviceId,
      dto,
    );

    return ok(MESSAGES.VEHICLES.TRANSFER_SUCCESS, result);
  }
}
