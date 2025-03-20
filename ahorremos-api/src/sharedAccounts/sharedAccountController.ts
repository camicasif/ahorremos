import { Controller, Post, Get, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { SharedAccountService } from './sharedAccount.service';
import { SharedAccount } from 'src/entities/sharedAccount';


@ApiTags('shared-accounts') // Agrupa los endpoints relacionados con SharedAccount en Swagger UI
@Controller('shared-accounts')
export class SharedAccountController {
  constructor(private readonly sharedAccountService: SharedAccountService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una cuenta compartida', description: 'Crea una nueva cuenta compartida en la base de datos.' })
  @ApiBody({
    type: SharedAccount,
    description: 'Datos de la cuenta compartida a crear',
    examples: {
      example1: {
        value: {
          total_amount: 1000.50,
          created_date: '2025-03-17',
          account1: 'uuid-account-1',
          account2: 'uuid-account-2',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Cuenta compartida creada exitosamente.',
    schema: {
      example: {
        sharedAccountId: 23,
        totalAmount: 0,
        accounts: [
          { idAccount: 23, balance: 34, name: 'Sebas', lastname: 'Morales' },
          { idAccount: 24, balance: 50, name: 'Carlos', lastname: 'Gonzalez' }
        ]
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Shared account not found.',
    schema: {
      example: { error: 'Shared account not found' }
    }
  })
  async createSharedAccount(@Body() sharedAccount: Partial<SharedAccount>): Promise<any> {
    return this.sharedAccountService.createSharedAccount(sharedAccount);
  }
  
  @Get()
  @ApiOperation({ summary: 'Obtener todas las cuentas compartidas', description: 'Devuelve una lista de todas las cuentas compartidas registradas.' })
  @ApiResponse({ status: 200, description: 'Lista de cuentas compartidas.', type: [SharedAccount] })
  async getAllSharedAccounts(): Promise<SharedAccount[]> {
    return this.sharedAccountService.getAllSharedAccounts();
  }

  @Delete()
  @ApiOperation({ summary: 'Eliminar una cuenta compartida', description: 'Elimina una cuenta compartida por su ID.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'ID de la cuenta compartida a eliminar',
          example: 'uuid-shared-account',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Cuenta compartida eliminada exitosamente.' })
  @ApiResponse({ status: 404, description: 'Cuenta compartida no encontrada.' })
  async deleteSharedAccount(@Body() data: any): Promise<void> {
    return this.sharedAccountService.deleteSharedAccount(data.id);
  }


  @Get(':id')
    @ApiOperation({
        summary: 'Obtener una cuenta compartida por ID de cuenta',
        description: 'Devuelve la primera cuenta compartida asociada a la cuenta dada.',
    })
    @ApiResponse({
        status: 200,
        description: 'Shared account encontrada exitosamente.',
        schema: {
            example: {
                sharedAccountId: 23,
                totalAmount: 0,
                accounts: [
                    { idAccount: 23, balance: 34, name: 'Sebas', lastname: 'Morales' },
                    { idAccount: 24, balance: 50, name: 'Carlos', lastname: 'Gonzalez' }
                ]
            }
        }
    })
    @ApiResponse({
        status: 404,
        description: 'Shared account not found.',
        schema: {
            example: { error: 'Shared account not found' }
        }
    })
    async getSharedAccountByIdAccount(@Param('id') id: string): Promise<any> {
        return this.sharedAccountService.getSharedAccountByIdAccount(id);
    }




}
