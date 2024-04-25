import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { IPaginationOptions } from '../../utils/types/pagination-options';
import { ValidateMembers } from '../../utils/validation/vlalidate-members';
import { Chat } from './domain/chat';
import { ChatRepository } from './infastructure/persistence/chat.repository';
import { CreateChatDto } from './dto/create-chat.dto';
import { FilterChatDto, SortChatDto } from './dto/query-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { User } from '../users/domain/user';
import { filterObjectHelper } from 'src/shared/helpers/filterObjectHelper';

@Injectable()
export class ChatService {
  constructor(
    private readonly vlaidateMembers: ValidateMembers,
    private readonly chatRepository: ChatRepository,
  ) {}

  async create(
    createPayload: CreateChatDto,
    ownerId: User['id'],
  ): Promise<Chat> {
    await Promise.all([this.vlaidateMembers.validate(createPayload.members)]);
    try {
      const created = await this.chatRepository.create({
        ...createPayload,
        members: [...createPayload.members, { id: ownerId }] as User[],
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
    userId,
  }: {
    filterOptions?: FilterChatDto | null;
    sortOptions?: SortChatDto[] | null;
    paginationOptions: IPaginationOptions;
    userId: User['id'];
  }): Promise<Chat[]> {
    return this.chatRepository.findManyWithPagination({
      filterOptions: { ...filterOptions, members: { id: userId as number } },
      sortOptions,
      paginationOptions,
    });
  }

  async findOne(id: number, userId: User['id']): Promise<Chat> {
    await this.validateUserInChat({ chatId: id, userId });
    return this.chatRepository.findOne({ id: id });
  }

  async update(
    id: number,
    updatePayload: UpdateChatDto,
    userId: User['id'],
  ): Promise<Chat | null> {
    await this.validateUserInChat({
      chatId: id,
      userId,
    });
    const validationPromises: Promise<void>[] = [];
    if (updatePayload.members) {
      validationPromises.push(
        this.vlaidateMembers.validate(updatePayload.members),
      );
    }
    await Promise.all(validationPromises);
    try {
      const updated = await this.chatRepository.update(id, updatePayload);
      return updated;
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            id: 'Chat doesnt exist',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async remove(id: number, userId: User['id']) {
    await this.validateUserInChat({
      chatId: id,
      userId,
    });
    return this.chatRepository.softDelete(id);
  }
  async validateUserInChat({
    chatId,
    userId,
  }: {
    chatId: Chat['id'];
    userId: User['id'];
  }) {
    const chat = await this.chatRepository.findOne({ id: chatId });
    if (chat.members?.some((member) => member.id == userId)) {
      return true;
    } else {
      throw new UnauthorizedException("You don't have access to this chat");
    }
  }

  formatResponse(chat: Chat) {
    return {
      ...chat,
      members: chat.members.map((e) =>
        filterObjectHelper({
          data: e,
          Pick: ['id', 'firstName', 'lastName', 'photo', 'username'],
        }),
      ),
    };
  }
}
