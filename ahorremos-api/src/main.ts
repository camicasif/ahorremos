import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  
  const expressApp = express(); // Crea una instancia de Express

  // Configura express.static para servir archivos estáticos
  expressApp.use('/uploads', express.static('/Users/sebastian/sebas/img'));
  expressApp.use((req, res, next) => {
    // Configura CORS aquí
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
  });


  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp), // Utiliza ExpressAdapter para integrar con Nest.js
  );

  const config = new DocumentBuilder()
    .setTitle('AHORREMOS APIS')
    .setDescription('This are APIS for ahorremos')
    .setVersion('1.0') .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingresa el token JWT',
        in: 'header',
      },
      'JWT-auth', // Este nombre debe coincidir con el usado en @ApiBearerAuth()
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swaggerdoc', app, document);

  app.enableCors()
  await app.listen(3000);
}
bootstrap();


