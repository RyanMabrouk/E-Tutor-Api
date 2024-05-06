import { GeneralEntity } from 'src/shared/entities/general.entity';
import { UserEntity } from 'src/routes/users/infrastructure/persistence/relational/entities/user.entity';
import {
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Wishlist } from 'src/routes/wishlists/domain/wishlist';
import { CourseEntity } from 'src/routes/courses/infastructure/persistence/relational/entities/course.entity';
@Entity({
  name: 'wishlists',
})
export class WishlistEntity extends GeneralEntity implements Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => CourseEntity)
  @JoinTable()
  courses: CourseEntity[];

  @OneToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;
}
