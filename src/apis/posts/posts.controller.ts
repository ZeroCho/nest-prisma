import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from '../../common/decorators/user.decorator';
import { CommentDto } from './dto/comment.dto';
import { ApiBody, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Post as PostEntity } from './entities/post.entity';
import { Image as ImageEntity } from './entities/image.entity';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({
    summary: '게시글 생성',
  })
  @ApiBody({
    type: CreatePostDto,
  })
  @ApiOkResponse({
    type: PostEntity,
  })
  @Post()
  create(@Body() createPostDto: CreatePostDto, @User() user) {
    return this.postsService.create(createPostDto, user);
  }

  @ApiOperation({
    summary: '추천 게시글 전부 조회(페이지네이션)',
  })
  @ApiOkResponse({
    type: PostEntity,
    isArray: true,
  })
  @Get('recommends')
  findRecent(@Query('cursor') cursor: string) {
    return this.postsService.findAll(+cursor);
  }

  @ApiOperation({
    summary: '팔로잉 게시글 전부 조회(페이지네이션)',
  })
  @ApiOkResponse({
    type: PostEntity,
    isArray: true,
  })
  @Get('followings')
  findFollowing(@Query('cursor') cursor: string) {
    return this.postsService.findAll(+cursor);
  }

  @ApiOperation({
    summary: '검색 결과 조회(페이지네이션)',
  })
  @ApiOkResponse({
    type: PostEntity,
    isArray: true,
  })
  @Get('')
  getSearchResult(@Query('cursor') cursor: string, @Query('q') q: string) {
    return this.postsService.getSearchResult(q, +cursor);
  }

  @ApiOperation({
    summary: '게시글 하나 조회',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @ApiOperation({
    summary: '하트 제거',
  })
  @Delete(':id/heart')
  removeHeart(@User() user, @Param('id') postId: string) {
    return this.postsService.removeHeart(+postId, user);
  }

  @ApiOperation({
    summary: '하트 달기',
  })
  @Post(':id/heart')
  addHeart(@User() user, @Param('id') postId: string) {
    return this.postsService.addHeart(+postId, user);
  }

  @ApiOperation({
    summary: '게시글 제거',
  })
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
  @Post(':id/repost')
  repost(@User() user, @Param('id') postId: string) {
    return this.postsService.repost(+postId, user);
  }

  @Get(':id/comments')
  @ApiOperation({
    summary: '댓글 조회',
  })
  @ApiOkResponse({
    type: PostEntity,
    isArray: true,
  })
  comment(
    @Param('id') postId: string,
  ) {
    return this.postsService.getComments(+postId);
  }

  @Post(':id/comment')
  @ApiOperation({
    summary: '댓글 달기',
  })
  @ApiOkResponse({
    type: PostEntity,
  })
  @ApiBody({
    type: CommentDto,
  })
  addComment(
    @User() user,
    @Param('id') postId: string,
    @Body() commentDto: CommentDto,
  ) {
    return this.postsService.addComment(commentDto, +postId, user);
  }

  @Get(':id/photo/:imageId')
  @ApiOperation({
    summary: '이미지 조회',
  })
  @ApiOkResponse({
    type: ImageEntity,
  })
  getImage(
    @User() user,
    @Param('id') postId: string,
    @Param('imageId') imageId: string,
  ) {
    return this.postsService.getImage(+postId, +imageId, user);
  }
}
