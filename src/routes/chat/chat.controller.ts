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
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { QueryChatDto } from './dto/query-chat.dto';
import { Chat } from './domain/chat';
import { UpdateChatDto } from './dto/update-chat.dto';
import { User } from 'src/shared/decorators/user.decorator';
import { JwtPayloadType } from 'src/auth/strategies/types/jwt-payload.type';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'chat', version: '1' })
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  create(@Body() createDto: CreateChatDto, @User() user: JwtPayloadType) {
    return this.chatService.create(createDto, user.id);
  }

  @Get()
  async findAll(
    @Query() query: QueryChatDto,
    @User() user: JwtPayloadType,
  ): Promise<InfinityPaginationResultType<Chat>> {
    const page = query?.page ?? 1;
    const limit = query?.limit ? (query?.limit > 50 ? 50 : query?.limit) : 10;
    try {
      const data = infinityPagination(
        await this.chatService.findAll({
          filterOptions: query?.filters ?? null,
          sortOptions: query?.sort ?? null,
          paginationOptions: {
            page,
            limit,
          },
          userId: user.id,
        }),
        { page, limit },
      );
      return data;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @User() user: JwtPayloadType) {
    return this.chatService.findOne(id, user.id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateChattDto: UpdateChatDto,
    @User() user: JwtPayloadType,
  ) {
    return this.chatService.update(id, updateChattDto, user.id);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @User() user: JwtPayloadType,
  ) {
    await this.chatService.remove(id, user.id);
    return {
      ...successResponse,
    };
  }
}
