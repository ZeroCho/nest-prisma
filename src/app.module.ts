import { Inject, MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as session from 'express-session';
import * as cors from 'cors';
import * as passport from 'passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { REDIS } from './redis/redis.constants';
import { CustomPrismaModule } from 'nestjs-prisma';
import { RedisModule } from './redis/redis.module';
import { RedisClientType } from 'redis';
import RedisStore from 'connect-redis';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { RouterModule } from '@nestjs/core';
import { ApiModule } from './apis/api.module';
import { extendedPrismaClient } from './prisma.extension';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CustomPrismaModule.forRootAsync({
      name: 'PrismaService',
      useFactory: () => {
        return extendedPrismaClient;
      },
    }),
    RedisModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
    RouterModule.register([
      {
        path: 'api',
        module: ApiModule,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(
    private readonly configService: ConfigService,
    @Inject(REDIS) private readonly redis: RedisClientType,
  ) {}

  configure(consumer: MiddlewareConsumer) {
    const store = new RedisStore({
      client: this.redis,
    });
    const middlewares = [
      session({
        store,
        resave: false,
        saveUninitialized: false,
        secret: this.configService.get('COOKIE_SECRET'),
        cookie: {
          httpOnly: true,
        },
      }),
      passport.initialize(),
      passport.session(),
    ];
    if (process.env.NODE_ENV === 'beta') {
      middlewares.unshift(cors());
    }
    consumer.apply(...middlewares).forRoutes('*');
  }
}
