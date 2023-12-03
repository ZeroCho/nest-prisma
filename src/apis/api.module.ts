import { Module } from '@nestjs/common';
import { HashtagsModule } from './hashtags/hashtags.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { RouterModule } from '@nestjs/core';
import {MessagesModule} from "./messages/messages.module";

@Module({
  controllers: [ApiController],
  providers: [ApiService],
  imports: [
    HashtagsModule,
    UsersModule,
    PostsModule,
    MessagesModule,
    RouterModule.register([
      {
        path: 'api',
        module: HashtagsModule,
      },
      {
        path: 'api',
        module: UsersModule,
      },
      {
        path: 'api',
        module: PostsModule,
      },
      {
        path: 'api',
        module: MessagesModule,
      },
    ]),
  ],
})
export class ApiModule {}
