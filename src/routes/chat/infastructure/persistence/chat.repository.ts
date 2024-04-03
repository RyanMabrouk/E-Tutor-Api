import { Chat } from '../../domain/chat';
import { FilterChatDto, SortChatDto } from '../../dto/query-chat.dto';
import { GeneralRepositoryType } from '../../../../shared/repositories/general.repository.type';

export abstract class ChatRepository extends GeneralRepositoryType<
  Chat,
  FilterChatDto,
  SortChatDto,
  Chat['id']
> {}
