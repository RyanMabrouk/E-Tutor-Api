import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { CategoriesService } from './categories.service';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'languages', version: '1' })
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoryService: CategoriesService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get()
  findAll() {
    return this.categoryService.findAll({
      paginationOptions: { page: 1, limit: 10 },
    });
  }
}
