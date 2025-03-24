import { Controller, Post, Get, Delete, Body, HttpException, HttpStatus, NotFoundException, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { PaymentPlanService } from './paymentPlan.service';
import { PaymentPlan } from 'src/entities/paymentPlan';

@ApiTags('payment-plans') // Agrupa los endpoints relacionados con planes de pago en Swagger UI
@Controller('payment-plans')
export class PaymentPlanController {
  constructor(private readonly paymentPlanService: PaymentPlanService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un plan de pago', description: 'Crea un nuevo plan de pago en la base de datos.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        sharedAccountId: { type: 'number', description: 'ID de la cuenta compartida' },
        estimated_balance: { type: 'number', description: 'Balance estimado' },
        initial_date: { type: 'string', format: 'date', description: 'Fecha de inicio' },
        end_date: { type: 'string', format: 'date', description: 'Fecha de fin' },
        payment_period: { type: 'number', description: 'Período de pago en días' },
      },
    },
    examples: {
      example1: {
        value: {
          sharedAccount: 23,
          estimated_balance: 1000.50,
          initial_date: '2025-03-18',
          end_date: '2025-09-18',
          payment_period: 30,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Plan de pago creado exitosamente.',
    schema: {
      example: {
        "SharedAccountId": 123,
        "idPaymentPlan":23, 
        "estimatedBalance": 2500, 
        "initialDate": "2024-01-01", 
        "endDate": "2024-12-31", 
        "paymentPeriod": 30,

      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Cuenta compartida no encontrada.',
    schema: {
      example: { error: 'Shared account not found' },
    },
  })
  async createPaymentPlan(@Body() paymentPlanData: Partial<PaymentPlan>): Promise<PaymentPlan> {
    const result = await this.paymentPlanService.createPaymentPlan(paymentPlanData);
    if (!result) {
      throw new HttpException({ error: 'Shared account not found' }, HttpStatus.NOT_FOUND);
    }
    return result;
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los planes de pago', description: 'Devuelve una lista de todos los planes de pago registrados.' })
  @ApiResponse({ status: 200, description: 'Lista de planes de pago.', type: [PaymentPlan] })
  async getPaymentPlans(): Promise<PaymentPlan[]> {
    return this.paymentPlanService.getPaymentPlans();
  }

  @Delete()
  @ApiOperation({ summary: 'Eliminar un plan de pago', description: 'Elimina un plan de pago por su ID.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'ID del plan de pago a eliminar',
          example: 1,
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Plan de pago eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Plan de pago no encontrado.' })
  async deletePaymentPlan(@Body() body: any): Promise<void> {
    return this.paymentPlanService.deletePaymentPlan(body.id);
  }




  @Get(':idAccount')
  @ApiOperation({ 
    summary: 'Obtener planes de pago por ID de cuenta', 
    description: 'Devuelve una lista de todos los planes de pago asociados a una cuenta específica.'
  })
  @ApiParam({ 
    name: 'idAccount', 
    type: 'string', 
    description: 'ID de la cuenta para buscar los planes de pago' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de planes de pago encontrados.' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'No se encontraron planes de pago para la cuenta proporcionada.' 
  })
  async getPaymentPlansByAccountId(@Param('idAccount') idAccount: string) {
    const paymentPlans = await this.paymentPlanService.getPaymentPlansByAccountId(idAccount);

    if (!paymentPlans.length) {
     return null;
    }

    return paymentPlans;
  }


}
