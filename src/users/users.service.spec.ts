import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ChannelMembers } from 'src/entities/ChannelMembers';
import { Users } from 'src/entities/Users';
import { WorkspaceMembers } from 'src/entities/WorkspaceMembers';
import { UsersService } from './users.service';

class MockUserRepository {
  #data = [{ id: 1, email: 'abc@naver.com' }];
  findOne({ where: { email } }) {
    const data = this.#data.find((v) => v.email === email);
    if (data) {
      return data;
    }
    return null;
  }
}

class MockWorkspaceMembersRepository {}
class MockChannelMembersRepository {}

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(Users),
          useClass: MockUserRepository,
        },
        {
          provide: getRepositoryToken(WorkspaceMembers),
          useClass: MockWorkspaceMembersRepository,
        },
        {
          provide: getRepositoryToken(ChannelMembers),
          useClass: MockChannelMembersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  /**나중에 할 테스트는 it.todo 으로 하고
   * 바로 해야할 테스트는 it  으로 한다.
   */
  it('findByEmail은 Email을 통해 유저를 찾아야 함', () => {
    expect(service.findByEmail('abc@naver.com')).resolves.toStrictEqual({
      email: 'abc@naver.com',
      id: 1,
    });
  });

  it.todo('findByEmail은 유저를 찾지 못하면 null을 반환해야함!', () => {
    expect(service.findByEmail('abc@naver.com')).resolves.toBe(null);
  });
});
