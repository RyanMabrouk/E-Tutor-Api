import { GeneralEntity } from 'src/shared/entities/general.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Language } from 'src/routes/languages/domain/language';
@Entity({
  name: 'language',
})
export class LanguageEntity extends GeneralEntity implements Language {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, type: 'varchar' })
  name: string;
}
