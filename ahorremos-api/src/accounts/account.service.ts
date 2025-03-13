import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/entities/account';
import User from 'src/entities/user';


import { Repository } from 'typeorm';


@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async saveAccount(accountData: Partial<Account>): Promise<Account> {
    try {
    
      const account: Account = this.accountRepository.create(accountData);
      await this.accountRepository.save(account);
      return account;
    } catch (error) {
      throw error;
    }
  }

  
  async findAccountByUser(userSent: User): Promise<Account>{
      try {

          const account: Account | null =  await this.accountRepository.findOne({
            where: { user: userSent }
        });
          if (!account) {
            throw new Error('Usuario no encontrado');
          }
          return account
        } catch (error) {
          throw error;
        }
    }


  async getAccounts(): Promise<Account[]> {
    try {
      const account: Account[] = await this.accountRepository.find();
      return account;
    } catch (error) {
      throw error;
    }
  }





}