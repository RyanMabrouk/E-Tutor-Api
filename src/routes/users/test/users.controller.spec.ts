import { UsersService } from './../users.service';
import { UsersController } from '../users.controller';
import { infrastructurePersistenceModule } from '../users.module';
import { FilesModule } from 'src/routes/files/files.module';
import { Test } from '@nestjs/testing';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [infrastructurePersistenceModule, FilesModule],
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();
    controller = await module.resolve(UsersController);
    service = await module.resolve(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
});
