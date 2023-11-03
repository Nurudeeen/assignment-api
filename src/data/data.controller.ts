import { Controller, Get, Post, Put, Body, Req, Query, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DataService } from './data.service';
import { Data } from 'src/schemas/data.schema';
import { AuthGuard } from 'src/auth/auth.guard';
import { multeroption } from '../utils';


@Controller('user')
export class DataController {
  constructor(private readonly usersService: DataService) {}

  @Post('/add-data')
  async createData(@Req() request: Request, @Body() data: Partial<Data>): Promise<Data> {
    const email = request['user'].email
    return this.usersService.createData({email: email, ...data});
  }

  @Get('/fetch-all-data')
  @UseGuards(new AuthGuard([process.env.ADMIN_EMAIL]))
  async findAllData(): Promise<Data[]> {
    return this.usersService.findAllData();
  }

  @Get('/fetch-data')
  async fetchUserData(@Query('email') email: string): Promise<Data> {
    return this.usersService.fetchUserData(email);
  }

  @Get('/fetch-own-data')
  async fetchOwnData(@Req() request: Request): Promise<Data> {
    const email = request['user'].email
    return this.usersService.fetchUserData(email);
  }

  @Put('/update-data')
  async updateData(@Req() request: Request, @Body() data: Partial<Data>): Promise<Data> {
    const email = request['user'].email
    return this.usersService.updateData(email, data);
  }

  @Put('/upload-logo')
  @UseInterceptors(FileInterceptor('logo', multeroption))
  @UseGuards(new AuthGuard([process.env.ADMIN_EMAIL]))
  async uploadLogo(@Query('email') email: string, @UploadedFile() logo: Express.Multer.File): Promise<Data> {
    return await this.usersService.uploadLogo(email, logo);
  }

}