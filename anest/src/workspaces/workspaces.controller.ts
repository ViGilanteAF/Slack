import { Controller, Delete, Get, Post } from '@nestjs/common';
import { Body, Param } from '@nestjs/common/decorators';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { ApiTags } from '@nestjs/swagger/dist/decorators';
import { User } from 'src/common/decorators/user.decorator';
import { Users } from 'src/entities/Users';
import { CreateWorkspaceDto } from 'src/workspaces/dto/create-workspace.dto';
import { WorkspacesService } from './workspaces.service';

@ApiTags('WORKSPACE')
@Controller('api/workspaces')
export class WorkspacesController {
  constructor(private workspacesService: WorkspacesService) {}

  /** 워크스페이스 가지고 오기 */
  @Get()
  getMyWorkwpaces(@User() user: Users) {
    return this.workspacesService.findMyWorkspaces(user.id);
  }

  /**워크스페이스 만들기 */
  @Post()
  createWorkspace(@User() user: Users, @Body() body: CreateWorkspaceDto) {
    return this.workspacesService.createWorkspace(
      body.workspace,
      body.url,
      user.id,
    );
  }

  /**워크스페이스 멤버 가지고 오기 */
  @Get(':url/members')
  getAllMembersFromWorkspace(@Param('url') url: string) {
    return this.workspacesService.getWorkspacesMembers(url);
  }

  /**워크스페이스 멤버 초대 */
  @Post(':url/members')
  inviteMemversToWorkspace() {}

  /**워크스페이스 내에 특정 멤버 불러오기 */
  @Get(':url/members/:id')
  getMemberInfoInWorkspace() {}

  /**워크스페이스 특정 멤버 불러오기 */
  @Get(':url/users/:id')
  DEPRECATED_getMemberInfoInWorkspace() {
    this.getMemberInfoInWorkspace();
  }
}
