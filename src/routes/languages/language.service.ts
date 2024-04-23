import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { LanguageRepository } from './infastructure/persistence/language.repository';
import { Language } from './domain/language';
import { CreateLanguageDto } from './dto/create-language.dto';
import { FilterLanguageDto, SortLanguageDto } from './dto/query-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';

@Injectable()
export class LanguageService {
  constructor(private readonly langRepository: LanguageRepository) {}

  async create(createPayload: CreateLanguageDto): Promise<Language> {
    try {
      const created = await this.langRepository.create({
        ...createPayload,
      });
      return created;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async findAll({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterLanguageDto | null;
    sortOptions?: SortLanguageDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Language[]> {
    return this.langRepository.findManyWithPagination({
      filterOptions: { ...filterOptions },
      sortOptions,
      paginationOptions,
    });
  }
  async findOne({ id: id }: { id: number }): Promise<Language> {
    console.log(id);
    return this.langRepository.findOne({ id: id });
  }

  async update(
    id: number,
    updatePayload: UpdateLanguageDto,
  ): Promise<Language | null> {
    try {
      const updated = await this.langRepository.update(id, updatePayload);
      return updated;
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            id: 'Language doesnt exist',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async remove(id: number) {
    await this.langRepository.softDelete(id);
  }
}
