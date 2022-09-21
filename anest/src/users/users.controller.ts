import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { JoinRequestDto } from './dto/join.request.dto';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {
    constructor(private usersService: UsersService){

    }

    @Get()
    getUsers(@Req() req){ //로그인되어 있는 사용자의 정보를 가저옴
        return req.user;
    }

    @Post()
    postUsers(@Body() body: JoinRequestDto ) {//@Body => express 의 body Pasrer 와 같은것 Dto = Data Transport Object
        this.usersService.postUsers(body.email, body.nickname, body.password);
    }
    
    @Post('login')
        logIn(@Req() req){
            return req.user; //향후 Passport 를 붙일 예정
        }

    @Post('logout')
    logOut(@Req() req, @Res() res){ //controller 는 최대한 모르는게 좋은 Service 는 무조건 모르는게 좋음
        req.logout();
        res.clearCookie('connect.sid', {httpOnly: true});
        res.send('ok_')
    }


}
