import { UserMapper } from 'src/routes/users/infrastructure/persistence/relational/mappers/user.mapper';
import { ReviewEntity } from '../entities/review.entity';
import { Review } from 'src/routes/reviews/domain/review';
import { CourseMapper } from 'src/routes/courses/infastructure/persistence/relational/mappers/course.mapper';

export class ReviewMapper {
  static toDomain(raw: Partial<ReviewEntity>): Review {
    const domain = new Review();
    delete raw.__entity;
    Object.assign(domain, raw);
    if (raw.course) {
      domain.course = CourseMapper.toDomain(raw.course);
    }
    if (raw.user) {
      domain.user = UserMapper.toDomain(raw.user);
    }
    return domain;
  }

  static toPersistence(entity: Partial<Review>): ReviewEntity {
    const Entity = new ReviewEntity();
    Object.assign(Entity, entity);
    if (entity.user) {
      Entity.user = UserMapper.toPersistence(entity.user);
    }
    if (entity.course) {
      Entity.course = CourseMapper.toPersistence(entity.course);
    }
    return Entity;
  }
}
