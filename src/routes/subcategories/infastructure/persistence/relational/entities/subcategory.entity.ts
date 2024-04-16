import { Subcategory } from '../../../../domain/subcategory';
import { GeneralEntity } from '../../../../../../shared/entities/general.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CategoryEntity } from 'src/routes/categories/infastructure/persistence/relational/entities/category.entity';
@Entity({
  name: 'subcategories',
})
export class SubcategoryEntity extends GeneralEntity implements Subcategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  name: string;

  @ManyToOne(() => CategoryEntity)
  @JoinTable()
  category: CategoryEntity;
}
