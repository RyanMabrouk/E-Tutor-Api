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
import { MessageService } from './Message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { QueryMessageDto } from './dto/query-message.dto';
import { Message } from './domain/message';
import { UpdateMessageDto } from './dto/update-message.dto';
import { ChatService } from '../chat/chat.service';
import { User as UserFromReq } from 'src/shared/decorators/user.decorator';
import { MessagesSocketGateway } from './socket/messages-socket.gateway';
import { JwtPayloadType } from 'src/auth/strategies/types/jwt-payload.type';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'messages', version: '1' })
export class MessageController {
  constructor(
    private readonly msgService: MessageService,
    private readonly chatService: ChatService,
    private readonly msgSocket: MessagesSocketGateway,
  ) {}

  @Post()
  async create(
    @Body() createDto: CreateMessageDto,
    @UserFromReq() user: JwtPayloadType,
  ): Promise<Message> {
    const msg = await this.msgService.create(createDto, user.id);
    this.msgSocket.emitCreate(msg);
    return msg;
  }

  @Get(':chatId')
  async findAll(
    @Param('chatId', ParseIntPipe) chatId: number,
    @Query() query: QueryMessageDto,
    @UserFromReq() user: JwtPayloadType,
  ): Promise<InfinityPaginationResultType<Message>> {
    const page = query?.page ?? 1;
    const limit = query?.limit ? (query?.limit > 50 ? 50 : query?.limit) : 10;
    const chat = await this.chatService.findOne(chatId, user.id);
    if (!chat) {
      throw new BadRequestException('Chat not found');
    }
    try {
      const data = infinityPagination(
        await this.msgService.findAll({
          filterOptions: query?.filters ?? null,
          sortOptions: query?.sort ?? null,
          paginationOptions: {
            page,
            limit,
          },
          chatId: chatId,
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
    @Body() updateMsgDto: UpdateMessageDto,
    @UserFromReq() user: JwtPayloadType,
  ) {
    const msg = await this.msgService.update(id, updateMsgDto, user.id);
    if (msg) {
      this.msgSocket.emitUpdate(msg);
    }
    return msg;
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @UserFromReq() user: JwtPayloadType,
  ) {
    await this.msgService.remove(id, user.id);
    return {
      ...successResponse,
    };
  }
}
