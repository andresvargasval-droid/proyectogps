// src/vehicles/vehicles.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { VehiclesService } from './vehicles.service';
import { GetUser } from '../auth/get-user.decorator';
import { AssignDeviceDto } from './dto/assign-device.dto';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { ok } from '../common/utils/response.util';
import { ApiResponse } from '../common/dto/api-response.dto';
import { Vehicle } from './vehicle.entity';
import { MESSAGES } from '../common/constants/messages';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createVehicle(
    @Body() dto: CreateVehicleDto,
    @GetUser() user: any,
  ): Promise<ApiResponse<Vehicle>> {
    const vehicle = await this.vehiclesService.createForUser(dto, user.userId);

    return ok(MESSAGES.VEHICLES.CREATE_SUCCESS, vehicle);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':vehicleId')
  async deleteVehicle(
    @Param('vehicleId') vehicleId: string,
    @GetUser() user: any,
  ): Promise<ApiResponse<Vehicle>> {
    const vehicle = await this.vehiclesService.removeForUser(
      vehicleId,
      user.userId,
    );

    return ok(MESSAGES.VEHICLES.DELETE_SUCCESS, vehicle);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('mine')
  async getMyVehicles(
    @GetUser() user: any,
  ): Promise<ApiResponse<Vehicle[]>> {
    const vehicles = await this.vehiclesService.findForUser(user.userId);

    return ok(MESSAGES.VEHICLES.LIST_SUCCESS, vehicles);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':vehicleId/assign-device')
  async assignDevice(
    @Param('vehicleId') vehicleId: string,
    @Body() dto: AssignDeviceDto,
    @GetUser() user: any,
  ): Promise<ApiResponse<{ vehicle: Vehicle; device: any }>> {
    const result = await this.vehiclesService.assignDeviceToVehicle(
      user.userId,
      vehicleId,
      dto.deviceId,
    );

    return ok(MESSAGES.VEHICLES.ASSIGN_DEVICE_SUCCESS, {
      vehicle: result.vehicle,
      device: result.device,
    });
  }
}
