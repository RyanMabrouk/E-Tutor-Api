import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { infinityPagination } from 'src/utils/infinity-pagination';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/routes/roles/roles.guard';
import { MessageService } from './Message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { QueryMessageDto } from './dto/query-message.dto';
import { Message } from './domain/message';
import { UpdateMessageDto } from './dto/update-message.dto';
import { User } from 'src/shared/decorators/user.decorator';
import { MessagesSocketGateway } from './socket/messages-socket.gateway';
import { JwtPayloadType } from 'src/auth/strategies/types/jwt-payload.type';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'messages', version: '1' })
export class MessageController {
  constructor(
    private readonly msgService: MessageService,
    private readonly msgSocket: MessagesSocketGateway,
  ) {}

  @Post()
  async create(
    @Body() createDto: CreateMessageDto,
    @User() user: JwtPayloadType,
  ): Promise<Message> {
    const msg = this.msgService.formatResponse(
      await this.msgService.create(createDto, user.id),
    );
    this.msgSocket.emitCreate(msg);
    return msg;
  }

  @Get()
  async findAll(
    @Query() query: QueryMessageDto,
    @User() user: JwtPayloadType,
  ): Promise<InfinityPaginationResultType<Message>> {
    const page = query?.page ?? 1;
    const limit = query?.limit ? (query?.limit > 50 ? 50 : query?.limit) : 10;
    const data = infinityPagination(
      await this.msgService.findAll({
        filterOptions: query?.filters ?? null,
        sortOptions: query?.sort ?? null,
        paginationOptions: {
          page,
          limit,
        },
        chatId: query.chatId,
        userId: user.id,
      }),
      { page, limit },
    );
    return {
      ...data,
      data: data.data.map((msg) => this.msgService.formatResponse(msg)),
    };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMsgDto: UpdateMessageDto,
    @User() user: JwtPayloadType,
  ) {
    const msg = await this.msgService.update(id, updateMsgDto, user.id);
    if (msg) {
      this.msgSocket.emitUpdate(msg);
    }
    return msg;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number, @User() user: JwtPayloadType) {
    return this.msgService.remove(id, user.id);
  }
}
