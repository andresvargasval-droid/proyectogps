import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

export enum VehicleStatus {
  AVAILABLE = 'available',
  ASSIGNED = 'assigned',
}

@Entity()
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  plate: string;

  @Column()
  type: string;

  @Column({ type: 'enum', enum: VehicleStatus, default: VehicleStatus.AVAILABLE })
  status: VehicleStatus;

  @Column({ type: 'uuid', nullable: true })
  deviceId: string | null;

  @ManyToOne(() => User, (user) => user.vehicles, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
