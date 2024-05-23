import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Roles } from 'src/shared/decorators/role.decorator';
import { ROLE } from 'src/shared/enums';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/shared/guard/role.guard';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('send')
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.messageService.create(createMessageDto);
  }

  @Get('getall')
  @Roles(ROLE.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  findAll() {
    return this.messageService.findAll();
  }
}
