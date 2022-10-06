import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import {
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common/exceptions';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}
  getUser() {}

  async join(email: string, nickname: string, password: string) {
    const user = await this.usersRepository.find({ where: { email } });
    if (user) {
      //기존에 존재하는 유저
      throw new UnauthorizedException('이미 존재하는 사용자 입니다.!');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    //없으면 유저 추가
    await this.usersRepository.save({
      email,
      nickname,
      password: hashedPassword,
    });
  }
}
