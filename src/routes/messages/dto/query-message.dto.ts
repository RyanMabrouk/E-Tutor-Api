import { SortDto } from 'src/shared/dto/sort.dto';
import { QueryDto } from 'src/shared/dto/query.dto';
import { FindOptionsWhere } from 'typeorm';
import { MessageEntity } from '../infastructure/persistence/relational/entities/message.entity';
import { Message } from '../domain/message';
import { Transform } from 'class-transformer';
import { IsNumber, IsPositive } from 'class-validator';

export type FilterMessageDto = FindOptionsWhere<MessageEntity>;

export class SortMessageDto extends SortDto<Message> {}

export class QueryMessageDto extends QueryDto<Message, FilterMessageDto> {
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsPositive()
  chatId: number;
}
