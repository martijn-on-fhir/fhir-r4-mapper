import { Test, TestingModule } from '@nestjs/testing';
import { NutritionOrderService } from './nutrition-order.service';

describe('NutritionOrderService', () => {
  let service: NutritionOrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NutritionOrderService],
    }).compile();

    service = module.get<NutritionOrderService>(NutritionOrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
