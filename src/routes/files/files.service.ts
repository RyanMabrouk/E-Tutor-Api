import { BadRequestException, Injectable } from '@nestjs/common';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { NullableType } from 'src/utils/types/nullable.type';
import { FileRepository } from './infrastructure/persistence/file.repository';
import { FileType } from './domain/file';

@Injectable()
export class FilesService {
  constructor(private readonly fileRepository: FileRepository) {}
  async findOne(
    fields: EntityCondition<FileType>,
  ): Promise<NullableType<FileType>> {
    try {
      const result = await this.fileRepository.findOne(fields);
      return result;
    } catch (err) {
      if (err.message.includes('invalid input syntax for type uuid')) {
        throw new BadRequestException(`Invalid file UUID: ${fields.id}`);
      } else {
        throw new BadRequestException('File error :' + err.message);
      }
    }
  }
}
