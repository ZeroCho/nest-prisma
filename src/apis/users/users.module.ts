import {Module} from '@nestjs/common';
import {UsersService} from './users.service';
import {UsersController} from './users.controller';
import {PostsService} from '../posts/posts.service';
import {MulterModule} from '@nestjs/platform-express';
import {diskStorage} from 'multer';
import * as path from 'path';
import {MessagesService} from "../messages/messages.service";

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './upload',
        filename(req, file, done) {
          const ext = path.extname(file.originalname);
          done(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
      }),
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, PostsService, MessagesService],
})
export class UsersModule {}
