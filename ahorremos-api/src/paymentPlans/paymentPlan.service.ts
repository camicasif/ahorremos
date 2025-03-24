import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentPlan } from 'src/entities/paymentPlan';
import { SharedAccount } from 'src/entities/sharedAccount';
import { Payment } from 'src/entities/payment';
import { Account } from 'src/entities/account';

@Injectable()
export class PaymentPlanService {
  constructor(
    @InjectRepository(PaymentPlan)
    private readonly paymentPlanRepository: Repository<PaymentPlan>,
    @InjectRepository(SharedAccount)
    private readonly sharedAccountRepository: Repository<SharedAccount>,
    
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async createPaymentPlan(paymentPlanData: Partial<PaymentPlan>): Promise<any> {
    try {
      // Verificar que se proporcione un sharedAccount
      if (!paymentPlanData.sharedAccount) {
        throw new Error('Shared account is required');
      }
  
      // Buscar el sharedAccount en la base de datos
      const sharedAccount = await this.sharedAccountRepository.findOne({
        where: { id: paymentPlanData.sharedAccount.id }, // Buscar por el ID del sharedAccount
        relations: ['account1', 'account2'], // Incluir las relaciones de las cuentas asociadas
      });
  
      // Si no se encuentra el sharedAccount, lanzar error 404
      if (!sharedAccount) {
        return { 
          statusCode: 404,
          message: 'Shared account not found',
        };
      }
  
      // Crear el payment plan
      const savedPaymentPlan = this.paymentPlanRepository.save({
        ...paymentPlanData,
        sharedAccount,
      });



        // Calcular el número total de pagos
        const periodInDays = paymentPlanData.payment_period;
        let currentDate = new Date(paymentPlanData.initial_date);
        const endDate = new Date(paymentPlanData.end_date);
        const totalPayments = Math.ceil((endDate.getTime() - currentDate.getTime()) / (periodInDays * 86400000));
        const halfBalance = paymentPlanData.estimated_balance / 2;
        const paymentAmount = halfBalance / totalPayments;

        // Generar pagos para ambas cuentas
        const payments: Payment[] = [];
        
        while (currentDate <= endDate) {
            payments.push(
                this.paymentRepository.create({
                    account: sharedAccount.account1,
                    amount: parseFloat(paymentAmount.toFixed(2)),
                    date: new Date(currentDate),
                    is_paid: false,
                    paymentPlan: (await savedPaymentPlan),
                })
            );
            
            payments.push(
                this.paymentRepository.create({
                    account: sharedAccount.account2,
                    amount: parseFloat(paymentAmount.toFixed(2)),
                    date: new Date(currentDate),
                    is_paid: false,
                    paymentPlan: (await savedPaymentPlan),
                })
            );

            currentDate.setDate(currentDate.getDate() + periodInDays);
        }

        // Guardar los pagos en la base de datos
        await this.paymentRepository.save(payments);

  
      // Guardar el payment plan en la base de datos
     //const paymentPlanCreated=  await this.paymentPlanRepository.save(paymentPlan);
  
      // Retornar el formato que deseas
      return  savedPaymentPlan;
    } catch (error) {
      // Si hay algún error, devolver un mensaje general de error
      throw error;
    }
  }
  


  


  async getPaymentPlans(): Promise<PaymentPlan[]> {
    try {
      return await this.paymentPlanRepository.find({ relations: ['sharedAccount'] });
    } catch (error) {
      throw error;
    }
  }

  async getPaymentPlanById(id: number): Promise<PaymentPlan> {
    try {
      const paymentPlan = await this.paymentPlanRepository.findOne({
        where: { id },
        relations: ['sharedAccount'],
      });
      if (!paymentPlan) {
        throw new Error('Payment plan not found');
      }
      return paymentPlan;
    } catch (error) {
      throw error;
    }
  }

  async deletePaymentPlan(id: number): Promise<void> {
    try {
      const paymentPlan = await this.paymentPlanRepository.findOneBy({ id });
      if (!paymentPlan) {
        throw new Error('Payment plan not found');
      }
      await this.paymentPlanRepository.remove(paymentPlan);
    } catch (error) {
      throw error;
    }
  }




  async getPaymentPlansByAccountId(accountId: string): Promise<any[]> {
    try {
      // Buscar las sharedAccounts en las que participa la cuenta
      const sharedAccounts = await this.sharedAccountRepository.find({
        where: [{ account1: { id: accountId } }, { account2: { id: accountId } }],
        relations: ['account1', 'account1.user', 'account2', 'account2.user'],
      });
  
      if (!sharedAccounts.length) {
       return null;
      }
  
      // Obtener los payment plans asociados a estas sharedAccounts
      const paymentPlans = await this.paymentPlanRepository.find({
        where: sharedAccounts.map(sa => ({ sharedAccount: sa })),
        relations: ['sharedAccount', 'sharedAccount.account1', 'sharedAccount.account1.user', 'sharedAccount.account2', 'sharedAccount.account2.user'],
      });
  
      // Transformar los resultados al formato deseado
      return paymentPlans.map(plan => ({
        idPaymentPlan: plan.id,
        estimatedBalance: plan.estimated_balance,
        initialDate: plan.initial_date, // Formato YYYY-MM-DD
        endDate: plan.end_date,
        paymentPeriod: plan.payment_period,
        accounts: [
          {
            name: plan.sharedAccount.account1.user.name,
            lastname: plan.sharedAccount.account1.user.lastName,
            idAccount: plan.sharedAccount.account1.id,
          },
          {
            name: plan.sharedAccount.account2.user.name,
            lastname: plan.sharedAccount.account2.user.lastName,
            idAccount: plan.sharedAccount.account2.id,
          },
        ],
      }));
    } catch (error) {
      throw new Error(`Error al obtener los planes de pago: ${error.message}`);
    }
  }
  
  

}
