import { GeneralEntity } from 'src/shared/entities/general.entity';
import { UserEntity } from 'src/routes/users/infrastructure/persistence/relational/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Notification } from 'src/routes/notifications/domain/notifications';
@Entity({
  name: 'notification',
})
export class NotificationEntity extends GeneralEntity implements Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  content: string;

  @ManyToMany(() => UserEntity, {
    eager: true,
  })
  @JoinTable()
  receivers: UserEntity[];

  @ManyToOne(() => UserEntity, {
    eager: true,
  })
  sender: UserEntity;

  @Column({ type: 'boolean', default: false })
  seen: boolean;
}
