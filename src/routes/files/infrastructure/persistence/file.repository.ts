import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { FileType } from '../../domain/file';
export abstract class FileRepository {
  abstract create(
    data: Omit<FileType, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<FileType>;

  abstract findOne(fields: EntityCondition<FileType>): Promise<FileType>;
}
