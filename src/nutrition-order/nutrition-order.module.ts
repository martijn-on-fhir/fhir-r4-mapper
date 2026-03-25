import { Module } from '@nestjs/common';
import { NutritionOrderService } from './nutrition-order.service';

@Module({
  providers: [{ provide: 'NutritionOrderService', useClass: NutritionOrderService }],
  exports: ['NutritionOrderService'],
})
export class NutritionOrderModule {}
