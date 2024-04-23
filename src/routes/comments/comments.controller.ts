import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { infinityPagination } from 'src/utils/infinity-pagination';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';
import { successResponse } from 'src/auth/constants/response';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/routes/roles/roles.guard';
import { CommentService } from './comments.service';
import { CreateCommentDto } from './dto/create-comments.dto';
import { JwtPayloadType } from 'src/auth/strategies/types/jwt-payload.type';
import { CommentSocketGateway } from './socket/comments-socket.gateway';
import { User } from 'src/shared/decorators/user.decorator';
import { UpdateCommentDto } from './dto/update-comments.dto';
import { QueryCommentDto } from './dto/query-comments.dto';
import { Comment } from './domain/comments';
import { CommentsWithRplies } from './types/types';
import { LectureGuard } from '../lectures/guards/lecture.guard';
import { PathToLectureId } from 'src/shared/decorators/PathToLectureId.decorator';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'commentes', version: '1' })
export class CommentController {
  constructor(
    private readonly commentesService: CommentService,
    private readonly commentesSocket: CommentSocketGateway,
  ) {}

  @Post()
  @PathToLectureId(['body', 'lecture', 'id'])
  @UseGuards(LectureGuard)
  async create(
    @Body() createDto: CreateCommentDto,
    @User() user: JwtPayloadType,
  ): Promise<Comment> {
    const result = await this.commentesService.create(createDto, user.id);
    this.commentesSocket.emitCreate(result);
    return result;
  }

  @Get()
  async findAll(
    @Query() query: QueryCommentDto,
  ): Promise<InfinityPaginationResultType<CommentsWithRplies>> {
    const page = query?.page ?? 1;
    const limit = query?.limit ? (query?.limit > 50 ? 50 : query?.limit) : 10;
    try {
      const data = infinityPagination(
        await this.commentesService.findAll({
          sortOptions: query?.sort ?? null,
          paginationOptions: {
            page,
            limit,
          },
          lectureId: query.lectureId,
        }),
        { page, limit },
      );
      return {
        ...data,
        data: [
          ...data.data.map((e) => ({
            ...this.commentesService.formatCommentResponse(e),
            replies: e.replies.map((r) =>
              this.commentesService.formatCommentResponse(r),
            ),
          })),
        ] as CommentsWithRplies[],
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateCommentDto,
    @User() user: JwtPayloadType,
  ) {
    const result = await this.commentesService.update(id, updateDto, user.id);
    if (result) {
      this.commentesSocket.emitUpdate(result);
    }
    return this.commentesService.formatCommentResponse(result);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @User() user: JwtPayloadType,
  ) {
    await this.commentesService.remove(id, user.id);
    return {
      ...successResponse,
    };
  }
}
