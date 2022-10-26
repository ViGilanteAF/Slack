import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWorkspaceDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'sleact',
    description: 'Workspace Name',
  })
  public workspace: string;

  @ApiProperty({
    example: '슬랙',
    description: 'URL 주소',
  })
  public url: string;
}
