import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { Repository, DataSource } from 'typeorm';
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
    private dataSource: DataSource,
  ) {}
  getUser() {}

  async join(email: string, nickname: string, password: string) {
    const queryRunner = this.dataSource.createQueryRunner();
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
      const returned = await this.usersRepository.manager
        .getRepository(Users)
        .save({
          email,
          nickname,
          password: hashedPassword,
        });
      throw new Error('롤백?하냐?');
      const workspaceMember = queryRunner.manager
        .getRepository(WorkspaceMembers)
        .create();
      workspaceMember.UserId = returned.id;
      workspaceMember.WorkspaceId = 1;

      await queryRunner.manager
        .getRepository(WorkspaceMembers)
        .save(workspaceMember);
      await queryRunner.manager.getRepository(ChannelMembers).save({
        UserId: returned.id,
        ChannelId: 1,
      });
      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      console.error(error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release(); //항상 수동으로 connect 을 할땐 releases 를 해서 연결을 해제 해야 DB로 부터 연결최대 갯수 를 초과 하지 않음
    }
  }
}
