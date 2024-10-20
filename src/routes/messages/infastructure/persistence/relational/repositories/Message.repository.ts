import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { FindOptionsWhere, Repository } from 'typeorm';
import { MessageRepository } from '../../Message.repository';
import { MessageEntity } from '../entities/message.entity';
import {
  FilterMessageDto,
  SortMessageDto,
} from 'src/routes/messages/dto/query-message.dto';
import { Message } from 'src/routes/messages/domain/message';
import { MessageMapper } from '../mappers/message.mapper';

@Injectable()
export class MessageRelationalRepository implements MessageRepository {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly msgRepository: Repository<MessageEntity>,
  ) {}

  async create(data: Message): Promise<Message> {
    const persistenceModel = MessageMapper.toPersistence(data);
    const newEntity = await this.msgRepository.save(
      this.msgRepository.create(persistenceModel),
    );
    return MessageMapper.toDomain(newEntity);
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterMessageDto | null;
    sortOptions?: SortMessageDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Message[]> {
    const tableName =
      this.msgRepository.manager.connection.getMetadata(
        MessageEntity,
      ).tableName;
    const entities = await this.msgRepository
      .createQueryBuilder(tableName)
      .leftJoinAndSelect(`${tableName}.sender`, 'user')
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .take(paginationOptions.limit)
      .where(filterOptions ?? {})
      .orderBy(
        sortOptions?.reduce(
          (accumulator, sort) => ({
            ...accumulator,
            [`${tableName}.${sort.orderBy}`]: sort.order,
          }),
          {},
        ) ?? {},
      )
      .getMany();
    return entities.map((user) => MessageMapper.toDomain(user));
  }

  async findOne(fields: EntityCondition<Message>): Promise<Message> {
    const entity = await this.msgRepository.findOne({
      where: fields as FindOptionsWhere<MessageEntity>,
    });
    if (!entity) {
      throw new BadRequestException('Message not found');
    }
    return MessageMapper.toDomain(entity);
  }

  async update(id: Message['id'], payload: Partial<Message>): Promise<Message> {
    const domain = await this.findOne({ id: Number(id) });
    const updatedEntity = await this.msgRepository.save(
      this.msgRepository.create(
        MessageMapper.toPersistence({
          ...domain,
          ...payload,
        }),
      ),
    );
    return MessageMapper.toDomain(updatedEntity);
  }

  async softDelete(id: Message['id']): Promise<void> {
    await this.msgRepository.softDelete(id);
  }
}
