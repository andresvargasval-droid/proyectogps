import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Device } from '../devices/device.entity';
import { Vehicle } from '../vehicles/vehicle.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  passwordHash: string | null;

  @Column({ type: 'varchar', default: 'user' })
  role: string;

  @Column({ type: 'varchar', nullable: true })
  otpCode: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  otpExpiresAt: Date | null;

  @OneToMany(() => Device, (device) => device.user)
  devices: Device[];

  @OneToMany(() => Vehicle, (vehicle) => vehicle.user)
  vehicles: Vehicle[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
