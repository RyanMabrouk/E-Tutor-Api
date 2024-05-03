import { Test, TestingModule } from '@nestjs/testing';
import { LanguageRepository } from './infastructure/persistence/language.repository';
import { LanguageService } from './language.service';

describe('UsersService', () => {
  let service: LanguageService;
  let languageRepository: LanguageRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LanguageService,
        {
          provide: LanguageRepository,
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

    service = module.get<LanguageService>(LanguageService);
    languageRepository = module.get<LanguageRepository>(LanguageRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an array of languages', async () => {
    const paginationOptions = { page: 1, limit: 10 };
    expect(await service.findAll({ paginationOptions })).toEqual([]);
    expect(languageRepository.findManyWithPagination).toHaveBeenCalled();
  });

  it('should find all languages with filter, sort, and pagination options', async () => {
    const filterOptions = { name: 'Test' };
    // const sortOptions = [{ orderBy: 'name', order: 'asc' }];
    const paginationOptions = { page: 1, limit: 10 };

    const result = await service.findAll({
      filterOptions,
      // sortOptions,
      paginationOptions,
    });

    expect(result).toEqual(expect.any(Array));
  });

  it('should return a language', async () => {
    expect(await service.findOne({ id: 1 })).toEqual({ id: 1 });
    expect(languageRepository.findOne).toHaveBeenCalled();
  });

  it('should create a language', async () => {
    const createLanguageDto = {
      name: 'test',
    };
    await service.create(createLanguageDto);
    expect(languageRepository.create).toHaveBeenCalledWith(expect.any(Object));
  });

  it('should update a language', async () => {
    const updateLanguageDto = {
      name: 'test updated',
    };
    await service.update(1, updateLanguageDto);
    expect(languageRepository.update).toHaveBeenCalled();
  });
  it('should delete a language', async () => {
    await service.remove(1);
    expect(languageRepository.softDelete).toHaveBeenCalled();
  });
});
