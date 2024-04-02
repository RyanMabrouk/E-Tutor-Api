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
import { LanguageService } from './language.service';
import { CreateLanguageDto } from './dto/create-language.dto';
import { QueryLanguageDto } from './dto/query-language.dto';
import { Language } from './domain/language';
import { UpdateLanguageDto } from './dto/update-language.dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'language', version: '1' })
export class LanguageController {
  constructor(private readonly langService: LanguageService) {}

  @Post()
  async create(@Body() createDto: CreateLanguageDto): Promise<Language> {
    const lang = await this.langService.create(createDto);
    return lang;
  }

  @Get()
  async findAll(
    @Query() query: QueryLanguageDto,
  ): Promise<InfinityPaginationResultType<Language>> {
    const page = query?.page ?? 1;
    const limit = query?.limit ? (query?.limit > 50 ? 50 : query?.limit) : 10;
    try {
      const data = infinityPagination(
        await this.langService.findAll({
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
  @Get(':languageId')
  async findOne(
    @Param('languageId', ParseIntPipe) languageId: number,
  ): Promise<Language | null> {
    try {
      const data = await this.langService.findOne({
        id: languageId,
      });

      return data;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMsgDto: UpdateLanguageDto,
  ) {
    const lang = await this.langService.update(id, updateMsgDto);
    return lang;
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.langService.remove(id);
    return {
      ...successResponse,
    };
  }
}
