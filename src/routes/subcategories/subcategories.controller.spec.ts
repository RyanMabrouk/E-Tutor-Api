import { Test, TestingModule } from '@nestjs/testing';
import { SubcategoryController } from './subcategories.controller';
import { SubcategoryService } from './subcategories.service';

describe('CategoriesController', () => {
  let controller: SubcategoryController;
  let service: SubcategoryService;

  const categoryMock = {
    id: 1,
    name: 'category',
    color: '#ffffff',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCatergoriesService = {
    findAll: jest.fn().mockResolvedValue([categoryMock]),
    findOne: jest.fn().mockResolvedValue(categoryMock),
    create: jest.fn().mockResolvedValue(categoryMock),
    update: jest.fn().mockResolvedValue(categoryMock),
    delete: jest.fn().mockResolvedValue(categoryMock),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubcategoryController],
      providers: [
        {
          provide: SubcategoryService,
          useValue: mockCatergoriesService,
        },
      ],
    }).compile();

    controller = module.get<SubcategoryController>(SubcategoryController);
    service = module.get<SubcategoryService>(SubcategoryService);
  });

  it('should controller to be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should service to be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an array of categories', async () => {
    const result = await controller.findAll({
      paginationOptions: { page: 1, limit: 10 },
    });
    expect(result).toEqual([categoryMock]);
  });

  it('should return a category', async () => {
    const result = await controller.findOne(1);
    expect(result).toEqual(categoryMock);
  });

  it('should create a category', async () => {
    const result = await controller.create(categoryMock);
    expect(result).toEqual(categoryMock);
  });

  it('should update a category', async () => {
    const result = await controller.update(1, categoryMock);
    expect(result).toEqual(categoryMock);
  });

  it('should delete a category', async () => {
    const result = await controller.delete(1);
    expect(result).toEqual(categoryMock);
  });
});
