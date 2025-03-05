import { Controller, Post, Get, Delete, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiConsumes, ApiParam } from '@nestjs/swagger';
import { UserService } from './user.service';
import User from 'src/entities/User';

@ApiTags('users') // Agrupa los endpoints relacionados con usuarios en Swagger UI
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un usuario', description: 'Crea un nuevo usuario en la base de datos.' })
  @ApiBody({
    type: User, // Usa la entidad User como esquema para el cuerpo de la solicitud
    description: 'Datos del usuario a crear',
    examples: {
      example1: {
        value: {
          email: 'usuario@example.com',
          password: 'Password123!',
          name: 'Juan',
          lastName: 'Pérez',
          rank: 'Admin',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente.', type: User })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  async saveUser(@Body() user: Partial<User>): Promise<User> {
    return this.userService.saveUser(user);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios', description: 'Devuelve una lista de todos los usuarios registrados.' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios.', type: [User] })
  async getUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }

  @Delete()
  @ApiOperation({ summary: 'Eliminar un usuario', description: 'Elimina un usuario por su ID.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        user_id: {
          type: 'number',
          description: 'ID del usuario a eliminar',
          example: 1,
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Usuario eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  async deleteUser(@Body() user: any): Promise<void> {
    return this.userService.deleteUser(user.user_id);
  }
}