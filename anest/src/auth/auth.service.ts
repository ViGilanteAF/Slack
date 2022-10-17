import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../entities/Users';
import { DataSource, Repository } from 'typeorm';
import { bcrypt } from 'bcrypt';
import { join } from 'path';

@Injectable()
export class AuthService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Users) private usersRepository: Repository<Users>,
  ) {}

  // async validateUser(email: string, password: string) {
  //   const user = await this.usersRepository.findOne({
  //     where: { email },
  //     select: ['id', 'email', 'nickname', 'password'],
  //   });
  //   console.log(email, password, user);
  //   if (!user) {
  //     return null;
  //   }
  //   const result = await bcrypt.compare(password, user.password);
  //   if (result) {
  //     const { password, ...userWithoutPassword } = user;
  //     //모르면 delete user.password;
  //     return userWithoutPassword;
  //   }
  //   return null;
  // }

  async validateUser(email: string, password: string) {
    return this.usersRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password'],
    });
    console.log(email, password);
  }
  async join(email: string, nickname: string, password: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
  }
}
