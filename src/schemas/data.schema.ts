import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DataDocument = HydratedDocument<Data>;

@Schema()
export class Data {
  @Prop()
  companyName: string;

  @Prop()
  email: string;

  @Prop()
  products: number;

  @Prop()
  users: number;

  @Prop()
  percentage: number;

  @Prop()
  logo: string;
}

export const DataSchema = SchemaFactory.createForClass(Data);