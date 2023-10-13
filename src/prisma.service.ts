import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Prisma } from '.prisma/client';
import * as util from 'util';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, 'query'>
  implements OnModuleInit
{
  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'error' },
      ],
    });

    this.$on('query', (event) => {
      console.log('Query: ' + event.query);
      console.log('Params: ' + event.params);
      console.log('Duration: ' + event.duration + 'ms');
    });

    this.$extends({
      query: {
        async $allOperations({ query, model, operation, args }) {
          const start = performance.now();
          const result = await query(args);
          const end = performance.now();
          const time = end - start;
          console.log(
            util.inspect(
              { model, operation, args, time },
              { showHidden: false, depth: null, colors: true },
            ),
          );
          return result;
        },
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const prisma = this;
    this.$extends({
      model: {
        $allModels: {
          softDelete<T, A>(
            this: T,
            args: Prisma.Exact<A, Prisma.Args<T, 'update'>>,
          ): Prisma.Result<T, A, 'update'> {
            const context = Prisma.getExtensionContext(this);
            return (context as any).update(args);
          },
          softDeleteMany<T, A>(
            this: T,
            args: Prisma.Exact<A, Prisma.Args<T, 'updateMany'>>,
          ): Prisma.Result<T, A, 'updateMany'> {
            const context = Prisma.getExtensionContext(this);
            return (context as any).updateMany(args);
          },
        },
      },
      query: {
        user: {
          findUnique({ query, args }) {
            args.where.deletedAt = null;
            return prisma.user.findFirst(args);
          },
          findFirst({ args, query }) {
            args.where.deletedAt = null;
            return query(args);
          },
          findMany({ args, query }) {
            if (args.where) {
              if (args.where.deletedAt == undefined) {
                // Exclude deleted records if they have not been explicitly requested
                args.where.deletedAt = null;
              }
            } else {
              args.where = { deletedAt: null };
            }
            return query(args);
          },
          update({ query, args }) {
            args.where.deletedAt = null;
            return query(args);
          },
          updateMany({ query, args }) {
            if (args.where !== undefined) {
              args.where.deletedAt = null;
            } else {
              args.where = { deletedAt: null };
            }
            return query(args);
          },
        },
      },
    });
  }

  async onModuleInit() {
    console.log('trying to connect...');
    await this.$connect();
    console.log('prisma connected');
  }
}
