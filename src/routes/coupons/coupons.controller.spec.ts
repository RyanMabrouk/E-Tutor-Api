import { Test, TestingModule } from '@nestjs/testing';
import { CouponsController } from './coupons.controller';
import { CouponsService } from './coupons.service';

describe('CouponsController', () => {
  let controller: CouponsController;
  let service: CouponsService;

  const couponMock = {
    id: 1,
    value: 10,
    expiryDate: new Date(),
    numberOfUses: 0,
    code: 'AZAZTA',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCatergoriesService = {
    findAll: jest.fn().mockResolvedValue([couponMock]),
    findOne: jest.fn().mockResolvedValue(couponMock),
    create: jest.fn().mockResolvedValue(couponMock),
    update: jest.fn().mockResolvedValue(couponMock),
    delete: jest.fn().mockResolvedValue(couponMock),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CouponsController],
      providers: [
        {
          provide: CouponsService,
          useValue: mockCatergoriesService,
        },
      ],
    }).compile();

    controller = module.get<CouponsController>(CouponsController);
    service = module.get<CouponsService>(CouponsService);
  });

  it('should controller to be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should service to be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an array of categories', async () => {
    const result = await controller.findAll({ page: 1, limit: 10 });
    expect(result).toEqual({
      data: [couponMock],
      hasNextPage: expect.any(Boolean),
    });
  });

  it('should return a category', async () => {
    const result = await controller.findOne(1);
    expect(result).toEqual(couponMock);
  });

  it('should create a category', async () => {
    const result = await controller.create(couponMock);
    expect(result).toEqual(couponMock);
  });

  it('should update a category', async () => {
    const result = await controller.update(1, couponMock);
    expect(result).toEqual(couponMock);
  });

  it('should delete a category', async () => {
    const result = await controller.delete(1);
    expect(result).toEqual(couponMock);
  });
});
