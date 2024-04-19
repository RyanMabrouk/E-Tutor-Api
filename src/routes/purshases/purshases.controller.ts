import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { PurshasesService } from './purshases.service';
import { CreatePurshaseDto } from './dto/create-purshase.dto';
// import { QueryCategoryDto } from './dto/query-category.dto';
// import { InfinityPaginationResultType } from '../../utils/types/infinity-pagination-result.type';
// import { infinityPagination } from '../../utils/infinity-pagination';
// import { Category } from './domain/purshase';
// import { UpdateCategoryDto } from './dto/update-category.dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'stripe', version: '1' })
export class PurshasesController {
  constructor(private readonly purshasesService: PurshasesService) {}

  @Post()
  chekout(@Body() cart: CreatePurshaseDto[]) {
    return this.purshasesService.checkout(cart);
  }

  // @Get()
  // async findAll(
  //   @Query() query: QueryCategoryDto,
  // ): Promise<InfinityPaginationResultType<Category>> {
  //   const page = query?.page ?? 1;
  //   const limit = query?.limit ? (query?.limit > 50 ? 50 : query?.limit) : 10;
  //   try {
  //     const data = infinityPagination(
  //       await this.categoryService.findAll({
  //         filterOptions: query?.filters ?? null,
  //         sortOptions: query?.sort ?? null,
  //         paginationOptions: {
  //           page,
  //           limit,
  //         },
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
  //   return this.categoryService.findOne({ id });
  // }

  // @Post()
  // create(@Body() createCategoryDto: CreateCategoryDto) {
  //   console.log(createCategoryDto);
  //   return this.categoryService.create(createCategoryDto);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() updateCategoryDto: UpdateCategoryDto,
  // ) {
  //   console.log(id);
  //   console.log(updateCategoryDto);
  //   return this.categoryService.update({ id }, updateCategoryDto);
  // }

  // @Delete(':id')
  // delete(@Param('id', ParseIntPipe) id: number) {
  //   return this.categoryService.delete({ id });
  // }
}
