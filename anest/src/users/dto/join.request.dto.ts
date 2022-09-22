import { ApiProperty } from '@nestjs/swagger/dist/decorators';

export class JoinRequestDto {
  @ApiProperty({
    example: 'stronghu95@gmail.com',
    description: 'E-mail',
    required: true,
  })
  public email: string;

  @ApiProperty({
    example: 'Cliche',
    description: 'Nickname',
    required: true,
  })
  public nickname: string;

  @ApiProperty({
    example: 'NestJSBook',
    description: 'Password',
    required: true,
  })
  public password: string;
}
