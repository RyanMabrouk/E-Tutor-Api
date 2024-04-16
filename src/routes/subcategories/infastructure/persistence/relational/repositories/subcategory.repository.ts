import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { FindOptionsWhere, Repository } from 'typeorm';
import { NullableType } from 'src/utils/types/nullable.type';
import {
  FilterSubcategoryDto,
  SortSubcategoryDto,
} from 'src/routes/subcategories/dto/query-subcategory.dto';
import { Subcategory } from 'src/routes/subcategories/domain/subcategory';
import { SubcategoryMapper } from '../mappers/subcategory.mapper';
import { SubcategoryEntity } from '../entities/subcategory.entity';
import { SubcategoryRepository } from '../../subcategories.repository';

@Injectable()
export class SubcategoryRelationalRepository implements SubcategoryRepository {
  constructor(
    @InjectRepository(SubcategoryEntity)
    private readonly categoryRepository: Repository<SubcategoryEntity>,
  ) {}

  async create(data: Subcategory): Promise<Subcategory> {
    const persistenceModel = SubcategoryMapper.toPersistence(data);
    const newEntity = await this.categoryRepository.save(
      this.categoryRepository.create(persistenceModel),
    );
    return SubcategoryMapper.toDomain(newEntity);
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterSubcategoryDto | null;
    sortOptions?: SortSubcategoryDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Subcategory[]> {
    const entities = await this.categoryRepository
      .createQueryBuilder('subcategories')
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .take(paginationOptions.limit)
      .where(filterOptions ?? {})
      .orderBy(
        sortOptions?.reduce(
          (accumulator, sort) => ({
            ...accumulator,
            [`subcategories.${sort.orderBy}`]: sort.order,
          }),
          {},
        ) ?? {},
      )
      .getMany();
    return entities.map((category) => SubcategoryMapper.toDomain(category));
  }

  async findOne(
    fields: EntityCondition<Subcategory>,
  ): Promise<NullableType<Subcategory>> {
    const entity = await this.categoryRepository.findOne({
      where: fields as FindOptionsWhere<SubcategoryEntity>,
    });

    if (!entity) {
      throw new BadRequestException('Subcategory not found');
    }

    return entity ? SubcategoryMapper.toDomain(entity) : null;
  }

  async update(
    id: Subcategory['id'],
    payload: Partial<Subcategory>,
  ): Promise<Subcategory> {
    const entity = await this.categoryRepository.findOne({
      where: { id: id },
    });

    if (!entity) {
      throw new BadRequestException('Subcategory not found');
    }

    const updatedEntity = await this.categoryRepository.save(
      this.categoryRepository.create(
        SubcategoryMapper.toPersistence({
          ...SubcategoryMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return SubcategoryMapper.toDomain(updatedEntity);
  }

  async softDelete(id: Subcategory['id']): Promise<void> {
    await this.categoryRepository.softDelete(id);
  }
}
