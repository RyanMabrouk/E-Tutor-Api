import { UserMapper } from 'src/routes/users/infrastructure/persistence/relational/mappers/user.mapper';
import { Wishlist } from 'src/routes/wishlists/domain/wishlist';
import { WishlistEntity } from '../entities/wishlist.entity';

export class WishlistMapper {
  static toDomain(raw: Partial<WishlistEntity>): Wishlist {
    const wishlist = new Wishlist();
    delete raw.__entity;
    Object.assign(wishlist, raw);
    if (raw.user) wishlist.user = UserMapper.toDomain(raw.user);
    return wishlist;
  }

  static toPersistence(entity: Partial<Wishlist>): WishlistEntity {
    const wishlistEntity = new WishlistEntity();
    Object.assign(wishlistEntity, entity);
    if (entity.user)
      wishlistEntity.user = UserMapper.toPersistence(entity.user);
    return wishlistEntity;
  }
}
