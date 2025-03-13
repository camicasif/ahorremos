import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { AccountService } from './account.service';
import { Account } from 'src/entities/account';
import User from 'src/entities/user';

@ApiTags('accounts') // Agrupa los endpoints relacionados con cuentas en Swagger UI
@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una cuenta', description: 'Crea una nueva cuenta en la base de datos.' })
  @ApiBody({
    type: Account,
    description: 'Datos de la cuenta a crear',
    examples: {
      example1: {
        value: {
          user: { id: 1 },
          balance: 1000,
          currency: 'USD',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Cuenta creada exitosamente.', type: Account })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  async saveAccount(@Body() accountData: Partial<Account>): Promise<Account> {
    return this.accountService.saveAccount(accountData);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las cuentas', description: 'Devuelve una lista de todas las cuentas registradas.' })
  @ApiResponse({ status: 200, description: 'Lista de cuentas.', type: [Account] })
  async getAccounts(): Promise<Account[]> {
    return this.accountService.getAccounts();
  }

  @Post('user')
  @ApiOperation({ summary: 'Buscar cuenta por usuario', description: 'Devuelve la cuenta asociada a un usuario.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          description: 'Usuario asociado a la cuenta',
          example: { id: 1 },
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Cuenta encontrada.', type: Account })
  @ApiResponse({ status: 404, description: 'Cuenta no encontrada.' })
  async findAccountByUser(@Body() userSent: User): Promise<Account> {
    return this.accountService.findAccountByUser(userSent);
  }

  @Get('code/:accountId')
  @ApiOperation({ summary: 'Generar código temporal', description: 'Genera un código de cuatro dígitos para una cuenta específica.' })
  @ApiParam({ name: 'accountId', description: 'ID de la cuenta', example: '123' })
  @ApiResponse({ status: 200, description: 'Código generado exitosamente.', type: Number })
  @ApiResponse({ status: 404, description: 'Cuenta no encontrada.' })
  async createGetCode(@Param('accountId') accountId: string): Promise<number> {
    return this.accountService.createGetCode(accountId);
  }





  @Get('info/:code')
  @ApiOperation({ summary: 'Obtener información de la cuenta', description: 'Obtiene el ID de la cuenta y el nombre del usuario asociado a un código temporal.' })
  @ApiParam({ name: 'code', description: 'Código temporal', example: 1234 })
  @ApiResponse({ status: 200, description: 'Información obtenida exitosamente.', schema: { example: { accountId: 'uuid', name: 'Juan', lastName: 'Pérez' } } })
  @ApiResponse({ status: 404, description: 'Cuenta o usuario no encontrado.' })
  async getInfoAccount(@Param('code') code: number) {
    return this.accountService.getInfoAccount(code);
  }
}
