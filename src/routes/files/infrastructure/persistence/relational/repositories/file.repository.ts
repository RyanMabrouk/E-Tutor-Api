import { BadGatewayException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from '../entities/file.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { FileRepository } from '../../file.repository';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { FileMapper } from '../mappers/file.mapper';
import { FileType } from '../../../../domain/file';

@Injectable()
export class FileRelationalRepository implements FileRepository {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}

  async create(data: FileType): Promise<FileType> {
    const persistenceModel = FileMapper.toPersistence(data);
    return this.fileRepository.save(
      this.fileRepository.create(persistenceModel),
    );
  }

  async findOne(fields: EntityCondition<FileType>): Promise<FileType> {
    const entity = await this.fileRepository.findOne({
      where: fields as FindOptionsWhere<FileEntity>,
    });
    if (!entity) {
      throw new BadGatewayException('File not found');
    }
    return FileMapper.toDomain(entity);
  }
}
