import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from 'src/entities/payment';
import { Account } from 'src/entities/account';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
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
}
