import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Account } from './account';

@Entity({ name: 'shared_account' })
export class SharedAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'double precision' })
  total_amount: number;

  @Column({ type: 'date' })
  created_date: Date;

  @Column({ type: 'date', nullable: true })
  soft_delete_date?: Date;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'id_account_1' })  // Nombre único para la clave foránea
  account1: Account;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'id_account_2' })  // Nombre distinto para la segunda clave foránea
  account2: Account;
}
