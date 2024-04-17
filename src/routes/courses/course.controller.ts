import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { successResponse } from 'src/auth/constants/response';
import { infinityPagination } from 'src/utils/infinity-pagination';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';
import { QueryCourseDto } from './dto/query-course.dto';
import { Course } from './domain/course';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'courses', version: '1' })
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get()
  async findAll(
    @Query() query: QueryCourseDto,
  ): Promise<InfinityPaginationResultType<Course>> {
    const page = query?.page ?? 1;
    const limit = query?.limit ? (query?.limit > 50 ? 50 : query?.limit) : 10;
    try {
      const data = infinityPagination(
        await this.courseService.findAll({
          filterOptions: query?.filters ?? null,
          sortOptions: query?.sort ?? null,
          paginationOptions: {
            page,
            limit,
          },
        }),
        { page, limit },
      );
      return data;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.courseService.findOne({ id });
  }

  //create
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.courseService.create(createCourseDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCourseDto,
  ) {
    return this.courseService.update({ id }, updateCategoryDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.courseService.delete({ id });
    return {
      ...successResponse,
    };
  }
}
