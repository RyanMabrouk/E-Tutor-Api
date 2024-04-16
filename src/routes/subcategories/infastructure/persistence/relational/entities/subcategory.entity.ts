import { Subcategory } from '../../../../domain/subcategory';
import { GeneralEntity } from '../../../../../../shared/entities/general.entity';
import { Column, Entity, PrimaryColumn } from 'typeorm';
@Entity({
  name: 'subcategories',
})
export class SubcategoryEntity extends GeneralEntity implements Subcategory {
  @PrimaryColumn({ unique: true, type: 'varchar' })
  id: number;

  @Column({ type: 'varchar' })
  name: string;
}
