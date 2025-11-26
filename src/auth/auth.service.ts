// src/auth/auth.service.ts
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { MESSAGES } from '../common/constants/messages';
// ...

@Injectable()
export class AuthService {
  // ...

  async login(dto: LoginDto) {
    const user = await this.usersRepo.findOne({ where: { email: dto.email } });
    if (!user) {
      throw new UnauthorizedException(MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await this.comparePassword(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    // generar token...
    return { accessToken: '...' };
  }

  async register(dto: RegisterDto) {
    const existing = await this.usersRepo.findOne({ where: { email: dto.email } });
    if (existing) {
      throw new BadRequestException(MESSAGES.AUTH.USER_ALREADY_EXISTS);
    }

    // crear usuario...
  }
}
