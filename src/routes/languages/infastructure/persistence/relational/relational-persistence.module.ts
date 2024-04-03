import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LanguageEntity } from './entities/language.entity';
import { LanguageRepository } from '../language.repository';
import { LanguageRelationalRepository } from './repositories/language.repository';

@Module({
  imports: [TypeOrmModule.forFeature([LanguageEntity])],
  providers: [
    {
      provide: LanguageRepository,
      useClass: LanguageRelationalRepository,
    },
  ],
  exports: [LanguageRepository],
})
export class RelationalMessagePersistenceModule {}
