import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger/dist';
import {
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger/dist/decorators';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { NotLoggedInGuard } from '../auth/not-logged-in.guard';
import { LoggedInGuard } from '../auth/logged-in.guard';
import { User } from 'src/common/decorators/user.decorator';
import { UserDto } from 'src/common/dto/user.dto';
import { UndefinedToNullInterceptor } from 'src/common/interceptors/undefined.ToNull.interceptor';
import { HttpExceptionFilter } from 'src/httpException.filter';
import { JoinRequestDto } from './dto/join.request.dto';
import { UsersService } from './users.service';

@UseInterceptors(UndefinedToNullInterceptor)
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
    return user || false;
    //res.locals.jwt
  }

  @UseGuards(NotLoggedInGuard)
  @ApiOperation({ summary: '회원가입' })
  @Post()
  async join(@Body() body: JoinRequestDto) {
    //@Body => express 의 body Pasrer 와 같은것 Dto = Data Transport Object
    await this.usersService.join(body.email, body.nickname, body.password);
  }

  @ApiResponse({
    status: 200,
    type: UserDto,
    description: '성공',
  })
  @ApiOperation({ summary: '로그인' })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  logIn(@User() user) {
    return user; //향후 Passport 를 붙일 예정
  }

  //{data: user};
  //에러가 난 경우, exception filter
  //res.json({data:user});

  @UseGuards(new LoggedInGuard())
  @ApiOperation({ summary: '로그아웃' })
  @Post('logout')
  logOut(@Req() req, @Res() res) {
    //controller 는 최대한 모르는게 좋은 Service 는 무조건 모르는게 좋음
    req.logout();
    res.clearCookie('connect.sid', { httpOnly: true });
    res.send('ok_');
  }
}
