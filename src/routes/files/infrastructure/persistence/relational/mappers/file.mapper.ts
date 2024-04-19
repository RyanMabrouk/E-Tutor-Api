import { FileType } from '../../../../domain/file';
import { FileEntity } from '../entities/file.entity';

export class FileMapper {
  static toDomain(raw: Partial<FileEntity>): FileType {
    const file = new FileType();
    if (raw.id) {
      file.id = raw.id;
    }
    if (raw.path) {
      file.path = raw.path;
    }
    return file;
  }

  static toPersistence(file: Partial<FileType>): FileEntity {
    const fileEntity = new FileEntity();
    if (file.id) {
      fileEntity.id = file.id;
    }
    if (file.path) {
      fileEntity.path = file.path;
    }
    return fileEntity;
  }
}
