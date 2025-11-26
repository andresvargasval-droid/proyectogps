import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

export enum DeviceStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  AVAILABLE = 'available',
  ASSIGNED = 'assigned',
}

@Entity('devices')
export class Device {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  imei: string;

  @Column()
  model: string;

  @Column({
    type: 'enum',
    enum: DeviceStatus,
    default: DeviceStatus.PENDING,
  })
  status: DeviceStatus;

  @ManyToOne(() => User, (user) => user.devices, { onDelete: 'CASCADE' })
  user: User;

  // relación lógica con vehículo (solo guardamos el id)
  @Column({ type: 'uuid', nullable: true })
  vehicleId: string | null;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
