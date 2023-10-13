import { Test, TestingModule } from '@nestjs/testing';
import { HashtagsController } from './hashtags.controller';
import { HashtagsService } from './hashtags.service';

describe('HashtagsController', () => {
  let controller: HashtagsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HashtagsController],
      providers: [HashtagsService],
    }).compile();

    controller = module.get<HashtagsController>(HashtagsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
