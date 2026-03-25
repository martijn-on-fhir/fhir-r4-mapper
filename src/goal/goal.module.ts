import { Module } from '@nestjs/common';
import { GoalService } from './goal.service';

@Module({
  providers: [{ provide: 'GoalService', useClass: GoalService }],
  exports: ['GoalService'],
})
export class GoalModule {}