import { Test, TestingModule } from '@nestjs/testing';
import { CategoryRepository } from './infastructure/persistence/category.repository';
import { CategoriesService } from './categories.service';

describe('UsersService', () => {
  let service: CategoriesService;
  let categoryRepository: CategoryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: CategoryRepository,
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

    service = module.get<CategoriesService>(CategoriesService);
    categoryRepository = module.get<CategoryRepository>(CategoryRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an array of categories', async () => {
    const paginationOptions = { page: 1, limit: 10 };
    expect(await service.findAll({ paginationOptions })).toEqual([]);
    expect(categoryRepository.findManyWithPagination).toHaveBeenCalled();
  });

  it('should find all categories with filter, sort, and pagination options', async () => {
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

  it('should return a category', async () => {
    expect(await service.findOne({ id: 1 })).toEqual({ id: 1 });
    expect(categoryRepository.findOne).toHaveBeenCalled();
  });

  it('should create a category', async () => {
    const createCategoryDto = {
      name: 'test',
      color: 'red',
    };
    await service.create(createCategoryDto);
    expect(categoryRepository.create).toHaveBeenCalledWith(expect.any(Object));
  });

  it('should update a category', async () => {
    const updateCategoryDto = {
      name: 'test',
      color: 'blue',
    };
    await service.update({ id: 1 }, updateCategoryDto);
    expect(categoryRepository.update).toHaveBeenCalled();
  });
  it('should delete a category', async () => {
    await service.delete({ id: 1 });
    expect(categoryRepository.softDelete).toHaveBeenCalled();
  });
});
