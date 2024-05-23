import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AuthUser } from 'src/shared/decorators/auth-user.decorator';
import { Roles } from 'src/shared/decorators/role.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/shared/guard/role.guard';
import { ROLE } from 'src/shared/enums';

@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post('post')
  @Roles(ROLE.PATIENT)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @AuthUser() user: any,
  ) {
    return this.appointmentService.create(createAppointmentDto, user.userId);
  }

  @Get('getall')
  @Roles(ROLE.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  findAll(@Query('limit') limit: number, @Query('page') page: number) {
    [limit, page] = [
      Math.max(1, limit || parseInt(process.env.PAGE_LIMIT)),
      Math.max(0, page || 0),
    ];
    return this.appointmentService.findAll(limit, page);
  }

  @Put('update/:id')
  @Roles(ROLE.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentService.update(+id, updateAppointmentDto);
  }

  @Delete('delete/:id')
  @Roles(ROLE.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  remove(@Param('id') id: string) {
    return this.appointmentService.remove(+id);
  }
}
