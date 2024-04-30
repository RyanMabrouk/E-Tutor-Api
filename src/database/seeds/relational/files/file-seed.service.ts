import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TEST_FILE_PATH } from 'test/utils/constants';
import { FileEntity } from 'src/routes/files/infrastructure/persistence/relational/entities/file.entity';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';

@Injectable()
export class FileSeedService {
  constructor(
    @InjectRepository(FileEntity)
    private repository: Repository<FileEntity>,
    private readonly configService: ConfigService<AllConfigType>,
  ) {}
  async run() {
    const path = `/${this.configService.get('app.apiPrefix', {
      infer: true,
    })}/v1/files/${TEST_FILE_PATH}`;
    const countFile = await this.repository.count({
      where: {
        path,
      },
    });
    if (!countFile) {
      await this.repository.save(
        this.repository.create({
          path,
        }),
      );
    }
  }
}
