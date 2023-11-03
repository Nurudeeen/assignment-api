import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser'
import { ValidationPipe } from '@nestjs/common';

import * as dotenv from 'dotenv';
dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>
  (AppModule,{
    logger: ['error', 'warn']
  });

  app.enableCors();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}))
  app.useGlobalPipes(new ValidationPipe({
    forbidUnknownValues: false
  }));

  await app.listen(1337);
}
bootstrap();
