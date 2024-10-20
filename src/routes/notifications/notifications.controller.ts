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
import { User } from 'src/shared/decorators/user.decorator';
import { NotificationService } from './notifications.service';
import { CreateNotificationsDto } from './dto/create-notifications.dto';
import { QueryNotificationsDto } from './dto/query-notifications.dto';
import { UpdateNotificationsDto } from './dto/update-notifications.dto';
import { Notification } from './domain/notifications';
import { NotificationsSocketGateway } from './socket/notifications-socket.gateway';
import { JwtPayloadType } from 'src/auth/strategies/types/jwt-payload.type';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('notifications')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'notifications', version: '1' })
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly notifSocket: NotificationsSocketGateway,
  ) {}

  @Post()
  async create(
    @Body() createDto: CreateNotificationsDto,
    @User() user: JwtPayloadType,
  ): Promise<Notification> {
    const notif = await this.notificationService.create(createDto, user.id);
    this.notifSocket.emitCreate(notif);
    return this.notificationService.create(createDto, user.id);
  }

  @Get()
  async findAll(
    @Query() query: QueryNotificationsDto,
    @User() user: JwtPayloadType,
  ): Promise<InfinityPaginationResultType<Notification>> {
    const page = query?.page ?? 1;
    const limit = query?.limit ? (query?.limit > 50 ? 50 : query?.limit) : 10;
    try {
      const data = infinityPagination(
        await this.notificationService.findAll({
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

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNotiftDto: UpdateNotificationsDto,
    @User() user: JwtPayloadType,
  ) {
    const notif = await this.notificationService.update(
      id,
      updateNotiftDto,
      user.id,
    );
    if (notif) {
      this.notifSocket.emitUpdate(notif);
    }
    return notif;
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @User() user: JwtPayloadType,
  ) {
    await this.notificationService.remove(id, user.id);
    return {
      ...successResponse,
    };
  }
}
