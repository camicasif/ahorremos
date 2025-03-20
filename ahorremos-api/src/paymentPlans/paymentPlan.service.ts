import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentPlan } from 'src/entities/paymentPlan';
import { SharedAccount } from 'src/entities/sharedAccount';
import { Payment } from 'src/entities/payment';

@Injectable()
export class PaymentPlanService {
  constructor(
    @InjectRepository(PaymentPlan)
    private readonly paymentPlanRepository: Repository<PaymentPlan>,
    @InjectRepository(SharedAccount)
    private readonly sharedAccountRepository: Repository<SharedAccount>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
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
      const paymentPlan = this.paymentPlanRepository.save({
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
                })
            );
            
            payments.push(
                this.paymentRepository.create({
                    account: sharedAccount.account2,
                    amount: parseFloat(paymentAmount.toFixed(2)),
                    date: new Date(currentDate),
                    is_paid: false,
                })
            );

            currentDate.setDate(currentDate.getDate() + periodInDays);
        }

        // Guardar los pagos en la base de datos
        await this.paymentRepository.save(payments);

  
      // Guardar el payment plan en la base de datos
     //const paymentPlanCreated=  await this.paymentPlanRepository.save(paymentPlan);
  
      // Retornar el formato que deseas
      return  paymentPlan;
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
}
