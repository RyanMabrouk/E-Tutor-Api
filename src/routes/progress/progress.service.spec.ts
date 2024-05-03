import { Test, TestingModule } from '@nestjs/testing';
import { ProgressService } from './progress.service';
import { ProgressRepository } from './infastructure/persistence/section.repository';
import { LectureService } from '../lectures/lecture.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/domain/user';
import { Lecture } from '../lectures/domain/lecture';

describe('UsersService', () => {
  let service: ProgressService;
  let progressRepository: ProgressRepository;
  let lectureService: LectureService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProgressService,
        {
          provide: ProgressRepository,
          useValue: {
            create: jest.fn().mockResolvedValue({}),
            findManyWithPagination: jest.fn().mockResolvedValue([]),
            findOne: jest.fn().mockResolvedValue({ id: 1 }),
            update: jest.fn().mockResolvedValue({}),
            softDelete: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: LectureService,
          useValue: {
            findOne: jest.fn().mockResolvedValue({ id: 1 }),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn().mockResolvedValue({ id: 1 }),
          },
        },
      ],
    }).compile();

    service = module.get<ProgressService>(ProgressService);
    progressRepository = module.get<ProgressRepository>(ProgressRepository);
    lectureService = module.get<LectureService>(LectureService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an array of progresses', async () => {
    const paginationOptions = { page: 1, limit: 10 };
    expect(await service.findAll({ paginationOptions })).toEqual([]);
    expect(progressRepository.findManyWithPagination).toHaveBeenCalled();
  });

  it('should find all progresses with filter, sort, and pagination options', async () => {
    const paginationOptions = { page: 1, limit: 10 };

    const result = await service.findAll({
      paginationOptions,
    });

    expect(result).toEqual(expect.any(Array));
  });

  it('should return a progress', async () => {
    expect(await service.findOne({ id: 1 })).toEqual({ id: 1 });
    expect(progressRepository.findOne).toHaveBeenCalled();
  });

  it('should create a progress', async () => {
    const createCategoryDto = {
      user: { id: 1 } as User,
      lecture: { id: 1 } as Lecture,
      completed: true,
    };
    await service.create(createCategoryDto);
    expect(usersService.findOne).toHaveBeenCalled();
    expect(lectureService.findOne).toHaveBeenCalled();
    expect(progressRepository.create).toHaveBeenCalledWith(expect.any(Object));
  });

  it('should update a progress', async () => {
    const updateCategoryDto = {
      completed: false,
    };
    await service.update({ id: 1 }, updateCategoryDto);
    expect(progressRepository.update).toHaveBeenCalled();
  });
  it('should delete a progress', async () => {
    await service.delete({ id: 1 });
    expect(progressRepository.softDelete).toHaveBeenCalled();
  });
});
