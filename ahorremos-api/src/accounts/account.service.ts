import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/entities/account';
import User from 'src/entities/user';
import { UserService } from 'src/users/user.service';


import { Repository } from 'typeorm';


@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private readonly userService: UserService,
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
            throw new Error('Cuenta no encontrado');
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

  async createGetCode(accountId: string): Promise<number> {
    try {
      const account: Account | null = await this.accountRepository.findOne({
        where: { id: accountId },
      });
      if (!account) {
        throw new Error('Cuenta no encontrada');
      }
      account.temporalCode = this.generateFourDigitNumber();
      await this.accountRepository.save(account);

      // Eliminar el código después de 80 segundos
      setTimeout(async () => {
        account.temporalCode = null;
        await this.accountRepository.save(account);
      }, 80000);

      return account.temporalCode;
    } catch (error) {
      throw error;
    }
  }


  async getInfoAccount(code:number):  Promise<{ accountId: string, name:string, lastName:string }>{

    try {
      const account: Account | null = await this.accountRepository.findOne({
        where: { temporalCode: code },
        relations: ['user'],
      });
      if (!account) {
        throw new Error('Cuenta no encontrada');
      }
      const user : User | null = await this.userService.getUserById(account.user.user_id);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }
      const accountId = account.id;
      const name = user.name;
      const lastName = user.lastName;

      return { accountId, name, lastName };
    } catch (error) {
      throw error;
    }
    

  }


  generateFourDigitNumber(): number {
    return Math.floor(1000 + Math.random() * 9000);
  }





}