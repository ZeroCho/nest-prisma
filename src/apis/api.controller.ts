import {Controller, Get, HttpCode, Post, Redirect, Req, Res, UseGuards,} from '@nestjs/common';
import {ApiService} from './api.service';
import {User as UserEntity} from './users/entities/user.entity';
import {User} from '../common/decorators/user.decorator';
import {
  ApiBody,
  ApiExcludeEndpoint,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {Request, Response} from 'express';
import {LocalAuthGuard} from '../auth/local-auth.guard';
import {LoginDto} from './dto/login.dto';
import {LoginResponseDto} from './dto/login.response.dto';
import {LoggedInGuard} from '../auth/logged-in-guard';
import {NotLoggedInGuard} from '../auth/not-logged-in-guard';
import {ParseSessionTokenGuard} from "../auth/parse-session-token-guard";

@Controller()
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @ApiOperation({ summary: '이메일/비밀번호 로그인' })
  @ApiUnauthorizedResponse({
    description: '비밀번호 틀림(wrong_password)',
  })
  @ApiNotFoundResponse({
    description: '유저 정보 없음(no_user)',
  })
  @ApiOkResponse({
    description: '로그인 성공',
    type: LoginResponseDto,
  })
  @ApiBody({ type: LoginDto })
  @UseGuards(LocalAuthGuard)
  @UseGuards(NotLoggedInGuard)
  @HttpCode(200)
  @Post('login')
  login(@User() user: UserEntity) {
    console.log('login', user);
    return {
      id: user.id,
      nickname: user.nickname,
      image: user.image,
    };
  }

  @ApiExcludeEndpoint()
  @Redirect('login')
  @UseGuards(NotLoggedInGuard)
  @Post('logIn')
  logIn() {
    console.log('redirect to login');
  }

  @ApiOperation({
    summary: '로그아웃',
  })
  @UseGuards(LoggedInGuard)
  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    req.logout(() => {
      req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.send('ok');
      });
    });
  }

  @ApiExcludeEndpoint()
  @Redirect('logout')
  @UseGuards(LoggedInGuard)
  @Post('logOut')
  logOut() {
    console.log('redirect to logout');
  }

  @ApiOperation({
    summary: '내 정보 조회(로그인 안 했을 시는 false)',
  })
  @ApiOkResponse({
    type: LoginResponseDto,
  })
  @Get('user')
  @UseGuards(ParseSessionTokenGuard)
  getMyInfo(@User() user: UserEntity) {
    return user || false;
  }
}
