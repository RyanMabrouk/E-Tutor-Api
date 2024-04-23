import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { User } from '../users/domain/user';
import { MessageRepository } from './infastructure/persistence/Message.repository';
import { Message } from './domain/message';
import { CreateMessageDto } from './dto/create-message.dto';
import { FilterMessageDto, SortMessageDto } from './dto/query-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Chat } from '../chat/domain/chat';
import { ChatService } from '../chat/chat.service';
import { filterColumnsHelper } from 'src/shared/helpers/filterColumnsHelper';

@Injectable()
export class MessageService {
  constructor(
    private readonly msgRepository: MessageRepository,
    private readonly chatService: ChatService,
  ) {}

  async create(
    createPayload: CreateMessageDto,
    userId: User['id'],
  ): Promise<Message> {
    await this.chatService.findOne(createPayload.chat.id, userId);
    try {
      const created = await this.msgRepository.create({
        ...createPayload,
        sender: { id: userId } as User,
      });
      return created;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async findAll({
    filterOptions,
    sortOptions,
    paginationOptions,
    chatId,
    userId,
  }: {
    filterOptions?: FilterMessageDto | null;
    sortOptions?: SortMessageDto[] | null;
    paginationOptions: IPaginationOptions;
    chatId: Chat['id'];
    userId: User['id'];
  }): Promise<Message[]> {
    // Check if user is part of the chat
    await this.chatService.findOne(chatId, userId);
    return this.msgRepository.findManyWithPagination({
      filterOptions: { ...filterOptions, chat: { id: chatId as number } },
      sortOptions,
      paginationOptions,
    });
  }

  async update(
    id: number,
    updatePayload: UpdateMessageDto,
    userId: User['id'],
  ): Promise<Message | null> {
    await this.validateIsSender(id, userId);
    try {
      const updated = await this.msgRepository.update(id, updatePayload);
      return updated;
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            id: 'Message doesnt exist',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async remove(id: number, userId: User['id']) {
    await this.validateIsSender(id, userId);
    await this.msgRepository.softDelete(id);
  }
  async validateIsSender(messageId: number, userId: User['id']) {
    const message = await this.msgRepository.findOne({ id: messageId });
    if (message.sender.id !== userId) {
      throw new UnauthorizedException('User is not the sender of this message');
    }
  }

  formatResponse(chat: Message) {
    return {
      ...chat,
      sender: filterColumnsHelper({
        data: chat.sender,
        columnsToPick: ['id', 'firstName', 'lastName', 'photo', 'username'],
      }) as User,
    };
  }
}
