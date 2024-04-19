import { GeneralEntity } from 'src/shared/entities/general.entity';
import { UserEntity } from 'src/routes/users/infrastructure/persistence/relational/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Review } from 'src/routes/reviews/domain/review';
import { CourseEntity } from 'src/routes/courses/infastructure/persistence/relational/entities/course.entity';
@Entity({
  name: 'reviews',
})
export class ReviewEntity extends GeneralEntity implements Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => CourseEntity)
  course: CourseEntity;

  @ManyToOne(() => UserEntity, {
    eager: true,
  })
  user: UserEntity;

  @Column({ type: 'int' })
  rating: number;
}
