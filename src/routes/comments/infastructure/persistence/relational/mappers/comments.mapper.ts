import { UserMapper } from 'src/routes/users/infrastructure/persistence/relational/mappers/user.mapper';
import { CommentEntity } from '../entities/comments.entity';
import { Comment } from 'src/routes/comments/domain/comments';
import { LectureMapper } from 'src/routes/lectures/infastructure/persistence/relational/mappers/lecture.mapper';

export class CommentMapper {
  static toDomain(raw: Partial<CommentEntity>): Comment {
    const domain = new Comment();
    delete raw.__entity;
    delete raw.replyTo;
    Object.assign(domain, raw);
    if (raw.user) {
      domain.user = UserMapper.toDomain(raw.user);
    }
    if (raw.lecture) {
      domain.lecture = LectureMapper.toDomain(raw.lecture);
    }
    return domain;
  }

  static toPersistence(entity: Partial<Comment>): CommentEntity {
    const Entity = new CommentEntity();
    Object.assign(Entity, entity);
    if (entity.user) {
      Entity.user = UserMapper.toPersistence(entity.user);
    }
    if (entity.lecture) {
      Entity.lecture = LectureMapper.toPersistence(entity.lecture);
    }
    return Entity;
  }
}
