// src/auth/auth.service.ts
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { createHash } from 'crypto';
import { MESSAGES } from '../common/constants/messages';
import { User } from '../users/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  private hashPassword(plain: string): string {
    return createHash('sha256').update(plain).digest('hex');
  }

  private async comparePassword(plain: string, hash: string): Promise<boolean> {
    return this.hashPassword(plain) === hash;
  }

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async login(dto: LoginDto) {
    const user = await this.usersRepo.findOne({ where: { email: dto.email } });
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException(MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await this.comparePassword(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException(MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }

  async register(dto: RegisterDto) {
    const existing = await this.usersRepo.findOne({ where: { email: dto.email } });
    if (existing) {
      throw new BadRequestException(MESSAGES.AUTH.USER_ALREADY_EXISTS);
    }

    const user = this.usersRepo.create({
      email: dto.email,
      passwordHash: this.hashPassword(dto.password),
      role: 'user',
    });

    const saved = await this.usersRepo.save(user);
    const { passwordHash, ...rest } = saved;
    return rest;
  }

  async requestOtp(dto: RequestOtpDto) {
    const user = await this.usersService.upsertByEmail(dto.email);

    const code = this.generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await this.usersService.setOtp(user.id, code, expiresAt);

    // En un escenario real se enviaría por email; aquí lo registramos para facilitar pruebas.
    console.log(`OTP para ${dto.email}: ${code} (expira a las ${expiresAt.toISOString()})`);

    return { email: dto.email, expiresAt };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException(MESSAGES.AUTH.USER_NOT_FOUND);
    }

    if (!user.otpCode || !user.otpExpiresAt) {
      throw new BadRequestException(MESSAGES.AUTH.OTP_NOT_FOUND);
    }

    const now = new Date();
    if (user.otpExpiresAt.getTime() < now.getTime()) {
      throw new BadRequestException(MESSAGES.AUTH.OTP_EXPIRED);
    }

    if (user.otpCode !== dto.code) {
      throw new BadRequestException(MESSAGES.AUTH.OTP_INVALID);
    }

    await this.usersService.clearOtp(user.id);

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = await this.jwtService.signAsync(payload);

    const { passwordHash, ...userData } = user;
    return { accessToken, user: userData };
  }

  async getProfile(userId: string) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException(MESSAGES.AUTH.USER_NOT_FOUND);
    }

    const { passwordHash, ...rest } = user;
    return rest;
  }
}
