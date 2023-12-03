import {Inject, Injectable} from '@nestjs/common';
import {CreateMessageDto} from './dto/create-message.dto';
import {UpdateMessageDto} from './dto/update-message.dto';
import {CustomPrismaService} from "nestjs-prisma";
import {ExtendedPrismaClient} from "../../prisma.extension";
import {Prisma} from "@prisma/client";
import {mockProviders} from "next-auth/client/__tests__/helpers/mocks";
import id = mockProviders.github.id;

@Injectable()
export class MessagesService {
  constructor(
    @Inject('PrismaService')
    private prismaService: CustomPrismaService<ExtendedPrismaClient>,
  ) {
  }

  create(createMessageDto: CreateMessageDto) {
    const ids = [createMessageDto.senderId, createMessageDto.receiverId]
    ids.sort();
    return this.prismaService.client.message.create({
      data: {
        content: createMessageDto.content,
        senderId: createMessageDto.senderId,
        receiverId: createMessageDto.receiverId,
        room: ids.join('-')
      }
    });
  }

  findAll() {
    return `This action returns all hashtags`;
  }

  getRooms(id: string) {
    return this.prismaService.client.message.findMany({
      distinct: ['room'],
      where: {
        OR: [
          {
            room: {
              startsWith: `${id}-`
            },
          },
          {
            room: {
              endsWith: `-${id}`
            },
          },
        ],
      },
      include: {
        Receiver: true,
        Sender: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 30,
    });
  }

  async getRoomMessage(id: string, cursor: number) {
    const where: Prisma.MessageWhereInput = cursor ? {room: id, messageId: {lt: cursor}} : {room: id};
    const result = await this.prismaService.client.message.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });
    return result.toReversed();
  }

  findOne(id: number) {
    return `This action returns a #${id} hashtag`;
  }

  update(id: number, updateHashtagDto: UpdateMessageDto) {
    return `This action updates a #${id} hashtag`;
  }

  remove(id: number) {
    return `This action removes a #${id} hashtag`;
  }
}
