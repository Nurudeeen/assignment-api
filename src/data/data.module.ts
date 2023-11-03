import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DataController } from './data.controller';
import { DataService } from './data.service';
import { DataSchema } from '../schemas/data.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Data', schema: DataSchema }]),
  ],
  controllers: [DataController],
  providers: [DataService],
})
export class DataModule {}