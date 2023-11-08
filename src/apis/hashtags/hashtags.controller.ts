import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { HashtagsService } from './hashtags.service';
import { CreateHashtagDto } from './dto/create-hashtag.dto';
import { UpdateHashtagDto } from './dto/update-hashtag.dto';
import {
  ApiExcludeEndpoint,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { LoggedInGuard } from '../../auth/logged-in-guard';
import {TrendsDto} from "./dto/trends.dto";

@ApiTags('해시태그 관련')
@Controller('hashtags')
export class HashtagsController {
  constructor(private readonly hashtagsService: HashtagsService) {}

  @ApiExcludeEndpoint()
  @Post()
  create(@Body() createHashtagDto: CreateHashtagDto) {
    return this.hashtagsService.create(createHashtagDto);
  }

  @ApiExcludeEndpoint()
  @Get()
  findAll() {
    return this.hashtagsService.findAll();
  }

  @ApiOperation({ summary: '현재 트렌드 조회' })
  @Get('trends')
  @ApiOkResponse({
    description: '최대 10개',
    type: TrendsDto,
    isArray: true,
  })
  @UseGuards(LoggedInGuard)
  getTrends() {
    return this.hashtagsService.getTrends();
  }

  @ApiExcludeEndpoint()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hashtagsService.findOne(+id);
  }

  @ApiExcludeEndpoint()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHashtagDto: UpdateHashtagDto) {
    return this.hashtagsService.update(+id, updateHashtagDto);
  }

  @ApiExcludeEndpoint()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.hashtagsService.remove(+id);
  }
}
