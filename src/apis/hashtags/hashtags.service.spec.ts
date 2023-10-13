import { Test, TestingModule } from '@nestjs/testing';
import { HashtagsService } from './hashtags.service';

describe('HashtagsService', () => {
  let service: HashtagsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HashtagsService],
    }).compile();

    service = module.get<HashtagsService>(HashtagsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
