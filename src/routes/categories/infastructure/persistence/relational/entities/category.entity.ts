import { Category } from '../../../../domain/category';
import { GeneralEntity } from '../../../../../../shared/entities/general.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity({
  name: 'categories',
})
export class CategoryEntity extends GeneralEntity implements Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, type: 'text' })
  name: string;

  @Column({ type: 'text' })
  color: string;
}
