import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HashtagsService } from './hashtags.service';
import { CreateHashtagDto } from './dto/create-hashtag.dto';
import { UpdateHashtagDto } from './dto/update-hashtag.dto';
import {ApiOkResponse, ApiOperation} from "@nestjs/swagger";

@Controller('hashtags')
export class HashtagsController {
  constructor(private readonly hashtagsService: HashtagsService) {}

  @Post()
  create(@Body() createHashtagDto: CreateHashtagDto) {
    return this.hashtagsService.create(createHashtagDto);
  }

  @Get()
  findAll() {
    return this.hashtagsService.findAll();
  }

  @ApiOperation({ summary: '현재 트렌드 조회' })
  @Get('trends')
  @ApiOkResponse({
    description: '10개',
  })
  getTrends() {
    return this.hashtagsService.getTrends();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hashtagsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHashtagDto: UpdateHashtagDto) {
    return this.hashtagsService.update(+id, updateHashtagDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.hashtagsService.remove(+id);
  }
}
