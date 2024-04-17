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
import { Category } from 'src/routes/categories/domain/category';
import { CategoryEntity } from 'src/routes/categories/infastructure/persistence/relational/entities/category.entity';

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
    categoryId,
  }: {
    filterOptions?: FilterSubcategoryDto | null;
    sortOptions?: SortSubcategoryDto[] | null;
    paginationOptions: IPaginationOptions;
    categoryId?: Category['id'];
  }): Promise<Subcategory[]> {
    const tableName =
      this.categoryRepository.manager.connection.getMetadata(
        SubcategoryEntity,
      ).tableName;
    const CategoryTableName =
      this.categoryRepository.manager.connection.getMetadata(
        CategoryEntity,
      ).tableName;
    const entities = await this.categoryRepository
      .createQueryBuilder(tableName)
      .innerJoinAndSelect(
        `${tableName}.category`,
        CategoryTableName,
        `${CategoryTableName}.id = :categoryId`,
        { categoryId },
      )
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
    return entities.map((subcategory) => {
      if (subcategory.hasOwnProperty('category')) {
        delete (subcategory as { category?: unknown }).category;
      }
      return SubcategoryMapper.toDomain(subcategory);
    });
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
