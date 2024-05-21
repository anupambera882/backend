import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CommonErrors } from '../../shared/errors/common-errors';
import { RegisterDto } from './dto/auth-register.dto';
import { AuthLoginDto } from './dto/auth-login.dto';
import { User } from './entities/user.entity';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { response } from '../../shared/interface';
import { ROLE } from 'src/shared/enums';
import { saveFile } from 'src/shared/utils/saveFile';
import { filePath } from 'src/shared/utils/constants';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async register(
    registerDto: RegisterDto,
    res: Response,
    role: ROLE,
    file?: Express.Multer.File,
  ): Promise<response<User>> {
    const existing = await this.userRepository.findOne({
      where: {
        email: registerDto.email,
      },
    });
    if (existing)
      throw new InternalServerErrorException(CommonErrors.EmailExist);

    const user = this.userRepository.create({ ...registerDto, role });

    if (file) {
      user.picture = await saveFile(filePath.AnswerDocumentFilePath, file);
    }

    await user.save();
    user.password = undefined;

    if (role === ROLE.PATIENT) {
      const token = this.jwtService.sign(
        { id: user.id },
        {
          expiresIn: process.env.JWT_EXPIRES,
        },
      );

      res.cookie('patientToken', token, {
        expires: new Date(
          Date.now() +
            parseInt(process.env.COOKIE_EXPIRE) * 24 * 60 * 60 * 1000,
        ),
        httpOnly: true,
      });
    }

    return {
      statusCode: 201,
      response: user,
      message: 'register successfully!!!',
    };
  }

  async login(
    { email, password, confirmPassword, role }: AuthLoginDto,
    res: Response,
  ): Promise<response> {
    if (password !== confirmPassword) {
      throw new UnauthorizedException(CommonErrors.Unauthorized);
    }
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (!user || !(await user?.comparePassword(password))) {
      throw new UnauthorizedException(CommonErrors.Unauthorized);
    }

    if (role !== user.role) {
      throw new UnauthorizedException(CommonErrors.Unauthorized);
    }

    const token = this.jwtService.sign(
      { userId: user.id },
      {
        expiresIn: process.env.JWT_EXPIRES,
      },
    );
    // Determine the cookie name based on the user's role
    const cookieName = user.role === 'Admin' ? 'adminToken' : 'patientToken';

    res.cookie(cookieName, token, {
      expires: new Date(
        Date.now() + parseInt(process.env.COOKIE_EXPIRE) * 24 * 60 * 60 * 1000,
      ),
      httpOnly: true,
    });

    return {
      statusCode: 200,
      response: {
        token,
        user,
      },
      message: 'Sign Up successfully!!',
    };
  }

  async getLoggedUser(id: number): Promise<response<User>> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    user.password = undefined;
    return {
      statusCode: 200,
      response: user,
      message: 'register successfully!!!',
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const exists = await this.userRepository.findOne({
      where: {
        email: forgotPasswordDto.email,
      },
    });

    if (!exists) {
      throw new NotFoundException(CommonErrors.NotFound);
    } else {
      const user = await this.userRepository.findOne({
        where: {
          email: forgotPasswordDto.email,
        },
      });

      const passwordRand = Math.random().toString(36).slice(-8);

      user.password = bcrypt.hashSync(passwordRand, 8);

      this.sendForgotPasswordMail(user.email, passwordRand);
      return await this.userRepository.save(user);
    }
  }

  async getAllDoctors(): Promise<response<User[]>> {
    const doctors = await this.userRepository.find({
      where: { role: ROLE.DOCTOR },
    });
    return {
      statusCode: 200,
      response: doctors,
      message: 'All doctors',
    };
  }

  async logoutAdmin(res: Response): Promise<response> {
    res.cookie('adminToken', '', {
      httpOnly: true,
      expires: new Date(Date.now()),
    });

    return {
      statusCode: 200,
      response: {},
      message: 'Admin Logged Out Successfully.',
    };
  }

  async logoutPatient(res: Response): Promise<response> {
    res.cookie('patientToken', '', {
      httpOnly: true,
      expires: new Date(Date.now()),
    });

    return {
      statusCode: 200,
      response: {},
      message: 'Patient Logged Out Successfully.',
    };
  }

  private async sendForgotPasswordMail(email, password) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to Nice App! Confirm your Email',
      template: '/forgot-password',
      context: {
        email: email,
        password: password,
      },
    });
  }
}
