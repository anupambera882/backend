import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { GENDER, ROLE } from 'src/shared/enums';
import { Appointment } from 'src/modules/appointment/entities/appointment.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  picture: string;

  @Column()
  nic: string;

  @Column()
  dob: Date;

  @Column({ type: 'enum', enum: GENDER, default: GENDER.MALE })
  gender: GENDER;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: ROLE, default: ROLE.PATIENT })
  role: ROLE;

  @Column()
  doctorDepartment: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @ManyToOne(() => Appointment, (appointment) => appointment.doctorDetails)
  doctorAppointment: Appointment;

  @ManyToOne(() => Appointment, (appointment) => appointment.patientDetails)
  patientAppointment: Appointment;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 8);
  }

  async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
