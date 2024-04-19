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
import { successResponse } from 'src/auth/constants/response';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/routes/roles/roles.guard';
import { CreateReviewDto } from './dto/create-review.dto';
import { QueryReviewDto } from './dto/query-review.dto';
import { Review } from './domain/review';
import { UpdateReviewDto } from './dto/update-review.dto';
import { User } from 'src/shared/decorators/user.decorator';
import { JwtPayloadType } from 'src/auth/strategies/types/jwt-payload.type';
import { ReviewService } from './review.service';
import { ReviewsWithRatingCount } from './types/types';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'reviews', version: '1' })
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  async create(
    @Body() createDto: CreateReviewDto,
    @User() user: JwtPayloadType,
  ): Promise<Review> {
    const msg = await this.reviewService.create(createDto, user.id);
    return msg;
  }

  @Get()
  async findAll(
    @Query() query: QueryReviewDto,
  ): Promise<ReviewsWithRatingCount & { hasNextPage: boolean }> {
    const page = query?.page ?? 1;
    const limit = query?.limit ? (query?.limit > 50 ? 50 : query?.limit) : 10;
    try {
      const data = await this.reviewService.findAll({
        filterOptions: query?.filters ?? null,
        sortOptions: query?.sort ?? null,
        paginationOptions: {
          page,
          limit,
        },
        courseId: query?.courseId,
      });
      return {
        ...data,
        reviews: data.reviews.map(
          this.reviewService.filterColumnsHelper,
        ) as Review[],
        hasNextPage: data.reviews.length === limit,
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMsgDto: UpdateReviewDto,
    @User() user: JwtPayloadType,
  ) {
    const msg = await this.reviewService.update(id, updateMsgDto, user.id);
    return msg;
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @User() user: JwtPayloadType,
  ) {
    await this.reviewService.remove(id, user.id);
    return {
      ...successResponse,
    };
  }
}
