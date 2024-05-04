import { Refund } from '../../../../domain/refund';
import { GeneralEntity } from '../../../../../../shared/entities/general.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity({
  name: 'refunds',
})
export class RefundEntity extends GeneralEntity implements Refund {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  intentPaymentId: string;

  @Column({ type: 'text', nullable: true })
  reason: string;
}
