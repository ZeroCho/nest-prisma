import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from '../../prisma.extension';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @Inject('PrismaService')
    private prismaService: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  async create(createUserDto: CreateUserDto, file: Express.Multer.File) {
    const exUser = await this.prismaService.client.user.findFirst({
      where: { id: createUserDto.id },
    });
    if (exUser) {
      return 'already_exist';
    }
    console.log('file', file);
    return this.prismaService.client.user.create({
      select: {
        password: false,
      },
      data: {
        id: createUserDto.id,
        nickname: createUserDto.nickname,
        image: file.path,
        password: await bcrypt.hash(createUserDto.password, 12),
      },
    });
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: string) {
    return this.prismaService.client.user.findUnique({
      where: {
        id,
      },
    });
  }

  getFollowRecommends() {
    // TODO: 팔로워 가장 많은 3명
    return this.prismaService.client.user.findMany({
      skip: 0,
      take: 3,
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
