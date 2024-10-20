import { GeneralEntity } from 'src/shared/entities/general.entity';
import { UserEntity } from 'src/routes/users/infrastructure/persistence/relational/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Message } from 'src/routes/messages/domain/message';
import { MessageTypes } from 'src/routes/messages/types/MessageTypes';
import { ChatEntity } from 'src/routes/chat/infastructure/persistence/relational/entities/chat.entity';
@Entity({
  name: 'message',
})
export class MessageEntity extends GeneralEntity implements Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => UserEntity, {
    eager: true,
  })
  sender: UserEntity;

  @Column({ type: 'enum', enum: MessageTypes })
  type: MessageTypes;

  @Column({ type: 'boolean', default: false })
  seen: boolean;

  @ManyToOne(() => ChatEntity, {
    eager: true,
  })
  chat: ChatEntity;
}
