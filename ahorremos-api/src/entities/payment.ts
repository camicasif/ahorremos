import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Account } from './account';

@Entity({ name: 'payment' })
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'id_account' })
  account: Account;

  @Column({ type: 'double precision' })
  amount: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'boolean' })
  is_paid: boolean;
}
