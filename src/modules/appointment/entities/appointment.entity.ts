import { User } from 'src/modules/auth/entities/user.entity';
import { GENDER, STATUS } from 'src/shared/enums';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Doctor } from './doctor.entity';

@Entity()
export class Appointment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  nic: string;

  @Column()
  dob: Date;

  @Column({ type: 'enum', enum: GENDER, default: GENDER.MALE })
  gender: GENDER;

  @Column()
  appointment_date: Date;

  @Column()
  department: string;

  @Column()
  hasVisited: boolean;

  @Column()
  address: string;

  @Column({ type: 'enum', enum: STATUS, default: STATUS.PENDING })
  status: STATUS;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @OneToMany(() => User, (user) => user.doctorAppointment)
  @JoinColumn({ name: 'doctorId' })
  doctorDetails: User[];

  @OneToMany(() => User, (user) => user.patientAppointment)
  @JoinColumn({ name: 'patientId' })
  patientDetails: User[];

  @OneToOne(() => Doctor, (doctor) => doctor.appointment)
  doctor: Doctor;
}
