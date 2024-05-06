import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishlistEntity } from './entities/wishlist.entity';
import { WishlistRepository } from '../wishlist.repository';
import { WishlistRelationalRepository } from './repositories/wihslist.repository';

@Module({
  imports: [TypeOrmModule.forFeature([WishlistEntity])],
  providers: [
    {
      provide: WishlistRepository,
      useClass: WishlistRelationalRepository,
    },
  ],
  exports: [WishlistRepository],
})
export class RelationalWishlistPersistenceModule {}
