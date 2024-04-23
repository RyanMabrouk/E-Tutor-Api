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
import { SectionService } from './section.service';
import { QuerySectionDto } from './dto/query-section.dto';
import { Section } from './domain/section';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { RoleEnum } from '../roles/roles.enum';
import { Roles } from '../roles/roles.decorator';
import { JwtPayloadType } from 'src/auth/strategies/types/jwt-payload.type';
import { User } from 'src/shared/decorators/user.decorator';
import { filterColumnsHelper } from 'src/shared/helpers/filterColumnsHelper';
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'sections', version: '1' })
export class SectionController {
  constructor(private readonly sectionService: SectionService) {}

  @Get()
  async findAll(
    @Query() query: QuerySectionDto,
  ): Promise<InfinityPaginationResultType<Section>> {
    const page = query?.page ?? 1;
    const limit = query?.limit ? (query?.limit > 50 ? 50 : query?.limit) : 10;
    try {
      const data = infinityPagination(
        await this.sectionService.findAll({
          filterOptions: query?.filters ?? null,
          sortOptions: query?.sort ?? null,
          paginationOptions: {
            page,
            limit,
          },
          courseId: query.courseId,
        }),
        { page, limit },
      );
      return data;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.sectionService.findOne({ id });
    return filterColumnsHelper({ data, columnsToOmit: ['course'] });
  }

  //create
  @Roles(RoleEnum.instructor, RoleEnum.admin)
  @Post()
  create(
    @Body() createSectionDto: CreateSectionDto,
    @User() user: JwtPayloadType,
  ) {
    return this.sectionService.create(createSectionDto, user.id);
  }

  @Roles(RoleEnum.instructor, RoleEnum.admin)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSectionDto: UpdateSectionDto,
    @User() user: JwtPayloadType,
  ) {
    return this.sectionService.update(
      { id, userId: user.id },
      updateSectionDto,
    );
  }

  @Roles(RoleEnum.instructor, RoleEnum.admin)
  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @User() user: JwtPayloadType,
  ) {
    await this.sectionService.delete({ id, userId: user.id });
    return {
      ...successResponse,
    };
  }
}
