import { PrismaClient, Prisma } from '@prisma/client';

const prismaClient = new PrismaClient({});
export const extendedPrismaClient = prismaClient.$extends({
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
        return prismaClient.user.findFirst(args);
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
    post: {
      findUnique({ query, args }) {
        args.where.deletedAt = null;
        return prismaClient.post.findFirst(args);
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

export type ExtendedPrismaClient = typeof extendedPrismaClient;
