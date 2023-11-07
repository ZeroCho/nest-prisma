import { Module } from '@nestjs/common';
import { LocalSerializer } from './local.serializer';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { CustomPrismaModule } from 'nestjs-prisma';
import { extendedPrismaClient } from '../prisma.extension';
import { UsersService } from '../apis/users/users.service';

@Module({
  imports: [
    PassportModule.register({ session: true }),
    CustomPrismaModule.forRootAsync({
      name: 'PrismaService',
      useFactory: () => {
        return extendedPrismaClient;
      },
    }),
  ],
  providers: [LocalSerializer, LocalStrategy, UsersService],
})
export class AuthModule {}
