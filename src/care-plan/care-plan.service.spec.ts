import { Test, TestingModule } from '@nestjs/testing';
import { CarePlanService } from './care-plan.service';

describe('CarePlanService', () => {
  let service: CarePlanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CarePlanService],
    }).compile();

    service = module.get<CarePlanService>(CarePlanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});