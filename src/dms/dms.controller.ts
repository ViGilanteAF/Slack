import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger/dist/decorators';

@ApiTags('DM')
@Controller('api/workspaces/:url/dms')
export class DmsController {
  @ApiParam({
    name: 'url',
    required: true,
    description: 'WorkSpace URL',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'UserID',
  })
  @ApiQuery({
    name: 'perPage',
    required: true,
    description: '한번에 가지고 오는 갯수',
  })
  @ApiQuery({
    name: 'page',
    required: true,
    description: '불러올 페이지',
  })
  @Get(':id/chats')
  getChat(@Query('perPage') perPage, @Query('page') page, @Param() param) {
    console.log(perPage, page);
    console.log(param.id, param.url);
  }

  // getChat(@Query() query){
  //     console.log(query.perPage, query.page);
  // }

  @Post(':id/chats')
  postChat(@Body() body) {}
}
