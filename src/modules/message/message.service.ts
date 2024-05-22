import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationResponse, response } from 'src/shared/interface';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message) private messageRepository: Repository<Message>,
  ) {}

  async create({
    firstName,
    lastName,
    email,
    phone,
    message,
  }: CreateMessageDto): Promise<response<Message>> {
    const newMessage = await this.messageRepository.save({
      firstName,
      lastName,
      email,
      phone,
      message,
    });

    return {
      statusCode: 201,
      response: newMessage,
      message: 'Message Sent!',
    };
  }

  async findAll(): Promise<response<PaginationResponse<Message>>> {
    const messages = await this.messageRepository.find();
    return {
      statusCode: 200,
      response: {
        data: messages,
        pagination: {
          pageNumber: 1,
          limitCount: 1,
          total: 2,
        },
      },
      message: 'Appointment Status Updated!',
    };
  }
}
