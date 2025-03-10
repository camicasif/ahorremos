import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { SharedAccount } from './sharedAccount';

@Entity({ name: 'payment_plan' })
export class PaymentPlan {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => SharedAccount)
  @JoinColumn({ name: 'id_shared_account' })
  sharedAccount: SharedAccount;

  @Column({ type: 'double precision' })
  estimated_balance: number;

  @Column({ type: 'date' })
  initial_date: Date;

  @Column({ type: 'date' })
  end_date: Date;

  @Column({ type: 'int' })
  payment_period: number;
}
