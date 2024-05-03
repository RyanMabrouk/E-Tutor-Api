import { Test, TestingModule } from '@nestjs/testing';
import { CouponRepository } from './infastructure/persistence/coupon.repository';
import { CouponsService } from './coupons.service';

describe('UsersService', () => {
  let service: CouponsService;
  let categoryRepository: CouponRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CouponsService,
        {
          provide: CouponRepository,
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

    service = module.get<CouponsService>(CouponsService);
    categoryRepository = module.get<CouponRepository>(CouponRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an array of coupons', async () => {
    const paginationOptions = { page: 1, limit: 10 };
    expect(await service.findAll({ paginationOptions })).toEqual([]);
    expect(categoryRepository.findManyWithPagination).toHaveBeenCalled();
  });

  it('should find all coupons with filter, sort, and pagination options', async () => {
    const filterOptions = { value: 10 };
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
    const createCouponDto = {
      value: 10,
      expiryDate: new Date('2025-01-01'),
      numberOfUses: 0,
      code: 'AZAZTA',
    };
    await service.create(createCouponDto);
    expect(categoryRepository.create).toHaveBeenCalledWith(expect.any(Object));
  });

  it('should update a category', async () => {
    const updateCouponDto = {
      numberOfUses: 1,
    };
    await service.update({ id: 1 }, updateCouponDto);
    expect(categoryRepository.update).toHaveBeenCalled();
  });
  it('should delete a category', async () => {
    await service.delete({ id: 1 });
    expect(categoryRepository.softDelete).toHaveBeenCalled();
  });
});
