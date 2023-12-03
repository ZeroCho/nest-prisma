import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
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
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
