import { Test, TestingModule } from '@nestjs/testing';
import { LanguageService } from './language.service';
import { Repository } from 'typeorm';
import { LanguageEntity } from './infastructure/persistence/relational/entities/language.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('LanguageServiceeee', () => {
  let service: LanguageService;
  let langRepository: Repository<LanguageEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LanguageService,
        {
          provide: getRepositoryToken(LanguageEntity),
          useValue: langRepository,
        },
      ],
    }).compile();

    langRepository = module.get<Repository<LanguageEntity>>(
      getRepositoryToken(LanguageEntity),
    );
    service = module.get<LanguageService>(LanguageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
