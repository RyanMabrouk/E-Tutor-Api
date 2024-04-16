import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

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
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: mockCatergoriesService,
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should controller to be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should service to be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an array of categories', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([categoryMock]);
  });

  it('should return a category', async () => {
    const result = await controller.findOne(1);
    expect(result).toEqual(categoryMock);
  });
});
