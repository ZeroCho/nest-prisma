import {Test, TestingModule} from '@nestjs/testing';
import {UsersController} from './users.controller';
import {UsersService} from './users.service';
import {ForbiddenException} from "@nestjs/common";
import {CustomPrismaModule} from "nestjs-prisma";
import {extendedPrismaClient} from "../../prisma.extension";
import {PostsService} from "../posts/posts.service";
import {MessagesService} from "../messages/messages.service";

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CustomPrismaModule.forRootAsync({
          name: 'PrismaService',
          isGlobal: true,
          useFactory: () => {
            return extendedPrismaClient;
          },
        }),
      ],
      controllers: [UsersController],
      providers: [UsersService, PostsService, MessagesService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get(UsersService);
  });

  describe('create', () => {
    test('서비스가 already_exist를 반환하면 ForbiddenException을 throw한다', async () => {
      jest.spyOn(service, 'create').mockResolvedValue('already_exist');
      try {
        await controller.create({
          id: 'id',
          nickname: 'nickname',
          password: 'password',
        }, {} as any);
      } catch (err) {
        expect(err).toStrictEqual(new ForbiddenException('already_exist'));
      }
    })

    test('서비스가 유저 정보를 반환하면 그대로 반환한다', async () => {
      jest.spyOn(service, 'create').mockResolvedValue({ id: 'id' } as any );
      try {
        const result = await controller.create({
          id: 'id',
          nickname: 'nickname',
          password: 'password',
        }, {} as any);
        expect(result).toStrictEqual({ id: 'id' });
      } catch (err) {}
    })
  })

  describe('getFollowRecommends', () => {
    jest.spyOn(service, 'getFollowRecommends').mockResolvedValue([{}] as any)
    return expect(controller.getFollowRecommends({ id: 'id' })).resolves.toStrictEqual([{}]);
  });
});
