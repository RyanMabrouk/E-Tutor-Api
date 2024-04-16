import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CategoryRepository } from '../../category.repository';
import { CategoryEntity } from '../entities/category.entity';
import { CategoryMapper } from '../mappers/category.mapper';
import { NullableType } from 'src/utils/types/nullable.type';
import { Category } from 'src/routes/categories/domain/category';
import {
  FilterCategoryDto,
  SortCategoryDto,
} from 'src/routes/categories/dto/query-category.dto';

@Injectable()
export class CategoryRelationalRepository implements CategoryRepository {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async create(data: Category): Promise<Category> {
    const persistenceModel = CategoryMapper.toPersistence(data);
    const newEntity = await this.categoryRepository.save(
      this.categoryRepository.create(persistenceModel),
    );
    return CategoryMapper.toDomain(newEntity);
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterCategoryDto | null;
    sortOptions?: SortCategoryDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Category[]> {
    const entities = await this.categoryRepository
      .createQueryBuilder('languages')
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .take(paginationOptions.limit)
      .where(filterOptions ?? {})
      .orderBy(
        sortOptions?.reduce(
          (accumulator, sort) => ({
            ...accumulator,
            [`categories.${sort.orderBy}`]: sort.order,
          }),
          {},
        ) ?? {},
      )
      .getMany();
    return entities.map((category) => CategoryMapper.toDomain(category));
  }

  async findOne(
    fields: EntityCondition<Category>,
  ): Promise<NullableType<Category>> {
    const entity = await this.categoryRepository.findOne({
      where: fields as FindOptionsWhere<CategoryEntity>,
    });

    if (!entity) {
      throw new BadRequestException('Category not found');
    }

    return entity ? CategoryMapper.toDomain(entity) : null;
  }

  async update(
    id: Category['id'],
    payload: Partial<Category>,
  ): Promise<Category> {
    const entity = await this.categoryRepository.findOne({
      where: { id: Number(id) },
    });

    if (!entity) {
      throw new BadRequestException('Category not found');
    }

    const updatedEntity = await this.categoryRepository.save(
      this.categoryRepository.create(
        CategoryMapper.toPersistence({
          ...CategoryMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return CategoryMapper.toDomain(updatedEntity);
  }

  async softDelete(id: Category['id']): Promise<void> {
    await this.categoryRepository.softDelete(id);
  }
}
