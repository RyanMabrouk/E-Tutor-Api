import { Test, TestingModule } from '@nestjs/testing';
import { ProgressService } from '../progress.service';
import { ProgressRepository } from '../infastructure/persistence/section.repository';
import { User } from 'src/routes/users/domain/user';
import { Lecture } from 'src/routes/lectures/domain/lecture';
import { LectureService } from 'src/routes/lectures/lecture.service';
import { UsersService } from 'src/routes/users/users.service';

describe('ProgressService', () => {
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
    console.log(lectureService, usersService);

    service = module.get<ProgressService>(ProgressService);
    progressRepository = module.get<ProgressRepository>(ProgressRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an array of user progresses', async () => {
    const paginationOptions = { page: 1, limit: 10 };
    expect(await service.findAll({ paginationOptions })).toEqual([]);
    expect(progressRepository.findManyWithPagination).toHaveBeenCalled();
  });

  it('should find all user progresses with filter, sort, and pagination options', async () => {
    const filterOptions = { completed: true };
    //   const sortOptions = [{ orderBy: 'name', order: 'asc' }];
    const paginationOptions = { page: 1, limit: 10 };

    const result = await service.findAll({
      filterOptions,
      // sortOptions,
      paginationOptions,
    });

    expect(result).toEqual(expect.any(Array));
  });

  it('should return a user progress', async () => {
    expect(await service.findOne({ id: 1 })).toEqual({ id: 1 });
    expect(progressRepository.findOne).toHaveBeenCalled();
  });

  it('should create a user progress', async () => {
    const createProgressDto = {
      lecture: { id: 1 } as Lecture,
      user: { id: 49 } as User,
      completed: true,
    };
    await service.create(createProgressDto);
    expect(progressRepository.create).toHaveBeenCalledWith(expect.any(Object));
  });

  //   it('should update a category', async () => {
  //     const updateCategoryDto = {
  //       name: 'test',
  //       color: 'blue',
  //     };
  //     await service.update({ id: 1 }, updateCategoryDto);
  //     expect(progressRepository.update).toHaveBeenCalled();
  //   });
  //   it('should delete a category', async () => {
  //     await service.delete({ id: 1 });
  //     expect(progressRepository.softDelete).toHaveBeenCalled();
  //   });
});
