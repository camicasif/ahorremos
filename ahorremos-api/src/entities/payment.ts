import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Account } from './account';
import { PaymentPlan } from './paymentPlan';

@Entity({ name: 'payment' })
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'id_account' })
  account: Account;


  @ManyToOne(() => PaymentPlan)
  @JoinColumn({ name: 'id_paymentPlan' })
  paymentPlan: PaymentPlan;


  @Column({ type: 'double precision' })
  amount: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'boolean' })
  is_paid: boolean;
}
