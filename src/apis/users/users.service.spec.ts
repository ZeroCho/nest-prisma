import {Test, TestingModule} from '@nestjs/testing';
import {UsersService} from './users.service';
import {CustomPrismaModule, CustomPrismaService} from "nestjs-prisma";
import {extendedPrismaClient, ExtendedPrismaClient} from "../../prisma.extension";

jest.mock('bcrypt', () => {
  return {
    async hash() {
      return 'hashed'
    }
  }
})

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: CustomPrismaService<ExtendedPrismaClient>;

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
      providers: [UsersService],
    }).compile();

    service = module.get(UsersService);
    prismaService = module.get<CustomPrismaService<ExtendedPrismaClient>>('PrismaService');
  });

  describe('create', () => {
    test('기존 회원이 있으면 already_exist를 반환해야 한다', async () => {
      jest.spyOn(prismaService.client.user, 'findFirst').mockResolvedValue({} as any);
      const result = await service.create({
        id: 'id',
        nickname: 'nickname',
        password: 'password',
      }, {} as any);
      expect(result).toBe('already_exist');
    });
    test('기존 회원이 없으면 user.create를 호출해야 한다', async () => {
      jest.spyOn(prismaService.client.user, 'findFirst').mockResolvedValue(null);
      const fn = jest.spyOn(prismaService.client.user, 'create').mockResolvedValue({} as any);
      const result = await service.create({
        id: 'id',
        nickname: 'nickname',
        password: 'password',
      }, {
        path: 'folder\\abc.png',
      } as any);
      expect(fn.mock.calls[0][0].data).toStrictEqual({
        id: 'id',
        nickname: 'nickname',
        image: `/folder/abc.png`,
        password: 'hashed',
      });
      expect(result).toStrictEqual({});
    });
  })
});

afterEach(() => {
  jest.restoreAllMocks();
})