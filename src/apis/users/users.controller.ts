import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ForbiddenException,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PostsService } from '../posts/posts.service';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiExcludeEndpoint,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Post as PostEntity } from '../posts/entities/post.entity';
import { User } from './entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { SignupResponseDto } from './dto/signup.response.dto';
import { NotLoggedInGuard } from '../../auth/not-logged-in-guard';

@ApiTags('유저 관련')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly postsService: PostsService,
  ) {}

  @ApiOperation({ summary: '회원 가입' })
  @ApiForbiddenResponse({
    description: '아이디 이미 있음(already_exist)',
  })
  @ApiCreatedResponse({
    description: '회원가입 성공',
    type: SignupResponseDto,
  })
  @UseGuards(NotLoggedInGuard)
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: '이미지 파일',
        },
        id: {
          type: 'string',
          description: '아이디',
        },
        nickname: {
          type: 'string',
          description: '닉네임',
        },
        password: {
          type: 'string',
          description: '비밀번호',
        },
      },
    },
  })
  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const result = await this.usersService.create(createUserDto, file);
    if (result === 'already_exist') {
      throw new ForbiddenException('already_exist');
    }
    return result;
  }

  @ApiExcludeEndpoint()
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: '특정인 정보' })
  @ApiOkResponse({
    description: '유저 정보',
    type: User,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @ApiOperation({
    summary: '특정 유저 게시글 조회(페이지네이션)',
  })
  @ApiOkResponse({
    description: '게시글 목록',
    type: PostEntity,
    isArray: true,
  })
  @Get(':id/posts')
  findUserPosts(@Param('id') userId: string, @Query('cursor') cursor: number) {
    return this.postsService.findUserPosts(userId, cursor);
  }

  @ApiOperation({
    summary: '팔로우 추천인',
  })
  @ApiOkResponse({
    description: '3명',
    isArray: true,
    type: User,
  })
  @Get('followRecommends')
  getFollowRecommends() {
    return this.usersService.getFollowRecommends();
  }

  @ApiExcludeEndpoint()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @ApiExcludeEndpoint()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
