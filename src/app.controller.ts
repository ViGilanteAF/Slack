import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  //req, res에 대하여 알고있음 

  @Get()
  getHello(){
    return this.appService.getHello();

  }
}