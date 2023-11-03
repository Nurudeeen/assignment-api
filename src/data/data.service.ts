import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Data } from 'src/schemas/data.schema';
import { responseHandler, uploadManager } from "../utils";


@Injectable()
export class DataService {
  constructor(@InjectModel('Data') private readonly dataModel: Model<Data>) { }

  async createData(data: Partial<Data>): Promise<Data> {
    const existingData = await this.dataModel.findOne({ email: data.email }).exec();

    if (!existingData) {
      const newData = new this.dataModel(data);
      return newData.save();
    }

    return await this.dataModel.findOneAndUpdate({ email: (await existingData).email }, data, { new: true }).exec();


  }

  async findAllData(): Promise<any> {
    return await this.dataModel.find().exec();
  }

  async fetchOwnData(email: string): Promise<Data> {
    return await this.dataModel.findOne({ email }).exec();
  }


  async fetchUserData(email: string): Promise<Data> {
    return await this.dataModel.findOne({ email }).exec();
  }

  async updateData(email: string, data: any): Promise<Data> {
    return await this.dataModel.findOneAndUpdate({ email }, data, { new: true }).exec();
  }

  async uploadLogo(email: string, logo: any): Promise<any> {
    const data = await this.dataModel.findOne({ email })

    if (!data) {
      return responseHandler({
        status: false,
        message: "Cannot fetch data for this email",
        data: {},
        statusCode: 400
      })
    }

    const upload = await uploadManager(logo.path, "logo")
    if (upload.status) {
      logo = { logo: upload.data.url }
      return this.dataModel.findOneAndUpdate({ email }, logo, { new: true }).exec();
    }
    return responseHandler({
      status: false,
      message: "Image upload failed",
      data: {},
      statusCode: 400
    })
  }

}

