import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Account } from 'src/entities/account';
import { SharedAccount } from 'src/entities/sharedAccount';

@Injectable()
export class SharedAccountService {
  constructor(
    @InjectRepository(SharedAccount)
    private readonly sharedAccountRepository: Repository<SharedAccount>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async createSharedAccount(sharedAccountData: Partial<SharedAccount>): Promise<any> {
    try {
      // Crear la nueva cuenta compartida
      const newSharedAccount = this.sharedAccountRepository.create(sharedAccountData);
      const savedSharedAccount = await this.sharedAccountRepository.save(newSharedAccount);

      // Obtener las cuentas asociadas
      const account1 = await this.accountRepository.findOne({ where: { id: sharedAccountData.account1.id } });
      const account2 = await this.accountRepository.findOne({ where: { id: sharedAccountData.account2.id } });

      // Verificar que ambas cuentas existan
      if (!account1 || !account2) {
        throw new NotFoundException('Una o ambas cuentas asociadas no fueron encontradas');
      }

      // Formatear la respuesta según lo solicitado
      return {
        sharedAccountId: savedSharedAccount.id,
        totalAmount: savedSharedAccount.total_amount,
        accounts: [
          {
            idAccount: account1.id,
            balance: account1.balance,
            name: account1.user.name,
            lastname: account1.user.lastName,
          },
          {
            idAccount: account2.id,
            balance: account2.balance,
            name: account2.user.name,
            lastname: account2.user.lastName,
          },
        ],
      };
    } catch (error) {
      throw error;
    }
  }

  async getAllSharedAccounts(): Promise<SharedAccount[]> {
    try {
      return await this.sharedAccountRepository.find({ relations: ['account1', 'account2'] });
    } catch (error) {
      throw error;
    }
  }

  async getSharedAccountById(id: string): Promise<SharedAccount> {
    try {
      const sharedAccount = await this.sharedAccountRepository.findOne({
        where: { id },
        relations: ['account1', 'account2'],
      });
      if (!sharedAccount) {
        throw new Error('Shared account not found');
      }
      return sharedAccount;
    } catch (error) {
      throw error;
    }
  }

  async deleteSharedAccount(id: string): Promise<void> {
    try {
      const sharedAccount = await this.sharedAccountRepository.findOneBy({ id });
      if (!sharedAccount) {
        throw new Error('Shared account not found');
      }
      await this.sharedAccountRepository.remove(sharedAccount);
    } catch (error) {
      throw error;
    }
  }
}