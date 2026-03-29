import { Test, TestingModule } from '@nestjs/testing';
import { RelatedPersonService } from './related-person.service';

describe('RelatedPersonService', () => {
  let service: RelatedPersonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RelatedPersonService],
    }).compile();

    service = module.get<RelatedPersonService>(RelatedPersonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
