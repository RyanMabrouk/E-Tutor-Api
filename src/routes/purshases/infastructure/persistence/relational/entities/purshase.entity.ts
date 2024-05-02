import { Purshase } from '../../../../domain/purshase';
import { GeneralEntity } from '../../../../../../shared/entities/general.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CourseEntity } from 'src/routes/courses/infastructure/persistence/relational/entities/course.entity';
import { UserEntity } from 'src/routes/users/infrastructure/persistence/relational/entities/user.entity';
@Entity({
  name: 'purshases',
})
export class PurshaseEntity extends GeneralEntity implements Purshase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  discount: number;

  @Column()
  totalPrice: number;

  @ManyToOne(() => CourseEntity)
  courses: CourseEntity[];

  @ManyToOne(() => UserEntity)
  user: UserEntity;
}
