import {Test, TestingModule} from '@nestjs/testing';
import {AppController} from './app.controller';
import {AppService} from './app.service';

jest.mock('./app.service', () => {
  class MockAppService {
    getHello() {
      return 'abc'
    }
  }
  return { AppService: MockAppService };
})
describe('AppController without module', () => {
  const controller = new AppController(new AppService())
  describe('getHello', () => {
    test('getHello가 Hello World!를 반환해야 한다', () => {
      expect(controller.getHello()).toBe('abc');
    });
  });
});

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get(AppController);
    appService = app.get(AppService);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      jest.spyOn(appService, 'getHello').mockReturnValue('abc');
      expect(appController.getHello()).toBe('abc');
    });
  });
});

afterEach(() => {
  jest.restoreAllMocks();
})