import { Module } from '@nestjs/common';
import { ObservationService } from './observation.service';

@Module({
  providers: [{ provide: 'ObservationService', useClass: ObservationService }],
  exports: ['ObservationService'],
})
export class ObservationModule {}