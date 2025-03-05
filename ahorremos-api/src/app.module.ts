import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import User from './entities/user';

import { UserController } from './users/userController';
import { UserService } from './users/user.service';
import { JwtModule } from '@nestjs/jwt';

import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/jwt.strategy';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/authController';


import Rank from './entities/rank';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'legaltech', 
      signOptions: { expiresIn: '1h' }, // Expiración del token
    }),

    //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
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "127.0.0.1",
      port: 5432,
      username: "postgres",
      password: "090702",
      database: "ahorremos",
      autoLoadEntities: true,
      synchronize: true, // Esto sincronizará las entidades con la base de datos automáticamente (solo para desarrollo)
      logging: true, // Esto habilitará el registro de consultas SQL en la consola  
      entities:[  User, Rank]  
    }),

    // TypeOrmModule.forRoot({
    //   type: "postgres",
    //   host: "179.61.12.113",
    //   port: 5432,
    //   username: "lexibone_legal",
    //   password: "legalfront!",
    //   database: "lexibone_legalback",
    //   autoLoadEntities: true,
    //   synchronize: true, // Esto sincronizará las entidades con la base de datos automáticamente (solo para desarrollo)
    //   logging: true, // Esto habilitará el registro de consultas SQL en la consola  
    //   entities:[  User, Message, Model]  
    // }),


    TypeOrmModule.forFeature([ User,  Rank]),

  ],
  controllers: [AppController, UserController, AuthController],
  providers: [AppService, UserService, JwtStrategy, AuthService],
})
export class AppModule {


}
