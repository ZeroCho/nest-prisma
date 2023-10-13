import { Get, Post, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import { ApiService } from './api.service';
import { User as UserEntity } from './users/entities/user.entity';
import { User } from '../common/decorators/user.decorator';
import {
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { LoginDto } from './dto/login.dto';

export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @ApiOperation({ summary: '이메일/비밀번호 로그인' })
  @ApiUnauthorizedResponse({
    description: 'wrong password',
  })
  @ApiNotFoundResponse({
    description: 'no user',
  })
  @ApiBody({ type: LoginDto })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login() {
    return this.apiService.login();
  }

  @Redirect('login')
  @Post('logIn')
  logIn() {
    console.log('redirect to login');
  }

  @ApiOperation({
    summary: '로그아웃',
  })
  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    req.logout(() => {
      res.send('ok');
    });
  }

  @Redirect('logout')
  @Post('logOut')
  logOut() {
    console.log('redirect to logout');
  }

  @ApiOperation({
    summary: '내 정보 조회(로그인 안 했을 시는 false)',
  })
  @ApiOkResponse({
    type: UserEntity,
  })
  @Get('user')
  getMyInfo(@User() user: UserEntity) {
    return user || false;
  }
}
