import { Controller, Post, Get, Delete, Put, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { Payment } from 'src/entities/payment';

@ApiTags('payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un pago', description: 'Crea un nuevo pago en la base de datos.' })
  @ApiBody({
    type: Payment,
    description: 'Datos del pago a crear',
    examples: {
      example1: {
        value: {
          account: { id: 1 },
          amount: 100.50,
          date: '2024-03-20',
          is_paid: true,
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Pago creado exitosamente.', type: Payment })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  async savePayment(@Body() payment: Partial<Payment>): Promise<Payment> {
    return this.paymentService.savePayment(payment);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los pagos', description: 'Devuelve una lista de todos los pagos registrados.' })
  @ApiResponse({ status: 200, description: 'Lista de pagos.', type: [Payment] })
  async getPayments(): Promise<Payment[]> {
    return this.paymentService.getPayments();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un pago por ID', description: 'Devuelve un pago específico basado en su ID.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del pago' })
  @ApiResponse({ status: 200, description: 'Pago encontrado.', type: Payment })
  @ApiResponse({ status: 404, description: 'Pago no encontrado.' })
  async getPaymentById(@Param('id') id: number): Promise<Payment> {
    return this.paymentService.getPaymentById(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un pago', description: 'Elimina un pago por su ID.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del pago a eliminar' })
  @ApiResponse({ status: 200, description: 'Pago eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Pago no encontrado.' })
  async deletePayment(@Param('id') id: number): Promise<void> {
    return this.paymentService.deletePayment(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un pago', description: 'Actualiza los datos de un pago existente.' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del pago a actualizar' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        amount: { type: 'number', description: 'Nuevo monto del pago' },
        date: { type: 'string', format: 'date', description: 'Nueva fecha del pago' },
        is_paid: { type: 'boolean', description: 'Estado de pago' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Pago actualizado exitosamente.', type: Payment })
  @ApiResponse({ status: 404, description: 'Pago no encontrado.' })
  async updatePayment(@Param('id') id: number, @Body() updateData: Partial<Payment>): Promise<Payment> {
    return this.paymentService.updatePayment(id, updateData);
  }
}