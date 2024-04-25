import { Test, TestingModule } from '@nestjs/testing';
import { SubcategoryController } from '../subcategories.controller';
import { SubcategoryService } from '../subcategories.service';
import { RelationalSubcategoryPersistenceModule } from '../infastructure/persistence/relational/relational-persistence.module';
import { CategoryModule } from 'src/routes/categories/categories.module';

describe('SubcategoryController', () => {
  let controller: SubcategoryController;
  let service: SubcategoryService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RelationalSubcategoryPersistenceModule, CategoryModule],
      controllers: [SubcategoryController],
      providers: [SubcategoryService],
    }).compile();

    controller = module.get<SubcategoryController>(SubcategoryController);
    service = module.get<SubcategoryService>(SubcategoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(controller).toBeInstanceOf(SubcategoryController);
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(SubcategoryService);
    expect(service).toHaveProperty('findAll');
    expect(service).toHaveProperty('findOne');
    expect(service).toHaveProperty('create');
    expect(service).toHaveProperty('update');
    expect(service).toHaveProperty('delete');
  });
});
