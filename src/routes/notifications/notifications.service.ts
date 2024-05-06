import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { User } from '../users/domain/user';
import { NotificationsRepository } from './infastructure/persistence/notifications.repository';
import { CreateNotificationsDto } from './dto/create-notifications.dto';
import { UsersService } from '../users/users.service';
import { UpdateNotificationsDto } from './dto/update-notifications.dto';
import {
  FilterNotificationsDto,
  SortNotificationsDto,
} from './dto/query-notifications.dto';
import { Notification } from './domain/notifications';
import { Cron } from '@nestjs/schedule';
import { NotificationsSocketGateway } from './socket/notifications-socket.gateway';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationRepo: NotificationsRepository,
    private readonly notifSocket: NotificationsSocketGateway,
    private readonly userService: UsersService,
  ) {}

  async create(
    createPayload: CreateNotificationsDto,
    user_id: User['id'],
  ): Promise<Notification> {
    console.log(createPayload, user_id);
    const validationPromises = createPayload.receivers.map((e) =>
      this.userService.validateUser(e.id),
    );
    await Promise.all(validationPromises);
    try {
      const created = await this.notificationRepo.create({
        ...createPayload,
        sender: { id: user_id } as User,
      });
      return created;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async createNotifFromApp(
    createPayload: CreateNotificationsDto,
  ): Promise<Notification> {
    console.log(createPayload);
    const validationPromises = createPayload.receivers.map((e) =>
      this.userService.validateUser(e.id),
    );
    await Promise.all(validationPromises);
    try {
      const created = await this.notificationRepo.create({
        ...createPayload,
        sender: null,
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
    filterOptions?: FilterNotificationsDto | null;
    sortOptions?: SortNotificationsDto[] | null;
    paginationOptions: IPaginationOptions;
    userId: User['id'];
  }): Promise<Notification[]> {
    console.log(filterOptions, sortOptions, paginationOptions, userId);
    return this.notificationRepo.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
      userId,
    });
  }

  async update(
    id: number,
    updatePayload: UpdateNotificationsDto,
    userId: User['id'],
  ): Promise<Notification | null> {
    await this.validateIfUserIsReceiver(id, userId);
    try {
      const updated = await this.notificationRepo.update(id, updatePayload);
      return updated;
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            id: 'Notification doesnt exist',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async remove(id: number, userId: User['id']) {
    await this.validateIfUserIsReceiver(id, userId);
    await this.notificationRepo.softDelete(id);
  }
  async validateIfUserIsReceiver(
    notifId: Notification['id'],
    userId: User['id'],
  ) {
    const notif = await this.notificationRepo.findOne({ id: notifId });
    if (!notif.receivers.some((e) => e.id === userId)) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          errors: {
            id: 'You are not a receiver of this notification',
          },
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  // @Cron(CronExpression.EVERY_10_SECONDS, { name: 'sendReminder' })
  @Cron('0 9 * * *', { name: 'sendReminder' }) // 9am every day
  async sendReminders() {
    const users = await this.userService.findAllUsers();
    console.log(users);
    for (const user of users) {
      console.log(user);
      const learningGoal = user?.learningGoal;
      console.log(learningGoal);

      if (!learningGoal) {
        continue;
      }
      console.log(user);

      const notif = await this.createNotifFromApp({
        receivers: [{ id: user.id } as User],
        content: `Did you complete your daily ${learningGoal} mins learing goal today ? 🤔`,
        seen: false,
      });
      this.notifSocket.emitCreate(notif);
    }
  }
}
