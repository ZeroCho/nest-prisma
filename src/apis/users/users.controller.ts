import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {UsersService} from './users.service';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {PostsService} from '../posts/posts.service';
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
import {Post as PostEntity} from '../posts/entities/post.entity';
import {User as UserEntity} from './entities/user.entity';
import {FileInterceptor} from '@nestjs/platform-express';
import {SignupResponseDto} from './dto/signup.response.dto';
import {NotLoggedInGuard} from '../../auth/not-logged-in-guard';
import {User} from "../../common/decorators/user.decorator";
import {LoggedInGuard} from "../../auth/logged-in-guard";
import {MessagesService} from "../messages/messages.service";
import {RoomDto} from "./dto/room.dto";
import {Message} from "../messages/entities/message.entity";
import {ParseSessionTokenGuard} from "../../auth/parse-session-token-guard";

@ApiTags('유저 관련')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly postsService: PostsService,
    private readonly messagesService: MessagesService,
  ) {
  }

  @ApiOperation({summary: '회원 가입'})
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

  @ApiOperation({
    summary: '팔로우 추천인',
  })
  @ApiOkResponse({
    description: '3명',
    isArray: true,
    type: UserEntity,
  })
  @UseGuards(ParseSessionTokenGuard)
  @Get('followRecommends')
  getFollowRecommends(@User() user: Pick<UserEntity, 'id'>) {
    return this.usersService.getFollowRecommends(user);
  }

  @ApiExcludeEndpoint()
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiOperation({summary: '특정인 정보'})
  @ApiOkResponse({
    description: '유저 정보',
    type: UserEntity,
  })
  @UseGuards(ParseSessionTokenGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @User() user: Pick<UserEntity, 'id'>) {
    return this.usersService.findOne(id, user);
  }

  @ApiOperation({
    summary: '특정 유저 게시글 조회(페이지네이션)',
  })
  @ApiOkResponse({
    description: '게시글 목록',
    type: PostEntity,
    isArray: true,
  })
  @UseGuards(ParseSessionTokenGuard)
  @Get(':id/posts')
  findUserPosts(@Param('id') userId: string, @User() user: UserEntity, @Query('cursor', ParseIntPipe) cursor?: number) {
    return this.postsService.findUserPosts(userId, cursor, user);
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

  @ApiOperation({summary: '팔로우'})
  @ApiOkResponse({
    description: '성공시 팔로우한 아이디 반환'
  })
  @ApiForbiddenResponse({
    description: '자신은 팔로우 불가능(self_impossible)'
  })
  @UseGuards(LoggedInGuard)
  @Post(':id/follow')
  async follow(@Param('id') id: string, @User() user: UserEntity) {
    const result = await this.usersService.follow(id, user);
    if (result === 'self_impossible') {
      throw new ForbiddenException('self_impossible');
    }
    return result.id;
  }

  @ApiOperation({summary: '언팔로우'})
  @ApiOkResponse({
    description: '성공시 언팔로우한 아이디 반환'
  })
  @ApiForbiddenResponse({
    description: '자신은 팔로우 불가능(self_impossible)'
  })
  @UseGuards(LoggedInGuard)
  @Delete(':id/follow')
  async unfollow(@Param('id') id: string, @User() user: UserEntity) {
    console.log('user', user);
    const result = await this.usersService.unfollow(id, user);
    if (result === 'self_impossible') {
      throw new ForbiddenException('self_impossible');
    }
    return result.id;
  }


  @ApiOperation({summary: '현재 참여중인 방들'})
  @Get(':id/rooms')
  @ApiOkResponse({
    description: '방들',
    type: RoomDto,
    isArray: true,
  })
  @ApiForbiddenResponse({
    description: '로그인하지 않음',
  })
  @UseGuards(LoggedInGuard)
  getRooms(@User() user: UserEntity, @Param('id') id: string) {
    console.log(id, user.id);
    if (id !== user.id) {
      throw new ForbiddenException();
    }
    return this.messagesService.getRooms(id);
  }


  @ApiOperation({summary: '현재 방 메시지 조회(roomId는 상대방 아이디)'})
  @Get(':id/rooms/:roomId')
  @ApiOkResponse({
    description: '메시지 10개씩',
    type: Message,
    isArray: true,
  })
  @ApiForbiddenResponse({
    description: '로그인하지 않음',
  })
  @UseGuards(LoggedInGuard)
  getRoomMessage(@User() user: UserEntity, @Query('cursor') cursor: string, @Param('id') id: string, @Param('roomId') roomId: string) {
    if (id !== user.id) {
      throw new ForbiddenException();
    }
    const ids = [user.id, roomId];
    ids.sort();
    return this.messagesService.getRoomMessage(ids.join('-'), +cursor);
  }
}
