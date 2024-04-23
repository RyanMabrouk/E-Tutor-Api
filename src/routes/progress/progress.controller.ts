import {
  // BadRequestException,
  Body,
  Controller,
  // Delete,
  // Get,
  // Param,
  // ParseIntPipe,
  // Patch,
  Post,
  // Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
// import { successResponse } from 'src/auth/constants/response';
// import { infinityPagination } from 'src/utils/infinity-pagination';
// import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';
import { ProgressService } from './progress.service';
// import { QueryProgressDto } from './dto/query-progress.dto';
// import { Progress } from './domain/progress';
import { CreateProgressDto } from './dto/create-progress.dto';
// import { UpdateProgressDto } from './dto/update-progress.dto';
import { RoleEnum } from '../roles/roles.enum';
import { Roles } from '../roles/roles.decorator';
// import { JwtPayloadType } from 'src/auth/strategies/types/jwt-payload.type';
// import { User } from 'src/shared/decorators/user.decorator';
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'progress', version: '1' })
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  // @Get()
  // async findAll(
  //   @Query() query: QuerySectionDto,
  // ): Promise<InfinityPaginationResultType<Section>> {
  //   const page = query?.page ?? 1;
  //   const limit = query?.limit ? (query?.limit > 50 ? 50 : query?.limit) : 10;
  //   try {
  //     const data = infinityPagination(
  //       await this.sectionService.findAll({
  //         filterOptions: query?.filters ?? null,
  //         sortOptions: query?.sort ?? null,
  //         paginationOptions: {
  //           page,
  //           limit,
  //         },
  //         courseId: query.courseId,
  //       }),
  //       { page, limit },
  //     );
  //     return data;
  //   } catch (err) {
  //     throw new BadRequestException(err.message);
  //   }
  // }

  // @Get(':id')
  // findOne(@Param('id', ParseIntPipe) id: number) {
  //   return this.sectionService.findOne({ id });
  // }

  //create
  @Roles(RoleEnum.instructor, RoleEnum.admin)
  @Post()
  create(@Body() createProgressDto: CreateProgressDto) {
    console.log(createProgressDto);
    return this.progressService.create(createProgressDto);
  }

  // @Roles(RoleEnum.instructor, RoleEnum.admin)
  // @Patch(':id')
  // update(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() updateSectionDto: UpdateSectionDto,
  //   @User() user: JwtPayloadType,
  // ) {
  //   return this.sectionService.update(
  //     { id, userId: user.id },
  //     updateSectionDto,
  //   );
  // }

  // @Roles(RoleEnum.instructor, RoleEnum.admin)
  // @Delete(':id')
  // async delete(
  //   @Param('id', ParseIntPipe) id: number,
  //   @User() user: JwtPayloadType,
  // ) {
  //   await this.sectionService.delete({ id, userId: user.id });
  //   return {
  //     ...successResponse,
  //   };
  // }
}
