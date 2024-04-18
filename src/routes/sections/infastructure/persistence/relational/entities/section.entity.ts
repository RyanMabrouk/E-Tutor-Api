import { Section } from '../../../../domain/section';
import { GeneralEntity } from '../../../../../../shared/entities/general.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CourseEntity } from 'src/routes/courses/infastructure/persistence/relational/entities/course.entity';
@Entity({
  name: 'sections',
})
export class SectionEntity extends GeneralEntity implements Section {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  name: string;

  @ManyToOne(() => CourseEntity)
  @JoinTable()
  course: CourseEntity;
}
