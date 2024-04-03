import { EntityRelationalHelper } from '../../utils/relational-entity-helper';
import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

export class GeneralEntity extends EntityRelationalHelper {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
