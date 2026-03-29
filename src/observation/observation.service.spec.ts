import { Test, TestingModule } from '@nestjs/testing';
import { ObservationService } from './observation.service';
import { TerminologyService } from '../services/terminology/terminology.service';

describe('ObservationService', () => {
  let service: ObservationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ObservationService,
        { provide: TerminologyService, useValue: {} },
      ],
    }).compile();

    service = module.get<ObservationService>(ObservationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
