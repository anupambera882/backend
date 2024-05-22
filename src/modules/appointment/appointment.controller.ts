import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AuthUser } from 'src/shared/decorators/auth-user.decorator';

@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post('post')
  create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @AuthUser() user: any,
  ) {
    return this.appointmentService.create(createAppointmentDto, user.userId);
  }

  @Get('getall')
  findAll(@Query('limit') limit: number, @Query('page') page: number) {
    [limit, page] = [
      Math.max(1, limit || parseInt(process.env.PAGE_LIMIT)),
      Math.max(0, page || 0),
    ];
    return this.appointmentService.findAll(limit, page);
  }

  @Put('update/:id')
  update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentService.update(+id, updateAppointmentDto);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.appointmentService.remove(+id);
  }
}
