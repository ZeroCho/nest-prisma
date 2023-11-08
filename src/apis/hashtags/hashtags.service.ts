import {Inject, Injectable} from '@nestjs/common';
import { CreateHashtagDto } from './dto/create-hashtag.dto';
import { UpdateHashtagDto } from './dto/update-hashtag.dto';
import {CustomPrismaService} from "nestjs-prisma";
import {ExtendedPrismaClient} from "../../prisma.extension";

@Injectable()
export class HashtagsService {
  constructor(
    @Inject('PrismaService')
    private prismaService: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  create(createHashtagDto: CreateHashtagDto) {
    return 'This action adds a new hashtag';
  }

  findAll() {
    return `This action returns all hashtags`;
  }

  async getTrends() {
    const top10 = await this.prismaService.client.hashtag.findMany({
      take: 10,
      include: {
        _count: {
          select: {
            Posts: true,
          },
        },
      },
      orderBy: {
        Posts: {
          _count: 'desc',
        }
      }
    });
    console.log(top10);
    return top10.map((v) => ({
      title: v.title,
      count: v._count.Posts,
    }))
  }

  findOne(id: number) {
    return `This action returns a #${id} hashtag`;
  }

  update(id: number, updateHashtagDto: UpdateHashtagDto) {
    return `This action updates a #${id} hashtag`;
  }

  remove(id: number) {
    return `This action removes a #${id} hashtag`;
  }
}
