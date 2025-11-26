// src/auth/auth.controller.ts
import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ok } from '../common/utils/response.util';
import { ApiResponse } from '../common/dto/api-response.dto';
import { MESSAGES } from '../common/constants/messages';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() dto: RegisterDto,
  ): Promise<ApiResponse<any>> {
    const user = await this.authService.register(dto);

    return ok(MESSAGES.AUTH.REGISTER_SUCCESS, {
      user,
    });
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
  ): Promise<ApiResponse<{ accessToken: string }>> {
    const { accessToken } = await this.authService.login(dto);

    return ok(MESSAGES.AUTH.LOGIN_SUCCESS, { accessToken });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getProfile(
    @GetUser() user: any,
  ): Promise<ApiResponse<any>> {
    const profile = await this.authService.getProfile(user.userId);

    return ok(MESSAGES.AUTH.PROFILE_SUCCESS, profile);
  }
}
