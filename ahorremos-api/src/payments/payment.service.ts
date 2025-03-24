import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from 'src/entities/payment';
import { Account } from 'src/entities/account';
import { SharedAccount } from 'src/entities/sharedAccount';
import { PaymentPlan } from 'src/entities/paymentPlan';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(SharedAccount)
    private readonly sharedAccountRepository: Repository<SharedAccount>,
    @InjectRepository(PaymentPlan)
        private readonly paymentPlanRepository: Repository<PaymentPlan>,
  ) {}

  async savePayment(paymentData: Partial<Payment>): Promise<Payment> {
    try {
      if (!paymentData.account) {
        throw new Error('Cuenta es requerida para el pago');
      }
      
      const account = await this.accountRepository.findOne({ where: { id: paymentData.account.id } });
      if (!account) {
        throw new Error('Cuenta no encontrada');
      }
      
      const payment = this.paymentRepository.create(paymentData);
      return await this.paymentRepository.save(payment);
    } catch (error) {
      throw error;
    }
  }

  async getPayments(): Promise<Payment[]> {
    try {
      return await this.paymentRepository.find({ relations: ['account'] });
    } catch (error) {
      throw error;
    }
  }

  async getPaymentById(paymentId: number): Promise<Payment> {
    try {
      const payment = await this.paymentRepository.findOne({ where: { id: paymentId }, relations: ['account'] });
      if (!payment) {
        throw new Error('Pago no encontrado');
      }
      return payment;
    } catch (error) {
      throw error;
    }
  }

  async getPaymentsByAccountId(accountId: string): Promise<Payment[]> {
    try {
      const payment = await this.paymentRepository.find({
        where: { account: { id: accountId } } as any, // Se usa 'as any' para evitar problemas con el tipado
        relations: ['account'], // Asegura que la relación 'account' se cargue correctamente
      });
  
      if (!payment) {
        throw new Error('Pago no encontrado');
      }
  
      return payment;
    } catch (error) {
      throw new Error(`Error al obtener el pago: ${error.message}`);
    }
  }



  
  
  

  async deletePayment(paymentId: number): Promise<void> {
    try {
      const payment = await this.paymentRepository.findOne({ where: { id: paymentId } });
      if (!payment) {
        throw new Error('Pago no encontrado');
      }
      await this.paymentRepository.remove(payment);
    } catch (error) {
      throw error;
    }
  }

  async updatePayment(paymentId: number, updateData: Partial<Payment>): Promise<Payment> {
    try {
      let payment = await this.paymentRepository.findOne({ where: { id: paymentId } });
      if (!payment) {
        throw new Error('Pago no encontrado');
      }
      
      Object.assign(payment, updateData);
      return await this.paymentRepository.save(payment);
    } catch (error) {
      throw error;
    }
  }









  async payPaymentPlan(paymentData: { idAccount: string; amount: number; idPaymentPlan: number }): Promise<any> {
    try {
      const { idAccount, amount, idPaymentPlan } = paymentData;
  
      // Buscar la cuenta que realiza el pago
      const account = await this.accountRepository.findOne({ where: { id: idAccount } });
      if (!account) {
        throw new Error('Cuenta no encontrada');
      }
  
      // Buscar el plan de pago y su cuenta compartida
      const paymentPlan = await this.paymentPlanRepository.findOne({
        where: { id: idPaymentPlan },
        relations: ['sharedAccount', 'sharedAccount.account1', 'sharedAccount.account2'],
      });
  
      if (!paymentPlan) {
        throw new Error('Plan de pagos no encontrado');
      }
  
      const sharedAccount = paymentPlan.sharedAccount;
  
      // Verificar que la cuenta pertenece a la cuenta compartida
      if (sharedAccount.account1.id !== idAccount && sharedAccount.account2.id !== idAccount) {
        throw new Error('La cuenta no pertenece a este plan de pagos');
      }
  
      // Verificar que la cuenta tenga saldo suficiente
      if (account.balance < amount) {
        throw new Error('Saldo insuficiente');
      }
  
      // Buscar pagos pendientes de la cuenta en el plan de pagos
      const pendingPayments = await this.paymentRepository.find({
        where: { account: { id: idAccount }, is_paid: false },
        relations: ['account'],
        order: { date: 'ASC' },
      });
  
      if (!pendingPayments.length) {
        throw new Error('No hay pagos pendientes para esta cuenta en el plan');
      }
  
      let remainingAmount = amount;
  
      // Aplicar el pago a los pagos pendientes
      for (const payment of pendingPayments) {
        if (remainingAmount <= 0) break;
  
        if (remainingAmount >= payment.amount) {
          // Pagar la totalidad del pago
          payment.is_paid = true;
          remainingAmount -= payment.amount;
        } else {
          // Pagar una parte del pago
          payment.amount -= remainingAmount;
          remainingAmount = 0;
        }
  
        await this.paymentRepository.save(payment);
      }
  
      // Descontar el saldo de la cuenta
      account.balance -= amount;
      await this.accountRepository.save(account);
  
      // Abonar el saldo a la cuenta compartida
      sharedAccount.total_amount += amount;
      await this.sharedAccountRepository.save(sharedAccount);
  
      return { status: 'ok' };
    } catch (error) {
      return { error: `No se pudo realizar el pago: ${error.message}` };
    }
  }
  



}
