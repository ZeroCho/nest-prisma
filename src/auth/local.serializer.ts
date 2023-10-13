import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { PrismaService } from '../prisma.service';
import { User } from '.prisma/client';

@Injectable()
export class LocalSerializer extends PassportSerializer {
  constructor(private prismaService: PrismaService) {
    super();
  }

  serializeUser(user: User, done: CallableFunction) {
    done(null, user.id);
  }

  async deserializeUser(id: string, done: CallableFunction) {
    return await this.prismaService.user
      .findFirst({
        select: {
          id: true,
          nickname: true,
          image: true,
        },
        where: { id },
      })
      .then((user) => {
        done(null, user);
      })
      .catch((error) => done(error));
  }
}
