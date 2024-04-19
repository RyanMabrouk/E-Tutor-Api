import { Test, TestingModule } from '@nestjs/testing';
import { PurshaseRepository } from '../infastructure/persistence/purshase.repository';
import { PurshasesService } from '../purshases.service';

describe('PurshasesService', () => {
  let service: PurshasesService;
  let purshaseRepository: PurshaseRepository;
  const mockPurshase = {
    discount: 0,
    courses: [],
    id: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  console.log(mockPurshase);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PurshasesService,
        {
          provide: PurshaseRepository,
          useValue: {
            create: jest.fn().mockResolvedValue({}),
            findManyWithPagination: jest.fn().mockResolvedValue([]),
            findOne: jest.fn().mockResolvedValue({ id: 1 }),
            update: jest.fn().mockResolvedValue({}),
            softDelete: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<PurshasesService>(PurshasesService);
    purshaseRepository = module.get<PurshaseRepository>(PurshaseRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an array of purshases', async () => {
    const paginationOptions = { page: 1, limit: 10 };
    expect(await service.findAll({ paginationOptions })).toEqual([]);
    expect(purshaseRepository.findManyWithPagination).toHaveBeenCalled();
  });

  it('should return a purshase', async () => {
    expect(await service.findOne({ id: 1 })).toEqual({ id: 1 });
    expect(purshaseRepository.findOne).toHaveBeenCalled();
  });

  it('should create a purshase', async () => {
    expect(await service.checkout({})).toEqual({});
    expect(purshaseRepository.create).toHaveBeenCalled();
  });
});
