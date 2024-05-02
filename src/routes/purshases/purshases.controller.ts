import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { PurshasesService } from './purshases.service';
import { CreatePurshaseDto } from './dto/create-purshase.dto';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/shared/decorators/user.decorator';
import { JwtPayloadType } from 'src/auth/strategies/types/jwt-payload.type';

@ApiTags('purshases')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'purshase', version: '1' })
export class PurshasesController {
  constructor(private readonly purshasesService: PurshasesService) {}

  @Post()
  create(@Body() cart: CreatePurshaseDto, @User() user: JwtPayloadType) {
    console.log(user);
    return this.purshasesService.create(cart, user);
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
