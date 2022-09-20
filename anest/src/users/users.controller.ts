import { Controller, Get, Post, Req, Res } from '@nestjs/common';

@Controller('users')
export class UsersController {

    @Get()
    getUsers(@Req() req){ //로그인되어 있는 사용자의 정보를 가저옴
        return req.user;
    }

    @Post()
    postUsers(){

    }
    
    @Post('login')
        logIn(){
            return req.user; //향후 Passport 를 붙일 예정
        }

    @Post('logout')
    logOut(@Req() req, @Res() res){ //controller 는 최대한 모르는게 좋은 Service 는 무조건 모르는게 좋음
        req.logout();
        res.clearCookie('connect.sid', {httpOnly: true});
        res.send('ok_')
    }


}
