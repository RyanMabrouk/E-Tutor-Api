import { Test, TestingModule } from '@nestjs/testing';
import { FilesService } from './files.service';
import { FileRepository } from './infrastructure/persistence/file.repository';
import { FileType } from './domain/file';
import { EntityCondition } from 'src/utils/types/entity-condition.type';

describe('FilesService', () => {
  let service: FilesService;
  let fileRepository: FileRepository;
  const mockFile = {
    id: 1,
    path: 'test.txt',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilesService,
        {
          provide: FileRepository,
          useValue: {
            findOne: jest.fn().mockReturnValue(mockFile),
          },
        },
      ],
    }).compile();

    service = module.get<FilesService>(FilesService);
    fileRepository = module.get<FileRepository>(FileRepository);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a file', async () => {
    const fields: EntityCondition<FileType> = {
      id: 'souhail-aoaze-azraz-azra-azra-azazr',
    };
    const result = await service.findOne(fields);
    expect(result).toEqual(mockFile);
    expect(fileRepository.findOne).toHaveBeenCalledWith(fields);
  });
});
