import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { FileRepository } from '../../persistence/file.repository';
import { FileType } from 'src/routes/files/domain/file';

@Injectable()
export class FilesLocalService {
  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    private readonly fileRepository: FileRepository,
  ) {}

  async create(filename: string | undefined): Promise<{ file: FileType }> {
    if (!filename) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            file: 'Somthing went wrong please try again',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return {
      file: await this.fileRepository.create({
        path: `/${this.configService.get('app.apiPrefix', {
          infer: true,
        })}/v1/files/${filename}`,
      }),
    };
  }
}
