import { Coupon } from '../../../../domain/coupon';
import { GeneralEntity } from '../../../../../../shared/entities/general.entity';
import {
  Column,
  Entity,
  Index,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity({
  name: 'coupons',
})
export class CouponEntity extends GeneralEntity implements Coupon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  expiryDate: Date;

  @Column()
  value: number;

  @Column({ default: 0, nullable: true })
  numberOfUses: number;

  @Column()
  @PrimaryColumn()
  @Index({ unique: true })
  code: string;
}
