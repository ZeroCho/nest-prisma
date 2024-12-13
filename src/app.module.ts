import {Inject, MiddlewareConsumer, Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import session from 'express-session';
import passport from 'passport';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {REDIS} from './redis/redis.constants';
import {CustomPrismaModule} from 'nestjs-prisma';
import {RedisModule} from './redis/redis.module';
import {RedisClientType} from 'redis';
import RedisStore from 'connect-redis';
import {join} from 'path';
import {ServeStaticModule} from '@nestjs/serve-static';
import {RouterModule} from '@nestjs/core';
import {ApiModule} from './apis/api.module';
import {extendedPrismaClient} from './prisma.extension';
import {AuthModule} from './auth/auth.module';
import cookieParser from 'cookie-parser';
import {EventsModule} from './events/events.module';
import {LoggerMiddleware} from "./middlewares/logger.middleware";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CustomPrismaModule.forRootAsync({
      name: 'PrismaService',
      isGlobal: true,
      useFactory: () => {
        return extendedPrismaClient;
      },
    }),
    RedisModule,
    ServeStaticModule.forRoot({
      serveRoot: '/upload',
      rootPath: join(__dirname, '..', 'upload'),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
      serveRoot: '/', // 필수, 없으면 client/index.html 에러 발생 https://github.com/nestjs/serve-static/issues/139#issuecomment-1042809342
    }),
    EventsModule,
    AuthModule,
    ApiModule,
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
      LoggerMiddleware,
      cookieParser(),
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
    consumer.apply(...middlewares).forRoutes('*');
  }
}
