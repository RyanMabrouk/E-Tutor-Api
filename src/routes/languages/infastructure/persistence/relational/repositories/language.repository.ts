import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { FindOptionsWhere, Repository } from 'typeorm';
import { NullableType } from '../../../../../../utils/types/nullable.type';
import { LanguageRepository } from '../../language.repository';
import { LanguageEntity } from '../entities/language.entity';
import { LanguageMapper } from '../mappers/language.mapper';
import { Language } from 'src/routes/languages/domain/language';
import {
  FilterLanguageDto,
  SortLanguageDto,
} from 'src/routes/languages/dto/query-language.dto';

@Injectable()
export class LanguageRelationalRepository implements LanguageRepository {
  constructor(
    @InjectRepository(LanguageEntity)
    private readonly languageRepository: Repository<LanguageEntity>,
  ) {}

  async create(data: Language): Promise<Language> {
    const persistenceModel = LanguageMapper.toPersistence(data);
    const newEntity = await this.languageRepository.save(
      this.languageRepository.create(persistenceModel),
    );
    return LanguageMapper.toDomain(newEntity);
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterLanguageDto | null;
    sortOptions?: SortLanguageDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Language[]> {
    const tableName =
      this.languageRepository.manager.connection.getMetadata(
        LanguageEntity,
      ).tableName;
    const entities = await this.languageRepository
      .createQueryBuilder(tableName)
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .take(paginationOptions.limit)
      .where(filterOptions ?? {})
      .orderBy(
        sortOptions?.reduce(
          (accumulator, sort) => ({
            ...accumulator,
            [`${tableName}.${sort.orderBy}`]: sort.order,
          }),
          {},
        ) ?? {},
      )
      .getMany();
    return entities.map((user) => LanguageMapper.toDomain(user));
  }

  async findOne(
    fields: EntityCondition<Language>,
  ): Promise<NullableType<Language>> {
    const entity = await this.languageRepository.findOne({
      where: fields as FindOptionsWhere<LanguageEntity>,
    });

    return entity ? LanguageMapper.toDomain(entity) : null;
  }

  async update(
    id: Language['id'],
    payload: Partial<Language>,
  ): Promise<Language> {
    const entity = await this.languageRepository.findOne({
      where: { id: Number(id) },
    });

    if (!entity) {
      throw new BadRequestException('Language not found');
    }

    const updatedEntity = await this.languageRepository.save(
      this.languageRepository.create(
        LanguageMapper.toPersistence({
          ...LanguageMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return LanguageMapper.toDomain(updatedEntity);
  }

  async softDelete(id: Language['id']): Promise<void> {
    await this.languageRepository.softDelete(id);
  }
}
