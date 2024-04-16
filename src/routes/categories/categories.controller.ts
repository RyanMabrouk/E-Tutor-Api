import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'languages', version: '1' })
@Controller('categories')
export class CategoriesController {
  //   constructor(private readonly langService: LanguageService) {}
}
