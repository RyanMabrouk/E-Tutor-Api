import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { FindOptionsWhere, Repository } from 'typeorm';
import { WishlistRepository } from '../../wishlist.repository';
import { WishlistEntity } from '../entities/wishlist.entity';
import { WishlistMapper } from '../mappers/wishlist.mapper';
import { Wishlist } from 'src/routes/wishlists/domain/wishlist';
import {
  FilterWishlistDto,
  SortWishlistDto,
} from 'src/routes/wishlists/dto/query-wishlist.dto';

@Injectable()
export class WishlistRelationalRepository implements WishlistRepository {
  constructor(
    @InjectRepository(WishlistEntity)
    private readonly wishlistRepository: Repository<WishlistEntity>,
  ) {}

  async create(data: Wishlist): Promise<Wishlist> {
    const persistenceModel = WishlistMapper.toPersistence(data);
    const newEntity = await this.wishlistRepository.save(
      this.wishlistRepository.create(persistenceModel),
    );
    return WishlistMapper.toDomain(newEntity);
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterWishlistDto | null;
    sortOptions?: SortWishlistDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Wishlist[]> {
    const entities = await this.wishlistRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: filterOptions ?? {},
      order: sortOptions?.reduce(
        (accumulator, sort) => ({
          ...accumulator,
          [sort.orderBy]: sort.order,
        }),
        {},
      ),
    });

    return entities.map((user) => WishlistMapper.toDomain(user));
  }

  async findOne(
    fields: EntityCondition<Wishlist>,
    relations?: string[],
  ): Promise<Wishlist> {
    const entity = await this.wishlistRepository.findOne({
      where: fields as FindOptionsWhere<WishlistEntity>,
      relations,
    });
    if (!entity) {
      throw new BadRequestException('Wishlist not found');
    }
    return WishlistMapper.toDomain(entity);
  }

  async update(
    id: Wishlist['id'],
    payload: Partial<Wishlist>,
  ): Promise<Wishlist> {
    const domain = await this.findOne({
      id: Number(id),
    });
    const updatedEntity = await this.wishlistRepository.save(
      this.wishlistRepository.create(
        WishlistMapper.toPersistence({
          ...domain,
          ...payload,
        }),
      ),
    );

    return WishlistMapper.toDomain(updatedEntity);
  }

  async softDelete(id: Wishlist['id']): Promise<void> {
    await this.wishlistRepository.softDelete(id);
  }
}
