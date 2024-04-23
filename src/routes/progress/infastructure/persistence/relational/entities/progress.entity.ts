import { Progress } from '../../../../domain/progress';
import { GeneralEntity } from '../../../../../../shared/entities/general.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from 'src/routes/users/infrastructure/persistence/relational/entities/user.entity';
import { LectureEntity } from 'src/routes/lectures/infastructure/persistence/relational/entities/lecture.entity';
@Entity({
  name: 'progress',
})
export class ProgressEntity extends GeneralEntity implements Progress {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @ManyToOne(() => LectureEntity)
  lecture: LectureEntity;

  @Column({ default: false })
  completed: boolean;
}
