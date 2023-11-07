import { Module } from '@nestjs/common';
import { HashtagsService } from './hashtags.service';
import { HashtagsController } from './hashtags.controller';
import { CustomPrismaModule } from 'nestjs-prisma';
import { extendedPrismaClient } from '../../prisma.extension';

@Module({
  imports: [
    CustomPrismaModule.forRootAsync({
      name: 'PrismaService',
      useFactory: () => {
        return extendedPrismaClient;
      },
    }),
  ],
  controllers: [HashtagsController],
  providers: [HashtagsService],
})
export class HashtagsModule {}
