import { Category } from '../../../../domain/category';
import { GeneralEntity } from '../../../../../../shared/entities/general.entity';
import { Column, Entity, PrimaryColumn } from 'typeorm';
@Entity({
  name: 'categories',
})
export class CategoryEntity extends GeneralEntity implements Category {
  @PrimaryColumn({ unique: true, type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  color: string;
}
