import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { User } from '../users/domain/user';
import { CreateCommentDto } from './dto/create-comments.dto';
import { CommentRepository } from './infastructure/persistence/comments.repository';
import { Comment } from './domain/comments';
import { FilterCommentDto, SortCommentDto } from './dto/query-comments.dto';
import { Lecture } from '../lectures/domain/lecture';
import { UpdateCommentDto } from './dto/update-comments.dto';
import { UsersService } from '../users/users.service';
import { filterColumnsHelper } from 'src/shared/helpers/filterColumnsHelper';
import { CommentsWithRplies } from './types/types';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentsRepository: CommentRepository,
    private readonly usersService: UsersService,
  ) {}

  async create(
    createPayload: CreateCommentDto,
    userId: User['id'],
  ): Promise<Comment> {
    const validationPromises: Promise<any>[] = [
      this.usersService.findOne({ id: userId }),
    ];
    if (createPayload.replyTo) {
      validationPromises.push(
        this.commentsRepository.findOne({
          id: createPayload.replyTo.id,
        }),
      );
    }
    await Promise.all(validationPromises);
    try {
      const created = await this.commentsRepository.create({
        ...createPayload,
        user: { id: userId } as User,
      });
      return created;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async findAll({
    sortOptions,
    paginationOptions,
    lectureId,
  }: {
    filterOptions?: FilterCommentDto | null;
    sortOptions?: SortCommentDto[] | null;
    paginationOptions: IPaginationOptions;
    lectureId: Lecture['id'];
  }): Promise<CommentsWithRplies[]> {
    return this.commentsRepository.findManyWithPagination({
      sortOptions,
      paginationOptions,
      lectureId,
    });
  }

  async update(
    id: number,
    updatePayload: UpdateCommentDto,
    userId: User['id'],
  ): Promise<Comment> {
    await this.validateUserHasAccess({ userId, commentId: id });
    try {
      const updated = await this.commentsRepository.update(id, updatePayload);
      return updated;
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: err.message,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async remove(id: number, userId: User['id']) {
    await this.validateUserHasAccess({ userId, commentId: id });
    await this.commentsRepository.softDelete(id);
  }

  async validateUserHasAccess({
    userId,
    commentId,
  }: {
    userId: User['id'];
    commentId: Comment['id'];
  }): Promise<void> {
    const comment = await this.commentsRepository.findOne({ id: commentId });
    if (comment.user.id !== userId) {
      throw new HttpException(
        'You do not have access to this comment',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  formatCommentResponse(comment: Comment) {
    return {
      ...filterColumnsHelper<Comment>({
        data: comment,
        columnsToOmit: ['lecture'],
      }),
      user: filterColumnsHelper<User>({
        data: comment.user,
        columnsToPick: ['id', 'firstName', 'lastName', 'username', 'role'],
      }),
    };
  }
}
