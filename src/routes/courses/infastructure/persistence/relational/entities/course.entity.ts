import { Course } from '../../../../domain/course';
import {
  CourseLevelEnum,
  CourseLevelType,
} from 'src/routes/courses/types/CourseLevelType';
import { GeneralEntity } from '../../../../../../shared/entities/general.entity';
import {
  Column,
  Entity,
  JoinColumn,
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
import {
  CourseStatusEnum,
  CourseStatusType,
} from 'src/routes/courses/types/CourseStatusType';
import { WishlistEntity } from 'src/routes/wishlists/infastructure/persistence/relational/entities/wishlist.entity';
@Entity({
  name: 'courses',
})
export class CourseEntity extends GeneralEntity implements Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  title: string;

  @ManyToOne(() => CategoryEntity)
  @JoinColumn()
  category: CategoryEntity;

  @Column({ type: 'text' })
  subtitle: string;

  @ManyToOne(() => SubcategoryEntity)
  @JoinColumn()
  subcategory: SubcategoryEntity;

  @Column({ type: 'text' })
  topic: string;

  @ManyToOne(() => LanguageEntity)
  @JoinColumn()
  language: LanguageEntity;

  @ManyToMany(() => LanguageEntity)
  @JoinTable()
  subtitleLanguage: LanguageEntity[];

  @Column({ type: 'enum', enum: CourseLevelEnum, default: CourseLevelEnum.All })
  level: CourseLevelType;

  @Column({ type: 'int' })
  duration: number;

  @ManyToOne(() => FileEntity, { nullable: true })
  @JoinColumn()
  thumbnail: FileEntity;

  @ManyToOne(() => FileEntity, { nullable: true })
  @JoinColumn()
  trailer: FileEntity;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'text', array: true, nullable: true })
  subjects: string[] | null;

  @Column({ type: 'text', array: true, nullable: true })
  audience: string[] | null;

  @Column({ type: 'text', array: true, nullable: true })
  requirements: string[] | null;

  @Column({ type: 'text', nullable: true })
  welcomeMessage: string | null;

  @Column({ type: 'text', nullable: true })
  congratsMessage: string | null;

  @Column({ type: 'int', default: 0 })
  price: number;

  @Column({ type: 'int', default: 0 })
  discount: number;

  @ManyToMany(() => UserEntity, {
    eager: true,
  })
  @JoinTable()
  instructors: UserEntity[];

  @ManyToMany(() => WishlistEntity, {
    eager: true,
  })
  @JoinTable()
  wishlists: WishlistEntity[];

  @Column({
    type: 'enum',
    enum: CourseStatusEnum,
    default: 'draft',
  })
  status: CourseStatusType;
}
