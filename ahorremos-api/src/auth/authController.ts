import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import User from 'src/entities/user';

@ApiTags('auth') // Agrupa los endpoints relacionados con autenticación en Swagger UI
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Registrar un nuevo usuario',
    description: 'Crea un nuevo usuario en la base de datos.',
  })
  @ApiBody({
    type: User, // Usa la entidad User como esquema para el cuerpo de la solicitud
    description: 'Datos del usuario a registrar',
    examples: {
      example1: {
        value: {
          email: 'usuario@example.com',
          password: 'Password123!',
          name: 'Juan',
          lastName: 'Pérez',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado exitosamente.',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  async register(@Body() user: Partial<User>) {
    return this.authService.register(user);
  }

  @Post('login')
  @ApiOperation({
    summary: 'Iniciar sesión',
    description: 'Autentica a un usuario y devuelve un token de acceso.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          description: 'Correo electrónico del usuario',
          example: 'usuario@example.com',
        },
        password: {
          type: 'string',
          description: 'Contraseña del usuario',
          example: 'Password123!',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Inicio de sesión exitoso. Devuelve un token de acceso.',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          description: 'Token de acceso JWT',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas.' })
  async login(@Body() credentials: { email: string; password: string }) {
    return this.authService.login(credentials.email, credentials.password);
  }




  @Post('login/admin')
  @ApiOperation({
    summary: 'Iniciar sesión',
    description: 'Autentica a un admin y devuelve un token de acceso.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          description: 'Correo electrónico del admin',
          example: 'admin@example.com',
        },
        password: {
          type: 'string',
          description: 'Contraseña del usuario',
          example: 'Password123!',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Inicio de sesión exitoso. Devuelve un token de acceso.',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          description: 'Token de acceso JWT',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas.' })
  async loginAdmin(@Body() credentials: { email: string; password: string }) {
    return this.authService.loginAdmin(credentials.email, credentials.password);
  }


}
