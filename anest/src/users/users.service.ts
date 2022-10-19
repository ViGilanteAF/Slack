import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { Repository, Connection } from 'typeorm';
import bcrypt from 'bcrypt';
import {
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common/exceptions';
import { WorkspaceMembers } from 'src/entities/WorkspaceMembers';
import { ChannelMembers } from 'src/entities/ChannelMembers';
import Connection from 'mysql2/typings/mysql/lib/Connection';
import { query } from 'express';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(WorkspaceMembers)
    private workspaceMembersRepository: Repository<WorkspaceMembers>,
    @InjectRepository(ChannelMembers)
    private ChannelMembersRepository: Repository<ChannelMembers>,
    private connection: Connection,
  ) {}
  getUser() {}

  async join(email: string, nickname: string, password: string) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const user = await queryRunner.manager
      .getRepository(Users)
      .find({ where: { email } });
    if (user) {
      //기존에 존재하는 유저
      throw new UnauthorizedException('이미 존재하는 사용자 입니다.!');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    //없으면 유저 추가
    try {
      const returned = await this.usersRepository.save({
        email,
        nickname,
        password: hashedPassword,
      });

      // WorkspaceMembers.UserId = returned.id;
      // WorkspaceMembers.WorkspaceId = 1;
      await queryRunner.manager.getRepository(WorkspaceMembers).save({
        UserId: returned.id,
        WorkspaceId: 1,
      });
      await queryRunner.manager.getRepository(ChannelMembers).save({
        UserId: returned.id,
        ChannelId: 1,
      });

      return true;
    } catch (error) {
      console.error(error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
