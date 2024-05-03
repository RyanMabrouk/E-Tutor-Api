import { Test } from '@nestjs/testing';
import { NotificationService } from './notifications.service';
import { NotificationsRepository } from './infastructure/persistence/notifications.repository';
import { UsersService } from '../users/users.service';

describe('NotificationService', () => {
  let notificationService: NotificationService;
  let notificationRepo: NotificationsRepository;
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
            findOne: jest.fn(),
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
  });

  it('should be defined', () => {
    expect(notificationService).toBeDefined();
    expect(notificationRepo).toBeDefined();
  });

  // describe('create', () => {
  //   it('should create notification successfully', async () => {
  //     const userId = 181;
  //     const createPayload: CreateNotificationsDto = {
  //       content: 'test',
  //       seen: false,
  //       receivers: [],
  //     };
  //     await expect(
  //       notificationService.create(createPayload, userId),
  //     ).resolves.toBeDefined();
  //   });
  // });

  // describe('findAll', () => {
  //   it('should find all notifications', async () => {
  //     const filterOptions = null;
  //     const sortOptions = null;
  //     const paginationOptions = { page: 1, limit: 10 };
  //     const userId = 181;
  //     await expect(
  //       notificationService.findAll({
  //         filterOptions,
  //         sortOptions,
  //         paginationOptions,
  //         userId,
  //       }),
  //     ).resolves.toEqual([]);

  //     expect(notificationRepo.findManyWithPagination).toHaveBeenCalledWith(
  //       expect.objectContaining({
  //         filterOptions,
  //         sortOptions,
  //         paginationOptions,
  //         userId,
  //       }),
  //     );
  //   });
  // });

  // describe('update', () => {
  //   it('should update notification successfully', async () => {
  //     const id = 1;
  //     const userId = 181;
  //     const updatePayload: UpdateNotificationsDto = {
  //       seen: true,
  //       content: 'test',
  //       receivers: [],
  //     };

  //     await expect(
  //       notificationService.update(id, updatePayload, userId),
  //     ).resolves.toBeDefined();
  //     expect(notificationRepo.update).toHaveBeenCalledWith(
  //       id,
  //       expect.objectContaining(updatePayload),
  //     );
  //   });
  // });

  // describe('remove', () => {
  //   it('should soft delete notification', async () => {
  //     const id = 1;
  //     const userId = 181;
  //     await notificationService.remove(id, userId);

  //     expect(notificationRepo.softDelete).toHaveBeenCalledWith(id);
  //   });
  // });
});
