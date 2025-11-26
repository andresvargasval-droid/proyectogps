// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  // Buscar por id (usado en /auth/me)
  async findById(id: string): Promise<User | null> {
    return this.usersRepo.findOne({
      where: { id },
    });
  }

  // Buscar por email
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepo.findOne({
      where: { email },
    });
  }

  // Crear usuario si no existe (login por OTP)
  async upsertByEmail(email: string): Promise<User> {
    let user = await this.findByEmail(email);
    if (!user) {
      user = this.usersRepo.create({
        email,
        role: 'user',
      });
      user = await this.usersRepo.save(user);
    }
    return user;
  }

  // Guardar OTP y expiración
  async setOtp(userId: string, code: string, expiresAt: Date): Promise<void> {
    await this.usersRepo.update(
      { id: userId },
      {
        otpCode: code,
        otpExpiresAt: expiresAt,
      },
    );
  }

  // Limpiar OTP después de validar
  async clearOtp(userId: string): Promise<void> {
    await this.usersRepo.update(
      { id: userId },
      {
        otpCode: null,
        otpExpiresAt: null,
      },
    );
  }

  // (Opcional) listar usuarios, por si lo necesitas más adelante
  async findAll(): Promise<User[]> {
    return this.usersRepo.find();
  }
}
