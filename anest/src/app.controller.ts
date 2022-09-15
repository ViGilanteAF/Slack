import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('abc')
export class AppController {
  constructor(private readonly appService: AppService) {}

  //req, res에 대하여 알고있음 

  @Get('User') //Get /abc/User
  getUser(): string {
    return this.appService.getUser();
  }

  @Post('user') //POST /abc/User
  postUser(): string {
    return this.appService.postUser();
  }
}