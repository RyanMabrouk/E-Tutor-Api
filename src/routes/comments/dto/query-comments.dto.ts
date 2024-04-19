import { SortDto } from 'src/shared/dto/sort.dto';
import { QueryDto } from 'src/shared/dto/query.dto';
import { FindOptionsWhere } from 'typeorm';
import { CommentEntity } from '../infastructure/persistence/relational/entities/comments.entity';
import { Comment } from '../domain/comments';
import { Transform } from 'class-transformer';
import { IsNumber, IsPositive } from 'class-validator';

export type FilterCommentDto = FindOptionsWhere<CommentEntity>;

export class SortCommentDto extends SortDto<Comment> {}

export class QueryCommentDto extends QueryDto<Comment, FilterCommentDto> {
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsPositive()
  lectureId: number;
}
