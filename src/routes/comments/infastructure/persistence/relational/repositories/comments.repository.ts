import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CommentMapper } from '../mappers/comments.mapper';
import { CommentEntity } from '../entities/comments.entity';
import { SortCommentDto } from 'src/routes/comments/dto/query-comments.dto';
import { CommentRepository } from '../../comments.repository';
import { Comment } from 'src/routes/comments/domain/comments';
import { Lecture } from 'src/routes/lectures/domain/lecture';
import { CommentsWithRplies } from 'src/routes/comments/types/types';

@Injectable()
export class CommentRelationalRepository implements CommentRepository {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentsRepository: Repository<CommentEntity>,
  ) {}

  async create(data: Comment): Promise<Comment> {
    const persistenceModel = CommentMapper.toPersistence(data);
    const newEntity = await this.commentsRepository.save(
      this.commentsRepository.create(persistenceModel),
    );
    return CommentMapper.toDomain(newEntity);
  }

  async findManyWithPagination({
    sortOptions,
    paginationOptions,
    lectureId,
  }: {
    sortOptions?: SortCommentDto[] | null;
    paginationOptions: IPaginationOptions;
    lectureId: Lecture['id'];
  }): Promise<CommentsWithRplies[]> {
    const tableName =
      this.commentsRepository.manager.connection.getMetadata(
        CommentEntity,
      ).tableName;

    const coomentsQuery = this.commentsRepository
      .createQueryBuilder(`${tableName}`)
      .leftJoinAndSelect(`${tableName}.lecture`, `lecture`)
      .leftJoinAndSelect(`${tableName}.user`, `user`)
      .leftJoinAndSelect(`user.role`, `role`)
      .leftJoinAndSelect(`${tableName}.replyTo`, `reply`)
      .where(`lecture.id = :lectureId`, { lectureId });

    // Fetch top-level comments
    const topLevelComments = await coomentsQuery
      .clone()
      .andWhere(`${tableName}.replyToId IS NULL`)
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .take(paginationOptions.limit)
      .orderBy(
        sortOptions?.reduce(
          (accumulator, sort) => ({
            ...accumulator,
            [`${tableName}.` + sort.orderBy]: sort.order,
          }),
          {},
        ) ?? {},
      )
      .getMany();

    // Fetch replies for each top-level comment
    const replies = await coomentsQuery
      .clone()
      .andWhere(`${tableName}.replyToId IN (:...ids)`, {
        ids: topLevelComments.map((c) => c.id),
      })
      .getMany();

    return topLevelComments.map((e) => ({
      ...CommentMapper.toDomain(e),
      replies: replies
        .filter((x) => x.replyTo?.id === e.id)
        .map((x) => CommentMapper.toDomain(x)),
    }));
  }

  async findOne(fields: EntityCondition<Comment>): Promise<Comment> {
    const entity = await this.commentsRepository.findOne({
      where: fields as FindOptionsWhere<CommentEntity>,
    });
    if (!entity) {
      throw new BadRequestException('Comment not found');
    }
    return CommentMapper.toDomain(entity);
  }

  async update(id: Comment['id'], payload: Partial<Comment>): Promise<Comment> {
    const domain = await this.findOne({ id: Number(id) });
    const updatedEntity = await this.commentsRepository.save(
      this.commentsRepository.create(
        CommentMapper.toPersistence({
          ...domain,
          ...payload,
        }),
      ),
    );
    return CommentMapper.toDomain(updatedEntity);
  }

  async softDelete(id: Comment['id']): Promise<void> {
    await this.commentsRepository.softDelete(id);
  }
}
