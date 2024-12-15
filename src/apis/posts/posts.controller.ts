import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {PostsService} from './posts.service';
import {CreatePostDto} from './dto/create-post.dto';
import {User} from '../../common/decorators/user.decorator';
import {CommentDto} from './dto/comment.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {Post as PostEntity} from './entities/post.entity';
import {Image as ImageEntity} from './entities/image.entity';
import {User as UserEntity} from '../users/entities/user.entity';
import {FilesInterceptor} from '@nestjs/platform-express';
import {LoggedInGuard} from '../../auth/logged-in-guard';
import {ParseSessionTokenGuard} from "../../auth/parse-session-token-guard";

@ApiTags('게시글 관련')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({
    summary: '게시글 생성',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary'
          },
          description: '이미지 파일',
        },
        content: {
          type: 'string',
          description: '컨텐츠',
        },
      },
    },
  })
  @ApiOkResponse({
    type: PostEntity,
  })
  @UseGuards(LoggedInGuard)
  @UseInterceptors(FilesInterceptor('images'))
  @Post()
  create(
    @Body() createPostDto: CreatePostDto,
    @User() user: UserEntity,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.postsService.create(createPostDto, user, files);
  }

  @ApiOperation({
    summary: '추천 게시글 전부 조회(페이지네이션)',
  })
  @ApiOkResponse({
    type: PostEntity,
    isArray: true,
  })
  @Get('recommends')
  findRecent(@Query('cursor') cursor: string, @Query('likes') likes: string) {
    return this.postsService.findAll(+cursor, 'recommends', null, +likes);
  }

  @ApiOperation({
    summary: '팔로잉 게시글 전부 조회(페이지네이션)',
  })
  @ApiOkResponse({
    type: PostEntity,
    isArray: true,
  })
  @UseGuards(LoggedInGuard)
  @Get('followings')
  findFollowing(@Query('cursor') cursor: string, @User() user: UserEntity) {
    return this.postsService.findAll(+cursor, 'followings', user);
  }

  @ApiOperation({
    summary: '검색 결과 조회(페이지네이션)',
  })
  @ApiOkResponse({
    type: PostEntity,
    isArray: true,
  })
  @UseGuards(LoggedInGuard)
  @Get('')
  getSearchResult(@User() user: UserEntity, @Query('cursor') cursor: string, @Query('q') q: string, @Query('pf') pf?: string, @Query('f') f?: string) {
    console.log('queryquery', q);
    return this.postsService.getSearchResult(user, q, +cursor, pf, f);
  }

  @ApiOperation({
    summary: '게시글 하나 조회',
  })
  @ApiNotFoundResponse({
    description: '게시글 없음(no_such_post)',
  })
  @UseGuards(ParseSessionTokenGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @User() user: UserEntity) {
    return this.postsService.findOne(+id, user);
  }

  @ApiOperation({
    summary: '하트 제거',
  })
  @ApiNotFoundResponse({
    description: '게시글 없음(no_such_post)',
  })
  @UseGuards(LoggedInGuard)
  @Delete(':id/heart')
  removeHeart(@User() user: UserEntity, @Param('id') postId: string) {
    return this.postsService.removeHeart(+postId, user);
  }

  @ApiOperation({
    summary: '하트 달기',
  })
  @ApiBadRequestResponse({
    description: '이미 하트 누름(already_hearted)',
  })
  @ApiNotFoundResponse({
    description: '게시글 없음(no_such_post)',
  })
  @UseGuards(LoggedInGuard)
  @Post(':id/heart')
  async addHeart(@User() user: UserEntity, @Param('id') postId: string) {
    const result = await this.postsService.addHeart(+postId, user);
    if (result === 'no_such_post' || result === 'already_hearted') {
      throw new NotFoundException(result);
    }
    return result;
  }

  @ApiOperation({
    summary: '게시글 제거',
  })
  @ApiNotFoundResponse({
    description: '게시글 없음(no_such_post)',
  })
  @UseGuards(LoggedInGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }

  @ApiOperation({
    summary: '재게시하기',
  })
  @ApiOkResponse({
    type: PostEntity,
  })
  @ApiNotFoundResponse({
    description: '게시글 없음(no_such_post)',
  })
  @ApiBadRequestResponse({
    description: '이미 재게시 함(already_reposted)',
  })
  @UseGuards(LoggedInGuard)
  @Post(':id/reposts')
  async repost(@User() user: UserEntity, @Param('id') postId: string) {
    const result = await this.postsService.repost(+postId, user);
    if (result === 'no_such_post' || result === 'already_reposted') {
      throw new NotFoundException(result);
    }
    return result;
  }

  @ApiOperation({
    summary: '재게시 제거하기',
  })
  @ApiOkResponse({
    type: 'ok',
    description: '제거 성공 시 ok'
  })
  @ApiNotFoundResponse({
    description: '게시글 없음(no_such_post)',
  })
  @UseGuards(LoggedInGuard)
  @Delete(':id/reposts')
  async deleteRepost(@User() user: UserEntity, @Param('id') postId: string) {
    const result = await this.postsService.deleteRepost(+postId, user);
    if (result === 'no_such_post') {
      throw new NotFoundException('no_such_post');
    }
    return result;
  }

  @ApiOperation({
    summary: '댓글 조회',
  })
  @ApiOkResponse({
    type: PostEntity,
    isArray: true,
  })
  @ApiNotFoundResponse({
    description: '게시글 없음(no_such_post)',
  })
  @UseGuards(ParseSessionTokenGuard)
  @Get(':id/comments')
  comment(@Param('id') postId: string, @User() user: UserEntity, @Query('cursor') cursor: string) {
    return this.postsService.getComments(+postId, user, +cursor);
  }

  @ApiOperation({
    summary: '댓글 달기',
  })
  @ApiOkResponse({
    type: PostEntity,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary'
          },
          description: '이미지 파일',
        },
        content: {
          type: 'string',
          description: '컨텐츠',
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('images'))
  @ApiNotFoundResponse({
    description: '게시글 없음(no_such_post)',
  })
  @UseGuards(LoggedInGuard)
  @Post(':id/comments')
  addComment(
    @User() user: UserEntity,
    @Param('id') postId: string,
    @Body() commentDto: CommentDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.postsService.addComment(commentDto, +postId, user, files);
  }

  @ApiOperation({
    summary: '이미지 조회',
  })
  @ApiOkResponse({
    type: ImageEntity,
  })
  @ApiNotFoundResponse({
    description: '게시글 없음(no_such_post)',
  })
  @UseGuards(ParseSessionTokenGuard)
  @Get(':id/photos/:imageId')
  getImage(
    @User() user: UserEntity,
    @Param('id') postId: string,
    @Param('imageId') imageId: string,
  ) {
    return this.postsService.getImage(+postId, +imageId, user);
  }
}
