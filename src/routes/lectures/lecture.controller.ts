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
import { QueryLectureDto } from './dto/query-lecture.dto';
import { Lecture } from './domain/lecture';
import { CreateLectureDto } from './dto/create-lecture.dto';
import { UpdateLectureDto } from './dto/update-lecture.dto';
import { LectureService } from './lecture.service';
import { RoleEnum } from '../roles/roles.enum';
import { Roles } from '../roles/roles.decorator';
import { User } from 'src/shared/decorators/user.decorator';
import { JwtPayloadType } from 'src/auth/strategies/types/jwt-payload.type';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'lectures', version: '1' })
export class LectureController {
  constructor(private readonly lectureService: LectureService) {}

  @Get()
  async findAll(
    @Query() query: QueryLectureDto,
  ): Promise<InfinityPaginationResultType<Lecture>> {
    const page = query?.page ?? 1;
    const limit = query?.limit ? (query?.limit > 50 ? 50 : query?.limit) : 10;
    try {
      const data = infinityPagination(
        await this.lectureService.findAll({
          filterOptions: query?.filters ?? null,
          sortOptions: query?.sort ?? null,
          paginationOptions: {
            page,
            limit,
          },
          sectionId: query.sectionId,
        }),
        { page, limit },
      );
      return data;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @User() user: JwtPayloadType) {
    return this.lectureService.findOne({ id, userId: user.id });
  }

  //create
  @Roles(RoleEnum.instructor, RoleEnum.admin)
  @Post()
  create(
    @Body() createLectureDto: CreateLectureDto,
    @User() user: JwtPayloadType,
  ) {
    return this.lectureService.create(createLectureDto, user.id);
  }

  @Roles(RoleEnum.instructor, RoleEnum.admin)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLectureDto: UpdateLectureDto,
    @User() user: JwtPayloadType,
  ) {
    return this.lectureService.update(
      { id, userId: user.id },
      updateLectureDto,
    );
  }

  @Roles(RoleEnum.instructor, RoleEnum.admin)
  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @User() user: JwtPayloadType,
  ) {
    await this.lectureService.delete({ id, userId: user.id });
    return {
      ...successResponse,
    };
  }
}
