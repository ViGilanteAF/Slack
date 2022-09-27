import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger/dist';
import {
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger/dist/decorators';
import { User } from 'src/common/decorators/user.decorator';
import { UserDto } from 'src/common/dto/user.dto';
import { JoinRequestDto } from './dto/join.request.dto';
import { UsersService } from './users.service';

@ApiTags('USER')
@Controller('api/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiResponse({
    status: 200,
    type: UserDto,
    description: '성공',
  })
  @ApiResponse({
    status: 500,
    description: '서버에러',
  })
  @ApiOperation({ summary: '내 정보조회' })
  @Get()
  getUsers(@User() user) {
    //로그인되어 있는 사용자의 정보를 가저옴
    return user;
    //res.locals.jwt
  }

  @ApiOperation({ summary: '회원가입' })
  @Post()
  postUsers(@Body() body: JoinRequestDto) {
    //@Body => express 의 body Pasrer 와 같은것 Dto = Data Transport Object
    this.usersService.postUsers(body.email, body.nickname, body.password);
  }

  @ApiResponse({
    status: 200,
    type: UserDto,
    description: '성공',
  })
  @ApiOperation({ summary: '로그인' })
  @Post('login')
  logIn(@User() user) {
    return user; //향후 Passport 를 붙일 예정
  }

  @ApiOperation({ summary: '로그아웃' })
  @Post('logout')
  logOut(@Req() req, @Res() res) {
    //controller 는 최대한 모르는게 좋은 Service 는 무조건 모르는게 좋음
    req.logout();
    res.clearCookie('connect.sid', { httpOnly: true });
    res.send('ok_');
  }
}
