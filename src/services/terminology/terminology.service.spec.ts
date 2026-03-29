import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { getQueueToken } from '@nestjs/bullmq';
import { TerminologyService } from './terminology.service';

describe('TerminologyService', () => {
  let service: TerminologyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TerminologyService,
        { provide: CACHE_MANAGER, useValue: { get: jest.fn(), set: jest.fn() } },
        { provide: getQueueToken('terminology'), useValue: { add: jest.fn() } },
      ],
    }).compile();

    service = module.get<TerminologyService>(TerminologyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
