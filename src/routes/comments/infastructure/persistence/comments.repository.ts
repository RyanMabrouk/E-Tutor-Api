import { GeneralRepositoryType } from 'src/shared/repositories/general.repository.type';
import { Comment } from '../../domain/comments';
import { FilterCommentDto, SortCommentDto } from '../../dto/query-comments.dto';
import { Lecture } from 'src/routes/lectures/domain/lecture';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { CommentsWithRplies } from '../../types/types';

export abstract class CommentRepository extends GeneralRepositoryType<
  Comment,
  FilterCommentDto,
  SortCommentDto,
  Comment['id']
> {
  abstract findManyWithPagination({
    sortOptions,
    paginationOptions,
    lectureId,
  }: {
    sortOptions?: SortCommentDto[] | null;
    paginationOptions: IPaginationOptions;
    lectureId: Lecture['id'];
  }): Promise<CommentsWithRplies[]>;
}
