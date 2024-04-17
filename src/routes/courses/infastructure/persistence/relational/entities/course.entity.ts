import {
  Course,
  CourseLevelEnum,
  CourseLevelType,
} from '../../../../domain/course';
import { GeneralEntity } from '../../../../../../shared/entities/general.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CategoryEntity } from 'src/routes/categories/infastructure/persistence/relational/entities/category.entity';
import { SubcategoryEntity } from 'src/routes/subcategories/infastructure/persistence/relational/entities/subcategory.entity';
import { LanguageEntity } from 'src/routes/languages/infastructure/persistence/relational/entities/language.entity';
import { FileEntity } from 'src/routes/files/infrastructure/persistence/relational/entities/file.entity';
import { UserEntity } from 'src/routes/users/infrastructure/persistence/relational/entities/user.entity';
@Entity({
  name: 'courses',
})
export class CourseEntity extends GeneralEntity implements Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  title: string;

  @ManyToOne(() => CategoryEntity)
  @JoinTable()
  category: CategoryEntity;

  @Column({ type: 'text' })
  subtitle: string;

  @ManyToOne(() => SubcategoryEntity)
  @JoinTable()
  subcategory: SubcategoryEntity;

  @Column({ type: 'text' })
  topic: string;

  @ManyToOne(() => SubcategoryEntity)
  @JoinTable()
  language: LanguageEntity;

  @ManyToMany(() => LanguageEntity)
  @JoinTable()
  subtitleLanguage: LanguageEntity[];

  @Column({ type: 'enum', enum: CourseLevelEnum, default: CourseLevelEnum.All })
  level: CourseLevelType;

  @Column({ type: 'int' })
  duration: number;

  @ManyToOne(() => FileEntity)
  @JoinTable()
  thumbnail: FileEntity;

  @ManyToOne(() => FileEntity)
  @JoinTable()
  trailer: FileEntity;

  @Column({ type: 'json' })
  description: JSON;

  @Column({ type: 'text', array: true })
  subjects: string[];

  @Column({ type: 'text', array: true })
  audience: string[];

  @Column({ type: 'text', array: true })
  requirements: string[];

  @Column({ type: 'text' })
  welcomeMessage: string;

  @Column({ type: 'text' })
  congratsMessage: string;

  @Column({ type: 'int', default: 0 })
  price: number;

  @Column({ type: 'int', default: 0 })
  discount: number;

  @ManyToMany(() => UserEntity)
  @JoinTable()
  instructors: UserEntity[];
}
