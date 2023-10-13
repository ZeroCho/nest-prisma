import { Module } from '@nestjs/common';
import { HashtagsModule } from './hashtags/hashtags.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';

@Module({
  controllers: [ApiController],
  providers: [ApiService],
  imports: [HashtagsModule, UsersModule, PostsModule],
})
export class ApiModule {}
