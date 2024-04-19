import { Lecture } from '../../../../domain/lecture';
import { GeneralEntity } from '../../../../../../shared/entities/general.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SectionEntity } from 'src/routes/sections/infastructure/persistence/relational/entities/section.entity';
import { FileEntity } from 'src/routes/files/infrastructure/persistence/relational/entities/file.entity';
@Entity({
  name: 'lectures',
})
export class LectureEntity extends GeneralEntity implements Lecture {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text', array: true })
  captions: string[];

  @ManyToOne(() => SectionEntity, {
    eager: true,
  })
  section: SectionEntity;

  @ManyToOne(() => FileEntity, {
    eager: true,
  })
  video: FileEntity;

  @ManyToOne(() => FileEntity, {
    eager: true,
  })
  attachement: FileEntity;

  @Column({ type: 'text' })
  descripstion: string;
}
