import { UserMapper } from 'src/routes/users/infrastructure/persistence/relational/mappers/user.mapper';
import { ChatEntity } from '../entities/chat.entity';
import { Chat } from 'src/routes/chat/domain/chat';

export class ChatMapper {
  static toDomain(raw: Partial<ChatEntity>): Chat {
    const chat = new Chat();
    delete raw.__entity;
    Object.assign(chat, raw);
    if (raw.members) chat.members = raw.members.map(UserMapper.toDomain);
    return chat;
  }

  static toPersistence(entity: Partial<Chat>): ChatEntity {
    const chatEntity = new ChatEntity();
    Object.assign(chatEntity, entity);
    if (entity.members)
      chatEntity.members = entity.members.map(UserMapper.toPersistence);
    return chatEntity;
  }
}
