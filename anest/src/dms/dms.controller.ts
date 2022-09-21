import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';

@Controller('api/workspaces/:url/dms')
export class DmsController {
    @Get(':id/chats')
    getChat(@Query('perPage') perPage, @Query('page')page, @Param() param) {
        console.log(perPage, page);
        console.log(param.id, param.url);
    }

    // getChat(@Query() query){
    //     console.log(query.perPage, query.page);
    // }

    @Post(':id/chats')
    postChat(@Body() body){

    }
}
