// import { Test, TestingModule } from '@nestjs/testing';
// import { PurshasesController } from '../purshases.controller';
// import { PurshasesService } from '../purshases.service';

// describe('CategoriesController', () => {
//   let controller: PurshasesController;
//   let service: PurshasesService;

//   const categoryMock = {
//     id: 1,
//     name: 'category',
//     color: '#ffffff',
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   };

//   const mockCatergoriesService = {
//     findAll: jest.fn().mockResolvedValue([categoryMock]),
//     findOne: jest.fn().mockResolvedValue(categoryMock),
//     create: jest.fn().mockResolvedValue(categoryMock),
//     update: jest.fn().mockResolvedValue(categoryMock),
//     delete: jest.fn().mockResolvedValue(categoryMock),
//   };

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [PurshasesController],
//       providers: [
//         {
//           provide: PurshasesService,
//           useValue: mockCatergoriesService,
//         },
//       ],
//     }).compile();

//     controller = module.get<PurshasesController>(PurshasesController);
//     service = module.get<PurshasesService>(PurshasesService);
//   });

//   // it('should controller to be defined', () => {
//   //   expect(controller).toBeDefined();
//   // });

//   // it('should service to be defined', () => {
//   //   expect(service).toBeDefined();
//   // });

//   // it('should return an array of categories', async () => {
//   //   const result = await controller.findAll({ page: 1, limit: 10 });
//   //   expect(result).toEqual([categoryMock]);
//   // });

//   // it('should return a category', async () => {
//   //   const result = await controller.findOne(1);
//   //   expect(result).toEqual(categoryMock);
//   // });

//   // it('should create a category', async () => {
//   //   const result = await controller.create(categoryMock);
//   //   expect(result).toEqual(categoryMock);
//   // });

//   // it('should update a category', async () => {
//   //   const result = await controller.update(1, categoryMock);
//   //   expect(result).toEqual(categoryMock);
//   // });

//   // it('should delete a category', async () => {
//   //   const result = await controller.delete(1);
//   //   expect(result).toEqual(categoryMock);
//   // });
// });
