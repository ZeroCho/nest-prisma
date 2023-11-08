import { Inject, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from '../../prisma.extension';
import { User } from '../users/entities/user.entity';
import { CommentDto } from './dto/comment.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PostsService {
  constructor(
    @Inject('PrismaService')
    private prismaService: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  create(
    createPostDto: CreatePostDto,
    user: User,
    files: Express.Multer.File[],
  ) {
    const hashtags = createPostDto.content.match(/#[^\s#]+/g);
    console.log('files', files);
    return this.prismaService.client.post.create({
      select: {
        User: {
          select: {
            image: true,
            id: true,
            nickname: true,
          }
        },
        content: true,
        createdAt: true,
        postId: true,
        Images: true,
      },
      data: {
        ...createPostDto,
        userId: user.id,
        Images: {
          createMany: {
            data: files.map((v) => ({
              link: '/' + v.path.replaceAll('\\', '/'),
            })),
          },
        },
        Hashtags: {
          connectOrCreate: hashtags.map((tag) => ({
            where: {
              title: tag,
            },
            create: {
              title: tag,
            },
          }))
        }
      },
    });
  }

  findAll(cursor: number, type: 'followings' | 'recommends', user?: User) {
    const where: Prisma.PostWhereInput = cursor ? { postId: { lt: cursor } } : {};
    if (type === 'followings') {
      where.User = {
        Followers: {
          some: {
            id: user.id,
          }
        }
      }
    }
    return this.prismaService.client.post.findMany({
      where,
      select: {
        content: true,
        postId: true,
        createdAt: true,
        Images: true,
        User: {
          select: {
            id: true,
            nickname: true,
            image: true,
          }
        },
        _count: {
          select: {
            Reposts: true,
            Comments: true,
            Hearts: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });
  }

  getSearchResult(q: string, cursor: number) {
    const where = cursor
      ? { postId: { lt: cursor }, content: { contains: q } }
      : { content: { contains: q } };
    return this.prismaService.client.post.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        content: true,
        postId: true,
        createdAt: true,
        Images: true,
        User: {
          select: {
            id: true,
            nickname: true,
            image: true,
          }
        },
        _count: {
          select: {
            Reposts: true,
            Comments: true,
            Hearts: true,
          }
        }
      },
      take: 10,
    });
  }

  findUserPosts(userId: string, cursor: number) {
    const where = cursor ? { userId, postId: { lt: cursor } } : { userId };
    return this.prismaService.client.post.findMany({
      select: {
        User: {
          select: {
            image: true,
            id: true,
            nickname: true,
          }
        },
        content: true,
        createdAt: true,
        postId: true,
        Images: true,
        _count: {
          select: {
            Reposts: true,
            Comments: true,
            Hearts: true,
          }
        }
      },
      where,
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });
  }

  findOne(id: number) {
    return this.prismaService.client.post.findUnique({
      select: {
        User: {
          select: {
            image: true,
            id: true,
            nickname: true,
          }
        },
        content: true,
        createdAt: true,
        postId: true,
        Images: true,
        _count: {
          select: {
            Reposts: true,
            Comments: true,
            Hearts: true,
          }
        }
      },
      where: { postId: id },
    });
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return this.prismaService.client.post.softDelete({
      where: { postId: id },
    });
  }

  async addHeart(postId: number, user: User) {
    const original = await this.prismaService.client.post.findUnique({
      where: { postId },
    });
    if (!original) {
      return 'no_such_post';
    }
    return this.prismaService.client.post.update({
      where: { postId },
      data: {
        Hearts: {
          connect: {
            postId_userId: {
              postId,
              userId: user.id,
            },
          },
        },
      },
    });
  }

  async removeHeart(postId: number, user: User) {
    const original = await this.prismaService.client.post.findUnique({
      where: { postId },
    });
    if (!original) {
      return 'no_such_post';
    }
    return this.prismaService.client.post.update({
      where: { postId },
      data: {
        Hearts: {
          disconnect: {
            postId_userId: {
              postId,
              userId: user.id,
            },
          },
        },
      },
    });
  }

  async repost(postId: number, user: User) {
    const original = await this.prismaService.client.post.findUnique({
      where: { postId },
    });
    if (!original) {
      return 'no_such_post';
    }
    return this.prismaService.client.post.create({
      select: {
        User: {
          select: {
            image: true,
            id: true,
            nickname: true,
          }
        },
        Original: true,
        content: true,
        createdAt: true,
        postId: true,
        Images: true,
      },
      data: {
        ...original,
        userId: user.id,
        originalId: postId,
      },
    });
  }

  async getComments(postId: number) {
    const original = await this.prismaService.client.post.findUnique({
      where: { postId },
    });
    if (!original) {
      return 'no_such_post';
    }
    return this.prismaService.client.post.findMany({
      select: {
        User: {
          select: {
            image: true,
            id: true,
            nickname: true,
          }
        },
        content: true,
        createdAt: true,
        postId: true,
        Images: true,
        Parent: true,
        _count: {
          select: {
            Reposts: true,
            Comments: true,
            Hearts: true,
          }
        }
      },
      where: {
        parentId: postId,
      },
    });
  }

  async addComment(commentDto: CommentDto, postId: number, user: User) {
    const original = await this.prismaService.client.post.findUnique({
      where: { postId },
    });
    if (!original) {
      return 'no_such_post';
    }
    return this.prismaService.client.post.create({
      select: {
        User: {
          select: {
            image: true,
            id: true,
            nickname: true,
          }
        },
        Parent: true,
        content: true,
        createdAt: true,
        postId: true,
        Images: true,
      },
      data: {
        ...commentDto,
        userId: user.id,
        parentId: postId,
      },
    });
  }

  async getImage(postId: number, imageId: number, user: User) {
    const original = await this.prismaService.client.post.findUnique({
      where: { postId },
    });
    if (!original) {
      return 'no_such_post';
    }
    return this.prismaService.client.postImage.findUnique({
      select: {
        Post: {
          select: {
            User: {
              select: {
                image: true,
                id: true,
                nickname: true,
              },
            },
            content: true,
            createdAt: true,
            postId: true,
          },
        },
      },
      where: {
        imageId,
        postId,
      },
    });
  }
}
