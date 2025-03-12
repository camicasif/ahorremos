import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Account } from './account';
import { SharedAccount } from './sharedAccount';

@Entity({ name: 'shared_account_members' })
export class SharedAccountMembers {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'id_account' })
  account: Account;

  @ManyToOne(() => SharedAccount)
  @JoinColumn({ name: 'id_shared_account' })
  sharedAccount: SharedAccount;
}
