import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { User } from '../users/domain/user';
import { LanguageRepository } from './infastructure/persistence/language.repository';
import { Language } from './domain/language';
import { CreateLanguageDto } from './dto/create-language.dto';
import { FilterLanguageDto, SortLanguageDto } from './dto/query-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { ChatService } from '../chat/chat.service';

@Injectable()
export class LanguageService {
  constructor(
    private readonly langRepository: LanguageRepository,
    private readonly chatService: ChatService,
  ) {}

  async create(createPayload: CreateLanguageDto): Promise<Language> {
    try {
      const created = await this.langRepository.create({
        ...createPayload,
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
  }: {
    filterOptions?: FilterLanguageDto | null;
    sortOptions?: SortLanguageDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Language[]> {
    return this.langRepository.findManyWithPagination({
      filterOptions: { ...filterOptions },
      sortOptions,
      paginationOptions,
    });
  }

  async update(
    id: number,
    updatePayload: UpdateLanguageDto,
  ): Promise<Language | null> {
    try {
      const updated = await this.langRepository.update(id, updatePayload);
      return updated;
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            id: 'Language doesnt exist',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async remove(id: number) {
    await this.langRepository.softDelete(id);
  }
  async validateChat(chatId: number, userId: User['id']) {
    const chat = await this.chatService.findOne(chatId, userId);
    if (!chat) {
      throw new BadRequestException(`Chat with id ${chatId} not found`);
    }
  }
}
