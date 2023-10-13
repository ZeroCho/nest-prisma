import { Module } from '@nestjs/common';
import * as Redis from 'redis';
import { ConfigService } from '@nestjs/config';
import { REDIS } from './redis.constants';

@Module({
  providers: [
    {
      provide: REDIS,
      useFactory: (configService: ConfigService) => {
        const redisClient = Redis.createClient({
          url: configService.get('REDIS_URL'),
        });
        redisClient
          .connect()
          .then(() => {
            console.log('redis connected');
          })
          .catch(console.error);
        return redisClient;
      },
      inject: [ConfigService],
    },
  ],
  exports: [REDIS],
})
export class RedisModule {}
