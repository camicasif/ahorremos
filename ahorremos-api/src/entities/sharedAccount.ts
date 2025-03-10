import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
}
