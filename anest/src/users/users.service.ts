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
  async postUsers(email: string, nickname: string, password: string) {
    if (!email) {
      //이메일 없을경우 에러
      throw new BadRequestException('이메일이 없습니다.');
    }
    if (!nickname) {
      //닉네임 없을경우 에러
      throw new BadRequestException('닉네임이 없습니다.');
    }

    if (!password) {
      //패스워드 없을경우 에러
      throw new BadRequestException('패스워드가 맞지 않습니다.');
    }

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
