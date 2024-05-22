import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { GENDER } from 'src/shared/enums';

export class CreateAppointmentDto {
  @IsNotEmpty()
  @IsString()
  readonly firstName: string;

  @IsNotEmpty()
  @IsString()
  readonly lastName: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly phone: string;

  @IsNotEmpty()
  @IsString()
  readonly nic: string;

  @IsNotEmpty()
  @IsDateString()
  readonly dob: Date;

  @IsNotEmpty()
  @IsEnum(GENDER)
  readonly gender: GENDER;

  @IsNotEmpty()
  @IsDateString()
  readonly appointment_date: Date;

  @IsNotEmpty()
  @IsString()
  readonly department: string;

  @IsNotEmpty()
  @IsString()
  readonly doctor_firstName: string;

  @IsNotEmpty()
  @IsString()
  readonly doctor_lastName: string;

  @IsNotEmpty()
  @IsBoolean()
  readonly hasVisited: boolean;

  @IsNotEmpty()
  @IsString()
  readonly address: string;
}
