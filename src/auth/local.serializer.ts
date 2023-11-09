import {Inject, Injectable} from '@nestjs/common';
import {PassportSerializer} from '@nestjs/passport';
import {CustomPrismaService} from 'nestjs-prisma';
import {User} from '.prisma/client';
import {ExtendedPrismaClient} from '../prisma.extension';

@Injectable()
export class LocalSerializer extends PassportSerializer {
  constructor(
    @Inject('PrismaService')
    private prismaService: CustomPrismaService<ExtendedPrismaClient>,
  ) {
    super();
  }

  serializeUser(user: User, done: CallableFunction) {
    done(null, user.id);
  }

  async deserializeUser(id: string, done: CallableFunction) {
    try {
      const user = await this.prismaService.client.user
        .findFirst({
          select: {
            id: true,
            nickname: true,
            image: true,
          },
          where: {id},
        });
      console.log('deserialized', user);
      done(null, user);
    } catch (error) {
      console.error(error);
      done(error);
    }
  }
}
