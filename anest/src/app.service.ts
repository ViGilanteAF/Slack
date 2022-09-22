import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from './users/users.service';

@Injectable()
export class AppService {
  constructor(private usersService: UsersService) {}

  // async getHello(): Promise<string> {
  //   return this.configService.get('DB_PASSWORD');
  //   //process.env.DB_PASSWORD
  // }
  async getHello() {
    this.usersService.getUser();
    this.getWow();
    return process.env.SECRET;
  }

  async getWow() {}
}
