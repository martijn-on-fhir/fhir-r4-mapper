import { Module } from '@nestjs/common';
import { RiskAssessmentService } from './risk-assessment.service';

@Module({
  providers: [{ provide: 'RiskAssessmentService', useClass: RiskAssessmentService }],
  exports: ['RiskAssessmentService'],
})
export class RiskAssessmentModule {}
