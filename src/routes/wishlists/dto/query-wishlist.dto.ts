import { SortDto } from 'src/shared/dto/sort.dto';
import { QueryDto } from 'src/shared/dto/query.dto';
import { FindOptionsWhere } from 'typeorm';
import { Wishlist } from '../domain/wishlist';
import { WishlistEntity } from '../infastructure/persistence/relational/entities/wishlist.entity';

export type FilterWishlistDto = FindOptionsWhere<WishlistEntity>;

export class SortWishlistDto extends SortDto<Wishlist> {}

export class QueryWishlistDto extends QueryDto<Wishlist, FilterWishlistDto> {}
