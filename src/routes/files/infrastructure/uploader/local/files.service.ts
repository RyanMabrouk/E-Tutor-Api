import * as fs from 'fs';
import * as path from 'path';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { FileRepository } from '../../persistence/file.repository';
import { FileType } from 'src/routes/files/domain/file';
import { MultipartFile } from '@fastify/multipart';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';

@Injectable()
export class FilesLocalService {
  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    private readonly fileRepository: FileRepository,
  ) {}
  downloadFile(filePathName: string): fs.ReadStream {
    const filePath = path.join(process.cwd(), 'files', filePathName);
    if (!fs.existsSync(filePath)) {
      throw new BadRequestException("File doesn't exist");
    }
    try {
      return fs.createReadStream(filePath);
    } catch (err) {
      throw new InternalServerErrorException('Could not read the file');
    }
  }
  async uploadFile(fileData: MultipartFile): Promise<{ file: FileType }> {
    const filename = `${randomStringGenerator()}.${fileData.filename.split('.').pop()?.toLowerCase()}`;
    fileData.filename = filename;
    await this.saveFileToStorage(fileData.file, filename);
    return this.create(filename);
  }

  async saveFileToStorage(
    file: MultipartFile['file'],
    filename: string,
  ): Promise<void> {
    const filepath = path.join('./files', filename);
    await new Promise<void>((resolve, reject) => {
      const writeStream = fs.createWriteStream(filepath);
      file.pipe(writeStream);
      file.on('end', () => resolve());
      file.on('error', (error) => {
        reject(error);
        throw new InternalServerErrorException('Could not save the file');
      });
    });
  }

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

  async getOne(path: string): Promise<FileType> {
    const file = await this.fileRepository.findOne({
      path: `/${this.configService.get('app.apiPrefix', {
        infer: true,
      })}/v1/files/${path}`,
    });
    return file;
  }
}
