import {
  Column,
  AfterLoad,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { RoleEntity } from '../../../../../roles/infrastructure/persistence/relational/entities/role.entity';
import { StatusEntity } from '../../../../../statuses/infrastructure/persistence/relational/entities/status.entity';
import { FileEntity } from '../../../../../files/infrastructure/persistence/relational/entities/file.entity';
import { AuthProvidersEnum } from 'src/auth/auth-providers.enum';
// We use class-transformer in ORM entity and domain entity.
// We duplicate these rules because you can choose not to use adapters
// in your project and return an ORM entity directly in response.
import { Exclude, Expose } from 'class-transformer';
import { User } from '../../../../domain/user';
import { GeneralEntity } from 'src/shared/entities/general.entity';
import { CourseEntity } from 'src/routes/courses/infastructure/persistence/relational/entities/course.entity';
import { WishlistEntity } from 'src/routes/wishlists/infastructure/persistence/relational/entities/wishlist.entity';

@Entity({
  name: 'user',
})
export class UserEntity extends GeneralEntity implements User {
  @PrimaryGeneratedColumn()
  id: number;

  // For "string | null" we need to use String type.
  // More info: https://github.com/typeorm/typeorm/issues/2567
  @Column({ type: String, unique: true, nullable: true })
  @Expose({ groups: ['me', 'admin'] })
  email: string | null;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  password?: string;

  @Exclude({ toPlainOnly: true })
  public previousPassword?: string;

  @AfterLoad()
  public loadPreviousPassword(): void {
    this.previousPassword = this.password;
  }

  @Column({ default: AuthProvidersEnum.email })
  @Expose({ groups: ['me', 'admin'] })
  provider: string;

  @Index()
  @Column({ type: 'text', nullable: true })
  @Expose({ groups: ['me', 'admin'] })
  socialId?: string | null;

  @Index()
  @Column({ type: 'text', nullable: true })
  firstName: string | null;

  @Index()
  @Column({ type: 'text', nullable: true })
  lastName: string | null;

  @ManyToOne(() => FileEntity, {
    eager: true,
  })
  photo?: FileEntity | null;

  @ManyToOne(() => RoleEntity, {
    eager: true,
  })
  role?: RoleEntity | null;

  @ManyToOne(() => StatusEntity, {
    eager: true,
  })
  status?: StatusEntity;

  @Column({ type: 'text', nullable: true })
  username?: string | null;

  @Column({ nullable: true, type: 'int' })
  learningGoal?: number | null;

  @Column({ type: 'text', nullable: true })
  title?: string | null;

  @Column({ type: 'text', nullable: true })
  bigoraphie?: string | null;

  @Column({ type: 'text', nullable: true })
  persenalWebsite?: string | null;

  @Column({ type: 'text', nullable: true })
  linkedin?: string | null;

  @Column({ type: 'text', nullable: true })
  twitter?: string | null;

  @Column({ type: 'text', nullable: true })
  facebook?: string | null;

  @Column({ type: 'text', nullable: true })
  instagram?: string | null;

  @Column({ type: 'text', nullable: true })
  whatsapp?: string | null;

  @Column({ type: 'text', nullable: true })
  youtube?: string | null;

  @ManyToMany(() => CourseEntity)
  @JoinTable()
  courses: CourseEntity[];

  @OneToOne(() => WishlistEntity)
  @JoinColumn()
  wishlist?: WishlistEntity | null;
}
