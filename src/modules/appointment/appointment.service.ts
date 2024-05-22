import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';
import { Repository } from 'typeorm';
import { ROLE } from 'src/shared/enums';
import { CommonErrors } from 'src/shared/errors/common-errors';
import { Appointment } from './entities/appointment.entity';
import { Doctor } from './entities/doctor.entity';
import { PaginationResponse, response } from 'src/shared/interface';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
  ) {}
  async create(
    {
      firstName,
      lastName,
      email,
      phone,
      nic,
      dob,
      gender,
      appointment_date,
      department,
      doctor_firstName,
      doctor_lastName,
      hasVisited,
      address,
    }: CreateAppointmentDto,
    userId: number,
  ): Promise<response<Appointment>> {
    const isConflict = await this.userRepository.find({
      where: {
        firstName: doctor_firstName,
        lastName: doctor_lastName,
        role: ROLE.DOCTOR,
        doctorDepartment: department,
      },
    });

    if (!isConflict.length) {
      throw new NotFoundException(CommonErrors.NotFound);
    }

    if (isConflict.length > 1) {
      throw new BadRequestException(CommonErrors.NotFound);
    }

    const doctor = await this.doctorRepository.save({
      firstName: doctor_firstName,
      lastName: doctor_lastName,
    });
    const doctorId = isConflict[0].id;
    const patientId = userId;
    const appointment = await this.appointmentRepository.save({
      firstName,
      lastName,
      email,
      phone,
      nic,
      dob,
      gender,
      appointment_date,
      department,
      doctor,
      hasVisited,
      address,
      doctorId,
      patientId,
    });

    return {
      statusCode: 201,
      response: appointment,
      message: 'Appointment Send!',
    };
  }

  async findAll(
    limit: number,
    page: number,
  ): Promise<response<PaginationResponse<Appointment>>> {
    const [appointments, total] = await this.appointmentRepository.findAndCount(
      {
        take: limit,
        skip: limit * page,
      },
    );
    return {
      statusCode: 200,
      response: {
        data: appointments,
        pagination: {
          pageNumber: page,
          limitCount: limit,
          total,
        },
      },
      message: 'Appointment Status Updated!',
    };
  }

  async update(
    id: number,
    updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<response<Appointment>> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
    });
    if (!appointment) {
      throw new BadRequestException('Appointment not found!');
    }
    await this.appointmentRepository.update(id, {
      ...updateAppointmentDto,
    });

    return {
      statusCode: 200,
      response: appointment,
      message: 'Appointment Status Updated!',
    };
  }

  async remove(id: number): Promise<response<Appointment>> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
    });
    if (!appointment) {
      throw new BadRequestException('Appointment Not Found!');
    }

    await this.appointmentRepository.delete(appointment.id);

    return {
      statusCode: 200,
      response: appointment,
      message: 'Appointment Status Updated!',
    };
  }
}
