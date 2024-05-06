import { Wishlist } from '../../domain/wishlist';
import {
  FilterWishlistDto,
  SortWishlistDto,
} from '../../dto/query-wishlist.dto';
import { GeneralRepositoryType } from '../../../../shared/repositories/general.repository.type';

export abstract class WishlistRepository extends GeneralRepositoryType<
  Wishlist,
  FilterWishlistDto,
  SortWishlistDto,
  Wishlist['id']
> {}
