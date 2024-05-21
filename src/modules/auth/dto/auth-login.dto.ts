import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ROLE } from 'src/shared/enums';

export class AuthLoginDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;

  @IsNotEmpty()
  @IsString()
  readonly confirmPassword: string;

  @IsNotEmpty()
  @IsEnum(ROLE)
  readonly role: ROLE;
}
