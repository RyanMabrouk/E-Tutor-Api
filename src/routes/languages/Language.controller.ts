import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { infinityPagination } from 'src/utils/infinity-pagination';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';
import { successResponse } from 'src/auth/constants/response';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/routes/roles/roles.guard';
import { LanguageService } from './language.service';
import { CreateLanguageDto } from './dto/create-language.dto';
import { QueryLanguageDto } from './dto/query-language.dto';
import { Language } from './domain/language';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { ChatService } from '../chat/chat.service';
import { User as UserFromReq } from 'src/shared/decorators/user.decorator';
import { User } from '../users/domain/user';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'language', version: '1' })
export class LanguageController {
  constructor(
    private readonly langService: LanguageService,
    private readonly chatService: ChatService,
  ) {}

  @Post()
  async create(@Body() createDto: CreateLanguageDto): Promise<Language> {
    const msg = await this.langService.create(createDto);
    // this.msgSocket.emitCreate(msg);
    return msg;
  }

  @Get(':chatId')
  async findAll(
    @Param('chatId', ParseIntPipe) chatId: number,
    @Query() query: QueryLanguageDto,
    @UserFromReq() user: User,
  ): Promise<InfinityPaginationResultType<Language>> {
    const page = query?.page ?? 1;
    const limit = query?.limit ? (query?.limit > 50 ? 50 : query?.limit) : 10;
    const chat = await this.chatService.findOne(chatId, user.id);
    if (!chat) {
      throw new BadRequestException('Chat not found');
    }
    try {
      const data = infinityPagination(
        await this.langService.findAll({
          filterOptions: query?.filters ?? null,
          sortOptions: query?.sort ?? null,
          paginationOptions: {
            page,
            limit,
          },
        }),
        { page, limit },
      );
      return data;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMsgDto: UpdateLanguageDto,
  ) {
    const msg = await this.langService.update(id, updateMsgDto);
    if (msg) {
      // this.msgSocket.emitUpdate(msg);
    }
    return msg;
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.langService.remove(id);
    return {
      ...successResponse,
    };
  }
}
