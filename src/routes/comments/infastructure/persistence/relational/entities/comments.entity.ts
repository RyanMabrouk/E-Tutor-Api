import { GeneralEntity } from 'src/shared/entities/general.entity';
import { UserEntity } from 'src/routes/users/infrastructure/persistence/relational/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Comment } from 'src/routes/comments/domain/comments';
import { LectureEntity } from 'src/routes/lectures/infastructure/persistence/relational/entities/lecture.entity';
@Entity({
  name: 'commentes',
})
export class CommentEntity extends GeneralEntity implements Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => CommentEntity, { nullable: true, onDelete: 'SET NULL' })
  replyTo: CommentEntity | null;

  @ManyToOne(() => UserEntity, {
    eager: true,
  })
  user: UserEntity;

  @ManyToOne(() => LectureEntity, {
    eager: true,
  })
  lecture: LectureEntity;
}
