import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { GENDER } from 'src/shared/enums';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  readonly firstName: string;

  @IsNotEmpty()
  @IsString()
  readonly lastName: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email' })
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
  @IsString()
  @MinLength(6)
  readonly password: string;
}

export class DoctorRegisterDto {
  @IsNotEmpty()
  @IsString()
  readonly firstName: string;

  @IsNotEmpty()
  @IsString()
  readonly lastName: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email' })
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
  @IsString()
  @MinLength(6)
  readonly password: string;

  @IsNotEmpty()
  @IsString()
  readonly doctorDepartment: string;
}
