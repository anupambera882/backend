import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { DoctorRegisterDto, RegisterDto } from './dto/auth-register.dto';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthUser } from '../../shared/decorators/auth-user.decorator';
import { response } from '../../shared/interface';
import { ROLE } from 'src/shared/enums';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { Roles } from 'src/shared/decorators/role.decorator';
import { RolesGuard } from 'src/shared/guard/role.guard';

@Controller('user')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('patient/register')
  createPatient(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<response<User>> {
    return this.authService.register(registerDto, res, ROLE.PATIENT);
  }

  @Post('login')
  async login(
    @Body() authLoginDto: AuthLoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<response> {
    return this.authService.login(authLoginDto, res);
  }

  @Post('admin/addnew')
  @Roles(ROLE.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  createAdmin(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<response<User>> {
    return this.authService.register(registerDto, res, ROLE.ADMIN);
  }

  @Post('doctor/addnew')
  @Roles(ROLE.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'docAvatar', maxCount: 1 }, ,]),
  )
  createDoctor(
    @Body() doctorRegisterDto: DoctorRegisterDto,
    @UploadedFiles()
    files: {
      docAvatar: Express.Multer.File[];
    },
    @Res({ passthrough: true }) res: Response,
  ): Promise<response<User>> {
    return this.authService.register(
      doctorRegisterDto,
      res,
      ROLE.DOCTOR,
      files.docAvatar[0],
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('doctors')
  getAllDoctors(): Promise<response<User[]>> {
    return this.authService.getAllDoctors();
  }

  @Get('patient/me')
  @Roles(ROLE.PATIENT)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  getPatientProfile(@AuthUser() user: any) {
    return this.authService.getLoggedUser(user.userId);
  }

  @Get('admin/me')
  @Roles(ROLE.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  getAdminProfile(@AuthUser() user: any) {
    return this.authService.getLoggedUser(user.userId);
  }

  @Get('patient/logout')
  @Roles(ROLE.PATIENT)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  logoutPatient(@Res({ passthrough: true }) res: Response) {
    return this.authService.logoutPatient(res);
  }

  @Get('admin/logout')
  @Roles(ROLE.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  logoutAdmin(@Res({ passthrough: true }) res: Response) {
    return this.authService.logoutAdmin(res);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }
}
