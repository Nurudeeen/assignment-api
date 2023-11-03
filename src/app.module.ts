import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PreauthMiddleware } from './auth/preauth.middleware';
import { DataModule } from './data/data.module';

@Module({
  imports: [ConfigModule.forRoot(
    {
      isGlobal: true,
      envFilePath: '.env',
    }
  ),MongooseModule.forRoot(process.env.MONGO_URL), DataModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule{  configure(consumer: MiddlewareConsumer) {
  consumer.apply(PreauthMiddleware).forRoutes({
    path: '/user/*', method: RequestMethod.ALL
  })
}
}
