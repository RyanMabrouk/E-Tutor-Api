import { Test, TestingModule } from '@nestjs/testing';
import { SubcategoryRepository } from './infastructure/persistence/subcategories.repository';
import { SubcategoryService } from './subcategories.service';
import { Category } from '../categories/domain/category';
import { CategoryRepository } from '../categories/infastructure/persistence/category.repository';

describe('UsersService', () => {
  let service: SubcategoryService;
  let subcategoryRepository: SubcategoryRepository;
  let categoryRepository: CategoryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubcategoryService,
        {
          provide: SubcategoryRepository,
          useValue: {
            create: jest.fn().mockResolvedValue({}),
            findManyWithPagination: jest.fn().mockResolvedValue([]),
            findOne: jest.fn().mockResolvedValue({ id: 1 }),
            update: jest.fn().mockResolvedValue({}),
            softDelete: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: CategoryRepository,
          useValue: {
            findOne: jest.fn().mockResolvedValue({ id: 1 }),
          },
        },
      ],
    }).compile();

    service = module.get<SubcategoryService>(SubcategoryService);
    subcategoryRepository = module.get<SubcategoryRepository>(
      SubcategoryRepository,
    );
    categoryRepository = module.get<CategoryRepository>(CategoryRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an array of subcategories', async () => {
    const paginationOptions = { page: 1, limit: 10 };
    expect(await service.findAll({ paginationOptions })).toEqual([]);
    expect(subcategoryRepository.findManyWithPagination).toHaveBeenCalled();
  });

  it('should find all subcategories with filter, sort, and pagination options', async () => {
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

  it('should return a subcategory', async () => {
    expect(await service.findOne({ id: 1 })).toEqual({ id: 1 });
    expect(subcategoryRepository.findOne).toHaveBeenCalled();
  });

  it('should create a subcategory', async () => {
    const createSubCategoryDto = {
      name: 'test',
      category: { id: 1 } as Category,
    };
    await service.create(createSubCategoryDto);
    expect(categoryRepository.findOne).toHaveBeenCalledWith({ id: 1 });
    expect(subcategoryRepository.create).toHaveBeenCalledWith(
      expect.any(Object),
    );
  });

  it('should update a subcategory', async () => {
    const updateSubCategoryDto = {
      name: 'test',
      color: 'blue',
    };
    await service.update({ id: 1 }, updateSubCategoryDto);
    expect(subcategoryRepository.update).toHaveBeenCalled();
  });
  it('should delete a subcategory', async () => {
    await service.delete({ id: 1 });
    expect(subcategoryRepository.softDelete).toHaveBeenCalled();
  });
});
