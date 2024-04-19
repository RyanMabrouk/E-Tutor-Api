import { Purshase } from '../../../../domain/purshase';
import { GeneralEntity } from '../../../../../../shared/entities/general.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CourseEntity } from 'src/routes/courses/infastructure/persistence/relational/entities/course.entity';
@Entity({
  name: 'categories',
})
export class PurshaseEntity extends GeneralEntity implements Purshase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  discount: number;

  @ManyToOne(() => CourseEntity)
  courses: CourseEntity[];
}
