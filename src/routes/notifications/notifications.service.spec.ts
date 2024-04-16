import { Test } from '@nestjs/testing';
import { NotificationService } from './notifications.service';
import { NotificationsRepository } from './infastructure/persistence/notifications.repository';
import { UsersService } from '../users/users.service';
import { CreateNotificationsDto } from './dto/create-notifications.dto';
import { UpdateNotificationsDto } from './dto/update-notifications.dto';

describe('NotificationService', () => {
  let notificationService: NotificationService;
  let notificationRepo: NotificationsRepository;
  //   let usersService: UsersService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: NotificationsRepository,
          useValue: {
            create: jest.fn(),
            findManyWithPagination: jest.fn(),
            update: jest.fn(),
            softDelete: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            validateUser: jest.fn(),
          },
        },
      ],
    }).compile();

    notificationService =
      moduleRef.get<NotificationService>(NotificationService);
    notificationRepo = moduleRef.get<NotificationsRepository>(
      NotificationsRepository,
    );
    // usersService = moduleRef.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('should create notification successfully', async () => {
      const createPayload: CreateNotificationsDto = {
        content: 'test',
        seen: false,
        receivers: [],
      };
      const userId = 123;
      await expect(
        notificationService.create(createPayload, userId),
      ).resolves.toBeDefined();
    });
  });

  describe('findAll', () => {
    it('should find all notifications', async () => {
      const filterOptions = null;
      const sortOptions = null;
      const paginationOptions = { page: 1, limit: 10 };
      const userId = 123;
      await expect(
        notificationService.findAll({
          filterOptions,
          sortOptions,
          paginationOptions,
          userId,
        }),
      ).resolves.toEqual([]);

      expect(notificationRepo.findManyWithPagination).toHaveBeenCalledWith(
        expect.objectContaining({
          filterOptions,
          sortOptions,
          paginationOptions,
          userId,
        }),
      );
    });
  });

  describe('update', () => {
    it('should update notification successfully', async () => {
      const id = 1;
      const updatePayload: UpdateNotificationsDto = {
        seen: true,
        content: 'test',
        receivers: [],
      };

      await expect(
        notificationService.update(id, updatePayload),
      ).resolves.toBeDefined();
      expect(notificationRepo.update).toHaveBeenCalledWith(
        id,
        expect.objectContaining(updatePayload),
      );
    });
  });

  describe('remove', () => {
    it('should soft delete notification', async () => {
      const id = 1;

      await notificationService.remove(id);

      expect(notificationRepo.softDelete).toHaveBeenCalledWith(id);
    });
  });
});
