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
      const savedSharedAccount = await this.sharedAccountRepository.save(sharedAccountData);
      
      // Asegurarte de que savedSharedAccount.account1 y savedSharedAccount.account2 sean solo IDs de tipo string
      const account1Id = savedSharedAccount.account1 instanceof Account ? savedSharedAccount.account1.id : savedSharedAccount.account1;
      const account2Id = savedSharedAccount.account2 instanceof Account ? savedSharedAccount.account2.id : savedSharedAccount.account2;
  
      // Obtener las cuentas asociadas por ID (ahora que sabemos que son strings)
      const account1 = await this.accountRepository.findOne({ where: { id: account1Id }, relations: ['user'] });
      const account2 = await this.accountRepository.findOne({ where: { id: account2Id }, relations: ['user'] });
  
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
            idAccount: account1.id,  // Aquí debería estar `account1.id`
            balance: account1.balance,
            name: account1.user.name,
            lastname: account1.user.lastName,
          },
          {
            idAccount: account2.id,  // Aquí debería estar `account2.id`
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



  async getSharedAccountByIdAccount(id: string): Promise<any> {
    try {
        const sharedAccount = await this.sharedAccountRepository.findOne({
            where: [
                { account1: { id: id } },
                { account2: { id: id } }
            ],
            relations: ['account1', 'account2'],
        });

        if (!sharedAccount) {
            return {
                statusCode: 404,
                error: "Shared account not found",
            };
        }


        const account1 = await this.accountRepository.findOne({ where: { id: sharedAccount.account1.id }, relations: ['user'] });
        const account2 = await this.accountRepository.findOne({ where: { id: sharedAccount.account2.id }, relations: ['user'] });
    

        return {
            statusCode: 200,
            sharedAccountId: sharedAccount.id,
            totalAmount: sharedAccount.total_amount,
            accounts: [
                account1 && {
                    idAccount: account1.id,
                    balance: account1.balance,
                    name: account1.user.name,
                    lastname: account1.user.lastName,
                },
                account2 && {
                    idAccount: account2.id,
                    balance: account2.balance,
                    name: account2.user.name,
                    lastname: account2.user.lastName,
                },
            ].filter(Boolean), // Filtrar valores nulos en caso de que una cuenta sea null
        };
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