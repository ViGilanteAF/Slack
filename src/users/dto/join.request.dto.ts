import { PickType } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import { Users } from 'src/entities/Users';

export class JoinRequestDto extends PickType(Users, [
  'email',
  'nickname',
  'password',
] as const) {}
