import { Module } from '@nestjs/common';
import { CarePlanService } from './care-plan.service';

@Module({
  providers: [{ provide: 'CarePlanService', useClass: CarePlanService }],
  exports: ['CarePlanService'],
})
export class CarePlanModule {}