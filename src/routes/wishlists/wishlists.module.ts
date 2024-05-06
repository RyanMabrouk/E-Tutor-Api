import { forwardRef, Module } from '@nestjs/common';
import { WishlistService } from './wishlists.service';
import { WishlistController } from './wishlists.controller';
import databaseConfig from 'src/database/config/database.config';
import { DatabaseConfig } from 'src/database/config/database-config.type';
import { UsersModule } from 'src/routes/users/users.module';
import { RelationalWishlistPersistenceModule } from './infastructure/persistence/relational/relational-persistence.module';
import { ValidateMembers } from 'src/utils/validation/vlalidate-members';
import { CourseModule } from '../courses/course.module';
const infrastructurePersistenceModule = (databaseConfig() as DatabaseConfig)
  .isDocumentDatabase
  ? class DocumentWishlistPersistenceModule {}
  : RelationalWishlistPersistenceModule;
@Module({
  imports: [
    infrastructurePersistenceModule,
    forwardRef(() => UsersModule),
    CourseModule,
  ],
  controllers: [WishlistController],
  providers: [WishlistService, ValidateMembers],
  exports: [WishlistService, infrastructurePersistenceModule],
})
export class WishlistModule {}
