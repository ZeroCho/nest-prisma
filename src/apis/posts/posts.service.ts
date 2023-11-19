import {Inject, Injectable} from '@nestjs/common';
import {CreatePostDto} from './dto/create-post.dto';
import {UpdatePostDto} from './dto/update-post.dto';
import {CustomPrismaService} from 'nestjs-prisma';
import {ExtendedPrismaClient} from '../../prisma.extension';
import {User} from '../users/entities/user.entity';
import {CommentDto} from './dto/comment.dto';
import {Prisma} from '@prisma/client';

@Injectable()
export class PostsService {
  constructor(
    @Inject('PrismaService')
    private prismaService: CustomPrismaService<ExtendedPrismaClient>,
  ) {
  }

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
            data: files?.map((v) => ({
              link: '/' + v.path.replaceAll('\\', '/'),
            })) || [],
          },
        },
        Hashtags: {
          connectOrCreate: hashtags?.map((tag) => ({
            where: {
              title: tag,
            },
            create: {
              title: tag,
            },
          })) || []
        }
      },
    });
  }

  findAll(cursor: number, type: 'followings' | 'recommends', user?: User, likes?: number) {
    const where: Prisma.PostWhereInput = {};
    let skip = 0;
    let orderBy: Prisma.PostOrderByWithRelationInput | Prisma.PostOrderByWithRelationInput[];
    if (type === 'followings') {
      where.User = {
        Followers: {
          some: {
            id: user.id,
          }
        }
      }
      orderBy = {
        createdAt: 'desc',
      }
      if (cursor) {
        where.postId = {
          lt: cursor,
        }
      }
    }
    if (type === 'recommends') {
      orderBy = [{
        Hearts: {
          _count: 'desc',
        }
      }, {
        createdAt: 'desc',
      }];
      if (cursor) {
        skip = cursor;
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
        },
        Hearts: {
          select: {
            userId: true,
          },
          where: {
            userId: user?.id,
          },
        },
        Original: {
          select: {
            postId: true,
            content: true,
            createdAt: true,
            User: {
              select: {
                id: true,
                nickname: true,
                image: true,
              }
            },
            Images: true,
          },
        },
        Parent: {
          select: {
            User: {
              select: {
                id: true,
                nickname: true,
                image: true,
              }
            },
            Images: true,
          },
        },
        Reposts: {
          select: {
            userId: true,
          },
          where: {
            userId: user?.id,
          }
        },
        Comments: {
          select: {
            userId: true,
          },
          where: {
            userId: user?.id,
          }
        }
      },
      orderBy,
      take: 10,
      skip,
    });
  }

  getSearchResult(user: User, q: string, cursor: number, pf?: string, f?: string) {
    const where: Prisma.PostWhereInput = cursor
      ? {postId: {lt: cursor}, content: {contains: q}}
      : {content: {contains: q}};
    let orderBy: Prisma.PostOrderByWithRelationInput | Prisma.PostOrderByWithRelationInput[] = [{
      Hearts: {
        _count: 'desc'
      },
    }, {
      createdAt: 'desc',
    }];
    if (pf === 'on') {
      where.User = {
        Followers: {
          some: {
            id: user.id,
          }
        }
      }
    }
    if (f === 'live') {
      orderBy = {
        createdAt: 'desc',
      }
    }
    return this.prismaService.client.post.findMany({
      where,
      orderBy,
      select: {
        content: true,
        postId: true,
        createdAt: true,
        Images: true,
        Original: {
          select: {
            postId: true,
            content: true,
            createdAt: true,
            User: {
              select: {
                id: true,
                nickname: true,
                image: true,
              }
            },
            Images: true,
          },
        },
        Parent: {
          select: {
            User: {
              select: {
                id: true,
                nickname: true,
                image: true,
              }
            },
            Images: true,
          },
        },
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
        },
        Hearts: {
          select: {
            userId: true,
          },
          where: {
            userId: user.id,
          }
        },
        Reposts: {
          select: {
            userId: true,
          },
          where: {
            userId: user.id,
          }
        },
        Comments: {
          select: {
            userId: true,
          },
          where: {
            userId: user.id,
          }
        }
      },
      take: 10,
    });
  }

  findUserPosts(userId: string, cursor: number, user?: User) {
    const where = cursor ? {userId, postId: {lt: cursor}} : {userId};
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
        },
        Hearts: {
          select: {
            userId: true,
          },
          where: {
            userId: user?.id,
          }
        },
        Original: {
          select: {
            postId: true,
            content: true,
            createdAt: true,
            User: {
              select: {
                id: true,
                nickname: true,
                image: true,
              }
            },
            Images: true,
          },
        },
        Parent: {
          select: {
            User: {
              select: {
                id: true,
                nickname: true,
                image: true,
              }
            },
            Images: true,
          },
        },
        Reposts: {
          select: {
            userId: true,
          },
          where: {
            userId: user?.id,
          }
        },
        Comments: {
          select: {
            userId: true,
          },
          where: {
            userId: user?.id,
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

  findOne(id: number, user: User) {
    return this.prismaService.client.post.findUnique({
      select: {
        User: {
          select: {
            image: true,
            id: true,
            nickname: true,
          }
        },
        Original: {
          select: {
            postId: true,
            content: true,
            createdAt: true,
            User: {
              select: {
                id: true,
                nickname: true,
                image: true,
              }
            },
            Images: true,
            Hearts: {
              select: {
                userId: true,
              },
              where: {
                userId: user?.id,
              }
            },
            Reposts: {
              select: {
                userId: true,
              },
              where: {
                userId: user?.id,
              }
            },
            Comments: {
              select: {
                userId: true,
              },
              where: {
                userId: user?.id,
              }
            },
            _count: {
              select: {
                Reposts: true,
                Comments: true,
                Hearts: true,
              }
            },
          },
        },
        Parent: {
          select: {
            User: {
              select: {
                id: true,
                nickname: true,
                image: true,
              }
            },
            Images: true,
          },
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
        },
        Hearts: {
          select: {
            userId: true,
          },
          where: {
            userId: user?.id,
          }
        },
        Reposts: {
          select: {
            userId: true,
          },
          where: {
            userId: user?.id,
          }
        },
        Comments: {
          select: {
            userId: true,
          },
          where: {
            userId: user?.id,
          }
        }
      },
      where: {postId: id},
    });
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return this.prismaService.client.post.softDelete({
      where: {postId: id},
    });
  }

  async addHeart(postId: number, user: User) {
    const original = await this.prismaService.client.post.findUnique({
      where: {postId},
    });
    if (!original) {
      return 'no_such_post';
    }
    return this.prismaService.client.post.update({
      where: {postId},
      data: {
        Hearts: {
          upsert: {
            where: {
              postId_userId: {
                userId: user.id,
                postId: postId,
              }
            },
            create: {
              createdAt: new Date(),
              userId: user.id,
            },
            update: {},
          },
        },
      },
    });
  }

  async removeHeart(postId: number, user: User) {
    const original = await this.prismaService.client.post.findUnique({
      where: {postId},
    });
    if (!original) {
      return 'no_such_post';
    }
    return this.prismaService.client.postHeart.deleteMany({
      where: {postId, userId: user.id},
    });
  }

  async repost(postId: number, user: User) {
    const original = await this.prismaService.client.post.findUnique({
      where: {postId},
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
        content: 'repost',
        userId: user.id,
        originalId: postId,
      },
    });
  }

  async getComments(postId: number, user?: User, cursor?: number) {
    const original = await this.prismaService.client.post.findUnique({
      where: {postId},
    });
    if (!original) {
      return 'no_such_post';
    }
    let where: Prisma.PostWhereInput = {
      parentId: postId,
    };
    if (cursor) {
      where.postId = {
        lt: cursor,
      };
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
        Original: {
          select: {
            postId: true,
            content: true,
            createdAt: true,
            User: {
              select: {
                id: true,
                nickname: true,
                image: true,
              }
            },
            Images: true,
            Hearts: {
              select: {
                userId: true,
              },
              where: {
                userId: user?.id,
              }
            },
            Reposts: {
              select: {
                userId: true,
              },
              where: {
                userId: user?.id,
              }
            },
            Comments: {
              select: {
                userId: true,
              },
              where: {
                userId: user?.id,
              }
            },
            _count: {
              select: {
                Reposts: true,
                Comments: true,
                Hearts: true,
              }
            },
          },
        },
        Parent: {
          select: {
            User: {
              select: {
                id: true,
                nickname: true,
                image: true,
              }
            },
            Images: true,
          },
        },
        _count: {
          select: {
            Reposts: true,
            Comments: true,
            Hearts: true,
          }
        }
      },
      where,
      take: 10,
    });
  }

  async addComment(commentDto: CommentDto, postId: number, user: User, files: Express.Multer.File[]) {
    const original = await this.prismaService.client.post.findUnique({
      where: {postId},
    });
    if (!original) {
      return 'no_such_post';
    }
    const hashtags = commentDto.content.match(/#[^\s#]+/g);
    return this.prismaService.client.post.create({
      select: {
        User: {
          select: {
            image: true,
            id: true,
            nickname: true,
          }
        },
        Parent: {
          select: {
            User: {
              select: {
                image: true,
                id: true,
                nickname: true,
              }
            }
          }
        },
        content: true,
        createdAt: true,
        postId: true,
        Images: true,
      },
      data: {
        content: commentDto.content,
        userId: user.id,
        parentId: postId,
        Images: {
          createMany: {
            data: files?.map((v) => ({
              link: '/' + v.path.replaceAll('\\', '/'),
            })) || [],
          },
        },
        Hashtags: {
          connectOrCreate: hashtags?.map((tag) => ({
            where: {
              title: tag,
            },
            create: {
              title: tag,
            },
          })) || []
        }
      },
    });
  }

  async getImage(postId: number, imageId: number, user: User) {
    const original = await this.prismaService.client.post.findUnique({
      where: {postId},
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
