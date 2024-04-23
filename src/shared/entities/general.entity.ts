import { EntityRelationalHelper } from '../../utils/relational-entity-helper';
import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';
import { GeneralDomain } from '../domain/general.domain';

export class GeneralEntity
  extends EntityRelationalHelper
  implements GeneralDomain
{
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
